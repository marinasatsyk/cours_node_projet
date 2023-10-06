import  {validate as validateEmail} from 'email-validator';
import bcrypt from "bcrypt";
import { UserModel } from '../models/User.js';

const SALTROUNDS = 10;


export  function SignUpController(req, res) 
{

    res.render('signup');
}


export async  function SignUpPostController(req, res) 
{
   console.log(req.body);
    const {firstName,lastName, email, password, password_confirm } = req.body;
   
    const firstNameModified = firstName.trim().toLowerCase();
    const lastNameModified= lastName.trim().toLowerCase(); 
    const emailModified= email.trim().toLowerCase(); 
    const passwordModified= password.trim().toLowerCase(); 
    const password_confirmModified= password_confirm.trim().toLowerCase();
   
    try{
        //verif if user exists
        const userExist = await UserModel.findOne({email: emailModified});
        console.log("userExist", userExist)
       
        if(userExist){
            req.flash("error", "User already exists");
        }
        //verify fields are not empty
        const firstNameValidated = firstNameModified !== "" ? true : false;
       
        if(!firstName ){
            req.flash("error", "firstName is required");
        }

        const lastNameValidated = lastNameModified !== "" ? true : false;
        if(!firstName ){
            req.flash("error", "lastName is  required");
        }


        if(passwordModified === ""){
            req.flash("error", "password is required");
        }

        if(password_confirmModified === ""){
            req.flash("error", "password confirm is required");
        }

        //verif password == confirm password && 
        
        const passwordValidated = passwordModified === password_confirmModified ? true : false;
        
        console.log("passwordValidated", passwordValidated)

        if(!passwordValidated){
           req.flash("error", "password and confirmed password are note the same");
        }

        //check mail
        const emailValidated = validateEmail(emailModified);  
        console.log("emailValidated", emailValidated)

        if(!emailValidated){
            req.flash("error", "email invalide");
        }

        
        if(!userExist &&  passwordValidated &&  emailValidated && firstNameValidated && lastNameValidated){
            //create new user
            const hash = await bcrypt.hash(passwordModified, SALTROUNDS);
            console.log(passwordModified, hash)

            const userData = {
                firstName: firstNameModified,
                lastName: lastNameModified,
                email: emailModified,
                password: hash
            }

            UserModel.create(userData);
            console.log("db inserted", userData);

            //redirect to login
            res.redirect('/signin')
        } else {
            res.redirect("/signup");
        }

    }catch(err){
       res.status(500).send(`<h1>Erreur 500</h1><p>${err.message}</p>`)
    }
}


export  function SignInController(req, res) 
{
    res.render('signin');
}


export async  function SignInPostController(req, res) 
{

    const {email, password} = req.body;

    //transform mail, password
    const emailModified= email.trim().toLowerCase(); 
    const passwordModified= password.trim().toLowerCase(); 
    
    try{
    //verify is email valid
        const emailValidated = validateEmail(emailModified);  
    
        if(!emailValidated){
            req.flash("error", "Email incorrect");
        }

        const userExist = await UserModel.findOne({email: email});
        if(!userExist) {
            req.flash("error", "User doesn't exist. Register first");
            res.redirect('/signin');
    
        }else{
            //verify is password  is correct
            const compare = await bcrypt.compare(passwordModified, userExist.password);
            console.log("compare", compare)
    
            if(compare) {
                req.session.user = {
                    firstName: userExist.firstName,
                    lastName: userExist.lastName,
                    email: email,
                }
                req.flash('success', 'You are connected.');
                res.redirect('/')
            }else{
                req.flash("error", "Credentials error");
                res.redirect('/signin');
            }
        }
    }catch(err){
        res.status(500).send(`<h1>Erreur 500</h1><p>${err.message}</p>`)

    }
}



export function LogoutController(req, res){
    console.log("logout")

    req.session.destroy((err) => {
        if(err){
            res.status(500).send(err.message);
            return
        }
        res.redirect('/signin')
    })
}



  
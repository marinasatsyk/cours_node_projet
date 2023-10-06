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
            throw new Error("User already exists");
        }

        //verif password == confirm password
        const passwordValidated = passwordModified === password_confirmModified ? true : false;
        
        console.log("passwordValidated", passwordValidated)

        if(!passwordValidated){
           throw new Error("password and confirmed password are note the same");
        }

        //check mail
        const emailValidated = validateEmail(emailModified);  
        console.log("emailValidated", emailValidated)

        if(!emailValidated){
            throw new Error("email invalide");
        }

        const firstNameValidated = firstNameModified !== "" ? true : false;
        if(!firstName ){
            throw new Error("firstName is required");
        }
        const lastNameValidated = lastNameModified !== "" ? true : false;
        if(!firstName ){
            throw new Error("lastName is  required");
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
        }

    }catch(err){
        res.status(400).send(`<h1>${err.message}</h1>`);
        return
    }
}


export  function SignInController(req, res) 
{
    res.render('signin');
}


export async  function SignInPostController(req, res) 
{
    console.log(req.body);

    const {email, password} = req.body;

    //transform mail, password
    const emailModified= email.trim().toLowerCase(); 
    const passwordModified= password.trim().toLowerCase(); 
    
    //verify is email valid
    const emailValidated = validateEmail(req.body.email);  
    if(!emailValidated){
        res.status(401).json({err: "Email incorrect"});
        return
    }

    //verif if user exists
    const userExist = await UserModel.findOne({email: email});
    if(!userExist) {
        res.status(401).json({err: "User doesn't exist"});
    }

    //verify is password  is correct
    const compare = await bcrypt.compare(passwordModified, userExist.password);
    console.log("compare", compare)

    if(compare) {
        req.session.user = {
            firstName: userExist.firstName,
            lastName: userExist.lastName,
            email: email,
        }
        req. flash('success', 'You are connected.');
        res.redirect('/')
    }
}



export function LogoutController(req, res){
    console.log("logout")

    req.session.destroy((err) => {
        if(err){
            res.status(500).send(err.message);
            return
        }
        req. flash('success', 'You are now logged out.');
        res.redirect('/signin')
    })
}



  
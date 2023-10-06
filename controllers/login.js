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

       
        //create new user
        const hash = await bcrypt.hash(passwordModified, SALTROUNDS);
        console.log(passwordModified)
        console.log(hash)


        const userData = {
            firstName: firstNameModified,
            lastName: lastNameModified,
            email: emailModified,
            password: hash
        }

        console.log("userData", userData)
         UserModel.create(userData);
        // console.log("db inserted");

        // create the session
       
        req.session.user = {
            firstName: firstNameModified,
            lastName: lastNameModified,
            email: emailModified,
        }
        //redirect to dashboard
        res.redirect('/')
        // res.send(userData)

    }catch(err){
        res.status(400).send(`<h1>${err.message}</h1>`);
        return
    }
}


export  function SignInController(req, res) 
{
    res.render('signin');
}


export  function SignInPostController(req, res) 
{
    res.redirect('/')
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



  
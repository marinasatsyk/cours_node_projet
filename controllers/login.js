import  {validate as validateEmail} from 'email-validator';


export  function SignUpController(req, res) 
{
    res.render('signup');
}


export  function SignUpPostController(req, res) 
{
   console.log(req.body);
    res.redirect('/')
}


export  function SignInController(req, res) 
{
    res.render('signin');
}


export  function SignInPostController(req, res) 
{
    res.redirect('/')
}



  
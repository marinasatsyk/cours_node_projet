export function setTemplateVars(req, res, next)  {
    res.locals.user = req.session?.user ?? null
    next()
}



export function authGuard(req, res, next){
   console.log("SESSION", req.session)
    if(!req.session?.user){
        console.log("not athorized")
        res.redirect('/signup')
        return
    }
    next()
}
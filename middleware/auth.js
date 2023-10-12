const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const checkToken = (req,res,next)=>{
    console.log('requested cookies  from auth')

    let requestCookies = req.cookies
    req.admin = false;
    
    if(!requestCookies){
        console.log('No cookies present, cannot access this resource.')
        req.verified = false
        next()
        return
    }
    let token = requestCookies.jwt
    
    if(token == undefined){
        req.verified = false
        next()
        return
    }
    let isAdmin = requestCookies.isAdmin
    if(isAdmin){
        jwt.verify(token, process.env.REFRESH_TOKEN, (err, payload)=>{
            if(err){
                console.log('could not verify token')
                console.log(err)
                req.verified = false
                next()
                return 
            } else {
            console.log('token verified, user is admin and has access to resource')
            req.verified = true
            req.isAdmin = true
            req.payload = payload}
        })
    } else{
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload)=>{
        if(err){
            console.log('could not verify token')
            console.log(err)
            req.verified = false
            
            next()
            return 
        } else {
        console.log('token verified, user has access to resource')
        req.verified = true
        req.payload = payload}
    })}
    next()
}



module.exports = checkToken
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const checkToken = (req,res,next)=>{
    console.log('requested cookies  from auth')

    let requestCookies = req.headers.cookie
    
    console.log(requestCookies)
    req.admin = false;
    
    if(!requestCookies){
        console.log('No cookies present, cannot access this resource.')
        req.verified = false
        next()
        return
    }
    let cookies = requestCookies.split('; ')
    let userName = cookies ?? cookies.find((item)=>{return item.startsWith('userName')})
    let userNameVal = userName ?? userName.split('=')[1]
    let token = cookies.find((item)=>{return item.startsWith('jwt')})
    let tokenVal = token.split('=')[1]
    let isLoggedIn = cookies ?? cookies.find((item)=>{return item.startsWith('isLoggedIn')})
    let loggedInVal = isLoggedIn ?? isLoggedIn.split('=')[1]
    console.log(`token`)
    console.log(tokenVal)
    let admin = cookies.find((item)=>{return item.startsWith('isAdmin')})
    let adminVal = admin ? admin.split('=')[1] : false
    
    if(tokenVal == undefined){
        req.verified = false
        next()
        return
    }
  
    if(adminVal){
        jwt.verify(tokenVal, process.env.REFRESH_TOKEN, (err, payload)=>{
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
    jwt.verify(tokenVal, process.env.ACCESS_TOKEN, (err, payload)=>{
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
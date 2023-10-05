const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const checkToken = (req,res,next)=>{
    console.log(req)
    let authHeader = req.headers['Authorization']
    let secondHeader = req.get('authorization')
    console.log('this is the second header')
    console.log(secondHeader)
    
    if(!secondHeader){
        console.log('No auth header present, cannot access this resource.')
        req.verified = false
    }
    let token = secondHeader && secondHeader.split(' ')[1]
    if(token == undefined){
        req.verified = false
    }
    console.log(token)



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
    })
    next()
}

module.exports = checkToken
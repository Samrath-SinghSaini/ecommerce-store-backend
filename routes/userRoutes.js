const express = require('express')
const router = express.Router()
let bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({extended:true}))

function callBackFunc (){
    console.log("Mai callback kardunga saale")
}
router.get('/user', (req,res, next)=>{
    res.json({name:"name", lastName:"lastName"})
    next()
})

router.post('/user', (req,res)=>{
    console.log("Post achieved")
    console.log(JSON.parse(req.body))
    res.send("Received")
})

router.post('/user/login', (req,res)=>{
    console.log("Login post received")
    console.log(req.body)
    res.send("<h1>Received login</h1>")
})
module.exports = router
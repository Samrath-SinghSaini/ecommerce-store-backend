import mongoose from "mongoose";
let userSchema = require('./userSchema')

let User = new mongoose.model('User', userSchema)
async function addUser(newUserObj){
    User.create(newUserObj)
    .then((res)=>{console.log("User has been created")
    })
    .catch((err)=>{
        console.log("Could not create user due to an err")
        console.log(err)
    })
}
async function findUser(username){
    User.find({username:username})
}
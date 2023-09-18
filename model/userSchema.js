import Mongoose from 'mongoose'

const user = new Mongoose.Schema({
    email:String, 
    userName:String, 
    password:String, 
    fullName:String, 
    rating:Number
})
export default user;
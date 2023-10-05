const Mongoose = require('mongoose')

const userSchema = new Mongoose.Schema({
    email:{type:String, required:true}, 
    userName:{type:String, required:true}, 
    password:{type:String, required:true}, 
    fullName:{type:String, required:true}, 
    rating:Number, 
    wishlistItem: [{ref:'Products', type:Mongoose.Types.ObjectId}], 
    cart:[{type:Mongoose.Types.ObjectId}]
})

const userModel = Mongoose.model('User',userSchema)
module.exports = userModel
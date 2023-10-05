const Mongoose = require('mongoose')

const productSchema = new Mongoose.Schema({
    _id:Mongoose.Types.ObjectId,
    name:String, 
    price:Mongoose.Decimal128,
    brand:String, 
    category_id:{ref:'Category', type:Mongoose.Schema.Types.ObjectId},
    category:String,
    stock:Number,
    image:String,
    description:String
});

const productModel = Mongoose.model('Product', productSchema)
module.exports = {productModel}
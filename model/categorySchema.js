const Mongoose = require('mongoose')

const categorySchema = new Mongoose.Schema({
    name:String, 
    description:String
})
const categoryModel = Mongoose.model('Category', categorySchema)
module.exports = {categoryModel}
const Mongoose = require('mongoose')
const {productModel} = require('./productSchema')


// let id = new Mongoose.Types.ObjectId()
// let sampleProduct = new productModel({
//     _id:id,
//     name:"Product 1", 
//     price:14000.00, 
//     brand:'Nike', 
//     stock:52,
//     image:id, 
//     description:"This is the first product"
// })

async function newProduct(product){
    const save = await product.save();
    
}
async function newCategory(category){
    let returnMessage
    try{
    const saveCategory = await category.save(); 
    returnMessage = 'Successfully created new category : ' + saveCategory
    } catch(err){
    returnMessage = 'Err: could not create new category: ' + err
    }
    return returnMessage; 
}
module.exports = {newProduct, newCategory}
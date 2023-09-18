const express = require('express')
const app = express(); 
const Router = express.Router()
const bodyParser = require('body-parser')
const Mongoose = require('mongoose')
const {productModel} = require('../model/productSchema')
const {newProduct} = require('../model/productQueries')

app.use(bodyParser.urlencoded({extended:false}))

//routes
Router.get('/create', (req,res)=>{
    res.send('<h1>This is the create product page<h1/>')
})

Router.post('/create', (req, res)=>{
    const product = req.body
    console.log(product)
    let model = new productModel(product)
    newProduct(model)
    .then((response)=>{
        res.send(response)
        console.log(response)
        console.log("product saved successfully")
    })
    .catch((err)=>{
        console.log(err)
    })
    
})

Router.get('/fetch', (req,res)=>{
    productModel.find({})
    .then((response)=>{
        console.log(res)
        res.send(JSON.stringify(response))
    }).catch((err)=>{
        console.log(err)
    })
    
})

module.exports = Router
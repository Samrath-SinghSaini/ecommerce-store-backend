const mongoose = require('mongoose')
const express = require('express')
const app = express()
const Router = express.Router()
const bodyParser = require('body-parser')
const {categoryModel} = require('../model/categorySchema')
const {newCategory} = require('../model/productQueries')
app.use(bodyParser.urlencoded({extended:false}))

//routes
Router.get('/create', (req,res)=>{
    res.send('<h1>This is the create category page')
})

Router.post('/create', (req, res)=>{
    const category = req.body
    const saveCategory = new categoryModel(category)
    newCategory(saveCategory)
    .then((res)=>{
        console.log(res)
    })
    .catch((err)=>{
        console.log(err)
    })
   res.send('/api/category/create has received your data')
})

Router.get('/fetch', (req,res)=>{
    categoryModel.find({})
    .then((response)=>{
        res.send(JSON.stringify(response))
    }).catch((err)=>{
        console.log(err)
    })
    
})


module.exports = Router


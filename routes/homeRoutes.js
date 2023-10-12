const express = require("express");
const app = express();
const Router = express.Router();
const bodyParser = require("body-parser");
const Mongoose = require("mongoose");
const { productModel } = require("../model/productSchema");
const { newProduct } = require("../model/productQueries");
const checkToken = require("../middleware/auth");
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));

Router.get('/best', (req, res)=>{
    productModel
      .find({}).limit(10)
      .then((response) => {
        res.status(200).send(JSON.stringify(response));
      })
      .catch((err) => {
          res.status(503).json({message:'There was an error with your request.', error:err})
      });
  })
  
  Router.get('/discount', (req, res)=>{
    productModel
      .find({price:{$lte:1500}}).limit(10)
      .then((response) => {
        console.log('from home discounts')
        console.log(response)
        res.status(200).send(JSON.stringify(response));
      })
      .catch((err) => {
          res.status(503).json({message:'There was an error with your request.', error:err})
      });
  })

  module.exports = Router
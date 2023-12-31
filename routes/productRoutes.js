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

//routes
Router.get("/create", (req, res) => {
  res.send("<h1>This is the create product page<h1/>");
});

Router.post("/create", (req, res) => {
  if(req.isAdmin === true){
    const product = req.body;
    console.log(product);
    let model = new productModel(product);
    newProduct(model)
      .then((response) => {
        res.status(200).send(response);
        console.log("product saved successfully");
      })
      .catch((err) => {
        console.log(err);
        res.status(501).json({message:'there has been an error', error:err})
      });
  } else{
    res.status(500).json({message:'you cannot access this resource', isAdmin:req.isAdmin})
  }
 
});

//Change the auth method for incoming requests by checking cookies instead of req.verified

Router.get("/fetch",checkToken, (req, res) => {
 
  if (!req.verified) {
    console.log("there was an error with your access token");
    res.status(503).json({message:'You cannot access this resource. Access denied', authenticated:false})
    return
  }

  productModel
    .find({})
    .then((response) => {
      res.status(200).send(JSON.stringify(response));
    })
    .catch((err) => {
        res.status(503).json({message:'There was an error with your request.', error:err})
    });
});


Router.get("/item/:objectId", (req, res) => {
  console.log('received get for item')
  let objectId = req.params.objectId;
  productModel
    .findById(objectId)
    .then((response) => {
      let resObject = {
        _id: response._id,
        name: response.name,
        brand: response.brand,
        category: response.category,
        categoryId: response.category_id,
        stock: response.stock,
        image: response.image,
        price: response.price.toString(),
        description: response.description,
      };
      res.send(JSON.stringify(resObject));
    })
    .catch((err) => {
      console.log(err);
    });
});


module.exports = Router;

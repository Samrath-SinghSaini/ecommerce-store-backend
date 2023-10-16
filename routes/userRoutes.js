const express = require("express");
const app = express();
const router = express.Router();
let bodyParser = require("body-parser");
let userModel = require("../model/userSchema");
const { productModel } = require("../model/productSchema");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let dotEnv = require("dotenv");
let cookieParser = require("cookie-parser");
router.use(cookieParser());
dotEnv.config();
router.use(bodyParser.urlencoded({ extended: true }));
// router.use(express.json)

function callBackFunc() {
  console.log("Mai callback kardunga saale");
}
router.get("/register", (req, res) => {
  res.json({ name: "name", lastName: "lastName" });
});

router.post("/user/test", (req, res) => {
  console.log(req.body);
  res.status(501).json({ message: "received" });
});
router.post("/register", async (req, res) => {
  console.log(req.body);
  let saltRounds = 10;
  let password = req.body.password;
  userModel.findOne({ userName: req.body.username }).then((response) => {
    console.log("usermodel response");
    console.log(response);
    if (response == null) {
      let salt = bcrypt.genSaltSync(saltRounds);
      let hash = bcrypt.hashSync(password, salt);
      let userData = {
        email: req.body.email,
        userName: req.body.username,
        password: hash,
        fullName: req.body.fullname,
      };
      console.log(userData);
      userModel
        .create(userData)
        .then((response) => {
          console.log(response);
          res.status(200).json({
            registered: true,
            message: "User has been successfully saved to db",
            user: response,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(501).json({
            registered: false,
            error: err,
            message: "User could not be saved1",
          });
        });
    } else if (response != null) {
      res
        .status(504)
        .json({ registered: false, message: "User already exists" });
    }
  });
});

router.post("/login", async (req, response) => {
  console.log("received login request");
  let username = req.body.username;
  userModel.findOne({ userName: username }).then((res) => {
    if (res == null) {
      console.log("user not found ");
      console.log(res);
      response.status(501).json({
        authenticated: false,
        message: "User not found. Create new account.",
      });
    } else {
      console.log("user found");
      console.log(res);
      bcrypt.compare(req.body.password, res.password, (err, result) => {
        if (err) {
          console.log(err);
          response.cookie("isLoggedIn", false).status(501).json({
            authenticated: false,
            message: "An error occurred in login",
          });
        }
        if (result) {
          console.log("user is authenticated");
          let userInfo = {
            userID: res._id,
            email: res.email,
            fullName: res.fullName,
            wishlistItem: res.wishlistItem,
            cart: res.cart,
          };
          let token = null;
          if (res.userName === "admin") {
            let secretKey = process.env.REFRESH_TOKEN
            console.log(`username :${res.userName} and secret key is: `)
            
            token = jwt.sign({userInfo:userInfo}, secretKey, {expiresIn:'1h'})
            
            response
              .status(200)
              .cookie("isLoggedIn", true, {
                maxAge: 60000,
              })
              .cookie("isAdmin", true, { maxAge: 300000 })
              .cookie("jwt", token, {
                httpOnly: true,
                maxAge: 300000,
              })
              .cookie("userName", res._id, {maxAge:300000})
              .json({
                authenticated: true,
                message: "Passwords match, user is admin and is authenticated",
                isAdmin:true, 
                userInfo:userInfo
              });
          } else {
            token = jwt.sign({ userInfo: userInfo }, process.env.ACCESS_TOKEN, {
              expiresIn: "1h",
            });

            response
              .status(200)
              .cookie("isLoggedIn", true, {
                maxAge: 60000,
              })
              .cookie("jwt", token, {
                httpOnly: true,
                maxAge: 300000,
              })
              .cookie("userName", res.userName, {maxAge:300000})
              .json({
                authenticated: true,
                message: "Passwords match, user is authenticated",
                userInfo:userInfo
              });
          }
        } else {
          response.status(501).cookie("isLoggedIn", false).json({
            authenticated: false,
            message: "Incorrect password, please try again.",
          });
        }
      });
    }
  });
});

router.get("/logout", (req, res) => {
  console.log("logout request received");
  res.clearCookie("jwt");
  res.clearCookie("isLoggedIn");
  res.clearCookie("isAdmin")
  res.clearCookie('userName')
  res.json({ status: 201, message: "request received, clearing cookies" });
});

router.post("/wishlist", (req, res)=>{
  let itemId = req.objectId
  console.log('wishlist post received')
  console.log(req.body)
  if(req.body.operation === 'add'){
    userModel.findOneAndUpdate({userName:req.body.userName}, {$addToSet:{wishlistItem:req.body.productId}})
    .then((response)=>{console.log(response)})
    .catch((err)=>{console.log(err)})
  } else if(req.body.operation === 'remove'){
    userModel.findOneAndUpdate({userName:req.body.userName}, {$pull:{wishlistItem:req.body.productId}})
    .then((response)=>{console.log(response)})
    .catch((err)=>{console.log(err)})
  }
  res.status(201).json({message:'Request received'})
})

router.get("/wishlist",async (req,res)=>{
  let userName = req.query.userName
  if(userName){
    let wishListRes = await userModel.find({userName:userName}, {password:0})
    let wishListProducts = await productModel.find({_id:{$in:wishListRes[0].wishlistItem}})
    res.status(200).json({wishListArr:wishListProducts, message:'received wishlist get request'})
  }
  else{
    res.status(500).json({wishListArr:null,message:'No username provided' })
  }

})

router.post("/cart", (req, res)=>{
  let itemId = req.objectId
  console.log('cart post received')
  console.log(req.body)
  if(req.body.operation === 'add'){
    userModel.findOneAndUpdate({userName:req.body.userName}, {$addToSet:{cart:req.body.productId}})
    .then((response)=>{console.log(response)})
    .catch((err)=>{console.log(err)})
  } else if(req.body.operation === 'remove'){
    userModel.findOneAndUpdate({userName:req.body.userName}, {$pull:{cart:req.body.productId}})
    .then((response)=>{console.log(response)})
    .catch((err)=>{console.log(err)})
  }
  res.status(201).json({message:'Request received'})
})

router.get("/cart",async (req,res)=>{
  let userName = req.query.userName
  if(userName){
    let cartRes = await userModel.find({userName:userName}, {password:0})
    let cartProducts = await productModel.find({_id:{$in:cartRes[0].cart}})
    res.status(200).json({cartArr:cartProducts, message:'received cart get request'})
  }
  else{
    res.status(500).json({cartArr:null,message:'No username provided' })
  }

})
module.exports = router;

// router.post("/user/register", async (req, res) => {
//   console.log(req.body);

//   hashPassword(req.password)
//   .then((response)=>{
//    let hash = response
//    console.log(hash)
//   if (hash == null) {
//     res.status(500).json({
//       registered: false,
//       message: "There has been a problem, try again later",
//     });
//   } else {

//   let userData = {
//     email: req.body.email,
//     userName: req.body.username,
//     password: hash,
//     fullName: req.body.fullname,
//   };
//   console.log(userData);
//   userModel
//     .create(userData)
//     .then((response) => {
//       console.log(response);
//       res.status(200).json({
//         registered: true,
//         message: "User has been successfully saved to db",
//         user: response,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(501).json({
//         registered: false,
//         error: err,
//         message: "User could not be saved1",
//       });
//     });}
//   })

// });
// async function hashPassword(password) {
//   let saltRounds = 10;

//   bcrypt.genSalt(saltRounds, (err, salt) => {
//     if (err) {
//       console.log(err);
//       return null
//     } else {
//       bcrypt.hash(password, salt, (err, hash) => {
//         if (err) {
//           console.log(err)
//           return null
//         } else {
//           return hash
//         }
//       });
//     }
//   });
// }

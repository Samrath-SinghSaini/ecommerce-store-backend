const express = require("express");
const app = express();
const router = express.Router();
let bodyParser = require("body-parser");
let userModel = require("../model/userSchema");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let dotEnv = require("dotenv");
let cookieParser = require('cookie-parser')
router.use(cookieParser())
dotEnv.config();
router.use(bodyParser.urlencoded({ extended: true }));
// router.use(express.json)

function callBackFunc() {
  console.log("Mai callback kardunga saale");
}
router.get("/user/register", (req, res) => {
  res.json({ name: "name", lastName: "lastName" });
});

router.post("/user/test", (req, res) => {
  console.log(req.body);
  res.status(501).json({ message: "received" });
});
router.post("/user/register", async (req, res) => {
  console.log(req.body);
  let saltRounds = 10;
  let password = req.body.password;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      console.log("could not generate salt");
      res
        .status(500)
        .json({
          registered: false,
          message: "There has been a problem, try again later",
        });
    } else {
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          res
            .status(500)
            .json({
              registered: false,
              error: err,
              message: "User could not be saved",
            });
        } else {
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
              res
                .status(200)
                .json({
                  registered: true,
                  message: "User has been successfully saved to db",
                  user: response,
                });
            })
            .catch((err) => {
              console.log(err);
              res
                .status(501)
                .json({
                  registered: false,
                  error: err,
                  message: "User could not be saved1",
                });
            });
        }
      });
    }
  });
});

router.post("/user/login", async (req, response) => {
  console.log("received login request");
  let username = req.body.username;
  userModel.findOne({ userName: username }).then((res) => {
    if (res == null) {
      console.log("user not found ");
      console.log(res);
      response
        .status(501)
        .json({
          authenticated: false,
          message: "User not found. Create new account.",
        });
    } else {
      console.log("user found");
      console.log(res);
      bcrypt.compare(req.body.password, res.password, (err, result) => {
        if (err) {
          console.log(err);
          response
            .cookie('logInState', false,{

            })
            .status(501)
            .json({
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
          let token = jwt.sign(
            { userInfo: userInfo },
            process.env.ACCESS_TOKEN,
            { expiresIn: "1h" }
          );
          response
            .status(200)
            .cookie('isLoggedIn',false,{
                maxAge:60000
            })
            .cookie('jwt', token, {
                httpOnly:true, 
                maxAge:300000
            })
            .json({
              authenticated: true,
              message: "Passwords match, user is authenticated",
              token: token,
            });
        } else {
          response
            .status(501)
            .json({
              authenticated: false,
              message: "Incorrect password, please try again.",
            });
        }
      });
    }
  });
});

router.get('/user/logout', (req,res)=>{
    console.log('logout request received')
    res.clearCookie('jwt')
    res.json({status:201, message:'request received, clearing cookies'})
})
module.exports = router;

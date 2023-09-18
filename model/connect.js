const Mongoose = require("mongoose");

async function dbConnect(){
    await Mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
    .then((res)=>{console.log("Connected to database")})
    .catch((err)=>{
        console.log("Error: Could not establish a connection to the database")
        console.log('\n' + err)
    })
}

 module.exports = {dbConnect}; 
const Mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config()

async function dbConnect(){
    await Mongoose.connect(process.env.CONNECTION_STRING)
    .then((res)=>{console.log("Connected to database")})
    .catch((err)=>{
        console.log("Error: Could not establish a connection to the database")
        console.log('\n' + err)
    })
}

 module.exports = {dbConnect}; 
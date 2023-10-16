let express = require('express')
let app = express()
let bodyParser = require('body-parser')

let userRoute = require('./routes/userRoutes')
let productRoute = require('./routes/productRoutes')
let categoryRoute = require('./routes/categoryRoutes')
let homeRoute = require('./routes/homeRoutes')
let Mongoose = require('mongoose')
const {dbConnect} = require('./model/connect')
const {productModel} = require('./model/productSchema');
const productQueries = require('./model/productQueries')



app.use(bodyParser.urlencoded({extended:true}))
app.use('/api/user', userRoute)
app.use('/api/products', productRoute)
app.use('/api/home', homeRoute)
app.use('/api/category', categoryRoute)
app.use('/images',express.static('./public/assets'))
try{
dbConnect()}
catch(err){console.log(err)
}
  

app.get('/', (req, res)=>{
    res.status(200).json({message:'You are now connected to ecommerce website backend'}).send('<h1>This is the backend API for an ecommerce app built by Samrath <h1/>')
   
})
app.post('/', (req,res)=>{
    console.log(req); 
})

let PORT = '3000'; 
app.listen(PORT, ()=>{
    console.log("Server started on " + PORT)
})




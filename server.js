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
    res.status(200).json({message:'You are now connected to ecommerce website backend'})
   
})
app.post('/', (req,res)=>{
    console.log(req); 
})

let PORT = '3000'; 
app.listen(PORT, (err)=>{
    if(err){console.log(err)}
    console.log('server started on port ' + PORT)
})




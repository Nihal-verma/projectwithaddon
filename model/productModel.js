const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productImage:{
       type:Array
    
    },
    description:{
        type:String,
        required:true
    },
    pdf:{
        type:String
     
    },
    front_image:{
        type:String
    }
})
const productData = new mongoose.model("productData",productSchema)
module.exports = productData
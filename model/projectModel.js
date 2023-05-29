const mongoose = require("mongoose")
const dataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    
})
const data = new mongoose.model("data",dataSchema)
module.exports= data;
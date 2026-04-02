const { Decimal128 } = require('bson')
const mongoose = require('mongoose')

const userSchema =  new mongoose.Schema({
    username : {
        type : String,
        required: true,
    },

    email : {
        type: String,
        require:true,
        unique : true
    },

    password : {
        type : String,
        required : true
    },

    balance: {
        type : Decimal128,
        default: 0
    }
},{timestamps:true})

module.exports = mongoose.model('user',userSchema)
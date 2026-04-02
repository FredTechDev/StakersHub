const mongoose = require('mongoose')
const MONGO_URI =  'mongodb://localhost:27017/stakersdb'

const connectdb = async () =>{
    try{
        await mongoose.connect(MONGO_URI)
        console.log("database connected successfully")
    }catch(error){
        console.log("Failed to connect to db",error)
    }
}

module.exports = {connectdb}
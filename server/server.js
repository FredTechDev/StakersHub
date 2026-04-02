const express = require('express')
const morgan = require('morgan')
const { connectdb } = require('./config/datbase')

const port =  6000

const app = express()

app.listen(port, async()=>{
    try{
        await connectdb()
        console.log(`Server runnung on port,${port}`)
    }catch(error){
        console.log("Server not responding",error)
    }
})
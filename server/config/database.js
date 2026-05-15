const mongoose = require('mongoose');
require('dotenv').config();

const connectdb = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/stakersdb';
        await mongoose.connect(uri);
        console.log("Database connected successfully 🚀");
    } catch (error) {
        console.error("Failed to connect to db ❌", error.message);
        process.exit(1);
    }
}

module.exports = { connectdb };

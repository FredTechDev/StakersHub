const mongoose = require('mongoose');
const User = require('./models/users');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        console.log('Total Users:', users.length);
        users.forEach(u => console.log(`User: ${u.username}, Email: ${u.email}, Role: ${u.role}`));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();

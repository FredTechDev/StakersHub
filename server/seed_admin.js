const mongoose = require('mongoose');
const User = require('./models/users');
const bcrypt = require('bcrypt');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'admin@stakershub.com';
        const existing = await User.findOne({ email });
        if (existing) {
            console.log('Admin already exists');
        } else {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = new User({
                username: 'StakersAdmin',
                email: email,
                password: hashedPassword,
                role: 'admin',
                balance: 1000000
            });
            await admin.save();
            console.log('Admin seeded! Email: admin@stakershub.com, Pass: admin123 🛡️');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();

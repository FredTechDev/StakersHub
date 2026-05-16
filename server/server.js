const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const { connectdb } = require('./config/database');

const authRoutes = require('./routes/auth');
const matchRoutes = require('./routes/matches');
const betRoutes = require('./routes/bets');
const walletRoutes = require('./routes/wallet');
const aiRoutes = require('./routes/ai');

const app = express();
const port = process.env.PORT || 6000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('StakersHub API is running...');
});

// Start server
app.listen(port, async () => {
    try {
        await connectdb();
        console.log(`Server running on port ${port} 🚀`);
    } catch (error) {
        console.error("Server initialization failed ❌", error);
    }
});
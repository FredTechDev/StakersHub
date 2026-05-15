const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/users');
const Transaction = require('../models/transactions');

// Deposit money (Mock Payment)
router.post('/deposit', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update balance
        user.balance += parseFloat(amount);
        await user.save();

        // Record transaction
        const transaction = new Transaction({
            user: user._id,
            amount: parseFloat(amount),
            type: 'deposit',
            description: 'Wallet top-up via app'
        });
        await transaction.save();

        res.json({ 
            message: "Deposit successful! Your balance has been updated.", 
            newBalance: user.balance 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

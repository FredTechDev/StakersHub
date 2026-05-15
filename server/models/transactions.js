const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'stake', 'win'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    reference: {
        type: String, // e.g. BetSlip ID
        default: null
    },
    description: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

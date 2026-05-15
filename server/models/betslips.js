const mongoose = require('mongoose');

const betSlipSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalStake: {
        type: Number,
        required: true
    },
    potentialWin: {
        type: Number,
        required: true
    },
    totalOdds: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'won', 'lost', 'voided'],
        default: 'pending'
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BetItem'
    }]
}, { timestamps: true });

module.exports = mongoose.model('BetSlip', betSlipSchema);

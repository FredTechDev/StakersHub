const mongoose = require('mongoose');

const betItemSchema = new mongoose.Schema({
    betSlip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BetSlip',
        required: true
    },
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    selection: {
        type: String, // '1', 'X', '2'
        required: true
    },
    oddsAtTime: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'won', 'lost', 'void'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('BetItem', betItemSchema);

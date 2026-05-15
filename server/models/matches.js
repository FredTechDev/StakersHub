const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    league: {
        type: String,
        required: true
    },
    leagueIcon: {
        type: String,
        default: 'fa-futbol'
    },
    team1: {
        name: { type: String, required: true },
        icon: { type: String, default: 'fa-shield' }
    },
    team2: {
        name: { type: String, required: true },
        icon: { type: String, default: 'fa-shield' }
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'live', 'finished'],
        default: 'scheduled'
    },
    odds: {
        team1: { type: Number, required: true },
        draw: { type: Number, required: true },
        team2: { type: Number, required: true }
    },
    result: {
        type: String, // '1', 'X', '2'
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);

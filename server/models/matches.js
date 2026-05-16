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
    leagueLogo: {
        type: String,
        default: null
    },
    team1: {
        name: { type: String, required: true },
        icon: { type: String, default: 'fa-shield' },
        logo: { type: String, default: null }
    },
    team2: {
        name: { type: String, required: true },
        icon: { type: String, default: 'fa-shield' },
        logo: { type: String, default: null }
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

const mongoose = require('mongoose');
const Match = require('./models/matches');
require('dotenv').config();

const realMatches = [
    {
        league: 'Champions League',
        leagueIcon: 'fa-trophy',
        date: new Date(Date.now() + 86400000), // Tomorrow
        team1: { name: 'Real Madrid', icon: 'fa-shield-halved' },
        team2: { name: 'Manchester City', icon: 'fa-shield-halved' },
        odds: { team1: 2.45, draw: 3.60, team2: 2.85 },
        status: 'upcoming'
    },
    {
        league: 'Premier League',
        leagueIcon: 'fa-futbol',
        date: new Date(), // Live now
        team1: { name: 'Arsenal', icon: 'fa-shield' },
        team2: { name: 'Liverpool', icon: 'fa-shield' },
        odds: { team1: 1.95, draw: 3.40, team2: 4.20 },
        status: 'live'
    },
    {
        league: 'La Liga',
        leagueIcon: 'fa-futbol',
        date: new Date(Date.now() + 172800000), // In 2 days
        team1: { name: 'Barcelona', icon: 'fa-shield-cat' },
        team2: { name: 'Atletico Madrid', icon: 'fa-shield' },
        odds: { team1: 1.85, draw: 3.25, team2: 5.10 },
        status: 'upcoming'
    },
    {
        league: 'Bundesliga',
        leagueIcon: 'fa-futbol',
        date: new Date(Date.now() + 3600000 * 5), // In 5 hours
        team1: { name: 'Bayern Munich', icon: 'fa-shield' },
        team2: { name: 'Bayer Leverkusen', icon: 'fa-shield' },
        odds: { team1: 2.10, draw: 3.80, team2: 3.45 },
        status: 'upcoming'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Match.deleteMany({});
        await Match.insertMany(realMatches);
        console.log('Database seeded with real-world matches! ⚽');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();

const mongoose = require('mongoose');
const Match = require('./models/matches');
require('dotenv').config();

const matches = [
    {
        league: "Premier League",
        leagueIcon: "fa-trophy",
        team1: { name: "Manchester City", icon: "fa-shield-halved" },
        team2: { name: "Arsenal", icon: "fa-gun" },
        date: new Date(),
        status: "live",
        odds: { team1: 1.85, draw: 3.60, team2: 4.20 }
    },
    {
        league: "UEFA Champions League",
        leagueIcon: "fa-star",
        team1: { name: "Real Madrid", icon: "fa-crown" },
        team2: { name: "Bayern Munich", icon: "fa-beer-mug-empty" },
        date: new Date(Date.now() + 3600000 * 2), // 2 hours from now
        status: "scheduled",
        odds: { team1: 2.10, draw: 3.40, team2: 3.30 }
    },
    {
        league: "Kenyan Premier League",
        leagueIcon: "fa-flag",
        team1: { name: "Gor Mahia", icon: "fa-lion" },
        team2: { name: "AFC Leopards", icon: "fa-paw" },
        date: new Date(Date.now() + 3600000 * 5), // 5 hours from now
        status: "scheduled",
        odds: { team1: 1.95, draw: 3.10, team2: 4.00 }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Match.deleteMany({});
        await Match.insertMany(matches);
        console.log("Database Seeded! ⚽");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();

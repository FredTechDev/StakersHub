const mongoose = require('mongoose');
const Match = require('./models/matches');
require('dotenv').config();

const matches = [
    {
        league: "FA Cup Final",
        leagueIcon: "fa-trophy",
        leagueLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/be/The_FA_Cup_logo.svg/1200px-The_FA_Cup_logo.svg.png",
        team1: { 
            name: "Chelsea", 
            icon: "fa-shield-halved",
            logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png"
        },
        team2: { 
            name: "Manchester City", 
            icon: "fa-gun",
            logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png"
        },
        date: new Date(Date.now() + 3600000 * 4),
        status: "scheduled",
        odds: { team1: 3.40, draw: 3.60, team2: 1.95 }
    },
    {
        league: "Kenyan Premier League",
        leagueIcon: "fa-flag",
        leagueLogo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/FKF_PL_Logo.png",
        team1: { 
            name: "Murang'a Seal", 
            icon: "fa-shield",
            logo: "https://pbs.twimg.com/profile_images/1691166675200212992/N6Z0_9V1_400x400.jpg" 
        },
        team2: { 
            name: "Gor Mahia", 
            icon: "fa-lion",
            logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/08/Gor_Mahia_FC_logo.svg/1200px-Gor_Mahia_FC_logo.svg.png"
        },
        date: new Date(),
        status: "live",
        odds: { team1: 4.50, draw: 3.20, team2: 1.85 }
    },
    {
        league: "German Bundesliga",
        leagueIcon: "fa-crown",
        leagueLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Bundesliga_logo_%282017%29.svg/1200px-Bundesliga_logo_%282017%29.svg.png",
        team1: { 
            name: "Bayern Munich", 
            icon: "fa-shield-halved",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png"
        },
        team2: { 
            name: "Köln", 
            icon: "fa-goat",
            logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/FC_Koln_logo.svg/1200px-FC_Koln_logo.svg.png"
        },
        date: new Date(Date.now() + 3600000 * 2),
        status: "scheduled",
        odds: { team1: 1.25, draw: 6.00, team2: 12.00 }
    },
    {
        league: "Scottish Premiership",
        leagueIcon: "fa-star",
        leagueLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/67/Scottish_Premiership_logo.svg/1200px-Scottish_Premiership_logo.svg.png",
        team1: { 
            name: "Celtic", 
            icon: "fa-clover",
            logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/Celtic_FC_crest.svg/1200px-Celtic_FC_crest.svg.png"
        },
        team2: { 
            name: "Hearts", 
            icon: "fa-heart",
            logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Heart_of_Midlothian_FC_crest.svg/1200px-Heart_of_Midlothian_FC_crest.svg.png"
        },
        date: new Date(Date.now() + 3600000 * 1),
        status: "scheduled",
        odds: { team1: 1.40, draw: 4.50, team2: 7.50 }
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

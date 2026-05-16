const Match = require('../models/matches');

/**
 * Simulated Real-Time Match Data Fetcher
 * In a production environment, this would call an external API like football-data.org
 */
const fetchRealMatches = async () => {
    // Simulated "Real" Response for May 16, 2026
    return [
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
                name: "Bidco United", 
                icon: "fa-shield",
                logo: "https://pbs.twimg.com/profile_images/1501531063162621952/yFv9Z0_u_400x400.jpg"
            },
            team2: { 
                name: "Shabana FC", 
                icon: "fa-paw",
                logo: "https://pbs.twimg.com/profile_images/1691166675200212992/N6Z0_9V1_400x400.jpg"
            },
            date: new Date(Date.now() + 3600000 * 3),
            status: "scheduled",
            odds: { team1: 2.10, draw: 3.00, team2: 3.80 }
        }
    ];
};

const syncMatches = async () => {
    try {
        const realMatches = await fetchRealMatches();
        
        for (const mData of realMatches) {
            // Check if match already exists (by teams and league)
            const exists = await Match.findOne({
                'team1.name': mData.team1.name,
                'team2.name': mData.team2.name,
                league: mData.league
            });

            if (!exists) {
                const newMatch = new Match(mData);
                await newMatch.save();
                console.log(`Synced: ${mData.team1.name} vs ${mData.team2.name}`);
            }
        }
        return { success: true, count: realMatches.length };
    } catch (error) {
        console.error("Sync Error:", error);
        throw error;
    }
};

module.exports = { syncMatches };

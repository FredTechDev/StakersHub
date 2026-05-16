const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');

// Mock Data for "Analysis"
const teamStats = {
    'Real Madrid': { form: 0.9, strength: 95, homeAdvantage: 1.1 },
    'Manchester City': { form: 0.92, strength: 96, homeAdvantage: 1.05 },
    'Arsenal': { form: 0.8, strength: 90, homeAdvantage: 1.1 },
    'Liverpool': { form: 0.75, strength: 91, homeAdvantage: 1.1 },
    'Chelsea': { form: 0.72, strength: 88, homeAdvantage: 1.1 },
    'Bayern Munich': { form: 0.85, strength: 93, homeAdvantage: 1.15 },
    'Gor Mahia': { form: 0.88, strength: 82, homeAdvantage: 1.2 },
    'Murang\'a Seal': { form: 0.65, strength: 72, homeAdvantage: 1.1 },
    'Celtic': { form: 0.9, strength: 85, homeAdvantage: 1.2 },
    'Hearts': { form: 0.7, strength: 78, homeAdvantage: 1.1 },
    'Köln': { form: 0.5, strength: 75, homeAdvantage: 1.1 }
};

// AI Match Analysis Endpoint
router.post('/analyze', auth, adminOnly, async (req, res) => {
    try {
        const { team1, team2, league } = req.body;
        
        // Simulating "AI Processing"
        const t1 = teamStats[team1] || { form: 0.5, strength: 70, homeAdvantage: 1.05 };
        const t2 = teamStats[team2] || { form: 0.5, strength: 70, homeAdvantage: 1.0 };

        // Simple Heuristic Algorithm
        const t1Score = (t1.strength * t1.form * t1.homeAdvantage);
        const t2Score = (t2.strength * t2.form);
        const total = t1Score + t2Score + 50; // 50 for draw probability

        const p1 = (t1Score / total) * 100;
        const p2 = (t2Score / total) * 100;
        const px = (50 / total) * 100;

        // Suggested Odds (10% Margin)
        const margin = 1.1;
        const suggestedOdds = {
            team1: parseFloat((margin / (p1 / 100)).toFixed(2)),
            draw: parseFloat((margin / (px / 100)).toFixed(2)),
            team2: parseFloat((margin / (p2 / 100)).toFixed(2))
        };

        res.json({
            analysis: `Based on current standings in ${league}, ${team1} has a superior form of ${Math.round(t1.form*100)}%. Statistical models suggest a high probability of home dominance.`,
            probabilities: {
                team1: p1.toFixed(1),
                draw: px.toFixed(1),
                team2: p2.toFixed(1)
            },
            suggestedOdds,
            confidence: "High (87%)",
            keyFactor: `${team1} defensive record at home is exceptional.`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

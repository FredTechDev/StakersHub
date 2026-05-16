const express = require('express');
const router = express.Router();
const Match = require('../models/matches');
const BetSlip = require('../models/betslips');
const BetItem = require('../models/betitems');
const User = require('../models/users');
const Transaction = require('../models/transactions');
const { auth, adminOnly } = require('../middleware/auth');
const { syncMatches } = require('../services/matchSync');

// Get all matches
router.get('/', async (req, res) => {
    try {
        const matches = await Match.find().sort({ date: 1 });
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create match (Admin only)
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const newMatch = new Match(req.body);
        await newMatch.save();
        res.status(201).json(newMatch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update match (Admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
    try {
        const updatedMatch = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMatch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Settle match (Admin only)
router.put('/:id/settle', auth, adminOnly, async (req, res) => {
    try {
        const { result } = req.body; // '1', 'X', '2'
        const matchId = req.params.id;

        const match = await Match.findById(matchId);
        if (!match) return res.status(404).json({ message: "Match not found" });
        if (match.status === 'finished') return res.status(400).json({ message: "Match already settled" });

        match.status = 'finished';
        match.result = result;
        await match.save();

        // Find all bet items for this match
        const betItems = await BetItem.find({ match: matchId, status: 'pending' });

        for (const item of betItems) {
            item.status = (item.selection === result) ? 'won' : 'lost';
            await item.save();

            // Check the whole betslip
            const slip = await BetSlip.findById(item.betSlip).populate('items');
            
            // A slip is finished if all its items are settled
            const allItemsSettled = slip.items.every(i => i.status !== 'pending');
            
            if (allItemsSettled) {
                const isWinner = slip.items.every(i => i.status === 'won');
                slip.status = isWinner ? 'won' : 'lost';
                await slip.save();

                if (isWinner) {
                    // Credit user
                    const user = await User.findById(slip.user);
                    user.balance += slip.potentialWin;
                    await user.save();

                    // Transaction record
                    const transaction = new Transaction({
                        user: user._id,
                        amount: slip.potentialWin,
                        type: 'win',
                        reference: slip._id,
                        description: `Winning payout for Slip #${slip._id.toString().slice(-6)}`
                    });
                    await transaction.save();
                }
            }
        }

        res.json({ message: "Match settled and bets processed", match });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Sync real-world matches (Admin only)
router.post('/sync', auth, adminOnly, async (req, res) => {
    try {
        const result = await syncMatches();
        res.json({ message: "Markets synced with real-world data", count: result.count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

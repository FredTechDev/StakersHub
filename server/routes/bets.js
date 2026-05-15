const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');
const User = require('../models/users');
const Match = require('../models/matches');
const BetSlip = require('../models/betslips');
const BetItem = require('../models/betitems');
const Transaction = require('../models/transactions');

// Place a bet
router.post('/', auth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { items, totalStake } = req.body;
        const userId = req.user.id;

        // 1. Validate User
        const user = await User.findById(userId).session(session);
        if (!user) throw new Error("User not found");
        if (user.balance < totalStake) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // 2. Calculate Potential Win and validate matches
        let totalOdds = 1;
        const betItemsData = [];
        
        for (const item of items) {
            const match = await Match.findById(item.matchId).session(session);
            if (!match) throw new Error(`Match ${item.matchId} not found`);
            if (match.status !== 'scheduled' && match.status !== 'live') {
                throw new Error(`Match ${match.team1.name} vs ${match.team2.name} is no longer open for betting`);
            }

            let oddsValue;
            if (item.selection === '1') oddsValue = match.odds.team1;
            else if (item.selection === 'X') oddsValue = match.odds.draw;
            else if (item.selection === '2') oddsValue = match.odds.team2;
            else throw new Error("Invalid selection");

            totalOdds *= oddsValue;
            betItemsData.push({
                match: match._id,
                selection: item.selection,
                oddsAtTime: oddsValue
            });
        }

        const potentialWin = totalStake * totalOdds;

        // 3. Create BetSlip
        const newBetSlip = new BetSlip({
            user: userId,
            totalStake,
            totalOdds,
            potentialWin,
            status: 'pending'
        });
        await newBetSlip.save({ session });

        // 4. Create BetItems
        const createdItems = await BetItem.insertMany(
            betItemsData.map(item => ({ ...item, betSlip: newBetSlip._id })),
            { session }
        );
        newBetSlip.items = createdItems.map(i => i._id);
        await newBetSlip.save({ session });

        // 5. Update User Balance
        user.balance -= totalStake;
        await user.save({ session });

        // 6. Create Transaction
        const transaction = new Transaction({
            user: userId,
            amount: -totalStake,
            type: 'stake',
            reference: newBetSlip._id,
            description: `Bet placed on ${items.length} matches`
        });
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Bet placed successfully",
            betSlip: newBetSlip,
            newBalance: user.balance
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
});

// Get user bets
router.get('/my-bets', auth, async (req, res) => {
    try {
        const bets = await BetSlip.find({ user: req.user.id })
            .populate({
                path: 'items',
                populate: { path: 'match' }
            })
            .sort({ createdAt: -1 });
        res.json(bets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

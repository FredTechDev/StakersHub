import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BetSlipContext = createContext();

export const BetSlipProvider = ({ children }) => {
    const [betSlip, setBetSlip] = useState([]);
    const { user, token, updateBalance } = useAuth();

    const addToBetSlip = (matchId, selection, odds, teams) => {
        const existingIndex = betSlip.findIndex(b => b.matchId === matchId);
        if (existingIndex > -1) {
            if (betSlip[existingIndex].selection === selection) {
                setBetSlip(betSlip.filter((_, i) => i !== existingIndex));
            } else {
                const newSlip = [...betSlip];
                newSlip[existingIndex] = { matchId, selection, odds, teams };
                setBetSlip(newSlip);
            }
        } else {
            setBetSlip([...betSlip, { matchId, selection, odds, teams }]);
        }
    };

    const removeFromSlip = (index) => {
        setBetSlip(betSlip.filter((_, i) => i !== index));
    };

    const clearSlip = () => setBetSlip([]);

    const totalOdds = betSlip.reduce((acc, item) => acc * item.odds, 1);

    const placeBet = async (stake) => {
        try {
            const res = await axios.post('http://localhost:6000/api/bets', {
                items: betSlip.map(i => ({ matchId: i.matchId, selection: i.selection })),
                totalStake: stake
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            updateBalance(res.data.newBalance);
            clearSlip();
            return { success: true, message: 'Bet placed successfully!' };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Bet placement failed' };
        }
    };

    return (
        <BetSlipContext.Provider value={{ betSlip, addToBetSlip, removeFromSlip, clearSlip, totalOdds, placeBet }}>
            {children}
        </BetSlipContext.Provider>
    );
};

export const useBetSlip = () => useContext(BetSlipContext);

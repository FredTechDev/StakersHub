import React, { useState } from 'react';
import { useBetSlip } from '../context/BetSlipContext';
import { useAuth } from '../context/AuthContext';
import { X, Receipt, MousePointer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BetSlipSidebar = ({ isOpen, setIsOpen, showNotification, onAuthRequired }) => {
    const { betSlip, removeFromSlip, totalOdds, placeBet } = useBetSlip();
    const { user } = useAuth();
    const [stake, setStake] = useState(100);
    const [isPlacing, setIsPlacing] = useState(false);

    const handlePlaceBet = async () => {
        if (!user) {
            setIsOpen(false);
            onAuthRequired();
            return;
        }
        if (stake < 50) return showNotification('Minimum stake is KES 50');
        if (stake > user.balance) return showNotification('Insufficient balance!');

        setIsPlacing(true);
        const res = await placeBet(stake);
        setIsPlacing(false);
        
        if (res.success) {
            showNotification('Bet placed! Good luck! 🍀');
            setIsOpen(false);
        } else {
            showNotification(res.message);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="sidebar-overlay" onClick={() => setIsOpen(false)}>
                    <motion.aside 
                        className="sidebar" 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sidebar-header">
                            <h3><Receipt size={20} style={{ marginRight: '10px' }} /> Bet Slip</h3>
                            <X size={24} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                        </div>
                        
                        <div className="bet-items-container">
                            {betSlip.length === 0 ? (
                                <div style={{ textAlign: 'center', paddingTop: '50px', color: 'var(--text-muted)' }}>
                                    <MousePointer size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                                    <p>Select odds to build your slip</p>
                                </div>
                            ) : (
                                betSlip.map((item, index) => (
                                    <div key={index} className="slip-item">
                                        <div className="slip-item-top">
                                            <span>Football</span>
                                            <X size={16} style={{ cursor: 'pointer' }} onClick={() => removeFromSlip(index)} />
                                        </div>
                                        <div className="slip-item-teams">{item.teams}</div>
                                        <div className="slip-item-selection">Result: {item.selection} @ {item.odds.toFixed(2)}</div>
                                    </div>
                                ))
                            )}
                        </div>

                        {betSlip.length > 0 && (
                            <div className="slip-footer">
                                <div className="total-odds-row">
                                    <span>Total Odds</span>
                                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{totalOdds.toFixed(2)}</span>
                                </div>
                                <div className="stake-input-group">
                                    <span style={{ fontWeight: 600 }}>Stake (KES)</span>
                                    <input 
                                        type="number" 
                                        value={stake} 
                                        onChange={(e) => setStake(parseFloat(e.target.value) || 0)}
                                        min="50" 
                                        style={{ width: '100px', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: '#fff', padding: '8px', borderRadius: '8px', textAlign: 'right' }} 
                                    />
                                </div>
                                <div className="potential-payout">
                                    <span>Est. Payout</span>
                                    <span style={{ color: 'var(--secondary)' }}>KES {(totalOdds * stake).toFixed(2)}</span>
                                </div>
                                <button 
                                    className="btn btn-primary" 
                                    style={{ width: '100%' }} 
                                    onClick={handlePlaceBet}
                                    disabled={isPlacing}
                                >
                                    {isPlacing ? 'Processing...' : 'Place Bet Now'}
                                </button>
                            </div>
                        )}
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BetSlipSidebar;

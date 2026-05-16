import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { History, ChevronLeft, Ticket, Calendar, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';

const UserHistory = ({ setView }) => {
    const { token } = useAuth();
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${API_URL}/bets/my-bets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBets(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="match-section">
            <div className="section-header">
                <h2><History size={20} style={{ marginRight: '10px' }} /> My Betting History</h2>
                <button className="btn btn-outline" onClick={() => setView('arena')}>
                    <ChevronLeft size={16} /> Back to Arena
                </button>
            </div>
            <div className="match-grid">
                {loading ? (
                    <p>Loading tickets...</p>
                ) : bets.length === 0 ? (
                    <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No bets placed yet. Join the arena and start winning!
                    </p>
                ) : (
                    bets.map((bet, index) => (
                        <motion.div 
                            key={bet._id} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass" 
                            style={{ 
                                position: 'relative',
                                overflow: 'hidden',
                                borderLeft: `6px solid ${getStatusColor(bet.status)}`,
                                background: 'linear-gradient(145deg, rgba(20,25,30,0.6) 0%, rgba(10,14,18,0.4) 100%)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>Ticket Serial</span>
                                    <span style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--primary)' }}>SH-{bet._id.slice(-8).toUpperCase()}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ textTransform: 'uppercase', fontWeight: 900, fontSize: '0.8rem', color: getStatusColor(bet.status), display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {bet.status === 'won' && <Award size={14} />}
                                        {bet.status}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        <Calendar size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                        {new Date(bet.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                                {bet.items.map((item, idx) => (
                                    <div key={idx} style={{ fontSize: '0.85rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{item.match ? `${item.match.team1.name} vs ${item.match.team2.name}` : 'Market Closed'}</span>
                                        <b style={{ color: 'var(--primary)' }}>{item.selection} ({item.oddsAtTime?.toFixed(2)})</b>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed var(--glass-border)', paddingTop: '15px', marginTop: '10px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>STAKE</span>
                                    <span style={{ fontWeight: 700 }}>KES {bet.totalStake.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{bet.status === 'won' ? 'WINNINGS' : 'POTENTIAL PAYOUT'}</span>
                                    <span style={{ fontWeight: 900, color: bet.status === 'won' ? 'var(--primary)' : '#fff', fontSize: '1.2rem' }}>KES {bet.potentialWin.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <Ticket 
                                size={120} 
                                style={{ 
                                    position: 'absolute', 
                                    right: '-20px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%) rotate(-15deg)', 
                                    opacity: 0.03,
                                    pointerEvents: 'none'
                                }} 
                            />
                        </motion.div>
                    ))
                )}
            </div>
        </section>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'won': return 'var(--primary)';
        case 'lost': return 'var(--danger)';
        default: return 'var(--text-muted)';
    }
};

export default UserHistory;

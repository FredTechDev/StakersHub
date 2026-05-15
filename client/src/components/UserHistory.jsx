import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { History, ChevronLeft } from 'lucide-react';

const UserHistory = ({ setView }) => {
    const { token } = useAuth();
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:6000/api/bets/my-bets', {
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
                    bets.map(bet => (
                        <div key={bet._id} className="glass" style={{ borderLeft: `5px solid ${getStatusColor(bet.status)}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ fontWeight: 800 }}>Slip #{bet._id.slice(-6)}</span>
                                <span style={{ textTransform: 'uppercase', fontWeight: 900, color: getStatusColor(bet.status) }}>{bet.status}</span>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '10px' }}>
                                Placed on: {new Date(bet.createdAt).toLocaleDateString()}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                {bet.items.map((item, idx) => (
                                    <div key={idx} style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
                                        {item.match ? `${item.match.team1.name} vs ${item.match.team2.name}` : 'Match Removed'} | <b>{item.selection}</b>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
                                <span>Stake: KES {bet.totalStake}</span>
                                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>Payout: KES {bet.potentialWin.toFixed(2)}</span>
                            </div>
                        </div>
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

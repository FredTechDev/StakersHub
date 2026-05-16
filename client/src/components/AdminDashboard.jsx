import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, ChevronLeft, Plus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../config';

const AdminDashboard = ({ setView, showNotification, openMatchModal }) => {
    const { token } = useAuth();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const res = await axios.get(`${API_URL}/matches`);
            setMatches(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const settleMatch = async (id, result) => {
        if (!confirm(`Settle match with result ${result}? Winners will be paid.`)) return;
        try {
            await axios.put(`${API_URL}/matches/${id}/settle`, 
                { result }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showNotification('Match settled! 💰');
            fetchMatches();
        } catch (err) {
            alert(err.response?.data?.message || 'Settlement failed');
        }
    };

    return (
        <section className="match-section">
            <div className="section-header">
                <h2><Shield size={20} style={{ marginRight: '10px' }} /> Admin Dashboard</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-outline" onClick={openMatchModal}><Plus size={16} /> Upload Odds</button>
                    <button className="btn btn-primary" onClick={() => setView('arena')}>Arena View</button>
                </div>
            </div>
            <div className="match-grid">
                <AnimatePresence>
                    {matches.map((match, index) => (
                        <motion.div 
                            key={match._id} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass"
                            style={{ borderTop: match.status === 'finished' ? 'none' : '2px solid var(--primary)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{match.league}</span>
                                <span style={{ color: match.status === 'finished' ? 'var(--text-muted)' : 'var(--primary)', fontWeight: 800, fontSize: '0.75rem' }}>
                                    {match.status.toUpperCase()}
                                </span>
                            </div>
                            <div style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 800, fontSize: '1.1rem' }}>
                                {match.team1.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>VS</span> {match.team2.name}
                            </div>
                            {match.status !== 'finished' ? (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => settleMatch(match._id, '1')}>1</button>
                                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => settleMatch(match._id, 'X')}>X</button>
                                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => settleMatch(match._id, '2')}>2</button>
                                </div>
                            ) : (
                                <div style={{ 
                                    textAlign: 'center', 
                                    background: 'rgba(0,255,136,0.1)', 
                                    padding: '10px', 
                                    borderRadius: '12px', 
                                    color: 'var(--primary)', 
                                    fontWeight: 900,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}>
                                    <CheckCircle2 size={16} /> SETTLED RESULT: {match.result}
                                </div>
                            )}
                            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                                {match.status !== 'finished' ? 'Select result to trigger global payouts' : 'Payouts complete'}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default AdminDashboard;

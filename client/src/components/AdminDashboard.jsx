import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, ChevronLeft, Plus } from 'lucide-react';

const AdminDashboard = ({ setView, showNotification, openMatchModal }) => {
    const { token } = useAuth();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const res = await axios.get('http://localhost:6000/api/matches');
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
            await axios.put(`http://localhost:6000/api/matches/${id}/settle`, 
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
                {loading ? (
                    <p>Loading active markets...</p>
                ) : matches.map(match => (
                    <div key={match._id} className="glass">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span style={{ fontWeight: 700 }}>{match.league}</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{match.status.toUpperCase()}</span>
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            {match.team1.name} vs {match.team2.name}
                        </div>
                        {match.status !== 'finished' ? (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => settleMatch(match._id, '1')}>1</button>
                                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => settleMatch(match._id, 'X')}>X</button>
                                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => settleMatch(match._id, '2')}>2</button>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--primary)', fontWeight: 800 }}>
                                RESULT: {match.result}
                            </div>
                        )}
                        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                            {match.status !== 'finished' ? 'Click result to settle market' : 'Market closed'}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AdminDashboard;

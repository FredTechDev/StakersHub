import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useBetSlip } from '../context/BetSlipContext';
import { Lock, Radio, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../config';

const MatchGrid = ({ onAuthRequired }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { addToBetSlip, betSlip } = useBetSlip();

    useEffect(() => {
        if (user) {
            fetchMatches();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchMatches = async () => {
        try {
            const res = await axios.get(`${API_URL}/matches`);
            setMatches(res.data.filter(m => m.status !== 'finished'));
        } catch (err) {
            console.error('Error fetching matches:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <section className="match-section">
                <div className="glass" style={{ textAlign: 'center', padding: '80px 40px', border: '2px dashed var(--glass-border)' }}>
                    <Lock size={48} style={{ color: 'var(--primary)', marginBottom: '20px' }} />
                    <h2 style={{ marginBottom: '10px' }}>LOCKED ARENA</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
                        Only registered legends can view the stakes. Join the hub to see the odds and start your winning streak!
                    </p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button className="btn btn-primary" onClick={onAuthRequired}>Enter Hub</button>
                        <button className="btn btn-outline">Explore Benefits</button>
                    </div>
                </div>
            </section>
        );
    }

    if (loading) {
        return (
            <section className="match-section">
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="spinner"></div>
                    <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Entering the arena...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="match-section">
            <div className="section-header">
                <h2><Radio size={20} style={{ color: 'var(--primary)', marginRight: '10px' }} /> Market Overview</h2>
            </div>
            <div className="match-grid">
                <AnimatePresence>
                    {matches.length === 0 ? (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}
                        >
                            No active markets at the moment. Check back soon!
                        </motion.p>
                    ) : (
                        matches.map((match, index) => (
                            <motion.div
                                key={match._id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <MatchCard 
                                    match={match} 
                                    onSelect={(sel, odds) => addToBetSlip(match._id, sel, odds, `${match.team1.name} vs ${match.team2.name}`)}
                                    selected={betSlip.find(i => i.matchId === match._id)}
                                />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

const MatchCard = ({ match, onSelect, selected }) => {
    const isLive = match.status === 'live';
    const matchDate = new Date(match.date);

    return (
        <div className="match-card glass">
            <div className="match-top">
                <div className="match-league">
                    <i className={`fas ${match.leagueIcon || 'fa-futbol'}`}></i> {match.league}
                </div>
                <div className={isLive ? 'status-live' : ''} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {isLive && <Zap size={14} fill="var(--primary)" />}
                    {isLive ? 'LIVE NOW' : matchDate.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
            <div className="match-teams">
                <div className="team">
                    <div className="team-logo"><i className={`fas ${match.team1.icon || 'fa-shield'}`}></i></div>
                    <div className="team-name">{match.team1.name}</div>
                </div>
                <div className="vs-badge">VS</div>
                <div className="team">
                    <div className="team-logo"><i className={`fas ${match.team2.icon || 'fa-shield'}`}></i></div>
                    <div className="team-name">{match.team2.name}</div>
                </div>
            </div>
            <div className="odds-row">
                <div className={`odd-btn ${selected?.selection === '1' ? 'active' : ''}`} onClick={() => onSelect('1', match.odds.team1)}>
                    <span className="odd-val">{match.odds.team1.toFixed(2)}</span>
                    <span className="odd-label">1</span>
                </div>
                <div className={`odd-btn ${selected?.selection === 'X' ? 'active' : ''}`} onClick={() => onSelect('X', match.odds.draw)}>
                    <span className="odd-val">{match.odds.draw.toFixed(2)}</span>
                    <span className="odd-label">X</span>
                </div>
                <div className={`odd-btn ${selected?.selection === '2' ? 'active' : ''}`} onClick={() => onSelect('2', match.odds.team2)}>
                    <span className="odd-val">{match.odds.team2.toFixed(2)}</span>
                    <span className="odd-label">2</span>
                </div>
            </div>
        </div>
    );
};

export default MatchGrid;

import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Brain, Target } from 'lucide-react';

const MatchModal = ({ close, showNotification }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    
    const [formData, setFormData] = useState({
        league: '',
        date: '',
        team1: '',
        team2: '',
        odds1: '',
        oddsX: '',
        odds2: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAIAnalyze = async () => {
        if (!formData.team1 || !formData.team2) return alert('Enter both teams first!');
        
        setAiLoading(true);
        try {
            const res = await axios.post('http://localhost:6000/api/ai/analyze', 
                { team1: formData.team1, team2: formData.team2, league: formData.league },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAiResult(res.data);
            // Auto-fill suggested odds
            setFormData({
                ...formData,
                odds1: res.data.suggestedOdds.team1,
                oddsX: res.data.suggestedOdds.draw,
                odds2: res.data.suggestedOdds.team2
            });
            showNotification('AI Analysis complete! 🧠');
        } catch (err) {
            console.error(err);
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            league: formData.league,
            date: formData.date,
            team1: { name: formData.team1 },
            team2: { name: formData.team2 },
            odds: {
                team1: parseFloat(formData.odds1),
                draw: parseFloat(formData.oddsX),
                team2: parseFloat(formData.odds2)
            }
        };

        setLoading(true);
        try {
            await axios.post('http://localhost:6000/api/matches', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification('New market launched! 🚀');
            close();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create match');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Upload New Odds" subtitle="Create a new market for the arena" close={close}>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label>League</label>
                        <input type="text" name="league" required value={formData.league} onChange={handleChange} placeholder="Premier League" />
                    </div>
                    <div className="form-group">
                        <label>Match Date</label>
                        <input type="datetime-local" name="date" required value={formData.date} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Home Team</label>
                        <input type="text" name="team1" required value={formData.team1} onChange={handleChange} placeholder="Man City" />
                    </div>
                    <div className="form-group">
                        <label>Away Team</label>
                        <input type="text" name="team2" required value={formData.team2} onChange={handleChange} placeholder="Arsenal" />
                    </div>
                </div>

                <div style={{ margin: '20px 0', padding: '20px', background: 'rgba(0, 255, 136, 0.05)', borderRadius: '15px', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: aiResult ? '15px' : '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Brain size={20} color="var(--primary)" />
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>AI WIN ASSISTANT</span>
                        </div>
                        <button type="button" className="btn btn-outline" style={{ padding: '5px 15px', fontSize: '0.8rem' }} onClick={handleAIAnalyze} disabled={aiLoading}>
                            {aiLoading ? 'Analyzing...' : <><Sparkles size={14} /> Run Analysis</>}
                        </button>
                    </div>

                    {aiResult && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', animation: 'fadeIn 0.5s' }}>
                            <p style={{ marginBottom: '10px', fontStyle: 'italic' }}>"{aiResult.analysis}"</p>
                            <div style={{ display: 'flex', gap: '15px', fontWeight: 800 }}>
                                <span style={{ color: 'var(--primary)' }}>1: {aiResult.probabilities.team1}%</span>
                                <span>X: {aiResult.probabilities.draw}%</span>
                                <span style={{ color: 'var(--danger)' }}>2: {aiResult.probabilities.team2}%</span>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '10px' }}>
                    <div className="form-group">
                        <label>Odds (1)</label>
                        <input type="number" name="odds1" step="0.01" required value={formData.odds1} onChange={handleChange} placeholder="1.85" />
                    </div>
                    <div className="form-group">
                        <label>Odds (X)</label>
                        <input type="number" name="oddsX" step="0.01" required value={formData.oddsX} onChange={handleChange} placeholder="3.40" />
                    </div>
                    <div className="form-group">
                        <label>Odds (2)</label>
                        <input type="number" name="odds2" step="0.01" required value={formData.odds2} onChange={handleChange} placeholder="4.20" />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                    {loading ? 'Launching...' : 'Launch Market 🚀'}
                </button>
            </form>
        </Modal>
    );
};

export default MatchModal;

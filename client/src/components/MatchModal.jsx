import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MatchModal = ({ close, showNotification }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            league: formData.get('league'),
            date: formData.get('date'),
            team1: { name: formData.get('team1') },
            team2: { name: formData.get('team2') },
            odds: {
                team1: parseFloat(formData.get('odds1')),
                draw: parseFloat(formData.get('oddsX')),
                team2: parseFloat(formData.get('odds2'))
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
                        <input type="text" name="league" required placeholder="Premier League" />
                    </div>
                    <div className="form-group">
                        <label>Match Date</label>
                        <input type="datetime-local" name="date" required />
                    </div>
                    <div className="form-group">
                        <label>Home Team</label>
                        <input type="text" name="team1" required placeholder="Man City" />
                    </div>
                    <div className="form-group">
                        <label>Away Team</label>
                        <input type="text" name="team2" required placeholder="Arsenal" />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '10px' }}>
                    <div className="form-group">
                        <label>Odds (1)</label>
                        <input type="number" name="odds1" step="0.01" required placeholder="1.85" />
                    </div>
                    <div className="form-group">
                        <label>Odds (X)</label>
                        <input type="number" name="oddsX" step="0.01" required placeholder="3.40" />
                    </div>
                    <div className="form-group">
                        <label>Odds (2)</label>
                        <input type="number" name="odds2" step="0.01" required placeholder="4.20" />
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

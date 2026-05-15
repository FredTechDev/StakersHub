import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { Info } from 'lucide-react';

const DepositModal = ({ close, showNotification }) => {
    const { deposit } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const amount = e.target.amount.value;
        setLoading(true);
        const res = await deposit(amount);
        setLoading(false);
        
        if (res.success) {
            showNotification(res.message);
            close();
        } else {
            alert(res.message);
        }
    };

    return (
        <Modal 
            title="Top Up Wallet" 
            subtitle="Send money to the hub and start winning"
            close={close}
        >
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Amount (KES)</label>
                    <input type="number" name="amount" required min="100" placeholder="e.g. 1000" />
                </div>
                <div style={{ background: 'rgba(0,255,136,0.1)', padding: '15px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem', display: 'flex', gap: '10px' }}>
                    <Info size={16} style={{ flexShrink: 0 }} />
                    <p>Funds will be credited to your account instantly for testing purposes.</p>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Processing...' : 'Deposit Now'}
                </button>
            </form>
        </Modal>
    );
};

export default DepositModal;

import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ type, close, showNotification }) => {
    const [isLogin, setIsLogin] = useState(type === 'login');
    const { login, register, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        console.log('Auth Form Data:', data);

        let res;
        if (isLogin) {
            res = await login(data.email, data.password);
        } else {
            res = await register(data.username, data.email, data.password);
        }

        if (res.success) {
            showNotification(isLogin ? 'Welcome back! ⚽' : 'Account created! 🎁');
            close();
        } else {
            alert(res.message);
        }
    };

    return (
        <Modal 
            title={isLogin ? 'Welcome Back' : 'Create Account'} 
            subtitle={isLogin ? 'Enter the hub and continue your streak' : 'Join the elite stakers community today'}
            close={close}
        >
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="username" required placeholder="JohnDoe" />
                    </div>
                )}
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" required placeholder="name@example.com" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required placeholder="••••••••" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                    {loading ? 'Processing...' : (isLogin ? 'Login to Hub' : 'Join the Hub')}
                </button>
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
                    <span 
                        onClick={() => setIsLogin(!isLogin)} 
                        style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }}
                    >
                        {isLogin ? 'Sign up' : 'Login'}
                    </span>
                </p>
            </form>
        </Modal>
    );
};

export default AuthModal;

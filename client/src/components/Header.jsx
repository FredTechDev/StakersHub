import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, LogOut, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = ({ setView, openLogin, openRegister, openDeposit }) => {
    const { user, logout } = useAuth();

    return (
        <header>
            <div className="nav-container">
                <div className="logo" onClick={() => setView('arena')}>
                    <i className="fas fa-futbol"></i>
                    Stakers<span>Hub</span>
                </div>
                
                <ul className="nav-links">
                    <li onClick={() => setView('arena')}><a>Arena</a></li>
                    <li onClick={() => setView('history')}><a>My Bets</a></li>
                    {user?.role === 'admin' && (
                        <li onClick={() => setView('admin')}><a style={{ color: 'var(--primary)', fontWeight: 700 }}><Shield size={16} /> Admin</a></li>
                    )}
                </ul>

                <div className="auth-group">
                    {!user ? (
                        <div className="auth-btns">
                            <button className="btn btn-outline" onClick={openLogin}>Login</button>
                            <button className="btn btn-primary" onClick={openRegister}>Register</button>
                        </div>
                    ) : (
                        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div className="user-info" style={{ textAlign: 'right' }}>
                                <div className="username" style={{ fontWeight: 700 }}>{user.username}</div>
                                <motion.div 
                                    className="balance" 
                                    onClick={openDeposit} 
                                    key={user.balance}
                                    initial={{ scale: 1.1, color: '#fff' }}
                                    animate={{ scale: 1, color: 'var(--primary)' }}
                                    style={{ fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                >
                                    KES {user.balance.toFixed(2)} <PlusCircle size={14} />
                                </motion.div>
                            </div>
                            <button className="btn btn-outline" style={{ padding: '8px 12px' }} onClick={logout}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

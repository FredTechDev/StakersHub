import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('stakers_user')) || null);
    const [token, setToken] = useState(localStorage.getItem('stakers_token') || null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:6000/api/auth/login', { email, password });
            const { user, token } = res.data;
            saveAuth(user, token);
            return { success: true };
        } catch (err) {
            console.error('Login Error:', err.response || err);
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:6000/api/auth/register', { username, email, password });
            const { user, token } = res.data;
            saveAuth(user, token);
            return { success: true };
        } catch (err) {
            console.error('Registration Error:', err.response || err);
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    const saveAuth = (u, t) => {
        setUser(u);
        setToken(t);
        localStorage.setItem('stakers_user', JSON.stringify(u));
        localStorage.setItem('stakers_token', t);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('stakers_user');
        localStorage.removeItem('stakers_token');
        window.location.reload();
    };

    const updateBalance = (newBalance) => {
        const updatedUser = { ...user, balance: newBalance };
        setUser(updatedUser);
        localStorage.setItem('stakers_user', JSON.stringify(updatedUser));
    };

    const deposit = async (amount) => {
        try {
            const res = await axios.post('http://localhost:6000/api/wallet/deposit', 
                { amount }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            updateBalance(res.data.newBalance);
            return { success: true, message: res.data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Deposit failed' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateBalance, deposit }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import React from 'react';

const Hero = ({ onAction }) => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>BET ON THE <br/><span style={{ color: 'var(--primary)' }}>WINNING</span> TEAM</h1>
                <p>Africa's premier football betting destination. High-fidelity odds, instant settlements, and a stadium-grade experience.</p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <button className="btn btn-primary" onClick={onAction}>Start Winning</button>
                    <button className="btn btn-outline">Explore Markets</button>
                </div>
            </div>
        </section>
    );
};

export default Hero;

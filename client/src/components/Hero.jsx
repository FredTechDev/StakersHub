import React from 'react';

const Hero = ({ onAction }) => {
    return (
        <section className="hero">
            <div className="hero-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'inline-block', background: 'var(--primary)', color: '#000', padding: '5px 15px', borderRadius: '20px', fontWeight: 900, fontSize: '0.7rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    <i className="fas fa-bolt"></i> Live Arena Open
                </div>
                <h1>THE ULTIMATE <br/><span style={{ color: 'var(--primary)' }}>STAKERS</span> EXPERIENCE</h1>
                <p>Join thousands of legends in the most immersive soccer betting platform. High-fidelity odds, instant payouts, and zero friction.</p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <button className="btn btn-primary" onClick={onAction} style={{ padding: '15px 40px', fontSize: '1.1rem' }}>Enter the Pitch</button>
                    <button className="btn btn-outline" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>View Markets</button>
                </div>
            </div>
        </section>
    );
};

export default Hero;

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BetSlipProvider, useBetSlip } from './context/BetSlipContext';
import Header from './components/Header';
import Hero from './components/Hero';
import MatchGrid from './components/MatchGrid';
import BetSlipSidebar from './components/BetSlipSidebar';
import AuthModal from './components/AuthModal';
import DepositModal from './components/DepositModal';
import MatchModal from './components/MatchModal';
import UserHistory from './components/UserHistory';
import AdminDashboard from './components/AdminDashboard';
import Notification from './components/Notification';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
    const [view, setView] = useState('arena'); // 'arena', 'history', 'admin'
    const [authModal, setAuthModal] = useState(null); // 'login', 'register', null
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notification, setNotification] = useState(null);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const renderView = () => {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {view === 'history' && <UserHistory setView={setView} />}
                    {view === 'admin' && <AdminDashboard setView={setView} showNotification={showNotification} openMatchModal={() => setIsMatchModalOpen(true)} />}
                    {view === 'arena' && (
                        <>
                            <Hero onAction={() => setAuthModal('register')} />
                            <MatchGrid onAuthRequired={() => setAuthModal('login')} />
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <AuthProvider>
            <BetSlipProvider>
                <div className="app">
                    <Header 
                        setView={setView} 
                        openLogin={() => setAuthModal('login')} 
                        openRegister={() => setAuthModal('register')} 
                        openDeposit={() => setIsDepositOpen(true)}
                    />
                    
                    <main>
                        {renderView()}
                    </main>

                    <BetSlipSidebar 
                        isOpen={isSidebarOpen} 
                        setIsOpen={setIsSidebarOpen} 
                        showNotification={showNotification}
                        onAuthRequired={() => setAuthModal('login')}
                    />

                    <div className="bet-slip-toggle" onClick={() => setIsSidebarOpen(true)}>
                        <i className="fas fa-ticket-alt"></i>
                        <BetCount />
                    </div>

                    {authModal && <AuthModal type={authModal} close={() => setAuthModal(null)} showNotification={showNotification} />}
                    {isDepositOpen && <DepositModal close={() => setIsDepositOpen(false)} showNotification={showNotification} />}
                    {isMatchModalOpen && <MatchModal close={() => setIsMatchModalOpen(false)} showNotification={showNotification} />}
                    {notification && <Notification message={notification} />}
                </div>
            </BetSlipProvider>
        </AuthProvider>
    );
};

const BetCount = () => {
    const context = useBetSlip();
    const betSlip = context ? context.betSlip : [];
    return betSlip.length > 0 ? <div className="bet-count">{betSlip.length}</div> : null;
};

export default App;

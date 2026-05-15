import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = ({ message }) => {
    return (
        <AnimatePresence>
            <motion.div 
                className="notification glass"
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
                {message}
            </motion.div>
        </AnimatePresence>
    );
};

export default Notification;

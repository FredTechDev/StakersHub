import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ children, close, title, subtitle }) => {
    return (
        <div className="modal-overlay" onClick={close}>
            <motion.div 
                className="modal-content glass"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <span className="close-modal" onClick={close}><X /></span>
                <div className="modal-header" style={{ marginBottom: '30px' }}>
                    <h3>{title}</h3>
                    {subtitle && <p style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
                </div>
                {children}
            </motion.div>
        </div>
    );
};

export default Modal;

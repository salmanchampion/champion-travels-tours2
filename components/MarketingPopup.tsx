
import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import Modal from './Modal';

const MarketingPopup: React.FC = () => {
    const { appData } = useContext(DataContext);
    const config = appData.globalConfig?.marketingPopup;
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!config || !config.enabled) return;

        const hasSeenPopup = sessionStorage.getItem('marketingPopupSeen');
        if (config.showOncePerSession && hasSeenPopup) return;

        const timer = setTimeout(() => {
            setIsOpen(true);
            if (config.showOncePerSession) {
                sessionStorage.setItem('marketingPopupSeen', 'true');
            }
        }, config.delaySeconds * 1000);

        return () => clearTimeout(timer);
    }, [config]);

    if (!config || !config.enabled) return null;

    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="flex flex-col md:flex-row bg-[var(--color-light-bg)] rounded-lg overflow-hidden">
                {config.image && (
                    <div className="md:w-1/2 h-48 md:h-auto relative">
                        <img 
                            src={config.image} 
                            alt={config.title} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-bg)]/80 to-transparent md:bg-gradient-to-r"></div>
                    </div>
                )}
                <div className={`p-8 flex flex-col justify-center ${config.image ? 'md:w-1/2' : 'w-full'}`}>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-primary)] mb-4">
                        {config.title}
                    </h3>
                    <p className="text-[var(--color-light-text)] mb-6 leading-relaxed">
                        {config.content}
                    </p>
                    {config.buttonText && config.buttonLink && (
                        <a 
                            href={config.buttonLink}
                            onClick={() => setIsOpen(false)}
                            className="inline-block w-full text-center bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold py-3 px-6 rounded-[var(--ui-button-radius)] hover:shadow-lg transition-transform transform hover:-translate-y-1"
                        >
                            {config.buttonText}
                        </a>
                    )}
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="mt-4 text-sm text-[var(--color-muted-text)] hover:text-white underline text-center block"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default MarketingPopup;

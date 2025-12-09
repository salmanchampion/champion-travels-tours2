
import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../contexts/DataContext';

const MobileBottomNav: React.FC = () => {
    const { appData, setPrayerTimesOpen, isPrayerTimesOpen, setThemeSettingsOpen } = useContext(DataContext);
    const { floatingButton } = appData;
    const [isVisible, setIsVisible] = useState(true);

    const cleanPhone = floatingButton?.phoneNumber?.replace(/[^\d+]/g, '') || '';
    const whatsappLink = `https://wa.me/${cleanPhone.replace('+', '')}`;

    useEffect(() => {
        const checkHash = () => {
            const hash = window.location.hash;
            // Hide nav on Admin and Login pages to prevent overlap with Save buttons
            if (hash === '#admin' || hash === '#login') {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('hashchange', checkHash);
        checkHash(); // Initial check

        return () => window.removeEventListener('hashchange', checkHash);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B0F19]/95 backdrop-blur-lg border-t border-gray-800 z-[90] pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
                
                {/* Home */}
                <a href="#home" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                    <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-[10px] font-medium">Home</span>
                </a>

                {/* Packages */}
                <a href="#packages" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                    <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-[10px] font-medium">Packages</span>
                </a>

                {/* Center Action Button (Prayer Times) */}
                <div className="relative -top-5">
                    <button 
                        onClick={() => setPrayerTimesOpen(!isPrayerTimesOpen)}
                        className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_0_15px_rgba(197,164,126,0.5)] border-4 border-[#0B0F19] relative z-10 transform transition-transform active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L4.5 6.5L5.5 22H8.5V16H15.5V22H18.5L19.5 6.5L12 2Z M12 5.8L16.2 8.2L15.8 14H8.2L7.8 8.2L12 5.8Z" />
                        </svg>
                        <span className="text-[8px] font-bold uppercase tracking-wider">Prayers</span>
                    </button>
                </div>

                {/* WhatsApp */}
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-green-500 transition-colors">
                    <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.45L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.803 6.22l-1.02 3.712 3.745-1.017z"/>
                    </svg>
                    <span className="text-[10px] font-medium">Chat</span>
                </a>

                {/* Settings / Theme */}
                <button 
                    onClick={() => setThemeSettingsOpen(true)}
                    className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-[var(--color-secondary)] transition-colors"
                >
                    <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[10px] font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
};

export default MobileBottomNav;

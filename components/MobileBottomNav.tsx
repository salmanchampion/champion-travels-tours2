
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
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B0F19] border-t border-gray-800 z-[90] pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
            <div className="flex justify-around items-center h-16 px-2 relative">
                
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

                {/* Center Action Button (PRAYERS) - EXACT MATCH TO SCREENSHOT */}
                <div className="relative -top-6">
                    <button 
                        onClick={() => setPrayerTimesOpen(!isPrayerTimesOpen)}
                        className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-gradient-to-b from-[#C5A47E] via-[#8BC34A] to-[#4CAF50] text-white shadow-[0_0_20px_rgba(139,195,74,0.6)] border-4 border-[#0B0F19] transition-transform active:scale-95"
                    >
                        <div className="relative -top-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L4.5 6.5L5.5 22H8.5V16H15.5V22H18.5L19.5 6.5L12 2Z M12 5.8L16.2 8.2L15.8 14H8.2L7.8 8.2L12 5.8Z" />
                            </svg>
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-tighter -mt-2">PRAYERS</span>
                    </button>
                </div>

                {/* Chat / WhatsApp */}
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-green-500 transition-colors">
                    <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="text-[10px] font-medium">Chat</span>
                </a>

                {/* Settings */}
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

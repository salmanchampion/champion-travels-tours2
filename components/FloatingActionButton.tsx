
import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.45L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.803 6.22l-1.02 3.712 3.745-1.017z"/>
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const FloatingActionButton: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { enabled, type, phoneNumber, whatsappMessage } = appData.floatingButton || { enabled: false };

    if (!enabled || !phoneNumber) return null;

    const cleanNumber = phoneNumber.replace(/[^\d+]/g, ''); // Allow digits and plus sign
    
    let href = '#';
    let bgColor = '';
    let hoverColor = '';
    let Icon = null;

    if (type === 'whatsapp') {
        const encodedMessage = encodeURIComponent(whatsappMessage || '');
        href = `https://wa.me/${cleanNumber.replace('+', '')}?text=${encodedMessage}`;
        bgColor = 'bg-[#25D366]';
        hoverColor = 'hover:bg-[#128C7E]';
        Icon = WhatsAppIcon;
    } else {
        href = `tel:${cleanNumber}`;
        bgColor = 'bg-[var(--color-primary)]';
        hoverColor = 'hover:bg-[var(--color-primary-dark)]';
        Icon = PhoneIcon;
    }

    return (
        <a
            href={href}
            target={type === 'whatsapp' ? '_blank' : undefined}
            rel={type === 'whatsapp' ? 'noopener noreferrer' : undefined}
            className={`fixed bottom-6 right-6 z-[100] p-4 rounded-full text-white shadow-2xl transition-transform duration-300 hover:scale-110 animate-bounce-slow ${bgColor} ${hoverColor} flex items-center justify-center`}
            aria-label={type === 'whatsapp' ? 'Chat on WhatsApp' : 'Call Us'}
        >
            <div className="absolute -inset-2 rounded-full bg-inherit opacity-30 animate-ping"></div>
            <div className="relative">
                <Icon />
            </div>
            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s infinite;
                }
            `}</style>
        </a>
    );
};

export default FloatingActionButton;

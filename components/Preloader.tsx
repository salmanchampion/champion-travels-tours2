
import React, { useEffect, useState } from 'react';

const Preloader: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        // Start exit animation after 2.5 seconds
        const timer = setTimeout(() => {
            setExiting(true);
            // Remove component from DOM after animation finishes
            setTimeout(onFinish, 800); 
        }, 2500);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d1117] transition-opacity duration-700 ${exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            
            {/* Bismillah Calligraphy (SVG) */}
            <div className="mb-8 w-64 md:w-80 animate-fade-in-down">
                <svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg" fill="none">
                    <path 
                        d="M250 30 Q350 10 450 30 T 480 50 M20 50 Q100 10 250 30" 
                        stroke="#C5A47E" 
                        strokeWidth="2" 
                        fill="none" 
                        className="animate-draw-line"
                    />
                    <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="#C5A47E" fontSize="30" fontFamily="serif" className="opacity-0 animate-fade-in-slow">
                        ﷽
                    </text>
                    <text x="50%" y="90%" dominantBaseline="middle" textAnchor="middle" fill="#9CA3AF" fontSize="14" letterSpacing="0.2em" className="opacity-0 animate-fade-in-up-delayed">
                        IN THE NAME OF ALLAH
                    </text>
                </svg>
            </div>

            {/* Pulsing Logo Placeholder */}
            <div className="relative">
                <div className="absolute -inset-4 bg-[var(--color-primary)]/20 rounded-full blur-xl animate-pulse"></div>
                <div className="w-20 h-20 relative flex items-center justify-center">
                     <svg className="w-16 h-16 text-[var(--color-primary)] animate-pulse-slow" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 2L4.5 6.5L5.5 22H8.5V16H15.5V22H18.5L19.5 6.5L12 2Z M12 5.8L16.2 8.2L15.8 14H8.2L7.8 8.2L12 5.8Z" />
                    </svg>
                </div>
            </div>

            {/* Loading Bar */}
            <div className="mt-10 w-48 h-0.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent w-full animate-shimmer-fast"></div>
            </div>

            <style>{`
                @keyframes shimmer-fast {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer-fast {
                    animation: shimmer-fast 1s infinite linear;
                }
                @keyframes fade-in-slow {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-fade-in-slow {
                    animation: fade-in-slow 2s ease-out forwards;
                }
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translateY(-20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 1s ease-out forwards;
                }
                @keyframes fade-in-up-delayed {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up-delayed {
                    animation: fade-in-up-delayed 1s ease-out 1s forwards;
                }
                /* Stroke animation for SVG path */
                .animate-draw-line {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    animation: drawLine 2s ease-out forwards;
                }
                @keyframes drawLine {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </div>
    );
};

export default Preloader;

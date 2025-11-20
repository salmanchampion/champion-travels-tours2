
import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

const TimeBox: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2 sm:mx-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 glass-card flex items-center justify-center rounded-[var(--ui-border-radius)] border border-[var(--color-primary)]/30 shadow-[0_0_15px_rgba(197,164,126,0.2)] backdrop-blur-md bg-black/20">
            <span className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-[var(--color-primary)] animate-pulse-slow">
                {value < 10 ? `0${value}` : value}
            </span>
        </div>
        <span className="text-xs sm:text-sm uppercase tracking-widest text-[var(--color-light-text)] mt-2 font-medium">{label}</span>
    </div>
);

const CountdownTimer: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { specialOffer } = appData.pages.home;
    
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        if (!specialOffer?.enabled || !specialOffer?.endDate) return;

        const calculateTimeLeft = () => {
            const difference = +new Date(specialOffer.endDate) - +new Date();
            
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft(); // Initial call
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [specialOffer]);

    if (!specialOffer || !specialOffer.enabled) return null;

    // Don't show if expired
    if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        // Optional: You could render an "Offer Expired" message here if desired
        return null;
    }

    return (
        <section className="relative py-16 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={specialOffer.backgroundImage} 
                    alt="Special Offer Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/90"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div data-aos="fade-up">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">
                        {specialOffer.title}
                    </h2>
                    <p className="text-lg text-[var(--color-primary)] mb-8 max-w-2xl mx-auto italic">
                        {specialOffer.subtitle}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center mb-10" data-aos="zoom-in" data-aos-delay="200">
                    <TimeBox value={timeLeft.days} label="Days" />
                    <TimeBox value={timeLeft.hours} label="Hours" />
                    <TimeBox value={timeLeft.minutes} label="Minutes" />
                    <TimeBox value={timeLeft.seconds} label="Seconds" />
                </div>

                <div data-aos="fade-up" data-aos-delay="400">
                    <a 
                        href={specialOffer.buttonLink} 
                        className="inline-block bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold py-4 px-10 rounded-full text-xl shadow-[0_0_20px_rgba(197,164,126,0.4)] hover:shadow-[0_0_30px_rgba(197,164,126,0.6)] transform hover:-translate-y-1 transition-all duration-300 animate-bounce-slow"
                    >
                        {specialOffer.buttonText}
                    </a>
                </div>
            </div>
            <style>{`
                .animate-pulse-slow {
                    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </section>
    );
};

export default CountdownTimer;

import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

interface PrayerTimes {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

const MosqueIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L4.5 6.5L5.5 22H8.5V16H15.5V22H18.5L19.5 6.5L12 2Z M12 5.8L16.2 8.2L15.8 14H8.2L7.8 8.2L12 5.8Z" />
        <circle cx="12" cy="11" r="1.5" />
    </svg>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const CloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
);

const RainIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
     </svg>
);

const PrayerTimesWidget: React.FC = () => {
    const { appData, isPrayerTimesOpen, setPrayerTimesOpen } = useContext(DataContext);
    
    const config = appData?.prayerTimes || { enabled: false, title: "Prayer Times", locations: [] };
    const { enabled, title, locations } = config;

    const [activeLocationIndex, setActiveLocationIndex] = useState(0);
    const [timings, setTimings] = useState<PrayerTimes | null>(null);
    const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
    const [loading, setLoading] = useState(false);

    // Filter only enabled locations
    const visibleLocations = locations.filter(loc => loc.enabled);
    // Fallback if no locations are enabled or available
    const activeLocation = visibleLocations[activeLocationIndex] || { name: 'Makkah', city: 'Makkah', country: 'Saudi Arabia' };

    // Static fallback data to use if API fails
    const fallbackTimings: Record<string, PrayerTimes> = {
        'Makkah': { Fajr: "05:15", Dhuhr: "12:20", Asr: "15:40", Maghrib: "18:10", Isha: "19:40" },
        'Madinah': { Fajr: "05:20", Dhuhr: "12:25", Asr: "15:45", Maghrib: "18:15", Isha: "19:45" },
        'Dhaka': { Fajr: "04:45", Dhuhr: "12:05", Asr: "15:30", Maghrib: "18:00", Isha: "19:15" },
        'default': { Fajr: "05:00", Dhuhr: "12:00", Asr: "15:30", Maghrib: "18:00", Isha: "19:30" }
    };

    // Helper: Map display names to Aladhan API friendly names
    const getApiCityName = (name: string, originalCity: string) => {
        const n = (name || '').toLowerCase();
        if (n.includes('makkah') || n.includes('mecca')) return 'Makkah';
        if (n.includes('madinah') || n.includes('medina')) return 'Madinah';
        if (n.includes('dhaka')) return 'Dhaka';
        return originalCity ? originalCity.split(' ')[0] : 'Makkah';
    };

    const fetchWeather = async (city: string) => {
        try {
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
            if (!geoRes.ok) return; // Silent fail
            const geoData = await geoRes.json();
            
            if (geoData.results && geoData.results.length > 0) {
                const { latitude, longitude } = geoData.results[0];
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                if (!weatherRes.ok) return; // Silent fail
                const weatherData = await weatherRes.json();
                
                if(weatherData.current_weather) {
                    setWeather({ 
                        temp: Math.round(weatherData.current_weather.temperature), 
                        code: weatherData.current_weather.weathercode 
                    });
                }
            }
        } catch (e) {
            // Ignore weather errors to prevent widget breakage
            setWeather(null);
        }
    };

    useEffect(() => {
        if (!enabled || !isPrayerTimesOpen) return;

        const fetchData = async () => {
            setLoading(true);
            setTimings(null);
            setWeather(null);

            const apiCity = getApiCityName(activeLocation.name, activeLocation.city);
            const apiCountry = activeLocation.country || 'Saudi Arabia';
            
            // Parallel fetch for weather (non-blocking)
            fetchWeather(apiCity);

            try {
                // Determine calculation method:
                // 1: Karachi (for South Asia)
                // 4: Umm Al-Qura (for Makkah/Saudi)
                // 3: Muslim World League (Default)
                let method = 3; 
                const c = apiCountry.toLowerCase();
                if (c.includes('saudi') || apiCity === 'Makkah' || apiCity === 'Madinah') method = 4;
                else if (c.includes('bangladesh') || c.includes('india')) method = 1;

                // Using standard endpoint that defaults to today
                const response = await fetch(
                    `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(apiCity)}&country=${encodeURIComponent(apiCountry)}&method=${method}`
                );

                if (!response.ok) {
                    throw new Error(`Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.code === 200 && data.data && data.data.timings) {
                    setTimings({
                        Fajr: data.data.timings.Fajr,
                        Dhuhr: data.data.timings.Dhuhr,
                        Asr: data.data.timings.Asr,
                        Maghrib: data.data.timings.Maghrib,
                        Isha: data.data.timings.Isha,
                    });
                } else {
                    throw new Error('Invalid data');
                }
            } catch (err) {
                console.warn("Using fallback prayer times due to error:", err);
                // Silently fallback to static data
                const fallback = fallbackTimings[apiCity] || fallbackTimings['default'];
                setTimings(fallback);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isPrayerTimesOpen, activeLocationIndex, enabled, activeLocation]);

    const getWeatherIconComponent = (code: number) => {
        if (code <= 3) return <SunIcon />;
        if (code < 60) return <CloudIcon />;
        return <RainIcon />;
    };

    if (!enabled || visibleLocations.length === 0) return null;

    return (
        <div className={`fixed z-[100] flex flex-col items-start transition-all duration-300 ${isPrayerTimesOpen ? 'bottom-20 left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-6 md:left-6' : 'bottom-6 left-6'}`}>
            
            {/* Widget Popup */}
            <div 
                className={`mb-4 bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] shadow-2xl overflow-hidden transition-all duration-300 origin-bottom border border-gray-700 w-80 md:w-72 ${isPrayerTimesOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 h-0 pointer-events-none'}`}
            >
                {/* Header */}
                <div className="bg-[var(--color-primary)] p-3 relative">
                    <button onClick={() => setPrayerTimesOpen(false)} className="absolute top-2 right-2 text-white/80 hover:text-white md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                    <div className="flex justify-between items-center mb-1">
                         <h3 className="text-white font-display font-bold text-xl">{title}</h3>
                         {weather && (
                             <div className="flex items-center bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm animate-fade-in">
                                 {getWeatherIconComponent(weather.code)}
                                 <span className="text-white font-bold text-sm ml-1">{weather.temp}°C</span>
                             </div>
                         )}
                    </div>
                    <p className="text-white/80 text-xs text-center">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-700 overflow-x-auto no-scrollbar">
                    {visibleLocations.map((loc, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveLocationIndex(idx)}
                            className={`flex-1 py-2 px-3 text-sm font-medium whitespace-nowrap transition-colors ${
                                activeLocationIndex === idx 
                                    ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] bg-[var(--color-dark-bg)]' 
                                    : 'text-[var(--color-muted-text)] hover:text-white hover:bg-[var(--color-dark-bg)]/50'
                            }`}
                        >
                            {loc.name}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-4 min-h-[220px] flex flex-col justify-center relative">
                    {loading ? (
                         <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-[var(--color-light-bg)] z-10">
                            <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs text-[var(--color-muted-text)]">Updating times...</p>
                        </div>
                    ) : timings ? (
                        <div className="space-y-2 w-full animate-fade-in-up">
                            {Object.entries(timings).map(([name, time]) => (
                                <div key={name} className="flex justify-between items-center p-2 rounded hover:bg-[var(--color-dark-bg)] transition-colors border-b border-gray-700/30 last:border-0">
                                    <span className="text-[var(--color-light-text)] font-medium text-sm">{name}</span>
                                    <span className="text-[var(--color-primary)] font-bold text-base">{time}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-[var(--color-muted-text)]">
                            <p>Data unavailable.</p>
                        </div>
                    )}
                </div>
                 <div className="p-2 bg-[var(--color-dark-bg)] text-center border-t border-gray-700 flex justify-between items-center px-4">
                    <p className="text-[10px] text-[var(--color-muted-text)]">Source: Aladhan</p>
                    <p className="text-[10px] text-[var(--color-muted-text)]">Weather: Open-Meteo</p>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setPrayerTimesOpen(!isPrayerTimesOpen)}
                className="hidden md:flex p-4 rounded-full text-white shadow-2xl transition-transform duration-300 hover:scale-110 bg-[var(--color-secondary)] hover:bg-green-700 items-center justify-center relative group z-50 border-2 border-[var(--color-dark-bg)]"
                aria-label="Toggle Prayer Times"
            >
                <div className="absolute -inset-1 rounded-full bg-inherit opacity-20 animate-pulse group-hover:animate-none"></div>
                <div className="relative">
                    {isPrayerTimesOpen ? (
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <MosqueIcon />
                    )}
                </div>
            </button>
        </div>
    );
};

export default PrayerTimesWidget;
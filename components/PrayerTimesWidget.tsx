
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
    const { enabled, title, locations } = appData.prayerTimes || { enabled: false, locations: [] };

    const [activeLocationIndex, setActiveLocationIndex] = useState(0);
    const [timings, setTimings] = useState<PrayerTimes | null>(null);
    const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const activeLocation = locations[activeLocationIndex];
    const visibleLocations = locations.filter(loc => loc.enabled);

    useEffect(() => {
        // If current active location is disabled, switch to the first enabled one
        if (visibleLocations.length > 0 && !visibleLocations.find(l => l.name === activeLocation?.name)) {
             const newIndex = locations.findIndex(l => l.name === visibleLocations[0].name);
             setActiveLocationIndex(newIndex);
        }
    }, [locations, visibleLocations, activeLocation]);

    const fetchWeather = async (city: string) => {
        try {
            // Geocoding to get lat/long
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
            const geoData = await geoRes.json();
            
            if (geoData.results && geoData.results.length > 0) {
                const { latitude, longitude } = geoData.results[0];
                // Weather data
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                const weatherData = await weatherRes.json();
                
                if(weatherData.current_weather) {
                    setWeather({ 
                        temp: Math.round(weatherData.current_weather.temperature), 
                        code: weatherData.current_weather.weathercode 
                    });
                }
            }
        } catch (e) {
            console.warn("Weather fetch failed", e);
            setWeather(null);
        }
    };

    useEffect(() => {
        if (!enabled || !isPrayerTimesOpen || !activeLocation || !activeLocation.enabled) return;

        const fetchPrayerTimesAndWeather = async () => {
            setLoading(true);
            setError(false);
            setTimings(null);
            setWeather(null);

            // Fetch Weather in parallel (non-blocking for prayer times)
            fetchWeather(activeLocation.city);

            try {
                const date = new Date();
                const dateString = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                
                // Determine method based on country
                let method = 2;
                if (activeLocation.country.toLowerCase().includes('saudi')) method = 4;
                if (activeLocation.country.toLowerCase().includes('bangladesh')) method = 1;

                const response = await fetch(
                    `https://api.aladhan.com/v1/timingsByCity/${dateString}?city=${activeLocation.city}&country=${activeLocation.country}&method=${method}`
                );
                const data = await response.json();

                if (data.code === 200 && data.data) {
                    setTimings({
                        Fajr: data.data.timings.Fajr,
                        Dhuhr: data.data.timings.Dhuhr,
                        Asr: data.data.timings.Asr,
                        Maghrib: data.data.timings.Maghrib,
                        Isha: data.data.timings.Isha,
                    });
                } else {
                    setError(true);
                }
            } catch (e) {
                console.error("Failed to fetch prayer times", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPrayerTimesAndWeather();
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
                className={`mb-4 bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] shadow-2xl overflow-hidden transition-all duration-300 origin-bottom border border-gray-700 w-80 md:w-72 ${isPrayerTimesOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 h-0'}`}
            >
                {/* Header */}
                <div className="bg-[var(--color-primary)] p-3 relative">
                    <button onClick={() => setPrayerTimesOpen(false)} className="absolute top-2 right-2 text-white/80 hover:text-white md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                    <div className="flex justify-between items-center mb-1">
                         <h3 className="text-white font-display font-bold text-xl">{title}</h3>
                         {weather && (
                             <div className="flex items-center bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                                 {getWeatherIconComponent(weather.code)}
                                 <span className="text-white font-bold text-sm ml-1">{weather.temp}°C</span>
                             </div>
                         )}
                    </div>
                    <p className="text-white/80 text-xs text-center">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-700 overflow-x-auto no-scrollbar">
                    {visibleLocations.map((loc) => {
                        // Find original index
                        const originalIndex = locations.findIndex(l => l.name === loc.name);
                        return (
                            <button
                                key={loc.name}
                                onClick={() => setActiveLocationIndex(originalIndex)}
                                className={`flex-1 py-2 px-3 text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeLocationIndex === originalIndex 
                                        ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] bg-[var(--color-dark-bg)]' 
                                        : 'text-[var(--color-muted-text)] hover:text-white hover:bg-[var(--color-dark-bg)]/50'
                                }`}
                            >
                                {loc.name}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="p-4 min-h-[200px]">
                    {loading ? (
                         <div className="flex flex-col items-center justify-center h-40 space-y-2">
                            <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs text-[var(--color-muted-text)]">Loading data...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center">
                            <p className="text-red-400 text-sm mb-2">Unable to load data.</p>
                            <button onClick={() => setPrayerTimesOpen(false)} className="text-xs underline text-[var(--color-muted-text)]">Close</button>
                        </div>
                    ) : timings ? (
                        <div className="space-y-2">
                            {Object.entries(timings).map(([name, time]) => (
                                <div key={name} className="flex justify-between items-center p-2 rounded hover:bg-[var(--color-dark-bg)] transition-colors">
                                    <span className="text-[var(--color-light-text)] font-medium">{name}</span>
                                    <span className="text-[var(--color-primary)] font-bold">{time}</span>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
                 <div className="p-2 bg-[var(--color-dark-bg)] text-center border-t border-gray-700 flex justify-between items-center px-4">
                    <p className="text-[10px] text-[var(--color-muted-text)]">Times: Aladhan</p>
                    <p className="text-[10px] text-[var(--color-muted-text)]">Weather: Open-Meteo</p>
                </div>
            </div>

            {/* Toggle Button (Desktop Only - Hidden on Mobile) */}
            <button
                onClick={() => setPrayerTimesOpen(!isPrayerTimesOpen)}
                className="hidden md:flex p-4 rounded-full text-white shadow-2xl transition-transform duration-300 hover:scale-110 bg-[var(--color-secondary)] hover:bg-green-700 items-center justify-center relative group"
                aria-label="Prayer Times"
            >
                <div className="absolute -inset-2 rounded-full bg-inherit opacity-20 animate-pulse group-hover:animate-none"></div>
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

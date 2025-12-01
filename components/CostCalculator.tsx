
import React, { useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

const CostCalculator: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { floatingButton } = appData;

    const [days, setDays] = useState(10);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [hotelType, setHotelType] = useState<'economy' | '3star' | '5star'>('3star');
    const [flightType, setFlightType] = useState<'direct' | 'transit'>('direct');

    // Base Rates (Approximate BDT) - This could be moved to Admin later
    const rates = {
        visa: 25000,
        flight: { direct: 65000, transit: 55000 },
        hotelPerNight: { // Per person approx based on sharing
            economy: 1500, 
            '3star': 3500, 
            '5star': 12000 
        },
        transport: 5000, // Fixed cost per person
        serviceCharge: 5000
    };

    const calculateTotal = () => {
        const flightCost = rates.flight[flightType];
        const hotelCost = rates.hotelPerNight[hotelType] * days;
        const perPersonCost = rates.visa + flightCost + hotelCost + rates.transport + rates.serviceCharge;
        
        const totalAdults = perPersonCost * adults;
        const totalChildren = (perPersonCost * 0.85) * children; // 15% less for children approx (excluding infant logic for simplicity)

        return totalAdults + totalChildren;
    };

    const totalCost = calculateTotal();

    const handleWhatsAppInquiry = () => {
        const phoneNumber = floatingButton?.phoneNumber?.replace(/[^\d]/g, '') || '8801718425042';
        const message = `Assalamualaikum, I used the Cost Estimator on your website.
        
*Custom Umrah Plan:*
- Duration: ${days} Days
- Travelers: ${adults} Adults, ${children} Children
- Hotel: ${hotelType === '5star' ? '5 Star Luxury' : hotelType === '3star' ? '3 Star Standard' : 'Economy Saver'}
- Flight: ${flightType.toUpperCase()}
-------------------------
*Estimated Budget: ~${totalCost.toLocaleString()} BDT*

I am interested in booking this. Please confirm final rates.`;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <section className="py-20 bg-[var(--color-dark-bg)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-secondary)]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-sm">Plan Your Budget</span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mt-2">Smart Umrah Estimator</h2>
                    <p className="text-[var(--color-muted-text)] mt-4 max-w-2xl mx-auto">
                        Customize your package and get an approximate budget instantly. Send the quote directly to us for booking.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl mx-auto">
                    
                    {/* Controls */}
                    <div className="w-full lg:w-2/3 bg-[var(--color-light-bg)] p-6 md:p-8 rounded-[var(--ui-border-radius)] border border-gray-700 shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Duration */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="flex justify-between text-white font-bold mb-4">
                                    <span>Duration of Stay</span>
                                    <span className="text-[var(--color-primary)]">{days} Days</span>
                                </label>
                                <input 
                                    type="range" 
                                    min="7" 
                                    max="30" 
                                    value={days} 
                                    onChange={(e) => setDays(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>7 Days</span>
                                    <span>14 Days</span>
                                    <span>21 Days</span>
                                    <span>30 Days</span>
                                </div>
                            </div>

                            {/* Travelers */}
                            <div>
                                <label className="block text-white font-bold mb-3">Travelers</label>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <span className="text-xs text-gray-400 block mb-1">Adults (12+)</span>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            value={adults}
                                            onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value)))}
                                            className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-lg p-3 text-white focus:border-[var(--color-primary)] outline-none"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-xs text-gray-400 block mb-1">Children (2-11)</span>
                                        <input 
                                            type="number" 
                                            min="0" 
                                            value={children}
                                            onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value)))}
                                            className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-lg p-3 text-white focus:border-[var(--color-primary)] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Flight */}
                            <div>
                                <label className="block text-white font-bold mb-3">Flight Type</label>
                                <div className="flex bg-[var(--color-dark-bg)] p-1 rounded-lg border border-gray-600">
                                    <button 
                                        onClick={() => setFlightType('direct')}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${flightType === 'direct' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Direct
                                    </button>
                                    <button 
                                        onClick={() => setFlightType('transit')}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${flightType === 'transit' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Transit
                                    </button>
                                </div>
                            </div>

                            {/* Hotel Class */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-white font-bold mb-3">Accommodation Standard</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <button 
                                        onClick={() => setHotelType('economy')}
                                        className={`p-4 rounded-xl border-2 transition-all text-center ${hotelType === 'economy' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white' : 'border-gray-700 bg-[var(--color-dark-bg)] text-gray-400 hover:border-gray-500'}`}
                                    >
                                        <div className="font-bold mb-1">Economy</div>
                                        <div className="text-[10px] opacity-70">Distance: >1km</div>
                                    </button>
                                    <button 
                                        onClick={() => setHotelType('3star')}
                                        className={`p-4 rounded-xl border-2 transition-all text-center ${hotelType === '3star' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white' : 'border-gray-700 bg-[var(--color-dark-bg)] text-gray-400 hover:border-gray-500'}`}
                                    >
                                        <div className="font-bold mb-1">3 Star / Standard</div>
                                        <div className="text-[10px] opacity-70">Distance: 400m-800m</div>
                                    </button>
                                    <button 
                                        onClick={() => setHotelType('5star')}
                                        className={`p-4 rounded-xl border-2 transition-all text-center ${hotelType === '5star' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white' : 'border-gray-700 bg-[var(--color-dark-bg)] text-gray-400 hover:border-gray-500'}`}
                                    >
                                        <div className="font-bold mb-1">5 Star / VIP</div>
                                        <div className="text-[10px] opacity-70">Distance: 0m (Clock Tower)</div>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Result Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-gradient-to-b from-[var(--color-primary)] to-[#8B6E4E] p-1 rounded-[var(--ui-border-radius)] shadow-2xl h-full">
                            <div className="bg-[#111827] h-full rounded-[calc(var(--ui-border-radius)-4px)] p-6 flex flex-col relative overflow-hidden">
                                {/* Decorative Texture */}
                                <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/arabesque.png')] opacity-5 pointer-events-none"></div>
                                
                                <h3 className="text-xl font-display font-bold text-white mb-6 text-center border-b border-gray-700 pb-4">Estimated Budget</h3>
                                
                                <div className="space-y-4 mb-8 flex-grow text-sm text-gray-300">
                                    <div className="flex justify-between">
                                        <span>Visa & Processing</span>
                                        <span>Included</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Flight ({flightType})</span>
                                        <span>Included</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Hotel ({days} Nights)</span>
                                        <span>Included</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Transport & Ziyarat</span>
                                        <span>Included</span>
                                    </div>
                                </div>

                                <div className="text-center mb-8">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Approx. Total Cost</span>
                                    <span className="text-4xl font-bold text-[var(--color-primary)] font-sans">
                                        ৳ {(totalCost / 1000).toFixed(0)}k <span className="text-lg text-gray-500">BDT</span>
                                    </span>
                                    <p className="text-[10px] text-red-400 mt-2">*Prices are subject to flight availability and seasonal changes.</p>
                                </div>

                                <button 
                                    onClick={handleWhatsAppInquiry}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.45L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.803 6.22l-1.02 3.712 3.745-1.017z"/></svg>
                                    Get Exact Quote on WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CostCalculator;

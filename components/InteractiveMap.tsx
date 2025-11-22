
import React, { useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { MapLocation } from '../types';

const InteractiveMap: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { interactiveMap } = appData.pages.home;
  
  if (!interactiveMap || interactiveMap.enabled === false) return null;

  const { cities } = interactiveMap;
  const cityKeys = Object.keys(cities) as Array<keyof typeof cities>;
  
  const [activeCity, setActiveCity] = useState<keyof typeof cities>(cityKeys[0] || 'Makkah');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  const currentData = cities[activeCity];

  if (!currentData) return null;

  return (
    <section className="py-10 md:py-20 bg-[var(--color-dark-bg)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* City Toggle */}
        <div className="flex justify-center mb-12" data-aos="fade-up">
          <div className="glass-card p-2 rounded-full inline-flex shadow-[var(--ui-shadow)]">
            {cityKeys.map((city) => (
              <button
                key={city}
                onClick={() => { setActiveCity(city); setSelectedLocation(null); }}
                className={`px-8 py-3 rounded-full font-display font-bold tracking-wide transition-all duration-300 text-lg ${
                  activeCity === city
                    ? 'bg-[var(--color-primary)] text-white shadow-lg transform scale-105'
                    : 'text-[var(--color-muted-text)] hover:text-white'
                }`}
              >
                {city === 'Makkah' ? 'মক্কা' : city === 'Madinah' ? 'মদিনা' : city}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[600px]">
          
          {/* Map Area */}
          <div 
            className="lg:col-span-2 relative rounded-[var(--ui-border-radius)] overflow-hidden shadow-2xl border-2 border-gray-700/50 group bg-black h-[500px] lg:h-full"
            data-aos="zoom-in"
          >
             {/* Background Map/Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-80"
                style={{ backgroundImage: `url('${currentData.mapImage}')` }}
            >
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
            </div>
            
            {/* Floating Label */}
            <div className="absolute top-6 left-6 glass-card px-5 py-3 rounded-lg border border-white/10 z-20">
                <h3 className="text-white font-display text-2xl tracking-wider flex items-center">
                    <svg className="w-6 h-6 mr-2 text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    {currentData.name}
                </h3>
                <p className="text-[var(--color-primary)] text-sm mt-1 font-medium">ইতিহাস জানতে পয়েন্টগুলোতে ক্লিক করুন</p>
            </div>

            {/* Hotspots */}
            {currentData.locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className="absolute w-10 h-10 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group/pin z-30"
                style={{ top: loc.top, left: loc.left }}
                aria-label={`View ${loc.title}`}
              >
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-40 animate-ping"></span>
                <span className={`relative inline-flex rounded-full h-10 w-10 border-2 border-white shadow-[0_0_20px_rgba(197,164,126,0.5)] items-center justify-center transition-all duration-300 ${selectedLocation?.id === loc.id ? 'bg-white scale-110' : 'bg-[var(--color-primary)] hover:scale-110'}`}>
                    {selectedLocation?.id === loc.id ? (
                        <span className="w-3 h-3 bg-[var(--color-primary)] rounded-full"></span>
                    ) : (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    )}
                </span>
                
                {/* Tooltip on Hover */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover/pin:block w-max px-4 py-2 glass-card text-white text-sm font-bold rounded-md backdrop-blur-md whitespace-nowrap z-40 border border-white/10 shadow-lg">
                    {loc.title}
                    <svg className="absolute text-white/10 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                </span>
              </button>
            ))}
          </div>

          {/* Info Card Area */}
          <div className="lg:col-span-1 h-full relative">
             {selectedLocation ? (
                 <div 
                    key={selectedLocation.id} // Key forces re-render for animation
                    className="h-full glass-card rounded-[var(--ui-border-radius)] p-1 flex flex-col animate-fade-in-up border border-white/10"
                 >
                    <div className="bg-[var(--color-dark-bg)]/60 w-full h-full rounded-[calc(var(--ui-border-radius)-4px)] p-6 flex flex-col">
                        <div className="relative h-48 mb-6 rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
                            <img 
                                src={selectedLocation.image} 
                                alt={selectedLocation.title} 
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-bg)] to-transparent opacity-90"></div>
                            <h3 className="absolute bottom-4 left-4 text-2xl font-display font-bold text-white drop-shadow-lg leading-tight">{selectedLocation.title}</h3>
                        </div>
                        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                            <p className="text-[var(--color-light-text)] text-lg leading-relaxed font-light">
                                {selectedLocation.description}
                            </p>
                            
                            <div className="mt-6 pt-6 border-t border-gray-700/50">
                                <h4 className="text-[var(--color-primary)] font-bold mb-2 uppercase text-xs tracking-widest">আধ্যাত্মিক গুরুত্ব</h4>
                                <p className="text-sm text-[var(--color-muted-text)] italic">
                                    "এই স্থানটি দর্শনে রয়েছে অশেষ আধ্যাত্মিক সওয়াব। এখানে অবস্থানকালীন সময়ে আদব রক্ষা করুন এবং বেশি বেশি দোয়া করুন।"
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 pt-4">
                            <a 
                                href={`#contact?subject=Inquiry about Ziyarat to ${selectedLocation.title}`}
                                className="block w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-center font-bold py-3 rounded shadow-lg hover:shadow-[var(--color-primary)]/30 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                ভিজিট প্ল্যান করুন
                            </a>
                        </div>
                    </div>
                 </div>
             ) : (
                 <div className="h-[300px] lg:h-full glass-card border border-dashed border-gray-600 rounded-[var(--ui-border-radius)] flex flex-col items-center justify-center p-8 text-center text-[var(--color-muted-text)] animate-pulse-slow">
                     <div className="w-24 h-24 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-6 animate-bounce-slow border border-[var(--color-primary)]/30">
                        <svg className="w-12 h-12 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                     </div>
                     <h3 className="text-3xl font-display font-bold text-white mb-3">ইতিহাস জানুন</h3>
                     <p className="text-lg font-light">উপরের যেকোনো একটি শহর নির্বাচন করুন এবং ম্যাপের <span className="text-[var(--color-primary)] font-bold">উজ্জ্বল চিহ্নগুলোতে</span> ক্লিক করে পবিত্র ইতিহাস সম্পর্কে জানুন।</p>
                 </div>
             )}
          </div>

        </div>
      </div>
      <style>{`
        .animate-bounce-slow {
            animation: bounce 3s infinite;
        }
        @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
        }
        /* Custom Scrollbar for info panel */
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05); 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--color-primary); 
            border-radius: 10px;
        }
      `}</style>
    </section>
  );
};

export default InteractiveMap;

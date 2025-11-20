
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { HajjPackage, UmrahPackage } from '../data';

// --- Icon Components ---
const PriceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 002 2h5a2 2 0 012 2v5a2 2 0 01-2 2h-5a2 2 0 01-2-2v-5a2 2 0 00-2-2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>;
const DurationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const HotelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M5 7h14" /></svg>;
const FlightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const FoodIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18M3 7h18M3 11h18M3 15h18M3 19h18" /></svg>;
const SpecialIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 1 1-4 6.293-6.293a1 1 0 011.414 0z" /></svg>;
const NoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>;
const DateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

// --- Type Extensions for Filtering ---
interface EnhancedUmrahPackage extends UmrahPackage {
    flightType: string;
    hotelProximity: string;
}

// --- Skeleton Card for Loading State ---
const SkeletonCard: React.FC = () => (
    <div className="bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] shadow-[var(--ui-shadow)] border border-gray-700 flex flex-col h-full overflow-hidden">
        <div className="bg-[var(--color-dark-bg)] h-48 w-full animate-pulse"></div>
        <div className="bg-[var(--color-light-bg)] p-4">
            <div className="bg-gray-700 h-6 w-3/4 mx-auto rounded animate-pulse"></div>
        </div>
        <div className="p-4 flex-grow space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <div className="bg-gray-700 h-4 w-1/4 rounded animate-pulse"></div>
                    <div className="bg-gray-700 h-4 w-3/4 rounded animate-pulse"></div>
                </div>
            ))}
        </div>
        <div className="p-4 mt-auto">
            <div className="bg-gray-700 h-12 w-full rounded-[var(--ui-button-radius)] animate-pulse"></div>
        </div>
    </div>
);


// --- Hajj Card Detail Row Component ---
const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: any; }> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3 py-2 border-b border-gray-700 last:border-b-0">
        <div className="flex-shrink-0 pt-1">{icon}</div>
        <div className="flex-grow">
            <p className="text-sm font-semibold text-[var(--color-light-text)]">{label}</p>
            <p className="text-sm text-[var(--color-muted-text)]">{String(value || '')}</p>
        </div>
    </div>
);

// Helper for the new Hajj Card grid layout
const GridDetail: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-2">
        <div className="flex-shrink-0 text-[var(--color-primary)] pt-1">{icon}</div>
        <div>
            <p className="text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wider">{label}</p>
            <p className="text-sm text-[var(--color-light-text)] font-medium">{value}</p>
        </div>
    </div>
);


// --- Hajj Package Card Component (NEW DESIGN) ---
const HajjPackageCard: React.FC<{ pkg: HajjPackage }> = ({ pkg }) => (
    <div data-aos="fade-up" className="bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] shadow-[var(--ui-shadow)] border border-transparent hover:border-[var(--color-primary)] flex flex-col h-full text-[var(--color-light-text)] overflow-hidden transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1">
        <div className="relative group">
            <img src={pkg.image} alt={pkg.name} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-xl font-bold font-display text-white">{pkg.name}</h3>
            </div>
        </div>
        
        <div className="p-6 flex-grow flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
                <div>
                    <p className="text-xs font-bold text-[var(--color-muted-text)] uppercase">Price</p>
                    <p className="text-2xl font-bold text-[var(--color-primary)]">{pkg.price}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-[var(--color-muted-text)] uppercase">Duration</p>
                    <p className="text-lg font-semibold text-white">{pkg.duration}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <GridDetail icon={<HotelIcon />} label="Makkah Hotel" value={pkg.hotelMakkah} />
                <GridDetail icon={<HotelIcon />} label="Madinah Hotel" value={pkg.hotelMadinah} />
                <GridDetail icon={<FlightIcon />} label="Flights Up" value={pkg.flightsUp} />
                <GridDetail icon={<FlightIcon />} label="Flights Down" value={pkg.flightsDown} />
                <GridDetail icon={<FoodIcon />} label="Food" value={pkg.food} />
                <GridDetail icon={<SpecialIcon />} label="Special" value={pkg.special} />
            </div>

            {pkg.note && (
                <div className="mt-auto pt-4 border-t border-gray-700">
                     <div className="flex items-start space-x-2 text-[var(--color-muted-text)]">
                        <div className="flex-shrink-0 pt-1"><NoteIcon /></div>
                        <p className="text-xs italic">{pkg.note}</p>
                    </div>
                </div>
            )}
        </div>

        <div className="p-4 bg-[var(--color-dark-bg)] mt-auto">
             <a href={`#contact?subject=${encodeURIComponent(`Booking Inquiry: Hajj - ${pkg.name}`)}`} className="w-full text-center block bg-[var(--color-primary)] text-white font-bold py-3 px-6 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] transition-all duration-300">
                Book Now
            </a>
        </div>
    </div>
);

// --- Hajj Pre-Registration Card ---
const HajjPreRegistrationCard: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { hajjPreRegistration } = appData.pages.packages;
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (isClicked) return; // Prevent multiple clicks

        setIsClicked(true);
        setTimeout(() => {
            window.location.hash = `#contact?subject=${encodeURIComponent(hajjPreRegistration.inquirySubject)}`;
        }, 2000); // 2-second delay for redirect
    };

    return (
        <div data-aos="fade-up" className="bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] shadow-[var(--ui-shadow)] overflow-hidden flex flex-col h-full border border-gray-700 text-[var(--color-light-text)] col-span-1 md:col-span-2 lg:col-span-1">
          <div className="relative bg-[var(--color-dark-bg)] h-48 flex items-center justify-center p-4">
            <img 
              src={hajjPreRegistration.image}
              alt="Hajj Pre Registration" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-2xl font-bold text-[var(--color-secondary)] mb-3 font-display">{hajjPreRegistration.title}</h3>
            <p className="text-base text-[var(--color-muted-text)] mb-2 leading-relaxed">
              {hajjPreRegistration.description}
            </p>
            <p className="text-base text-[var(--color-muted-text)] mb-4 leading-relaxed flex-grow">
             {hajjPreRegistration.subDescription}
            </p>
            
            {isClicked && (
              <div className="text-center text-[var(--color-secondary)] font-semibold mb-4">
                Thank you! Redirecting you to the inquiry form...
              </div>
            )}
            
            <button
              onClick={handleClick}
              disabled={isClicked}
              className="mt-auto w-full block bg-[var(--color-primary)] text-white font-bold py-3 px-6 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] transition-all duration-300 text-center shadow-md disabled:bg-gray-400 disabled:cursor-wait"
            >
              {isClicked ? 'Redirecting...' : hajjPreRegistration.buttonText}
            </button>
          </div>
        </div>
    );
}

const KeyHighlights: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { keyHighlights } = appData.pages.packages;
    return (
    <div data-aos="zoom-in" className="bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] p-6 md:p-10 mt-16 shadow-inner">
        <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-10">{keyHighlights.title}</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                <div className="flex flex-col items-center text-center max-w-xs">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--color-primary)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.284-1.255-.758-1.658M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.284-1.255.758-1.658m0 0A5.986 5.986 0 0112 13a5.986 5.986 0 014.242 1.758m0 0a3 3 0 01-5.356-1.857m0 0a3 3 0 00-5.356-1.857m0 0A5.986 5.986 0 017 13a5.986 5.986 0 01-4.242 1.758M12 13a5 5 0 015 5v2H7v-2a5 5 0 015-5z" /></svg>
                    <p className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)]">{keyHighlights.umrahStat}</p>
                    <p className="text-[var(--color-muted-text)] mt-1">{keyHighlights.umrahStatLabel}</p>
                </div>
                <div className="flex flex-col items-center text-center max-w-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--color-primary)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3" /></svg>
                    <p className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)]">{keyHighlights.hajjStat}</p>
                    <p className="text-[var(--color-muted-text)] mt-1">{keyHighlights.hajjStatLabel}</p>
                </div>
            </div>
        </div>
    </div>
    )
};


// --- Umrah Package Card Component ---
const UmrahPackageCard: React.FC<{ pkg: EnhancedUmrahPackage }> = ({ pkg }) => {
    const { appData } = useContext(DataContext);
    const logo = appData.site.logoUrl || 'https://i.postimg.cc/PJS59Bqw/champion-logo-1.png';

    return (
    <div data-aos="fade-up" className="bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] shadow-[var(--ui-shadow)] border border-gray-700 flex flex-col h-full text-[var(--color-light-text)] overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
        <div className="bg-[var(--color-dark-bg)] p-4 flex items-center justify-between">
            <h3 className="font-bold text-lg font-display text-[var(--color-secondary)]">{pkg.name}</h3>
            <img src={logo} alt='Champion Travels & Tours Logo' className="h-10 w-auto" />
        </div>
        <div className="relative group overflow-hidden h-48">
             <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>
        <div className="p-4 flex-grow">
            <DetailRow icon={<PriceIcon />} label="Price" value={pkg.price} />
            <DetailRow icon={<DateIcon />} label="Date" value={pkg.date} />
            <DetailRow icon={<HotelIcon />} label="Hotel Makkah" value={pkg.hotelMakkah} />
            <DetailRow icon={<HotelIcon />} label="Hotel Madinah" value={pkg.hotelMadinah} />
            <DetailRow icon={<FlightIcon />} label="Flights Up" value={pkg.flightsUp} />
            <DetailRow icon={<FlightIcon />} label="Flights Down" value={pkg.flightsDown} />
            <DetailRow icon={<FoodIcon />} label="Food" value={pkg.food} />
            <DetailRow icon={<SpecialIcon />} label="Special Services" value={pkg.special} />
            <DetailRow icon={<NoteIcon />} label="Note" value={pkg.note} />
        </div>
        <div className="p-4 mt-auto">
             <a href={`#contact?subject=${encodeURIComponent(`Booking Inquiry: Umrah - ${pkg.name}`)}`} className="w-full text-center block bg-[var(--color-primary)] text-white font-bold py-3 px-6 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] transition-all duration-300">
                {pkg.buttonText}
            </a>
        </div>
    </div>
    )
};

// --- Gallery Component ---
const Gallery: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { gallery } = appData.pages.packages;
  return (
    <div className="bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] p-6 md:p-10 mt-16 shadow-inner">
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-display font-bold text-white" data-aos="fade-up">{gallery.title}</h3>
        <p className="mt-4 text-lg text-[var(--color-muted-text)] max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">{gallery.description}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.images.filter(img => img.enabled).map((image, index) => (
          <div key={index} data-aos="zoom-in" data-aos-delay={index * 50} className="overflow-hidden rounded-[var(--ui-border-radius)] shadow-[var(--ui-shadow)] group aspect-square">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Filter Components ---
const FilterInput: React.FC<{ label: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string }> = ({ label, type, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-2 px-3 text-[var(--color-light-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
    </div>
);

const FilterSelect: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }> = ({ label, value, onChange, children }) => (
     <div>
        <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-2 px-3 text-[var(--color-light-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        >
            {children}
        </select>
    </div>
);

const FilterCheckbox: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-2 cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
        />
        <span className="text-[var(--color-light-text)]">{label}</span>
    </label>
);

// --- Custom Hook for Filtering and Sorting ---
const usePackageFilters = <T extends { name: string; price: string; }>(
    initialPackages: T[], 
    durationParser: (pkg: T) => number
) => {
    const [sort, setSort] = useState('default');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minDuration, setMinDuration] = useState('');
    const [maxDuration, setMaxDuration] = useState('');
    const packageTypes = useMemo(() => [...new Set(initialPackages.map(p => p.name))], [initialPackages]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    
    const parsePrice = (priceStr: any) => {
        const str = priceStr?.toString() || '';
        if (!str) return NaN;

        const bengaliNumerals: { [key: string]: string } = {
            '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
            '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
        };

        let englishStr = str.replace(/[০-৯]/g, (match) => bengaliNumerals[match]);
        
        // Remove all non-digit characters (commas, currency symbols, text)
        const numericPart = englishStr.replace(/[^\d]/g, '');

        if (numericPart) {
            return parseInt(numericPart, 10);
        }

        return NaN; // Return NaN if no numeric part is found
    };

    const handleTypeChange = (typeName: string) => {
        setSelectedTypes(prev =>
            prev.includes(typeName)
                ? prev.filter(t => t !== typeName)
                : [...prev, typeName]
        );
    };
    
    const resetFilters = () => {
        setSort('default');
        setMinPrice('');
        setMaxPrice('');
        setMinDuration('');
        setMaxDuration('');
        setSelectedTypes([]);
    };

    const filteredPackages = useMemo(() => {
        let packages = [...initialPackages];

        if (minPrice) packages = packages.filter(p => {
            const price = parsePrice(p.price);
            return !isNaN(price) && price >= Number(minPrice);
        });
        if (maxPrice) packages = packages.filter(p => {
            const price = parsePrice(p.price);
            return !isNaN(price) && price <= Number(maxPrice);
        });
        if (minDuration) packages = packages.filter(p => durationParser(p) >= Number(minDuration));
        if (maxDuration) packages = packages.filter(p => durationParser(p) <= Number(maxDuration));
        if (selectedTypes.length > 0) packages = packages.filter(p => selectedTypes.includes(p.name));
        
        if (sort === 'price-asc') {
             packages.sort((a, b) => {
                const priceA = parsePrice(a.price);
                const priceB = parsePrice(b.price);
                if (isNaN(priceA)) return 1;
                if (isNaN(priceB)) return -1;
                return priceA - priceB;
            });
        } else if (sort === 'price-desc') {
            packages.sort((a, b) => {
                const priceA = parsePrice(a.price);
                const priceB = parsePrice(b.price);
                if (isNaN(priceA)) return 1;
                if (isNaN(priceB)) return -1;
                return priceB - priceA;
            });
        }

        return packages;
    }, [sort, minPrice, maxPrice, minDuration, maxDuration, selectedTypes, initialPackages, durationParser]);
    
    return {
        sort, setSort,
        minPrice, setMinPrice,
        maxPrice, setMaxPrice,
        minDuration, setMinDuration,
        maxDuration, setMaxDuration,
        packageTypes,
        selectedTypes, handleTypeChange,
        resetFilters,
        filteredPackages
    };
};

interface FeaturedPackagesProps {
  showHajjFilters?: boolean;
  showUmrahFilters?: boolean;
  showTitle?: boolean;
}

// --- Main Component ---
const FeaturedPackages: React.FC<FeaturedPackagesProps> = ({ showHajjFilters = false, showUmrahFilters = false, showTitle = true }) => {
    const [loading, setLoading] = useState(true);
    const { appData } = useContext(DataContext);

    const visibleHajjPackages = useMemo(() => appData.hajjPackages.filter(p => p.enabled), [appData.hajjPackages]);
    const visibleUmrahPackages = useMemo(() => appData.umrahPackages.filter(p => p.enabled), [appData.umrahPackages]);

    const homePageData = appData.pages.home.sections.packages;
    const packagesPageData = appData.pages.packages;

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500); // Simulate network delay
        return () => clearTimeout(timer);
    }, []);

    // --- Duration parsing functions ---
    const parseHajjDuration = (pkg: HajjPackage) => {
        const match = pkg.duration.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };
    
    const parseUmrahDuration = (pkg: UmrahPackage) => {
        const match = pkg.date.match(/\((\d+)\s*Days\)/);
        return match ? parseInt(match[1], 10) : 0;
    };

    // --- Use the custom hook for both Hajj and Umrah packages ---
    const {
        sort: hajjSort, setSort: setHajjSort,
        minPrice: hajjMinPrice, setMinPrice: setHajjMinPrice,
        maxPrice: hajjMaxPrice, setMaxPrice: setHajjMaxPrice,
        minDuration: hajjMinDuration, setMinDuration: setHajjMinDuration,
        maxDuration: hajjMaxDuration, setMaxDuration: setHajjMaxDuration,
        packageTypes: hajjPackageTypes,
        selectedTypes: hajjSelectedTypes, handleTypeChange: handleHajjTypeChange,
        resetFilters: resetHajjFilters,
        filteredPackages: filteredHajjPackages
    } = usePackageFilters<HajjPackage>(visibleHajjPackages, parseHajjDuration);
    
    // --- Enhance Umrah packages with filterable properties ---
    const enhancedUmrahPackages = useMemo((): EnhancedUmrahPackage[] => {
        return visibleUmrahPackages.map(pkg => {
            const flightType = (pkg.flightsUp.toLowerCase().includes('transit') || pkg.flightsDown.toLowerCase().includes('transit')) ? 'Transit' : 'Direct';
            
            const distanceMatch = pkg.hotelMakkah.match(/(\d+)\s*m/);
            const distance = distanceMatch ? parseInt(distanceMatch[1], 10) : 9999;
            const hotelProximity = distance <= 300 ? 'Close' : 'Far';

            return {
                ...pkg,
                flightType,
                hotelProximity,
            };
        });
    }, [visibleUmrahPackages]);

    const {
        sort: umrahSort, setSort: setUmrahSort,
        minPrice: umrahMinPrice, setMinPrice: setUmrahMinPrice,
        maxPrice: umrahMaxPrice, setMaxPrice: setUmrahMaxPrice,
        minDuration: umrahMinDuration, setMinDuration: setUmrahMinDuration,
        maxDuration: umrahMaxDuration, setMaxDuration: setUmrahMaxDuration,
        packageTypes: umrahPackageTypes,
        selectedTypes: umrahSelectedTypes, handleTypeChange: handleUmrahTypeChange,
        resetFilters: resetUmrahFilters,
        filteredPackages: filteredUmrahPackages
    } = usePackageFilters<EnhancedUmrahPackage>(enhancedUmrahPackages, parseUmrahDuration);

    const [umrahFlightType, setUmrahFlightType] = useState('all');
    const [umrahHotelProximity, setUmrahHotelProximity] = useState('all');

    const finalFilteredUmrahPackages = useMemo(() => {
        let packages = filteredUmrahPackages;
        if (umrahFlightType !== 'all') {
            packages = packages.filter(p => p.flightType.toLowerCase() === umrahFlightType);
        }
        if (umrahHotelProximity !== 'all') {
            packages = packages.filter(p => p.hotelProximity.toLowerCase() === umrahHotelProximity);
        }
        return packages;
    }, [filteredUmrahPackages, umrahFlightType, umrahHotelProximity]);

    const resetAllUmrahFilters = () => {
        resetUmrahFilters();
        setUmrahFlightType('all');
        setUmrahHotelProximity('all');
    };

    return (
        <section className="py-20 bg-[var(--color-dark-bg)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {showTitle && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-primary)]" data-aos="fade-up">{homePageData.title}</h2>
                        <p className="mt-4 text-lg text-[var(--color-muted-text)] max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">{homePageData.subtitle}</p>
                    </div>
                )}

                {/* --- Hajj Packages Section --- */}
                <div>
                    {showHajjFilters && (
                        <div className="bg-[var(--color-light-bg)] p-6 rounded-[var(--ui-border-radius)] mb-10 shadow-[var(--ui-shadow)]">
                             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-end">
                                <FilterSelect label="Sort by" value={hajjSort} onChange={e => setHajjSort(e.target.value)}>
                                    <option value="default">Default</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </FilterSelect>
                                <FilterInput label="Min Price" type="number" value={hajjMinPrice} onChange={e => setHajjMinPrice(e.target.value)} placeholder="e.g. 500000" />
                                <FilterInput label="Max Price" type="number" value={hajjMaxPrice} onChange={e => setHajjMaxPrice(e.target.value)} placeholder="e.g. 1500000" />
                                <FilterInput label="Min Duration (Days)" type="number" value={hajjMinDuration} onChange={e => setHajjMinDuration(e.target.value)} placeholder="e.g. 15" />
                                <FilterInput label="Max Duration (Days)" type="number" value={hajjMaxDuration} onChange={e => setHajjMaxDuration(e.target.value)} placeholder="e.g. 45" />
                                <button onClick={resetHajjFilters} className="bg-[var(--color-primary)] text-white font-bold py-2 px-4 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] h-10">Reset</button>
                            </div>
                             <div className="mt-4 pt-4 border-t border-gray-700">
                                <h4 className="text-lg font-semibold text-white mb-2">Package Type</h4>
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    {hajjPackageTypes.map(type => (
                                        <FilterCheckbox key={type} label={type} checked={hajjSelectedTypes.includes(type)} onChange={() => handleHajjTypeChange(type)} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {loading ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />) : filteredHajjPackages.map(pkg => <HajjPackageCard key={pkg.name} pkg={pkg} />)}
                        <HajjPreRegistrationCard />
                    </div>
                </div>
                
                <KeyHighlights />

                {/* --- Umrah Packages Section --- */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-primary)]" data-aos="fade-up">{packagesPageData.umrahSection.title}</h2>
                        <p className="mt-4 text-lg text-[var(--color-muted-text)] max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">{packagesPageData.umrahSection.subtitle}</p>
                    </div>
                     {showUmrahFilters && (
                        <div className="bg-[var(--color-light-bg)] p-6 rounded-[var(--ui-border-radius)] mb-10 shadow-[var(--ui-shadow)]">
                             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
                                <FilterSelect label="Sort by" value={umrahSort} onChange={e => setUmrahSort(e.target.value)}>
                                    <option value="default">Default</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </FilterSelect>
                                <FilterInput label="Min Price" type="number" value={umrahMinPrice} onChange={e => setUmrahMinPrice(e.target.value)} placeholder="e.g. 150000" />
                                <FilterInput label="Max Price" type="number" value={umrahMaxPrice} onChange={e => setUmrahMaxPrice(e.target.value)} placeholder="e.g. 300000" />
                                <FilterSelect label="Flight Type" value={umrahFlightType} onChange={e => setUmrahFlightType(e.target.value)}>
                                    <option value="all">All</option>
                                    <option value="direct">Direct</option>
                                    <option value="transit">Transit</option>
                                </FilterSelect>
                                <button onClick={resetAllUmrahFilters} className="bg-[var(--color-primary)] text-white font-bold py-2 px-4 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] h-10">Reset</button>
                            </div>
                             <div className="mt-4 pt-4 border-t border-gray-700">
                                <h4 className="text-lg font-semibold text-white mb-2">Package Type</h4>
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    {umrahPackageTypes.map(type => (
                                        <FilterCheckbox key={type} label={type} checked={umrahSelectedTypes.includes(type)} onChange={() => handleUmrahTypeChange(type)} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />) : finalFilteredUmrahPackages.map(pkg => <UmrahPackageCard key={pkg.name} pkg={pkg} />)}
                    </div>
                </div>

                <Gallery />
            </div>
        </section>
    );
};

export default FeaturedPackages;

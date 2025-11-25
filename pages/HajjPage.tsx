
import React, { useContext, useMemo, useState } from 'react';
import { DataContext } from '../contexts/DataContext';
import PageBanner from '../components/PageBanner';
import { HajjPackage } from '../data';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-2 flex justify-between border-b border-gray-700 last:border-b-0">
        <span className="font-semibold text-[var(--color-muted-text)]">{label}:</span>
        <span className="text-[var(--color-light-text)] text-right">{value}</span>
    </div>
);

const HajjPackageCard: React.FC<{ pkg: HajjPackage; onViewDetails: () => void; }> = ({ pkg, onViewDetails }) => {
    const { addToCompare, compareList, removeFromCompare } = useContext(DataContext);
    const isSelected = compareList.some(p => p.name === pkg.name);
    const safeId = `compare-pg-hajj-${pkg.name.replace(/\s+/g, '_')}`;

    const handleCompare = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            addToCompare(pkg);
        } else {
            removeFromCompare(pkg.name);
        }
    };

    return (
        <div className="bg-[var(--color-light-bg)] rounded-lg shadow-[var(--ui-shadow)] overflow-hidden flex flex-col h-full relative group">
            <img src={pkg.image} alt={pkg.name} className="w-full h-48 object-cover" />
            
            {/* Compare Checkbox */}
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-2 border border-white/10 z-10">
                <input 
                    type="checkbox" 
                    id={safeId} 
                    checked={isSelected}
                    onChange={handleCompare}
                    className="w-3.5 h-3.5 accent-[var(--color-primary)] cursor-pointer"
                />
                <label htmlFor={safeId} className="text-[10px] text-white font-bold cursor-pointer uppercase tracking-wide">Compare</label>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[var(--color-light-text)] mb-2">{pkg.name}</h3>
                <p className="text-[var(--color-muted-text)] text-sm mb-4 flex-grow">{pkg.shortDescription}</p>
                    <div className="flex justify-between items-center text-sm text-[var(--color-muted-text)] mb-4">
                        <span>Starting from</span>
                        <span className="font-bold text-lg text-[var(--color-primary)]">{pkg.price}</span>
                    </div>
                <div className="flex space-x-2 mt-auto">
                    <button 
                        onClick={onViewDetails}
                        className="flex-1 bg-[var(--color-dark-bg)] text-white font-semibold py-2 px-4 rounded-md hover:bg-black/50 transition-colors flex items-center justify-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 1h8v2H6V5zm0 4h8v2H6V9zm0 4h5v2H6v-2z" clipRule="evenodd" /></svg>
                        <span>View Details</span>
                    </button>
                    <a href={`#contact?subject=Inquiry for ${pkg.name}`} className="flex-1 bg-[var(--color-primary)] text-white font-semibold py-2 px-4 rounded-md hover:bg-[var(--color-primary-dark)] transition-colors text-center">
                        Send Query
                    </a>
                </div>
            </div>
        </div>
    );
};

const HajjPage: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { pageBanner, filters } = appData.pages.hajj;
    const hajjPackages = appData.hajjPackages.filter(p => p.enabled);
    const { addToast } = useToast();

    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedPackage, setSelectedPackage] = useState<HajjPackage | null>(null);

    const filteredPackages = useMemo(() => {
        if (activeCategory === 'All') return hajjPackages;
        return hajjPackages.filter(p => p.category === activeCategory);
    }, [activeCategory, hajjPackages]);

    const handleShare = async (pkg: HajjPackage) => {
        const shareData = {
            title: pkg.name,
            text: `Check out this Hajj package: ${pkg.name} - ${pkg.price}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(`${shareData.text} \n ${shareData.url}`);
            addToast('Link copied to clipboard!', 'info');
        }
    };

    return (
        <div className="pt-20 bg-[var(--color-dark-bg)]">
            <PageBanner 
                title={pageBanner.title} 
                subtitle={pageBanner.subtitle} 
                backgroundImage={pageBanner.backgroundImage}
            />

            <div className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    
                     {/* Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
                         <button
                            onClick={() => setActiveCategory('All')}
                            className={`px-4 py-2 text-sm md:text-base font-semibold rounded-lg shadow-sm transition-all duration-300 flex items-center space-x-2 ${
                                activeCategory === 'All'
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'bg-[var(--color-light-bg)] text-[var(--color-light-text)] hover:bg-[var(--color-dark-bg)]'
                            }`}
                        >
                            <span>All Packages</span>
                        </button>
                        {filters.map(filter => (
                            <button
                                key={filter.category}
                                onClick={() => setActiveCategory(filter.category)}
                                className={`px-4 py-2 text-sm md:text-base font-semibold rounded-lg shadow-sm transition-all duration-300 flex items-center space-x-2 ${
                                    activeCategory === filter.category
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-[var(--color-light-bg)] text-[var(--color-light-text)] hover:bg-[var(--color-dark-bg)]'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} dangerouslySetInnerHTML={{ __html: filter.icon }} />
                                <span>{filter.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Packages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredPackages.map(pkg => (
                            <HajjPackageCard key={pkg.name} pkg={pkg} onViewDetails={() => setSelectedPackage(pkg)} />
                        ))}
                    </div>

                     {filteredPackages.length === 0 && (
                        <div className="text-center col-span-full py-16">
                            <p className="text-[var(--color-muted-text)] text-xl">No packages found for this category.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {selectedPackage && (
                <Modal isOpen={!!selectedPackage} onClose={() => setSelectedPackage(null)}>
                    <div className="p-2 text-[var(--color-light-text)]">
                        <div className="relative">
                            <img src={selectedPackage.image} alt={selectedPackage.name} className="w-full h-56 object-cover rounded-lg mb-4" />
                            <button 
                                onClick={() => handleShare(selectedPackage)}
                                className="absolute top-3 right-3 bg-black/60 p-2 rounded-full hover:bg-[var(--color-primary)] text-white transition-colors"
                                title="Share Package"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                            </button>
                        </div>
                        <h2 className="text-3xl font-bold text-white font-display mb-2">{selectedPackage.name}</h2>
                        <div className="flex justify-between items-center text-lg mb-4 border-y border-gray-700 py-2">
                             <span className="font-semibold text-[var(--color-muted-text)]">Duration: <span className="text-[var(--color-light-text)]">{selectedPackage.duration}</span></span>
                             <span className="font-bold text-2xl text-[var(--color-primary)]">{selectedPackage.price}</span>
                        </div>
                        <p className="text-[var(--color-muted-text)] mb-6">{selectedPackage.shortDescription}</p>

                        <div className="space-y-1 text-sm">
                            <DetailRow label="Makkah Hotel" value={selectedPackage.hotelMakkah} />
                            <DetailRow label="Madinah Hotel" value={selectedPackage.hotelMadinah} />
                            <DetailRow label="Flights (Up)" value={selectedPackage.flightsUp} />
                            <DetailRow label="Flights (Down)" value={selectedPackage.flightsDown} />
                            <DetailRow label="Food" value={selectedPackage.food} />
                            <DetailRow label="Special Services" value={selectedPackage.special} />
                            {selectedPackage.note && <DetailRow label="Note" value={selectedPackage.note} />}
                        </div>
                         <div className="mt-8 text-center">
                            <a
                              href={`#contact?subject=${encodeURIComponent(`Inquiry about ${selectedPackage.name}`)}`}
                              onClick={() => setSelectedPackage(null)}
                              className="bg-[var(--color-primary)] text-white font-bold py-3 px-8 rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-300 inline-block"
                            >
                              Send Inquiry
                            </a>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default HajjPage;

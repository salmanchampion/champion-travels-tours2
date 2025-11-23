
import React, { useContext } from 'react';
import Modal from './Modal';
import { DataContext } from '../contexts/DataContext';

const CompareModal: React.FC = () => {
    const { isCompareModalOpen, setCompareModalOpen, compareList, removeFromCompare } = useContext(DataContext);

    // Helper to get property value safe for different package types
    const getVal = (pkg: any, keys: string[]) => {
        for (const k of keys) {
            if (pkg[k]) return pkg[k];
        }
        return '-';
    }

    // Helper fields configuration
    const fields = [
        { label: 'Price', keys: ['price'] },
        { label: 'Duration/Date', keys: ['duration', 'date'] },
        { label: 'Category', keys: ['category'] },
        { label: 'Hotel Makkah', keys: ['makkahHotel', 'hotelMakkah'] },
        { label: 'Hotel Madinah', keys: ['madinahHotel', 'hotelMadinah'] },
        { label: 'Flights', keys: ['flightsUp', 'flightsDown'] }, // Logic handled in render
        { label: 'Food', keys: ['food'] },
        { label: 'Special Services', keys: ['special', 'features'] }, // Logic handled in render
    ];

    return (
        <Modal isOpen={isCompareModalOpen} onClose={() => setCompareModalOpen(false)}>
            <div className="w-full max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                    <h2 className="text-2xl font-display font-bold text-[var(--color-primary)]">Compare Packages</h2>
                    <button 
                        onClick={() => setCompareModalOpen(false)}
                        className="text-[var(--color-muted-text)] hover:text-red-400 font-bold"
                    >
                        Close
                    </button>
                </div>

                {compareList.length === 0 ? (
                    <div className="text-center py-10 text-[var(--color-muted-text)]">
                        <p>No packages selected for comparison.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar pb-4">
                        <table className="w-full min-w-[600px] border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 text-left bg-[var(--color-dark-bg)] text-[var(--color-muted-text)] border-b border-gray-700 w-1/4 min-w-[150px] sticky left-0 z-10 shadow-lg">Feature</th>
                                    {compareList.map((pkg, idx) => (
                                        <th key={idx} className="p-4 text-center bg-[var(--color-light-bg)] border-b border-gray-700 min-w-[250px] align-top relative">
                                            <button 
                                                onClick={() => removeFromCompare(pkg.id || pkg.name || pkg.title)}
                                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                                title="Remove"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                            </button>
                                            <div className="h-32 w-full overflow-hidden rounded-lg mb-3 border border-gray-700">
                                                <img src={pkg.image} alt={pkg.title || pkg.name} className="w-full h-full object-cover" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white font-display leading-tight">{pkg.title || pkg.name}</h3>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((field, fieldIdx) => (
                                    <tr key={fieldIdx} className="border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-bold text-[var(--color-primary)] bg-[var(--color-dark-bg)] sticky left-0 z-10 border-r border-gray-700">{field.label}</td>
                                        {compareList.map((pkg, pkgIdx) => (
                                            <td key={pkgIdx} className="p-4 text-center text-[var(--color-light-text)] text-sm">
                                                {field.label === 'Flights' ? (
                                                    pkg.flightsUp ? (
                                                        <span>{pkg.flightsUp} / {pkg.flightsDown}</span>
                                                    ) : (
                                                        // Extract from features array if available (exclusive package structure)
                                                        pkg.features?.find((f: string) => f.toLowerCase().includes('flight')) || '-'
                                                    )
                                                ) : field.label === 'Special Services' ? (
                                                    pkg.special ? pkg.special : (
                                                        // Exclusive packages have array of features
                                                        Array.isArray(pkg.features) ? (
                                                            <ul className="text-left list-disc pl-4 text-xs space-y-1">
                                                                {pkg.features.slice(0, 4).map((f: string, i: number) => <li key={i}>{f}</li>)}
                                                            </ul>
                                                        ) : '-'
                                                    )
                                                ) : (
                                                    getVal(pkg, field.keys)
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                <tr>
                                    <td className="p-4 bg-[var(--color-dark-bg)] sticky left-0 z-10"></td>
                                    {compareList.map((pkg, idx) => (
                                        <td key={idx} className="p-4 text-center">
                                            <a 
                                                href={`#contact?subject=Booking Inquiry: ${pkg.title || pkg.name}`}
                                                className="inline-block bg-[var(--color-primary)] text-white text-sm font-bold py-2 px-6 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] transition-colors"
                                            >
                                                Book Now
                                            </a>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CompareModal;

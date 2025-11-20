
import React from 'react';
import { ExclusivePackage } from '../types';

interface ExclusivePackageCardProps {
    pkg: ExclusivePackage;
}

const CheckIcon = () => (
    <svg className="w-4 h-4 text-[var(--color-secondary)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
);

const ExclusivePackageCard: React.FC<ExclusivePackageCardProps> = ({ pkg }) => {
    return (
        <div 
            data-aos="fade-up"
            className="glass-card rounded-lg overflow-hidden flex flex-col h-full hover:border-[var(--color-primary)] transition-all duration-300 group luxury-shadow transform hover:-translate-y-1"
        >
            {/* Image Header */}
            <div className="relative h-56 overflow-hidden">
                <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black/20 group-hover:bg-black/0 transition-all duration-500"></div>
                <div className="absolute top-4 right-4 bg-[var(--color-primary)] text-white font-bold py-1 px-3 rounded-full text-sm shadow-lg">
                    {pkg.category}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">{pkg.title}</h3>
                
                <div className="flex items-center justify-between text-sm text-[var(--color-muted-text)] mb-4 pb-4 border-b border-gray-700/50">
                     <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {pkg.duration}
                     </div>
                     <div className="font-bold text-[var(--color-primary)] text-lg">
                        {pkg.price}
                     </div>
                </div>

                {/* Hotels */}
                <div className="mb-4 space-y-2">
                    <div className="flex items-start">
                        <span className="text-[var(--color-muted-text)] text-xs w-16 uppercase font-bold mt-1">Makkah:</span>
                        <span className="text-[var(--color-light-text)] text-sm flex-1">{pkg.makkahHotel}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-[var(--color-muted-text)] text-xs w-16 uppercase font-bold mt-1">Madinah:</span>
                        <span className="text-[var(--color-light-text)] text-sm flex-1">{pkg.madinahHotel}</span>
                    </div>
                </div>

                {/* Features List */}
                <div className="mb-6 flex-grow">
                    <p className="text-xs font-bold text-[var(--color-muted-text)] uppercase mb-2">Includes:</p>
                    <ul className="grid grid-cols-2 gap-2">
                        {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-[var(--color-light-text)]">
                                <CheckIcon />
                                <span className="truncate">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-auto">
                    <a 
                        href={`#contact?subject=${encodeURIComponent(`Inquiry: ${pkg.title}`)}`}
                        className="flex-1 bg-[var(--color-secondary)] text-[var(--color-dark-bg)] text-center py-3 rounded font-bold hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        Book Now
                    </a>
                    {pkg.pdfLink && (
                         <a 
                            href={pkg.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-none px-4 py-3 border border-gray-600 rounded hover:bg-gray-700 text-[var(--color-light-text)] transition-colors"
                            title="Download Flyer"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExclusivePackageCard;

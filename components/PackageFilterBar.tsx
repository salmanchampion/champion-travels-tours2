
import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

const PackageFilterBar: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { packageFilter } = appData.pages.home;

  if (!packageFilter?.enabled) return null;

  const {
      title,
      destinationLabel = 'Destination',
      destinationPlaceholder = 'e.g., Makkah',
      monthLabel = 'Month',
      packageTypeLabel = 'Package Type',
      buttonText = 'Search'
  } = packageFilter;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24 relative z-30">
        <div className="bg-[var(--color-light-bg)] shadow-2xl border border-gray-800/50 p-6 md:p-8 rounded-[var(--ui-border-radius)] backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold text-center text-[var(--color-primary)] mb-6 font-display uppercase tracking-wide">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-end">
                <div className="w-full">
                    <label className="block text-[var(--color-muted-text)] font-bold mb-2 text-xs uppercase tracking-wider">{destinationLabel}</label>
                    <input type="text" placeholder={destinationPlaceholder} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all placeholder-gray-600"/>
                </div>
                <div className="w-full">
                    <label className="block text-[var(--color-muted-text)] font-bold mb-2 text-xs uppercase tracking-wider">{monthLabel}</label>
                    <input type="month" className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"/>
                </div>
                <div className="w-full">
                    <label className="block text-[var(--color-muted-text)] font-bold mb-2 text-xs uppercase tracking-wider">{packageTypeLabel}</label>
                    <select className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] h-[50px] transition-all appearance-none">
                        <option>All Packages</option>
                        <option>Hajj Package</option>
                        <option>Umrah Package</option>
                    </select>
                </div>
                <div className="w-full">
                    <a href="#packages" className="bg-[var(--color-primary)] text-white font-bold py-3 px-4 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] w-full text-center transition-all duration-300 shadow-lg transform active:scale-95 h-[50px] flex items-center justify-center uppercase tracking-wider text-sm mt-2 md:mt-0">
                        {buttonText}
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PackageFilterBar;

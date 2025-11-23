
import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

const CompareFloatingWidget: React.FC = () => {
    const { compareList, setCompareModalOpen, clearCompare } = useContext(DataContext);

    if (compareList.length === 0) return null;

    return (
        <div className="fixed bottom-24 right-6 z-[90] flex flex-col items-end gap-2 animate-fade-in-up">
            {/* Clear Button */}
            {compareList.length > 0 && (
                <button 
                    onClick={clearCompare}
                    className="text-xs bg-red-600 text-white px-2 py-1 rounded shadow hover:bg-red-700 transition-colors mb-1 mr-1"
                >
                    Clear All
                </button>
            )}
            
            {/* Main Trigger */}
            <button
                onClick={() => setCompareModalOpen(true)}
                className="bg-[var(--color-secondary)] text-[var(--color-dark-bg)] font-bold py-3 px-6 rounded-full shadow-[0_0_20px_rgba(76,175,80,0.4)] hover:shadow-[0_0_30px_rgba(76,175,80,0.6)] transition-all duration-300 transform hover:scale-105 flex items-center gap-3 border-2 border-[#0B0F19]"
            >
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-[#0B0F19]">{compareList.length}</span>
                </div>
                <span className="uppercase tracking-wider text-sm">Compare</span>
            </button>
        </div>
    );
};

export default CompareFloatingWidget;

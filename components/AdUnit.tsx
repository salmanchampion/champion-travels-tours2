
import React, { useEffect, useRef, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

interface AdUnitProps {
    placement: 'homeTop' | 'homeMiddle' | 'blogSidebar' | 'postBottom';
    className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ placement, className = '' }) => {
    const { appData } = useContext(DataContext);
    const monetization = appData.globalConfig?.monetization;
    const adContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!monetization?.enabled || !monetization.placements[placement]) return;

        const adCode = monetization.placements[placement];
        const container = adContainerRef.current;

        if (container) {
            container.innerHTML = ''; // Clear previous content
            
            // Create a range to create a contextual fragment which executes scripts
            const range = document.createRange();
            range.selectNode(container);
            const documentFragment = range.createContextualFragment(adCode);
            container.appendChild(documentFragment);
        }
    }, [monetization, placement]);

    if (!monetization?.enabled || !monetization.placements[placement]) {
        return null;
    }

    return (
        <div className={`ad-unit-container my-6 text-center ${className}`}>
            <span className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">Sponsored</span>
            <div ref={adContainerRef} className="inline-block min-h-[100px] w-full max-w-full overflow-hidden bg-black/10 rounded">
                {/* Ad content injected here */}
            </div>
        </div>
    );
};

export default AdUnit;

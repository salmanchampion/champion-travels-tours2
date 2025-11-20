
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../contexts/DataContext';
import PageBanner from '../components/PageBanner';
import ExclusivePackageCard from '../components/ExclusivePackageCard';

const ExclusiveUmrahPage: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { pageData, packages } = appData.exclusiveUmrah;
    const [activeTab, setActiveTab] = useState('All');

    // Extract unique categories
    const categories = useMemo(() => {
        const unique = new Set(packages.filter(p => p.enabled).map(p => p.category));
        return ['All', ...Array.from(unique)];
    }, [packages]);

    const filteredPackages = useMemo(() => {
        if (activeTab === 'All') return packages.filter(p => p.enabled);
        return packages.filter(p => p.enabled && p.category === activeTab);
    }, [packages, activeTab]);

    return (
        <div className="pt-20 bg-[var(--color-dark-bg)] min-h-screen">
            <PageBanner 
                title={pageData.pageBanner.title} 
                subtitle={pageData.pageBanner.subtitle} 
                backgroundImage={pageData.pageBanner.backgroundImage} 
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Intro Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-primary)] mb-4">{pageData.introTitle}</h2>
                    <p className="text-[var(--color-muted-text)] max-w-3xl mx-auto text-lg">{pageData.introText}</p>
                </div>

                {/* Tabs */}
                {categories.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 border-2 ${
                                    activeTab === cat 
                                        ? 'bg-[var(--color-secondary)] border-[var(--color-secondary)] text-[var(--color-dark-bg)]' 
                                        : 'bg-transparent border-gray-600 text-[var(--color-muted-text)] hover:border-[var(--color-secondary)] hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPackages.map(pkg => (
                        <ExclusivePackageCard key={pkg.id} pkg={pkg} />
                    ))}
                </div>

                {filteredPackages.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-[var(--color-muted-text)] text-xl">No packages found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExclusiveUmrahPage;

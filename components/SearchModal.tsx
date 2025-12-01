
import React, { useState, useContext, useEffect, useMemo } from 'react';
import Modal from './Modal';
import { DataContext } from '../contexts/DataContext';

const SearchModal: React.FC = () => {
    const { isSearchOpen, setSearchOpen, appData } = useContext(DataContext);
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'packages' | 'blog' | 'services'>('all');

    useEffect(() => {
        if (!isSearchOpen) setQuery('');
    }, [isSearchOpen]);

    const results = useMemo(() => {
        if (!query.trim()) return { packages: [], blog: [], services: [] };
        
        const q = query.toLowerCase();

        // Packages
        const allPackages = [
            ...appData.hajjPackages.filter(p => p.enabled).map(p => ({...p, type: 'Legacy Hajj', link: '#hajj'})),
            ...appData.umrahPackages.filter(p => p.enabled).map(p => ({...p, type: 'Legacy Umrah', link: '#umrah'})),
            ...appData.exclusiveHajj.packages.filter(p => p.enabled).map(p => ({name: p.title, price: p.price, image: p.image, type: 'Exclusive Hajj', link: '#exclusive-hajj'})),
            ...appData.exclusiveUmrah.packages.filter(p => p.enabled).map(p => ({name: p.title, price: p.price, image: p.image, type: 'Exclusive Umrah', link: '#exclusive-umrah'}))
        ];

        const matchedPackages = allPackages.filter(p => 
            p.name.toLowerCase().includes(q) || 
            (p as any).category?.toLowerCase().includes(q) ||
            p.price.toLowerCase().includes(q)
        );

        // Blog
        const matchedBlog = appData.pages.blog.posts.filter(p => 
            p.enabled && (p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
        );

        // Services
        const matchedServices = [
            ...appData.pages.services.list.filter(s => s.enabled && (s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))),
            ...appData.customPages.filter(p => p.enabled && p.title.toLowerCase().includes(q)).map(p => ({ title: p.title, description: p.bannerSubtitle, icon: 'Page', link: p.id })),
            ...(appData.pages.visaProcessing.offerList.filter(o => o.enabled && o.title.toLowerCase().includes(q)).map(o => ({...o, link: '#visa-processing'}))),
            ...(appData.pages.airTicketing.features.filter(f => f.enabled && f.title.toLowerCase().includes(q)).map(f => ({...f, link: '#air-ticketing'})))
        ];

        return {
            packages: matchedPackages,
            blog: matchedBlog,
            services: matchedServices
        };
    }, [query, appData]);

    const hasResults = results.packages.length > 0 || results.blog.length > 0 || results.services.length > 0;

    return (
        <Modal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)}>
            <div className="w-full max-w-4xl mx-auto min-h-[500px] flex flex-col">
                {/* Search Input */}
                <div className="relative mb-6">
                    <svg className="absolute left-4 top-4 w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for packages, guides, blogs..."
                        className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-full py-4 pl-14 pr-12 text-[var(--color-light-text)] text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                        autoFocus
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="absolute right-4 top-4 text-gray-500 hover:text-white">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>

                {/* Tabs */}
                {query && hasResults && (
                    <div className="flex border-b border-gray-700 mb-4 overflow-x-auto">
                        {['all', 'packages', 'blog', 'services'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-6 py-2 font-bold capitalize transition-colors border-b-2 ${
                                    activeTab === tab 
                                    ? 'text-[var(--color-primary)] border-[var(--color-primary)]' 
                                    : 'text-gray-500 border-transparent hover:text-white'
                                }`}
                            >
                                {tab}
                                {tab !== 'all' && <span className="ml-2 text-xs bg-gray-800 px-2 py-0.5 rounded-full">{results[tab as keyof typeof results]?.length || 0}</span>}
                            </button>
                        ))}
                    </div>
                )}

                {/* Results Area */}
                <div className="flex-grow overflow-y-auto max-h-[60vh] custom-scrollbar pr-2">
                    {!query && (
                        <div className="flex flex-col items-center justify-center h-64 text-[var(--color-muted-text)]">
                            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <p>Type to search across our entire website...</p>
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {['Hajj 2026', 'Ramadan Umrah', 'Visa Price', 'Packing List'].map(tag => (
                                    <button key={tag} onClick={() => setQuery(tag)} className="px-3 py-1 bg-gray-800 rounded-full text-xs hover:bg-[var(--color-primary)] hover:text-white transition-colors">{tag}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {query && !hasResults && (
                        <div className="text-center py-12 text-[var(--color-muted-text)]">
                            <p>No results found for "{query}".</p>
                        </div>
                    )}

                    {/* Packages Results */}
                    {(activeTab === 'all' || activeTab === 'packages') && results.packages.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-[var(--color-secondary)] font-bold mb-4 uppercase tracking-wider text-sm sticky top-0 bg-[var(--color-light-bg)] py-2 z-10">Packages</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.packages.map((pkg, idx) => (
                                    <a key={idx} href={pkg.link} onClick={() => setSearchOpen(false)} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors border border-gray-800 group">
                                        <img src={pkg.image} alt={pkg.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0 group-hover:scale-105 transition-transform" />
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">{pkg.name}</h4>
                                            <div className="flex gap-3 text-xs text-gray-400 mt-1">
                                                <span className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2 py-0.5 rounded">{pkg.type}</span>
                                                <span>{pkg.price}</span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Blog Results */}
                    {(activeTab === 'all' || activeTab === 'blog') && results.blog.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-[var(--color-secondary)] font-bold mb-4 uppercase tracking-wider text-sm sticky top-0 bg-[var(--color-light-bg)] py-2 z-10">Blog & Articles</h3>
                            <div className="space-y-4">
                                {results.blog.map((post, idx) => (
                                    <a key={idx} href={`#blog-post?id=${post.id}`} onClick={() => setSearchOpen(false)} className="block p-4 rounded-lg bg-[var(--color-dark-bg)] border border-gray-700 hover:border-[var(--color-primary)] transition-colors group">
                                        <h4 className="font-bold text-lg text-white group-hover:text-[var(--color-primary)] mb-1">{post.title}</h4>
                                        <p className="text-sm text-[var(--color-muted-text)] line-clamp-2">{post.excerpt}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Service Results */}
                    {(activeTab === 'all' || activeTab === 'services') && results.services.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-[var(--color-secondary)] font-bold mb-4 uppercase tracking-wider text-sm sticky top-0 bg-[var(--color-light-bg)] py-2 z-10">Services</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.services.map((service, idx) => (
                                    <a key={idx} href={(service as any).link || '#services'} onClick={() => setSearchOpen(false)} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors border border-gray-800">
                                        <div className="mt-1 text-[var(--color-primary)]">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white hover:text-[var(--color-primary)]">{service.title}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-2">{service.description}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default SearchModal;

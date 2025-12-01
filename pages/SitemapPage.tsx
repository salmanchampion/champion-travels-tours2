
import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import PageBanner from '../components/PageBanner';

const SitemapPage: React.FC = () => {
    const { appData } = useContext(DataContext);

    // Grouping Links
    const sections = [
        {
            title: "Main Pages",
            links: appData.header.navLinks.flatMap(link => {
                const main = { href: link.href, label: link.label };
                const subs = link.subLinks ? link.subLinks.map(sub => ({ href: sub.href, label: sub.label })) : [];
                return [main, ...subs];
            }).filter(l => l.href !== '#' && l.href !== '#home')
        },
        {
            title: "Exclusive Hajj Packages",
            links: appData.exclusiveHajj.packages
                .filter(p => p.enabled)
                .map(p => ({ href: `#exclusive-hajj`, label: p.title })) // Deep linking logic could be added if supported by tab system
        },
        {
            title: "Exclusive Umrah Packages",
            links: appData.exclusiveUmrah.packages
                .filter(p => p.enabled)
                .map(p => ({ href: `#exclusive-umrah`, label: p.title }))
        },
        {
            title: "Legacy Hajj Packages",
            links: appData.hajjPackages
                .filter(p => p.enabled)
                .map(p => ({ href: `#hajj`, label: `${p.name} (${p.category})` }))
        },
        {
            title: "Legacy Umrah Packages",
            links: appData.umrahPackages
                .filter(p => p.enabled)
                .map(p => ({ href: `#umrah`, label: `${p.name} (${p.category})` }))
        },
        {
            title: "Blog Posts",
            links: appData.pages.blog.posts
                .filter(p => p.enabled)
                .map(p => ({ href: `#blog-post?id=${p.id}`, label: p.title }))
        },
        {
            title: "Custom Service Pages",
            links: appData.customPages
                .filter(p => p.enabled)
                .map(p => ({ href: p.id, label: p.title }))
        }
    ];

    return (
        <div className="pt-20 bg-[var(--color-dark-bg)] min-h-screen">
            <PageBanner 
                title="Sitemap" 
                subtitle="Easily navigate through all pages and packages available on Champion Travels & Tours." 
            />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-[var(--color-light-bg)] p-6 rounded-lg border border-gray-700">
                            <h3 className="text-xl font-display font-bold text-[var(--color-primary)] mb-4 border-b border-gray-600 pb-2">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <a 
                                            href={link.href} 
                                            className="text-[var(--color-light-text)] hover:text-[var(--color-secondary)] transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                                {section.links.length === 0 && (
                                    <li className="text-sm text-gray-500 italic">No items available.</li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SitemapPage;

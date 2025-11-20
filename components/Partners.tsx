
import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

const Partners: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { partners } = appData.footer;

    if (!partners || !partners.enabled) return null;

    return (
        <section className="py-12 bg-[var(--color-light-bg)] border-t border-gray-700/50 border-b border-gray-700/50">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-10">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-primary)]">{partners.title}</h3>
                    {partners.subtitle && <p className="text-[var(--color-muted-text)] mt-2 max-w-2xl mx-auto">{partners.subtitle}</p>}
                </div>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                    {partners.logos.filter(l => l.enabled).map((logo, index) => (
                        <a 
                            key={index} 
                            href={logo.href || '#'} 
                            className={`group block transition-opacity duration-300 ${logo.href === '#' ? 'cursor-default' : 'hover:opacity-100'}`}
                            target={logo.href === '#' ? undefined : "_blank"}
                            rel="noopener noreferrer"
                        >
                            <img 
                                src={logo.src} 
                                alt={logo.alt} 
                                className="h-16 md:h-20 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 filter" 
                            />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partners;

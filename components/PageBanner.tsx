import React from 'react';

interface PageBannerProps {
    title: string;
    subtitle: string;
    backgroundImage?: string;
}

const PageBanner: React.FC<PageBannerProps> = ({ title, subtitle, backgroundImage }) => (
    <div 
        className="bg-[var(--color-light-bg)] text-center py-16 relative bg-cover bg-center"
        style={backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : {}}
    >
        {backgroundImage && <div className="absolute inset-0 bg-black/60"></div>}
        <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-primary)]">{title}</h1>
            <p className={`mt-4 text-lg max-w-3xl mx-auto ${backgroundImage ? 'text-white' : 'text-[var(--color-muted-text)]'}`}>{subtitle}</p>
        </div>
    </div>
);

export default PageBanner;
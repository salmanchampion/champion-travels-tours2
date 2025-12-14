
import React, { useContext, useState } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { Section } from './AdminUI';

const SitemapManager: React.FC = () => {
    const { appData } = useContext(DataContext);
    const [xmlContent, setXmlContent] = useState('');

    const generateSitemap = () => {
        const baseUrl = 'https://championtravelsbd.netlify.app';
        const currentDate = new Date().toISOString().split('T')[0];

        // Base static routes
        const staticRoutes = [
            '',
            '#services',
            '#visa-processing',
            '#air-ticketing',
            '#ziyarat-tours',
            '#contact',
            '#blog',
            '#team',
            '#testimonials',
            '#hajj-guide-in-bangla',
            '#umrah-guide-in-bangla'
        ];

        // Dynamic Routes from Data
        const hajjLinks = appData.hajjPackages.filter(p => p.enabled).map(() => '#hajj'); // Main Hajj page handles listing
        const umrahLinks = appData.umrahPackages.filter(p => p.enabled).map(() => '#umrah');
        
        // Exclusive packages (if you implement distinct URL parameters later, add them here)
        // Currently pointing to main sections
        const exclusiveHajjLinks = ['#exclusive-hajj'];
        const exclusiveUmrahLinks = ['#exclusive-umrah'];

        // Blog Posts
        const blogLinks = appData.pages.blog.posts
            .filter(p => p.enabled)
            .map(p => `#blog-post?id=${p.id}`);

        // Custom Pages
        const customPageLinks = appData.customPages
            .filter(p => p.enabled)
            .map(p => p.id);

        // Combine all unique links
        const allLinks = Array.from(new Set([
            ...staticRoutes,
            ...hajjLinks,
            ...umrahLinks,
            ...exclusiveHajjLinks,
            ...exclusiveUmrahLinks,
            ...blogLinks,
            ...customPageLinks
        ]));

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        allLinks.forEach(link => {
            // Encode special characters for XML
            const safeLink = link.replace(/&/g, '&amp;');
            const fullUrl = `${baseUrl}/${safeLink}`;
            
            xml += '  <url>\n';
            xml += `    <loc>${fullUrl}</loc>\n`;
            xml += `    <lastmod>${currentDate}</lastmod>\n`;
            xml += `    <changefreq>${link === '' ? 'daily' : 'weekly'}</changefreq>\n`;
            xml += `    <priority>${link === '' ? '1.0' : '0.8'}</priority>\n`;
            xml += '  </url>\n';
        });

        xml += '</urlset>';
        setXmlContent(xml);
    };

    const downloadSitemap = () => {
        if (!xmlContent) return;
        const element = document.createElement("a");
        const file = new Blob([xmlContent], {type: 'text/xml'});
        element.href = URL.createObjectURL(file);
        element.download = "sitemap.xml";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <Section title="Sitemap Generator (SEO)">
            <div className="p-4 border border-gray-700 rounded-lg bg-[var(--color-dark-bg)]">
                <div className="text-[var(--color-muted-text)] mb-6 text-sm">
                    <p className="mb-2">
                        Since your website content (Blogs, Packages) changes dynamically, you need to regenerate the sitemap so Google knows about new pages.
                    </p>
                    <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-md">
                        <strong className="text-blue-300 block mb-2">How to Upload (Step-by-Step):</strong>
                        <ol className="list-decimal ml-5 space-y-2 text-gray-300">
                            <li>Click <strong>"Generate Sitemap"</strong> below to create the XML code.</li>
                            <li>Click <strong>"Download sitemap.xml"</strong> to save the file to your computer.</li>
                            <li>
                                Go to your project folder on your computer and find the folder named <code>public</code>.
                            </li>
                            <li>
                                Paste the downloaded file inside the <code>public</code> folder (replace the old one).
                            </li>
                            <li>
                                Redeploy your website (or run <code>npm run build</code> & deploy).
                            </li>
                            <li className="text-[var(--color-secondary)]">
                                Finally, go to <strong>Google Search Console</strong> -> Sitemaps -> Submit <code>sitemap.xml</code>.
                            </li>
                        </ol>
                    </div>
                </div>

                <div className="flex gap-4 mb-6">
                    <button 
                        onClick={generateSitemap}
                        className="bg-[var(--color-secondary)] text-[var(--color-dark-bg)] font-bold py-2 px-6 rounded hover:bg-green-600 transition-colors"
                    >
                        1. Generate Sitemap
                    </button>
                    {xmlContent && (
                        <button 
                            onClick={downloadSitemap}
                            className="bg-[var(--color-primary)] text-white font-bold py-2 px-6 rounded hover:bg-[var(--color-primary-dark)] transition-colors"
                        >
                            2. Download sitemap.xml
                        </button>
                    )}
                </div>

                {xmlContent && (
                    <div>
                        <label className="block text-sm font-bold text-white mb-2">Sitemap Preview:</label>
                        <textarea 
                            readOnly
                            value={xmlContent}
                            className="w-full h-64 bg-[#0d1117] border border-gray-600 rounded p-3 text-xs font-mono text-green-400 focus:outline-none"
                        />
                    </div>
                )}
            </div>
        </Section>
    );
};

export default SitemapManager;

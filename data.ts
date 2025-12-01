
import { AppData } from './types';
import { siteConfig } from './data/siteConfig';
import { hajjPackages, umrahPackages } from './data/packages';
import { pagesData, customPagesData } from './data/pages';

// Re-export types for backward compatibility
export * from './types';

// Patch the siteConfig to include the new checklist AND calculator link
const patchedSiteConfig = {
    ...siteConfig,
    header: {
        ...siteConfig.header,
        navLinks: siteConfig.header.navLinks.map(link => {
            if (link.label === 'Guidelines') {
                const subLinks = link.subLinks || [];
                // Use a Set to ensure uniqueness based on href
                const existingHrefs = new Set(subLinks.map(sl => sl.href));
                const newSubLinks = [...subLinks];

                if (!existingHrefs.has('#checklist')) {
                    newSubLinks.push({ href: '#checklist', label: 'Preparation Checklist', enabled: true });
                }
                if (!existingHrefs.has('#calculator')) {
                    newSubLinks.push({ href: '#calculator', label: 'Cost Estimator', enabled: true });
                }

                return {
                    ...link,
                    subLinks: newSubLinks
                };
            }
            return link;
        })
    }
};

export const defaultData: AppData = {
    ...patchedSiteConfig,
    hajjPackages,
    umrahPackages,
    // --- NEW DATA INITIALIZATION ---
    exclusiveHajj: {
        pageData: {
            seo: {
                title: 'Exclusive Hajj Packages | Champion Travels',
                description: 'Browse our premium and shifting/non-shifting Hajj packages designed for your comfort.',
                keywords: 'Shifting Hajj, Non-Shifting Hajj, 5 Star Hajj'
            },
            pageBanner: {
                title: 'Hajj Packages 2025-2026',
                subtitle: 'Choose the package that best suits your spiritual needs.',
                backgroundImage: 'https://i.postimg.cc/R0N8Mv8X/as.jpg'
            },
            introTitle: 'Our Hajj Packages',
            introText: 'We offer a variety of Hajj packages including Shifting and Non-Shifting options. Our packages are designed to provide comfort and peace of mind so you can focus on your worship.'
        },
        packages: [
            {
                id: 'hajj-ex-1',
                title: 'Economy Shifting Hajj Package',
                category: 'Shifting',
                price: 'BDT 750,000',
                duration: '40 Days',
                makkahHotel: 'Aziziyah (Standard Building)',
                madinahHotel: 'Markazia (3 Star, 500m)',
                features: ['Direct Flight', 'Visa Processing', '3 Times Food', 'Ziyarah', 'Muallim Service'],
                image: 'https://i.postimg.cc/CL6k3832/ak.jpg',
                enabled: true
            },
            {
                id: 'hajj-ex-2',
                title: 'VIP Non-Shifting Hajj Package',
                category: 'Non-Shifting',
                price: 'BDT 1,450,000',
                duration: '14 Days',
                makkahHotel: 'Swissotel Makkah (0m)',
                madinahHotel: 'Anwar Al Madinah (0m)',
                features: ['Business Class Flight', 'VIP Tent in Mina', 'Buffet Meals', 'Private Transport', 'VIP Handling'],
                image: 'https://i.postimg.cc/Y2z4HFFK/ah.jpg',
                enabled: true
            }
        ]
    },
    exclusiveUmrah: {
        pageData: {
            seo: {
                title: 'Exclusive Umrah Packages | Champion Travels',
                description: 'Explore our Economy, 3 Star, and 5 Star Umrah packages.',
                keywords: 'Umrah package, cheap umrah, luxury umrah'
            },
            pageBanner: {
                title: 'Umrah Packages',
                subtitle: 'Embark on a spiritual journey with our tailored Umrah packages.',
                backgroundImage: 'https://i.postimg.cc/Y2z4HFFK/ah.jpg'
            },
            introTitle: 'Available Umrah Packages',
            introText: 'Whether you are looking for a budget-friendly option or a luxurious experience, we have the perfect Umrah package for you.'
        },
        packages: [
            {
                id: 'umrah-ex-1',
                title: 'Super Saver Economy',
                category: 'Economy',
                price: 'BDT 150,000',
                duration: '14 Days',
                makkahHotel: 'Hotel 600m Distance',
                madinahHotel: 'Hotel 400m Distance',
                features: ['Visa', 'Air Ticket', 'Transfer', 'Ziyarah'],
                image: 'https://i.postimg.cc/VkQL0LnX/al.webp',
                enabled: true
            },
            {
                id: 'umrah-ex-2',
                title: 'Premium 5 Star Package',
                category: '5 Star',
                price: 'BDT 280,000',
                duration: '10 Days',
                makkahHotel: 'Fairmont Clock Tower',
                madinahHotel: 'Pullman Zamzam',
                features: ['Visa', 'Direct Flight', 'Luxury Transport', 'Breakfast Included', 'Private Ziyarah'],
                image: 'https://i.postimg.cc/3R91yY2B/umrah-1.jpg',
                enabled: true
            }
        ]
    },
    // -------------------------------
    pages: pagesData,
    customPages: customPagesData,
    applications: [] // Initial empty list for tracking
};

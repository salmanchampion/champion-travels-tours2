
import { AppData } from '../types';

export const siteConfig: Pick<AppData, 'site' | 'header' | 'floatingButton' | 'prayerTimes' | 'footer' | 'theme'> = {
    site: {
        logoUrl: 'https://i.postimg.cc/9QNWStMS/champion-logo-1.png',
    },
    header: {
        taglines: [
            "আপনার হজ ও ওমরার বিশ্বস্ত সঙ্গী।",
            "ঝামেলাহীন ভিসা প্রসেসিং সেবা।",
            "সেরা রেটে বিশ্বব্যাপী ফ্লাইট বুক করুন।"
        ],
        contactInfo: [
            { label: 'Phone', value: '+8801718425042' },
            { label: 'Email', value: 'championtravels.Dhaka@gmail.com' }
        ],
        socialLinks: [
            { name: 'Facebook', href: 'https://facebook.com', icon: '<path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z"/>' },
            { name: 'Instagram', href: 'https://instagram.com', icon: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802C9.042 3.965 8.718 3.977 7.545 4.029c-2.502.115-3.447.447-3.955 1.054C3.04 5.588 2.686 6.544 2.57 9.045c-.052 1.172-.064 1.496-.064 4.455s.012 3.283.064 4.455c.115 2.501.448 3.447 1.054 3.955.508.508 1.453.84 3.955 1.054 1.172.052 1.496.064 4.455.064s3.283-.012 4.455-.064c2.502-.115 3.447-.447 3.955-1.054.508-.508.84-1.453 1.054-3.955.052-1.172.064 1.496.064-4.455s-.012-3.283-.064-4.455c-.115-2.501-.448-3.447-1.054-3.955-.508-.508-1.453-.84-3.955-1.054C15.282 3.977 14.958 3.965 12 3.965zM12 7.218c-2.628 0-4.782 2.154-4.782 4.782s2.154 4.782 4.782 4.782 4.782-2.154 4.782-4.782S14.628 7.218 12 7.218zm0 7.764c-1.646 0-2.982-1.336-2.982-2.982S10.354 9.018 12 9.018s2.982 1.336 2.982 2.982-1.336 2.982-2.982 2.982zm4.965-7.764c-.786 0-1.425.64-1.425 1.425s.64 1.425 1.425 1.425 1.425-.64 1.425-1.425-.639-1.425-1.425-1.425-1.425z"/></svg>' },
            { name: 'Twitter', href: 'https://twitter.com', icon: '<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.52 3.379 4.738 3.418-1.71 1.336-3.86 2.135-6.22 2.135-.404 0-.802-.023-1.19-.069a13.91 13.91 0 007.548 2.212c9.058 0 14.01-7.502 14.01-14.01 0-.213-.005-.426-.015-.637a10.02 10.02 0 002.46-2.548z"/>' }
        ],
        navLinks: [
            { href: '#home', label: 'Home', enabled: true },
            {
                href: '#',
                label: 'Hajj',
                enabled: true,
                subLinks: [
                    { href: '#exclusive-hajj', label: 'Exclusive Hajj Packages', enabled: true },
                    { href: '#hajj-details', label: 'About Hajj', enabled: true },
                    { href: '#hajj', label: 'All Packages (Old)', enabled: true },
                ]
            },
            {
                href: '#',
                label: 'Umrah Packages',
                enabled: true,
                subLinks: [
                    { href: '#exclusive-umrah', label: 'Exclusive Umrah Packages', enabled: true },
                    { href: '#umrah-details', label: 'About Umrah', enabled: true },
                    { href: '#umrah', label: 'All Packages (Old)', enabled: true },
                ]
            },
            { 
              label: 'Services', 
              href: '#services',
              enabled: true,
              subLinks: [
                { href: '#services', label: 'All Services Overview', enabled: true },
                { href: '#ziyarat-tours', label: 'Historical Ziyarat Tours', enabled: true },
                { href: '#visa-processing', label: 'Visa Processing', enabled: true },
                { href: '#air-ticketing', label: 'Global Air Ticketing', enabled: true },
                { href: '#hotel-booking', label: 'Luxury Hotels & Tours', enabled: true },
                { href: '#umrah-training', label: 'Pilgrim Training', enabled: true },
              ]
            },
            {
              label: 'Guidelines',
              href: '#',
              enabled: true,
              subLinks: [
                { href: '#hajj-guide-in-bangla', label: 'Hajj Guide (Bangla)', enabled: true },
                { href: '#umrah-guide-in-bangla', label: 'Umrah Guide (Bangla)', enabled: true },
                { href: '#why-us', label: 'Expert Umrah Guides', enabled: true },
                { href: '#expert-hajj-guides', label: 'Expert Hajj Guides', enabled: true },
              ]
            },
            { href: '#blog', label: 'Blog', enabled: true },
            { href: '#contact', label: 'Contact US', enabled: true },
            
            // Disabled/Hidden items
            { href: '#why-choose-us', label: 'Why Choose Us', enabled: false },
            { href: '#team', label: 'Our Team', enabled: false },
            { href: '#testimonials', label: 'Testimonials', enabled: false },
        ],
        bookNowButton: {
            text: 'Book Now',
            href: '#contact?subject=General Booking Inquiry'
        }
    },
    floatingButton: {
        enabled: true,
        type: 'whatsapp',
        phoneNumber: '+8801718425042',
        whatsappMessage: 'Assalamualaikum, I am interested in learning more about your travel packages.',
    },
    prayerTimes: {
        enabled: true,
        title: "Today's Prayers",
        locations: [
            { name: 'Makkah', city: 'Makkah al Mukarramah', country: 'Saudi Arabia', enabled: true },
            { name: 'Madinah', city: 'Madinah', country: 'Saudi Arabia', enabled: true },
            { name: 'Dhaka', city: 'Dhaka', country: 'Bangladesh', enabled: true },
        ]
    },
    footer: {
        newsletter: {
            enabled: true,
            title: 'Subscribe to Our Newsletter',
            subtitle: 'Get exclusive offers, Hajj & Umrah updates, and travel tips delivered directly to your inbox.',
            placeholder: 'Enter your email address',
            buttonText: 'Subscribe',
            googleSheetUrl: ''
        },
        about: {
            title: ['Champion', 'Travels & Tours'],
            description: 'Your trusted partner for Hajj, Umrah, and worldwide travel. We are committed to providing exceptional service and unforgettable spiritual journeys.'
        },
        quickLinks: {
            title: 'Quick Links',
            links: [
                { href: '#about-us', label: 'About Us', enabled: true },
                { href: '#services', label: 'Services', enabled: true },
                { href: '#exclusive-hajj', label: 'Hajj Packages', enabled: true },
                { href: '#exclusive-umrah', label: 'Umrah Packages', enabled: true },
                { href: '#team', label: 'Our Team', enabled: true },
                { href: '#contact', label: 'Contact', enabled: true },
                { href: '#privacy-policy', label: 'Privacy Policy', enabled: true },
                { href: '#blog', label: 'Blog', enabled: true },
            ]
        },
        mainServices: {
            title: 'Main Services',
            links: [
                { href: '#exclusive-hajj', label: 'Hajj Packages', enabled: true },
                { href: '#exclusive-umrah', label: 'Umrah Packages', enabled: true },
                { href: '#visa-processing', label: 'Visa Processing', enabled: true },
                { href: '#air-ticketing', label: 'Air Ticketing', enabled: true },
            ]
        },
        partners: {
            title: "Accreditations & Partners",
            subtitle: "Proud member of leading travel and tourism associations.",
            enabled: true,
            logos: [
                { src: "https://i.postimg.cc/PJS59Bqw/champion-logo-1.png", alt: "IATA", href: "#", enabled: true },
                { src: "https://i.postimg.cc/PJS59Bqw/champion-logo-1.png", alt: "ATAB", href: "#", enabled: true },
                { src: "https://i.postimg.cc/PJS59Bqw/champion-logo-1.png", alt: "HAAB", href: "#", enabled: true },
                { src: "https://i.postimg.cc/PJS59Bqw/champion-logo-1.png", alt: "Hilton", href: "#", enabled: true },
                { src: "https://i.postimg.cc/PJS59Bqw/champion-logo-1.png", alt: "Fairmont", href: "#", enabled: true },
            ]
        },
        followUs: {
            title: 'Follow Us',
            description: 'Stay connected with us on social media for the latest updates and offers.'
        },
        copyrightText: 'Champion Travels & Tours. All Rights Reserved.'
    },
    theme: {
        colors: {
            primary: '#C5A47E', // Gold
            primaryDark: '#B38B6D',
            secondary: '#4CAF50', // Green
            secondaryDark: '#388E3C',
            darkBg: '#111827', // Dark Gray
            lightBg: '#1F2937', // Lighter Gray
            lightText: '#F3F4F6', // Off-white
            mutedText: '#9CA3AF', // Muted Gray
        },
        fonts: {
            sans: 'Roboto',
            display: 'Teko',
        },
        ui: {
            borderRadius: '0.75rem', // 12px
            buttonStyle: 'rounded',
            shadow: 'lg',
        }
    },
};

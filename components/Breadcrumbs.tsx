
import React from 'react';

interface BreadcrumbsProps {
  currentPage: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPage }) => {
  // Do not show on home page
  if (currentPage === '#home' || currentPage === '' || currentPage === '#') return null;

  const getReadableName = (hash: string) => {
    const cleanHash = hash.replace('#', '').split('?')[0];
    
    const map: { [key: string]: string } = {
        'hajj': 'Hajj Packages',
        'exclusive-hajj': 'Exclusive Hajj',
        'hajj-details': 'About Hajj',
        'umrah': 'Umrah Packages',
        'exclusive-umrah': 'Exclusive Umrah',
        'umrah-details': 'About Umrah',
        'services': 'Services',
        'visa-processing': 'Visa Processing',
        'air-ticketing': 'Air Ticketing',
        'hotel-booking': 'Hotel Booking',
        'umrah-training': 'Training',
        'ziyarat-tours': 'Ziyarat Tours',
        'team': 'Our Team',
        'testimonials': 'Testimonials',
        'contact': 'Contact Us',
        'blog': 'Blog',
        'login': 'Admin Login',
        'admin': 'Dashboard',
        'why-us': 'Why Choose Us',
        'expert-hajj-guides': 'Expert Guides',
        'hajj-guide-in-bangla': 'Hajj Guide (BN)',
        'umrah-guide-in-bangla': 'Umrah Guide (BN)',
        'privacy-policy': 'Privacy Policy',
        'about-us': 'About Us'
    };

    // Dynamic check for blog post
    if (cleanHash === 'blog-post') return 'Blog Details';

    return map[cleanHash] || cleanHash.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  };

  // Generate path segments
  // Simple logic: Home > Current Page
  // You can expand this logic for deeper nesting if needed (e.g. Home > Services > Visa)
  
  let paths = [
      { name: 'Home', link: '#home' }
  ];

  // Logic to create fake hierarchy for better UX
  const pageName = getReadableName(currentPage);
  
  if (currentPage.includes('hajj') && currentPage !== '#hajj') {
      paths.push({ name: 'Hajj', link: '#hajj' });
  } else if (currentPage.includes('umrah') && currentPage !== '#umrah') {
      paths.push({ name: 'Umrah', link: '#umrah' });
  } else if (['#visa-processing', '#air-ticketing', '#ziyarat-tours', '#hotel-booking'].includes(currentPage)) {
      paths.push({ name: 'Services', link: '#services' });
  } else if (currentPage.includes('blog-post')) {
      paths.push({ name: 'Blog', link: '#blog' });
  }

  paths.push({ name: pageName, link: currentPage });

  return (
    <div className="bg-[var(--color-dark-bg)] border-b border-gray-800 pt-24 pb-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    {paths.map((item, index) => (
                        <li key={index} className="inline-flex items-center">
                            {index > 0 && (
                                <svg className="w-3 h-3 text-gray-500 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                            )}
                            <a 
                                href={item.link} 
                                className={`inline-flex items-center text-xs md:text-sm font-medium ${
                                    index === paths.length - 1 
                                    ? 'text-[var(--color-primary)] cursor-default pointer-events-none' 
                                    : 'text-[var(--color-muted-text)] hover:text-white transition-colors'
                                }`}
                            >
                                {index === 0 && (
                                    <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                                    </svg>
                                )}
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    </div>
  );
};

export default Breadcrumbs;

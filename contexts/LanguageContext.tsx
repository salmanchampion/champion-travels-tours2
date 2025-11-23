
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Comprehensive Dictionary
const dictionary: { [key: string]: { en: string; bn: string } } = {
  // Navigation & Common
  'home': { en: 'Home', bn: 'হোম' },
  'hajj': { en: 'Hajj', bn: 'হজ্জ' },
  'umrah': { en: 'Umrah', bn: 'ওমরাহ' },
  'umrah packages': { en: 'Umrah Packages', bn: 'ওমরাহ প্যাকেজ' },
  'services': { en: 'Services', bn: 'সেবাসমূহ' },
  'guidelines': { en: 'Guidelines', bn: 'নির্দেশিকা' },
  'blog': { en: 'Blog', bn: 'ব্লগ' },
  'contact us': { en: 'Contact US', bn: 'যোগাযোগ' },
  'contact': { en: 'Contact', bn: 'যোগাযোগ' },
  'book now': { en: 'Book Now', bn: 'বুকিং দিন' },
  'admin panel': { en: 'Admin Panel', bn: 'অ্যাডমিন প্যানেল' },
  'logout': { en: 'Logout', bn: 'লগআউট' },
  'view details': { en: 'View Details', bn: 'বিস্তারিত দেখুন' },
  'read more': { en: 'Read More', bn: 'আরও পড়ুন' },
  'search': { en: 'Search', bn: 'অনুসন্ধান' },
  'get in touch': { en: 'Get In Touch', bn: 'যোগাযোগ করুন' },
  
  // Hero Section
  'champion travels & tours': { en: 'Champion Travels & Tours', bn: 'চ্যাম্পিয়ন ট্রাভেলস অ্যান্ড ট্যুরস' },
  'hajj umrah & air ticketing': { en: 'Hajj Umrah & Air Ticketing', bn: 'হজ্জ, ওমরাহ এবং এয়ার টিকেটিং' },
  'embark on your spiritual journey with peace of mind. we provide exceptional services to make your pilgrimage a memorable experience.': { 
      en: 'Embark on your spiritual journey with peace of mind. We provide exceptional services to make your pilgrimage a memorable experience.', 
      bn: 'মনের প্রশান্তির সাথে আপনার আধ্যাত্মিক যাত্রা শুরু করুন। আমরা আপনার হজ্জ ও ওমরাহ যাত্রা স্মরণীয় করতে অসাধারণ সেবা প্রদান করি।' 
  },
  'explore our packages': { en: 'Explore Our Packages', bn: 'আমাদের প্যাকেজ দেখুন' },
  
  // Services
  'our services': { en: 'Our Services', bn: 'আমাদের সেবাসমূহ' },
  'we offer a complete range of travel solutions with a commitment to quality and customer satisfaction.': {
      en: 'We offer a complete range of travel solutions with a commitment to quality and customer satisfaction.',
      bn: 'আমরা গুণমান এবং গ্রাহক সন্তুষ্টির প্রতিশ্রুতি সহ সম্পূর্ণ ভ্রমণ সমাধান প্রদান করি।'
  },
  'hajj packages': { en: 'Hajj Packages', bn: 'হজ্জ প্যাকেজ' },
  'comprehensive hajj packages that cater to your spiritual and comfort needs.': { en: 'Comprehensive Hajj packages that cater to your spiritual and comfort needs.', bn: 'আপনার আধ্যাত্মিক এবং আরামের প্রয়োজন মেটাতে সম্পূর্ণ হজ্জ প্যাকেজ।' },
  'flexible and affordable umrah packages available throughout the year.': { en: 'Flexible and affordable Umrah packages available throughout the year.', bn: 'সারা বছর জুড়ে নমনীয় এবং সাশ্রয়ী ওমরাহ প্যাকেজ।' },
  'visa processing': { en: 'Visa Processing', bn: 'ভিসা প্রসেসিং' },
  'hassle-free and quick visa processing services for multiple countries.': { en: 'Hassle-free and quick visa processing services for multiple countries.', bn: 'একাধিক দেশের জন্য ঝামেলামুক্ত এবং দ্রুত ভিসা প্রসেসিং পরিষেবা।' },
  'air ticketing': { en: 'Air Ticketing', bn: 'এয়ার টিকেটিং' },
  'competitive prices on domestic and international air tickets.': { en: 'Competitive prices on domestic and international air tickets.', bn: 'অভ্যন্তরীণ এবং আন্তর্জাতিক এয়ার টিকেটের প্রতিযোগিতামূলক মূল্য।' },
  'hotel booking': { en: 'Hotel Booking', bn: 'হোটেল বুকিং' },
  'book from a wide range of hotels, from budget-friendly to luxury stays.': { en: 'Book from a wide range of hotels, from budget-friendly to luxury stays.', bn: 'বাজেট-বান্ধব থেকে বিলাসবহুল পর্যন্ত বিস্তৃত হোটেল বুকিং করুন।' },
  'tour packages': { en: 'Tour Packages', bn: 'ট্যুর প্যাকেজ' },
  'discover the world with our curated holiday and tour packages.': { en: 'Discover the world with our curated holiday and tour packages.', bn: 'আমাদের হলিডে এবং ট্যুর প্যাকেজের সাথে বিশ্ব আবিষ্কার করুন।' },

  // Packages
  'find your perfect package': { en: 'Find Your Perfect Package', bn: 'আপনার পারফেক্ট প্যাকেজ খুঁজুন' },
  'destination': { en: 'Destination', bn: 'গন্তব্য' },
  'month': { en: 'Month', bn: 'মাস' },
  'package type': { en: 'Package Type', bn: 'প্যাকেজের ধরন' },
  'all packages': { en: 'All Packages', bn: 'সকল প্যাকেজ' },
  'our hajj & umrah packages': { en: 'Our Hajj & Umrah Packages', bn: 'আমাদের হজ্জ ও ওমরাহ প্যাকেজ' },
  'explore our diverse range of hajj and umrah packages. each is thoughtfully crafted to provide a spiritually rewarding, comfortable, and seamless pilgrimage experience.': {
      en: 'Explore our diverse range of Hajj and Umrah packages. Each is thoughtfully crafted to provide a spiritually rewarding, comfortable, and seamless pilgrimage experience.',
      bn: 'আমাদের বিভিন্ন হজ্জ ও ওমরাহ প্যাকেজ দেখুন। প্রতিটি প্যাকেজ আধ্যাত্মিকভাবে ফলপ্রসূ এবং আরামদায়ক অভিজ্ঞতার জন্য তৈরি।'
  },
  'hajj pre registration 2026-2027': { en: 'Hajj Pre Registration 2026-2027', bn: 'হজ্জ প্রাক-নিবন্ধন ২০২৬-২০২৭' },
  'embark on a sacred pilgrimage with peace of mind. pre-register for hajj and ensure your place in this spiritually significant journey.': {
      en: 'Embark on a sacred pilgrimage with peace of mind. Pre-register for Hajj and ensure your place in this spiritually significant journey.',
      bn: 'মনের প্রশান্তির সাথে পবিত্র হজ্জ যাত্রার প্রস্তুতি নিন। হজ্জের জন্য প্রাক-নিবন্ধন করুন এবং আপনার স্থান নিশ্চিত করুন।'
  },
  'apply for pre-register': { en: 'Apply For Pre-Register', bn: 'প্রাক-নিবন্ধনের জন্য আবেদন' },
  'key highlights of champion travels and tours': { en: 'Key Highlights of Champion Travels and Tours', bn: 'চ্যাম্পিয়ন ট্রাভেলসের মূল বৈশিষ্ট্য' },
  'upcoming umrah packages': { en: 'Upcoming Umrah Packages', bn: 'আসন্ন ওমরাহ প্যাকেজ' },
  'explore our gallery': { en: 'Explore Our Gallery', bn: 'আমাদের গ্যালারি দেখুন' },
  'a glimpse into the spiritual journeys and beautiful destinations we offer.': { en: 'A glimpse into the spiritual journeys and beautiful destinations we offer.', bn: 'আমাদের আধ্যাত্মিক যাত্রা এবং সুন্দর গন্তব্যের এক ঝলক।' },

  // Contact & Footer
  'contact information': { en: 'Contact Information', bn: 'যোগাযোগের তথ্য' },
  'send us a message': { en: 'Send Us a Message', bn: 'আমাদের বার্তা পাঠান' },
  'your name': { en: 'Your Name', bn: 'আপনার নাম' },
  'your email': { en: 'Your Email', bn: 'আপনার ইমেইল' },
  'your phone': { en: 'Your Phone', bn: 'আপনার ফোন' },
  'subject': { en: 'Subject', bn: 'বিষয়' },
  'your message': { en: 'Your Message', bn: 'আপনার বার্তা' },
  'send message': { en: 'Send Message', bn: 'বার্তা পাঠান' },
  'subscribe to our newsletter': { en: 'Subscribe to Our Newsletter', bn: 'আমাদের নিউজলেটারে সাবস্ক্রাইব করুন' },
  'quick links': { en: 'Quick Links', bn: 'দ্রুত লিংক' },
  'main services': { en: 'Main Services', bn: 'প্রধান সেবাসমূহ' },
  'follow us': { en: 'Follow Us', bn: 'আমাদের অনুসরণ করুন' },
  'about us': { en: 'About Us', bn: 'আমাদের সম্পর্কে' },
  'our team': { en: 'Our Team', bn: 'আমাদের টিম' },
  'privacy policy': { en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি' },
  'terms of service': { en: 'Terms of Service', bn: 'সেবার শর্তাবলী' },
  
  // Common Words
  'price': { en: 'Price', bn: 'মূল্য' },
  'duration': { en: 'Duration', bn: 'সময়কাল' },
  'date': { en: 'Date', bn: 'তারিখ' },
  'hotel': { en: 'Hotel', bn: 'হোটেল' },
  'flights': { en: 'Flights', bn: 'ফ্লাইট' },
  'food': { en: 'Food', bn: 'খাবার' },
  'special': { en: 'Special', bn: 'বিশেষ' },
  'note': { en: 'Note', bn: 'নোট' },
  'starting from': { en: 'Starting from', bn: 'শুরু হচ্ছে' },
  'view all packages': { en: 'View All Packages', bn: 'সব প্যাকেজ দেখুন' },
  'makkah': { en: 'Makkah', bn: 'মক্কা' },
  'madinah': { en: 'Madinah', bn: 'মদিনা' },
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
      // Persist language preference
      const savedLang = localStorage.getItem('appLanguage');
      if (savedLang === 'en' || savedLang === 'bn') {
          setLanguage(savedLang);
      }
  }, []);

  const changeLanguage = (lang: Language) => {
      setLanguage(lang);
      localStorage.setItem('appLanguage', lang);
  }

  const t = (text: string): string => {
    if (!text) return '';
    const lowerKey = text.toLowerCase().trim();
    
    // 1. Direct match
    if (dictionary[lowerKey]) {
        return dictionary[lowerKey][language];
    }

    // 2. Partial match for Price (e.g. "BDT 150,000")
    if (language === 'bn' && text.includes('BDT')) {
        // Simple number conversion for Bengali
        return text.replace('BDT', 'টাকা').replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
    }

    // 3. Fallback: Return original text if no translation found
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

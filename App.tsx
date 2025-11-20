
import React, { useState, useEffect, useContext, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import PackagesPage from './pages/PackagesPage';
import VisaProcessingPage from './pages/VisaProcessingPage';
import TeamPage from './pages/TeamPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { DataProvider, DataContext } from './contexts/DataContext';
import WhyUsPage from './pages/WhyUsPage';
import UmrahGuidePage from './pages/UmrahGuidePage';
import { SeoMetadata } from './data';
import HajjGuidePage from './pages/HajjGuidePage';
import ExpertHajjGuidesPage from './pages/ExpertHajjGuidesPage';
import WhyChooseChampionPage from './pages/WhyChooseChampionPage';
import AirTicketingPage from './pages/AirTicketingPage';
import CustomPage from './pages/CustomPage';
import HajjPage from './pages/HajjPage';
import UmrahPage from './pages/UmrahPage';
import HajjDetailsPage from './pages/HajjDetailsPage';
import UmrahDetailsPage from './pages/UmrahDetailsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import FloatingActionButton from './components/FloatingActionButton';
import Partners from './components/Partners';
import PrayerTimesWidget from './components/PrayerTimesWidget';
import ExclusiveHajjPage from './pages/ExclusiveHajjPage';
import ExclusiveUmrahPage from './pages/ExclusiveUmrahPage';
import ZiyaratPage from './pages/ZiyaratPage';
import ScrollToTop from './components/ScrollToTop';

// Theme Injector Component
const ThemeInjector: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { theme } = appData;

    useEffect(() => {
        if (!theme) return;

        const { colors, fonts, ui } = theme;

        const shadowMap = {
            none: 'none',
            sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        };

        const buttonRadiusMap = {
            rounded: ui.borderRadius,
            pill: '9999px',
            sharp: '0px'
        };

        const cssVariables = `
:root {
  --color-primary: ${colors.primary};
  --color-primary-dark: ${colors.primaryDark};
  --color-secondary: ${colors.secondary};
  --color-secondary-dark: ${colors.secondaryDark};
  --color-dark-bg: ${colors.darkBg};
  --color-light-bg: ${colors.lightBg};
  --color-light-text: ${colors.lightText};
  --color-muted-text: ${colors.mutedText};
  
  --font-sans: "${fonts.sans}";
  --font-display: "${fonts.display}";
  
  --ui-border-radius: ${ui.borderRadius};
  --ui-button-radius: ${buttonRadiusMap[ui.buttonStyle] || ui.borderRadius};
  --ui-shadow: ${shadowMap[ui.shadow] || 'none'};
}
body {
    background-color: var(--color-dark-bg);
    color: var(--color-light-text);
    font-family: var(--font-sans), 'Hind Siliguri', sans-serif;
}
.font-sans { font-family: var(--font-sans), 'Hind Siliguri', sans-serif; }
.font-display { font-family: var(--font-display), sans-serif; }
`;
        
        const styleElement = document.getElementById('dynamic-theme-styles');
        if (styleElement) {
            styleElement.innerHTML = cssVariables;
        }

        // Update Google Fonts link
        const fontsLink = document.getElementById('google-fonts-link') as HTMLLinkElement;
        if (fontsLink) {
            const fontSans = fonts.sans.replace(/ /g, '+');
            const fontDisplay = fonts.display.replace(/ /g, '+');
            fontsLink.href = `https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;700&family=${fontSans}:wght@400;500;700&family=${fontDisplay}:wght@400;500;600&display=swap`;
        }

    }, [theme]);

    return null;
};


const AppContent: React.FC = () => {
  const [page, setPage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const { isAuthenticated, isLoading: isAuthLoading } = useContext(AuthContext);
  const { appData, isLoading: isDataLoading } = useContext(DataContext);
  const keySequenceRef = useRef('');
  const secretCode = '045';

  // --- AOS Initialization ---
  useEffect(() => {
    const aos = (window as any).AOS;
    if (aos) {
        aos.init({
            duration: 1000, // Duration of animation
            once: true, // Whether animation should happen only once - while scrolling down
            easing: 'ease-out-cubic',
            offset: 50, // Offset (in px) from the original trigger point
            mirror: false,
        });
    }
  }, []);
  // -------------------------

  // Refresh AOS whenever the page changes to ensure animations trigger correctly
  useEffect(() => {
    const aos = (window as any).AOS;
    if (aos) {
        // Multiple refreshes to catch rendering timing issues
        setTimeout(() => aos.refresh(), 100);
        setTimeout(() => aos.refresh(), 800);
    }
  }, [page, appData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        keySequenceRef.current += e.key;

        if (keySequenceRef.current.length > secretCode.length) {
            keySequenceRef.current = keySequenceRef.current.slice(-secretCode.length);
        }

        if (keySequenceRef.current === secretCode) {
            window.location.hash = '#login';
            keySequenceRef.current = '';
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      const [path, queryString] = hash.split('?');
      
      setPage(path);
      window.scrollTo(0, 0);

      if (path === '#contact' || path === '#book-now') {
        const params = new URLSearchParams(queryString || '');
        const subject = params.get('subject') || '';
        setContactSubject(subject);
      } else {
        setContactSubject('');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (isDataLoading) return; // Wait for data to be loaded

    const getSeoData = (): SeoMetadata | undefined => {
      const pages = appData.pages;
      
      // Check for custom pages first
      const customPageData = appData.customPages?.find(p => p.id === page && p.enabled);
      if (customPageData) {
        return customPageData.seo;
      }
      
      switch (page) {
        case '#hajj': return pages.hajj.seo;
        case '#hajj-details': return pages.hajjDetails.seo;
        case '#umrah': return pages.umrah.seo;
        case '#umrah-details': return pages.umrahDetails.seo;
        case '#exclusive-hajj': return appData.exclusiveHajj.pageData.seo;
        case '#exclusive-umrah': return appData.exclusiveUmrah.pageData.seo;
        case '#ziyarat-tours': return { title: 'Ziyarat Tours Map | Champion Travels', description: 'Explore historical Islamic sites in Makkah and Madinah via our interactive map.', keywords: 'ziyarat map, makkah ziyarat, madinah ziyarat' };
        case '#services': return pages.services.seo;
        case '#packages': return pages.packages.seo;
        case '#visa-processing': return pages.visaProcessing.seo;
        case '#air-ticketing': return pages.airTicketing.seo;
        case '#why-us': return pages.whyChooseUs.seo;
        case '#expert-hajj-guides': return pages.expertHajjGuides.seo;
        case '#why-choose-us': return pages.whyChooseChampion.seo;
        case '#umrah-guide-in-bangla': return pages.umrahGuide.seo;
        case '#hajj-guide-in-bangla': return pages.hajjGuide.seo;
        case '#team': return pages.team.seo;
        case '#testimonials': return pages.testimonials.seo;
        case '#blog': return pages.blog.seo;
        case '#contact':
        case '#book-now': return pages.contact.seo;
        case '#home':
        default:
          return pages.home.seo;
      }
    };

    const seo = getSeoData();

    if (seo) {
      document.title = seo.title;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', seo.description);

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', seo.keywords);
    }
  }, [page, appData, isDataLoading]);

  const renderPage = () => {
    let currentPage = page;
    if (currentPage === '#book-now') {
      currentPage = '#contact';
    }
    
    if (currentPage === '#admin' && !isAuthenticated) {
      window.location.hash = '#login';
      return <LoginPage />;
    }

    if (currentPage === '#ziyarat-tours') {
        return <ZiyaratPage />;
    }

    // Check for custom pages
    const customPageData = appData.customPages?.find(p => p.id === currentPage && p.enabled);
    if (customPageData) {
        return <CustomPage pageData={customPageData} />;
    }

    switch (currentPage) {
      case '#hajj': return <HajjPage />;
      case '#hajj-details': return <HajjDetailsPage />;
      case '#exclusive-hajj': return <ExclusiveHajjPage />; 
      case '#exclusive-umrah': return <ExclusiveUmrahPage />;
      case '#umrah': return <UmrahPage />;
      case '#umrah-details': return <UmrahDetailsPage />;
      case '#services': return <ServicesPage />;
      case '#packages': return <PackagesPage />;
      case '#visa-processing': return <VisaProcessingPage />;
      case '#air-ticketing': return <AirTicketingPage />;
      case '#why-us': return <WhyUsPage />;
      case '#expert-hajj-guides': return <ExpertHajjGuidesPage />;
      case '#why-choose-us': return <WhyChooseChampionPage />;
      case '#umrah-guide-in-bangla': return <UmrahGuidePage />;
      case '#hajj-guide-in-bangla': return <HajjGuidePage />;
      case '#team': return <TeamPage />;
      case '#testimonials': return <TestimonialsPage />;
      case '#blog': return <BlogPage />;
      case '#blog-post': 
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const id = params.get('id');
        return <BlogPostPage postId={id} />;
      case '#contact': return <ContactPage defaultSubject={contactSubject} />;
      case '#login': return <LoginPage />;
      case '#admin': return <AdminPage />;
      case '#home':
      default: return <HomePage />;
    }
  };

  if (isAuthLoading || isDataLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white relative overflow-hidden">
             {/* Luxury Background Effect */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(197,164,126,0.1)_0%,_transparent_70%)]"></div>
            </div>
            
            <div className="flex flex-col items-center z-10">
                {/* Luxury Pulse Logo/Icon */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-[var(--color-primary)] blur-xl opacity-20 animate-pulse"></div>
                    <svg className="w-20 h-20 text-[var(--color-primary)] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 2L4.5 6.5L5.5 22H8.5V16H15.5V22H18.5L19.5 6.5L12 2Z M12 5.8L16.2 8.2L15.8 14H8.2L7.8 8.2L12 5.8Z" />
                         <circle cx="12" cy="11" r="1.5" />
                    </svg>
                </div>
                
                <h1 className="font-display text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[#e3cba5] to-[var(--color-primary)] tracking-widest mb-2">
                    CHAMPION
                </h1>
                <p className="text-[var(--color-muted-text)] text-sm tracking-[0.3em] uppercase">Travels & Tours</p>
                
                {/* Gold Progress Bar */}
                <div className="mt-8 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] w-full animate-[shimmer_1.5s_infinite]"></div>
                </div>
            </div>
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
  }

  return (
    <div className="bg-[var(--color-dark-bg)]">
      <ThemeInjector />
      <Header activePage={page} />
      <main>
        {renderPage()}
      </main>
      <FloatingActionButton />
      <ScrollToTop />
      <PrayerTimesWidget />
      <Partners />
      <Footer />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  )
}

export default App;

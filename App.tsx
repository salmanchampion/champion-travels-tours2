
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
import MarketingPopup from './components/MarketingPopup';

// --- Announcement Bar Component ---
const AnnouncementBar: React.FC = () => {
    const { appData } = useContext(DataContext);
    const config = appData.globalConfig?.announcementBar;

    if (!config || !config.enabled) return null;

    return (
        <div 
            style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
            className="py-2 text-center text-sm font-bold tracking-wide px-4 relative z-[60]"
        >
            {config.link ? (
                <a href={config.link} className="hover:underline block w-full">
                    {config.text}
                </a>
            ) : (
                <span>{config.text}</span>
            )}
        </div>
    );
};

// Theme Injector Component
const ThemeInjector: React.FC = () => {
    const { appData, userTheme } = useContext(DataContext);
    const { theme, globalConfig } = appData;

    useEffect(() => {
        if (!theme) return;

        const { colors, fonts, ui } = theme;

        // Determine active colors based on user preference or default
        let activeColors = { ...colors };
        
        // Override primary color if user selected one
        if (userTheme.primaryColor) {
            activeColors.primary = userTheme.primaryColor;
            activeColors.primaryDark = userTheme.primaryColor; 
        }

        // Handle Light/Dark Mode logic
        if (userTheme.mode === 'light') {
            activeColors.darkBg = '#F9FAFB'; // Light Gray for Page BG
            activeColors.lightBg = '#FFFFFF'; // White for Card BG
            activeColors.lightText = '#111827'; // Dark Text
            activeColors.mutedText = '#4B5563'; // Gray Text
        } else {
            // Ensure defaults are enforced for Dark mode if coming back from light
            activeColors.darkBg = colors.darkBg;
            activeColors.lightBg = colors.lightBg;
            activeColors.lightText = colors.lightText;
            activeColors.mutedText = colors.mutedText;
        }

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

        // Inject Custom CSS from Global Config
        const customCss = globalConfig?.advanced?.customCss || '';
        
        // Advanced Typography Defaults
        const h1Size = globalConfig?.advanced?.typography?.h1Size || '3.5rem';
        const h2Size = globalConfig?.advanced?.typography?.h2Size || '2.5rem';
        const bodySize = globalConfig?.advanced?.typography?.bodySize || '1rem';
        const sectionPadding = globalConfig?.advanced?.typography?.sectionPadding || '5rem';

        const cssVariables = `
:root {
  --color-primary: ${activeColors.primary};
  --color-primary-dark: ${activeColors.primaryDark};
  --color-secondary: ${activeColors.secondary};
  --color-secondary-dark: ${activeColors.secondaryDark};
  --color-dark-bg: ${activeColors.darkBg};
  --color-light-bg: ${activeColors.lightBg};
  --color-light-text: ${activeColors.lightText};
  --color-muted-text: ${activeColors.mutedText};
  
  --font-sans: "${fonts.sans}";
  --font-display: "${fonts.display}";
  
  --ui-border-radius: ${ui.borderRadius};
  --ui-button-radius: ${buttonRadiusMap[ui.buttonStyle] || ui.borderRadius};
  --ui-shadow: ${shadowMap[ui.shadow] || 'none'};
  
  --font-size-h1: ${h1Size};
  --font-size-h2: ${h2Size};
  --font-size-body: ${bodySize};
  --section-padding: ${sectionPadding};
}
body {
    background-color: var(--color-dark-bg);
    color: var(--color-light-text);
    font-family: var(--font-sans), 'Hind Siliguri', sans-serif;
    font-size: var(--font-size-body);
}
.font-sans { font-family: var(--font-sans), 'Hind Siliguri', sans-serif; }
.font-display { font-family: var(--font-display), sans-serif; }

/* Apply dynamic typography to prose */
.prose h1 { font-size: var(--font-size-h1); }
.prose h2 { font-size: var(--font-size-h2); }

/* AOS Failsafe style: injected if AOS fails */
body.aos-force-visible [data-aos] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
}

/* Custom User CSS */
${customCss}
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

        // --- NEW: Dynamic Favicon Injection ---
        if (globalConfig?.siteIdentity?.faviconUrl) {
            let favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!favicon) {
                favicon = document.createElement('link');
                favicon.rel = 'icon';
                document.head.appendChild(favicon);
            }
            // Only update if changed to prevent flicker
            if (favicon.href !== globalConfig.siteIdentity.faviconUrl) {
                favicon.href = globalConfig.siteIdentity.faviconUrl;
            }
        }

        // --- NEW: Advanced Script Injection ---
        // Remove old injected scripts to prevent duplication/conflicts when config changes
        document.querySelectorAll('.custom-injected-script').forEach(el => el.remove());

        if (globalConfig?.advanced) {
            const injectScripts = (content: string, location: 'head' | 'body') => {
                if (!content) return;
                const temp = document.createElement('div');
                temp.innerHTML = content;
                
                Array.from(temp.childNodes).forEach(node => {
                    // Mark injected elements for future removal
                    // Note: text nodes don't support classList, so we wrap or ignore them if possible, 
                    // but here we mainly care about Elements.
                    if (node.nodeType === 1) { // Element Node
                        (node as HTMLElement).classList.add('custom-injected-script');
                    }

                    if (node.nodeName === 'SCRIPT') {
                        const s = document.createElement('script');
                        const scriptNode = node as HTMLScriptElement;
                        if (scriptNode.src) s.src = scriptNode.src;
                        if (scriptNode.type) s.type = scriptNode.type;
                        if (scriptNode.text) s.text = scriptNode.text;
                        if (scriptNode.innerHTML) s.innerHTML = scriptNode.innerHTML;
                        s.async = true; 
                        s.className = 'custom-injected-script';
                        
                        if (location === 'head') document.head.appendChild(s);
                        else document.body.appendChild(s);
                    } else {
                        if (location === 'head') document.head.appendChild(node.cloneNode(true));
                        else document.body.appendChild(node.cloneNode(true));
                    }
                });
            };

            injectScripts(globalConfig.advanced.headScripts, 'head');
            injectScripts(globalConfig.advanced.footerScripts, 'body');
        }

    }, [theme, userTheme, globalConfig]);

    return null;
};


const AppContent: React.FC = () => {
  const [page, setPage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const { isAuthenticated, isLoading: isAuthLoading } = useContext(AuthContext);
  const { appData, isLoading: isDataLoading } = useContext(DataContext);
  const keySequenceRef = useRef('');
  const secretCode = '045';

  // --- AOS Initialization & Robust Handling ---
  useEffect(() => {
    const initAOS = () => {
        const aos = (window as any).AOS;
        if (aos) {
            aos.init({
                duration: 800, 
                once: true,
                easing: 'ease-out-cubic',
                offset: 0, 
                mirror: false,
            });
            setTimeout(() => aos.refresh(), 500);
        }
    };

    if ((window as any).AOS) {
        initAOS();
    } else {
        const interval = setInterval(() => {
            if ((window as any).AOS) {
                initAOS();
                clearInterval(interval);
            }
        }, 200);
        setTimeout(() => clearInterval(interval), 3000); 
    }
    
    // Improved Visibility Failsafe: 
    // If animations are stuck hidden, force them visible after a short delay (800ms)
    const failsafeTimer = setTimeout(() => {
        document.body.classList.add('aos-force-visible');
    }, 800);

    return () => clearTimeout(failsafeTimer);
  }, []);
  // -------------------------

  // Refresh AOS whenever the page changes
  useEffect(() => {
    const aos = (window as any).AOS;
    if (aos) {
        setTimeout(() => aos.refresh(), 100);
        setTimeout(() => aos.refresh(), 1000);
    }
    // Reset the failsafe on page change to allow animations to run, but trigger backup quickly
    document.body.classList.remove('aos-force-visible');
    const failsafeTimer = setTimeout(() => {
        document.body.classList.add('aos-force-visible');
    }, 800);
    
    return () => clearTimeout(failsafeTimer);
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
    
    // Use Global Site Identity fallback
    const siteName = appData.globalConfig?.siteIdentity?.siteName || 'Champion Travels & Tours';
    const globalDesc = appData.globalConfig?.siteIdentity?.metaDescription;

    if (seo) {
      document.title = seo.title || siteName;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', seo.description || globalDesc || '');

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', seo.keywords);
    } else {
        // Fallback if SEO data is missing entirely
        document.title = siteName;
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
    <div className="bg-[var(--color-dark-bg)] min-h-screen transition-colors duration-500">
      <ThemeInjector />
      <AnnouncementBar />
      <Header activePage={page} />
      <main>
        {renderPage()}
      </main>
      {/* New Marketing Popup Config */}
      <MarketingPopup />
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

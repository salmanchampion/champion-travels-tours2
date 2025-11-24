
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NavLink } from '../data';
import ApplicationStatus from './ApplicationStatus';

interface HeaderProps {
  activePage: string;
}

const Header: React.FC<HeaderProps> = ({ activePage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [currentTagline, setCurrentTagline] = useState(0);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isStatusOpen, setIsStatusOpen] = useState(false); // Tracker State
  
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { appData, setThemeSettingsOpen } = useContext(DataContext);
  const { language, setLanguage, t } = useLanguage();
  const { header, site, globalConfig } = appData;

  const showThemeSwitcher = header.showThemeSwitcher !== false; 
  const showLanguageSwitcher = globalConfig?.language?.enableSwitcher !== false;

  const siteName = globalConfig?.siteIdentity?.siteName || 'Champion Travels & Tours';
  const siteNameParts = siteName.split(' ');
  const siteNameFirst = siteNameParts[0];
  const siteNameRest = siteNameParts.slice(1).join(' ');

  useEffect(() => {
    if (!header.taglines || header.taglines.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTagline(prev => (prev + 1) % (header.taglines?.length || 1));
    }, 5000); 
    return () => clearInterval(interval);
  }, [header.taglines]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);
      if (isMenuOpen) {
        setVisible(true);
      } else {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      }
      setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, isMenuOpen]);

  useEffect(() => {
      if (isMenuOpen) {
          setIsMenuOpen(false);
      }
  }, [activePage]);

  const isHomepage = activePage === '#home' || activePage === '';

  const getIsActive = (link: NavLink) => {
    if (link.subLinks) {
        return link.subLinks.some(subLink => subLink.href === activePage);
    }
    return activePage === link.href;
  };

  const handleMobileSubmenuToggle = (label: string) => {
    setMobileSubmenu(mobileSubmenu === label ? null : label);
  }
  
  const visibleNavLinks = header.navLinks.filter(link => link.enabled);
  const hasTaglines = header.taglines && header.taglines.length > 0;

  const toggleLanguage = () => {
      setLanguage(language === 'en' ? 'bn' : 'en');
  }

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${visible ? 'translate-y-0' : '-translate-y-full'}`}
    >
        {/* Top Bar */}
        <div className="bg-[var(--color-dark-bg)]/95 backdrop-blur-md text-[var(--color-muted-text)] py-2 text-xs md:text-sm border-b border-gray-800/50 hidden md:block">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-8">
                <div className="flex items-center space-x-6">
                    {header.contactInfo?.map(info => (
                    <a key={info.label} href={info.label === 'Phone' ? `tel:${info.value}` : `mailto:${info.value}`} className="flex items-center space-x-2 hover:text-[var(--color-primary)] transition-colors">
                        <span>{info.value}</span>
                    </a>
                    ))}
                </div>
                {hasTaglines && (
                    <div className="flex-1 text-center relative h-full overflow-hidden mx-4">
                        {header.taglines?.map((tagline, index) => (
                            <span
                                key={index}
                                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${index === currentTagline ? 'opacity-100' : 'opacity-0'}`}
                            >
                                {tagline}
                            </span>
                        ))}
                    </div>
                )}
                <div className="flex items-center space-x-4">
                    {/* Check Status Button Desktop */}
                    <button 
                        onClick={() => setIsStatusOpen(true)}
                        className="flex items-center space-x-1 hover:text-[var(--color-secondary)] transition-colors font-semibold"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Check Status</span>
                    </button>

                    {showLanguageSwitcher && (
                        <button 
                            onClick={toggleLanguage}
                            className={`text-xs font-bold uppercase border border-gray-600 px-3 py-1 rounded hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all ${language === 'bn' ? 'bg-[var(--color-primary)] text-white' : ''}`}
                        >
                            {language === 'en' ? 'বাংলা' : 'ENG'}
                        </button>
                    )}

                    {header.socialLinks?.map(link => (
                    <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name} className="hover:text-[var(--color-primary)] transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: link.icon }} />
                    </a>
                    ))}
                </div>
            </div>
        </div>

      <div className={`transition-all duration-300 border-b border-transparent ${
          (scrolled || isMenuOpen || !isHomepage) 
            ? 'bg-[var(--color-light-bg)]/95 backdrop-blur-xl shadow-[var(--ui-shadow)] border-gray-800/50' 
            : 'bg-transparent'
        }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center z-50 relative gap-3">
                {site.logoUrl && <img src={site.logoUrl} alt={siteName} className="h-10 md:h-12 w-auto" />}
                <span className="font-display text-xl md:text-2xl font-bold tracking-tight leading-none">
                    <span className="text-[var(--color-light-text)]">{siteNameFirst}</span>
                    {siteNameRest && <span className="text-[var(--color-primary)]"> {siteNameRest}</span>}
                </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                {visibleNavLinks.map((link) => (
                link.subLinks ? (
                    <div 
                    key={link.label}
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    >
                    <a
                        href={link.href === '#' ? undefined : link.href}
                        onClick={(e) => link.href === '#' && e.preventDefault()}
                        className={`flex items-center hover:text-[var(--color-primary)] transition-colors duration-300 font-medium cursor-pointer py-2 ${
                        getIsActive(link) ? 'text-[var(--color-primary)]' : 'text-[var(--color-light-text)]'
                        }`}
                    >
                        {t(link.label)} 
                        <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </a>
                    <div className={`absolute top-full left-0 w-60 pt-2 transition-all duration-200 transform origin-top-left ${openDropdown === link.label ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                        <div className="bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] shadow-xl border border-gray-700 overflow-hidden">
                            {link.subLinks.filter(sub => sub.enabled).map(subLink => (
                                <a
                                key={subLink.href}
                                href={subLink.href}
                                className={`block px-4 py-3 text-sm hover:bg-[var(--color-dark-bg)] hover:text-[var(--color-primary)] transition-colors border-b border-gray-800 last:border-0 ${
                                    activePage === subLink.href ? 'text-[var(--color-primary)] bg-[var(--color-dark-bg)]' : 'text-[var(--color-light-text)]'
                                }`}
                                >
                                {t(subLink.label)}
                                </a>
                            ))}
                        </div>
                    </div>
                    </div>
                ) : (
                    <a
                    key={link.href}
                    href={link.href}
                    className={`hover:text-[var(--color-primary)] transition-colors duration-300 font-medium text-sm lg:text-base ${
                        getIsActive(link) ? 'text-[var(--color-primary)]' : 'text-[var(--color-light-text)]'
                    }`}
                    >
                    {t(link.label)}
                    </a>
                )
                ))}
                {isAuthenticated && (
                <>
                    <div className="w-px h-6 bg-gray-600"></div>
                    <a href="#admin" className={`hover:text-[var(--color-secondary)] transition-colors duration-300 font-medium ${activePage === '#admin' ? 'text-[var(--color-secondary)]' : 'text-[var(--color-light-text)]'}`}>
                    {t('Admin Panel')}
                    </a>
                    <button onClick={logout} className="hover:text-[var(--color-secondary)] transition-colors duration-300 font-medium text-[var(--color-light-text)]">({t('Logout')})</button>
                </>
                )}
                
                {showThemeSwitcher && (
                    <button 
                        onClick={() => setThemeSettingsOpen(true)}
                        className="text-[var(--color-light-text)] hover:text-[var(--color-primary)] transition-colors p-2 rounded-full hover:bg-white/5"
                        aria-label="Theme Settings"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                )}
            </nav>
            
            <a href={header.bookNowButton.href} className="hidden md:inline-block bg-[var(--color-primary)] text-white font-bold py-2 px-6 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] transition-transform duration-300 hover:scale-105 text-sm shadow-lg">
                {t(header.bookNowButton.text)}
            </a>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center z-50">
                <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none p-2 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Toggle Menu"
                >
                    {isMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>
            </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
            className={`fixed inset-0 bg-[var(--color-dark-bg)] z-40 transition-all duration-300 md:hidden flex flex-col pt-24 px-6 overflow-y-auto h-screen ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
        >
            <div className="flex flex-col space-y-1 pb-24">
                
                {/* Mobile Top Actions */}
                <div className="flex justify-between items-center mb-6">
                    {/* Mobile Tracker */}
                    <button 
                        onClick={() => { setIsStatusOpen(true); setIsMenuOpen(false); }}
                        className="bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Check Status</span>
                    </button>

                    {showLanguageSwitcher && (
                        <button 
                            onClick={toggleLanguage}
                            className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full text-sm font-bold text-white"
                        >
                            <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
                        </button>
                    )}
                </div>

                {visibleNavLinks.map((link, index) => (
                link.subLinks ? (
                    <div key={link.label} className="w-full border-b border-gray-800/50 last:border-0" style={{ animationDelay: `${index * 50}ms` }}>
                    <button
                        onClick={() => handleMobileSubmenuToggle(link.label)}
                        className={`flex w-full items-center justify-between py-4 text-lg font-medium transition-colors hover:text-[var(--color-primary)] ${
                            getIsActive(link) ? 'text-[var(--color-primary)]' : 'text-[var(--color-light-text)]'
                        }`}
                    >
                        <span className="font-display tracking-wide text-xl">
                            {t(link.label)}
                        </span>
                        <svg className={`w-5 h-5 transition-transform duration-300 ${mobileSubmenu === link.label ? 'rotate-180 text-[var(--color-primary)]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-black/20 rounded-lg ${mobileSubmenu === link.label ? 'max-h-[500px] opacity-100 mb-4 py-2' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-col space-y-1 px-2">
                        {link.subLinks.filter(sub => sub.enabled).map(subLink => (
                            <a
                            key={subLink.href}
                            href={subLink.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block py-3 px-4 rounded-md text-base transition-colors ${
                                activePage === subLink.href 
                                    ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-semibold' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                            >
                            {t(subLink.label)}
                            </a>
                        ))}
                        </div>
                    </div>
                    </div>
                ) : (
                    <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-4 text-lg font-medium border-b border-gray-800/50 hover:text-[var(--color-primary)] transition-colors font-display tracking-wide text-xl ${
                        getIsActive(link) ? 'text-[var(--color-primary)]' : 'text-[var(--color-light-text)]'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    >
                    {t(link.label)}
                    </a>
                )
                ))}
                {isAuthenticated && (
                    <>
                        <a
                        href="#admin"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block py-4 text-lg font-medium border-b border-gray-800 text-[var(--color-secondary)] font-display tracking-wide text-xl`}
                        >
                        {t('Admin Panel')}
                        </a>
                        <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left py-4 text-lg font-medium text-red-400 font-display tracking-wide text-xl">{t('Logout')}</button>
                    </>
                )}
                <div className="pt-8 pb-12">
                    <a href={header.bookNowButton.href} onClick={() => setIsMenuOpen(false)} className="block w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold py-4 rounded-[var(--ui-button-radius)] hover:shadow-lg transition-all text-center text-xl font-display tracking-wider uppercase">
                        {t(header.bookNowButton.text)}
                    </a>
                </div>
            </div>
        </div>
      </div>
    </header>
    <ApplicationStatus isOpen={isStatusOpen} onClose={() => setIsStatusOpen(false)} />
    </>
  );
};

export default Header;

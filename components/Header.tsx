import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataContext';
import { NavLink } from '../data';

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
  
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { appData } = useContext(DataContext);
  const { header, site } = appData;

  useEffect(() => {
    if (!header.taglines || header.taglines.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTagline(prev => (prev + 1) % (header.taglines?.length || 1));
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, [header.taglines]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Logic for background change on scroll
      setScrolled(currentScrollY > 10);

      // Logic for showing/hiding header on scroll direction
      if (isMenuOpen) {
        // If mobile menu is open, always keep header visible
        setVisible(true);
      } else {
        // Hide header only if scrolling down and past the initial view
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      }
      
      // Update last scroll position, handling negative values on some devices
      setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, isMenuOpen]);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${visible ? 'translate-y-0' : '-translate-y-full'}`}
    >
        {/* Top Bar */}
        <div className="bg-[var(--color-dark-bg)]/80 backdrop-blur-sm text-[var(--color-muted-text)] py-2 text-sm border-b border-gray-800/50 hidden md:block">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-8">
                <div className="flex items-center space-x-6">
                    {header.contactInfo?.map(info => (
                    <a key={info.label} href={info.label === 'Phone' ? `tel:${info.value}` : `mailto:${info.value}`} className="flex items-center space-x-2 hover:text-[var(--color-primary)] transition-colors">
                        <span>{info.value}</span>
                    </a>
                    ))}
                </div>
                {hasTaglines && (
                    <div className="flex-1 text-center relative h-full overflow-hidden">
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
                    {header.socialLinks?.map(link => (
                    <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name} className="hover:text-[var(--color-primary)] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: link.icon }} />
                    </a>
                    ))}
                </div>
            </div>
        </div>

      <div className={`transition-all duration-300 ${(scrolled || isMenuOpen || !isHomepage) ? 'bg-[var(--color-light-bg)] shadow-[var(--ui-shadow)]' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
            <a href="#home" className="flex items-center">
                {site.logoUrl ? (
                    <img src={site.logoUrl} alt="Champion Travels & Tours Logo" className="h-12 w-auto" />
                ) : (
                    <span className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                        <span className="text-[var(--color-light-text)]">Champion</span>
                        <span className="text-[var(--color-primary)]"> Travels & Tours</span>
                    </span>
                )}
            </a>

            <nav className="hidden md:flex items-center space-x-8">
                {visibleNavLinks.map((link) => (
                link.subLinks ? (
                    <div 
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    >
                    <a
                        href={link.href === '#' ? undefined : link.href}
                        onClick={(e) => link.href === '#' && e.preventDefault()}
                        className={`flex items-center hover:text-[var(--color-primary)] transition-colors duration-300 font-medium cursor-pointer ${
                        getIsActive(link) ? 'text-[var(--color-primary)]' : 'text-[var(--color-light-text)]'
                        }`}
                    >
                        {link.label}
                        <svg className={`w-4 h-4 ml-1 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </a>
                    {openDropdown === link.label && (
                        <div className="absolute top-full left-0 mt-2 w-60 bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] shadow-[var(--ui-shadow)] py-2">
                        {link.subLinks.filter(sub => sub.enabled).map(subLink => (
                            <a
                            key={subLink.href}
                            href={subLink.href}
                            className={`block px-4 py-2 text-sm hover:bg-[var(--color-dark-bg)] hover:text-[var(--color-primary)] ${
                                activePage === subLink.href ? 'text-[var(--color-primary)]' : 'text-[var(--color-light-text)]'
                            }`}
                            >
                            {subLink.label}
                            </a>
                        ))}
                        </div>
                    )}
                    </div>
                ) : (
                    <a
                    key={link.href}
                    href={link.href}
                    className={`hover:text-[var(--color-primary)] transition-colors duration-300 font-medium ${
                        getIsActive(link) ? 'text-[var(--color-primary)]' : 'text-[var(--color-light-text)]'
                    }`}
                    >
                    {link.label}
                    </a>
                )
                ))}
                {isAuthenticated && (
                <>
                    <div className="w-px h-6 bg-gray-600"></div>
                    <a href="#admin" className={`hover:text-[var(--color-secondary)] transition-colors duration-300 font-medium ${activePage === '#admin' ? 'text-[var(--color-secondary)]' : 'text-[var(--color-light-text)]'}`}>
                    Admin Panel
                    </a>
                    <button onClick={logout} className="hover:text-[var(--color-secondary)] transition-colors duration-300 font-medium text-[var(--color-light-text)]">(Logout)</button>
                </>
                )}
            </nav>
            
            <a href={header.bookNowButton.href} className="hidden md:inline-block bg-[var(--color-primary)] text-white font-bold py-2 px-6 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] transition-transform duration-300 hover:scale-105">
                {header.bookNowButton.text}
            </a>

            <div className="md:hidden">
                <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none"
                >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                </svg>
                </button>
            </div>
            </div>
        </div>

        {isMenuOpen && (
            <div className="md:hidden bg-[var(--color-light-bg)]">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                {visibleNavLinks.map((link) => (
                link.subLinks ? (
                    <div key={link.label} className="w-full text-center">
                    <div className="flex w-full items-center justify-center">
                        <a
                        href={link.href}
                        onClick={(e) => {
                            if(link.href === '#') {
                            e.preventDefault();
                            handleMobileSubmenuToggle(link.label);
                            } else {
                            setIsMenuOpen(false);
                            }
                        }}
                        className={`hover:text-[var(--color-primary)] px-3 py-2 rounded-[var(--ui-button-radius)] text-base font-medium ${
                            getIsActive(link) ? 'text-[var(--color-primary)]' : 'text-[var(--color-light-text)]'
                        }`}
                        >
                        {link.label}
                        </a>
                        <button
                        onClick={() => handleMobileSubmenuToggle(link.label)}
                        className={`ml-1 p-1 ${
                            getIsActive(link) ? 'text-[var(--color-primary)]' : 'text-[var(--color-light-text)]'
                        } hover:text-[var(--color-primary)]`}
                        aria-label={`Toggle ${link.label} submenu`}
                        >
                        <svg className={`w-4 h-4 transition-transform ${mobileSubmenu === link.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                    </div>
                    {mobileSubmenu === link.label && (
                        <div className="pl-4 bg-[var(--color-dark-bg)] rounded-[var(--ui-border-radius)]">
                        {link.subLinks.filter(sub => sub.enabled).map(subLink => (
                            <a
                            key={subLink.href}
                            href={subLink.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block hover:text-[var(--color-primary)] px-3 py-2 rounded-[var(--ui-button-radius)] text-base font-medium ${
                                activePage === subLink.href ? 'text-[var(--color-primary)]' : 'text-[var(--color-light-text)]'
                            }`}
                            >
                            {subLink.label}
                            </a>
                        ))}
                        </div>
                    )}
                    </div>
                ) : (
                    <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`hover:text-[var(--color-primary)] block px-3 py-2 rounded-[var(--ui-button-radius)] text-base font-medium ${
                        getIsActive(link) ? 'text-[var(--color-primary)]' : 'text-[var(--color-light-text)]'
                    }`}
                    >
                    {link.label}
                    </a>
                )
                ))}
                {isAuthenticated && (
                    <>
                        <a
                        href="#admin"
                        onClick={() => setIsMenuOpen(false)}
                        className={`hover:text-[var(--color-secondary)] block px-3 py-2 rounded-[var(--ui-button-radius)] text-base font-medium ${
                            activePage === '#admin' ? 'text-[var(--color-secondary)]' : 'text-[var(--color-light-text)]'
                        }`}
                        >
                        Admin Panel
                        </a>
                        <button onClick={() => { logout(); setIsMenuOpen(false); }} className="hover:text-[var(--color-secondary)] block px-3 py-2 rounded-[var(--ui-button-radius)] text-base font-medium text-[var(--color-light-text)]">(Logout)</button>
                    </>
                )}
                <a href={header.bookNowButton.href} onClick={() => setIsMenuOpen(false)} className="mt-4 bg-[var(--color-primary)] text-white font-bold py-2 px-6 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] transition-transform duration-300 hover:scale-105">
                {header.bookNowButton.text}
                </a>
            </div>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;

import React, { useContext, useState } from 'react';
import { DataContext } from '../contexts/DataContext';

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted-text)] hover:text-[var(--color-primary)] transition-colors duration-300">
    {children}
  </a>
);

const Footer: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { footer } = appData;
  const { newsletter } = footer; // Destructure newsletter config
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const visibleQuickLinks = footer.quickLinks.links.filter(link => link.enabled);
  const visibleMainServices = footer.mainServices.links.filter(link => link.enabled);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');

    // If Google Sheet URL is provided, send data there
    if (newsletter.googleSheetUrl) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('timestamp', new Date().toISOString());
        formData.append('type', 'Newsletter Subscription');

        try {
            // Using no-cors mode to allow submission to Google Apps Script Web App without CORS errors
            // Note: we cannot read the response status in no-cors mode, so we assume success if no network error occurs.
            await fetch(newsletter.googleSheetUrl, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' 
            });
            
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error("Subscription error:", error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    } else {
        // Fallback simulation if no URL is configured
        setTimeout(() => {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1000);
    }
  }

  return (
    <footer className="bg-[var(--color-light-bg)] text-[var(--color-light-text)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Newsletter Section */}
        {newsletter && newsletter.enabled && (
            <div className="mb-16 p-6 md:p-8 bg-[var(--color-dark-bg)] rounded-[var(--ui-border-radius)] border border-gray-700/50 relative overflow-hidden shadow-lg" data-aos="fade-up">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
                    <div className="text-center lg:text-left w-full lg:w-auto">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 flex items-center justify-center lg:justify-start gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                             {newsletter.title}
                        </h3>
                        <p className="text-[var(--color-muted-text)] max-w-xl text-sm md:text-base">{newsletter.subtitle}</p>
                    </div>
                    <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 min-w-[200px] w-full">
                            <input 
                                type="email" 
                                placeholder={newsletter.placeholder} 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={status === 'submitting'}
                                className="w-full px-4 py-3 bg-[var(--color-light-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] text-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all disabled:opacity-50"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={status === 'submitting'}
                            className="w-full sm:w-auto bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold px-8 py-3 rounded-[var(--ui-border-radius)] hover:shadow-[0_0_20px_rgba(197,164,126,0.4)] transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {status === 'submitting' ? 'Submitting...' : status === 'success' ? 'Subscribed!' : status === 'error' ? 'Failed' : newsletter.buttonText}
                        </button>
                    </form>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* About Section */}
          <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
             <a href="#home" className="block mb-4">
                <span className="font-display text-3xl font-bold tracking-tight">
                    <span className="text-[var(--color-light-text)]">{footer.about.title[0]}</span>
                    <span className="text-[var(--color-primary)]"> {footer.about.title[1]}</span>
                </span>
            </a>
            <p className="text-[var(--color-muted-text)] leading-relaxed text-sm md:text-base">
              {footer.about.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-display font-semibold text-white mb-4 relative inline-block">
                {footer.quickLinks.title}
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[var(--color-primary)]"></span>
            </h3>
            <ul className="space-y-3">
              {visibleQuickLinks.map(link => (
                  <li key={link.href}><a href={link.href} className="text-[var(--color-muted-text)] hover:text-[var(--color-primary)] transition-colors block py-1 text-sm md:text-base">{link.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Main Services */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-display font-semibold text-white mb-4 relative inline-block">
                {footer.mainServices.title}
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[var(--color-primary)]"></span>
            </h3>
            <ul className="space-y-3">
              {visibleMainServices.map(link => (
                <li key={link.href}><a href={link.href} className="text-[var(--color-muted-text)] hover:text-[var(--color-primary)] transition-colors block py-1 text-sm md:text-base">{link.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-display font-semibold text-white mb-4 relative inline-block">
                {footer.followUs.title}
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[var(--color-primary)]"></span>
            </h3>
            <p className="text-[var(--color-muted-text)] mb-6 text-sm md:text-base">{footer.followUs.description}</p>
            <div className="flex space-x-4 justify-center sm:justify-start">
                <SocialIcon href="https://facebook.com">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z"/></svg>
                </SocialIcon>
                <SocialIcon href="https://instagram.com">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802C9.042 3.965 8.718 3.977 7.545 4.029c-2.502.115-3.447.447-3.955 1.054C3.04 5.588 2.686 6.544 2.57 9.045c-.052 1.172-.064 1.496-.064 4.455s.012 3.283.064 4.455c.115 2.501.448 3.447 1.054 3.955.508.508 1.453.84 3.955 1.054 1.172.052 1.496.064 4.455.064s3.283-.012 4.455-.064c2.502-.115 3.447-.447 3.955-1.054.508-.508.84-1.453 1.054-3.955.052-1.172.064 1.496.064-4.455s-.012-3.283-.064-4.455c-.115-2.501-.448-3.447-1.054-3.955-.508-.508-1.453-.84-3.955-1.054C15.282 3.977 14.958 3.965 12 3.965zM12 7.218c-2.628 0-4.782 2.154-4.782 4.782s2.154 4.782 4.782 4.782 4.782-2.154 4.782-4.782S14.628 7.218 12 7.218zm0 7.764c-1.646 0-2.982-1.336-2.982-2.982S10.354 9.018 12 9.018s2.982 1.336 2.982 2.982-1.336 2.982-2.982 2.982zm4.965-7.764c-.786 0-1.425.64-1.425 1.425s.64 1.425 1.425 1.425 1.425-.64 1.425-1.425-.639-1.425-1.425-1.425z"/></svg>
                </SocialIcon>
                <SocialIcon href="https://twitter.com">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.52 3.379 4.738 3.418-1.71 1.336-3.86 2.135-6.22 2.135-.404 0-.802-.023-1.19-.069a13.91 13.91 0 007.548 2.212c9.058 0 14.01-7.502 14.01-14.01 0-.213-.005-.426-.015-.637a10.02 10.02 0 002.46-2.548z"/></svg>
                </SocialIcon>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--color-dark-bg)] border-t border-gray-700 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--color-muted-text)] text-center md:text-left">
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} {footer.copyrightText}</p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
              <a href="#privacy-policy" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</a>
              <a href="#contact" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

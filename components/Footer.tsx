
import React, { useContext, useState } from 'react';
import { DataContext } from '../contexts/DataContext';

const SocialIcon: React.FC<{ href: string; icon: string; name: string }> = ({ href, icon, name }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    aria-label={name}
    className="text-[var(--color-muted-text)] hover:text-[var(--color-primary)] transition-colors duration-300"
  >
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: icon }} />
  </a>
);

const Footer: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { footer, header } = appData; // Access header for social links
  const { newsletter } = footer; 
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
            <div className="mb-16 p-8 bg-[var(--color-dark-bg)] rounded-[var(--ui-border-radius)] border border-gray-700/50 relative overflow-hidden shadow-lg" data-aos="fade-up">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="text-center lg:text-left">
                        <h3 className="text-2xl font-display font-bold text-white mb-2 flex items-center justify-center lg:justify-start gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                             {newsletter.title}
                        </h3>
                        <p className="text-[var(--color-muted-text)] max-w-xl">{newsletter.subtitle}</p>
                    </div>
                    <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 min-w-[280px]">
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
                            className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold px-8 py-3 rounded-[var(--ui-border-radius)] hover:shadow-[0_0_20px_rgba(197,164,126,0.4)] transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {status === 'submitting' ? 'Submitting...' : status === 'success' ? 'Subscribed!' : status === 'error' ? 'Failed' : newsletter.buttonText}
                        </button>
                    </form>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="md:col-span-2 lg:col-span-1">
             <a href="#home" className="block mb-4">
                <span className="font-display text-3xl font-bold tracking-tight">
                    <span className="text-[var(--color-light-text)]">{footer.about.title[0]}</span>
                    <span className="text-[var(--color-primary)]"> {footer.about.title[1]}</span>
                </span>
            </a>
            <p className="text-[var(--color-muted-text)] leading-relaxed">
              {footer.about.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-display font-semibold text-white mb-4">{footer.quickLinks.title}</h3>
            <ul className="space-y-2">
              {visibleQuickLinks.map(link => (
                  <li key={link.href}><a href={link.href} className="text-[var(--color-muted-text)] hover:text-[var(--color-primary)] transition-colors block py-1">{link.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Main Services */}
          <div>
            <h3 className="text-xl font-display font-semibold text-white mb-4">{footer.mainServices.title}</h3>
            <ul className="space-y-2">
              {visibleMainServices.map(link => (
                <li key={link.href}><a href={link.href} className="text-[var(--color-muted-text)] hover:text-[var(--color-primary)] transition-colors block py-1">{link.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-xl font-display font-semibold text-white mb-4">{footer.followUs.title}</h3>
            <p className="text-[var(--color-muted-text)] mb-6">{footer.followUs.description}</p>
            <div className="flex space-x-4">
                {header.socialLinks?.map(link => (
                  <SocialIcon key={link.name} href={link.href} icon={link.icon} name={link.name} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--color-dark-bg)] border-t border-gray-700 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--color-muted-text)]">
          <p className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} {footer.copyrightText}</p>
          <div className="flex space-x-4">
              <a href="#privacy-policy" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</a>
              <a href="#contact" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

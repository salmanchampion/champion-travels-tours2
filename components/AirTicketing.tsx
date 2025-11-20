import React, { useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

// --- Icon Components ---
const iconMap: { [key: string]: React.ReactNode } = {
    BestFares: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>,
    Global: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l.053.053a.5.5 0 010 .707l-.053.053L4.5 8.5l3.207-3.207a.5.5 0 01.707 0zM16.293 4.5l-.053.053a.5.5 0 000 .707l.053.053L19.5 8.5l-3.207-3.207a.5.5 0 00-.707 0z" /></svg>,
    EasyBooking: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Support: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Default: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-[var(--color-light-bg)] p-6 rounded-[var(--ui-border-radius)] flex items-start space-x-4">
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-primary)] text-white">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="mt-1 text-[var(--color-muted-text)]">{description}</p>
        </div>
    </div>
);

const FlightInquiryForm: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { form, googleAppsScriptUrl } = appData.pages.airTicketing;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        tripType: 'One Way',
        from: '',
        to: '',
        departureDate: '',
        returnDate: '',
        adults: 1,
        children: 0,
        infants: 0,
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        if (!googleAppsScriptUrl) {
            console.error('Air Ticketing Google Apps Script URL is not set in the admin panel.');
            setSubmitStatus('error');
            setIsSubmitting(false);
            return;
        }

        const formElement = e.target as HTMLFormElement;
        const submissionFormData = new FormData(formElement);
        const body = new URLSearchParams();
        submissionFormData.forEach((value, key) => {
            body.append(key, value.toString());
        });

        try {
            const response = await fetch(googleAppsScriptUrl, {
                method: 'POST',
                body: body,
            });

            if (response.ok) {
                setSubmitStatus('success');
                formElement.reset();
                 setFormData({
                    name: '', email: '', phone: '', tripType: 'One Way', from: '', to: '',
                    departureDate: '', returnDate: '', adults: 1, children: 0, infants: 0, message: ''
                });
            } else {
                throw new Error('Submission failed.');
            }
        } catch (error) {
            console.error('Error submitting flight inquiry form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] p-8 md:p-12 mt-16">
            <h3 className="text-3xl font-display font-semibold text-white mb-6 text-center">{form.title}</h3>
            <p className="text-[var(--color-muted-text)] mb-8 text-center max-w-2xl mx-auto">{form.subtitle}</p>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition" />
                </div>
                 <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Your Phone" required className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition" />
                
                <div className="pt-2">
                    <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-2 cursor-pointer text-[var(--color-light-text)]"><input type="radio" name="tripType" value="One Way" checked={formData.tripType === 'One Way'} onChange={handleChange} className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]" /><span>One Way</span></label>
                        <label className="flex items-center space-x-2 cursor-pointer text-[var(--color-light-text)]"><input type="radio" name="tripType" value="Round Trip" checked={formData.tripType === 'Round Trip'} onChange={handleChange} className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]" /><span>Round Trip</span></label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="from" value={formData.from} onChange={handleChange} placeholder="From (e.g., Dhaka)" required className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition" />
                    <input type="text" name="to" value={formData.to} onChange={handleChange} placeholder="To (e.g., Jeddah)" required className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-[var(--color-muted-text)]">Departure Date</label>
                        <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} required className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition" />
                    </div>
                     <div>
                        <label className="text-xs text-[var(--color-muted-text)]">Return Date</label>
                        <input type="date" name="returnDate" value={formData.returnDate} onChange={handleChange} disabled={formData.tripType === 'One Way'} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition disabled:opacity-50" />
                    </div>
                </div>

                 <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs text-[var(--color-muted-text)]">Adults (12+)</label>
                        <input type="number" name="adults" min="1" value={formData.adults} onChange={handleChange} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition" />
                    </div>
                    <div>
                        <label className="text-xs text-[var(--color-muted-text)]">Children (2-11)</label>
                        <input type="number" name="children" min="0" value={formData.children} onChange={handleChange} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition" />
                    </div>
                     <div>
                        <label className="text-xs text-[var(--color-muted-text)]">Infants (0-2)</label>
                        <input type="number" name="infants" min="0" value={formData.infants} onChange={handleChange} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition" />
                    </div>
                </div>

                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Additional Message (Optional)" rows={4} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"></textarea>
                
                {submitStatus === 'success' && (
                  <p className="text-green-400 text-center">Thank you for your inquiry! We will contact you with flight options shortly.</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-400 text-center">An error occurred. Please ensure the Google Apps Script URL is correctly set in the admin panel.</p>
                )}

                <button type="submit" disabled={isSubmitting} className="w-full bg-[var(--color-secondary)] text-[var(--color-dark-bg)] font-bold py-3 px-6 rounded-[var(--ui-button-radius)] hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Searching...' : form.buttonText}
                </button>
            </form>
        </div>
    );
};


const AirTicketing: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { features, contentHtml } = appData.pages.airTicketing;
    const visibleFeatures = features.filter(item => item.enabled);

    return (
        <div className="bg-[var(--color-dark-bg)]">
            <section className="pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Content Section */}
                    {contentHtml && (
                        <div 
                            className="mb-12 prose prose-invert lg:prose-xl max-w-4xl mx-auto text-center"
                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                        />
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {visibleFeatures.map(feature => <FeatureCard key={feature.title} {...feature} icon={iconMap[feature.icon] || iconMap.Default} />)}
                    </div>

                    <FlightInquiryForm />

                </div>
            </section>
        </div>
    );
};

export default AirTicketing;
import React, { useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

// --- Icon Components ---
const iconMap: { [key: string]: React.ReactNode } = {
    Tourist: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Business: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Student: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
    Medical: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>,
    Consultation: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    DocumentCheck: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Submission: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    FollowUp: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    Guidance: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>,
    Success: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    Time: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Transparent: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    Default: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
};


const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-[var(--color-light-bg)] p-6 rounded-[var(--ui-border-radius)] flex items-start space-x-4 shadow-[var(--ui-shadow)]">
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-primary)] text-white">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="mt-1 text-[var(--color-muted-text)]">{description}</p>
        </div>
    </div>
);

const ProcessStep: React.FC<{ icon: React.ReactNode; title: string; description: string; step: number; }> = ({ icon, title, description, step }) => (
    <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
            <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[var(--color-primary)] text-white text-3xl font-bold border-4 border-[var(--color-light-bg)] shadow-[var(--ui-shadow)]">
                {icon}
            </div>
            <div className="absolute -top-2 -right-2 flex items-center justify-center h-8 w-8 rounded-full bg-[var(--color-secondary)] text-[var(--color-dark-bg)] font-bold text-sm">
                {step}
            </div>
        </div>
        <h3 className="text-xl font-display font-semibold text-white mb-2">{title}</h3>
        <p className="text-[var(--color-muted-text)]">{description}</p>
    </div>
);

const VisaInquiryForm: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { form, googleAppsScriptUrl } = appData.pages.visaProcessing;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        destination: '',
        visaType: 'Tourist Visa',
        question: '',
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
            console.error('Visa Inquiry Google Apps Script URL is not set in the admin panel.');
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
                setFormData({ name: '', email: '', phone: '', destination: '', visaType: 'Tourist Visa', question: '' });
            } else {
                console.error('Visa inquiry submission failed. Response status:', response.status);
                throw new Error('Visa inquiry submission failed.');
            }
        } catch (error) {
            console.error('Error submitting visa inquiry form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16">
            <h3 className="text-3xl font-display font-semibold text-white mb-6 text-center">{form.title}</h3>
            <p className="text-[var(--color-muted-text)] mb-8 text-center max-w-2xl mx-auto">{form.subtitle}</p>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition" />
                </div>
                 <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Your Phone (Optional)" className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="Destination Country" required className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition" />
                    <select name="visaType" value={formData.visaType} onChange={handleChange} required className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition">
                        <option>Tourist Visa</option>
                        <option>Business Visa</option>
                        <option>Student Visa</option>
                        <option>Medical Visa</option>
                        <option>Other</option>
                    </select>
                </div>
                <textarea name="question" value={formData.question} onChange={handleChange} placeholder="Your Specific Question" rows={5} required className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"></textarea>
                
                {submitStatus === 'success' && (
                  <p className="text-green-400 text-center">Thank you for your inquiry! We will get back to you soon.</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-400 text-center">Something went wrong. Please check the Admin Panel for the script URL or try again later.</p>
                )}

                <button type="submit" disabled={isSubmitting} className="w-full bg-[var(--color-secondary)] text-[var(--color-dark-bg)] font-bold py-3 px-6 rounded-[var(--ui-button-radius)] hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Submitting...' : form.buttonText}
                </button>
            </form>
        </div>
    );
};

interface VisaProcessingProps {
    showTitle?: boolean;
}

const VisaProcessing: React.FC<VisaProcessingProps> = ({ showTitle = true }) => {
    const { appData } = useContext(DataContext);
    const { visaProcessing } = appData.pages;
    const { pageBanner, contentHtml, offerTitle, offerList, processTitle, processSteps, whyChooseUsTitle, whyChooseUsFeatures } = visaProcessing;

    const visibleOffers = offerList.filter(item => item.enabled);
    const visibleSteps = processSteps.filter(item => item.enabled);
    const visibleFeatures = whyChooseUsFeatures.filter(item => item.enabled);


    return (
        <div className="bg-[var(--color-dark-bg)]">
            <section className={`${showTitle ? 'py-20' : 'pb-20'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {showTitle && (
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-primary)]">{pageBanner.title}</h1>
                            <p className="mt-4 text-lg text-[var(--color-muted-text)] max-w-3xl mx-auto">{pageBanner.subtitle}</p>
                        </div>
                    )}

                    {/* Content Section */}
                    {contentHtml && (
                        <div 
                            className="mb-20 prose prose-invert lg:prose-xl max-w-4xl mx-auto text-center"
                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                        />
                    )}

                    {/* What We Offer Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-10">{offerTitle}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {visibleOffers.map(service => <FeatureCard key={service.title} {...service} icon={iconMap[service.icon] || iconMap.Default} />)}
                        </div>
                    </div>

                    {/* Our Process Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-12">{processTitle}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {visibleSteps.map((step, index) => <ProcessStep key={step.title} {...step} step={index + 1} icon={iconMap[step.icon] || iconMap.Default} />)}
                        </div>
                    </div>

                    {/* Why Choose Us Section */}
                    <div className="bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] p-8 md:p-12 shadow-[var(--ui-shadow)]">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-10">{whyChooseUsTitle}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {visibleFeatures.map(feature => <FeatureCard key={feature.title} {...feature} icon={iconMap[feature.icon] || iconMap.Default} />)}
                        </div>
                         <VisaInquiryForm />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VisaProcessing;
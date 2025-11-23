
import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { DataContext } from '../contexts/DataContext';
import { ApplicationStep } from '../types';

const ApplicationStatus: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { appData } = useContext(DataContext);
    const [passportNumber, setPassportNumber] = useState('');
    const [result, setResult] = useState<{ serviceType: string; steps: ApplicationStep[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        const searchTerm = passportNumber.trim().toUpperCase();

        if (searchTerm.length < 3) {
            setLoading(false);
            setError('Please enter a valid Passport Number.');
            return;
        }

        // Simulate network delay slightly for better UX
        setTimeout(() => {
            const foundApp = appData.applications?.find(
                app => app.passportNumber.toUpperCase() === searchTerm
            );

            if (foundApp) {
                setResult({
                    serviceType: foundApp.serviceType,
                    steps: foundApp.steps
                });
            } else {
                setError('No application found with this Passport Number.');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                </div>
                <h2 className="text-2xl font-display font-bold text-[var(--color-light-text)] mb-2">Track Application</h2>
                <p className="text-[var(--color-muted-text)] text-sm mb-6">Enter your Passport Number to check the current status of your Visa or Ticket processing.</p>

                <form onSubmit={handleSearch} className="relative mb-8">
                    <input 
                        type="text" 
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                        placeholder="Enter Passport No" 
                        className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 pl-12 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition font-mono uppercase tracking-wider"
                    />
                    <svg className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="absolute right-2 top-2 bg-[var(--color-primary)] text-white text-sm font-bold py-1.5 px-4 rounded hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-70"
                    >
                        {loading ? 'Checking...' : 'Track'}
                    </button>
                </form>

                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                {result && (
                    <div className="bg-[var(--color-dark-bg)] rounded-lg p-6 border border-gray-700 text-left animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
                            <div>
                                <span className="text-xs text-gray-500 uppercase">Passport No</span>
                                <p className="font-mono font-bold text-white text-lg">{passportNumber}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-500 uppercase">Service</span>
                                <p className="font-bold text-[var(--color-secondary)]">{result.serviceType}</p>
                            </div>
                        </div>

                        <div className="space-y-0 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-3.5 top-2 bottom-4 w-0.5 bg-gray-700"></div>

                            {result.steps.map((step, index) => (
                                <div key={index} className="relative flex items-start gap-4 pb-6 last:pb-0 group">
                                    {/* Dot */}
                                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                                        step.completed 
                                            ? 'bg-green-900 border-green-500 text-green-500' 
                                            : step.current 
                                                ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white animate-pulse' 
                                                : 'bg-gray-800 border-gray-600 text-gray-600'
                                    }`}>
                                        {step.completed ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <span className="text-xs font-bold">{index + 1}</span>
                                        )}
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 pt-1">
                                        <h4 className={`font-bold text-sm ${step.completed || step.current ? 'text-white' : 'text-gray-500'}`}>{step.label}</h4>
                                        {step.date && (
                                            <p className="text-xs text-[var(--color-muted-text)] mt-0.5">{step.date}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                            <p className="text-xs text-gray-500">
                                Need help? <a href="#contact" className="text-[var(--color-primary)] hover:underline" onClick={onClose}>Contact Support</a>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ApplicationStatus;

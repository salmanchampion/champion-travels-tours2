
import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { DataContext } from '../contexts/DataContext';

const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const TasbeehIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; 
const CurrencyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;

const ZakatCalculator: React.FC<{ googleSheetUrl?: string }> = ({ googleSheetUrl }) => {
    const [assets, setAssets] = useState({
        cash: 0,
        gold: 0,
        silver: 0,
        investments: 0,
    });
    const [liabilities, setLiabilities] = useState(0);
    const [zakatAmount, setZakatAmount] = useState<number | null>(null);
    
    // Submission State
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [userInfo, setUserInfo] = useState({ name: '', phone: '' });
    const [showSaveForm, setShowSaveForm] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAssets({ ...assets, [e.target.name]: parseFloat(e.target.value) || 0 });
    };

    const calculateZakat = () => {
        const totalAssets = assets.cash + assets.gold + assets.silver + assets.investments;
        const netWorth = totalAssets - liabilities;
        if (netWorth > 0) { 
             setZakatAmount(Math.round(netWorth * 0.025));
        } else {
            setZakatAmount(0);
        }
        setShowSaveForm(false);
        setSaveStatus('idle');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!googleSheetUrl) {
            alert('Saving functionality is not configured. Please contact admin.');
            return;
        }

        setIsSaving(true);
        
        const formData = new URLSearchParams();
        formData.append('timestamp', new Date().toISOString());
        formData.append('name', userInfo.name);
        formData.append('phone', userInfo.phone);
        formData.append('cash', assets.cash.toString());
        formData.append('gold', assets.gold.toString());
        formData.append('silver', assets.silver.toString());
        formData.append('investments', assets.investments.toString());
        formData.append('liabilities', liabilities.toString());
        formData.append('payableZakat', zakatAmount?.toString() || '0');
        formData.append('type', 'Zakat Calculation');

        try {
            const response = await fetch(googleSheetUrl, {
                method: 'POST',
                body: formData,
            });
            
            if (response.ok) {
                setSaveStatus('success');
                setUserInfo({ name: '', phone: '' });
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            console.error("Submission error:", error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4 text-[var(--color-light-text)]">
            <h3 className="text-2xl font-bold text-[var(--color-primary)] text-center mb-6">Zakat Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="number" name="cash" placeholder="Cash in Hand/Bank (BDT)" onChange={handleChange} className="w-full bg-[var(--color-dark-bg)]/50 border border-gray-600 rounded-lg p-3 focus:border-[var(--color-primary)] outline-none" />
                <input type="number" name="gold" placeholder="Value of Gold (BDT)" onChange={handleChange} className="w-full bg-[var(--color-dark-bg)]/50 border border-gray-600 rounded-lg p-3 focus:border-[var(--color-primary)] outline-none" />
                <input type="number" name="silver" placeholder="Value of Silver (BDT)" onChange={handleChange} className="w-full bg-[var(--color-dark-bg)]/50 border border-gray-600 rounded-lg p-3 focus:border-[var(--color-primary)] outline-none" />
                <input type="number" name="investments" placeholder="Business/Investments (BDT)" onChange={handleChange} className="w-full bg-[var(--color-dark-bg)]/50 border border-gray-600 rounded-lg p-3 focus:border-[var(--color-primary)] outline-none" />
            </div>
            <input type="number" placeholder="Liabilities/Debts to Pay (BDT)" value={liabilities || ''} onChange={(e) => setLiabilities(parseFloat(e.target.value) || 0)} className="w-full bg-[var(--color-dark-bg)]/50 border border-gray-600 rounded-lg p-3 focus:border-[var(--color-primary)] outline-none" />
            
            <button onClick={calculateZakat} className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold py-3 rounded-lg shadow-lg hover:opacity-90 transition">Calculate</button>
            
            {zakatAmount !== null && (
                <div className="mt-4 p-4 bg-[var(--color-secondary)]/20 border border-[var(--color-secondary)] rounded-lg text-center animate-fade-in-up">
                    <p className="text-[var(--color-muted-text)]">Your Payable Zakat:</p>
                    <p className="text-3xl font-bold text-[var(--color-light-text)]">৳ {zakatAmount.toLocaleString()}</p>
                    
                    {!showSaveForm && saveStatus !== 'success' && (
                        <button 
                            onClick={() => setShowSaveForm(true)}
                            className="mt-4 text-sm text-[var(--color-secondary)] hover:underline"
                        >
                            Save/Send Calculation
                        </button>
                    )}

                    {showSaveForm && saveStatus !== 'success' && (
                        <form onSubmit={handleSave} className="mt-4 pt-4 border-t border-gray-700/50 text-left">
                            <p className="text-sm text-[var(--color-muted-text)] mb-3 text-center">Save your calculation for future reference or consultation.</p>
                            <div className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="Your Name" 
                                    required
                                    value={userInfo.name}
                                    onChange={e => setUserInfo({...userInfo, name: e.target.value})}
                                    className="w-full bg-[var(--color-dark-bg)]/50 border border-gray-600 rounded p-2 text-sm"
                                />
                                <input 
                                    type="tel" 
                                    placeholder="Phone Number" 
                                    required
                                    value={userInfo.phone}
                                    onChange={e => setUserInfo({...userInfo, phone: e.target.value})}
                                    className="w-full bg-[var(--color-dark-bg)]/50 border border-gray-600 rounded p-2 text-sm"
                                />
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="w-full bg-[var(--color-secondary)] text-white font-bold py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save Record'}
                                </button>
                            </div>
                        </form>
                    )}

                    {saveStatus === 'success' && (
                        <p className="mt-4 text-green-400 font-medium">Calculation saved successfully!</p>
                    )}
                    {saveStatus === 'error' && (
                        <p className="mt-4 text-red-400 font-medium">Failed to save. Please try again.</p>
                    )}
                </div>
            )}
        </div>
    );
};

const DigitalTasbeeh = () => {
    const [count, setCount] = useState(0);
    const [dhikr, setDhikr] = useState('SubhanAllah');

    const handleCount = () => {
        setCount(prev => prev + 1);
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const reset = () => {
        if(confirm('Reset counter?')) setCount(0);
    };

    return (
        <div className="text-center flex flex-col items-center justify-center h-full text-[var(--color-light-text)]">
            <select value={dhikr} onChange={(e) => setDhikr(e.target.value)} className="mb-6 bg-[var(--color-dark-bg)] border border-gray-600 rounded px-4 py-2">
                <option>SubhanAllah</option>
                <option>Alhamdulillah</option>
                <option>Allahu Akbar</option>
                <option>Astaghfirullah</option>
                <option>La ilaha illallah</option>
            </select>
            
            <div className="relative w-48 h-48 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-[var(--color-primary)] opacity-20 animate-pulse"></div>
                <button 
                    onClick={handleCount}
                    className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-800 to-black border-4 border-[var(--color-primary)] flex items-center justify-center shadow-[0_0_30px_rgba(197,164,126,0.3)] active:scale-95 transition-transform"
                >
                    <span className="text-5xl font-display font-bold text-white">{count}</span>
                </button>
            </div>

            <div className="flex gap-4">
                 <button onClick={reset} className="text-sm text-red-400 hover:text-red-300 underline">Reset</button>
            </div>
        </div>
    );
};

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1);
    const [from, setFrom] = useState('SAR');
    const [to, setTo] = useState('BDT');
    
    const rates: {[key: string]: number} = {
        'SAR': 1,
        'BDT': 32.5,
        'USD': 0.27, 
        'EUR': 0.25
    };
    
    const getRate = (currency: string) => {
        if (currency === 'SAR') return 1;
        if (currency === 'BDT') return 32.5; 
        if (currency === 'USD') return 0.27;
        if (currency === 'EUR') return 0.25;
        return 1;
    }
    
    const result = (amount / getRate(from) * getRate(to)).toFixed(2);

    return (
        <div className="space-y-6 text-[var(--color-light-text)]">
             <h3 className="text-2xl font-bold text-[var(--color-primary)] text-center mb-6">Currency Converter</h3>
             <div className="flex flex-col space-y-4">
                <div className="relative">
                    <label className="block text-xs text-[var(--color-muted-text)] mb-1">Amount</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-3 text-xl font-bold outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-muted-text)] mb-1">From</label>
                        <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-3 outline-none">
                            <option value="SAR">SAR (Saudi Riyal)</option>
                            <option value="BDT">BDT (Taka)</option>
                            <option value="USD">USD (Dollar)</option>
                            <option value="EUR">EUR (Euro)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-muted-text)] mb-1">To</label>
                         <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-3 outline-none">
                            <option value="BDT">BDT (Taka)</option>
                            <option value="SAR">SAR (Saudi Riyal)</option>
                            <option value="USD">USD (Dollar)</option>
                            <option value="EUR">EUR (Euro)</option>
                        </select>
                    </div>
                </div>
                <div className="bg-[var(--color-dark-bg)]/50 p-4 rounded-lg text-center border border-gray-700 mt-4">
                    <p className="text-[var(--color-muted-text)] text-sm mb-1">Converted Amount</p>
                    <p className="text-3xl font-bold text-[var(--color-secondary)]">{result} {to}</p>
                    <p className="text-xs text-gray-500 mt-2">*Approximate rates for estimation only.</p>
                </div>
             </div>
        </div>
    );
};

const IslamicTools: React.FC = () => {
    const { appData } = useContext(DataContext);
    const config = appData.pages.home.sections.islamicTools;
    
    // Safety check if config is missing or disabled entirely
    if (!config || config.enabled === false) return null;

    const [isOpen, setIsOpen] = useState(false);
    
    // Determine visible tabs
    const showZakat = config.zakat?.enabled !== false;
    const showTasbeeh = config.tasbeeh?.enabled !== false;
    const showCurrency = config.currency?.enabled !== false;
    
    // Set initial active tab based on availability
    const [activeTab, setActiveTab] = useState<'zakat' | 'tasbeeh' | 'currency'>(
        showZakat ? 'zakat' : showTasbeeh ? 'tasbeeh' : showCurrency ? 'currency' : 'zakat'
    );

    // If all sub-tools are disabled, don't render the button
    if (!showZakat && !showTasbeeh && !showCurrency) return null;

    return (
        <>
            {/* Trigger Button - Centered and floating above the filter bar */}
            <div className="relative z-40 -mt-48 md:-mt-64 h-0 flex justify-center items-start pointer-events-none">
                 <button
                    onClick={() => setIsOpen(true)}
                    className="pointer-events-auto group relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-full hover:text-white focus:ring-4 focus:outline-none focus:ring-[var(--color-primary)]/50 shadow-[0_0_30px_rgba(197,164,126,0.6)] hover:shadow-[0_0_50px_rgba(197,164,126,0.9)] transition-all duration-300 transform hover:-translate-y-1 animate-bounce-slow"
                 >
                    <span className="absolute w-full h-full bg-gradient-to-br from-[var(--color-primary)] via-[#FDE047] to-[var(--color-secondary)] group-hover:from-[var(--color-secondary)] group-hover:to-[var(--color-primary)] transition-all duration-1000"></span>
                    <span className="relative px-6 sm:px-8 py-3 transition-all ease-in duration-75 bg-[var(--color-dark-bg)] rounded-full group-hover:bg-opacity-0 flex items-center gap-2 sm:gap-3">
                         <span className="text-[var(--color-primary)] group-hover:text-white transition-colors">
                            <CalculatorIcon />
                         </span>
                         <span className="font-display text-lg sm:text-xl font-bold text-white tracking-wide uppercase">Islamic Utility Tools</span>
                         <span className="text-[var(--color-secondary)] group-hover:text-white transition-colors hidden sm:inline">
                            <TasbeehIcon />
                         </span>
                    </span>
                 </button>
            </div>
            
             <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s infinite;
                }
            `}</style>

            {/* Modal */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="flex flex-col md:flex-row min-h-[500px]">
                     {/* Sidebar Tabs */}
                    <div className="md:w-1/3 bg-black/20 p-4 md:p-6 flex flex-row md:flex-col gap-2 md:gap-4 border-b md:border-b-0 md:border-r border-gray-700 overflow-x-auto">
                        {showZakat && (
                            <button 
                                onClick={() => setActiveTab('zakat')}
                                className={`flex-1 p-4 rounded-lg flex items-center gap-3 transition-all whitespace-nowrap ${activeTab === 'zakat' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-muted-text)] hover:bg-white/5'}`}
                            >
                                <CalculatorIcon />
                                <span className="font-bold">Zakat Calculator</span>
                            </button>
                        )}
                        {showTasbeeh && (
                            <button 
                                onClick={() => setActiveTab('tasbeeh')}
                                className={`flex-1 p-4 rounded-lg flex items-center gap-3 transition-all whitespace-nowrap ${activeTab === 'tasbeeh' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-muted-text)] hover:bg-white/5'}`}
                            >
                                <TasbeehIcon />
                                <span className="font-bold">Digital Tasbeeh</span>
                            </button>
                        )}
                        {showCurrency && (
                            <button 
                                onClick={() => setActiveTab('currency')}
                                className={`flex-1 p-4 rounded-lg flex items-center gap-3 transition-all whitespace-nowrap ${activeTab === 'currency' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-muted-text)] hover:bg-white/5'}`}
                            >
                                <CurrencyIcon />
                                <span className="font-bold">Currency Converter</span>
                            </button>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 md:p-10 bg-[var(--color-light-bg)]/30 backdrop-blur-sm overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
                        {activeTab === 'zakat' && showZakat && <ZakatCalculator googleSheetUrl={config.zakat?.googleSheetUrl} />}
                        {activeTab === 'tasbeeh' && showTasbeeh && <DigitalTasbeeh />}
                        {activeTab === 'currency' && showCurrency && <CurrencyConverter />}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default IslamicTools;
    
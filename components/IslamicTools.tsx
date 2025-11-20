
import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { DataContext } from '../contexts/DataContext';

const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const TasbeehIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; 
const CurrencyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;

// Reusable Dark Input Component
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wider ml-1">{label}</label>
        <input 
            {...props} 
            className="w-full bg-[#111827] border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all"
        />
    </div>
);

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
        const val = parseFloat(e.target.value);
        setAssets({ ...assets, [e.target.name]: isNaN(val) ? 0 : val });
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
        <div className="space-y-6 text-[var(--color-light-text)] max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-display font-bold text-[var(--color-primary)]">Zakat Calculator</h3>
                <p className="text-sm text-[var(--color-muted-text)] mt-2">Calculate your Zakat accurately based on your assets.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField type="number" name="cash" label="Cash in Hand/Bank" placeholder="Amount in BDT" onChange={handleChange} />
                <InputField type="number" name="gold" label="Value of Gold" placeholder="Amount in BDT" onChange={handleChange} />
                <InputField type="number" name="silver" label="Value of Silver" placeholder="Amount in BDT" onChange={handleChange} />
                <InputField type="number" name="investments" label="Business/Investments" placeholder="Amount in BDT" onChange={handleChange} />
            </div>
            
            <InputField type="number" label="Liabilities / Debts" placeholder="Amount in BDT" value={liabilities || ''} onChange={(e) => setLiabilities(parseFloat(e.target.value) || 0)} />
            
            <button onClick={calculateZakat} className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-[var(--color-primary)]/30 hover:-translate-y-1 transition-all duration-300 mt-4">
                CALCULATE ZAKAT
            </button>
            
            {zakatAmount !== null && (
                <div className="mt-8 p-6 bg-[#111827] border border-[var(--color-primary)] rounded-xl text-center animate-fade-in-up shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50"></div>
                    <p className="text-[var(--color-muted-text)] uppercase tracking-widest text-xs font-bold mb-2">Total Payable Zakat</p>
                    <p className="text-4xl font-display font-bold text-white mb-2">৳ {zakatAmount.toLocaleString()}</p>
                    
                    {!showSaveForm && saveStatus !== 'success' && (
                        <button 
                            onClick={() => setShowSaveForm(true)}
                            className="mt-4 text-sm text-[var(--color-primary)] hover:text-white underline transition-colors"
                        >
                            Save or Send Calculation
                        </button>
                    )}

                    {showSaveForm && saveStatus !== 'success' && (
                        <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-gray-700 text-left max-w-md mx-auto">
                            <p className="text-sm text-gray-300 mb-4 text-center">Enter details to save this record for future reference.</p>
                            <div className="space-y-4">
                                <InputField label="Your Name" type="text" placeholder="Full Name" required value={userInfo.name} onChange={e => setUserInfo({...userInfo, name: e.target.value})} />
                                <InputField label="Phone Number" type="tel" placeholder="017..." required value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} />
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="w-full bg-[var(--color-secondary)] text-white font-bold py-3 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {isSaving ? 'Saving...' : 'Save Record'}
                                </button>
                            </div>
                        </form>
                    )}

                    {saveStatus === 'success' && (
                        <div className="mt-4 p-3 bg-green-900/30 border border-green-600 rounded text-green-400 font-medium">
                            Calculation saved successfully!
                        </div>
                    )}
                    {saveStatus === 'error' && (
                        <div className="mt-4 p-3 bg-red-900/30 border border-red-600 rounded text-red-400 font-medium">
                            Failed to save. Please try again.
                        </div>
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
        if(confirm('Are you sure you want to reset the counter?')) setCount(0);
    };

    return (
        <div className="text-center flex flex-col items-center justify-center h-full text-[var(--color-light-text)] py-10">
            <div className="w-full max-w-xs mb-8">
                <label className="block text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wider mb-2 text-left">Select Dhikr</label>
                <select 
                    value={dhikr} 
                    onChange={(e) => setDhikr(e.target.value)} 
                    className="w-full bg-[#111827] border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                >
                    <option>SubhanAllah</option>
                    <option>Alhamdulillah</option>
                    <option>Allahu Akbar</option>
                    <option>Astaghfirullah</option>
                    <option>La ilaha illallah</option>
                </select>
            </div>
            
            <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)]/30 animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-4 rounded-full border border-[var(--color-primary)]/10"></div>
                
                {/* Main Button */}
                <button 
                    onClick={handleCount}
                    className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-br from-gray-800 to-black border-4 border-[var(--color-primary)] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(197,164,126,0.2)] active:scale-95 transition-transform group"
                >
                    <span className="text-[var(--color-muted-text)] text-xs uppercase tracking-widest mb-1">Count</span>
                    <span className="text-6xl font-display font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">{count}</span>
                </button>
            </div>

            <button 
                onClick={reset} 
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 px-4 py-2 rounded-full transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Reset Counter
            </button>
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
        <div className="space-y-8 text-[var(--color-light-text)] max-w-2xl mx-auto py-8">
             <div className="text-center mb-8">
                <h3 className="text-3xl font-display font-bold text-[var(--color-primary)]">Currency Converter</h3>
                <p className="text-sm text-[var(--color-muted-text)] mt-2">Real-time exchange rate estimation for pilgrims.</p>
             </div>

             <div className="bg-[#111827] p-8 rounded-xl border border-gray-700 shadow-xl">
                <div className="mb-6">
                    <InputField 
                        label="Amount" 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(parseFloat(e.target.value))} 
                        style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wider ml-1">From</label>
                        <select 
                            value={from} 
                            onChange={(e) => setFrom(e.target.value)} 
                            className="w-full bg-[#1f2937] border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-[var(--color-primary)] appearance-none"
                        >
                            <option value="SAR">SAR (Saudi Riyal)</option>
                            <option value="BDT">BDT (Taka)</option>
                            <option value="USD">USD (Dollar)</option>
                            <option value="EUR">EUR (Euro)</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wider ml-1">To</label>
                         <select 
                            value={to} 
                            onChange={(e) => setTo(e.target.value)} 
                            className="w-full bg-[#1f2937] border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-[var(--color-primary)] appearance-none"
                        >
                            <option value="BDT">BDT (Taka)</option>
                            <option value="SAR">SAR (Saudi Riyal)</option>
                            <option value="USD">USD (Dollar)</option>
                            <option value="EUR">EUR (Euro)</option>
                        </select>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-[var(--color-dark-bg)] to-[#1f2937] p-6 rounded-lg text-center border border-gray-600 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[var(--color-primary)]/5 group-hover:bg-[var(--color-primary)]/10 transition-colors"></div>
                    <p className="text-[var(--color-muted-text)] text-xs uppercase tracking-widest mb-2 relative z-10">Converted Amount</p>
                    <p className="text-4xl font-display font-bold text-[var(--color-secondary)] relative z-10">{result} <span className="text-lg text-gray-400">{to}</span></p>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center italic">*Exchange rates are approximate and for estimation only.</p>
             </div>
        </div>
    );
};

const IslamicTools: React.FC = () => {
    const { appData } = useContext(DataContext);
    const config = appData.pages.home.sections.islamicTools;
    
    if (!config || config.enabled === false) return null;

    const [isOpen, setIsOpen] = useState(false);
    
    const showZakat = config.zakat?.enabled !== false;
    const showTasbeeh = config.tasbeeh?.enabled !== false;
    const showCurrency = config.currency?.enabled !== false;
    
    const [activeTab, setActiveTab] = useState<'zakat' | 'tasbeeh' | 'currency'>(
        showZakat ? 'zakat' : showTasbeeh ? 'tasbeeh' : showCurrency ? 'currency' : 'zakat'
    );

    if (!showZakat && !showTasbeeh && !showCurrency) return null;

    return (
        <>
            {/* Trigger Button */}
            <div className="relative z-40 -mt-56 md:-mt-72 h-0 flex justify-center items-start pointer-events-none">
                 <button
                    onClick={() => setIsOpen(true)}
                    className="pointer-events-auto group relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-full hover:text-white focus:ring-4 focus:outline-none focus:ring-[var(--color-primary)]/50 shadow-[0_0_30px_rgba(197,164,126,0.6)] hover:shadow-[0_0_50px_rgba(197,164,126,0.9)] transition-all duration-300 transform hover:-translate-y-1 animate-bounce-slow"
                 >
                    <span className="absolute w-full h-full bg-gradient-to-br from-[var(--color-primary)] via-[#FDE047] to-[var(--color-secondary)] group-hover:from-[var(--color-secondary)] group-hover:to-[var(--color-primary)] transition-all duration-1000"></span>
                    <span className="relative px-6 sm:px-8 py-3 transition-all ease-in duration-75 bg-[#0f172a] rounded-full group-hover:bg-opacity-0 flex items-center gap-2 sm:gap-3">
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
                <div className="flex flex-col md:flex-row min-h-[600px] bg-[#1F2937] text-white rounded-lg overflow-hidden">
                     {/* Sidebar Tabs */}
                    <div className="md:w-1/3 bg-[#111827] p-4 md:p-6 flex flex-row md:flex-col gap-2 md:gap-4 border-b md:border-b-0 md:border-r border-gray-700 overflow-x-auto">
                        {showZakat && (
                            <button 
                                onClick={() => setActiveTab('zakat')}
                                className={`flex-1 p-4 rounded-xl flex items-center gap-4 transition-all duration-300 whitespace-nowrap ${activeTab === 'zakat' ? 'bg-[var(--color-primary)] text-white shadow-lg translate-x-1' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <CalculatorIcon />
                                <span className="font-bold font-display text-lg">Zakat Calculator</span>
                            </button>
                        )}
                        {showTasbeeh && (
                            <button 
                                onClick={() => setActiveTab('tasbeeh')}
                                className={`flex-1 p-4 rounded-xl flex items-center gap-4 transition-all duration-300 whitespace-nowrap ${activeTab === 'tasbeeh' ? 'bg-[var(--color-primary)] text-white shadow-lg translate-x-1' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <TasbeehIcon />
                                <span className="font-bold font-display text-lg">Digital Tasbeeh</span>
                            </button>
                        )}
                        {showCurrency && (
                            <button 
                                onClick={() => setActiveTab('currency')}
                                className={`flex-1 p-4 rounded-xl flex items-center gap-4 transition-all duration-300 whitespace-nowrap ${activeTab === 'currency' ? 'bg-[var(--color-primary)] text-white shadow-lg translate-x-1' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <CurrencyIcon />
                                <span className="font-bold font-display text-lg">Currency Converter</span>
                            </button>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 md:p-10 bg-[#1F2937] overflow-y-auto max-h-[80vh]">
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


import React, { useState, useContext, useEffect } from 'react';
import Modal from './Modal';
import { DataContext } from '../contexts/DataContext';

const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const TasbeehIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; 
const CurrencyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const ToolsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const ZakatCalculator: React.FC<{ googleSheetUrl?: string }> = ({ googleSheetUrl }) => {
    const [assets, setAssets] = useState({
        cash: 0,
        gold: 0, // in grams
        silver: 0, // in grams
        investments: 0,
    });
    const [goldPrice, setGoldPrice] = useState(9000); // BDT per gram approx
    const [silverPrice, setSilverPrice] = useState(120); // BDT per gram approx
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
        const totalAssets = assets.cash + (assets.gold * goldPrice) + (assets.silver * silverPrice) + assets.investments;
        const netAssets = totalAssets - liabilities;
        
        // Nisab Threshold (Approximate - 87.48g Gold or 612.36g Silver)
        // Using Silver Nisab as it's safer/lower
        const nisabThreshold = 612.36 * silverPrice; 

        if (netAssets >= nisabThreshold) {
            setZakatAmount(Math.round(netAssets * 0.025));
        } else {
            setZakatAmount(0);
        }
    };

    const saveCalculation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!googleSheetUrl || !zakatAmount) return;

        setIsSaving(true);
        const formData = new FormData();
        formData.append('name', userInfo.name);
        formData.append('phone', userInfo.phone);
        formData.append('zakatAmount', zakatAmount.toString());
        formData.append('type', 'Zakat Calculation');
        formData.append('timestamp', new Date().toISOString());

        try {
             await fetch(googleSheetUrl, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });
            setSaveStatus('success');
            setTimeout(() => {
                setSaveStatus('idle');
                setShowSaveForm(false);
            }, 3000);
        } catch (error) {
            console.error(error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">Cash in Hand/Bank (BDT)</label>
                    <input type="number" name="cash" value={assets.cash} onChange={handleChange} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-2 text-white" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">Investments/Shares (BDT)</label>
                    <input type="number" name="investments" value={assets.investments} onChange={handleChange} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-2 text-white" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">Gold (Grams)</label>
                    <input type="number" name="gold" value={assets.gold} onChange={handleChange} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-2 text-white" />
                    <input type="number" value={goldPrice} onChange={(e) => setGoldPrice(parseFloat(e.target.value) || 0)} className="mt-1 w-full text-xs bg-[var(--color-dark-bg)] border border-gray-700 rounded p-1 text-gray-400" placeholder="Price/gram" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">Silver (Grams)</label>
                    <input type="number" name="silver" value={assets.silver} onChange={handleChange} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-2 text-white" />
                    <input type="number" value={silverPrice} onChange={(e) => setSilverPrice(parseFloat(e.target.value) || 0)} className="mt-1 w-full text-xs bg-[var(--color-dark-bg)] border border-gray-700 rounded p-1 text-gray-400" placeholder="Price/gram" />
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">Liabilities/Debts (BDT)</label>
                    <input type="number" value={liabilities} onChange={(e) => setLiabilities(parseFloat(e.target.value) || 0)} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-2 text-white" />
                </div>
            </div>

            <div className="text-center pt-4">
                <button onClick={calculateZakat} className="bg-[var(--color-primary)] text-white font-bold py-2 px-6 rounded hover:bg-[var(--color-primary-dark)] transition-colors">
                    Calculate Zakat
                </button>
            </div>

            {zakatAmount !== null && (
                <div className="mt-6 p-4 bg-[var(--color-dark-bg)] rounded border border-[var(--color-primary)] text-center">
                    <h3 className="text-lg text-[var(--color-muted-text)]">Your Payable Zakat:</h3>
                    <p className="text-3xl font-bold text-[var(--color-primary)]">BDT {zakatAmount.toLocaleString()}</p>
                    {zakatAmount === 0 && <p className="text-sm text-gray-400 mt-2">Your net assets are below the Nisab threshold.</p>}

                    {zakatAmount > 0 && googleSheetUrl && !showSaveForm && (
                        <button onClick={() => setShowSaveForm(true)} className="mt-4 text-sm text-[var(--color-secondary)] hover:underline">
                            Save for Record
                        </button>
                    )}

                    {showSaveForm && (
                        <form onSubmit={saveCalculation} className="mt-4 space-y-3 max-w-xs mx-auto">
                            <input type="text" placeholder="Your Name" value={userInfo.name} onChange={e => setUserInfo({...userInfo, name: e.target.value})} required className="w-full bg-[var(--color-light-bg)] border border-gray-600 rounded p-2 text-white text-sm"/>
                            <input type="tel" placeholder="Phone Number" value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} required className="w-full bg-[var(--color-light-bg)] border border-gray-600 rounded p-2 text-white text-sm"/>
                            <button type="submit" disabled={isSaving} className="w-full bg-[var(--color-secondary)] text-[var(--color-dark-bg)] font-bold py-2 rounded text-sm">
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            {saveStatus === 'success' && <p className="text-green-400 text-xs">Saved successfully!</p>}
                            {saveStatus === 'error' && <p className="text-red-400 text-xs">Failed to save.</p>}
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

const TasbeehCounter: React.FC = () => {
    const [count, setCount] = useState(0);
    const [dhikr, setDhikr] = useState('SubhanAllah');

    return (
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
            <select 
                value={dhikr} 
                onChange={(e) => { setDhikr(e.target.value); setCount(0); }}
                className="bg-[var(--color-dark-bg)] border border-gray-600 text-white rounded px-4 py-2 focus:outline-none focus:border-[var(--color-primary)]"
            >
                <option>SubhanAllah</option>
                <option>Alhamdulillah</option>
                <option>Allahu Akbar</option>
                <option>Astaghfirullah</option>
                <option>La ilaha illallah</option>
            </select>

            <div className="w-48 h-48 rounded-full border-8 border-[var(--color-primary)] flex items-center justify-center bg-[var(--color-dark-bg)] shadow-[0_0_30px_rgba(197,164,126,0.3)] relative">
                <span className="text-6xl font-display font-bold text-white">{count}</span>
                <button 
                    onClick={() => setCount(0)}
                    className="absolute bottom-8 text-xs text-gray-400 hover:text-red-400 uppercase tracking-widest"
                >
                    Reset
                </button>
            </div>

            <button 
                onClick={() => setCount(c => c + 1)}
                className="w-24 h-24 rounded-full bg-[var(--color-primary)] text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        </div>
    );
};

const CurrencyConverter: React.FC = () => {
    const [amount, setAmount] = useState(1);
    const [from, setFrom] = useState('SAR');
    const [to, setTo] = useState('BDT');
    
    // Simplified static rates for demo purposes
    const rates: {[key: string]: number} = {
        'SAR-BDT': 32.5,
        'BDT-SAR': 0.0307,
        'USD-BDT': 121.5,
        'BDT-USD': 0.0082,
        'SAR-USD': 0.266,
        'USD-SAR': 3.75,
    };

    const convertedAmount = rates[`${from}-${to}`] 
        ? (amount * rates[`${from}-${to}`]).toFixed(2) 
        : amount.toFixed(2); // Fallback if same currency

    return (
        <div className="space-y-6 py-4">
            <div className="flex items-center space-x-4">
                <div className="flex-1">
                    <label className="block text-xs text-[var(--color-muted-text)] mb-1">Amount</label>
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} 
                        className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-3 text-white text-lg font-bold"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs text-[var(--color-muted-text)] mb-1">From</label>
                    <select 
                        value={from} 
                        onChange={(e) => setFrom(e.target.value)}
                        className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-3 text-white"
                    >
                        <option value="SAR">SAR (Saudi Riyal)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="BDT">BDT (Taka)</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-primary)] rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex-1">
                    <label className="block text-xs text-[var(--color-muted-text)] mb-1">Converted Amount</label>
                    <div className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-3 text-[var(--color-primary)] text-lg font-bold">
                        {convertedAmount}
                    </div>
                </div>
                 <div className="flex-1">
                    <label className="block text-xs text-[var(--color-muted-text)] mb-1">To</label>
                    <select 
                        value={to} 
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-3 text-white"
                    >
                        <option value="BDT">BDT (Taka)</option>
                        <option value="SAR">SAR (Saudi Riyal)</option>
                        <option value="USD">USD (US Dollar)</option>
                    </select>
                </div>
            </div>
            <p className="text-center text-xs text-[var(--color-muted-text)] mt-4">
                *Rates are approximate and for reference only. Actual exchange rates may vary.
            </p>
        </div>
    );
};

const IslamicTools: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { islamicTools } = appData.pages.home.sections;
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'zakat' | 'tasbeeh' | 'currency'>('zakat');

    // Set initial active tab based on what's enabled
    useEffect(() => {
        if (isOpen) {
            if (islamicTools.zakat.enabled) setActiveTab('zakat');
            else if (islamicTools.tasbeeh.enabled) setActiveTab('tasbeeh');
            else if (islamicTools.currency.enabled) setActiveTab('currency');
        }
    }, [isOpen, islamicTools]);

    if (!islamicTools || !islamicTools.enabled) return null;

    return (
        <>
            {/* Floating Button (Left Side) */}
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 bg-[var(--color-primary)] text-white p-3 rounded-r-lg shadow-lg hover:bg-[var(--color-primary-dark)] transition-all duration-300 group border border-l-0 border-white/20"
                aria-label="Islamic Tools"
                title="Islamic Tools"
            >
                <div className="flex flex-col items-center gap-2">
                    <ToolsIcon />
                    <span className="writing-mode-vertical text-xs font-bold uppercase tracking-wider hidden group-hover:block transition-all duration-300 transform rotate-180" style={{ writingMode: 'vertical-rl' }}>
                        Tools
                    </span>
                </div>
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="text-[var(--color-light-text)]">
                    <h2 className="text-2xl font-display font-bold text-[var(--color-primary)] mb-6 text-center">Islamic Utility Tools</h2>
                    
                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center mb-6 border-b border-gray-700">
                        {islamicTools.zakat.enabled && (
                            <button 
                                onClick={() => setActiveTab('zakat')}
                                className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'zakat' ? 'text-[var(--color-primary)] border-[var(--color-primary)]' : 'text-[var(--color-muted-text)] border-transparent hover:text-white'}`}
                            >
                                Zakat
                            </button>
                        )}
                        {islamicTools.tasbeeh.enabled && (
                            <button 
                                onClick={() => setActiveTab('tasbeeh')}
                                className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'tasbeeh' ? 'text-[var(--color-primary)] border-[var(--color-primary)]' : 'text-[var(--color-muted-text)] border-transparent hover:text-white'}`}
                            >
                                Tasbeeh
                            </button>
                        )}
                        {islamicTools.currency.enabled && (
                            <button 
                                onClick={() => setActiveTab('currency')}
                                className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'currency' ? 'text-[var(--color-primary)] border-[var(--color-primary)]' : 'text-[var(--color-muted-text)] border-transparent hover:text-white'}`}
                            >
                                Currency
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="min-h-[300px]">
                        {activeTab === 'zakat' && islamicTools.zakat.enabled && <ZakatCalculator googleSheetUrl={islamicTools.zakat.googleSheetUrl} />}
                        {activeTab === 'tasbeeh' && islamicTools.tasbeeh.enabled && <TasbeehCounter />}
                        {activeTab === 'currency' && islamicTools.currency.enabled && <CurrencyConverter />}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default IslamicTools;
    
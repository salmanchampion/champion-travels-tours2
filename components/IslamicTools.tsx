
import React, { useState } from 'react';

const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const TasbeehIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; // Fallback icon
const CurrencyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;

const ZakatCalculator = () => {
    const [assets, setAssets] = useState({
        cash: 0,
        gold: 0,
        silver: 0,
        investments: 0,
    });
    const [liabilities, setLiabilities] = useState(0);
    const [zakatAmount, setZakatAmount] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAssets({ ...assets, [e.target.name]: parseFloat(e.target.value) || 0 });
    };

    const calculateZakat = () => {
        const totalAssets = assets.cash + assets.gold + assets.silver + assets.investments;
        const netWorth = totalAssets - liabilities;
        if (netWorth > 0) { // Nisab check simplified
             setZakatAmount(Math.round(netWorth * 0.025));
        } else {
            setZakatAmount(0);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[var(--color-primary)] text-center mb-6">Zakat Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="number" name="cash" placeholder="Cash in Hand/Bank (BDT)" onChange={handleChange} className="w-full bg-[var(--color-dark-bg)]/50 border border-gray-600 rounded-lg p-3 text-[var(--color-light-text)] focus:border-[var(--color-primary)] outline-none" />
                <input type="number" name="gold" placeholder="Value of Gold (BDT)" onChange={handleChange} className="w-full bg-[var(--color-dark-bg)]/50 border border-gray-600 rounded-lg p-3 text-[var(--color-light-text)] focus:border-[var(--color-primary)] outline-none" />
                <input type="number" name="silver" placeholder="Value of Silver (BDT)" onChange={handleChange} className="w-full bg-[var(--color-dark-bg)]/50 border border-gray-600 rounded-lg p-3 text-[var(--color-light-text)] focus:border-[var(--color-primary)] outline-none" />
                <input type="number" name="investments" placeholder="Business/Investments (BDT)" onChange={handleChange} className="w-full bg-[var(--color-dark-bg)]/50 border border-gray-600 rounded-lg p-3 text-[var(--color-light-text)] focus:border-[var(--color-primary)] outline-none" />
            </div>
            <input type="number" placeholder="Liabilities/Debts to Pay (BDT)" value={liabilities || ''} onChange={(e) => setLiabilities(parseFloat(e.target.value) || 0)} className="w-full bg-[var(--color-dark-bg)]/50 border border-gray-600 rounded-lg p-3 text-[var(--color-light-text)] focus:border-[var(--color-primary)] outline-none" />
            
            <button onClick={calculateZakat} className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold py-3 rounded-lg shadow-lg hover:opacity-90 transition">Calculate</button>
            
            {zakatAmount !== null && (
                <div className="mt-4 p-4 bg-[var(--color-secondary)]/20 border border-[var(--color-secondary)] rounded-lg text-center">
                    <p className="text-[var(--color-muted-text)]">Your Payable Zakat:</p>
                    <p className="text-3xl font-bold text-[var(--color-light-text)]">৳ {zakatAmount.toLocaleString()}</p>
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
        if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
    };

    const reset = () => {
        if(confirm('Reset counter?')) setCount(0);
    };

    return (
        <div className="text-center flex flex-col items-center justify-center h-full">
            <select value={dhikr} onChange={(e) => setDhikr(e.target.value)} className="mb-6 bg-[var(--color-dark-bg)] border border-gray-600 rounded px-4 py-2 text-[var(--color-light-text)]">
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
    
    // Static approximate rates
    const rates: {[key: string]: number} = {
        'SAR': 1,
        'BDT': 32.5, // 1 SAR = 32.5 BDT
        'USD': 0.27, // 1 SAR = 0.27 USD
        'EUR': 0.25  // 1 SAR = 0.25 EUR
    };
    
    // Conversion logic relative to base SAR
    const getRate = (currency: string) => {
        if (currency === 'SAR') return 1;
        if (currency === 'BDT') return 32.5; // 1 SAR
        if (currency === 'USD') return 0.27;
        if (currency === 'EUR') return 0.25;
        return 1;
    }

    // Simple conversion: Convert to SAR first, then to Target
    // e.g. 100 BDT -> ? USD
    // 100 BDT / 32.5 = 3.07 SAR
    // 3.07 SAR * 0.27 = 0.83 USD
    
    const result = (amount / getRate(from) * getRate(to)).toFixed(2);

    return (
        <div className="space-y-6">
             <h3 className="text-2xl font-bold text-[var(--color-primary)] text-center mb-6">Currency Converter</h3>
             <div className="flex flex-col space-y-4">
                <div className="relative">
                    <label className="block text-xs text-[var(--color-muted-text)] mb-1">Amount</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-3 text-[var(--color-light-text)] text-xl font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-muted-text)] mb-1">From</label>
                        <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-3 text-[var(--color-light-text)]">
                            <option value="SAR">SAR (Saudi Riyal)</option>
                            <option value="BDT">BDT (Taka)</option>
                            <option value="USD">USD (Dollar)</option>
                            <option value="EUR">EUR (Euro)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-muted-text)] mb-1">To</label>
                         <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded p-3 text-[var(--color-light-text)]">
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
    const [activeTab, setActiveTab] = useState<'zakat' | 'tasbeeh' | 'currency'>('zakat');

    return (
        <section className="py-20 bg-[var(--color-dark-bg)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/islamic-style.png')] opacity-5"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10" data-aos="fade-up">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-light-text)]">Islamic Utility Tools</h2>
                    <p className="text-[var(--color-muted-text)] mt-4">Useful tools for your daily spiritual and travel needs.</p>
                </div>

                <div className="max-w-4xl mx-auto" data-aos="zoom-in">
                    <div className="glass-card rounded-[var(--ui-border-radius)] overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                        {/* Sidebar Tabs */}
                        <div className="md:w-1/3 bg-black/20 p-4 md:p-6 flex flex-row md:flex-col gap-2 md:gap-4 border-b md:border-b-0 md:border-r border-gray-700">
                            <button 
                                onClick={() => setActiveTab('zakat')}
                                className={`flex-1 p-4 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'zakat' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-muted-text)] hover:bg-white/5'}`}
                            >
                                <CalculatorIcon />
                                <span className="font-bold">Zakat Calculator</span>
                            </button>
                            <button 
                                onClick={() => setActiveTab('tasbeeh')}
                                className={`flex-1 p-4 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'tasbeeh' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-muted-text)] hover:bg-white/5'}`}
                            >
                                <TasbeehIcon />
                                <span className="font-bold">Digital Tasbeeh</span>
                            </button>
                            <button 
                                onClick={() => setActiveTab('currency')}
                                className={`flex-1 p-4 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'currency' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-muted-text)] hover:bg-white/5'}`}
                            >
                                <CurrencyIcon />
                                <span className="font-bold">Currency Converter</span>
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 md:p-10 bg-[var(--color-light-bg)]/30 backdrop-blur-sm">
                            {activeTab === 'zakat' && <ZakatCalculator />}
                            {activeTab === 'tasbeeh' && <DigitalTasbeeh />}
                            {activeTab === 'currency' && <CurrencyConverter />}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IslamicTools;

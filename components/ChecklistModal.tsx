
import React, { useState, useEffect, useContext } from 'react';
import Modal from './Modal';
import { DataContext } from '../contexts/DataContext';

// Checklist Data Structure
interface ChecklistItem {
    id: string;
    labelEn: string;
    labelBn: string;
}

interface ChecklistCategory {
    id: string;
    titleEn: string;
    titleBn: string;
    items: ChecklistItem[];
}

const checklistData: ChecklistCategory[] = [
    {
        id: 'documents',
        titleEn: 'Important Documents',
        titleBn: 'জরুরী নথিপত্র',
        items: [
            { id: 'doc_passport', labelEn: 'Original Passport & Copies', labelBn: 'আসল পাসপোর্ট এবং ফটোকপি' },
            { id: 'doc_visa', labelEn: 'Visa Printout', labelBn: 'ভিসার প্রিন্ট কপি' },
            { id: 'doc_ticket', labelEn: 'Flight Ticket Printout', labelBn: 'বিমান টিকিটের কপি' },
            { id: 'doc_nid', labelEn: 'NID / Smart Card', labelBn: 'এনআইডি / স্মার্ট কার্ড' },
            { id: 'doc_vaccine', labelEn: 'Vaccination Certificate', labelBn: 'টিকা সনদ' },
            { id: 'doc_hotel', labelEn: 'Hotel Booking Confirmation', labelBn: 'হোটেল বুকিং কনফার্মেশন' },
            { id: 'doc_money', labelEn: 'Currency (Riyals/Dollars)', labelBn: 'নগদ টাকা (রিয়াল/ডলার)' },
        ]
    },
    {
        id: 'clothing_men',
        titleEn: 'Clothing (Men)',
        titleBn: 'পোশাক (পুরুষ)',
        items: [
            { id: 'men_ihram', labelEn: 'Ihram Sheets (2 Sets)', labelBn: 'ইহরামের কাপড় (২ সেট)' },
            { id: 'men_belt', labelEn: 'Ihram Belt', labelBn: 'ইহরাম বেল্ট' },
            { id: 'men_sandal', labelEn: 'Comfortable Sandals', labelBn: 'আরামদায়ক স্যান্ডেল' },
            { id: 'men_punjabi', labelEn: 'Punjabi/Thobes', labelBn: 'পাঞ্জাবি/জুব্বা' },
            { id: 'men_underwear', labelEn: 'Undergarments', labelBn: 'অন্তর্বাস' },
            { id: 'men_towel', labelEn: 'Towel', labelBn: 'তোয়ালে' },
        ]
    },
    {
        id: 'clothing_women',
        titleEn: 'Clothing (Women)',
        titleBn: 'পোশাক (মহিলা)',
        items: [
            { id: 'women_abaya', labelEn: 'Abaya/Burqa (3-4 Sets)', labelBn: 'বোরকা/আবায়া (৩-৪ সেট)' },
            { id: 'women_hijab', labelEn: 'Hijab/Scarf', labelBn: 'হিজাব/ওড়না' },
            { id: 'women_socks', labelEn: 'Socks & Gloves', labelBn: 'মোজা এবং হাতমোজা' },
            { id: 'women_shoes', labelEn: 'Walking Shoes', labelBn: 'হাঁটার জুতা' },
            { id: 'women_personal', labelEn: 'Personal Hygiene Items', labelBn: 'ব্যক্তিগত পরিচ্ছন্নতা সামগ্রী' },
        ]
    },
    {
        id: 'health',
        titleEn: 'Health & Medicine',
        titleBn: 'স্বাস্থ্য ও ঔষধ',
        items: [
            { id: 'med_prescription', labelEn: 'Doctor\'s Prescription', labelBn: 'ডাক্তারের প্রেসক্রিপশন' },
            { id: 'med_regular', labelEn: 'Daily Medicines (BP, Diabetes)', labelBn: 'নিয়মিত ঔষধ (প্রেসার, ডায়াবেটিস)' },
            { id: 'med_pain', labelEn: 'Painkillers (Paracetamol)', labelBn: 'ব্যথানাশক ঔষধ (প্যারাসিটামল)' },
            { id: 'med_gastric', labelEn: 'Gastric/Antacid Medicine', labelBn: 'গ্যাস্ট্রিকের ঔষধ' },
            { id: 'med_ors', labelEn: 'Oral Saline', labelBn: 'খাবার স্যালাইন' },
            { id: 'med_mask', labelEn: 'Face Masks', labelBn: 'মাস্ক' },
            { id: 'med_vaseline', labelEn: 'Vaseline/Lotion (Unscented)', labelBn: 'ভ্যাসলিন/লোশন (সুগন্ধিহীন)' },
        ]
    },
    {
        id: 'gadgets',
        titleEn: 'Gadgets & Others',
        titleBn: 'গ্যাজেট ও অন্যান্য',
        items: [
            { id: 'gad_phone', labelEn: 'Smartphone & Charger', labelBn: 'স্মার্টফোন ও চার্জার' },
            { id: 'gad_powerbank', labelEn: 'Power Bank', labelBn: 'পাওয়ার ব্যাংক' },
            { id: 'gad_adapter', labelEn: 'Universal Adapter (3 Pin)', labelBn: 'ইউনিভার্সাল অ্যাডাপ্টার' },
            { id: 'gad_umbrella', labelEn: 'Umbrella/Cap', labelBn: 'ছাতা/টুপি' },
            { id: 'gad_bag', labelEn: 'Small Shoe Bag', labelBn: 'ছোট জুতার ব্যাগ' },
            { id: 'gad_soap', labelEn: 'Unscented Soap', labelBn: 'সুগন্ধিহীন সাবান' },
            { id: 'gad_tasbeeh', labelEn: 'Digital Tasbeeh', labelBn: 'ডিজিটাল তসবিহ' },
        ]
    }
];

const ChecklistModal: React.FC = () => {
    const { isChecklistOpen, setChecklistOpen } = useContext(DataContext);
    const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
    const [activeTab, setActiveTab] = useState(checklistData[0].id);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('hajj_checklist_progress');
        if (saved) {
            try {
                setCheckedItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load checklist", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (Object.keys(checkedItems).length > 0) {
            localStorage.setItem('hajj_checklist_progress', JSON.stringify(checkedItems));
        }
    }, [checkedItems]);

    const handleToggle = (id: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to clear your progress?')) {
            setCheckedItems({});
            localStorage.removeItem('hajj_checklist_progress');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Calculate progress
    const totalItems = checklistData.reduce((acc, cat) => acc + cat.items.length, 0);
    const completedItems = Object.values(checkedItems).filter(Boolean).length;
    const progress = Math.round((completedItems / totalItems) * 100);

    const activeCategory = checklistData.find(c => c.id === activeTab) || checklistData[0];

    return (
        <Modal isOpen={isChecklistOpen} onClose={() => setChecklistOpen(false)}>
            <div id="printable-area" className="w-full max-w-4xl mx-auto bg-[var(--color-dark-bg)] text-[var(--color-light-text)] rounded-lg overflow-hidden flex flex-col h-[80vh] md:h-auto">
                
                {/* Header */}
                <div className="p-6 bg-[var(--color-light-bg)] border-b border-gray-700">
                    <div className="flex justify-between items-start mb-4 print:hidden">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-primary)]">Preparation Checklist</h2>
                            <p className="text-sm text-[var(--color-muted-text)]">হজ্জ ও ওমরাহ প্রস্তুতির চেকলিস্ট</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handlePrint}
                                className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:text-white bg-[var(--color-dark-bg)] px-3 py-1 rounded border border-[var(--color-primary)] transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print
                            </button>
                            <button onClick={handleReset} className="text-xs text-red-400 hover:text-white underline">Reset</button>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-600 print:hidden">
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--color-secondary)] to-green-400 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white shadow-black drop-shadow-md">{progress}% Completed</span>
                    </div>
                    {progress === 100 && (
                        <p className="text-center text-green-400 text-sm mt-2 font-bold animate-pulse print:hidden">আলহামদুলিল্লাহ! আপনার প্রস্তুতি সম্পন্ন হয়েছে।</p>
                    )}
                </div>

                {/* Body */}
                <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
                    {/* Tabs (Hidden in Print) */}
                    <div className="w-full md:w-1/3 bg-[var(--color-dark-bg)] border-r border-gray-700 overflow-x-auto md:overflow-y-auto flex md:flex-col scrollbar-thin scrollbar-thumb-[var(--color-primary)] print:hidden">
                        {checklistData.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`p-4 text-left flex items-center justify-between transition-colors border-b border-gray-800 md:border-b-0 md:border-r-2 whitespace-nowrap ${
                                    activeTab === cat.id 
                                    ? 'bg-[var(--color-light-bg)] text-[var(--color-primary)] border-[var(--color-primary)]' 
                                    : 'text-gray-400 hover:bg-gray-800 border-transparent'
                                }`}
                            >
                                <span className="font-medium">{cat.titleBn}</span>
                                {/* Category Completion Indicator */}
                                {(() => {
                                    const catTotal = cat.items.length;
                                    const catDone = cat.items.filter(i => checkedItems[i.id]).length;
                                    return (
                                        <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${catDone === catTotal ? 'bg-green-900 text-green-400' : 'bg-gray-700'}`}>
                                            {catDone}/{catTotal}
                                        </span>
                                    );
                                })()}
                            </button>
                        ))}
                    </div>

                    {/* List Items (Main Content) */}
                    <div className="flex-1 p-6 overflow-y-auto bg-[var(--color-light-bg)] print:overflow-visible">
                        {/* Print Header (Only visible when printing) */}
                        <div className="hidden print:block mb-6 text-center">
                            <h1 className="text-2xl font-bold text-black">Champion Travels - Preparation Checklist</h1>
                            <p className="text-sm text-gray-600">Call: +8801718425042</p>
                        </div>

                        {/* Logic: For screen show active tab, for print show ALL */}
                        <div className="print:hidden">
                            <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">{activeCategory.titleBn}</h3>
                            <div className="space-y-3">
                                {activeCategory.items.map(item => (
                                    <ChecklistItemComponent key={item.id} item={item} checked={!!checkedItems[item.id]} onToggle={() => handleToggle(item.id)} />
                                ))}
                            </div>
                        </div>

                        <div className="hidden print:block space-y-6">
                            {checklistData.map(cat => (
                                <div key={cat.id} className="avoid-break">
                                    <h3 className="text-lg font-bold text-black border-b border-black pb-1 mb-2">{cat.titleBn} / {cat.titleEn}</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {cat.items.map(item => (
                                            <div key={item.id} className="flex items-center gap-2 text-black text-sm">
                                                <div className={`w-4 h-4 border border-black ${checkedItems[item.id] ? 'bg-gray-800' : ''}`}></div>
                                                <span>{item.labelBn}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-area, #printable-area * {
                        visibility: visible;
                    }
                    #printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: auto;
                        background: white !important;
                        color: black !important;
                    }
                    .avoid-break {
                        break-inside: avoid;
                    }
                }
            `}</style>
        </Modal>
    );
};

const ChecklistItemComponent: React.FC<{ item: ChecklistItem, checked: boolean, onToggle: () => void }> = ({ item, checked, onToggle }) => (
    <label 
        className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer ${
            checked 
            ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]' 
            : 'bg-[var(--color-dark-bg)] border-gray-700 hover:border-gray-500'
        }`}
    >
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
            checked 
            ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' 
            : 'border-gray-500'
        }`}>
            {checked && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            )}
        </div>
        <input 
            type="checkbox" 
            className="hidden" 
            checked={checked} 
            onChange={onToggle} 
        />
        <div>
            <p className={`font-bold text-base ${checked ? 'text-[var(--color-primary)] line-through' : 'text-white'}`}>{item.labelBn}</p>
            <p className="text-xs text-[var(--color-muted-text)]">{item.labelEn}</p>
        </div>
    </label>
);

export default ChecklistModal;


import React, { useState, useContext, useMemo } from 'react';
import PageBanner from '../components/PageBanner';
import { DataContext } from '../contexts/DataContext';
import { defaultData, AppData, ExclusivePackage, Application } from '../data';
import { AdminInput, AdminTextarea, ToggleSwitch, Section } from '../components/admin/AdminUI';
import { SeoEditor, PackageEditor, ExpertGuideEditor, CustomPageEditor, BlogEditor } from '../components/admin/AdminEditors';


// --- Helper Component: Page ID Display ---
const PageIdDisplay: React.FC<{ id: string; label?: string }> = ({ id, label = "Page ID" }) => (
    <div className="flex items-center gap-3 mb-6 p-3 bg-blue-900/20 border border-blue-800 rounded-md">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
        </div>
        <div>
            <span className="text-xs text-blue-300 font-bold uppercase tracking-wider block">{label}</span>
            <div className="flex items-center gap-2">
                <code className="text-white font-mono bg-black/40 px-2 py-0.5 rounded select-all text-sm border border-blue-900/50">{id}</code>
                <span className="text-[10px] text-gray-400 hidden sm:inline">(Copy this ID to link in Header/Footer)</span>
            </div>
        </div>
    </div>
);

// --- Helper Editor for Exclusive Packages ---
const ExclusivePackageEditor: React.FC<{
    pkg: ExclusivePackage;
    index: number;
    path: string; // 'exclusiveHajj.packages' or 'exclusiveUmrah.packages'
    onChange: (path: string, index: number, field: string, value: any) => void;
    onDelete: (path: string, index: number) => void;
}> = ({ pkg, index, path, onChange, onDelete }) => {
    return (
        <div className="mb-6 p-4 border border-gray-700 rounded-md bg-[var(--color-dark-bg)]">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-xl text-[var(--color-secondary)]">{pkg.title || `Package ${index + 1}`}</h4>
                <div className="flex items-center gap-4">
                    <ToggleSwitch 
                        label="Visible" 
                        enabled={pkg.enabled} 
                        onChange={(enabled) => onChange(path, index, 'enabled', enabled)} 
                    />
                    <button onClick={() => onDelete(path, index)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput label="Package Title" name="title" value={pkg.title} onChange={e => onChange(path, index, e.target.name, e.target.value)} />
                <AdminInput label="Category (e.g., Shifting, 5 Star)" name="category" value={pkg.category} onChange={e => onChange(path, index, e.target.name, e.target.value)} />
                <AdminInput label="Price" name="price" value={pkg.price} onChange={e => onChange(path, index, e.target.name, e.target.value)} />
                <AdminInput label="Duration" name="duration" value={pkg.duration} onChange={e => onChange(path, index, e.target.name, e.target.value)} />
                <AdminInput label="Makkah Hotel" name="makkahHotel" value={pkg.makkahHotel} onChange={e => onChange(path, index, e.target.name, e.target.value)} />
                <AdminInput label="Madinah Hotel" name="madinahHotel" value={pkg.madinahHotel} onChange={e => onChange(path, index, e.target.name, e.target.value)} />
                <AdminInput label="Image URL" name="image" value={pkg.image} onChange={e => onChange(path, index, e.target.name, e.target.value)} />
                <AdminInput label="PDF Flyer Link (Optional)" name="pdfLink" value={pkg.pdfLink} onChange={e => onChange(path, index, e.target.name, e.target.value)} />
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">Features (Comma Separated)</label>
                    <input 
                        type="text" 
                        value={pkg.features.join(', ')} 
                        onChange={e => onChange(path, index, 'features', e.target.value.split(',').map(s => s.trim()))} 
                        className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-md py-2 px-3 text-[var(--color-light-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    />
                </div>
            </div>
        </div>
    );
};


const AdminPage: React.FC = () => {
    const { appData, updateAppData, resetAppData } = useContext(DataContext);
    const [localData, setLocalData] = useState<AppData>(JSON.parse(JSON.stringify(appData)));
    const [activePackageTab, setActivePackageTab] = useState<'hajj' | 'umrah'>('hajj');
    const [activeListingTab, setActiveListingTab] = useState<'hajj' | 'umrah'>('umrah');
    const [activeExclusiveTab, setActiveExclusiveTab] = useState<'hajj' | 'umrah'>('hajj');
    const [activeMapCityTab, setActiveMapCityTab] = useState<'Makkah' | 'Madinah'>('Makkah');
    const [legacyCategoryFilter, setLegacyCategoryFilter] = useState('All');
    const [isSaving, setIsSaving] = useState(false);
    
    // --- NEW: Admin View Mode State ---
    const [adminView, setAdminView] = useState<'classic' | 'editor'>('editor');
    const [activeEditorPage, setActiveEditorPage] = useState<string>('exclusiveHajj');

    const coreServiceIds = ['#hotel-booking', '#umrah-training'];
    const companyPageIds = ['#about-us', '#privacy-policy'];

    // Sync local state if appData from context changes
    React.useEffect(() => {
        const mergedData = JSON.parse(JSON.stringify(appData));
        // Apply defaults for robust editing if missing
        if (!mergedData.floatingButton) mergedData.floatingButton = JSON.parse(JSON.stringify(defaultData.floatingButton));
        if (!mergedData.prayerTimes) mergedData.prayerTimes = JSON.parse(JSON.stringify(defaultData.prayerTimes));
        if (!mergedData.footer.partners) mergedData.footer.partners = JSON.parse(JSON.stringify(defaultData.footer.partners));
        if (!mergedData.pages.hajjDetails) mergedData.pages.hajjDetails = JSON.parse(JSON.stringify(defaultData.pages.hajjDetails));
        if (!mergedData.pages.umrahDetails) mergedData.pages.umrahDetails = JSON.parse(JSON.stringify(defaultData.pages.umrahDetails));
        if (!mergedData.pages.home.packageFilter) mergedData.pages.home.packageFilter = JSON.parse(JSON.stringify(defaultData.pages.home.packageFilter));
        if (!mergedData.pages.home.specialOffer) mergedData.pages.home.specialOffer = JSON.parse(JSON.stringify(defaultData.pages.home.specialOffer));
        if (!mergedData.pages.blog) mergedData.pages.blog = JSON.parse(JSON.stringify(defaultData.pages.blog));
        
        if (!mergedData.exclusiveHajj) mergedData.exclusiveHajj = JSON.parse(JSON.stringify(defaultData.exclusiveHajj));
        if (!mergedData.exclusiveUmrah) mergedData.exclusiveUmrah = JSON.parse(JSON.stringify(defaultData.exclusiveUmrah));
        
        if (!mergedData.pages.hajj) mergedData.pages.hajj = JSON.parse(JSON.stringify(defaultData.pages.hajj));
        if (!mergedData.pages.umrah) mergedData.pages.umrah = JSON.parse(JSON.stringify(defaultData.pages.umrah));

        // Ensure Ziyarat Data
        if (!mergedData.pages.ziyarat) mergedData.pages.ziyarat = JSON.parse(JSON.stringify(defaultData.pages.ziyarat));

        if (!mergedData.pages.home.interactiveMap) {
             mergedData.pages.home.interactiveMap = JSON.parse(JSON.stringify(defaultData.pages.home.interactiveMap));
        }

        if (!mergedData.pages.home.sections.islamicTools) {
             mergedData.pages.home.sections.islamicTools = JSON.parse(JSON.stringify(defaultData.pages.home.sections.islamicTools));
        }
        if (!mergedData.pages.home.sections.islamicTools.zakat) mergedData.pages.home.sections.islamicTools.zakat = { enabled: true, googleSheetUrl: '' };
        if (!mergedData.pages.home.sections.islamicTools.tasbeeh) mergedData.pages.home.sections.islamicTools.tasbeeh = { enabled: true };
        if (!mergedData.pages.home.sections.islamicTools.currency) mergedData.pages.home.sections.islamicTools.currency = { enabled: true };

        if (!mergedData.footer.newsletter) {
             mergedData.footer.newsletter = JSON.parse(JSON.stringify(defaultData.footer.newsletter));
        }
        
        // Robust Check for Global Config
        if (!mergedData.globalConfig) {
             // Fallback defaults if DB doesn't have them yet
             mergedData.globalConfig = JSON.parse(JSON.stringify(defaultData.globalConfig));
        }
        if (!mergedData.globalConfig.textLabels) {
            mergedData.globalConfig.textLabels = JSON.parse(JSON.stringify(defaultData.globalConfig?.textLabels));
        }
        if (!mergedData.globalConfig.marketingPopup) {
            mergedData.globalConfig.marketingPopup = JSON.parse(JSON.stringify(defaultData.globalConfig?.marketingPopup));
        }
        if (!mergedData.globalConfig.advanced.typography) {
            mergedData.globalConfig.advanced.typography = JSON.parse(JSON.stringify(defaultData.globalConfig?.advanced.typography));
        }
        // Ensure new fields
        if (!mergedData.globalConfig.seoSchema) {
            mergedData.globalConfig.seoSchema = JSON.parse(JSON.stringify(defaultData.globalConfig?.seoSchema));
        }
        if (!mergedData.globalConfig.analytics) {
            mergedData.globalConfig.analytics = JSON.parse(JSON.stringify(defaultData.globalConfig?.analytics));
        }
        if (!mergedData.globalConfig.language) {
            mergedData.globalConfig.language = JSON.parse(JSON.stringify(defaultData.globalConfig?.language));
        }
        if (!mergedData.applications) {
            mergedData.applications = [];
        }

        setLocalData(mergedData);
    }, [appData]);

    const updateNestedState = (prevState: AppData, path: string, valueOrUpdater: any): AppData => {
        const keys = path.split('.');
        const newState = JSON.parse(JSON.stringify(prevState));
        let currentLevel = newState;

        for (let i = 0; i < keys.length - 1; i++) {
            // Auto-create objects if missing (deep linking safety)
            if (!currentLevel[keys[i]]) currentLevel[keys[i]] = {};
            currentLevel = currentLevel[keys[i]];
        }
        
        const finalKey = keys[keys.length - 1];
        
        if (typeof valueOrUpdater === 'function') {
            currentLevel[finalKey] = valueOrUpdater(currentLevel[finalKey]);
        } else {
            currentLevel[finalKey] = valueOrUpdater;
        }
        
        return newState;
    };
    
    const handleNestedChange = (path: string, value: any) => {
        setLocalData(prevState => updateNestedState(prevState, path, value));
    };

    const handleListChange = (pathToList: string, index: number, field: string, value: any) => {
        const fullPath = `${pathToList}.${index}.${field}`;
        handleNestedChange(fullPath, value);
    };

    const addListItem = (path: string, newItem: any) => {
        setLocalData(prevState => {
            const updater = (currentArray: any[] = []) => [...currentArray, newItem];
            return updateNestedState(prevState, path, updater);
        });
    };

    const deleteListItem = (path: string, indexToDelete: number) => {
        if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;
        setLocalData(prevState => {
            const updater = (currentArray: any[] = []) => currentArray.filter((_, index) => index !== indexToDelete);
            return updateNestedState(prevState, path, updater);
        });
    };

    const moveListItem = (path: string, fromIndex: number, toIndex: number) => {
        setLocalData(prevState => {
            const updater = (currentArray: any[] = []) => {
                const newArray = [...currentArray];
                if (toIndex < 0 || toIndex >= newArray.length) return newArray;
                const [item] = newArray.splice(fromIndex, 1);
                newArray.splice(toIndex, 0, item);
                return newArray;
            };
            return updateNestedState(prevState, path, updater);
        });
    };
    
    const saveChanges = async () => {
        setIsSaving(true);
        await updateAppData(localData);
        setIsSaving(false);
        alert('Changes saved successfully!');
    };
    
    const handleReset = async () => {
        await resetAppData();
    }

    const handlePackageTabChange = (tab: 'hajj' | 'umrah') => {
        setActivePackageTab(tab);
        setLegacyCategoryFilter('All');
    };

    // Get Unique Categories for Legacy Packages
    const legacyCategories = useMemo(() => {
        const packages = activePackageTab === 'hajj' ? localData.hajjPackages : localData.umrahPackages;
        if(!packages) return ['All'];
        const cats = new Set(packages.map(p => p.category ? p.category.trim() : 'Uncategorized'));
        return ['All', ...Array.from(cats).sort()];
    }, [localData, activePackageTab]);

    // Filter Packages and preserve original index for correct updating
    const filteredLegacyPackages = useMemo(() => {
        const packages = activePackageTab === 'hajj' ? localData.hajjPackages : localData.umrahPackages;
        if(!packages) return [];
        
        // We attach original index to ensure we edit the right item in the main array
        const withIndex = packages.map((pkg, idx) => ({ ...pkg, originalIndex: idx }));
        
        if (legacyCategoryFilter === 'All') return withIndex;
        return withIndex.filter(p => (p.category ? p.category.trim() : 'Uncategorized') === legacyCategoryFilter);
    }, [localData, activePackageTab, legacyCategoryFilter]);

    // Helper to count linked packages for a filter
    const getLinkedPackageCount = (category: string, type: 'hajj' | 'umrah') => {
        const packages = type === 'hajj' ? localData.hajjPackages : localData.umrahPackages;
        if (!packages) return 0;
        return packages.filter(p => p.category === category).length;
    }

    const phoneIndex = localData.header.contactInfo?.findIndex(c => c.label === 'Phone');
    const emailIndex = localData.header.contactInfo?.findIndex(c => c.label === 'Email');

    // --- NEW: Easy Editor Render Logic ---
    const renderEasyEditor = () => {
        const luxuryHotelPage = localData.customPages.find(p => p.id === '#hotel-booking');
        const luxuryHotelIndex = localData.customPages.findIndex(p => p.id === '#hotel-booking');
        const trainingPage = localData.customPages.find(p => p.id === '#umrah-training');
        const trainingIndex = localData.customPages.findIndex(p => p.id === '#umrah-training');

        return (
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <div className="lg:w-1/4">
                    <div className="bg-[var(--color-light-bg)] rounded-lg border border-gray-700 overflow-hidden sticky top-24">
                        <div className="p-4 bg-[var(--color-dark-bg)] border-b border-gray-700">
                            <h4 className="font-bold text-white">Select Page to Edit</h4>
                        </div>
                        <div className="flex flex-col">
                            {[
                                { id: 'ziyarat', label: 'Historical Ziyarat Tours' },
                                { id: 'hotel', label: 'Luxury Hotels & Tours' },
                                { id: 'training', label: 'Pilgrim Training' },
                                { id: 'exclusiveHajj', label: 'Exclusive Hajj Packages' },
                                { id: 'hajjPreReg', label: 'Hajj Pre-Registration Card' }, // NEW
                                { id: 'aboutHajj', label: 'About Hajj' },
                                { id: 'legacyHajj', label: 'All Packages (Old Hajj)' },
                                { id: 'exclusiveUmrah', label: 'Exclusive Umrah Packages' },
                                { id: 'aboutUmrah', label: 'About Umrah' },
                                { id: 'legacyUmrah', label: 'All Packages (Old Umrah)' },
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveEditorPage(item.id)}
                                    className={`px-4 py-3 text-left text-sm font-medium border-b border-gray-800 transition-colors ${activeEditorPage === item.id ? 'bg-[var(--color-primary)] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Editor Area */}
                <div className="lg:w-3/4">
                    <div className="bg-[var(--color-light-bg)] rounded-lg border border-gray-700 p-6">
                        {/* Ziyarat Editor */}
                        {activeEditorPage === 'ziyarat' && (
                            <div>
                                <h3 className="text-2xl font-display text-[var(--color-primary)] mb-6">Historical Ziyarat Tours</h3>
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Makkah Sites</h4>
                                        {localData.pages.ziyarat.makkah.map((site, idx) => (
                                            <div key={idx} className="mb-6 p-4 bg-[var(--color-dark-bg)] rounded border border-gray-600">
                                                <AdminInput label="Title" name="title" value={site.title} onChange={e => handleListChange('pages.ziyarat.makkah', idx, 'title', e.target.value)} />
                                                <AdminInput label="Subtitle" name="subtitle" value={site.subtitle} onChange={e => handleListChange('pages.ziyarat.makkah', idx, 'subtitle', e.target.value)} className="mt-2"/>
                                                <AdminTextarea label="Description" name="desc" value={site.desc} onChange={e => handleListChange('pages.ziyarat.makkah', idx, 'desc', e.target.value)} className="mt-2"/>
                                                <AdminInput label="Significance Tag" name="significance" value={site.significance} onChange={e => handleListChange('pages.ziyarat.makkah', idx, 'significance', e.target.value)} className="mt-2"/>
                                                <AdminInput label="Image URL" name="img" value={site.img} onChange={e => handleListChange('pages.ziyarat.makkah', idx, 'img', e.target.value)} className="mt-2"/>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Madinah Sites</h4>
                                        {localData.pages.ziyarat.madinah.map((site, idx) => (
                                            <div key={idx} className="mb-6 p-4 bg-[var(--color-dark-bg)] rounded border border-gray-600">
                                                <AdminInput label="Title" name="title" value={site.title} onChange={e => handleListChange('pages.ziyarat.madinah', idx, 'title', e.target.value)} />
                                                <AdminInput label="Subtitle" name="subtitle" value={site.subtitle} onChange={e => handleListChange('pages.ziyarat.madinah', idx, 'subtitle', e.target.value)} className="mt-2"/>
                                                <AdminTextarea label="Description" name="desc" value={site.desc} onChange={e => handleListChange('pages.ziyarat.madinah', idx, 'desc', e.target.value)} className="mt-2"/>
                                                <AdminInput label="Significance Tag" name="significance" value={site.significance} onChange={e => handleListChange('pages.ziyarat.madinah', idx, 'significance', e.target.value)} className="mt-2"/>
                                                <AdminInput label="Image URL" name="img" value={site.img} onChange={e => handleListChange('pages.ziyarat.madinah', idx, 'img', e.target.value)} className="mt-2"/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Luxury Hotels Editor */}
                        {activeEditorPage === 'hotel' && luxuryHotelPage && (
                            <div>
                                <h3 className="text-2xl font-display text-[var(--color-primary)] mb-6">Luxury Hotels & Tours</h3>
                                <CustomPageEditor
                                    customPage={luxuryHotelPage}
                                    index={luxuryHotelIndex}
                                    handleListChange={handleListChange}
                                    handleNestedChange={handleNestedChange}
                                    addListItem={addListItem}
                                    deleteListItem={deleteListItem}
                                    moveListItem={moveListItem}
                                    localData={localData}
                                    isCoreService={true}
                                />
                            </div>
                        )}

                        {/* Pilgrim Training Editor */}
                        {activeEditorPage === 'training' && trainingPage && (
                            <div>
                                <h3 className="text-2xl font-display text-[var(--color-primary)] mb-6">Pilgrim Training</h3>
                                <CustomPageEditor
                                    customPage={trainingPage}
                                    index={trainingIndex}
                                    handleListChange={handleListChange}
                                    handleNestedChange={handleNestedChange}
                                    addListItem={addListItem}
                                    deleteListItem={deleteListItem}
                                    moveListItem={moveListItem}
                                    localData={localData}
                                    isCoreService={true}
                                />
                            </div>
                        )}

                        {/* Exclusive Hajj Editor */}
                        {activeEditorPage === 'exclusiveHajj' && (
                            <div>
                                <h3 className="text-2xl font-display text-[var(--color-primary)] mb-6">Exclusive Hajj Packages</h3>
                                <div className="mb-8 p-4 bg-[var(--color-dark-bg)] rounded border border-gray-600">
                                    <h4 className="font-bold text-white mb-4">Page Intro Settings</h4>
                                    <AdminInput label="Intro Title" name="exclusiveHajj.pageData.introTitle" value={localData.exclusiveHajj.pageData.introTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                    <AdminTextarea label="Intro Text" name="exclusiveHajj.pageData.introText" value={localData.exclusiveHajj.pageData.introText} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                                </div>
                                {localData.exclusiveHajj.packages.map((pkg, index) => (
                                    <ExclusivePackageEditor 
                                        key={pkg.id + index} pkg={pkg} index={index} path="exclusiveHajj.packages" onChange={handleListChange} onDelete={deleteListItem}
                                    />
                                ))}
                                <button onClick={() => addListItem('exclusiveHajj.packages', { id: `hajj-ex-${Date.now()}`, title: 'New Package', category: 'General', price: 'BDT 0', duration: '0 Days', makkahHotel: 'TBA', madinahHotel: 'TBA', features: [], image: '', enabled: true })} className="bg-green-600 text-white font-bold py-2 px-4 rounded">Add New Package</button>
                            </div>
                        )}

                        {/* Hajj Pre-Registration Editor */}
                        {activeEditorPage === 'hajjPreReg' && (
                            <div>
                                <h3 className="text-2xl font-display text-[var(--color-primary)] mb-6">Hajj Pre-Registration Card</h3>
                                <div className="p-6 bg-[var(--color-dark-bg)] rounded border border-gray-600">
                                    <p className="text-[var(--color-muted-text)] mb-6">
                                        This is the special card that appears alongside the Hajj packages list.
                                    </p>
                                    <div className="grid grid-cols-1 gap-6">
                                        <AdminInput 
                                            label="Card Title" 
                                            name="pages.packages.hajjPreRegistration.title" 
                                            value={localData.pages.packages.hajjPreRegistration.title} 
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        />
                                        <AdminTextarea 
                                            label="Description" 
                                            name="pages.packages.hajjPreRegistration.description" 
                                            value={localData.pages.packages.hajjPreRegistration.description} 
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                            rows={3}
                                        />
                                        <AdminTextarea 
                                            label="Sub Description (Bottom text)" 
                                            name="pages.packages.hajjPreRegistration.subDescription" 
                                            value={localData.pages.packages.hajjPreRegistration.subDescription} 
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                            rows={3}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <AdminInput 
                                                label="Button Text" 
                                                name="pages.packages.hajjPreRegistration.buttonText" 
                                                value={localData.pages.packages.hajjPreRegistration.buttonText} 
                                                onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                            />
                                            <AdminInput 
                                                label="Inquiry Subject (Email Subject)" 
                                                name="pages.packages.hajjPreRegistration.inquirySubject" 
                                                value={localData.pages.packages.hajjPreRegistration.inquirySubject} 
                                                onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                            />
                                        </div>
                                        <AdminInput 
                                            label="Image URL" 
                                            name="pages.packages.hajjPreRegistration.image" 
                                            value={localData.pages.packages.hajjPreRegistration.image} 
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        />
                                        {localData.pages.packages.hajjPreRegistration.image && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-400 mb-1">Preview:</p>
                                                <img src={localData.pages.packages.hajjPreRegistration.image} alt="Preview" className="h-32 object-contain bg-white p-2 rounded" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* About Hajj Editor */}
                        {activeEditorPage === 'aboutHajj' && (
                            <div>
                                <h3 className="text-2xl font-display text-[var(--color-primary)] mb-6">About Hajj (Details Page)</h3>
                                <AdminInput label="Page Title" name="pages.hajjDetails.pageBanner.title" value={localData.pages.hajjDetails.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                {localData.pages.hajjDetails.sections.map((section, index) => (
                                    <div key={index} className="mt-4 p-4 border border-gray-600 rounded-md bg-[var(--color-dark-bg)]">
                                        <AdminInput label="Section Title" name={`pages.hajjDetails.sections.${index}.title`} value={section.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                        <AdminTextarea label="Content" name={`pages.hajjDetails.sections.${index}.description`} value={section.description} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" rows={6} />
                                        <AdminInput label="Image URL" name={`pages.hajjDetails.sections.${index}.image`} value={section.image} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Legacy Hajj Editor */}
                        {activeEditorPage === 'legacyHajj' && (
                            <div>
                                <h3 className="text-2xl font-display text-[var(--color-primary)] mb-6">All Packages (Old Hajj Layout)</h3>
                                {localData.hajjPackages.map((pkg, index) => (
                                    <PackageEditor key={index} pkg={pkg} index={index} packageType="hajj" onChange={handleListChange} onDelete={deleteListItem} />
                                ))}
                                <button onClick={() => addListItem('hajjPackages', { name: 'New Hajj Package', price: '', enabled: true, category: 'Regular Hajj' })} className="bg-green-600 text-white font-bold py-2 px-4 rounded mt-4">Add Hajj Package</button>
                            </div>
                        )}

                        {/* Exclusive Umrah Editor */}
                        {activeEditorPage === 'exclusiveUmrah' && (
                            <div>
                                <h3 className="text-2xl font-display text-[var(--color-primary)] mb-6">Exclusive Umrah Packages</h3>
                                <div className="mb-8 p-4 bg-[var(--color-dark-bg)] rounded border border-gray-600">
                                    <h4 className="font-bold text-white mb-4">Page Intro Settings</h4>
                                    <AdminInput label="Intro Title" name="exclusiveUmrah.pageData.introTitle" value={localData.exclusiveUmrah.pageData.introTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                    <AdminTextarea label="Intro Text" name="exclusiveUmrah.pageData.introText" value={localData.exclusiveUmrah.pageData.introText} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                                </div>
                                {localData.exclusiveUmrah.packages.map((pkg, index) => (
                                    <ExclusivePackageEditor 
                                        key={pkg.id + index} pkg={pkg} index={index} path="exclusiveUmrah.packages" onChange={handleListChange} onDelete={deleteListItem}
                                    />
                                ))}
                                <button onClick={() => addListItem('exclusiveUmrah.packages', { id: `umrah-ex-${Date.now()}`, title: 'New Package', category: 'General', price: 'BDT 0', duration: '0 Days', makkahHotel: 'TBA', madinahHotel: 'TBA', features: [], image: '', enabled: true })} className="bg-green-600 text-white font-bold py-2 px-4 rounded">Add New Package</button>
                            </div>
                        )}

                        {/* About Umrah Editor */}
                        {activeEditorPage === 'aboutUmrah' && (
                            <div>
                                <h3 className="text-2xl font-display text-[var(--color-primary)] mb-6">About Umrah (Details Page)</h3>
                                <AdminInput label="Page Title" name="pages.umrahDetails.pageBanner.title" value={localData.pages.umrahDetails.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                {localData.pages.umrahDetails.sections.map((section, index) => (
                                    <div key={index} className="mt-4 p-4 border border-gray-600 rounded-md bg-[var(--color-dark-bg)]">
                                        <AdminInput label="Section Title" name={`pages.umrahDetails.sections.${index}.title`} value={section.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                        <AdminTextarea label="Content" name={`pages.umrahDetails.sections.${index}.description`} value={section.description} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" rows={6} />
                                        <AdminInput label="Image URL" name={`pages.umrahDetails.sections.${index}.image`} value={section.image} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Legacy Umrah Editor */}
                        {activeEditorPage === 'legacyUmrah' && (
                            <div>
                                <h3 className="text-2xl font-display text-[var(--color-primary)] mb-6">All Packages (Old Umrah Layout)</h3>
                                {localData.umrahPackages.map((pkg, index) => (
                                    <PackageEditor key={index} pkg={pkg} index={index} packageType="umrah" onChange={handleListChange} onDelete={deleteListItem} />
                                ))}
                                <button onClick={() => addListItem('umrahPackages', { name: 'New Umrah Package', price: '', enabled: true, category: 'Economy' })} className="bg-green-600 text-white font-bold py-2 px-4 rounded mt-4">Add Umrah Package</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="pt-20">
            <PageBanner
                title="Admin Panel"
                subtitle="Manage your website content here. Click 'Save All Changes' at the bottom to apply your updates."
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* --- View Mode Switcher --- */}
                <div className="flex justify-center mb-12">
                    <div className="bg-[var(--color-light-bg)] p-1 rounded-full border border-gray-600 inline-flex">
                        <button
                            onClick={() => setAdminView('classic')}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${adminView === 'classic' ? 'bg-[var(--color-secondary)] text-[var(--color-dark-bg)] shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Classic Admin Panel
                        </button>
                        <button
                            onClick={() => setAdminView('editor')}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${adminView === 'editor' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <span>✨ Easy Page Editor</span>
                        </button>
                    </div>
                </div>

                {/* --- RENDER EASY EDITOR --- */}
                {adminView === 'editor' && renderEasyEditor()}

                {/* --- RENDER CLASSIC ADMIN PANEL --- */}
                {adminView === 'classic' && (
                    <>
                        {/* --- NEW GENERAL SETTINGS SECTION --- */}
                        <Section title="General & Advanced Settings (Control Everything)">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Site Identity */}
                                <div className="p-4 border border-gray-700 rounded-lg bg-[var(--color-dark-bg)]">
                                    <h4 className="font-bold text-lg text-[var(--color-primary)] mb-3">Site Identity & Global SEO</h4>
                                    <AdminInput 
                                        label="Website Name (Appears in Header & Browser Tab)" 
                                        name="globalConfig.siteIdentity.siteName" 
                                        value={localData.globalConfig?.siteIdentity?.siteName} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                    <p className="text-xs text-[var(--color-muted-text)] mb-2 mt-1">
                                        Note: The first word of the name will appear in white, and the rest in gold in the website header.
                                    </p>
                                    <AdminInput 
                                        label="Favicon URL (Browser Tab Icon)" 
                                        name="globalConfig.siteIdentity.faviconUrl" 
                                        value={localData.globalConfig?.siteIdentity?.faviconUrl} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        className="mt-3"
                                        placeholder="https://..."
                                    />
                                    <div className="mt-2 mb-2 flex justify-center p-2 bg-black/20 rounded">
                                        {localData.globalConfig?.siteIdentity?.faviconUrl ? (
                                            <img src={localData.globalConfig.siteIdentity.faviconUrl} alt="Favicon Preview" className="w-8 h-8" />
                                        ) : (
                                            <span className="text-xs text-gray-500">No Favicon Set</span>
                                        )}
                                    </div>
                                    <AdminTextarea 
                                        label="Website Description (SEO Meta Description)" 
                                        name="globalConfig.siteIdentity.metaDescription" 
                                        value={localData.globalConfig?.siteIdentity?.metaDescription} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        className="mt-3"
                                    />
                                    <p className="text-xs text-[var(--color-muted-text)] mt-1">This description is used if a specific page doesn't have its own SEO description.</p>
                                </div>

                                {/* Top Announcement Bar */}
                                <div className="p-4 border border-gray-700 rounded-lg bg-[var(--color-dark-bg)]">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-bold text-lg text-[var(--color-secondary)]">Top Announcement Bar</h4>
                                        <ToggleSwitch 
                                            label="Enabled" 
                                            enabled={localData.globalConfig?.announcementBar?.enabled ?? false} 
                                            onChange={(val) => handleNestedChange('globalConfig.announcementBar.enabled', val)} 
                                        />
                                    </div>
                                    <AdminTextarea 
                                        label="Announcement Text" 
                                        name="globalConfig.announcementBar.text" 
                                        value={localData.globalConfig?.announcementBar?.text} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        rows={2}
                                    />
                                    <AdminInput 
                                        label="Link URL (Optional)" 
                                        name="globalConfig.announcementBar.link" 
                                        value={localData.globalConfig?.announcementBar?.link} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        className="mt-3"
                                    />
                                    <div className="grid grid-cols-2 gap-4 mt-3">
                                        <AdminInput label="Background Color" name="globalConfig.announcementBar.backgroundColor" value={localData.globalConfig?.announcementBar?.backgroundColor} onChange={e => handleNestedChange(e.target.name, e.target.value)} type="color" />
                                        <AdminInput label="Text Color" name="globalConfig.announcementBar.textColor" value={localData.globalConfig?.announcementBar?.textColor} onChange={e => handleNestedChange(e.target.name, e.target.value)} type="color" />
                                    </div>
                                </div>

                                {/* Custom Scripts & CSS */}
                                <div className="col-span-1 md:col-span-2 p-4 border border-gray-700 rounded-lg bg-[var(--color-dark-bg)]">
                                    <h4 className="font-bold text-lg text-red-400 mb-1">Custom Scripts (Header/Footer)</h4>
                                    <p className="text-sm text-[var(--color-muted-text)] mb-4">Add code for Google Analytics, Facebook Pixel, Chatbots, or custom styling.</p>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-white mb-1">Custom CSS (Styles)</label>
                                        <textarea 
                                            className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-3 text-green-400 font-mono text-sm h-32 focus:ring-1 focus:ring-green-500 outline-none"
                                            value={localData.globalConfig?.advanced?.customCss || ''}
                                            onChange={e => handleNestedChange('globalConfig.advanced.customCss', e.target.value)}
                                            placeholder=".my-class { color: red; } /* Override any style here */"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-1">Header Scripts (Inside &lt;head&gt;)</label>
                                            <p className="text-xs text-gray-500 mb-2">For: Google Analytics, FB Pixel, Search Console verification.</p>
                                            <textarea 
                                                className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-3 text-yellow-400 font-mono text-sm h-48 focus:ring-1 focus:ring-yellow-500 outline-none"
                                                value={localData.globalConfig?.advanced?.headScripts || ''}
                                                onChange={e => handleNestedChange('globalConfig.advanced.headScripts', e.target.value)}
                                                placeholder="<script>...</script>"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-1">Footer Scripts (Before &lt;/body&gt;)</label>
                                            <p className="text-xs text-gray-500 mb-2">For: Chatbots (Tawk.to, WhatsApp Widget), Tracking codes.</p>
                                            <textarea 
                                                className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-3 text-yellow-400 font-mono text-sm h-48 focus:ring-1 focus:ring-yellow-500 outline-none"
                                                value={localData.globalConfig?.advanced?.footerScripts || ''}
                                                onChange={e => handleNestedChange('globalConfig.advanced.footerScripts', e.target.value)}
                                                placeholder="<script>...</script>"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* --- NEW: SEO, Analytics & Language Settings --- */}
                        <Section title="SEO, Analytics & Language Settings">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* SEO Schema Config */}
                                <div className="p-4 border border-gray-700 rounded-lg bg-[var(--color-dark-bg)]">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-bold text-lg text-[var(--color-primary)]">SEO Schema Markup</h4>
                                        <ToggleSwitch 
                                            label="Enabled" 
                                            enabled={localData.globalConfig?.seoSchema?.enabled ?? true} 
                                            onChange={(val) => handleNestedChange('globalConfig.seoSchema.enabled', val)} 
                                        />
                                    </div>
                                    <p className="text-sm text-[var(--color-muted-text)] mb-4">Configure the JSON-LD structured data to help search engines understand your organization.</p>
                                    <div className="space-y-4">
                                        <AdminInput 
                                            label="Organization Type" 
                                            name="globalConfig.seoSchema.organizationType" 
                                            value={localData.globalConfig?.seoSchema?.organizationType || 'TravelAgency'} 
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                            placeholder="TravelAgency, Organization, LocalBusiness"
                                        />
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">Social Profiles (Comma Separated URLs)</label>
                                            <input 
                                                type="text" 
                                                value={localData.globalConfig?.seoSchema?.sameAs?.join(', ') || ''} 
                                                onChange={e => handleNestedChange('globalConfig.seoSchema.sameAs', e.target.value.split(',').map(s => s.trim()))} 
                                                className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-md py-2 px-3 text-[var(--color-light-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                                placeholder="https://facebook.com/..., https://twitter.com/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Analytics Config */}
                                <div className="p-4 border border-gray-700 rounded-lg bg-[var(--color-dark-bg)]">
                                    <h4 className="font-bold text-lg text-[var(--color-primary)] mb-3">Analytics & Tracking</h4>
                                    <p className="text-sm text-[var(--color-muted-text)] mb-4">Enter your tracking IDs to automatically inject measurement scripts.</p>
                                    <div className="space-y-4">
                                        <AdminInput 
                                            label="Google Analytics Measurement ID" 
                                            name="globalConfig.analytics.googleAnalyticsId" 
                                            value={localData.globalConfig?.analytics?.googleAnalyticsId || ''} 
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                            placeholder="G-XXXXXXXXXX"
                                        />
                                        <AdminInput 
                                            label="Facebook Pixel ID" 
                                            name="globalConfig.analytics.facebookPixelId" 
                                            value={localData.globalConfig?.analytics?.facebookPixelId || ''} 
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                            placeholder="123456789012345"
                                        />
                                    </div>
                                </div>

                                {/* Language Config */}
                                <div className="p-4 border border-gray-700 rounded-lg bg-[var(--color-dark-bg)]">
                                    <h4 className="font-bold text-lg text-[var(--color-secondary)] mb-3">Multi-Language Support</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-black/20 rounded">
                                            <span>Show Language Switcher in Header</span>
                                            <ToggleSwitch 
                                                label="" 
                                                enabled={localData.globalConfig?.language?.enableSwitcher ?? true} 
                                                onChange={(val) => handleNestedChange('globalConfig.language.enableSwitcher', val)} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">Default Language</label>
                                            <select 
                                                value={localData.globalConfig?.language?.defaultLanguage || 'en'}
                                                onChange={e => handleNestedChange('globalConfig.language.defaultLanguage', e.target.value)}
                                                className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-md py-2 px-3 text-[var(--color-light-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                            >
                                                <option value="en">English</option>
                                                <option value="bn">Bangla</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Section>

                        {/* --- NEW: Marketing Popup --- */}
                        <Section title="Marketing & Promotional Popup">
                            <div className="p-4 border border-gray-700 rounded-lg bg-[var(--color-dark-bg)]">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-lg text-[var(--color-primary)]">Entry Popup Modal</h4>
                                    <ToggleSwitch
                                        label="Enable Popup"
                                        enabled={localData.globalConfig?.marketingPopup?.enabled ?? false}
                                        onChange={(val) => handleNestedChange('globalConfig.marketingPopup.enabled', val)}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AdminInput 
                                        label="Popup Title" 
                                        name="globalConfig.marketingPopup.title" 
                                        value={localData.globalConfig?.marketingPopup?.title} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                    <AdminInput 
                                        label="Image URL (Optional)" 
                                        name="globalConfig.marketingPopup.image" 
                                        value={localData.globalConfig?.marketingPopup?.image} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                    <AdminTextarea 
                                        label="Content/Message" 
                                        name="globalConfig.marketingPopup.content" 
                                        value={localData.globalConfig?.marketingPopup?.content} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        className="md:col-span-2"
                                    />
                                    <AdminInput 
                                        label="Button Text" 
                                        name="globalConfig.marketingPopup.buttonText" 
                                        value={localData.globalConfig?.marketingPopup?.buttonText} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                    <AdminInput 
                                        label="Button Link" 
                                        name="globalConfig.marketingPopup.buttonLink" 
                                        value={localData.globalConfig?.marketingPopup?.buttonLink} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                    <div className="flex items-center space-x-4">
                                        <AdminInput 
                                            label="Delay (Seconds)" 
                                            name="globalConfig.marketingPopup.delaySeconds" 
                                            type="number"
                                            value={localData.globalConfig?.marketingPopup?.delaySeconds} 
                                            onChange={e => handleNestedChange(e.target.name, parseFloat(e.target.value))} 
                                        />
                                        <div className="pt-6">
                                            <ToggleSwitch
                                                label="Show Once Per Visit?"
                                                enabled={localData.globalConfig?.marketingPopup?.showOncePerSession ?? true}
                                                onChange={(val) => handleNestedChange('globalConfig.marketingPopup.showOncePerSession', val)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* --- NEW: Advanced Visual Control --- */}
                        <Section title="Advanced Visual Control (Typography & Layout)">
                            <div className="p-4 border border-gray-700 rounded-lg bg-[var(--color-dark-bg)]">
                                <p className="text-[var(--color-muted-text)] mb-4 text-sm">
                                    Fine-tune the font sizes and spacing for the entire website. 
                                    (Use valid CSS units like 'rem', 'px', or 'em')
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AdminInput 
                                        label="Heading 1 (Page Titles) Size" 
                                        name="globalConfig.advanced.typography.h1Size" 
                                        value={localData.globalConfig?.advanced?.typography?.h1Size || '3.5rem'} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        placeholder="e.g., 3.5rem"
                                    />
                                    <AdminInput 
                                        label="Heading 2 (Section Titles) Size" 
                                        name="globalConfig.advanced.typography.h2Size" 
                                        value={localData.globalConfig?.advanced?.typography?.h2Size || '2.5rem'} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        placeholder="e.g., 2.5rem"
                                    />
                                    <AdminInput 
                                        label="Body Text Size" 
                                        name="globalConfig.advanced.typography.bodySize" 
                                        value={localData.globalConfig?.advanced?.typography?.bodySize || '1rem'} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        placeholder="e.g., 1rem"
                                    />
                                    <AdminInput 
                                        label="Section Spacing (Padding)" 
                                        name="globalConfig.advanced.typography.sectionPadding" 
                                        value={localData.globalConfig?.advanced?.typography?.sectionPadding || '5rem'} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        placeholder="e.g., 5rem"
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* --- NEW: Text Label Manager --- */}
                        <Section title="Text & Label Manager">
                            <div className="p-4 border border-gray-700 rounded-lg bg-[var(--color-dark-bg)]">
                                <p className="text-[var(--color-muted-text)] mb-4 text-sm">
                                    Edit the static text labels used on buttons and common areas across the site.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {localData.globalConfig?.textLabels && Object.keys(localData.globalConfig.textLabels).map((key) => (
                                        <AdminInput
                                            key={key}
                                            label={key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())} // Convert camelCase to readable
                                            name={`globalConfig.textLabels.${key}`}
                                            value={(localData.globalConfig!.textLabels as any)[key]}
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Section>

                        <Section title="Interactive Map Management">
                            <PageIdDisplay id="#ziyarat-tours" label="Page ID (For Ziyarat Page)" />
                            <div className="p-4 border border-gray-700 rounded-lg">
                                <div className="mb-4">
                                    <ToggleSwitch 
                                        label="Enable Interactive Map Section" 
                                        enabled={localData.pages.home.interactiveMap?.enabled ?? true} 
                                        onChange={(val) => handleNestedChange('pages.home.interactiveMap.enabled', val)} 
                                    />
                                </div>
                                <p className="text-[var(--color-muted-text)] mb-6">Manage the locations and content of the interactive map on the homepage.</p>
                                
                                <div className="flex space-x-4 mb-6">
                                    <button
                                        className={`px-4 py-2 rounded-md font-bold ${activeMapCityTab === 'Makkah' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-700 text-gray-300'}`}
                                        onClick={() => setActiveMapCityTab('Makkah')}
                                    >
                                        Makkah Map
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded-md font-bold ${activeMapCityTab === 'Madinah' ? 'bg-[var(--color-secondary)] text-[var(--color-dark-bg)]' : 'bg-gray-700 text-gray-300'}`}
                                        onClick={() => setActiveMapCityTab('Madinah')}
                                    >
                                        Madinah Map
                                    </button>
                                </div>

                                <div className="bg-[var(--color-dark-bg)] p-4 rounded-md border border-gray-600">
                                    <h4 className="font-bold text-xl text-white mb-4">{activeMapCityTab} Settings</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <AdminInput 
                                            label="City Display Name" 
                                            name={`pages.home.interactiveMap.cities.${activeMapCityTab}.name`} 
                                            value={localData.pages.home.interactiveMap.cities[activeMapCityTab]?.name} 
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        />
                                        <AdminInput 
                                            label="Map Background Image URL" 
                                            name={`pages.home.interactiveMap.cities.${activeMapCityTab}.mapImage`} 
                                            value={localData.pages.home.interactiveMap.cities[activeMapCityTab]?.mapImage} 
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        />
                                    </div>

                                    <h5 className="font-semibold text-lg text-white mb-4">Hotspots / Locations</h5>
                                    {localData.pages.home.interactiveMap.cities[activeMapCityTab]?.locations.map((loc, index) => (
                                        <div key={loc.id} className="mb-4 p-4 border border-gray-500 rounded bg-[var(--color-light-bg)]">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-bold text-[var(--color-primary)]">Location {index + 1}</span>
                                                <button 
                                                    onClick={() => deleteListItem(`pages.home.interactiveMap.cities.${activeMapCityTab}.locations`, index)} 
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <AdminInput 
                                                    label="Title" 
                                                    name="title"
                                                    value={loc.title} 
                                                    onChange={e => handleListChange(`pages.home.interactiveMap.cities.${activeMapCityTab}.locations`, index, 'title', e.target.value)} 
                                                />
                                                <AdminInput 
                                                    label="Image URL" 
                                                    name="image"
                                                    value={loc.image} 
                                                    onChange={e => handleListChange(`pages.home.interactiveMap.cities.${activeMapCityTab}.locations`, index, 'image', e.target.value)} 
                                                />
                                                <AdminInput 
                                                    label="Top Position (%)" 
                                                    name="top"
                                                    value={loc.top} 
                                                    onChange={e => handleListChange(`pages.home.interactiveMap.cities.${activeMapCityTab}.locations`, index, 'top', e.target.value)} 
                                                    placeholder="e.g. 50%"
                                                />
                                                <AdminInput 
                                                    label="Left Position (%)" 
                                                    name="left"
                                                    value={loc.left} 
                                                    onChange={e => handleListChange(`pages.home.interactiveMap.cities.${activeMapCityTab}.locations`, index, 'left', e.target.value)} 
                                                    placeholder="e.g. 50%"
                                                />
                                            </div>
                                            <AdminTextarea 
                                                label="Description" 
                                                name="description"
                                                value={loc.description} 
                                                onChange={e => handleListChange(`pages.home.interactiveMap.cities.${activeMapCityTab}.locations`, index, 'description', e.target.value)} 
                                                rows={3}
                                            />
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => addListItem(`pages.home.interactiveMap.cities.${activeMapCityTab}.locations`, { id: Date.now(), title: 'New Location', description: '', image: '', top: '50%', left: '50%' })} 
                                        className="bg-green-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Add New Location
                                    </button>
                                </div>
                            </div>
                        </Section>

                        {/* --- NEW SPECIAL OFFER SECTION --- */}
                        <Section title="Special Offer Timer">
                            <div className="p-4 border border-gray-700 rounded-lg">
                                <p className="text-[var(--color-muted-text)] mb-4">Set a countdown timer for special promotions like Ramadan or Hajj offers.</p>
                                <div className="mb-4">
                                    <ToggleSwitch 
                                        label="Enable Countdown Timer" 
                                        enabled={localData.pages.home.specialOffer?.enabled ?? true} 
                                        onChange={(val) => handleNestedChange('pages.home.specialOffer.enabled', val)} 
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AdminInput 
                                        label="Offer Title" 
                                        name="pages.home.specialOffer.title" 
                                        value={localData.pages.home.specialOffer?.title} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                    <AdminInput 
                                        label="Offer End Date & Time" 
                                        name="pages.home.specialOffer.endDate" 
                                        type="datetime-local"
                                        value={localData.pages.home.specialOffer?.endDate} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                    <AdminTextarea 
                                        label="Subtitle" 
                                        name="pages.home.specialOffer.subtitle" 
                                        value={localData.pages.home.specialOffer?.subtitle} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        className="md:col-span-2"
                                    />
                                    <AdminInput 
                                        label="Background Image URL" 
                                        name="pages.home.specialOffer.backgroundImage" 
                                        value={localData.pages.home.specialOffer?.backgroundImage} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <AdminInput 
                                            label="Button Text" 
                                            name="pages.home.specialOffer.buttonText" 
                                            value={localData.pages.home.specialOffer?.buttonText} 
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        />
                                        <AdminInput 
                                            label="Button Link" 
                                            name="pages.home.specialOffer.buttonLink" 
                                            value={localData.pages.home.specialOffer?.buttonLink} 
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* --- ISLAMIC TOOLS SECTION --- */}
                        <Section title="Islamic Utility Tools">
                            <div className="p-4 border border-gray-700 rounded-lg">
                                <div className="mb-4">
                                    <ToggleSwitch
                                        label="Enable Main Button"
                                        enabled={localData.pages.home.sections.islamicTools?.enabled ?? true}
                                        onChange={(val) => handleNestedChange('pages.home.sections.islamicTools.enabled', val)}
                                    />
                                </div>
                                <p className="text-[var(--color-muted-text)] mb-4 text-sm">Customize the specific tools available within the Islamic Tools modal.</p>
                                
                                <div className="space-y-4 p-4 bg-[var(--color-dark-bg)] rounded-md border border-gray-600">
                                    <div className="flex flex-col space-y-2">
                                        <ToggleSwitch
                                            label="Enable Zakat Calculator"
                                            enabled={localData.pages.home.sections.islamicTools?.zakat?.enabled ?? true}
                                            onChange={(val) => handleNestedChange('pages.home.sections.islamicTools.zakat.enabled', val)}
                                        />
                                        <div className="ml-4 pl-4 border-l-2 border-gray-600">
                                            <AdminInput
                                                label="Google Apps Script URL (for saving Zakat data)"
                                                name="pages.home.sections.islamicTools.zakat.googleSheetUrl"
                                                value={localData.pages.home.sections.islamicTools?.zakat?.googleSheetUrl}
                                                onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                                placeholder="https://script.google.com/macros/s/..."
                                            />
                                            <p className="text-xs text-[var(--color-muted-text)] mt-1">Deploy your Google Sheet script as a Web App and paste the URL here to allow users to save calculations.</p>
                                        </div>
                                    </div>

                                    <ToggleSwitch
                                        label="Enable Digital Tasbeeh"
                                        enabled={localData.pages.home.sections.islamicTools?.tasbeeh?.enabled ?? true}
                                        onChange={(val) => handleNestedChange('pages.home.sections.islamicTools.tasbeeh.enabled', val)}
                                    />

                                    <ToggleSwitch
                                        label="Enable Currency Converter"
                                        enabled={localData.pages.home.sections.islamicTools?.currency?.enabled ?? true}
                                        onChange={(val) => handleNestedChange('pages.home.sections.islamicTools.currency.enabled', val)}
                                    />
                                </div>
                            </div>
                        </Section>

                        <Section title="Exclusive Packages Management">
                            <p className="text-[var(--color-muted-text)] mb-6">Manage the new, categorized Hajj and Umrah packages that appear on the dedicated pages.</p>
                            <div className="flex space-x-4 mb-6">
                                <button
                                    className={`px-4 py-2 rounded-md font-bold ${activeExclusiveTab === 'hajj' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-700 text-gray-300'}`}
                                    onClick={() => setActiveExclusiveTab('hajj')}
                                >
                                    Exclusive Hajj
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-md font-bold ${activeExclusiveTab === 'umrah' ? 'bg-[var(--color-secondary)] text-[var(--color-dark-bg)]' : 'bg-gray-700 text-gray-300'}`}
                                    onClick={() => setActiveExclusiveTab('umrah')}
                                >
                                    Exclusive Umrah
                                </button>
                            </div>

                            {activeExclusiveTab === 'hajj' && (
                                <div>
                                    <PageIdDisplay id="#exclusive-hajj" label="Page ID (New Hajj Page)" />
                                    <h4 className="font-bold text-xl mb-4 text-[var(--color-primary)]">Page Settings</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 border border-gray-700 rounded-lg">
                                        <AdminInput label="Page Title" name="exclusiveHajj.pageData.pageBanner.title" value={localData.exclusiveHajj.pageData.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                        <AdminInput label="Banner Image" name="exclusiveHajj.pageData.pageBanner.backgroundImage" value={localData.exclusiveHajj.pageData.pageBanner.backgroundImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                        <AdminInput label="Intro Section Title" name="exclusiveHajj.pageData.introTitle" value={localData.exclusiveHajj.pageData.introTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                        <AdminTextarea label="Intro Text" name="exclusiveHajj.pageData.introText" value={localData.exclusiveHajj.pageData.introText} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                        <div className="md:col-span-2">
                                            <SeoEditor pageName="Exclusive Hajj SEO" seoPath="exclusiveHajj.pageData.seo" localData={localData} onChange={handleNestedChange} />
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-xl mb-4 text-[var(--color-primary)]">Packages List</h4>
                                    {localData.exclusiveHajj.packages.map((pkg, index) => (
                                        <ExclusivePackageEditor 
                                            key={pkg.id + index}
                                            pkg={pkg} 
                                            index={index} 
                                            path="exclusiveHajj.packages"
                                            onChange={handleListChange} 
                                            onDelete={deleteListItem}
                                        />
                                    ))}
                                    <button 
                                        onClick={() => addListItem('exclusiveHajj.packages', { id: `hajj-ex-${Date.now()}`, title: 'New Package', category: 'General', price: 'BDT 0', duration: '0 Days', makkahHotel: 'TBA', madinahHotel: 'TBA', features: [], image: '', enabled: true })} 
                                        className="bg-green-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Add Hajj Package
                                    </button>
                                </div>
                            )}

                            {activeExclusiveTab === 'umrah' && (
                                <div>
                                    <PageIdDisplay id="#exclusive-umrah" label="Page ID (New Umrah Page)" />
                                    <h4 className="font-bold text-xl mb-4 text-[var(--color-secondary)]">Page Settings</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 border border-gray-700 rounded-lg">
                                        <AdminInput label="Page Title" name="exclusiveUmrah.pageData.pageBanner.title" value={localData.exclusiveUmrah.pageData.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                        <AdminInput label="Banner Image" name="exclusiveUmrah.pageData.pageBanner.backgroundImage" value={localData.exclusiveUmrah.pageData.pageBanner.backgroundImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                        <AdminInput label="Intro Section Title" name="exclusiveUmrah.pageData.introTitle" value={localData.exclusiveUmrah.pageData.introTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                        <AdminTextarea label="Intro Text" name="exclusiveUmrah.pageData.introText" value={localData.exclusiveUmrah.pageData.introText} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                        <div className="md:col-span-2">
                                            <SeoEditor pageName="Exclusive Umrah SEO" seoPath="exclusiveUmrah.pageData.seo" localData={localData} onChange={handleNestedChange} />
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-xl mb-4 text-[var(--color-secondary)]">Packages List</h4>
                                    {localData.exclusiveUmrah.packages.map((pkg, index) => (
                                        <ExclusivePackageEditor 
                                            key={pkg.id + index}
                                            pkg={pkg} 
                                            index={index} 
                                            path="exclusiveUmrah.packages"
                                            onChange={handleListChange} 
                                            onDelete={deleteListItem}
                                        />
                                    ))}
                                    <button 
                                        onClick={() => addListItem('exclusiveUmrah.packages', { id: `umrah-ex-${Date.now()}`, title: 'New Package', category: 'General', price: 'BDT 0', duration: '0 Days', makkahHotel: 'TBA', madinahHotel: 'TBA', features: [], image: '', enabled: true })} 
                                        className="bg-green-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Add Umrah Package
                                    </button>
                                </div>
                            )}
                        </Section>

                        <Section title="Floating Action Button (WhatsApp/Phone)">
                            <div className="p-4 border border-gray-700 rounded-lg">
                                <div className="mb-4">
                                    <ToggleSwitch 
                                        label="Enable Floating Button" 
                                        enabled={localData.floatingButton?.enabled ?? false} 
                                        onChange={(val) => handleNestedChange('floatingButton.enabled', val)} 
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">Action Type</label>
                                        <select
                                            value={localData.floatingButton?.type || 'whatsapp'}
                                            onChange={(e) => handleNestedChange('floatingButton.type', e.target.value)}
                                            className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-md py-2 px-3 text-[var(--color-light-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                        >
                                            <option value="whatsapp">WhatsApp Chat</option>
                                            <option value="phone">Phone Call</option>
                                        </select>
                                    </div>
                                    <AdminInput
                                        label="Phone Number (with country code, e.g., +880...)"
                                        name="floatingButton.phoneNumber"
                                        value={localData.floatingButton?.phoneNumber || ''}
                                        onChange={(e) => handleNestedChange(e.target.name, e.target.value)}
                                    />
                                </div>
                                {localData.floatingButton?.type === 'whatsapp' && (
                                    <div className="mt-4">
                                        <AdminTextarea
                                            label="Pre-filled WhatsApp Message"
                                            name="floatingButton.whatsappMessage"
                                            value={localData.floatingButton?.whatsappMessage || ''}
                                            onChange={(e) => handleNestedChange(e.target.name, e.target.value)}
                                            rows={2}
                                        />
                                    </div>
                                )}
                            </div>
                        </Section>

                        <Section title="Homepage Search Bar">
                            <div className="p-4 border border-gray-700 rounded-lg">
                                <div className="mb-4">
                                    <ToggleSwitch 
                                        label="Enable Search Bar" 
                                        enabled={localData.pages.home.packageFilter?.enabled ?? true} 
                                        onChange={(val) => handleNestedChange('pages.home.packageFilter.enabled', val)} 
                                    />
                                </div>
                                <AdminInput 
                                    label="Section Title" 
                                    name="pages.home.packageFilter.title" 
                                    value={localData.pages.home.packageFilter?.title || 'Find Your Perfect Package'} 
                                    onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                />
                                
                                <h5 className="font-semibold text-lg text-white mt-6 mb-3">Field Labels & Placeholders</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <AdminInput 
                                        label="Destination Label" 
                                        name="pages.home.packageFilter.destinationLabel" 
                                        value={localData.pages.home.packageFilter?.destinationLabel} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                    <AdminInput 
                                        label="Destination Placeholder" 
                                        name="pages.home.packageFilter.destinationPlaceholder" 
                                        value={localData.pages.home.packageFilter?.destinationPlaceholder} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                    <AdminInput 
                                        label="Month Label" 
                                        name="pages.home.packageFilter.monthLabel" 
                                        value={localData.pages.home.packageFilter?.monthLabel} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                    <AdminInput 
                                        label="Package Type Label" 
                                        name="pages.home.packageFilter.packageTypeLabel" 
                                        value={localData.pages.home.packageFilter?.packageTypeLabel} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                    <AdminInput 
                                        label="Button Text" 
                                        name="pages.home.packageFilter.buttonText" 
                                        value={localData.pages.home.packageFilter?.buttonText} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                </div>
                            </div>
                        </Section>

                        <Section title="Prayer Times Widget">
                            <div className="p-4 border border-gray-700 rounded-lg">
                                <div className="mb-4">
                                    <ToggleSwitch 
                                        label="Enable Prayer Times Widget" 
                                        enabled={localData.prayerTimes?.enabled ?? false} 
                                        onChange={(val) => handleNestedChange('prayerTimes.enabled', val)} 
                                    />
                                </div>
                                <AdminInput 
                                    label="Widget Title" 
                                    name="prayerTimes.title" 
                                    value={localData.prayerTimes?.title || ''} 
                                    onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                />
                                
                                <h5 className="font-semibold text-lg text-white mt-6 mb-4">Locations</h5>
                                {localData.prayerTimes?.locations?.map((loc, index) => (
                                    <div key={index} className="mb-4 p-3 border border-gray-600 rounded-md bg-[var(--color-dark-bg)]">
                                        <div className="flex justify-between items-start mb-2">
                                            <ToggleSwitch 
                                                label="Visible" 
                                                enabled={loc.enabled} 
                                                onChange={val => handleListChange('prayerTimes.locations', index, 'enabled', val)} 
                                            />
                                            <button 
                                                onClick={() => deleteListItem('prayerTimes.locations', index)} 
                                                className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <AdminInput 
                                                label="Display Name" 
                                                name={`name`} 
                                                value={loc.name} 
                                                onChange={e => handleListChange('prayerTimes.locations', index, e.target.name, e.target.value)} 
                                            />
                                            <AdminInput 
                                                label="City (API Param)" 
                                                name={`city`} 
                                                value={loc.city} 
                                                onChange={e => handleListChange('prayerTimes.locations', index, e.target.name, e.target.value)} 
                                            />
                                            <AdminInput 
                                                label="Country (API Param)" 
                                                name={`country`} 
                                                value={loc.country} 
                                                onChange={e => handleListChange('prayerTimes.locations', index, e.target.name, e.target.value)} 
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => addListItem('prayerTimes.locations', { name: 'New Location', city: 'CityName', country: 'CountryName', enabled: true })} 
                                    className="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Location
                                </button>
                            </div>
                        </Section>
                        
                        <Section title="Footer Newsletter">
                            <div className="p-4 border border-gray-700 rounded-lg">
                                <p className="text-[var(--color-muted-text)] mb-4">Customize the "Subscribe to Our Newsletter" section in the footer.</p>
                                <div className="mb-4">
                                    <ToggleSwitch
                                        label="Enable Newsletter Section"
                                        enabled={localData.footer.newsletter?.enabled ?? true}
                                        onChange={(val) => handleNestedChange('footer.newsletter.enabled', val)}
                                    />
                                </div>
                                <AdminInput
                                    label="Title"
                                    name="footer.newsletter.title"
                                    value={localData.footer.newsletter?.title}
                                    onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                />
                                <AdminTextarea
                                    label="Subtitle"
                                    name="footer.newsletter.subtitle"
                                    value={localData.footer.newsletter?.subtitle}
                                    onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                    className="mt-2"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <AdminInput
                                        label="Placeholder Text"
                                        name="footer.newsletter.placeholder"
                                        value={localData.footer.newsletter?.placeholder}
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                    />
                                    <AdminInput
                                        label="Button Text"
                                        name="footer.newsletter.buttonText"
                                        value={localData.footer.newsletter?.buttonText}
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                    />
                                </div>
                                <AdminInput
                                    label="Google Apps Script URL (for saving emails)"
                                    name="footer.newsletter.googleSheetUrl"
                                    value={localData.footer.newsletter?.googleSheetUrl}
                                    onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                    className="mt-4"
                                    placeholder="https://script.google.com/macros/s/..."
                                />
                                <p className="text-xs text-[var(--color-muted-text)] mt-1">Deploy your Google Sheet script as a Web App and paste the URL here to save subscriber emails.</p>
                            </div>
                        </Section>

                        <Section title="Partners & Affiliations">
                            <div className="p-4 border border-gray-700 rounded-lg">
                                <div className="mb-4">
                                    <ToggleSwitch 
                                        label="Enable Partners Section" 
                                        enabled={localData.footer.partners?.enabled ?? true} 
                                        onChange={(val) => handleNestedChange('footer.partners.enabled', val)} 
                                    />
                                </div>
                                <AdminInput 
                                    label="Section Title" 
                                    name="footer.partners.title" 
                                    value={localData.footer.partners?.title} 
                                    onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                />
                                <AdminTextarea 
                                    label="Section Subtitle" 
                                    name="footer.partners.subtitle" 
                                    value={localData.footer.partners?.subtitle} 
                                    onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                />
                                
                                <h5 className="font-semibold text-lg text-white mt-6 mb-4">Partner Logos</h5>
                                {localData.footer.partners?.logos?.map((logo, index) => (
                                    <div key={index} className="mb-4 p-3 border border-gray-600 rounded-md bg-[var(--color-dark-bg)]">
                                        <div className="flex justify-between items-start mb-2">
                                            <ToggleSwitch 
                                                label="Visible" 
                                                enabled={logo.enabled} 
                                                onChange={val => handleListChange('footer.partners.logos', index, 'enabled', val)} 
                                            />
                                            <button 
                                                onClick={() => deleteListItem('footer.partners.logos', index)} 
                                                className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <AdminInput 
                                                label="Image URL" 
                                                name={`src`} 
                                                value={logo.src} 
                                                onChange={e => handleListChange('footer.partners.logos', index, e.target.name, e.target.value)} 
                                            />
                                            <AdminInput 
                                                label="Alt Text" 
                                                name={`alt`} 
                                                value={logo.alt} 
                                                onChange={e => handleListChange('footer.partners.logos', index, e.target.name, e.target.value)} 
                                            />
                                            <AdminInput 
                                                label="Link URL (Optional)" 
                                                name={`href`} 
                                                value={logo.href} 
                                                onChange={e => handleListChange('footer.partners.logos', index, e.target.name, e.target.value)} 
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => addListItem('footer.partners.logos', { src: 'https://via.placeholder.com/150', alt: 'New Partner', href: '#', enabled: true })} 
                                    className="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Partner Logo
                                </button>
                            </div>
                        </Section>
                        
                        <Section title="Footer Content">
                            <p className="text-[var(--color-muted-text)] mb-4">Manage the text content of the website footer.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 border border-gray-700 rounded-lg">
                                    <h5 className="font-semibold text-lg text-white mb-3">About Column</h5>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <AdminInput 
                                            label="Title Part 1 (White)" 
                                            name="footer.about.title.0" 
                                            value={localData.footer.about.title[0]} 
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        />
                                        <AdminInput 
                                            label="Title Part 2 (Gold)" 
                                            name="footer.about.title.1" 
                                            value={localData.footer.about.title[1]} 
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        />
                                    </div>
                                    <AdminTextarea 
                                        label="Description" 
                                        name="footer.about.description" 
                                        value={localData.footer.about.description} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                        rows={4}
                                    />
                                </div>

                                <div className="p-4 border border-gray-700 rounded-lg">
                                    <h5 className="font-semibold text-lg text-white mb-3">Column Titles</h5>
                                    <AdminInput 
                                        label="Quick Links Title" 
                                        name="footer.quickLinks.title" 
                                        value={localData.footer.quickLinks.title} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        className="mb-2"
                                    />
                                    <AdminInput 
                                        label="Main Services Title" 
                                        name="footer.mainServices.title" 
                                        value={localData.footer.mainServices.title} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                </div>
                                
                                <div className="p-4 border border-gray-700 rounded-lg">
                                    <h5 className="font-semibold text-lg text-white mb-3">Follow Us Column</h5>
                                    <AdminInput 
                                        label="Title" 
                                        name="footer.followUs.title" 
                                        value={localData.footer.followUs.title} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                        className="mb-2"
                                    />
                                    <AdminTextarea 
                                        label="Description" 
                                        name="footer.followUs.description" 
                                        value={localData.footer.followUs.description} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                </div>

                                <div className="p-4 border border-gray-700 rounded-lg">
                                    <h5 className="font-semibold text-lg text-white mb-3">Bottom Bar</h5>
                                    <AdminInput 
                                        label="Copyright Text" 
                                        name="footer.copyrightText" 
                                        value={localData.footer.copyrightText} 
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)} 
                                    />
                                </div>
                            </div>
                        </Section>

                        <Section title="Footer Navigation Links">
                            <h4 className="font-bold text-xl mb-4 text-[var(--color-secondary)]">Quick Links Column</h4>
                            <div className="space-y-4 mb-8">
                                {localData.footer.quickLinks.links.map((link, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 border border-gray-700 rounded-lg bg-[var(--color-dark-bg)]">
                                        <AdminInput label="Label" name={`label`} value={link.label} onChange={e => handleListChange('footer.quickLinks.links', index, 'label', e.target.value)} className="flex-1"/>
                                        <AdminInput label="URL" name={`href`} value={link.href} onChange={e => handleListChange('footer.quickLinks.links', index, 'href', e.target.value)} className="flex-1"/>
                                        <div className="flex items-center gap-2 mt-5">
                                            <ToggleSwitch label="Visible" enabled={link.enabled} onChange={val => handleListChange('footer.quickLinks.links', index, 'enabled', val)} />
                                            <button onClick={() => deleteListItem('footer.quickLinks.links', index)} className="bg-red-600 text-white px-2 py-1 rounded text-sm">Delete</button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => addListItem('footer.quickLinks.links', { label: 'New Link', href: '#', enabled: true })} className="bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm hover:bg-blue-700">Add Quick Link</button>
                            </div>

                            <h4 className="font-bold text-xl mb-4 text-[var(--color-secondary)]">Main Services Column</h4>
                            <div className="space-y-4">
                                {localData.footer.mainServices.links.map((link, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 border border-gray-700 rounded-lg bg-[var(--color-dark-bg)]">
                                        <AdminInput label="Label" name={`label`} value={link.label} onChange={e => handleListChange('footer.mainServices.links', index, 'label', e.target.value)} className="flex-1"/>
                                        <AdminInput label="URL" name={`href`} value={link.href} onChange={e => handleListChange('footer.mainServices.links', index, 'href', e.target.value)} className="flex-1"/>
                                        <div className="flex items-center gap-2 mt-5">
                                            <ToggleSwitch label="Visible" enabled={link.enabled} onChange={val => handleListChange('footer.mainServices.links', index, 'enabled', val)} />
                                            <button onClick={() => deleteListItem('footer.mainServices.links', index)} className="bg-red-600 text-white px-2 py-1 rounded text-sm">Delete</button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => addListItem('footer.mainServices.links', { label: 'New Service', href: '#', enabled: true })} className="bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm hover:bg-blue-700">Add Service Link</button>
                            </div>
                        </Section>
                        
                        <Section title="Header & Navigation Bar">
                            <h4 className="font-bold text-xl mb-4 text-[var(--color-secondary)]">General</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-700 rounded-lg">
                                <AdminInput
                                    label="Site Logo URL"
                                    name="site.logoUrl"
                                    value={localData.site.logoUrl}
                                    onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                />
                                <div className="flex items-center pt-6">
                                    <ToggleSwitch 
                                        label="Show Theme Settings Icon in Header" 
                                        enabled={localData.header.showThemeSwitcher !== false} 
                                        onChange={(val) => handleNestedChange('header.showThemeSwitcher', val)} 
                                    />
                                </div>
                                <AdminInput
                                    label="'Book Now' Button Text"
                                    name="header.bookNowButton.text"
                                    value={localData.header.bookNowButton.text}
                                    onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                />
                                <AdminInput
                                    label="'Book Now' Button Link"
                                    name="header.bookNowButton.href"
                                    value={localData.header.bookNowButton.href}
                                    onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                />
                            </div>

                            <h4 className="font-bold text-xl mt-8 mb-4 text-[var(--color-secondary)]">Top Bar Settings</h4>
                            <div className="p-4 border border-gray-700 rounded-lg">
                                <h5 className="font-semibold text-lg text-white mb-2">Contact Info</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {phoneIndex !== -1 && (
                                    <AdminInput
                                        label="Top Bar Phone Number"
                                        name={`header.contactInfo.${phoneIndex}.value`}
                                        value={localData.header.contactInfo?.[phoneIndex]?.value || ''}
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                    />
                                )}
                                {emailIndex !== -1 && (
                                    <AdminInput
                                        label="Top Bar Email Address"
                                        name={`header.contactInfo.${emailIndex}.value`}
                                        value={localData.header.contactInfo?.[emailIndex]?.value || ''}
                                        onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                    />
                                )}
                                </div>

                                <h5 className="font-semibold text-lg text-white mt-6 mb-2">Social Media Links</h5>
                                <div className="space-y-4">
                                    {localData.header.socialLinks?.map((link, index) => (
                                        <div key={link.name + index} className="p-4 border border-gray-600 rounded-md bg-[var(--color-dark-bg)]">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="font-bold text-[var(--color-light-text)]">{link.name || 'New Social Link'}</p>
                                                <button
                                                    onClick={() => deleteListItem('header.socialLinks', index)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <AdminInput
                                                label="Name (e.g., Facebook)"
                                                name="name"
                                                value={link.name}
                                                onChange={e => handleListChange('header.socialLinks', index, e.target.name, e.target.value)}
                                            />
                                            <AdminInput
                                                label="Full URL"
                                                name="href"
                                                value={link.href}
                                                onChange={e => handleListChange('header.socialLinks', index, e.target.name, e.target.value)}
                                                className="mt-2"
                                            />
                                            <AdminTextarea
                                                label="Icon (SVG Path Data)"
                                                name="icon"
                                                value={link.icon}
                                                onChange={e => handleListChange('header.socialLinks', index, e.target.name, e.target.value)}
                                                rows={4}
                                            />
                                            <p className="text-xs text-[var(--color-muted-text)] mt-1">
                                                Provide the inner content of an SVG tag, e.g., {'<path d="..."/>'}. Find icons on sites like Heroicons.
                                            </p>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addListItem('header.socialLinks', { name: 'New Social', href: 'https://', icon: '<path d="..."/>' })}
                                        className="mt-2 bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm hover:bg-blue-700"
                                    >
                                        Add Social Link
                                    </button>
                                </div>
                                <h5 className="font-semibold text-lg text-white mt-6 mb-2">Tagline Slider</h5>
                                <p className="text-sm text-[var(--color-muted-text)] mb-2">Manage the taglines that appear in the top bar slider.</p>
                                <div className="space-y-3">
                                    {localData.header.taglines?.map((tagline, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                aria-label={`Tagline ${index + 1}`}
                                                value={tagline}
                                                onChange={(e) => handleNestedChange(`header.taglines.${index}`, e.target.value)}
                                                className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-md py-2 px-3 text-[var(--color-light-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => deleteListItem('header.taglines', index)}
                                                className="bg-red-600 text-white px-3 py-2 rounded self-end h-10 hover:bg-red-700 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => addListItem('header.taglines', 'New Inspiring Tagline')}
                                    className="mt-3 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                                >
                                    Add Tagline
                                </button>
                            </div>

                            <h4 className="font-bold text-xl mt-8 mb-4 text-[var(--color-secondary)]">Navigation Links</h4>
                            <div className="space-y-4">
                                {localData.header.navLinks.map((navLink, index) => (
                                    <div key={navLink.label + index} className="p-4 border border-gray-700 rounded-lg">
                                        <div className="flex justify-between items-center mb-4">
                                            <h5 className="font-semibold text-lg text-white">Menu Item: {navLink.label || `Item ${index + 1}`}</h5>
                                            <div className="flex items-center gap-4">
                                                <ToggleSwitch
                                                    label="Visible"
                                                    enabled={navLink.enabled}
                                                    onChange={enabled => handleListChange('header.navLinks', index, 'enabled', enabled)}
                                                />
                                                <button
                                                    onClick={() => deleteListItem('header.navLinks', index)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <AdminInput
                                                label="Label"
                                                name="label"
                                                value={navLink.label}
                                                onChange={e => handleListChange('header.navLinks', index, e.target.name, e.target.value)}
                                            />
                                            <AdminInput
                                                label="Link (e.g., #home, or # for dropdown)"
                                                name="href"
                                                value={navLink.href}
                                                onChange={e => handleListChange('header.navLinks', index, e.target.name, e.target.value)}
                                            />
                                        </div>
                                        
                                        {navLink.subLinks && (
                                            <div className="mt-4 pl-6 border-l-2 border-gray-600">
                                                <h6 className="font-semibold text-md text-[var(--color-light-text)] mb-2">Sub-menu Items</h6>
                                                {navLink.subLinks.map((subLink, subIndex) => (
                                                    <div key={subLink.label + subIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 p-3 border border-gray-600 rounded-md items-center bg-[var(--color-dark-bg)]">
                                                        <AdminInput
                                                            label="Sub-item Label"
                                                            name="label"
                                                            value={subLink.label}
                                                            onChange={e => handleListChange(`header.navLinks.${index}.subLinks`, subIndex, 'label', e.target.value)}
                                                        />
                                                        <AdminInput
                                                            label="Sub-item Link"
                                                            name="href"
                                                            value={subLink.href}
                                                            onChange={e => handleListChange(`header.navLinks.${index}.subLinks`, subIndex, 'href', e.target.value)}
                                                        />
                                                        <div className="flex items-center gap-4">
                                                            <ToggleSwitch
                                                                label="Visible"
                                                                enabled={subLink.enabled}
                                                                onChange={enabled => handleListChange(`header.navLinks.${index}.subLinks`, subIndex, 'enabled', enabled)}
                                                            />
                                                            <button onClick={() => deleteListItem(`header.navLinks.${index}.subLinks`, subIndex)} className="bg-red-600 text-white px-3 py-1 rounded self-center h-8">Delete</button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => addListItem(`header.navLinks.${index}.subLinks`, { href: '#', label: 'New Sub-Link', enabled: true })}
                                                    className="mt-2 bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm hover:bg-blue-700"
                                                >
                                                    Add Sub-menu Item
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={() => addListItem('header.navLinks', { href: '#', label: 'New Menu', enabled: true, subLinks: [] })}
                                    className="mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
                                >
                                    Add New Menu Item
                                </button>
                            </div>
                        </Section>

                        <Section title="Theme Customization">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-xl mb-4 text-[var(--color-secondary)]">Colors</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <AdminInput label="Primary (Gold)" name="theme.colors.primary" value={localData.theme.colors.primary} onChange={e => handleNestedChange(e.target.name, e.target.value)} type="color" />
                                        <AdminInput label="Primary Dark" name="theme.colors.primaryDark" value={localData.theme.colors.primaryDark} onChange={e => handleNestedChange(e.target.name, e.target.value)} type="color" />
                                        <AdminInput label="Secondary (Green)" name="theme.colors.secondary" value={localData.theme.colors.secondary} onChange={e => handleNestedChange(e.target.name, e.target.value)} type="color" />
                                        <AdminInput label="Secondary Dark" name="theme.colors.secondaryDark" value={localData.theme.colors.secondaryDark} onChange={e => handleNestedChange(e.target.name, e.target.value)} type="color" />
                                        <AdminInput label="Dark Background" name="theme.colors.darkBg" value={localData.theme.colors.darkBg} onChange={e => handleNestedChange(e.target.name, e.target.value)} type="color" />
                                        <AdminInput label="Light Background" name="theme.colors.lightBg" value={localData.theme.colors.lightBg} onChange={e => handleNestedChange(e.target.name, e.target.value)} type="color" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl mb-4 text-[var(--color-secondary)]">Fonts & UI</h4>
                                    <AdminInput label="Sans-serif Font (Google Font Name)" name="theme.fonts.sans" value={localData.theme.fonts.sans} onChange={e => handleNestedChange(e.target.name, e.target.value)} placeholder="e.g., Roboto" />
                                    <AdminInput label="Display Font (Google Font Name)" name="theme.fonts.display" value={localData.theme.fonts.display} onChange={e => handleNestedChange(e.target.name, e.target.value)} placeholder="e.g., Teko" className="mt-4" />
                                    
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">Button Style</label>
                                        <select
                                            name="theme.ui.buttonStyle"
                                            value={localData.theme.ui.buttonStyle}
                                            onChange={e => handleNestedChange(e.target.name, e.target.value)}
                                            className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-md py-2 px-3 text-[var(--color-light-text)]"
                                        >
                                            <option value="rounded">Rounded</option>
                                            <option value="pill">Pill</option>
                                            <option value="sharp">Sharp</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title="Homepage">
                            <PageIdDisplay id="#home" label="Page ID" />
                            <SeoEditor pageName="Homepage SEO" seoPath="pages.home.seo" localData={localData} onChange={handleNestedChange} />
                            
                            <h4 className="font-bold text-xl mt-8 mb-4 text-[var(--color-secondary)]">Hero Section</h4>
                            <AdminInput label="Main Title" name="pages.home.hero.title" value={localData.pages.home.hero.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminInput label="License Info" name="pages.home.hero.licenseInfo" value={localData.pages.home.hero.licenseInfo} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                            <AdminInput label="Subtitle" name="pages.home.hero.subtitle" value={localData.pages.home.hero.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                            <AdminTextarea label="Description" name="pages.home.hero.description" value={localData.pages.home.hero.description} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                            <AdminInput label="Button Text" name="pages.home.hero.buttonText" value={localData.pages.home.hero.buttonText} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                            
                            <h5 className="font-semibold text-lg text-white mt-4 mb-2">Hero Slider Images</h5>
                            {localData.pages.home.hero.images.map((img, index) => (
                                <div key={index} className="flex items-center gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={img}
                                        onChange={e => handleNestedChange(`pages.home.hero.images.${index}`, e.target.value)}
                                        className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-md py-2 px-3 text-[var(--color-light-text)]"
                                    />
                                    <button onClick={() => deleteListItem('pages.home.hero.images', index)} className="bg-red-600 text-white px-3 py-2 rounded">Delete</button>
                                </div>
                            ))}
                            <button onClick={() => addListItem('pages.home.hero.images', 'https://')} className="mt-2 bg-blue-600 text-white font-bold py-2 px-4 rounded">Add Image</button>

                            <h4 className="font-bold text-xl mt-8 mb-4 text-[var(--color-secondary)]">Section Visibility</h4>
                            {Object.entries(localData.pages.home.sections).map(([key, section]: [string, any]) => (
                                <div key={key} className="mb-2 flex items-center justify-between p-3 border border-gray-700 rounded">
                                    <span className="capitalize font-bold text-white">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <ToggleSwitch label="Enabled" enabled={section.enabled} onChange={val => handleNestedChange(`pages.home.sections.${key}.enabled`, val)} />
                                </div>
                            ))}
                        </Section>
                        
                        <Section title="Hajj & Umrah Details Pages (Old)">
                            <h4 className="font-bold text-xl mb-4 text-[var(--color-secondary)]">Hajj Details Page</h4>
                            <PageIdDisplay id="#hajj-details" label="Page ID" />
                            <AdminInput label="Page Title" name="pages.hajjDetails.pageBanner.title" value={localData.pages.hajjDetails.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminInput label="Banner Image" name="pages.hajjDetails.pageBanner.backgroundImage" value={localData.pages.hajjDetails.pageBanner.backgroundImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                            {localData.pages.hajjDetails.sections.map((section, index) => (
                                <div key={index} className="mt-4 p-4 border border-gray-600 rounded-md">
                                    <AdminInput label="Section Title" name={`pages.hajjDetails.sections.${index}.title`} value={section.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                    <AdminTextarea label="Content" name={`pages.hajjDetails.sections.${index}.description`} value={section.description} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" rows={6} />
                                    <AdminInput label="Image URL (Optional)" name={`pages.hajjDetails.sections.${index}.image`} value={section.image} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                                </div>
                            ))}

                            <h4 className="font-bold text-xl mt-8 mb-4 text-[var(--color-secondary)]">Umrah Details Page</h4>
                            <PageIdDisplay id="#umrah-details" label="Page ID" />
                            <AdminInput label="Page Title" name="pages.umrahDetails.pageBanner.title" value={localData.pages.umrahDetails.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminInput label="Banner Image" name="pages.umrahDetails.pageBanner.backgroundImage" value={localData.pages.umrahDetails.pageBanner.backgroundImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                            {localData.pages.umrahDetails.sections.map((section, index) => (
                                <div key={index} className="mt-4 p-4 border border-gray-600 rounded-md">
                                    <AdminInput label="Section Title" name={`pages.umrahDetails.sections.${index}.title`} value={section.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                    <AdminTextarea label="Content" name={`pages.umrahDetails.sections.${index}.description`} value={section.description} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" rows={6} />
                                    <AdminInput label="Image URL (Optional)" name={`pages.umrahDetails.sections.${index}.image`} value={section.image} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                                </div>
                            ))}
                        </Section>

                        <Section title="Blog Management">
                            <PageIdDisplay id="#blog" label="Page ID" />
                            <SeoEditor pageName="Blog Page SEO" seoPath="pages.blog.seo" localData={localData} onChange={handleNestedChange} />
                            
                            <h4 className="font-bold text-xl mt-8 mb-4 text-[var(--color-secondary)]">Blog Page Banner</h4>
                            <AdminInput label="Page Title" name="pages.blog.pageBanner.title" value={localData.pages.blog.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminTextarea label="Subtitle" name="pages.blog.pageBanner.subtitle" value={localData.pages.blog.pageBanner.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                            <AdminInput label="Background Image" name="pages.blog.pageBanner.backgroundImage" value={localData.pages.blog.pageBanner.backgroundImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />

                            <h4 className="font-bold text-xl mt-8 mb-4 text-[var(--color-secondary)]">Blog Posts</h4>
                            {localData.pages.blog.posts.map((post, index) => (
                                <BlogEditor 
                                    key={post.id + index}
                                    post={post}
                                    index={index}
                                    onChange={handleListChange}
                                    onDelete={deleteListItem}
                                />
                            ))}
                            <button
                                onClick={() => addListItem('pages.blog.posts', { id: Date.now().toString(), title: 'New Blog Post', excerpt: 'Brief summary...', content: '<p>Write your content here...</p>', author: 'Admin', date: new Date().toLocaleDateString(), image: '', enabled: true })}
                                className="mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Add New Blog Post
                            </button>
                        </Section>

                        <Section title="Services Page">
                            <PageIdDisplay id="#services" label="Page ID" />
                            <AdminInput label="Page Title" name="pages.services.pageBanner.title" value={localData.pages.services.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminTextarea label="Page Subtitle" name="pages.services.pageBanner.subtitle" value={localData.pages.services.pageBanner.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                            
                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Service List</h4>
                            {localData.pages.services.list.map((service, index) => (
                                <div key={service.title + index} className="mb-4 p-3 border border-gray-600 rounded-md">
                                    <div className="flex justify-between items-start mb-2">
                                        <ToggleSwitch label="Visible" enabled={service.enabled} onChange={val => handleListChange('pages.services.list', index, 'enabled', val)} />
                                        <button onClick={() => deleteListItem('pages.services.list', index)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
                                    </div>
                                    <AdminInput label="Icon Name (e.g. Hajj, Umrah)" name="icon" value={service.icon} onChange={e => handleListChange('pages.services.list', index, e.target.name, e.target.value)} />
                                    <AdminInput label="Title" name="title" value={service.title} onChange={e => handleListChange('pages.services.list', index, e.target.name, e.target.value)} className="mt-2"/>
                                    <AdminTextarea label="Description" name="description" value={service.description} onChange={e => handleListChange('pages.services.list', index, e.target.name, e.target.value)} className="mt-2"/>
                                </div>
                            ))}
                            <button onClick={() => addListItem('pages.services.list', { icon: 'Default', title: 'New Service', description: '', details: [], enabled: true })} className="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded">Add Service</button>
                        </Section>

                        <Section title="Hajj & Umrah Listing Pages (Banner & Filters)">
                            <div className="flex space-x-4 mb-6">
                                <button
                                    className={`px-4 py-2 rounded-md font-bold ${activeListingTab === 'hajj' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-700 text-gray-300'}`}
                                    onClick={() => setActiveListingTab('hajj')}
                                >
                                    Hajj Listing Page
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-md font-bold ${activeListingTab === 'umrah' ? 'bg-[var(--color-secondary)] text-[var(--color-dark-bg)]' : 'bg-gray-700 text-gray-300'}`}
                                    onClick={() => setActiveListingTab('umrah')}
                                >
                                    Umrah Listing Page
                                </button>
                            </div>

                            {activeListingTab === 'umrah' && (
                                <div>
                                    <PageIdDisplay id="#umrah" label="Page ID" />
                                    <p className="text-[var(--color-muted-text)] mb-4">Configure the main Umrah packages listing page (banner, filters).</p>
                                    
                                    <SeoEditor pageName="Umrah Page SEO" seoPath="pages.umrah.seo" localData={localData} onChange={handleNestedChange} />

                                    <h4 className="font-bold text-xl mt-8 mb-4 text-[var(--color-secondary)]">Page Banner</h4>
                                    <AdminInput label="Title" name="pages.umrah.pageBanner.title" value={localData.pages.umrah.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                    <AdminTextarea label="Subtitle" name="pages.umrah.pageBanner.subtitle" value={localData.pages.umrah.pageBanner.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                                    <AdminInput label="Background Image URL" name="pages.umrah.pageBanner.backgroundImage" value={localData.pages.umrah.pageBanner.backgroundImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />

                                    <h4 className="font-bold text-xl mt-8 mb-4 text-[var(--color-secondary)]">Category Filters</h4>
                                    <p className="text-xs text-[var(--color-muted-text)] mb-4">These filters appear as buttons at the top of the list. The 'Category' must match the category assigned to individual packages in the 'Legacy Packages' section.</p>
                                    
                                    {localData.pages.umrah.filters.map((filter, index) => (
                                        <div key={index} className="mb-4 p-3 border border-gray-600 rounded-md bg-[var(--color-dark-bg)]">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-white">Filter {index + 1}</span>
                                                <button 
                                                    onClick={() => deleteListItem('pages.umrah.filters', index)} 
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <AdminInput label="Label (Display Name)" name="label" value={filter.label} onChange={e => handleListChange('pages.umrah.filters', index, e.target.name, e.target.value)} />
                                                <AdminInput label="Category (Exact Match)" name="category" value={filter.category} onChange={e => handleListChange('pages.umrah.filters', index, e.target.name, e.target.value)} />
                                            </div>
                                            <div className="text-xs text-green-400 mt-1">
                                                Linked Packages: {getLinkedPackageCount(filter.category, activeListingTab)}
                                            </div>
                                            <div className="mt-2">
                                                <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">Icon (SVG Path)</label>
                                                <textarea 
                                                    value={filter.icon} 
                                                    onChange={e => handleListChange('pages.umrah.filters', index, 'icon', e.target.value)} 
                                                    rows={2}
                                                    className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-md py-2 px-3 text-[var(--color-light-text)] font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => addListItem('pages.umrah.filters', { label: 'New Filter', category: 'Category Name', icon: '<path d="..." />' })} 
                                        className="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Add New Filter
                                    </button>
                                </div>
                            )}

                            {activeListingTab === 'hajj' && (
                                <div>
                                    <PageIdDisplay id="#hajj" label="Page ID" />
                                    <p className="text-[var(--color-muted-text)] mb-4">Configure the main Hajj packages listing page.</p>
                                    
                                    <SeoEditor pageName="Hajj Page SEO" seoPath="pages.hajj.seo" localData={localData} onChange={handleNestedChange} />

                                    <h4 className="font-bold text-xl mt-8 mb-4 text-[var(--color-secondary)]">Page Banner</h4>
                                    <AdminInput label="Title" name="pages.hajj.pageBanner.title" value={localData.pages.hajj.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                                    <AdminTextarea label="Subtitle" name="pages.hajj.pageBanner.subtitle" value={localData.pages.hajj.pageBanner.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                                    <AdminInput label="Background Image URL" name="pages.hajj.pageBanner.backgroundImage" value={localData.pages.hajj.pageBanner.backgroundImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />

                                    <h4 className="font-bold text-xl mt-8 mb-4 text-[var(--color-secondary)]">Category Filters</h4>
                                    {localData.pages.hajj.filters.map((filter, index) => (
                                        <div key={index} className="mb-4 p-3 border border-gray-600 rounded-md bg-[var(--color-dark-bg)]">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-white">Filter {index + 1}</span>
                                                <button 
                                                    onClick={() => deleteListItem('pages.hajj.filters', index)} 
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <AdminInput label="Label (Display Name)" name="label" value={filter.label} onChange={e => handleListChange('pages.hajj.filters', index, e.target.name, e.target.value)} />
                                                <AdminInput label="Category (Exact Match)" name="category" value={filter.category} onChange={e => handleListChange('pages.hajj.filters', index, e.target.name, e.target.value)} />
                                            </div>
                                            <div className="text-xs text-green-400 mt-1">
                                                Linked Packages: {getLinkedPackageCount(filter.category, activeListingTab)}
                                            </div>
                                            <div className="mt-2">
                                                <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">Icon (SVG Path)</label>
                                                <textarea 
                                                    value={filter.icon} 
                                                    onChange={e => handleListChange('pages.hajj.filters', index, 'icon', e.target.value)} 
                                                    rows={2}
                                                    className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-md py-2 px-3 text-[var(--color-light-text)] font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => addListItem('pages.hajj.filters', { label: 'New Filter', category: 'Category Name', icon: '<path d="..." />' })} 
                                        className="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Add New Filter
                                    </button>
                                </div>
                            )}
                        </Section>

                        <Section title="Legacy Packages (Old Layout)">
                            <div className="flex space-x-4 mb-6">
                                <button
                                    className={`px-4 py-2 rounded-md font-bold ${activePackageTab === 'hajj' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-700 text-gray-300'}`}
                                    onClick={() => handlePackageTabChange('hajj')}
                                >
                                    Hajj Packages
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-md font-bold ${activePackageTab === 'umrah' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-700 text-gray-300'}`}
                                    onClick={() => handlePackageTabChange('umrah')}
                                >
                                    Umrah Packages
                                </button>
                            </div>
                            
                            {activePackageTab === 'hajj' && <PageIdDisplay id="#hajj" label="Page ID (Legacy Hajj)" />}
                            {activePackageTab === 'umrah' && <PageIdDisplay id="#umrah" label="Page ID (Legacy Umrah)" />}

                            {/* Category Filter Bar */}
                            <div className="mb-6 overflow-x-auto pb-2">
                                <div className="flex flex-wrap gap-2">
                                    {legacyCategories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setLegacyCategoryFilter(cat)}
                                            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors border ${
                                                legacyCategoryFilter === cat
                                                    ? 'bg-[var(--color-secondary)] text-[var(--color-dark-bg)] border-[var(--color-secondary)] font-bold'
                                                    : 'bg-transparent text-[var(--color-muted-text)] border-gray-600 hover:border-[var(--color-secondary)]'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {activePackageTab === 'hajj' && (
                                <div>
                                    {filteredLegacyPackages.length === 0 ? (
                                        <p className="text-center text-gray-500 py-4">No packages found in this category.</p>
                                    ) : (
                                        filteredLegacyPackages.map((pkg) => (
                                            <PackageEditor 
                                                key={pkg.originalIndex} 
                                                pkg={pkg} 
                                                index={pkg.originalIndex} 
                                                packageType="hajj" 
                                                onChange={handleListChange} 
                                                onDelete={deleteListItem} 
                                                availableCategories={localData.pages.hajj.filters.map(f => f.category)}
                                            />
                                        ))
                                    )}
                                    {legacyCategoryFilter === 'All' && (
                                        <button onClick={() => addListItem('hajjPackages', { name: 'New Hajj Package', price: '', enabled: true, category: 'Regular Hajj' })} className="bg-green-600 text-white font-bold py-2 px-4 rounded mt-4">Add Hajj Package</button>
                                    )}
                                </div>
                            )}

                            {activePackageTab === 'umrah' && (
                                <div>
                                    {filteredLegacyPackages.length === 0 ? (
                                        <p className="text-center text-gray-500 py-4">No packages found in this category.</p>
                                    ) : (
                                        filteredLegacyPackages.map((pkg) => (
                                            <PackageEditor 
                                                key={pkg.originalIndex}
                                                pkg={pkg} 
                                                index={pkg.originalIndex} 
                                                packageType="umrah" 
                                                onChange={handleListChange} 
                                                onDelete={deleteListItem} 
                                                availableCategories={localData.pages.umrah.filters.map(f => f.category)}
                                            />
                                        ))
                                    )}
                                    {legacyCategoryFilter === 'All' && (
                                        <button onClick={() => addListItem('umrahPackages', { name: 'New Umrah Package', price: '', enabled: true, category: 'Economy' })} className="bg-green-600 text-white font-bold py-2 px-4 rounded mt-4">Add Umrah Package</button>
                                    )}
                                </div>
                            )}
                        </Section>

                        <Section title="Hajj Guide (Bangla)">
                            <PageIdDisplay id="#hajj-guide-in-bangla" label="Page ID" />
                            <AdminInput label="Page Title" name="pages.hajjGuide.pageBanner.title" value={localData.pages.hajjGuide.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminTextarea label="Banner Subtitle" name="pages.hajjGuide.pageBanner.subtitle" value={localData.pages.hajjGuide.pageBanner.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                            
                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Types of Hajj</h4>
                            <AdminTextarea label="Intro Text" name="pages.hajjGuide.types.intro" value={localData.pages.hajjGuide.types.intro} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            {localData.pages.hajjGuide.types.list.map((item, index) => (
                                <div key={index} className="mt-2 p-3 border border-gray-600 rounded">
                                    <AdminInput label="Type Title" name={`title`} value={item.title} onChange={e => handleListChange('pages.hajjGuide.types.list', index, e.target.name, e.target.value)} />
                                    <AdminTextarea label="Description" name={`description`} value={item.description} onChange={e => handleListChange('pages.hajjGuide.types.list', index, e.target.name, e.target.value)} className="mt-1" />
                                </div>
                            ))}
                        </Section>

                        <Section title="Umrah Guide (Bangla)">
                            <PageIdDisplay id="#umrah-guide-in-bangla" label="Page ID" />
                            <AdminInput label="Page Title" name="pages.umrahGuide.pageBanner.title" value={localData.pages.umrahGuide.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminTextarea label="Banner Subtitle" name="pages.umrahGuide.pageBanner.subtitle" value={localData.pages.umrahGuide.pageBanner.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                            
                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Steps</h4>
                            <AdminInput label="Steps Title" name="pages.umrahGuide.stepsTitle" value={localData.pages.umrahGuide.stepsTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminTextarea label="Steps Intro" name="pages.umrahGuide.stepsIntro" value={localData.pages.umrahGuide.stepsIntro} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                            {localData.pages.umrahGuide.steps.map((step, index) => (
                                <div key={index} className="mt-4 p-3 border border-gray-600 rounded">
                                    <div className="flex justify-between items-center mb-2">
                                        <h5 className="font-bold">Step {index + 1}</h5>
                                        <ToggleSwitch label="Visible" enabled={step.enabled} onChange={val => handleListChange('pages.umrahGuide.steps', index, 'enabled', val)} />
                                    </div>
                                    <AdminInput label="Step Title" name="title" value={step.title} onChange={e => handleListChange('pages.umrahGuide.steps', index, e.target.name, e.target.value)} />
                                    <AdminTextarea label="Description" name="description" value={step.description} onChange={e => handleListChange('pages.umrahGuide.steps', index, e.target.name, e.target.value)} className="mt-2" />
                                    <AdminTextarea label="Arabic Text (Optional)" name="arabicText" value={step.arabicText} onChange={e => handleListChange('pages.umrahGuide.steps', index, e.target.name, e.target.value)} className="mt-2" />
                                </div>
                            ))}
                        </Section>

                        <Section title="Why Choose Us (Umrah)">
                            <PageIdDisplay id="#why-us" label="Page ID" />
                            <ExpertGuideEditor pageKey="whyChooseUs" localData={localData} handleNestedChange={handleNestedChange} />
                        </Section>

                        <Section title="Expert Hajj Guides">
                            <PageIdDisplay id="#expert-hajj-guides" label="Page ID" />
                            <ExpertGuideEditor pageKey="expertHajjGuides" localData={localData} handleNestedChange={handleNestedChange} />
                        </Section>
                        
                        <Section title="Service Details & Custom Pages">
                            <p className="text-[var(--color-muted-text)] mb-4">Manage content for <strong>Hotel Booking, Umrah Training, About Us, Privacy Policy</strong>, and other custom pages.</p>
                            
                            {/* Core Services */}
                            <h4 className="font-bold text-xl text-[var(--color-secondary)] mb-4 border-b border-gray-700 pb-2">Core Service Pages</h4>
                            {localData.customPages?.map((customPage, index) => {
                                if (!coreServiceIds.includes(customPage.id)) return null;
                                return (
                                    <CustomPageEditor
                                        key={customPage.id + index}
                                        customPage={customPage}
                                        index={index}
                                        handleListChange={handleListChange}
                                        handleNestedChange={handleNestedChange}
                                        addListItem={addListItem}
                                        deleteListItem={deleteListItem}
                                        moveListItem={moveListItem}
                                        localData={localData}
                                        isCoreService={true}
                                    />
                                );
                            })}

                            {/* Company Pages - NEW */}
                            <h4 className="font-bold text-xl text-[var(--color-secondary)] mt-8 mb-4 border-b border-gray-700 pb-2">Company Information Pages</h4>
                            {localData.customPages?.map((customPage, index) => {
                                if (!companyPageIds.includes(customPage.id)) return null;
                                return (
                                    <CustomPageEditor
                                        key={customPage.id + index}
                                        customPage={customPage}
                                        index={index}
                                        handleListChange={handleListChange}
                                        handleNestedChange={handleNestedChange}
                                        addListItem={addListItem}
                                        deleteListItem={deleteListItem}
                                        moveListItem={moveListItem}
                                        localData={localData}
                                        isCoreService={true}
                                    />
                                );
                            })}

                            {/* Other Custom Pages */}
                            <h4 className="font-bold text-xl text-[var(--color-secondary)] mt-8 mb-4 border-b border-gray-700 pb-2">Other Custom Pages</h4>
                            {localData.customPages?.map((customPage, index) => {
                                if (coreServiceIds.includes(customPage.id) || companyPageIds.includes(customPage.id)) return null;
                                return (
                                    <CustomPageEditor
                                        key={customPage.id + index}
                                        customPage={customPage}
                                        index={index}
                                        handleListChange={handleListChange}
                                        handleNestedChange={handleNestedChange}
                                        addListItem={addListItem}
                                        deleteListItem={deleteListItem}
                                        moveListItem={moveListItem}
                                        localData={localData}
                                        isCoreService={false}
                                    />
                                );
                            })}

                            <button
                                onClick={() => addListItem('customPages', { id: '#new-page', title: 'New Custom Page', bannerSubtitle: '', contentBlocks: [{type: 'html', content: '<p>Start writing your content here.</p>'}], seo: { title: '', description: '', keywords: '' }, enabled: true })}
                                className="mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Add New Custom Page
                            </button>
                        </Section>

                        <Section title="Testimonials Page">
                            <PageIdDisplay id="#testimonials" label="Page ID" />
                            <AdminInput label="Page Title" name="pages.testimonials.pageBanner.title" value={localData.pages.testimonials.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <div className="mt-2">
                                <AdminTextarea label="Page Subtitle" name="pages.testimonials.pageBanner.subtitle" value={localData.pages.testimonials.pageBanner.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            </div>
                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Testimonials List</h4>
                            {localData.pages.testimonials.list.map((testimonial, index) => (
                                <div key={testimonial.name + index} className="mb-4 p-3 border border-gray-600 rounded-md">
                                    <div className="flex justify-between items-start mb-2">
                                        <ToggleSwitch label="Visible" enabled={testimonial.enabled} onChange={val => handleListChange('pages.testimonials.list', index, 'enabled', val)} />
                                        <button onClick={() => deleteListItem('pages.testimonials.list', index)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
                                    </div>
                                    <AdminInput label="Name" name={`name`} value={testimonial.name} onChange={e => handleListChange('pages.testimonials.list', index, e.target.name, e.target.value)} />
                                    <AdminInput label="Title/Role" name={`title`} value={testimonial.title} onChange={e => handleListChange('pages.testimonials.list', index, e.target.name, e.target.value)} className="mt-2" />
                                    <AdminInput label="Avatar Image URL" name={`avatar`} value={testimonial.avatar} onChange={e => handleListChange('pages.testimonials.list', index, e.target.name, e.target.value)} className="mt-2" />
                                    <AdminTextarea label="Quote" name={`quote`} value={testimonial.quote} onChange={e => handleListChange('pages.testimonials.list', index, e.target.name, e.target.value)} />
                                </div>
                            ))}
                            <button onClick={() => addListItem('pages.testimonials.list', { quote: '', name: '', title: '', avatar: '', enabled: true })} className="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded">Add Testimonial</button>
                        </Section>

                        <Section title="Visa Processing Page">
                            <PageIdDisplay id="#visa-processing" label="Page ID" />
                            <AdminInput label="Page Title" name="pages.visaProcessing.pageBanner.title" value={localData.pages.visaProcessing.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminTextarea label="Page Subtitle" name="pages.visaProcessing.pageBanner.subtitle" value={localData.pages.visaProcessing.pageBanner.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            
                            <div className="mt-6">
                                <label className="block text-lg font-bold text-[var(--color-secondary)] mb-2">Page Content / Description (HTML)</label>
                                <AdminTextarea label="" name="pages.visaProcessing.contentHtml" value={localData.pages.visaProcessing.contentHtml} onChange={e => handleNestedChange(e.target.name, e.target.value)} rows={8} />
                                <p className="text-xs text-[var(--color-muted-text)] mt-1">You can use HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt; etc. for formatting.</p>
                            </div>

                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">"What We Offer" Section</h4>
                            <AdminInput label="Offer Section Title" name="pages.visaProcessing.offerTitle" value={localData.pages.visaProcessing.offerTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            {localData.pages.visaProcessing.offerList.map((item, index) => (
                                <div key={index} className="mb-4 p-3 border border-gray-600 rounded-md mt-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <ToggleSwitch label="Visible" enabled={item.enabled} onChange={val => handleListChange('pages.visaProcessing.offerList', index, 'enabled', val)} />
                                        <button onClick={() => deleteListItem('pages.visaProcessing.offerList', index)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
                                    </div>
                                    <AdminInput label="Icon" name="icon" value={item.icon} onChange={e => handleListChange('pages.visaProcessing.offerList', index, e.target.name, e.target.value)} />
                                    <AdminInput label="Title" name="title" value={item.title} onChange={e => handleListChange('pages.visaProcessing.offerList', index, e.target.name, e.target.value)} className="mt-2" />
                                    <AdminTextarea label="Description" name="description" value={item.description} onChange={e => handleListChange('pages.visaProcessing.offerList', index, e.target.name, e.target.value)} className="mt-2" />
                                </div>
                            ))}
                            <button onClick={() => addListItem('pages.visaProcessing.offerList', { icon: 'Default', title: 'New Offer', description: '', enabled: true })} className="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded">Add Offer</button>

                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">"Our Process" Section</h4>
                            <AdminInput label="Process Section Title" name="pages.visaProcessing.processTitle" value={localData.pages.visaProcessing.processTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            {localData.pages.visaProcessing.processSteps.map((item, index) => (
                                <div key={index} className="mb-4 p-3 border border-gray-600 rounded-md mt-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <ToggleSwitch label="Visible" enabled={item.enabled} onChange={val => handleListChange('pages.visaProcessing.processSteps', index, 'enabled', val)} />
                                        <button onClick={() => deleteListItem('pages.visaProcessing.processSteps', index)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
                                    </div>
                                    <AdminInput label="Icon" name="icon" value={item.icon} onChange={e => handleListChange('pages.visaProcessing.processSteps', index, e.target.name, e.target.value)} />
                                    <AdminInput label="Title" name="title" value={item.title} onChange={e => handleListChange('pages.visaProcessing.processSteps', index, e.target.name, e.target.value)} className="mt-2" />
                                    <AdminTextarea label="Description" name="description" value={item.description} onChange={e => handleListChange('pages.visaProcessing.processSteps', index, e.target.name, e.target.value)} className="mt-2" />
                                </div>
                            ))}
                            <button onClick={() => addListItem('pages.visaProcessing.processSteps', { icon: 'Default', title: 'New Step', description: '', enabled: true })} className="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded">Add Step</button>

                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">"Why Choose Us" Section (Visa)</h4>
                            <AdminInput label="Section Title" name="pages.visaProcessing.whyChooseUsTitle" value={localData.pages.visaProcessing.whyChooseUsTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            {localData.pages.visaProcessing.whyChooseUsFeatures.map((item, index) => (
                                <div key={index} className="mb-4 p-3 border border-gray-600 rounded-md mt-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <ToggleSwitch label="Visible" enabled={item.enabled} onChange={val => handleListChange('pages.visaProcessing.whyChooseUsFeatures', index, 'enabled', val)} />
                                        <button onClick={() => deleteListItem('pages.visaProcessing.whyChooseUsFeatures', index)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
                                    </div>
                                    <AdminInput label="Icon" name="icon" value={item.icon} onChange={e => handleListChange('pages.visaProcessing.whyChooseUsFeatures', index, e.target.name, e.target.value)} />
                                    <AdminInput label="Title" name="title" value={item.title} onChange={e => handleListChange('pages.visaProcessing.whyChooseUsFeatures', index, e.target.name, e.target.value)} className="mt-2" />
                                    <AdminTextarea label="Description" name="description" value={item.description} onChange={e => handleListChange('pages.visaProcessing.whyChooseUsFeatures', index, e.target.name, e.target.value)} className="mt-2" />
                                </div>
                            ))}
                            <button onClick={() => addListItem('pages.visaProcessing.whyChooseUsFeatures', { icon: 'Default', title: 'New Feature', description: '', enabled: true })} className="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded">Add Feature</button>
                        </Section>

                        <Section title="Air Ticketing Page">
                            <PageIdDisplay id="#air-ticketing" label="Page ID" />
                            <AdminInput label="Page Title" name="pages.airTicketing.pageBanner.title" value={localData.pages.airTicketing.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminTextarea label="Page Subtitle" name="pages.airTicketing.pageBanner.subtitle" value={localData.pages.airTicketing.pageBanner.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            
                            <div className="mt-6">
                                <label className="block text-lg font-bold text-[var(--color-secondary)] mb-2">Page Content (HTML)</label>
                                <AdminTextarea label="" name="pages.airTicketing.contentHtml" value={localData.pages.airTicketing.contentHtml} onChange={e => handleNestedChange(e.target.name, e.target.value)} rows={8} />
                            </div>

                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Features List</h4>
                            {localData.pages.airTicketing.features.map((item, index) => (
                                <div key={index} className="mb-4 p-3 border border-gray-600 rounded-md mt-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <ToggleSwitch label="Visible" enabled={item.enabled} onChange={val => handleListChange('pages.airTicketing.features', index, 'enabled', val)} />
                                        <button onClick={() => deleteListItem('pages.airTicketing.features', index)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
                                    </div>
                                    <AdminInput label="Icon" name="icon" value={item.icon} onChange={e => handleListChange('pages.airTicketing.features', index, e.target.name, e.target.value)} />
                                    <AdminInput label="Title" name="title" value={item.title} onChange={e => handleListChange('pages.airTicketing.features', index, e.target.name, e.target.value)} className="mt-2" />
                                    <AdminTextarea label="Description" name="description" value={item.description} onChange={e => handleListChange('pages.airTicketing.features', index, e.target.name, e.target.value)} className="mt-2" />
                                </div>
                            ))}
                            <button onClick={() => addListItem('pages.airTicketing.features', { icon: 'Default', title: 'New Feature', description: '', enabled: true })} className="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded">Add Feature</button>

                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Inquiry Form</h4>
                            <AdminInput label="Form Title" name="pages.airTicketing.form.title" value={localData.pages.airTicketing.form.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminInput label="Form Subtitle" name="pages.airTicketing.form.subtitle" value={localData.pages.airTicketing.form.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminInput label="Button Text" name="pages.airTicketing.form.buttonText" value={localData.pages.airTicketing.form.buttonText} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminInput label="Google Apps Script URL" name="pages.airTicketing.googleAppsScriptUrl" value={localData.pages.airTicketing.googleAppsScriptUrl} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-4" placeholder="https://script.google.com/..." />
                        </Section>

                        <Section title="Team Page">
                            <PageIdDisplay id="#team" label="Page ID" />
                            <AdminInput label="Page Title" name="pages.team.pageBanner.title" value={localData.pages.team.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminTextarea label="Page Subtitle" name="pages.team.pageBanner.subtitle" value={localData.pages.team.pageBanner.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            
                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Chairman Section</h4>
                            <AdminInput label="Section Title" name="pages.team.chairmanTitle" value={localData.pages.team.chairmanTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <div className="p-4 border border-gray-600 rounded-md mt-2">
                                <ToggleSwitch label="Show Chairman" enabled={localData.pages.team.chairman.enabled} onChange={val => handleNestedChange('pages.team.chairman.enabled', val)} />
                                <AdminInput label="Name" name="pages.team.chairman.name" value={localData.pages.team.chairman.name} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                                <AdminInput label="Role" name="pages.team.chairman.role" value={localData.pages.team.chairman.role} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                                <AdminInput label="Title (Optional)" name="pages.team.chairman.title" value={localData.pages.team.chairman.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                                <AdminInput label="Image URL" name="pages.team.chairman.imageUrl" value={localData.pages.team.chairman.imageUrl} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                                <AdminInput label="Phone" name="pages.team.chairman.socials.phone" value={localData.pages.team.chairman.socials?.phone} onChange={e => handleNestedChange('pages.team.chairman.socials.phone', e.target.value)} className="mt-2" />
                                <AdminInput label="Email" name="pages.team.chairman.socials.email" value={localData.pages.team.chairman.socials?.email} onChange={e => handleNestedChange('pages.team.chairman.socials.email', e.target.value)} className="mt-2" />
                            </div>

                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Employees Section</h4>
                            <AdminInput label="Section Title" name="pages.team.employeesTitle" value={localData.pages.team.employeesTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminTextarea label="Section Subtitle" name="pages.team.employeesSubtitle" value={localData.pages.team.employeesSubtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            
                            {localData.pages.team.talentedEmployees.map((member, index) => (
                                <div key={index} className="mb-4 p-3 border border-gray-600 rounded-md mt-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <ToggleSwitch label="Visible" enabled={member.enabled} onChange={val => handleListChange('pages.team.talentedEmployees', index, 'enabled', val)} />
                                        <button onClick={() => deleteListItem('pages.team.talentedEmployees', index)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
                                    </div>
                                    <AdminInput label="Name" name="name" value={member.name} onChange={e => handleListChange('pages.team.talentedEmployees', index, e.target.name, e.target.value)} />
                                    <AdminInput label="Role" name="role" value={member.role} onChange={e => handleListChange('pages.team.talentedEmployees', index, e.target.name, e.target.value)} className="mt-2" />
                                    <AdminInput label="Image URL" name="imageUrl" value={member.imageUrl} onChange={e => handleListChange('pages.team.talentedEmployees', index, e.target.name, e.target.value)} className="mt-2" />
                                    <AdminInput label="Phone" name="phone" value={member.socials?.phone} onChange={e => handleListChange('pages.team.talentedEmployees', index, 'socials.phone', e.target.value)} className="mt-2" />
                                    <AdminInput label="Email" name="email" value={member.socials?.email} onChange={e => handleListChange('pages.team.talentedEmployees', index, 'socials.email', e.target.value)} className="mt-2" />
                                </div>
                            ))}
                            <button onClick={() => addListItem('pages.team.talentedEmployees', { name: 'New Member', role: 'Role', imageUrl: '', enabled: true, socials: {} })} className="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded">Add Employee</button>
                        </Section>

                        <Section title="Contact Page">
                            <PageIdDisplay id="#contact" label="Page ID" />
                            <AdminInput label="Page Title" name="pages.contact.pageBanner.title" value={localData.pages.contact.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminTextarea label="Page Subtitle" name="pages.contact.pageBanner.subtitle" value={localData.pages.contact.pageBanner.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            
                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Info Section</h4>
                            <AdminInput label="Info Title" name="pages.contact.infoTitle" value={localData.pages.contact.infoTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminTextarea label="Info Subtitle" name="pages.contact.infoSubtitle" value={localData.pages.contact.infoSubtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            
                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Contact Details</h4>
                            {localData.pages.contact.contactInfo.map((info, index) => (
                                <div key={index} className="mb-4 p-3 border border-gray-600 rounded-md mt-2">
                                    <AdminInput label="Label" name="label" value={info.label} onChange={e => handleListChange('pages.contact.contactInfo', index, e.target.name, e.target.value)} />
                                    <AdminInput label="Value" name="value" value={info.value} onChange={e => handleListChange('pages.contact.contactInfo', index, e.target.name, e.target.value)} className="mt-2" />
                                    <AdminTextarea label="Icon (SVG)" name="icon" value={info.icon} onChange={e => handleListChange('pages.contact.contactInfo', index, e.target.name, e.target.value)} className="mt-2" />
                                </div>
                            ))}

                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Form Section</h4>
                            <AdminInput label="Form Title" name="pages.contact.formTitle" value={localData.pages.contact.formTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminInput label="Button Text" name="pages.contact.formButtonText" value={localData.pages.contact.formButtonText} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminInput label="Google Apps Script URL" name="pages.contact.googleAppsScriptUrl" value={localData.pages.contact.googleAppsScriptUrl} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-4" placeholder="https://script.google.com/..." />
                            
                            <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Map & Accreditations</h4>
                            <AdminInput label="Map Image URL" name="pages.contact.mapUrl" value={localData.pages.contact.mapUrl} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminInput label="Accreditations Title" name="pages.contact.accreditationsTitle" value={localData.pages.contact.accreditationsTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-4" />
                            <AdminInput label="Accreditations Image URL" name="pages.contact.accreditationsImage" value={localData.pages.contact.accreditationsImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                        </Section>

                        {/* --- NEW: Application Tracker Management --- */}
                        <Section title="Application Tracker Management">
                            <p className="text-[var(--color-muted-text)] mb-6">Manage client applications for the "Check Status" feature. Add passport numbers and update processing steps.</p>
                            
                            <div className="space-y-6">
                                {localData.applications?.map((app, appIndex) => (
                                    <div key={app.id} className="p-6 bg-[var(--color-dark-bg)] border border-gray-600 rounded-lg">
                                        <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-2">
                                            <div>
                                                <h4 className="text-xl font-bold text-white">{app.passportNumber}</h4>
                                                <span className="text-sm text-[var(--color-secondary)] uppercase">{app.serviceType}</span>
                                            </div>
                                            <button 
                                                onClick={() => deleteListItem('applications', appIndex)} 
                                                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Delete Application
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <AdminInput 
                                                label="Passport Number" 
                                                name="passportNumber" 
                                                value={app.passportNumber} 
                                                onChange={e => handleListChange('applications', appIndex, 'passportNumber', e.target.value.toUpperCase())} 
                                            />
                                            <AdminInput 
                                                label="Service Type" 
                                                name="serviceType" 
                                                value={app.serviceType} 
                                                onChange={e => handleListChange('applications', appIndex, 'serviceType', e.target.value)} 
                                            />
                                        </div>

                                        <h5 className="font-bold text-lg text-[var(--color-light-text)] mb-2">Tracking Steps</h5>
                                        <div className="space-y-3 pl-4 border-l-2 border-gray-700">
                                            {app.steps.map((step, stepIndex) => (
                                                <div key={stepIndex} className="bg-[var(--color-light-bg)] p-3 rounded border border-gray-600">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-bold text-gray-400 uppercase">Step {stepIndex + 1}</span>
                                                        <button 
                                                            onClick={() => deleteListItem(`applications.${appIndex}.steps`, stepIndex)} 
                                                            className="text-red-400 hover:text-red-300 text-xs underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                                                        <AdminInput 
                                                            label="Label" 
                                                            name="label" 
                                                            value={step.label} 
                                                            onChange={e => handleListChange(`applications.${appIndex}.steps`, stepIndex, 'label', e.target.value)} 
                                                        />
                                                        <AdminInput 
                                                            label="Date (Optional)" 
                                                            name="date" 
                                                            value={step.date} 
                                                            onChange={e => handleListChange(`applications.${appIndex}.steps`, stepIndex, 'date', e.target.value)} 
                                                        />
                                                    </div>
                                                    <div className="flex gap-6 mt-2">
                                                        <ToggleSwitch 
                                                            label="Completed" 
                                                            enabled={step.completed} 
                                                            onChange={(val) => handleListChange(`applications.${appIndex}.steps`, stepIndex, 'completed', val)} 
                                                        />
                                                        <ToggleSwitch 
                                                            label="Current Stage" 
                                                            enabled={step.current} 
                                                            onChange={(val) => handleListChange(`applications.${appIndex}.steps`, stepIndex, 'current', val)} 
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={() => addListItem(`applications.${appIndex}.steps`, { label: 'New Step', completed: false, current: false, date: '' })} 
                                                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                            >
                                                + Add Step
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button 
                                    onClick={() => addListItem('applications', { 
                                        id: Date.now().toString(), 
                                        passportNumber: '', 
                                        serviceType: 'Umrah Visa', 
                                        steps: [
                                            { label: 'Application Received', completed: true, current: false, date: new Date().toLocaleDateString() },
                                            { label: 'Processing', completed: false, current: true, date: '' },
                                            { label: 'Completed', completed: false, current: false, date: '' }
                                        ] 
                                    })} 
                                    className="w-full py-3 border-2 border-dashed border-gray-500 text-gray-400 rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors font-bold"
                                >
                                    + Create New Application Tracker
                                </button>
                            </div>
                        </Section>
                    </>
                )}

                {/* Save Button */}
                <div className="fixed bottom-6 right-6 z-[60] md:static md:mt-12 md:flex md:justify-end">
                    <div className="flex gap-4">
                        <button
                            onClick={handleReset}
                            className="bg-red-600 text-white font-bold py-3 px-6 rounded-[var(--ui-button-radius)] shadow-lg hover:bg-red-700 transition-all duration-300"
                        >
                            Reset to Default
                        </button>
                        <button
                            onClick={saveChanges}
                            disabled={isSaving}
                            className="bg-[var(--color-primary)] text-white font-bold py-3 px-8 rounded-[var(--ui-button-radius)] shadow-lg hover:bg-[var(--color-primary-dark)] transition-all duration-300 disabled:bg-gray-500"
                        >
                            {isSaving ? 'Saving...' : 'Save All Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;

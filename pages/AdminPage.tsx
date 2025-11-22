
import React, { useState, useContext, useMemo } from 'react';
import PageBanner from '../components/PageBanner';
import { DataContext } from '../contexts/DataContext';
import { defaultData, AppData, ExclusivePackage } from '../data';
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
    const [activeZiyaratCityTab, setActiveZiyaratCityTab] = useState<'makkah' | 'madinah'>('makkah');
    const [legacyCategoryFilter, setLegacyCategoryFilter] = useState('All');
    const [isSaving, setIsSaving] = useState(false);

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

        if (!mergedData.pages.home.interactiveMap) {
             mergedData.pages.home.interactiveMap = JSON.parse(JSON.stringify(defaultData.pages.home.interactiveMap));
        }

        // Ensure Ziyarat Data Exists
        if (!mergedData.pages.ziyarat) {
            mergedData.pages.ziyarat = JSON.parse(JSON.stringify(defaultData.pages.ziyarat));
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


    return (
        <div className="pt-20">
            <PageBanner
                title="Admin Panel"
                subtitle="Manage your website content here. Click 'Save All Changes' at the bottom to apply your updates."
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* --- NEW GENERAL SETTINGS SECTION --- */}
                <Section title="General & Advanced Settings (Control Everything)">
                    {/* ... (General settings content same as before) ... */}
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
                    </div>
                </Section>

                {/* --- NEW: Marketing Popup --- */}
                <Section title="Marketing & Promotional Popup">
                    {/* ... (Marketing popup content same as before) ... */}
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

                {/* --- SPECIALTY SERVICES & ZIYARAT SECTION --- */}
                <Section title="Specialty Services (Ziyarat, Hotels, Training)">
                    <p className="text-[var(--color-muted-text)] mb-6">Manage content for Historical Ziyarat Tours, Luxury Hotels, and Pilgrim Training.</p>
                    
                    {/* Ziyarat Manager */}
                    <div className="mb-12 border-b border-gray-700 pb-12">
                        <h4 className="font-bold text-2xl text-[var(--color-primary)] mb-4">Historical Ziyarat Tours</h4>
                        <PageIdDisplay id="#ziyarat-tours" label="Page ID" />
                        <SeoEditor pageName="Ziyarat Page SEO" seoPath="pages.ziyarat.seo" localData={localData} onChange={handleNestedChange} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 border border-gray-700 rounded-lg bg-[var(--color-dark-bg)]">
                            <AdminInput label="Hero Title" name="pages.ziyarat.heroTitle" value={localData.pages.ziyarat?.heroTitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminInput label="Hero Subtitle" name="pages.ziyarat.heroSubtitle" value={localData.pages.ziyarat?.heroSubtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminInput label="Hero Image" name="pages.ziyarat.heroImage" value={localData.pages.ziyarat?.heroImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                            <AdminTextarea label="Intro Quote" name="pages.ziyarat.introQuote" value={localData.pages.ziyarat?.introQuote} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                        </div>

                        <h5 className="font-bold text-lg text-white mt-8 mb-4">Ziyarat Sites Management</h5>
                        <div className="flex space-x-4 mb-6">
                            <button
                                className={`px-4 py-2 rounded-md font-bold ${activeZiyaratCityTab === 'makkah' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-700 text-gray-300'}`}
                                onClick={() => setActiveZiyaratCityTab('makkah')}
                            >
                                Makkah Sites
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md font-bold ${activeZiyaratCityTab === 'madinah' ? 'bg-[var(--color-secondary)] text-[var(--color-dark-bg)]' : 'bg-gray-700 text-gray-300'}`}
                                onClick={() => setActiveZiyaratCityTab('madinah')}
                            >
                                Madinah Sites
                            </button>
                        </div>

                        {localData.pages.ziyarat?.sites[activeZiyaratCityTab]?.map((site, index) => (
                            <div key={index} className="mb-4 p-4 border border-gray-600 rounded-md bg-[var(--color-dark-bg)]">
                                <div className="flex justify-between items-center mb-2">
                                    <h6 className="font-bold text-white">{site.title || `Site ${index + 1}`}</h6>
                                    <button onClick={() => deleteListItem(`pages.ziyarat.sites.${activeZiyaratCityTab}`, index)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <AdminInput label="Title" name="title" value={site.title} onChange={e => handleListChange(`pages.ziyarat.sites.${activeZiyaratCityTab}`, index, 'title', e.target.value)} />
                                    <AdminInput label="Subtitle" name="subtitle" value={site.subtitle} onChange={e => handleListChange(`pages.ziyarat.sites.${activeZiyaratCityTab}`, index, 'subtitle', e.target.value)} />
                                    <AdminInput label="Image URL" name="img" value={site.img} onChange={e => handleListChange(`pages.ziyarat.sites.${activeZiyaratCityTab}`, index, 'img', e.target.value)} />
                                    <AdminInput label="Significance Tag" name="significance" value={site.significance} onChange={e => handleListChange(`pages.ziyarat.sites.${activeZiyaratCityTab}`, index, 'significance', e.target.value)} />
                                    <div className="md:col-span-2">
                                        <AdminTextarea label="Description" name="desc" value={site.desc} onChange={e => handleListChange(`pages.ziyarat.sites.${activeZiyaratCityTab}`, index, 'desc', e.target.value)} rows={3} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button 
                            onClick={() => addListItem(`pages.ziyarat.sites.${activeZiyaratCityTab}`, { title: 'New Site', subtitle: '', desc: '', img: '', significance: '' })} 
                            className="bg-green-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Add New {activeZiyaratCityTab === 'makkah' ? 'Makkah' : 'Madinah'} Site
                        </button>
                    </div>

                    {/* Luxury Hotels & Pilgrim Training (Using Custom Page Logic) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Luxury Hotels */}
                        {localData.customPages?.map((customPage, index) => {
                            if (customPage.id !== '#hotel-booking') return null;
                            return (
                                <div key={index}>
                                    <h4 className="font-bold text-xl text-[var(--color-secondary)] mb-4">Luxury Hotels & Tours</h4>
                                    <PageIdDisplay id="#hotel-booking" label="Page ID" />
                                    <CustomPageEditor
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
                                </div>
                            );
                        })}

                        {/* Pilgrim Training */}
                        {localData.customPages?.map((customPage, index) => {
                            if (customPage.id !== '#umrah-training') return null;
                            return (
                                <div key={index}>
                                    <h4 className="font-bold text-xl text-[var(--color-secondary)] mb-4">Pilgrim Training</h4>
                                    <PageIdDisplay id="#umrah-training" label="Page ID" />
                                    <CustomPageEditor
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
                                </div>
                            );
                        })}
                    </div>
                </Section>

                <Section title="Exclusive Packages Management">
                    <p className="text-[var(--color-muted-text)] mb-6">Manage the new, categorized Hajj and Umrah packages that appear on the dedicated pages.</p>
                    <div className="flex space-x-4 mb-6">
                        <button
                            className={`px-4 py-2 rounded-md font-bold ${activeExclusiveTab === 'hajj' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-700 text-gray-300'}`}
                            onClick={() => setActiveExclusiveTab('hajj')}
                        >
                            Exclusive Hajj Packages
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md font-bold ${activeExclusiveTab === 'umrah' ? 'bg-[var(--color-secondary)] text-[var(--color-dark-bg)]' : 'bg-gray-700 text-gray-300'}`}
                            onClick={() => setActiveExclusiveTab('umrah')}
                        >
                            Exclusive Umrah Packages
                        </button>
                    </div>

                    {activeExclusiveTab === 'hajj' && (
                        <div>
                            <PageIdDisplay id="#exclusive-hajj" label="Page ID" />
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
                            <PageIdDisplay id="#exclusive-umrah" label="Page ID" />
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

                {/* --- Hajj & Umrah Details (Old) --- */}
                <Section title="Hajj & Umrah Details (About Hajj/Umrah)">
                    <h4 className="font-bold text-xl mb-4 text-[var(--color-secondary)]">About Hajj Page</h4>
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

                    <h4 className="font-bold text-xl mt-8 mb-4 text-[var(--color-secondary)]">About Umrah Page</h4>
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

                <Section title="Legacy Packages (All Packages - Old)">
                    <div className="flex space-x-4 mb-6">
                        <button
                            className={`px-4 py-2 rounded-md font-bold ${activePackageTab === 'hajj' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-700 text-gray-300'}`}
                            onClick={() => handlePackageTabChange('hajj')}
                        >
                            All Hajj Packages (Old)
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md font-bold ${activePackageTab === 'umrah' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-700 text-gray-300'}`}
                            onClick={() => handlePackageTabChange('umrah')}
                        >
                            All Umrah Packages (Old)
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

                {/* ... (Rest of sections: Header, Footer, Company Pages etc. remain same) ... */}
                {/* --- Interactive Map Management --- */}
                <Section title="Interactive Map Management">
                    {/* ... (Interactive Map content same as before) ... */}
                    <div className="p-4 border border-gray-700 rounded-lg">
                        <div className="mb-4">
                            <ToggleSwitch 
                                label="Enable Interactive Map Section" 
                                enabled={localData.pages.home.interactiveMap?.enabled ?? true} 
                                onChange={(val) => handleNestedChange('pages.home.interactiveMap.enabled', val)} 
                            />
                        </div>
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

                {/* Company Pages (About Us, Privacy) */}
                <Section title="Company Information Pages">
                    {/* ... (Company Pages Logic) ... */}
                    <h4 className="font-bold text-xl text-[var(--color-secondary)] mt-2 mb-4 border-b border-gray-700 pb-2">Pages</h4>
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
                </Section>

                {/* ... (Theme Customization, Homepage, etc) ... */}
                <Section title="Theme Customization">
                    {/* ... (Theme content same as before) ... */}
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

                
                <div className="mt-12 text-center border-t border-gray-700 pt-8">
                    <button
                        onClick={saveChanges}
                        disabled={isSaving}
                        className="bg-[var(--color-secondary)] text-[var(--color-dark-bg)] font-bold py-4 px-10 rounded-[var(--ui-button-radius)] hover:bg-amber-600 transition-all duration-300 text-xl shadow-lg transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving Changes...' : 'Save All Changes'}
                    </button>
                    <p className="mt-4 text-sm text-[var(--color-muted-text)]">
                         Changes are saved to the database immediately but might take a refresh to appear on the live site depending on caching.
                    </p>
                    <div className="mt-8">
                        <button
                            onClick={handleReset}
                            className="text-red-500 hover:text-red-400 underline text-sm"
                        >
                            Reset to Default Content
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;

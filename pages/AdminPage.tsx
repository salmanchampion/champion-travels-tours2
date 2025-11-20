




import React, { useState, useContext } from 'react';
import PageBanner from '../components/PageBanner';
import { DataContext } from '../contexts/DataContext';
import { defaultData, AppData, ExclusivePackage } from '../data';
import { AdminInput, AdminTextarea, ToggleSwitch, Section } from '../components/admin/AdminUI';
import { SeoEditor, PackageEditor, ExpertGuideEditor, CustomPageEditor, BlogEditor } from '../components/admin/AdminEditors';


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
    const [activeExclusiveTab, setActiveExclusiveTab] = useState<'hajj' | 'umrah'>('hajj');
    const [isSaving, setIsSaving] = useState(false);

    const coreServiceIds = ['#hotel-booking', '#ziyarat-tours', '#umrah-training'];
    const companyPageIds = ['#about-us', '#privacy-policy'];

    // Sync local state if appData from context changes
    React.useEffect(() => {
        const mergedData = JSON.parse(JSON.stringify(appData));
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
        
        if (!mergedData.pages.home.sections.islamicTools) {
             mergedData.pages.home.sections.islamicTools = JSON.parse(JSON.stringify(defaultData.pages.home.sections.islamicTools));
        }
        // Add specific checks for nested tools props if they are missing in existing db data
        if (!mergedData.pages.home.sections.islamicTools.zakat) mergedData.pages.home.sections.islamicTools.zakat = { enabled: true, googleSheetUrl: '' };
        if (!mergedData.pages.home.sections.islamicTools.tasbeeh) mergedData.pages.home.sections.islamicTools.tasbeeh = { enabled: true };
        if (!mergedData.pages.home.sections.islamicTools.currency) mergedData.pages.home.sections.islamicTools.currency = { enabled: true };

        // Ensure footer newsletter exists
        if (!mergedData.footer.newsletter) {
             mergedData.footer.newsletter = JSON.parse(JSON.stringify(defaultData.footer.newsletter));
        }

        setLocalData(mergedData);
    }, [appData]);

    const updateNestedState = (prevState: AppData, path: string, valueOrUpdater: any): AppData => {
        const keys = path.split('.');
        const newState = JSON.parse(JSON.stringify(prevState));
        let currentLevel = newState;

        for (let i = 0; i < keys.length - 1; i++) {
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

    const phoneIndex = localData.header.contactInfo?.findIndex(c => c.label === 'Phone');
    const emailIndex = localData.header.contactInfo?.findIndex(c => c.label === 'Email');


    return (
        <div className="pt-20">
            <PageBanner
                title="Admin Panel"
                subtitle="Manage your website content here. Click 'Save All Changes' at the bottom to apply your updates."
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
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

                <Section title="Legacy Packages (Old Layout)">
                    <div className="flex space-x-4 mb-6">
                        <button
                            className={`px-4 py-2 rounded-md font-bold ${activePackageTab === 'hajj' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-700 text-gray-300'}`}
                            onClick={() => setActivePackageTab('hajj')}
                        >
                            Hajj Packages
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md font-bold ${activePackageTab === 'umrah' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-700 text-gray-300'}`}
                            onClick={() => setActivePackageTab('umrah')}
                        >
                            Umrah Packages
                        </button>
                    </div>

                    {activePackageTab === 'hajj' && (
                        <div>
                            {localData.hajjPackages.map((pkg, index) => (
                                <PackageEditor 
                                    key={index} 
                                    pkg={pkg} 
                                    index={index} 
                                    packageType="hajj" 
                                    onChange={handleListChange} 
                                    onDelete={deleteListItem} 
                                />
                            ))}
                            <button onClick={() => addListItem('hajjPackages', { name: 'New Hajj Package', price: '', enabled: true })} className="bg-green-600 text-white font-bold py-2 px-4 rounded">Add Hajj Package</button>
                        </div>
                    )}

                    {activePackageTab === 'umrah' && (
                         <div>
                            {localData.umrahPackages.map((pkg, index) => (
                                <PackageEditor 
                                    key={index} 
                                    pkg={pkg} 
                                    index={index} 
                                    packageType="umrah" 
                                    onChange={handleListChange} 
                                    onDelete={deleteListItem} 
                                />
                            ))}
                            <button onClick={() => addListItem('umrahPackages', { name: 'New Umrah Package', price: '', enabled: true })} className="bg-green-600 text-white font-bold py-2 px-4 rounded">Add Umrah Package</button>
                        </div>
                    )}
                </Section>

                <Section title="Hajj Guide (Bangla)">
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
                    <ExpertGuideEditor pageKey="whyChooseUs" localData={localData} handleNestedChange={handleNestedChange} />
                </Section>

                <Section title="Expert Hajj Guides">
                    <ExpertGuideEditor pageKey="expertHajjGuides" localData={localData} handleNestedChange={handleNestedChange} />
                </Section>
                
                <Section title="Service Details & Custom Pages">
                    <p className="text-[var(--color-muted-text)] mb-4">Manage content for <strong>Hotel Booking, Ziyarat Tours, Umrah Training, About Us, Privacy Policy</strong>, and other custom pages.</p>
                    
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

                    <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Inquiry Form Settings</h4>
                    <AdminInput label="Form Title" name="pages.visaProcessing.form.title" value={localData.pages.visaProcessing.form.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                    <AdminTextarea label="Form Subtitle" name="pages.visaProcessing.form.subtitle" value={localData.pages.visaProcessing.form.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                    <AdminInput label="Button Text" name="pages.visaProcessing.form.buttonText" value={localData.pages.visaProcessing.form.buttonText} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                    <AdminInput label="Google Apps Script URL" name="pages.visaProcessing.googleAppsScriptUrl" value={localData.pages.visaProcessing.googleAppsScriptUrl} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" placeholder="https://script.google.com/..." />
                </Section>
                
                <Section title="Air Ticketing Page">
                     <AdminInput label="Page Title" name="pages.airTicketing.pageBanner.title" value={localData.pages.airTicketing.pageBanner.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                    <AdminTextarea label="Page Subtitle" name="pages.airTicketing.pageBanner.subtitle" value={localData.pages.airTicketing.pageBanner.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                    <div className="mt-6">
                        <label className="block text-lg font-bold text-[var(--color-secondary)] mb-2">Page Content (HTML)</label>
                        <AdminTextarea label="" name="pages.airTicketing.contentHtml" value={localData.pages.airTicketing.contentHtml} onChange={e => handleNestedChange(e.target.name, e.target.value)} rows={8} />
                    </div>
                    
                     <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Features</h4>
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

                     <h4 className="font-bold text-xl mt-6 mb-2 text-[var(--color-secondary)]">Form Settings</h4>
                    <AdminInput label="Form Title" name="pages.airTicketing.form.title" value={localData.pages.airTicketing.form.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                    <AdminTextarea label="Form Subtitle" name="pages.airTicketing.form.subtitle" value={localData.pages.airTicketing.form.subtitle} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                    <AdminInput label="Button Text" name="pages.airTicketing.form.buttonText" value={localData.pages.airTicketing.form.buttonText} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                    <AdminInput label="Google Apps Script URL" name="pages.airTicketing.googleAppsScriptUrl" value={localData.pages.airTicketing.googleAppsScriptUrl} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
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

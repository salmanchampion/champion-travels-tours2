
import React from 'react';
import { AppData, CustomPage, HajjPackage, UmrahPackage, BlogPost } from '../../data';
import { AdminInput, AdminTextarea, ToggleSwitch } from './AdminUI';

export const SeoEditor: React.FC<{ pageName: string; seoPath: string; localData: AppData; onChange: (path: string, value: any) => void; }> = ({ pageName, seoPath, localData, onChange }) => {
    const getSeoData = () => {
        const keys = seoPath.split('.');
        let data: any = localData;
        for (const key of keys) {
            if (data[key] === undefined) return { title: '', description: '', keywords: '' };
            data = data[key];
        }
        return data;
    }
    const seoData = getSeoData();

    return (
        <div className="mt-6 p-4 border border-gray-700 rounded-lg">
            <h4 className="font-bold text-xl mb-2 text-[var(--color-secondary)]">{pageName}</h4>
            <AdminInput label="Meta Title" name={`${seoPath}.title`} value={seoData.title} onChange={e => onChange(e.target.name, e.target.value)} />
            <div className="mt-2">
            <AdminTextarea label="Meta Description" name={`${seoPath}.description`} value={seoData.description} onChange={e => onChange(e.target.name, e.target.value)} />
            </div>
            <div className="mt-2">
            <AdminInput label="Meta Keywords (comma-separated)" name={`${seoPath}.keywords`} value={seoData.keywords} onChange={e => onChange(e.target.name, e.target.value)} />
            </div>
        </div>
    );
};

const packageFieldLabels: { [key: string]: string } = {
    name: 'Name',
    price: 'Price',
    duration: 'Duration',
    category: 'Category',
    shortDescription: 'Short Description',
    date: 'Date/Duration',
    hotelMakkah: 'Hotel Makkah',
    hotelMadinah: 'Hotel Madinah',
    flightsUp: 'Flights Up',
    flightsDown: 'Flights Down',
    food: 'Food',
    special: 'Special Services',
    note: 'Note',
    image: 'Image URL',
    buttonText: 'Button Text',
};

export const PackageEditor: React.FC<{
    pkg: HajjPackage | UmrahPackage;
    index: number;
    packageType: 'hajj' | 'umrah';
    onChange: (path: string, index: number, field: string, value: any) => void;
    onDelete: (path: string, index: number) => void;
}> = ({ pkg, index, packageType, onChange, onDelete }) => {
    const path = packageType === 'hajj' ? 'hajjPackages' : 'umrahPackages';

    return (
        <div className="mb-6 p-4 border border-gray-700 rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-xl text-[var(--color-secondary)]">{pkg.name || `Package ${index + 1}`}</h4>
                <div className="flex items-center gap-4">
                    <ToggleSwitch 
                        label="Visible" 
                        enabled={pkg.enabled} 
                        onChange={(enabled) => onChange(path, index, 'enabled', enabled)} 
                    />
                    <button onClick={() => onDelete(path, index)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(pkg).map(key => {
                    if (key === 'enabled') return null; // We handle this with the toggle switch
                    
                    const label = packageFieldLabels[key] || key;
                    const value = (pkg as any)[key];
                    
                    if (key === 'note' || key === 'shortDescription') {
                        return (
                           <div key={key} className="md:col-span-2 lg:col-span-3">
                                <AdminTextarea
                                    label={label}
                                    name={key}
                                    value={value}
                                    onChange={e => onChange(path, index, e.target.name, e.target.value)}
                                />
                           </div>
                        );
                    }
                    
                    if (key in packageFieldLabels) {
                        return (
                            <AdminInput
                                key={key}
                                label={label}
                                name={key}
                                value={value}
                                onChange={e => onChange(path, index, e.target.name, e.target.value)}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export const ExpertGuideEditor: React.FC<{
    pageKey: 'whyChooseUs' | 'expertHajjGuides';
    localData: AppData;
    handleNestedChange: (path: string, value: any) => void;
}> = ({ pageKey, localData, handleNestedChange }) => {
    const data = localData.pages[pageKey];
    const path = `pages.${pageKey}`;

    return (
        <div className="space-y-6">
            <AdminInput label="Background Image URL" name={`${path}.backgroundImage`} value={data.backgroundImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} />

            <div className="p-4 border border-gray-600 rounded-md">
                <h4 className="font-bold text-lg text-[var(--color-secondary)] mb-2">Guides Section</h4>
                <AdminInput label="Tagline" name={`${path}.guides.tagline`} value={data.guides.tagline} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                <AdminInput label="Title" name={`${path}.guides.title`} value={data.guides.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                <AdminTextarea label="Description" name={`${path}.guides.description`} value={data.guides.description} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                <AdminInput label="Subheading" name={`${path}.guides.subheading`} value={data.guides.subheading} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                <AdminTextarea label="Sub-description" name={`${path}.guides.subDescription`} value={data.guides.subDescription} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                <AdminInput label="Button Text" name={`${path}.guides.buttonText`} value={data.guides.buttonText} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                <AdminInput label="Main Image URL" name={`${path}.guides.mainImage`} value={data.guides.mainImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                <AdminInput label="Secondary Image URL" name={`${path}.guides.secondaryImage`} value={data.guides.secondaryImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
            </div>

            <div className="p-4 border border-gray-600 rounded-md">
                <h4 className="font-bold text-lg text-[var(--color-secondary)] mb-2">Board of Directors Section</h4>
                <AdminInput label="Title" name={`${path}.directors.title`} value={data.directors.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                <AdminTextarea label="Description" name={`${path}.directors.description`} value={data.directors.description} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                <AdminInput label="Button Text" name={`${path}.directors.buttonText`} value={data.directors.buttonText} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                <AdminInput label="Main Image URL" name={`${path}.directors.mainImage`} value={data.directors.mainImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                <AdminInput label="Secondary Image 1 URL" name={`${path}.directors.secondaryImage1`} value={data.directors.secondaryImage1} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                <AdminInput label="Secondary Image 2 URL" name={`${path}.directors.secondaryImage2`} value={data.directors.secondaryImage2} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                <AdminInput label="Decorative Image URL" name={`${path}.directors.decorativeImage`} value={data.directors.decorativeImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
            </div>
            
            <div className="p-4 border border-gray-600 rounded-md">
                <h4 className="font-bold text-lg text-[var(--color-secondary)] mb-2">Services Offer Section</h4>
                 <AdminInput label="Title" name={`${path}.services.title`} value={data.services.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                 <AdminTextarea label="Services List (one per line)" name={`${path}.services.list`} value={Array.isArray(data.services.list) ? data.services.list.join('\n') : ''} onChange={e => handleNestedChange(e.target.name, e.target.value.split('\n'))} />
                 <AdminInput label="Button Text" name={`${path}.services.buttonText`} value={data.services.buttonText} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                 <AdminInput label="Image URL" name={`${path}.services.image`} value={data.services.image} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
            </div>

            <div className="p-4 border border-gray-600 rounded-md">
                <h4 className="font-bold text-lg text-[var(--color-secondary)] mb-2">Final CTA Section</h4>
                <AdminInput label="Title" name={`${path}.cta.title`} value={data.cta.title} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
                <AdminInput label="Button Text" name={`${path}.cta.buttonText`} value={data.cta.buttonText} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
                <AdminInput label="Image URL" name={`${path}.cta.image`} value={data.cta.image} onChange={e => handleNestedChange(e.target.name, e.target.value)} className="mt-2" />
            </div>
            
            <AdminInput label="Footer Silhouette Image URL" name={`${path}.footerImage`} value={data.footerImage} onChange={e => handleNestedChange(e.target.name, e.target.value)} />
        </div>
    );
};

export const CustomPageEditor: React.FC<{
    customPage: CustomPage;
    index: number;
    handleListChange: (path: string, index: number, field: string, value: any) => void;
    handleNestedChange: (path: string, value: any) => void;
    addListItem: (path: string, newItem: any) => void;
    deleteListItem: (path: string, index: number) => void;
    moveListItem: (path: string, fromIndex: number, toIndex: number) => void;
    localData: AppData;
    isCoreService?: boolean;
}> = ({ customPage, index, handleListChange, handleNestedChange, addListItem, deleteListItem, moveListItem, localData, isCoreService }) => (
    <div className={`mb-6 p-4 border rounded-md ${isCoreService ? 'border-[var(--color-primary)] bg-[var(--color-light-bg)] shadow-lg' : 'border-gray-700'}`}>
        <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-xl text-[var(--color-secondary)]">
                {customPage.title || `Custom Page ${index + 1}`}
                {isCoreService && <span className="ml-3 text-xs bg-[var(--color-primary)] text-white px-2 py-1 rounded uppercase tracking-wide">Core Service Page</span>}
            </h4>
            <div className="flex items-center gap-4">
                <ToggleSwitch
                    label="Visible"
                    enabled={customPage.enabled}
                    onChange={(enabled) => handleListChange('customPages', index, 'enabled', enabled)}
                />
                {!isCoreService && (
                    <button onClick={() => deleteListItem('customPages', index)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                )}
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
                label="Page ID / URL (e.g., #about-us)"
                name="id"
                value={customPage.id}
                onChange={e => handleListChange('customPages', index, e.target.name, e.target.value)}
                // Core service IDs should not be changed easily to avoid breaking links
                type={isCoreService ? 'hidden' : 'text'} 
            />
            {isCoreService && (
                <div className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">
                    Page ID: <span className="text-[var(--color-primary)] font-mono">{customPage.id}</span> (Fixed)
                </div>
            )}
            <AdminInput
                label="Page Title"
                name="title"
                value={customPage.title}
                onChange={e => handleListChange('customPages', index, e.target.name, e.target.value)}
            />
        </div>
        <div className="mt-4">
            <AdminInput
                label="Banner Subtitle"
                name="bannerSubtitle"
                value={customPage.bannerSubtitle}
                onChange={e => handleListChange('customPages', index, e.target.name, e.target.value)}
            />
        </div>
            <div className="mt-4">
            <h5 className="font-semibold text-lg text-white mb-2">Page Content Blocks</h5>
            <div className="space-y-4">
                {customPage.contentBlocks?.map((block, blockIndex) => (
                    <div key={blockIndex} className="p-4 border border-gray-600 rounded-md bg-[var(--color-dark-bg)]">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-sm text-gray-400 uppercase">{block.type} Block</span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => moveListItem(`customPages.${index}.contentBlocks`, blockIndex, blockIndex - 1)}
                                    disabled={blockIndex === 0}
                                    className="p-1 disabled:opacity-50 text-gray-400 hover:text-white"
                                    aria-label="Move block up"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveListItem(`customPages.${index}.contentBlocks`, blockIndex, blockIndex + 1)}
                                    disabled={blockIndex === (customPage.contentBlocks?.length || 0) - 1}
                                    className="p-1 disabled:opacity-50 text-gray-400 hover:text-white"
                                    aria-label="Move block down"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => deleteListItem(`customPages.${index}.contentBlocks`, blockIndex)}
                                    className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                                >
                                    Delete Block
                                </button>
                            </div>
                        </div>

                        {block.type === 'html' && (
                            <AdminTextarea
                                label="HTML Content"
                                name="content"
                                value={block.content}
                                onChange={e => handleListChange(`customPages.${index}.contentBlocks`, blockIndex, 'content', e.target.value)}
                                rows={8}
                            />
                        )}
                        {block.type === 'image' && (
                            <div className="space-y-2">
                                <AdminInput
                                    label="Image URL"
                                    name="src"
                                    value={block.src}
                                    onChange={e => handleListChange(`customPages.${index}.contentBlocks`, blockIndex, 'src', e.target.value)}
                                />
                                <AdminInput
                                    label="Alt Text (for accessibility)"
                                    name="alt"
                                    value={block.alt}
                                    onChange={e => handleListChange(`customPages.${index}.contentBlocks`, blockIndex, 'alt', e.target.value)}
                                />
                            </div>
                        )}
                        {block.type === 'button' && (
                            <div className="space-y-2">
                                <AdminInput
                                    label="Button Text"
                                    name="text"
                                    value={block.text}
                                    onChange={e => handleListChange(`customPages.${index}.contentBlocks`, blockIndex, 'text', e.target.value)}
                                />
                                <AdminInput
                                    label="Button Link (URL)"
                                    name="href"
                                    value={block.href}
                                    onChange={e => handleListChange(`customPages.${index}.contentBlocks`, blockIndex, 'href', e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => addListItem(`customPages.${index}.contentBlocks`, { type: 'html', content: '<p>New paragraph.</p>' })}
                    className="bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm hover:bg-blue-700"
                >
                    Add HTML Block
                </button>
                <button
                    type="button"
                    onClick={() => addListItem(`customPages.${index}.contentBlocks`, { type: 'image', src: 'https://via.placeholder.com/800x400', alt: 'Placeholder Image' })}
                    className="bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm hover:bg-blue-700"
                >
                    Add Image Block
                </button>
                <button
                    type="button"
                    onClick={() => addListItem(`customPages.${index}.contentBlocks`, { type: 'button', text: 'Click Me', href: '#' })}
                    className="bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm hover:bg-blue-700"
                >
                    Add Button Block
                </button>
            </div>
        </div>
        <div className="mt-4">
            <SeoEditor 
                pageName="Page SEO" 
                seoPath={`customPages.${index}.seo`} 
                localData={localData} 
                onChange={handleNestedChange} 
            />
        </div>
    </div>
);


export const BlogEditor: React.FC<{
    post: BlogPost;
    index: number;
    onChange: (path: string, index: number, field: string, value: any) => void;
    onDelete: (path: string, index: number) => void;
}> = ({ post, index, onChange, onDelete }) => {
    const path = 'pages.blog.posts';

    return (
        <div className="mb-6 p-4 border border-gray-700 rounded-md bg-[var(--color-dark-bg)]">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-xl text-[var(--color-secondary)]">{post.title || `Blog Post ${index + 1}`}</h4>
                <div className="flex items-center gap-4">
                    <ToggleSwitch 
                        label="Visible" 
                        enabled={post.enabled} 
                        onChange={(enabled) => onChange(path, index, 'enabled', enabled)} 
                    />
                    <button onClick={() => onDelete(path, index)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput label="Post Title" name="title" value={post.title} onChange={e => onChange(path, index, e.target.name, e.target.value)} />
                <AdminInput label="Author" name="author" value={post.author} onChange={e => onChange(path, index, e.target.name, e.target.value)} />
                <AdminInput label="Date" name="date" value={post.date} onChange={e => onChange(path, index, e.target.name, e.target.value)} placeholder="e.g., October 15, 2023"/>
                <AdminInput label="Cover Image URL" name="image" value={post.image} onChange={e => onChange(path, index, e.target.name, e.target.value)} />
            </div>
            <div className="mt-4">
                 <AdminTextarea label="Short Excerpt (shown on list page)" name="excerpt" value={post.excerpt} onChange={e => onChange(path, index, e.target.name, e.target.value)} rows={3} />
            </div>
             <div className="mt-4">
                 <label className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">Full Content (HTML)</label>
                 <AdminTextarea label="" name="content" value={post.content} onChange={e => onChange(path, index, e.target.name, e.target.value)} rows={12} />
                 <p className="text-xs text-[var(--color-muted-text)] mt-1">Use HTML tags like &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt; to format your blog post.</p>
            </div>
        </div>
    );
};


import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { defaultData, AppData } from '../data';
import { db } from '../firebase';

// --- Theme Types ---
export interface UserTheme {
    mode: 'light' | 'dark';
    primaryColor: string;
}

interface DataContextType {
  appData: AppData;
  isLoading: boolean;
  updateAppData: (newData: Partial<AppData>) => Promise<void>;
  resetAppData: () => Promise<void>;
  userTheme: UserTheme;
  setUserTheme: (theme: UserTheme) => void;
  // New UI State for Prayer Times
  isPrayerTimesOpen: boolean;
  setPrayerTimesOpen: (open: boolean) => void;
  // --- Compare Feature State ---
  compareList: any[];
  addToCompare: (pkg: any) => void;
  removeFromCompare: (idOrName: string) => void;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setCompareModalOpen: (open: boolean) => void;
  // --- Checklist State ---
  isChecklistOpen: boolean;
  setChecklistOpen: (open: boolean) => void;
}

const initialContextValue: DataContextType = {
    appData: defaultData,
    isLoading: true,
    updateAppData: async () => {},
    resetAppData: async () => {},
    userTheme: { mode: 'dark', primaryColor: '' },
    setUserTheme: () => {},
    isPrayerTimesOpen: false,
    setPrayerTimesOpen: () => {},
    compareList: [],
    addToCompare: () => {},
    removeFromCompare: () => {},
    clearCompare: () => {},
    isCompareModalOpen: false,
    setCompareModalOpen: () => {},
    isChecklistOpen: false,
    setChecklistOpen: () => {},
};

export const DataContext = createContext<DataContextType>(initialContextValue);

const isObject = (item: any): item is object => {
    return (item && typeof item === 'object' && !Array.isArray(item));
};

const deepMerge = (target: any, source: any): any => {
    let output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [appData, setAppData] = useState<AppData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrayerTimesOpen, setPrayerTimesOpen] = useState(false);
  const [isChecklistOpen, setChecklistOpen] = useState(false);
  
  // --- Compare Feature State ---
  const [compareList, setCompareList] = useState<any[]>([]);
  const [isCompareModalOpen, setCompareModalOpen] = useState(false);

  const addToCompare = (pkg: any) => {
      // Check if already exists (robust check for id, name, or title)
      const exists = compareList.some(p => {
          if (p.id !== undefined && pkg.id !== undefined && p.id === pkg.id) return true;
          if (p.name !== undefined && pkg.name !== undefined && p.name === pkg.name) return true;
          if (p.title !== undefined && pkg.title !== undefined && p.title === pkg.title) return true;
          return false;
      });
      
      if (exists) {
          alert('This package is already in your comparison list.');
          return;
      }

      if (compareList.length >= 3) {
          alert('You can compare up to 3 packages at a time. Please remove one to add another.');
          return;
      }

      setCompareList([...compareList, pkg]);
  };

  const removeFromCompare = (idOrName: string) => {
      setCompareList(compareList.filter(p => p.id !== idOrName && p.name !== idOrName && p.title !== idOrName));
  };

  const clearCompare = () => {
      setCompareList([]);
  };

  // Initialize User Theme from LocalStorage
  const [userTheme, setUserThemeState] = useState<UserTheme>(() => {
      try {
          const saved = localStorage.getItem('userTheme');
          return saved ? JSON.parse(saved) : { mode: 'dark', primaryColor: '' };
      } catch (e) {
          return { mode: 'dark', primaryColor: '' };
      }
  });

  const setUserTheme = (theme: UserTheme) => {
      setUserThemeState(theme);
      localStorage.setItem('userTheme', JSON.stringify(theme));
  };

  useEffect(() => {
    const fetchData = async () => {
        const docRef = db.collection('content').doc('liveData');
        try {
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                const dbData = docSnap.data() as AppData;
                
                // --- START: NEW, ROBUST NAVIGATION PATCHING LOGIC ---
                if (dbData.header && dbData.header.navLinks) {
                    let navLinks = dbData.header.navLinks;

                    // Step 1: Clean up old package links to avoid conflicts
                    navLinks = navLinks.filter(link => link.href !== '#packages' && link.label !== 'Hajj & Umrah Packages');
                    const servicesLink = navLinks.find(link => link.label === 'Services');
                    if (servicesLink && servicesLink.subLinks) {
                        servicesLink.subLinks = servicesLink.subLinks.filter(sub => sub.href !== '#packages');
                    }

                    // Step 2: Ensure Hajj is a dropdown (Updated for 'Hajj' label)
                    const defaultHajjDropdown = defaultData.header.navLinks.find(link => link.label === 'Hajj' || link.label === 'Hajj Packages');
                    if (defaultHajjDropdown) {
                        const hajjIndex = navLinks.findIndex(link => link.label.includes('Hajj'));
                        if (hajjIndex !== -1) {
                            // It exists, make sure it's a dropdown and has the new sublinks if they are missing
                            if (!navLinks[hajjIndex].subLinks) {
                                navLinks[hajjIndex] = JSON.parse(JSON.stringify(defaultHajjDropdown));
                            } else {
                                // Check if exclusive link exists, if not add it
                                const hasExclusive = navLinks[hajjIndex].subLinks?.some(sub => sub.href === '#exclusive-hajj');
                                if (!hasExclusive && defaultHajjDropdown.subLinks) {
                                     navLinks[hajjIndex].subLinks = JSON.parse(JSON.stringify(defaultHajjDropdown.subLinks));
                                }
                                // Rename if still using old name
                                if (navLinks[hajjIndex].label === 'Hajj Packages') {
                                    navLinks[hajjIndex].label = 'Hajj';
                                }
                            }
                        } else {
                            // It doesn't exist, insert it
                            const servicesIndex = navLinks.findIndex(link => link.label === 'Services');
                            navLinks.splice(servicesIndex !== -1 ? servicesIndex + 1 : 2, 0, JSON.parse(JSON.stringify(defaultHajjDropdown)));
                        }
                    }

                    // Step 3: Ensure Umrah is a dropdown
                    const defaultUmrahDropdown = defaultData.header.navLinks.find(link => link.label === 'Umrah Packages');
                    if (defaultUmrahDropdown) {
                        const umrahIndex = navLinks.findIndex(link => link.label.includes('Umrah'));
                        if (umrahIndex !== -1) {
                             // It exists, make sure it's a dropdown and has the new sublinks if they are missing
                            if (!navLinks[umrahIndex].subLinks) {
                                navLinks[umrahIndex] = JSON.parse(JSON.stringify(defaultUmrahDropdown));
                            } else {
                                // Check if exclusive link exists, if not add it
                                const hasExclusive = navLinks[umrahIndex].subLinks?.some(sub => sub.href === '#exclusive-umrah');
                                if (!hasExclusive && defaultUmrahDropdown.subLinks) {
                                     navLinks[umrahIndex].subLinks = JSON.parse(JSON.stringify(defaultUmrahDropdown.subLinks));
                                }
                            }
                        } else {
                            // It doesn't exist, insert it after Hajj
                            const hajjIndex = navLinks.findIndex(link => link.label.includes('Hajj'));
                            navLinks.splice(hajjIndex !== -1 ? hajjIndex + 1 : 3, 0, JSON.parse(JSON.stringify(defaultUmrahDropdown)));
                        }
                    }

                    // Step 4: Enforce new Services Menu Structure
                    const defaultServicesLink = defaultData.header.navLinks.find(link => link.label === 'Services');
                    const servicesIndex = navLinks.findIndex(link => link.label === 'Services');
                    
                    if (defaultServicesLink) {
                        if (servicesIndex !== -1) {
                            // Force update subLinks to match default configuration, which includes new Ziyarat link
                            navLinks[servicesIndex].subLinks = JSON.parse(JSON.stringify(defaultServicesLink.subLinks));
                        } else {
                            // If not found, add it
                             navLinks.splice(2, 0, JSON.parse(JSON.stringify(defaultServicesLink)));
                        }
                    }

                    // Step 5: Patch Guidelines for Checklist
                    const guidelinesIndex = navLinks.findIndex(link => link.label === 'Guidelines');
                    const defaultGuidelinesLink = defaultData.header.navLinks.find(link => link.label === 'Guidelines');
                    
                    if (defaultGuidelinesLink) {
                        if (guidelinesIndex !== -1) {
                            // Ensure sublinks are updated (specifically for #checklist)
                            const currentSubLinks = navLinks[guidelinesIndex].subLinks || [];
                            const checklistLink = defaultGuidelinesLink.subLinks?.find(l => l.href === '#checklist');
                            
                            if (checklistLink && !currentSubLinks.some(l => l.href === '#checklist')) {
                                navLinks[guidelinesIndex].subLinks = [...currentSubLinks, checklistLink];
                            }
                        } else {
                             navLinks.splice(3, 0, JSON.parse(JSON.stringify(defaultGuidelinesLink)));
                        }
                    }

                    // Rename Contact if necessary
                    const contactIndex = navLinks.findIndex(link => link.href === '#contact');
                    if (contactIndex !== -1) {
                        if (navLinks[contactIndex].label === 'Contact') {
                            navLinks[contactIndex].label = 'Contact US';
                        }
                    }
                    
                    // --- ENFORCE ORDER ---
                    const desiredOrder = ['Home', 'Hajj', 'Umrah Packages', 'Services', 'Guidelines', 'Blog', 'Contact US'];
                    navLinks.sort((a, b) => {
                        let indexA = desiredOrder.indexOf(a.label);
                        let indexB = desiredOrder.indexOf(b.label);
                        
                        // Fallback to end if not in list
                        if (indexA === -1) indexA = 999;
                        if (indexB === -1) indexB = 999;
                        
                        return indexA - indexB;
                    });
                    
                    dbData.header.navLinks = navLinks;
                }
                // --- END: NEW, ROBUST NAVIGATION PATCHING LOGIC ---


                // Other existing patches
                const dbNavLinks = dbData.header?.navLinks;

                // Patch: Ensure 'Guidelines' nav link and its sublinks are up-to-date
                const defaultGuidelinesLink = defaultData.header.navLinks.find(link => link.label === 'Guidelines');

                if (dbNavLinks && defaultGuidelinesLink) {
                    let dbGuidelinesLink = dbNavLinks.find(link => link.label === 'Guidelines');
                    if (!dbGuidelinesLink) {
                        const servicesIndex = dbNavLinks.findIndex(link => link.label === 'Services');
                        dbNavLinks.splice(servicesIndex > -1 ? servicesIndex + 1 : 1, 0, JSON.parse(JSON.stringify(defaultGuidelinesLink)));
                    } else {
                        dbGuidelinesLink.subLinks = dbGuidelinesLink.subLinks || [];
                        defaultGuidelinesLink.subLinks?.forEach(defaultSubLink => {
                            if (!dbGuidelinesLink.subLinks.some(dbSubLink => dbSubLink.href === defaultSubLink.href)) {
                                dbGuidelinesLink.subLinks.push(JSON.parse(JSON.stringify(defaultSubLink)));
                            }
                        });
                    }
                }
                
                // Patch: Ensure 'Blog' nav link is present
                if (dbNavLinks) {
                    const blogLinkInDb = dbNavLinks.find(link => link.href === '#blog');
                    if (!blogLinkInDb) {
                        const defaultBlogLink = defaultData.header.navLinks.find(link => link.href === '#blog');
                        if (defaultBlogLink) {
                            dbNavLinks.push(JSON.parse(JSON.stringify(defaultBlogLink)));
                        }
                    }
                }
                
                // Patch: Ensure custom pages from defaultData exist in dbData
                if (!dbData.customPages) {
                    dbData.customPages = [];
                }
                const dbCustomPageIds = dbData.customPages.map(p => p.id);
                defaultData.customPages.forEach(defaultPage => {
                    if (!dbCustomPageIds.includes(defaultPage.id)) {
                        dbData.customPages.push(JSON.parse(JSON.stringify(defaultPage)));
                    }
                });

                // Patch: Ensure contentBlocks are populated for specific pages if empty in DB
                const targetPageIds = ['#hotel-booking', '#umrah-training', '#about-us', '#privacy-policy'];
                targetPageIds.forEach(id => {
                    const dbPage = dbData.customPages?.find(p => p.id === id);
                    const defaultPage = defaultData.customPages?.find(p => p.id === id);
                    if (dbPage && defaultPage) {
                        if ((!dbPage.contentBlocks || dbPage.contentBlocks.length === 0) && defaultPage.contentBlocks.length > 0) {
                            dbPage.contentBlocks = JSON.parse(JSON.stringify(defaultPage.contentBlocks));
                        }
                    }
                });
                
                // Patch: Remove old Ziyarat custom page if it exists in DB
                if (dbData.customPages) {
                    dbData.customPages = dbData.customPages.filter(p => p.id !== '#ziyarat-tours');
                }
                
                // Patch: Ensure exclusive data exists
                if (!dbData.exclusiveHajj) dbData.exclusiveHajj = JSON.parse(JSON.stringify(defaultData.exclusiveHajj));
                if (!dbData.exclusiveUmrah) dbData.exclusiveUmrah = JSON.parse(JSON.stringify(defaultData.exclusiveUmrah));
                
                // Patch: Ensure specialOffer exists
                if (!dbData.pages.home.specialOffer) {
                    dbData.pages.home.specialOffer = JSON.parse(JSON.stringify(defaultData.pages.home.specialOffer));
                }

                // Patch: Ensure islamicTools exists
                if (!dbData.pages.home.sections.islamicTools) {
                    dbData.pages.home.sections.islamicTools = JSON.parse(JSON.stringify(defaultData.pages.home.sections.islamicTools));
                }
                
                if (!dbData.pages.home.sections.islamicTools.zakat) dbData.pages.home.sections.islamicTools.zakat = { enabled: true, googleSheetUrl: '' };
                if (!dbData.pages.home.sections.islamicTools.tasbeeh) dbData.pages.home.sections.islamicTools.tasbeeh = { enabled: true };
                if (!dbData.pages.home.sections.islamicTools.currency) dbData.pages.home.sections.islamicTools.currency = { enabled: true };

                if (!dbData.footer.newsletter) {
                     dbData.footer.newsletter = JSON.parse(JSON.stringify(defaultData.footer.newsletter));
                }

                // Patch: Ensure Interactive Map Data Exists
                if (!dbData.pages.home.interactiveMap) {
                    dbData.pages.home.interactiveMap = JSON.parse(JSON.stringify(defaultData.pages.home.interactiveMap));
                }
                
                // Patch: Ensure Ziyarat Data Exists
                if (!dbData.pages.ziyarat) {
                    dbData.pages.ziyarat = JSON.parse(JSON.stringify(defaultData.pages.ziyarat));
                }
                
                // Patch: Ensure Hajj PreRegistration Data Exists
                if (!dbData.pages.packages.hajjPreRegistration) {
                    dbData.pages.packages.hajjPreRegistration = JSON.parse(JSON.stringify(defaultData.pages.packages.hajjPreRegistration));
                }

                // Robust Check for Global Config
                if (!dbData.globalConfig) {
                     dbData.globalConfig = JSON.parse(JSON.stringify(defaultData.globalConfig));
                }
                if (!dbData.globalConfig.textLabels) {
                    dbData.globalConfig.textLabels = JSON.parse(JSON.stringify(defaultData.globalConfig?.textLabels));
                }
                if (!dbData.globalConfig.marketingPopup) {
                    dbData.globalConfig.marketingPopup = JSON.parse(JSON.stringify(defaultData.globalConfig?.marketingPopup));
                }
                if (!dbData.globalConfig.advanced.typography) {
                    dbData.globalConfig.advanced.typography = JSON.parse(JSON.stringify(defaultData.globalConfig?.advanced.typography));
                }
                // --- NEW: Ensure SEO, Analytics & Language Config ---
                if (!dbData.globalConfig.seoSchema) {
                    dbData.globalConfig.seoSchema = JSON.parse(JSON.stringify(defaultData.globalConfig?.seoSchema));
                }
                if (!dbData.globalConfig.analytics) {
                    dbData.globalConfig.analytics = JSON.parse(JSON.stringify(defaultData.globalConfig?.analytics));
                }
                if (!dbData.globalConfig.language) {
                    dbData.globalConfig.language = JSON.parse(JSON.stringify(defaultData.globalConfig?.language));
                }
                if (!dbData.applications) {
                    dbData.applications = [];
                }

                setAppData(deepMerge(defaultData, dbData));
            } else {
                await docRef.set(defaultData);
                setAppData(defaultData);
            }
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
            setAppData(defaultData);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, []);

  const updateAppData = async (newData: Partial<AppData>) => {
    const mergedData = deepMerge(appData, newData);
    setAppData(mergedData); // Optimistic UI update

    const docRef = db.collection('content').doc('liveData');
    try {
        await docRef.set(mergedData);
    } catch (error) {
        console.error("Failed to save data to Firestore:", error);
    }
  };

  const resetAppData = async () => {
    if(window.confirm('Are you sure you want to reset all content to the original defaults? This cannot be undone.')) {
        setAppData(defaultData);
        const docRef = db.collection('content').doc('liveData');
        try {
            await docRef.set(defaultData);
        } catch (error) {
            console.error("Failed to reset data in Firestore:", error);
        }
    }
  }

  return (
    <DataContext.Provider value={{ 
        appData, 
        isLoading, 
        updateAppData, 
        resetAppData, 
        userTheme, 
        setUserTheme, 
        isPrayerTimesOpen, 
        setPrayerTimesOpen,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareModalOpen,
        setCompareModalOpen,
        isChecklistOpen,
        setChecklistOpen
    }}>
      {children}
    </DataContext.Provider>
  );
};

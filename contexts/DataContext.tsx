
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
}

const initialContextValue: DataContextType = {
    appData: defaultData,
    isLoading: true,
    updateAppData: async () => {},
    resetAppData: async () => {},
    userTheme: { mode: 'dark', primaryColor: '' },
    setUserTheme: () => {},
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
                    // NOTE: This is critical to ensure 'Ziyarat Tours' appears correctly
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

                 // Patch: Ensure footer newsletter exists
                if (!dbData.footer.newsletter) {
                    dbData.footer.newsletter = JSON.parse(JSON.stringify(defaultData.footer.newsletter));
                }

                // Patch: Ensure Interactive Map Data Exists
                if (!dbData.pages.home.interactiveMap) {
                    dbData.pages.home.interactiveMap = JSON.parse(JSON.stringify(defaultData.pages.home.interactiveMap));
                }

                setAppData(deepMerge(defaultData, dbData));
            } else {
                // If no data exists in Firestore, initialize it with the default data
                await docRef.set(defaultData);
                setAppData(defaultData);
            }
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
            // Fallback to default data in case of an error
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
        // Optionally, revert the state or show an error message
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
    <DataContext.Provider value={{ appData, isLoading, updateAppData, resetAppData, userTheme, setUserTheme }}>
      {children}
    </DataContext.Provider>
  );
};

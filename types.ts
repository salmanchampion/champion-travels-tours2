
export interface NavLink {
    href: string;
    label: string;
    enabled: boolean;
    subLinks?: { href: string; label: string; enabled: boolean; }[];
}

export interface Service {
  icon: string; 
  title: string;
  description: string;
  details: string[];
  enabled: boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  avatar: string;
  enabled: boolean;
}

export interface VisaFeature {
    icon: string;
    title: string;
    description: string;
    enabled: boolean;
}

export interface VisaProcessStep {
    icon: string;
    title: string;
    description: string;
    enabled: boolean;
}

export interface HajjPackage {
    name: string;
    price: string;
    duration: string;
    category: string;
    shortDescription: string;
    hotelMakkah: string;
    hotelMadinah: string;
    flightsUp: string;
    flightsDown: string;
    food: string;
    special: string;
    note: string;
    image: string;
    enabled: boolean;
}

export interface UmrahPackage {
    name: string;
    price: string;
    date: string;
    category: string;
    shortDescription: string;
    hotelMakkah: string;
    hotelMadinah: string;
    flightsUp: string;
    flightsDown: string;
    food: string;
    special: string;
    note: string;
    image: string;
    buttonText: string;
    enabled: boolean;
}

// --- NEW TYPE FOR EXCLUSIVE PACKAGES ---
export interface ExclusivePackage {
    id: string;
    title: string;
    category: string; // e.g., "Shifting", "Non-Shifting", "Economy", "5 Star"
    price: string;
    duration: string;
    makkahHotel: string;
    madinahHotel: string;
    features: string[]; // List of features like "Direct Flight", "Visa Included"
    image: string;
    pdfLink?: string; // Optional link to flyer
    enabled: boolean;
}

export interface TeamMember {
    name: string;
    role: string;
    imageUrl: string;
    title?: string;
    socials?: {
        facebook?: string;
        phone?: string;
        whatsapp?: string;
        email?: string;
    };
    enabled: boolean;
}

export interface GalleryImage {
    src: string;
    alt: string;
    enabled: boolean;
}

export interface ContactInfo {
    icon: string;
    label: string;
    value: string;
    enabled: boolean;
}

export interface UmrahGuideStep {
  title: string;
  description: string;
  points: string[];
  arabicText?: string;
  arabicMeaning?: string;
  enabled: boolean;
}

export interface HajjGuideType {
    title: string;
    description: string;
    enabled: boolean;
}

export interface HajjGuideAct {
    title: string;
    description: string;
    enabled: boolean;
}

export interface HajjGuideFaqItem {
  question: string;
  answer: string;
  enabled: boolean;
}

export interface GuideDoDontItem {
  title: string;
  items: string[];
}

export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string;
}

export interface WhyChooseSection {
    icon: string;
    title: string;
    description: string;
    enabled: boolean;
}

export interface WhyChooseChampionData {
    seo: SeoMetadata;
    en: {
        title: string;
        subtitle: string;
        sections: WhyChooseSection[];
    };
    bn: {
        title: string;
        subtitle: string;
        sections: WhyChooseSection[];
    };
}

export interface UmrahGuideData {
  seo: SeoMetadata;
  pageBanner: {
    title: string;
    subtitle: string;
  };
  stepsTitle: string;
  stepsIntro: string;
  steps: UmrahGuideStep[];
  dosAndDonts: {
    title: string;
    intro: string;
    dos: GuideDoDontItem;
    donts: GuideDoDontItem;
    images: string[];
    note: string;
  };
  faq: {
    title: string;
    items: HajjGuideFaqItem[];
  };
  cta: {
    title: string;
    buttonText: string;
  };
}

export interface HajjGuideData {
  seo: SeoMetadata;
  pageBanner: {
    title: string;
    subtitle: string;
  };
  types: {
    title: string;
    intro: string;
    list: HajjGuideType[];
  };
  faraj: {
    title: string;
    intro: string;
    list: HajjGuideAct[];
  };
  wajib: {
    title: string;
    intro: string;
    list: HajjGuideAct[];
  };
  dosAndDonts: {
    title: string;
    intro: string;
    dos: GuideDoDontItem;
    donts: GuideDoDontItem;
    images: string[];
    note: string;
  };
  faq: {
    title: string;
    items: HajjGuideFaqItem[];
  };
  cta: {
    title: string;
    buttonText: string;
  };
}

export interface WhyChooseUsData {
    seo: SeoMetadata;
    backgroundImage: string,
    guides: {
        mainImage: string;
        secondaryImage: string;
        tagline: string;
        title: string;
        description: string;
        subheading: string;
        subDescription: string;
        buttonText: string;
    },
    directors: {
        decorativeImage: string;
        mainImage: string;
        secondaryImage1: string;
        secondaryImage2: string;
        title: string;
        description: string;
        buttonText: string;
    },
    services: {
        image: string;
        title: string;
        list: string[];
        buttonText: string;
    },
    cta: {
        image: string;
        title: string;
        buttonText: string;
    },
    footerImage: string;
}

export interface AirTicketingFeature {
    icon: string;
    title: string;
    description: string;
    enabled: boolean;
}

export interface AirTicketingData {
    seo: SeoMetadata;
    pageBanner: {
        title: string;
        subtitle: string;
    };
    contentHtml?: string;
    features: AirTicketingFeature[];
    form: {
        title: string;
        subtitle: string;
        buttonText: string;
    };
    googleAppsScriptUrl: string;
}

export type ContentBlock = 
  | { type: 'html'; content: string; }
  | { type: 'image'; src: string; alt: string; }
  | { type: 'button'; text: string; href: string; };

export interface CustomPage {
  id: string; 
  title: string;
  bannerSubtitle: string;
  contentBlocks: ContentBlock[];
  seo: SeoMetadata;
  enabled: boolean;
}

export interface FloatingButtonConfig {
    enabled: boolean;
    type: 'whatsapp' | 'phone';
    phoneNumber: string;
    whatsappMessage?: string;
}

export interface PartnerLogo {
    src: string;
    alt: string;
    href?: string;
    enabled: boolean;
}

export interface PrayerLocation {
    name: string; 
    city: string; 
    country: string; 
    enabled: boolean;
}

export interface PrayerTimesConfig {
    enabled: boolean;
    title: string;
    locations: PrayerLocation[];
}

export interface TopicDetailsSection {
    title: string;
    description: string;
    image?: string;
    enabled: boolean;
}

export interface TopicDetailsData {
    seo: SeoMetadata;
    pageBanner: { title: string; subtitle: string; backgroundImage?: string; };
    sections: TopicDetailsSection[];
}

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string; // HTML content
    image: string;
    author: string;
    date: string;
    enabled: boolean;
}

export interface BlogData {
    seo: SeoMetadata;
    pageBanner: {
        title: string;
        subtitle: string;
        backgroundImage?: string;
    };
    posts: BlogPost[];
}

export interface ExclusivePageData {
    seo: SeoMetadata;
    pageBanner: {
        title: string;
        subtitle: string;
        backgroundImage: string;
    };
    introTitle: string;
    introText: string;
}

// --- New Special Offer Interface ---
export interface SpecialOfferConfig {
    enabled: boolean;
    title: string;
    subtitle: string;
    endDate: string; // ISO Date string
    backgroundImage: string;
    buttonText: string;
    buttonLink: string;
}

// --- New Islamic Tools Interface ---
export interface IslamicToolsConfig {
    enabled: boolean;
    zakat: {
        enabled: boolean;
        googleSheetUrl: string;
    };
    tasbeeh: {
        enabled: boolean;
    };
    currency: {
        enabled: boolean;
    };
}

export interface AppData {
    site: {
        logoUrl: string;
    };
    header: {
        taglines?: string[];
        contactInfo?: { label: string; value: string; }[];
        socialLinks?: { name: string; href: string; icon: string; }[];
        navLinks: NavLink[];
        bookNowButton: {
            text: string;
            href: string;
        };
    };
    floatingButton: FloatingButtonConfig;
    prayerTimes: PrayerTimesConfig;
    footer: {
        newsletter: {
            enabled: boolean;
            title: string;
            subtitle: string;
            placeholder: string;
            buttonText: string;
            googleSheetUrl: string;
        };
        about: {
            title: string[];
            description: string;
        };
        quickLinks: {
            title: string;
            links: { href: string; label: string; enabled: boolean; }[];
        };
        mainServices: {
            title: string;
            links: { href: string; label: string; enabled: boolean; }[];
        };
        partners: {
            title: string;
            subtitle: string;
            logos: PartnerLogo[];
            enabled: boolean;
        };
        followUs: {
            title: string;
            description: string;
        };
        copyrightText: string;
    };
    theme: {
        colors: {
            primary: string;
            primaryDark: string;
            secondary: string;
            secondaryDark: string;
            darkBg: string;
            lightBg: string;
            lightText: string;
            mutedText: string;
        };
        fonts: {
            sans: string;
            display: string;
        };
        ui: {
            borderRadius: string;
            buttonStyle: 'rounded' | 'pill' | 'sharp';
            shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl';
        };
    };
    hajjPackages: HajjPackage[];
    umrahPackages: UmrahPackage[];
    // --- NEW FIELDS ---
    exclusiveHajj: {
        pageData: ExclusivePageData;
        packages: ExclusivePackage[];
    };
    exclusiveUmrah: {
        pageData: ExclusivePageData;
        packages: ExclusivePackage[];
    };
    // ------------------
    pages: {
        home: {
            seo: SeoMetadata;
            packageFilter: {
                enabled: boolean;
                title: string;
                destinationLabel: string;
                destinationPlaceholder: string;
                monthLabel: string;
                packageTypeLabel: string;
                buttonText: string;
            };
            // --- Added Special Offer ---
            specialOffer: SpecialOfferConfig;
            sections: {
                services: { enabled: boolean; title: string; subtitle: string; };
                packages: { enabled: boolean; title: string; subtitle: string; };
                whyChooseUs: { enabled: boolean; };
                testimonials: { enabled: boolean; title: string; subtitle: string; };
                contact: { enabled: boolean; title: string; subtitle: string; };
                islamicTools: IslamicToolsConfig; // Updated from just { enabled: boolean }
            };
            hero: {
                title: string;
                licenseInfo: string;
                subtitle: string;
                description: string;
                images: string[];
                buttonText: string;
            },
        };
        hajj: {
            seo: SeoMetadata;
            pageBanner: { title: string; subtitle: string; backgroundImage?: string; };
            filters: { label: string; category: string; icon: string; }[];
        };
        umrah: {
            seo: SeoMetadata;
            pageBanner: { title: string; subtitle: string; backgroundImage?: string; };
            filters: { label: string; category: string; icon: string; }[];
        };
        hajjDetails: TopicDetailsData;
        umrahDetails: TopicDetailsData;
        services: {
            seo: SeoMetadata;
            pageBanner: { title: string; subtitle: string; };
            list: Service[];
        };
        packages: {
            seo: SeoMetadata;
            pageBanner: { title: string; subtitle: string; };
            hajjPreRegistration: {
                image: string;
                title: string;
                description: string;
                subDescription: string;
                inquirySubject: string;
                buttonText: string;
            },
            keyHighlights: {
                title: string;
                umrahStat: string;
                umrahStatLabel: string;
                hajjStat: string;
                hajjStatLabel: string;
            },
            umrahSection: {
                title: string;
                subtitle: string;
                buttonText: string;
            },
            gallery: {
                title: string;
                description: string;
                images: GalleryImage[];
            }
        };
        visaProcessing: {
            seo: SeoMetadata;
            pageBanner: { title: string; subtitle: string; };
            contentHtml?: string;
            offerTitle: string;
            offerList: VisaFeature[];
            processTitle: string;
            processSteps: VisaProcessStep[];
            whyChooseUsTitle: string;
            whyChooseUsFeatures: VisaFeature[];
            form: {
                title: string;
                subtitle: string;
                buttonText: string;
            };
            googleAppsScriptUrl: string;
        };
        airTicketing: AirTicketingData;
        team: {
            seo: SeoMetadata;
            pageBanner: { title: string; subtitle: string; };
            chairmanTitle: string;
            chairman: TeamMember;
            employeesTitle: string;
            employeesSubtitle: string;
            talentedEmployees: TeamMember[];
        };
        testimonials: {
            seo: SeoMetadata;
            pageBanner: { title: string; subtitle: string; };
            list: Testimonial[];
        };
        contact: {
            seo: SeoMetadata;
            pageBanner: { title: string; subtitle: string; };
            infoTitle: string;
            infoSubtitle: string;
            formTitle: string;
            accreditationsTitle: string;
            contactInfo: ContactInfo[];
            accreditationsImage: string;
            formButtonText: string;
            mapUrl: string;
            googleAppsScriptUrl: string;
        };
        whyChooseUs: WhyChooseUsData;
        expertHajjGuides: WhyChooseUsData;
        whyChooseChampion: WhyChooseChampionData;
        umrahGuide: UmrahGuideData;
        hajjGuide: HajjGuideData;
        blog: BlogData;
    };
    customPages: CustomPage[];
}
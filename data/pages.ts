
import { AppData, CustomPage } from '../types';

export const pagesData: AppData['pages'] = {
    home: {
        seo: {
            title: 'Champion Travels | Best Hajj & Umrah Agency in Bangladesh',
            description: 'Champion Travels offers affordable Hajj packages 2025, premium Umrah packages, and fast Visa processing in Dhaka. Recognized by Govt of Bangladesh (Lic: 1432).',
            keywords: 'Hajj agency Dhaka, Umrah package price BD, Saudi Visa, Air Ticket, Champion Travels'
        },
        packageFilter: {
            enabled: true,
            title: 'Find Your Perfect Package',
            destinationLabel: 'Destination',
            destinationPlaceholder: 'e.g., Makkah',
            monthLabel: 'Month',
            packageTypeLabel: 'Package Type',
            buttonText: 'Search'
        },
        specialOffer: {
            enabled: true,
            title: 'Exclusive Ramadan Package 2025',
            subtitle: 'Limited time offer! Experience the spirituality of Ramadan in Makkah & Madinah with premium services.',
            endDate: '2025-03-10T23:59', 
            backgroundImage: 'https://i.postimg.cc/jSKtdnQ4/HD-wallpaper-mecca-madina-during-evening-time-ramzan.jpg',
            buttonText: 'Book This Offer',
            buttonLink: '#contact?subject=Ramadan Package Inquiry'
        },
        // --- NEW: Interactive Map Default Data ---
        interactiveMap: {
            enabled: true,
            cities: {
              Makkah: {
                name: 'মক্কা আল-মুকাররমা',
                mapImage: 'https://i.postimg.cc/R0N8Mv8X/as.jpg', 
                locations: [
                  {
                    id: 1,
                    title: 'মসজিদ আল-হারাম',
                    description: 'মক্কার পবিত্র কাবা শরীফ ঘিরে অবস্থিত মহান মসজিদ। এটি হজ পালনের মূল স্থান এবং বিশ্বব্যাপী মুসলমানদের নামাজের কিবলা।',
                    image: 'https://i.postimg.cc/Bb92VfRP/ag.webp',
                    top: '50%',
                    left: '50%',
                  },
                  {
                    id: 2,
                    title: 'জাবালে নূর (হেরা গুহা)',
                    description: 'এই পাহাড়ে হেরা গুহা অবস্থিত, যেখানে নবী মুহাম্মদ (সাঃ) জিবরাঈল (আঃ)-এর মাধ্যমে পবিত্র কুরআনের প্রথম ওহী লাভ করেছিলেন।',
                    image: 'https://i.postimg.cc/RZ8BGSpf/aj.webp',
                    top: '20%',
                    left: '70%',
                  },
                  {
                    id: 3,
                    title: 'জাবালে সওর',
                    description: 'মদিনায় হিজরতের সময় নবী (সাঃ) এবং আবু বকর (রাঃ) এই পাহাড়ের গুহায় মক্কার কুরাইশদের হাত থেকে বাঁচতে তিন দিন আশ্রয় নিয়েছিলেন।',
                    image: 'https://i.postimg.cc/x1gn4TDd/ad.jpg',
                    top: '75%',
                    left: '30%',
                  },
                  {
                    id: 4,
                    title: 'মিনা (তাঁবুর শহর)',
                    description: 'তাঁবুর শহর হিসেবে পরিচিত মিনা হলো একটি উপত্যকা যেখানে হাজীরা হজের সময় অবস্থান করেন। এখানেই শয়তানকে পাথর মারার (রমি) স্থান অবস্থিত।',
                    image: 'https://i.postimg.cc/VkQL0LnX/al.webp',
                    top: '40%',
                    left: '80%',
                  },
                  {
                    id: 5,
                    title: 'আরাফাত ময়দান',
                    description: 'এখানে জাবালে রহমত (করুণার পাহাড়) অবস্থিত। আরাফাতের ময়দানে অবস্থান করা হজের সবচেয়ে গুরুত্বপূর্ণ রুকন।',
                    image: 'https://i.postimg.cc/CL6k3832/ak.jpg',
                    top: '30%',
                    left: '90%',
                  },
                ],
              },
              Madinah: {
                name: 'মদিনা আল-মুনাওয়ারা',
                mapImage: 'https://i.postimg.cc/x1gn4TDd/ad.jpg',
                locations: [
                  {
                    id: 1,
                    title: 'মসজিদে নববী',
                    description: 'নবীজীর মসজিদ, ইসলামের দ্বিতীয় পবিত্র স্থান। এখানে রওজা শরীফ এবং নবী (সাঃ)-এর কবর মোবারক অবস্থিত।',
                    image: 'https://i.postimg.cc/x1gn4TDd/ad.jpg',
                    top: '50%',
                    left: '50%',
                  },
                  {
                    id: 2,
                    title: 'মসজিদে কুবা',
                    description: 'ইসলামের ইতিহাসে নির্মিত প্রথম মসজিদ। এখানে দুই রাকাত নামাজ আদায় করলে একটি ওমরাহ পালনের সমান সওয়াব পাওয়া যায়।',
                    image: 'https://i.postimg.cc/RZ8BGSpf/aj.webp',
                    top: '70%',
                    left: '40%',
                  },
                  {
                    id: 3,
                    title: 'উহুদ পাহাড়',
                    description: 'ঐতিহাসিক উহুদ যুদ্ধের স্থান। নবীজী (সাঃ) এই পাহাড়কে ভালোবাসতেন। এখানে হামজা (রাঃ) সহ ৭০ জন শহীদের কবর রয়েছে।',
                    image: 'https://i.postimg.cc/mD2wzRfY/hajj-b.jpg',
                    top: '20%',
                    left: '60%',
                  },
                  {
                    id: 4,
                    title: 'মসজিদ আল-কিবলাতাইন',
                    description: 'দুই কিবলার মসজিদ, যেখানে নামাজের দিক পরিবর্তন করে জেরুজালেম থেকে মক্কার কাবার দিকে করার ওহী নাজিল হয়েছিল।',
                    image: 'https://i.postimg.cc/50rQG1f5/umrah-2.jpg',
                    top: '30%',
                    left: '20%',
                  },
                ],
              },
            }
        },
        // --------------------------------
        sections: {
            services: { enabled: true, title: 'Our Services', subtitle: 'We offer a complete range of travel solutions with a commitment to quality and customer satisfaction.' },
            packages: { enabled: true, title: 'Our Hajj & Umrah Packages', subtitle: 'Explore our diverse range of Hajj and Umrah packages. Each is thoughtfully crafted to provide a spiritually rewarding, comfortable, and seamless pilgrimage experience.' },
            whyChooseUs: { enabled: true },
            testimonials: { enabled: true, title: 'Words From Our Clients', subtitle: 'We are proud to have served thousands of satisfied clients.' },
            contact: { enabled: true, title: 'Get In Touch', subtitle: 'Have questions or ready to book your next journey? Contact us today!' },
            islamicTools: { 
                enabled: true,
                zakat: { enabled: true, googleSheetUrl: '' },
                tasbeeh: { enabled: true },
                currency: { enabled: true }
            }
        },
            hero: {
            title: 'Champion Travels & Tours',
            licenseInfo: 'Bangladesh Govt. Approved hajj License No.-1432 & Umrah License no.-515',
            subtitle: 'Hajj Umrah & Air Ticketing',
            description: 'Embark on your spiritual journey with peace of mind. We provide exceptional services to make your pilgrimage a memorable experience.',
            images: [
                'https://i.postimg.cc/x1gn4TDd/ad.jpg',
                'https://i.postimg.cc/jSKtdnQ4/HD-wallpaper-mecca-madina-during-evening-time-ramzan.jpg',
                'https://i.postimg.cc/Y2z4HFFK/ah.jpg',
            ],
            buttonText: 'Explore Our Packages'
        },
    },
    hajj: {
        seo: {
            title: 'Hajj Packages 2026 Bangladesh | Champion Travels',
            description: 'Book affordable and VIP Hajj packages from Bangladesh. Shifting and Non-Shifting Hajj packages with pre-registration available.',
            keywords: 'Hajj packages 2026 BD, Hajj price Bangladesh, Hajj pre registration'
        },
        pageBanner: {
            title: 'Hajj Packages',
            subtitle: 'Choose from our curated Hajj packages for a blessed journey.',
            backgroundImage: 'https://i.postimg.cc/jSKtdnQ4/HD-wallpaper-mecca-madina-during-evening-time-ramzan.jpg'
        },
        filters: [
            { label: 'Regular Hajj', category: 'Regular Hajj', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a9.004 9.004 0 00-4.5 15.75" />' },
            { label: 'VIP Gold Hajj', category: 'VIP Gold Hajj', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-3.152a.563.563 0 00-.652 0l-4.725 3.152a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />' }
        ]
    },
    umrah: {
        seo: {
            title: 'Low Cost Umrah Packages from Dhaka | Champion Travels',
            description: 'Best Umrah packages from Bangladesh 2025. 5-star, 3-star, and economy Umrah packages with visa and air ticket.',
            keywords: 'Umrah packages BD price, Umrah visa fee Bangladesh, Cheap Umrah package'
        },
        pageBanner: {
            title: 'Best Umrah Packages BD 2025-2026-2027',
            subtitle: 'Find the perfect Umrah package that suits your needs and budget.',
            backgroundImage: 'https://i.postimg.cc/Y2z4HFFK/ah.jpg'
        },
        filters: [
            { label: '5 Star Umrah Packages', category: '5 Star', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-3.152a.563.563 0 00-.652 0l-4.725 3.152a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />' },
            { label: '3 Star Umrah Packages', category: '3 Star', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-3.152a.563.563 0 00-.652 0l-4.725 3.152a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />' },
            { label: 'Economy Umrah Packages', category: 'Economy', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 015.25 6v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0H3.75m0 0h.75m1.5-1.5v.75A.75.75 0 016 9h-.75m0 0v-.75A.75.75 0 016 7.5h.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h-.75m.75 0h.75" />' },
            { label: 'Ramadan Umrah Packages', category: 'Ramadan', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />' },
            { label: 'Itikaf Umrah Packages', category: 'Itikaf', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a9.004 9.004 0 00-4.5 15.75" />' },
            { label: 'After Eid Umrah Packages', category: 'After Eid', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M8.25 10.75h.008v.008H8.25v-.008zm4.5 0h.008v.008h-.008v-.008zm4.5 0h.008v.008h-.008v-.008z" />' },
            { label: 'Custom Umrah Packages', category: 'Custom', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995a6.473 6.473 0 010 1.082c0 .382.145.755.438.995l1.003.827c.48.398.668 1.03.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.331.183-.581.495-.644.87l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995a6.473 6.473 0 010-1.082c0-.382-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495.644-.87l.213-1.281z" />' },
        ]
    },
    hajjDetails: {
        seo: {
            title: 'About Hajj | Champion Travels & Tours',
            description: 'Learn about Hajj, its significance, rituals, and importance in Islam. Champion Travels offers comprehensive guides and packages for your pilgrimage.',
            keywords: 'What is Hajj, Hajj significance, Hajj rituals, Hajj information'
        },
        pageBanner: {
            title: 'Hajj: The Journey of a Lifetime',
            subtitle: 'A comprehensive guide to the significance and rituals of the fifth pillar of Islam.',
            backgroundImage: 'https://i.postimg.cc/R0N8Mv8X/as.jpg'
        },
        sections: [
            {
                title: 'What is Hajj?',
                description: 'Hajj is an annual Islamic pilgrimage to Mecca, Saudi Arabia, the holiest city for Muslims. It is a mandatory religious duty for Muslims that must be carried out at least once in their lifetime by all adult Muslims who are physically and financially capable of undertaking the journey, and can support their family during their absence.',
                image: 'https://i.postimg.cc/CL6k3832/ak.jpg',
                enabled: true
            },
            {
                title: 'The Significance of Hajj',
                description: 'Hajj is one of the Five Pillars of Islam, alongside Shahada, Salat, Zakat, and Sawm. It demonstrates the solidarity of the Muslim people, and their submission to God (Allah). The pilgrimage occurs from the 8th to 12th (or in some cases 13th) of Dhu al-Hijjah, the last month of the Islamic calendar.',
                enabled: true
            },
            {
                title: 'Key Rituals',
                description: 'The rituals of Hajj include entering the state of Ihram, performing Tawaf around the Kaaba, walking between the hills of Safa and Marwa (Sa\'i), standing on the plains of Arafat, spending the night at Muzdalifah, and symbolic stoning of the devil (Ramy al-Jamarat) in Mina.',
                image: 'https://i.postimg.cc/VkQL0LnX/al.webp',
                enabled: true
            }
        ]
    },
    umrahDetails: {
        seo: {
            title: 'About Umrah | Champion Travels & Tours',
            description: 'Discover the spiritual journey of Umrah. Learn about its rituals, virtues, and how it differs from Hajj.',
            keywords: 'What is Umrah, Umrah significance, Umrah vs Hajj, Umrah rituals'
        },
        pageBanner: {
            title: 'Umrah: The Minor Pilgrimage',
            subtitle: 'A spiritual journey to the House of Allah that renews faith and cleanses the soul.',
            backgroundImage: 'https://i.postimg.cc/Y2z4HFFK/ah.jpg'
        },
            sections: [
            {
                title: 'What is Umrah?',
                description: 'Umrah is an Islamic pilgrimage to Mecca that can be undertaken at any time of the year, in contrast to Hajj, which has specific dates according to the Islamic lunar calendar. In Arabic, Umrah means "to visit a populated place".',
                image: 'https://i.postimg.cc/x1gn4TDd/ad.jpg',
                enabled: true
            },
            {
                title: 'Virtues of Umrah',
                description: 'Performing Umrah cleanses a Muslim of their sins and poverty. It is a way to show devotion to Allah and seek His forgiveness. Unlike Hajj, which is obligatory for those who can afford it, Umrah is considered a recommended (Sunnah) act of worship, though highly meritorious.',
                enabled: true
            },
            {
                title: 'Rituals of Umrah',
                description: 'The main rituals of Umrah are: 1) Ihram (entering the sacred state), 2) Tawaf (circumambulating the Kaaba), 3) Sa\'i (walking between Safa and Marwa), and 4) Halq or Taqsir (shaving or shortening the hair). These rites can be completed in a few hours.',
                image: 'https://i.postimg.cc/3R91yY2B/umrah-1.jpg',
                enabled: true
            }
        ]
    },
    services: {
        seo: {
            title: 'Our Services | Champion Travels & Tours',
            description: 'Explore a complete range of travel solutions including Hajj, Umrah, Visa Processing, Air Ticketing, Hotel Booking, and curated Tour Packages.',
            keywords: 'Travel services, Hajj, Umrah, Visa, Air ticket, Hotel booking, Tour packages'
        },
        pageBanner: { 
            title: 'Our Services',
            subtitle: 'We offer a complete range of travel solutions with a commitment to quality and customer satisfaction.'
        },
        list: [
            {
                icon: 'Hajj',
                title: 'Hajj Packages',
                description: 'Comprehensive Hajj packages that cater to your spiritual and comfort needs.',
                details: [
                'Guidance from experienced scholars and group leaders.',
                'Choice of 5-star, 4-star, or economy accommodations.',
                'All-inclusive meal plans with buffet-style dining.',
                'Private, air-conditioned transportation for all rituals.',
                'Pre-Hajj workshops and seminars to prepare you for the journey.',
                'Dedicated medical and support staff available 24/7.'
                ],
                enabled: true,
            },
            {
                icon: 'Umrah',
                title: 'Umrah Packages',
                description: 'Flexible and affordable Umrah packages available throughout the year.',
                details: [
                'Packages available for individuals, families, and groups.',
                'Flexible durations (e.g., 7, 10, 14 days).',
                'Hotels located within walking distance of Haramain.',
                'Guided Ziyarah tours to historical Islamic sites.',
                'Assistance with Ihram and performance of rituals.',
                'Option to customize your package according to your budget.'
                ],
                enabled: true,
            },
            {
                icon: 'Visa',
                title: 'Visa Processing',
                description: 'Hassle-free and quick visa processing services for multiple countries.',
                details: [
                'Expert consultation on visa requirements and documentation.',
                'High success rate with meticulous application review.',
                'Processing for tourist, business, student, and medical visas.',
                'Support for major destinations including Saudi Arabia, UAE, Europe, and North America.',
                'Transparent process with no hidden fees.',
                'Timely updates on your application status.'
                ],
                enabled: true,
            },
            {
                icon: 'AirTicket',
                title: 'Air Ticketing',
                description: 'Competitive prices on domestic and international air tickets.',
                details: [
                'Access to the best fares from all major airlines.',
                'Easy booking process for both one-way and round-trip tickets.',
                'Special deals on group bookings and family travel.',
                'Assistance with seat selection, meal preferences, and baggage allowance.',
                '24/7 support for rebooking, cancellations, and flight changes.',
                'Multi-city and complex itinerary planning available.'
                ],
                enabled: true,
            },
            {
                icon: 'Hotel',
                title: 'Hotel Booking',
                description: 'Book from a wide range of hotels, from budget-friendly to luxury stays.',
                details: [
                'Extensive network of hotels worldwide.',
                'Instant confirmation and secure online payment.',
                'Exclusive deals and discounts available.',
                'Options ranging from budget hotels to luxury 5-star resorts.',
                'Detailed hotel information, including amenities and guest reviews.',
                'Ability to book airport transfers along with your hotel.'
                ],
                enabled: true,
            },
            {
                icon: 'Tour',
                title: 'Tour Packages',
                description: 'Discover the world with our curated holiday and tour packages.',
                details: [
                'Curated itineraries for popular destinations worldwide.',
                'All-inclusive packages covering flights, hotels, tours, and meals.',
                'Options for both group tours and private, customized trips.',
                'Experienced local guides to enhance your travel experience.',
                'Themed tours, such as adventure, cultural, or relaxation holidays.',
                'Visa assistance included with international tour packages.'
                ],
                enabled: true,
            },
        ]
    },
    packages: {
        seo: {
            title: 'Hajj & Umrah Packages | Champion Travels & Tours',
            description: 'Find the best Hajj and Umrah packages from Bangladesh. We offer a range of economy, executive, and VIP packages to suit your needs for a blessed journey.',
            keywords: 'Hajj packages 2026, Umrah packages 2025, Economy Hajj, VIP Umrah, Hajj pre-registration'
        },
        pageBanner: { 
            title: 'Hajj & Umrah Packages', 
            subtitle: 'Explore our diverse range of Hajj and Umrah packages. Each is thoughtfully crafted to provide a spiritually rewarding, comfortable, and seamless pilgrimage experience.'
        },
        hajjPreRegistration: {
            image: 'https://i.postimg.cc/PJS59Bqw/champion-logo-1.png',
            title: 'Hajj Pre Registration 2026-2027',
            description: 'Embark on a sacred pilgrimage with peace of mind. Pre-register for Hajj and ensure your place in this spiritually significant journey.',
            subDescription: 'Champion Travels & Tours is here to guide you through the process, offering seamless pre-registration services. Prepare for an experience of a lifetime – start your Hajj pre-registration today.',
            inquirySubject: 'Inquiry: Hajj Pre-Registration 2026-2027',
            buttonText: 'Apply For Pre-Register'
        },
        keyHighlights: {
            title: 'Key Highlights of Champion Travels and Tours',
            umrahStat: '20,000+',
            umrahStatLabel: 'Umrah Packages Provided in the Last 10 Years',
            hajjStat: '15,000+',
            hajjStatLabel: 'Hajj Pilgrims Successfully Served',
        },
        umrahSection: {
            title: 'Upcoming Umrah Packages',
            subtitle: 'Plan your Umrah and Ziyarah. Our upcoming Umrah packages will encompass a range of options, including economy and premium packages, designed to accommodate various budgets and preferences.',
            buttonText: 'View All Packages'
        },
        gallery: {
            title: 'Explore Our Gallery',
            description: 'A glimpse into the spiritual journeys and beautiful destinations we offer.',
            images: [
                { src: 'https://i.postimg.cc/RZ8BGSpf/aj.webp', alt: 'The Prophet\'s Mosque illuminated at night', enabled: true },
                { src: 'https://i.postimg.cc/Y2z4HFFK/ah.jpg', alt: 'A close-up view of the Kaaba surrounded by pilgrims', enabled: true },
                { src: 'https://i.postimg.cc/Bb92VfRP/ag.webp', alt: 'The Kaaba during prayers with beautiful lighting', enabled: true },
                { src: 'https://i.postimg.cc/R0N8Mv8X/as.jpg', alt: 'Aerial view of the Kaaba and the Grand Mosque during the day', enabled: true },
                { src: 'https://i.postimg.cc/jSKtdnQ4/HD-wallpaper-mecca-madina-during-evening-time-ramzan.jpg', alt: 'The Grand Mosque in Mecca during a vibrant sunset', enabled: true },
                { src: 'https://i.postimg.cc/x1gn4TDd/ad.jpg', alt: 'The serene courtyard of the Prophet\'s Mosque in Medina', enabled: true },
                { src: 'https://i.postimg.cc/CL6k3832/ak.jpg', alt: 'The Makkah Royal Clock Tower overlooking the Kaaba', enabled: true },
                { src: 'https://i.postimg.cc/VkQL0LnX/al.webp', alt: 'A wide-angle view of the Grand Mosque bustling with pilgrims', enabled: true },
            ],
        }
    },
    visaProcessing: {
        seo: {
            title: 'Visa Processing Services | Champion Travels & Tours',
            description: 'Reliable and efficient visa processing for tourist, business, student, and medical purposes. Let our experts handle your application with a high success rate.',
            keywords: 'Visa processing Dhaka, tourist visa, business visa, student visa, medical visa'
        },
        pageBanner: { 
            title: 'Visa Processing Services',
            subtitle: 'Navigating the complexities of visa applications can be daunting. Our dedicated team is here to provide you with seamless, reliable, and efficient visa processing services for various countries.'
        },
        contentHtml: `
<h3>Comprehensive Visa Assistance</h3>
<p>At Champion Travels & Tours, we understand that visa processing can be one of the most stressful parts of planning an international trip. Our dedicated Visa Services department is here to simplify the process for you. Whether you are traveling for leisure, business, education, or medical treatment, our experienced consultants provide end-to-end support to ensure your application is accurate, complete, and submitted on time.</p>
<p>We stay up-to-date with the latest immigration regulations of major destinations including the USA, UK, Canada, Schengen countries, Australia, and Middle Eastern nations. From filling out complex forms to scheduling appointments and preparing you for interviews, we are with you every step of the way.</p>
`,
        offerTitle: 'What We Offer',
        offerList: [
            { icon: 'Tourist', title: 'Tourist Visa', description: 'Explore new destinations with our hassle-free tourist visa services.', enabled: true },
            { icon: 'Business', title: 'Business Visa', description: 'Facilitating your international business travel needs with efficient processing.', enabled: true },
            { icon: 'Student', title: 'Student Visa', description: 'Helping students achieve their dreams of studying abroad.', enabled: true },
            { icon: 'Medical', title: 'Medical Visa', description: 'Assisting with visa requirements for medical treatment overseas.', enabled: true },
        ],
        processTitle: 'Our Simple 4-Step Process',
        processSteps: [
            { icon: 'Consultation', title: 'Consultation', description: 'We start with a detailed consultation to understand your visa needs.', enabled: true },
            { icon: 'DocumentCheck', title: 'Document Check', description: 'Our experts meticulously review all your documents to ensure accuracy.', enabled: true },
            { icon: 'Submission', title: 'Application Submission', description: 'We handle the entire submission process on your behalf.', enabled: true },
            { icon: 'FollowUp', title: 'Follow-up & Delivery', description: 'We keep you updated and ensure timely delivery of your visa.', enabled: true },
        ],
        whyChooseUsTitle: 'Why Choose Us For Visa Processing?',
        whyChooseUsFeatures: [
            { icon: 'Guidance', title: 'Expert Guidance', description: 'Our experienced team provides professional advice for a smooth process.', enabled: true },
            { icon: 'Success', title: 'High Success Rate', description: 'We have a proven track record of successful visa applications.', enabled: true },
            { icon: 'Time', title: 'Time-Saving', description: 'Let us handle the complexities while you focus on your travel plans.', enabled: true },
            { icon: 'Transparent', title: 'Transparent Process', description: 'We maintain complete transparency with no hidden costs or surprises.', enabled: true },
        ],
        form: {
            title: 'Visa Inquiry Form',
            subtitle: 'Have a specific question about your visa application? Fill out the form below, and our experts will get in touch with you.',
            buttonText: 'Submit Inquiry'
        },
        googleAppsScriptUrl: '',
    },
    airTicketing: {
        seo: {
            title: 'Air Ticketing | Champion Travels & Tours',
            description: 'Find competitive prices for domestic and international flights. Book your air tickets easily with Champion Travels & Tours for a seamless travel experience.',
            keywords: 'Air ticket Bangladesh, cheap flights Dhaka, international air ticket, domestic flights'
        },
        pageBanner: {
            title: 'Air Ticketing Services',
            subtitle: 'Your gateway to the world. We offer competitive fares and a seamless booking experience for both domestic and international flights.'
        },
        contentHtml: `
<h3>Fly with Confidence</h3>
<p>Champion Travels & Tours is your one-stop solution for all your air travel needs. As an IATA accredited agency, we have direct access to the global distribution systems of hundreds of airlines. This allows us to offer you the most competitive fares and the widest range of flight options for any destination worldwide.</p>
<p>We cater to all types of travelers - from budget-conscious backpackers to corporate executives requiring business class luxury. Our ticketing experts are available to assist you with complex itineraries, last-minute bookings, and any changes or cancellations you might need. We believe that your journey should start with a smooth booking experience.</p>
`,
        features: [
            { icon: 'BestFares', title: 'Competitive Fares', description: 'Access to the best prices from all major airlines, ensuring you get the most value.', enabled: true },
            { icon: 'Global', title: 'Worldwide Destinations', description: 'Whether it\'s a local trip or an international journey, we cover destinations across the globe.', enabled: true },
            { icon: 'EasyBooking', title: 'Simple Booking Process', description: 'Our straightforward booking process makes securing your flight quick and easy.', enabled: true },
            { icon: 'Support', title: '24/7 Support', description: 'Our dedicated team is available around the clock to assist you during your trip.', enabled: true },
        ],
        form: {
            title: 'Flight Inquiry Form',
            subtitle: 'Please provide your travel details below, and one of our ticketing experts will contact you with the best available options and fares.',
            buttonText: 'Get Flight Options'
        },
        googleAppsScriptUrl: '',
    },
    team: {
        seo: {
            title: 'Our Team | Champion Travels & Tours',
            description: 'Meet the dedicated team behind Champion Travels & Tours. Led by experienced professionals, we are committed to serving you with integrity and excellence.',
            keywords: 'Champion Travels team, travel agency staff, management team'
        },
        pageBanner: {
            title: 'Our Team',
            subtitle: 'Meet the dedicated professionals working tirelessly to make your journey memorable.'
        },
        chairmanTitle: 'Message from the Chairman',
        chairman: {
            name: 'Alhaj Md. Shahjahan',
            role: 'Chairman',
            imageUrl: 'https://i.postimg.cc/rwn0QTMc/image.png',
            title: 'Honourable Chairman',
            socials: {
                phone: '+8801718425042',
                email: 'championtravels.Dhaka@gmail.com'
            },
            enabled: true
        },
        employeesTitle: 'Our Talented Team',
        employeesSubtitle: 'Our team of experts is here to assist you with every aspect of your travel needs.',
        talentedEmployees: [
            {
                name: 'Md. Rafiqul Islam',
                role: 'Managing Director',
                imageUrl: 'https://i.postimg.cc/G3MgC8cQ/image-(2).png',
                socials: {
                    phone: '+8801901922368',
                    email: 'rafiq@championtravels.com'
                },
                enabled: true
            },
            {
                name: 'Abdul Malek',
                role: 'Director',
                imageUrl: 'https://i.postimg.cc/0jmsLpT9/image-(1).png',
                socials: {
                        phone: '+8801901922366'
                },
                enabled: true
            }
        ]
    },
    testimonials: {
        seo: {
            title: 'Testimonials | Champion Travels & Tours',
            description: 'Read what our satisfied clients have to say about their experience with Champion Travels & Tours. We value your feedback.',
            keywords: 'Champion Travels reviews, customer testimonials, pilgrim feedback'
        },
        pageBanner: {
            title: 'Client Testimonials',
            subtitle: 'What our valued clients say about us.'
        },
        list: [
                {
                quote: "My Hajj journey with Champion Travels was truly exceptional. The guidance from the scholars and the logistical support were top-notch. I could focus on my worship without any worries.",
                name: "Abdullah Al Mamun",
                title: "Hajj Pilgrim, 2023",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                enabled: true
            },
            {
                quote: "Professional and reliable service for visa processing. I got my tourist visa for Dubai within a very short time. Highly recommended!",
                name: "Fatema Begum",
                title: "Tourist",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                enabled: true
            },
                {
                quote: "The Umrah package was very well organized. Hotels were close to the Haram as promised. The Ziyarat tours were informative. JazakAllah Khair to the entire team.",
                name: "Mohammad Ali",
                title: "Umrah Pilgrim, 2024",
                avatar: "https://randomuser.me/api/portraits/men/67.jpg",
                enabled: true
            }
        ]
    },
    contact: {
        seo: {
            title: 'Contact Us | Champion Travels & Tours',
            description: 'Get in touch with Champion Travels & Tours. Visit our office in Dhaka, call us, or send an email for your travel inquiries. We are here to help you.',
            keywords: 'Contact Champion Travels, travel agency Dhaka, travel agency address'
        },
        pageBanner: {
            title: 'Get In Touch',
            subtitle: 'Have questions or ready to book your next journey? Contact us today!'
        },
        infoTitle: 'Contact Information',
        infoSubtitle: 'Feel free to reach out to us through any of the following methods. Our team is ready to assist you.',
        formTitle: 'Send Us a Message',
        accreditationsTitle: 'Our Accreditations',
        contactInfo: [
            {
                icon: '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />',
                label: 'Address',
                value: 'Paltan China Town, Level #10, East Building, Room No.# E-11-07.67/1 Naya Paltan, VIP Road, Dhaka-1000',
                enabled: true,
            },
            {
                icon: '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />',
                label: 'Phone',
                value: '+8802226663228, +8802226663229, +8801718425042, +8801901922368, +8801901922366',
                enabled: true,
            },
            {
                icon: '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />',
                label: 'Email',
                value: 'championtravels.Dhaka@gmail.com',
                enabled: true,
            }
        ],
        accreditationsImage: 'https://i.postimg.cc/PJS59Bqw/champion-logo-1.png',
        formButtonText: 'Send Message',
        mapUrl: 'https://i.postimg.cc/2SHq11gX/map-placeholder.jpg',
        googleAppsScriptUrl: ''
    },
    whyChooseUs: {
        seo: {
            title: 'Why Choose Us | Champion Travels & Tours',
            description: 'Discover why Champion Travels & Tours is the best choice for your pilgrimage. Expert guides, transparent services, and a board of directors committed to excellence.',
            keywords: 'Why choose Champion Travels, expert Hajj guides, reliable travel agency'
        },
        backgroundImage: 'https://i.postimg.cc/J7Y018f0/bg-pattern.png',
        guides: {
            tagline: 'Spiritual Guidance',
            title: 'Expert Hajj & Umrah Guides',
            description: 'Our team consists of renowned Islamic scholars and experienced guides who provide comprehensive religious guidance throughout your journey.',
            subheading: 'Guided by Knowledge and Experience',
            subDescription: 'We ensure that every ritual is performed correctly according to the Sunnah.',
            buttonText: 'See Packages',
            mainImage: 'https://i.postimg.cc/VkQL0LnX/al.webp',
            secondaryImage: 'https://i.postimg.cc/RZ8BGSpf/aj.webp'
        },
        directors: {
            title: 'Message from Board of Directors',
            description: 'Our leadership team is dedicated to providing a comprehensive and all-in-one experience for every pilgrim.',
            buttonText: 'Meet The Team',
            mainImage: 'https://i.postimg.cc/rwn0QTMc/image.png',
            secondaryImage1: 'https://i.postimg.cc/G3MgC8cQ/image-(2).png',
            secondaryImage2: 'https://i.postimg.cc/0jmsLpT9/image-(1).png',
            decorativeImage: 'https://i.postimg.cc/d1qHbrGz/decorative-gold-line.png'
        },
        services: {
            title: 'Comprehensive Services',
            image: 'https://i.postimg.cc/9QNWStMS/champion-logo-1.png',
            list: ['Visa Processing', 'Flight Booking', 'Hotel Reservations', 'Ground Transport'],
            buttonText: 'Contact Us'
        },
        cta: {
            title: 'Start Your Journey With Us',
            image: 'https://i.postimg.cc/x1gn4TDd/ad.jpg',
            buttonText: 'Book Now'
        },
        footerImage: 'https://i.postimg.cc/FRb9Pz85/mosque-silhouette.png'
    },
    expertHajjGuides: {
            seo: {
            title: 'Expert Hajj Guides | Champion Travels & Tours',
            description: 'Meet our expert Hajj guides who will accompany you on your spiritual journey.',
            keywords: 'Hajj guides, Islamic scholars, Hajj muallim'
        },
        backgroundImage: 'https://i.postimg.cc/J7Y018f0/bg-pattern.png',
            guides: {
            tagline: 'Expert Supervision',
            title: 'Renowned Hajj Guides',
            description: 'We provide experienced Moallims and religious scholars to guide you at every step.',
            subheading: 'Your Spiritual Companions',
            subDescription: 'Learn the rituals and perform Hajj with confidence under expert supervision.',
            buttonText: 'View Hajj Packages',
            mainImage: 'https://i.postimg.cc/VkQL0LnX/al.webp',
            secondaryImage: 'https://i.postimg.cc/RZ8BGSpf/aj.webp'
        },
        directors: {
            title: 'Committed to Service',
            description: 'Our management ensures that the best guides are selected for your assistance.',
            buttonText: 'About Us',
            mainImage: 'https://i.postimg.cc/rwn0QTMc/image.png',
            secondaryImage1: 'https://i.postimg.cc/G3MgC8cQ/image-(2).png',
            secondaryImage2: 'https://i.postimg.cc/0jmsLpT9/image-(1).png',
            decorativeImage: 'https://i.postimg.cc/d1qHbrGz/decorative-gold-line.png'
        },
        services: {
            title: 'Guidance Services',
            image: 'https://i.postimg.cc/9QNWStMS/champion-logo-1.png',
            list: ['Pre-Hajj Seminars', 'On-site Guidance', 'Q&A Sessions', 'Group Duas'],
            buttonText: 'Contact for Details'
        },
            cta: {
            title: 'Perform Hajj with Confidence',
            image: 'https://i.postimg.cc/x1gn4TDd/ad.jpg',
            buttonText: 'Book Your Package'
        },
        footerImage: 'https://i.postimg.cc/FRb9Pz85/mosque-silhouette.png'
    },
    whyChooseChampion: {
        seo: {
            title: 'Why Choose Champion Travels',
            description: 'Reasons to choose Champion Travels for your next trip.',
            keywords: 'Champion Travels features, best travel agency'
        },
        en: {
            title: 'Why Choose Champion Travels?',
            subtitle: 'We go above and beyond to ensure your journey is comfortable and spiritually rewarding.',
            sections: [
                {
                    icon: 'Time',
                    title: 'Experience & Reliability',
                    description: 'Over 10 years of experience in serving pilgrims with a proven track record.',
                    enabled: true
                },
                    {
                    icon: 'Guidance',
                    title: 'Expert Guidance',
                    description: 'Accompanied by knowledgeable scholars to guide you through rituals.',
                    enabled: true
                },
                    {
                    icon: 'AllInOne',
                    title: 'All-in-One Service',
                    description: 'From visa to accommodation, we handle everything for you.',
                    enabled: true
                },
                    {
                    icon: 'Success',
                    title: 'Customer Satisfaction',
                    description: 'Thousands of satisfied clients who trust us for their travel needs.',
                    enabled: true
                },
                    {
                    icon: 'Transparent',
                    title: 'Transparency',
                    description: 'No hidden charges. We deliver what we promise.',
                    enabled: true
                },
                    {
                    icon: 'Support',
                    title: '24/7 Support',
                    description: 'Our team is always available to assist you during your trip.',
                    enabled: true
                }
            ]
        },
        bn: {
            title: 'কেন চ্যাম্পিয়ন ট্রাভেলস বেছে নেবেন?',
            subtitle: 'আপনার যাত্রা আরামদায়ক এবং আধ্যাত্মিকভাবে ফলপ্রসূ করতে আমরা প্রতিশ্রুতিবদ্ধ।',
            sections: [
                    {
                    icon: 'Time',
                    title: 'অভিজ্ঞতা ও নির্ভরযোগ্যতা',
                    description: 'হাজীদের সেবায় ১০ বছরেরও বেশি অভিজ্ঞতা এবং প্রমানিত রেকর্ড।',
                    enabled: true
                },
                    {
                    icon: 'Guidance',
                    title: 'বিশেষজ্ঞ নির্দেশনা',
                    description: 'হজ ও ওমরাহ পালনে অভিজ্ঞ আলেমদের দ্বারা পরিচালিত।',
                    enabled: true
                },
                    {
                    icon: 'AllInOne',
                    title: 'এক ছাদের নিচে সব সেবা',
                    description: 'ভিসা থেকে শুরু করে আবাসন, সব দায়িত্ব আমাদের।',
                    enabled: true
                },
                    {
                    icon: 'Success',
                    title: 'গ্রাহক সন্তুষ্টি',
                    description: 'হাজার হাজার সন্তুষ্ট গ্রাহক যারা আমাদের ওপর আস্থা রাখেন।',
                    enabled: true
                },
                    {
                    icon: 'Transparent',
                    title: 'স্বচ্ছতা',
                    description: 'কোনো গোপন খরচ নেই। আমরা যা বলি, তাই করি।',
                    enabled: true
                },
                    {
                    icon: 'Support',
                    title: '২৪/৭ সহায়তা',
                    description: 'ভ্রমণকালে যেকোনো প্রয়োজনে আমাদের দল সর্বদা আপনার পাশে।',
                    enabled: true
                }
            ]
        }
    },
    // --- NEW: Ziyarat Data ---
    ziyarat: {
        makkah: [
            {
                title: 'Jabal Al-Nour (Cave Hira)',
                subtitle: 'The Dawn of Revelation',
                desc: 'Jabal Al-Nour, meaning "Mountain of Light", houses the Cave of Hira. It is here that the Prophet Muhammad (PBUH) spent time in seclusion and received the first revelation of the Holy Quran from Archangel Jibreel (AS). The climb offers a spiritual connection to the very beginning of Islam.',
                img: 'https://i.postimg.cc/RZ8BGSpf/aj.webp',
                significance: 'First Revelation'
            },
            {
                title: 'Jabal Thawr',
                subtitle: 'The Sanctuary of Migration',
                desc: 'This mountain contains the Cave of Thawr, a small rocky opening where the Prophet (PBUH) and his companion Abu Bakr (RA) hid from the Quraish tribe for three days during the migration (Hijrah) to Madinah. It is a symbol of divine protection and trust in Allah.',
                img: 'https://i.postimg.cc/x1gn4TDd/ad.jpg',
                significance: 'Refuge during Hijrah'
            },
            {
                title: 'Jannat al-Mualla',
                subtitle: 'Cemetery of the Beloved',
                desc: 'Also known as Al-Hajun, this is the historical cemetery in Makkah. It is the resting place of many of the Prophet\'s (PBUH) ancestors, including his grandfather Abdul Muttalib, his uncle Abu Talib, and his beloved wife Khadija (RA).',
                img: 'https://i.postimg.cc/VkQL0LnX/al.webp',
                significance: 'Resting place of Khadija (RA)'
            }
        ],
        madinah: [
            {
                title: 'Masjid Quba',
                subtitle: 'The First Mosque of Islam',
                desc: 'Masjid Quba occupies a unique place in Islamic history as the first mosque built by the Prophet (PBUH) upon his arrival in Madinah. The Prophet (PBUH) said: "Whoever purifies himself in his house, then comes to the mosque of Quba and prays two Rakats therein, will have a reward like that of an Umrah."',
                img: 'https://i.postimg.cc/RZ8BGSpf/aj.webp',
                significance: 'Reward of an Umrah'
            },
            {
                title: 'Mount Uhud',
                subtitle: 'Mountain of Paradise',
                desc: 'Uhud is a mountain north of Madinah. It was the site of the Battle of Uhud. The Prophet (PBUH) declared, "Uhud is a mountain which loves us and which we love." It is also the resting place of 70 martyrs, including Hamza ibn Abdul-Muttalib (RA).',
                img: 'https://i.postimg.cc/mD2wzRfY/hajj-b.jpg',
                significance: 'Martyrs of Uhud'
            },
            {
                title: 'Masjid Al-Qiblatayn',
                subtitle: 'Mosque of Two Qiblas',
                desc: 'This mosque is historically significant because it is where the revelation of the Quran came to change the direction of the Qibla from Bayt al-Maqdis in Jerusalem to the Kaaba in Makkah. It uniquely contained two prayer niches (mihrabs) in the past.',
                img: 'https://i.postimg.cc/50rQG1f5/umrah-2.jpg',
                significance: 'Change of Qibla'
            }
        ]
    },
    // -----------------------------
    umrahGuide: {
            seo: {
            title: 'Umrah Guide (Bangla) | Champion Travels',
            description: 'Complete step-by-step Umrah guide in Bangla.',
            keywords: 'Umrah guide bangla, umrah niyom'
        },
        pageBanner: {
            title: 'ওমরাহ গাইড',
            subtitle: 'সহজ ও সঠিক নিয়মে ওমরাহ পালনের পূর্ণাঙ্গ নির্দেশিকা'
        },
        stepsTitle: 'ওমরাহ পালনের ধাপসমূহ',
        stepsIntro: 'ওমরাহ পালনের জন্য ৪টি প্রধান কাজ বা রুকন রয়েছে। নিচে বিস্তারিত আলোচনা করা হলো।',
        steps: [
            {
                title: '১. ইহরাম বাঁধা',
                description: 'মিকাত অতিক্রম করার আগেই ইহরামের কাপড় পরিধান করা এবং ওমরাহর নিয়ত করা।',
                points: ['গোসল বা ওজু করে পরিষ্কার পরিচ্ছন্ন হন।', 'সেলাইবিহীন দুইটি সাদা কাপড় পরিধান করুন (পুরুষদের জন্য)।', 'দুই রাকাত নামাজ পড়ুন।', 'ওমরাহর নিয়ত করুন এবং তালবিয়া পাঠ শুরু করুন।'],
                arabicText: 'লাব্বাইক আল্লাহুম্মা ওমরাতান',
                arabicMeaning: 'হে আল্লাহ! আমি ওমরাহর জন্য উপস্থিত হয়েছি।',
                enabled: true
            },
            {
                title: '২. তাওয়াফ করা',
                description: 'পবিত্র কাবা শরীফের চারপাশ ৭ বার প্রদক্ষিণ করা।',
                points: ['হাজরে আসওয়াদ থেকে তাওয়াফ শুরু করুন।', 'প্রতি চক্করে হাজরে আসওয়াদকে চুম্বন বা ইশারা করুন।', 'তাওয়াফ শেষে মাকামে ইব্রাহিমের পেছনে দুই রাকাত নামাজ পড়ুন।'],
                enabled: true
            },
                {
                title: '৩. সাঈ করা',
                description: 'সাফা ও মারওয়া পাহাড়ের মধ্যে ৭ বার আসা-যাওয়া করা।',
                points: ['সাফা পাহাড় থেকে শুরু করুন।', 'মারওয়া পাহাড়ে গিয়ে শেষ করুন।', 'মোট ৭টি চক্কর পূর্ণ করুন।'],
                enabled: true
            },
                {
                title: '৪. মাথা মুণ্ডন বা চুল ছোট করা',
                description: 'সাঈ শেষ করার পর পুরুষরা মাথা মুণ্ডন করবেন বা চুল ছোট করবেন। মহিলারা চুলের আগা সামান্য কাটবেন।',
                points: ['এর মাধ্যমে ওমরাহর কাজ সমাপ্ত হয় এবং ইহরাম থেকে মুক্ত হওয়া যায়।'],
                enabled: true
            }
        ],
        dosAndDonts: {
            title: 'করণীয় ও বর্জনীয়',
            intro: 'ওমরাহ পালনের সময় কিছু বিষয় মেনে চলা জরুরি এবং কিছু বিষয় থেকে বিরত থাকতে হয়।',
            dos: {
                title: 'করণীয়',
                items: ['বেশি বেশি তালবিয়া পাঠ করা।', 'ধৈর্য ধারণ করা ও ঝগড়া-বিবাদ এড়িয়ে চলা।', 'পাঁচ ওয়াক্ত নামাজ জামাতের সাথে আদায় করা।']
            },
            donts: {
                title: 'বর্জনীয়',
                items: ['ইহরাম অবস্থায় সুগন্ধি ব্যবহার করা।', 'নখ বা চুল কাটা।', 'শিকার করা বা গাছের ডালপালা ভাঙা।']
            },
            images: ['https://i.postimg.cc/R0N8Mv8X/as.jpg', 'https://i.postimg.cc/Bb92VfRP/ag.webp'],
            note: 'শারীরিক অসুস্থতা বা বিশেষ প্রয়োজনে অভিজ্ঞ আলেম বা গাইডদের পরামর্শ নিন।'
        },
        faq: {
            title: 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী',
            items: [
                { question: 'ওমরাহ করতে কত দিন সময় লাগে?', answer: 'ওমরাহর মূল কাজগুলো ৩-৪ ঘণ্টার মধ্যে সম্পন্ন করা সম্ভব। তবে প্যাকেজের মেয়াদ অনুযায়ী ৭, ১০ বা ১৪ দিন অবস্থান করা হয়।', enabled: true },
                { question: 'মহিলারা কি একাকী ওমরাহ করতে পারেন?', answer: 'শরীয়তের বিধান অনুযায়ী মহিলাদের সাথে মাহরাম (স্বামী বা যার সাথে বিবাহ হারাম) থাকা আবশ্যক। তবে বর্তমান সৌদি আইন ও নির্দিষ্ট শর্তসাপেক্ষে ৪৫ বছরের বেশি বয়সী মহিলারা দলের সাথে যেতে পারেন।', enabled: true }
            ]
        },
        cta: {
            title: 'ওমরাহ বুকিং বা বিস্তারিত জানতে যোগাযোগ করুন',
            buttonText: 'বুকিং দিন'
        }
    },
    hajjGuide: {
            seo: {
            title: 'Hajj Guide (Bangla) | Champion Travels',
            description: 'Complete step-by-step Hajj guide in Bangla.',
            keywords: 'Hajj guide bangla, hajj niyom'
        },
        pageBanner: {
            title: 'হজ্জ গাইড',
            subtitle: 'হজ্জের প্রকারভেদ, ফরজ, ওয়াজিব ও বিস্তারিত নিয়মাবলী'
        },
        types: {
            title: 'হজ্জের প্রকারভেদ',
            intro: 'হজ্জ প্রধানত তিন প্রকার। আপনার সুবিধামতো যেকোনো একটি পদ্ধতিতে হজ্জ পালন করতে পারেন।',
            list: [
                { title: '১. হজ্জে তামাত্তু', description: 'হজ্জের মাসসমূহে ওমরাহর ইহরাম বেঁধে ওমরাহ পালন করে হালাল হয়ে যাওয়া। এরপর ৮ই জিলহজ্জ হজ্জের ইহরাম বেঁধে হজ্জ পালন করা। এটি বাংলাদেশি হাজীদের জন্য সবচেয়ে সুবিধাজনক।', enabled: true },
                { title: '২. হজ্জে কিরান', description: 'একই ইহরামে ওমরাহ ও হজ্জ পালন করা। ওমরাহ পালনের পর ইহরাম খোলা যায় না, হজ্জ শেষ না হওয়া পর্যন্ত ইহরাম অবস্থায় থাকতে হয়। এটি বেশ কষ্টসাধ্য।', enabled: true },
                { title: '৩. হজ্জে ইফরাদ', description: 'শুধুমাত্র হজ্জের নিয়ত করে ইহরাম বাঁধা। এতে ওমরাহ অন্তর্ভুক্ত থাকে না। মক্কাবাসীরা সাধারণত এই হজ্জ করেন।', enabled: true }
            ]
        },
        faraj: {
            title: 'হজ্জের ফরজ কাজসমূহ',
            intro: 'হজ্জের ৩টি ফরজ কাজ রয়েছে। এর কোনো একটি বাদ পড়লে হজ্জ আদায় হবে না।',
            list: [
                { title: '১. ইহরাম বাঁধা', description: 'নির্দিষ্ট মিকাত থেকে হজ্জের নিয়ত করে ইহরামের কাপড় পরিধান করা।', enabled: true },
                { title: '২. আরাফাতের ময়দানে অবস্থান', description: '৯ই জিলহজ্জ দুপুরের পর থেকে সূর্যাস্ত পর্যন্ত আরাফাতের ময়দানে অবস্থান করা। এটি হজ্জের মূল রুকন।', enabled: true },
                { title: '৩. তাওয়াফে জিয়ারত', description: '১০ই জিলহজ্জ থেকে ১২ই জিলহজ্জ সূর্যাস্তের মধ্যে কাবা শরীফ তাওয়াফ করা।', enabled: true }
            ]
        },
        wajib: {
            title: 'হজ্জের ওয়াজিব কাজসমূহ',
            intro: 'হজ্জের ওয়াজিব কাজ ৬টি। কোনোটি বাদ পড়লে দম (কোরবানি) দিতে হবে।',
            list: [
                { title: '১. মুজদালিফায় অবস্থান', description: '৯ই জিলহজ্জ দিবাগত রাতে মুজদালিফায় অবস্থান করা।', enabled: true },
                { title: '২. সাঈ করা', description: 'সাফা ও মারওয়া পাহাড়ের মাঝে ৭ বার সাঈ করা।', enabled: true },
                { title: '৩. রমি করা (পাথর নিক্ষেপ)', description: 'জামারাতে শয়তানকে পাথর নিক্ষেপ করা।', enabled: true },
                { title: '৪. কোরবানি করা', description: 'কিরান ও তামাত্তু হজ্জকারীদের জন্য কোরবানি করা ওয়াজিব।', enabled: true },
                { title: '৫. মাথা মুণ্ডন বা চুল ছোট করা', description: 'হজ্জের কাজ শেষে ইহরাম থেকে মুক্ত হওয়ার জন্য চুল কাটা।', enabled: true },
                { title: '৬. বিদায়ী তাওয়াফ', description: 'মক্কা ত্যাগ করার পূর্বে বিদায়ী তাওয়াফ করা (মক্কাবাসীদের জন্য নয়)।', enabled: true }
            ]
        },
        dosAndDonts: {
            title: 'হজ্জের সময় করণীয়',
            intro: 'হজ্জের সফর দীর্ঘ ও কষ্টসাধ্য হতে পারে। তাই ধৈর্য ও সহনশীলতা একান্ত কাম্য।',
            dos: {
                title: 'করণীয়',
                items: ['সর্বদা আল্লাহর জিকির করা।', 'অন্য হাজীদের সাহায্য করা।', 'গাইড বা মোয়াল্লেমের নির্দেশনা মেনে চলা।']
            },
            donts: {
                title: 'বর্জনীয়',
                items: ['অপ্রয়োজনীয় কেনাকাটায় সময় নষ্ট করা।', 'কারো সাথে তর্কে লিপ্ত হওয়া।', 'নিষিদ্ধ কাজ করা।']
            },
            images: ['https://i.postimg.cc/R0N8Mv8X/as.jpg', 'https://i.postimg.cc/Bb92VfRP/ag.webp', 'https://i.postimg.cc/VkQL0LnX/al.webp'],
            note: 'হজ্জের মাসায়েল সম্পর্কে ভালো করে জেনে নিন অথবা অভিজ্ঞ আলেমের সাথে থাকুন।'
        },
        faq: {
            title: 'প্রশ্ন ও উত্তর',
            items: [
                { question: 'হজ্জ ও ওমরাহর মধ্যে পার্থক্য কী?', answer: 'হজ্জ নির্দিষ্ট সময়ে (জিলহজ্জ মাসে) ফরজ ইবাদত, আর ওমরাহ বছরের যেকোনো সময় করা যায় এবং এটি সুন্নাত। হজ্জে আরাফাত, মুজদালিফা ও মিনার কাজ আছে, যা ওমরাহতে নেই।', enabled: true },
                { question: 'বদলি হজ্জ কী?', answer: 'শারীরিকভাবে অক্ষম বা মৃত ব্যক্তির পক্ষ থেকে অন্য কেউ হজ্জ আদায় করাকে বদলি হজ্জ বলে।', enabled: true }
            ]
        },
        cta: {
            title: 'হজ্জ প্যাকেজ সম্পর্কে জানতে যোগাযোগ করুন',
            buttonText: 'প্যাকেজ দেখুন'
        }
    },
    blog: {
        seo: {
            title: 'Hajj & Umrah Blog | Tips, Guides & Updates | Champion Travels',
            description: 'Read the latest tips, guides, and news about Hajj, Umrah, and travel preparations. Expert advice to make your journey smooth and spiritual.',
            keywords: 'Hajj blog, Umrah tips, travel guide, Islamic blog, pilgrimage tips'
        },
        pageBanner: {
            title: 'Champion Blog & Insights',
            subtitle: 'Expert advice, travel tips, and spiritual guides for your Hajj and Umrah journey.',
            backgroundImage: 'https://i.postimg.cc/CL6k3832/ak.jpg'
        },
        posts: [
            {
                id: '1',
                title: 'Top 10 Essential Items for Hajj & Umrah Packing',
                excerpt: 'Packing for Hajj or Umrah can be overwhelming. Here is a curated list of essentials you must not forget.',
                image: 'https://i.postimg.cc/3R91yY2B/umrah-1.jpg',
                author: 'Champion Travels Team',
                date: 'October 15, 2023',
                content: `
<h3>The Importance of Smart Packing</h3>
<p>Embarking on a pilgrimage to Makkah and Madinah is a journey of a lifetime. While spiritual preparation is paramount, physical preparation is also crucial for a smooth experience. Packing light but smart is the key.</p>

<h3>Essential Items Checklist</h3>
<ul>
    <li><strong>Ihram Clothing:</strong> For men, two pieces of white, unstitched cloth. For women, modest clothing that covers the body.</li>
    <li><strong>Comfortable Footwear:</strong> You will be walking a lot. Bring broken-in walking shoes and a pair of sandals.</li>
    <li><strong>Personal Hygiene Kit:</strong> Unscented soap, shampoo, and wipes (essential while in Ihram).</li>
    <li><strong>Basic Medicines:</strong> Painkillers, bandages, and any prescription medication you need.</li>
    <li><strong>Power Bank & Universal Adapter:</strong> To keep your devices charged.</li>
    <li><strong>Small Shoulder Bag/Backpack:</strong> To carry water, Quran, and shoes when entering the mosque.</li>
</ul>
<p>Remember, the goal is to focus on your worship, not worry about missing items.</p>
`,
                enabled: true
            },
            {
                id: '2',
                title: 'Understanding the 3 Types of Hajj',
                excerpt: 'Confused about Hajj-e-Tamattu, Hajj-e-Qiran, and Hajj-e-Ifrad? We break down the differences simply.',
                image: 'https://i.postimg.cc/VkQL0LnX/al.webp',
                author: 'Mufti Abdul Malek',
                date: 'November 02, 2023',
                content: `
<h3>Which Hajj Should You Perform?</h3>
<p>There are three methods of performing Hajj. Choosing the right one depends on your arrival time in Makkah and your personal preference.</p>

<h4>1. Hajj-e-Tamattu</h4>
<p>This is the most common type for pilgrims traveling from abroad (like Bangladesh). It involves performing Umrah first during the Hajj months, then exiting Ihram, and re-entering Ihram for Hajj on the 8th of Dhul-Hijjah. It requires a sacrifice (Qurbani).</p>

<h4>2. Hajj-e-Qiran</h4>
<p>This involves combining Hajj and Umrah with a single Ihram. The pilgrim remains in the state of Ihram after Umrah until Hajj is completed. It is more physically demanding but highly rewarding. It also requires a sacrifice.</p>

<h4>3. Hajj-e-Ifrad</h4>
<p>This is Hajj only, without Umrah. The pilgrim enters Ihram with the intention of Hajj alone. Residents of Makkah usually perform this type. No sacrifice is obligatory.</p>
`,
                enabled: true
            },
            {
                id: '3',
                title: 'Health Tips for a Safe Pilgrimage',
                excerpt: 'Stay healthy and energetic during your Hajj or Umrah with these vital health and nutrition tips.',
                image: 'https://i.postimg.cc/x1gn4TDd/ad.jpg',
                author: 'Dr. Farhana Islam',
                date: 'December 10, 2023',
                content: `
<h3>Stay Hydrated</h3>
<p>The climate in Saudi Arabia is hot and dry. Dehydration is a common issue. Drink plenty of Zamzam water and fluids throughout the day, even if you don't feel thirsty.</p>

<h3>Avoid Heavy Meals</h3>
<p>Before performing strenuous rituals like Tawaf or Sa'i, avoid heavy, oily meals. Opt for fruits, yogurt, and dates which provide sustained energy.</p>

<h3>Protect Yourself from the Sun</h3>
<p>Use an umbrella during the day to avoid heatstroke. Try to perform outdoor rituals early in the morning or late at night when the temperature is cooler.</p>
`,
                enabled: true
            }
        ]
    }
};

export const customPagesData: CustomPage[] = [
    {
        id: '#about-us',
        title: 'About Champion Travels & Tours',
        bannerSubtitle: 'Dedicated to serving the guests of Allah with integrity and excellence.',
        seo: {
            title: 'About Us | Champion Travels & Tours',
            description: 'Learn about Champion Travels & Tours, our mission, vision, and commitment to providing the best Hajj and Umrah services in Bangladesh.',
            keywords: 'About Champion Travels, travel agency mission, best hajj agency'
        },
        contentBlocks: [
            {
                type: 'html',
                content: `
<h3>Our Mission</h3>
<p>To provide comprehensive and hassle-free travel solutions for Hajj, Umrah, and global tourism, ensuring comfort, spiritual satisfaction, and value for money for every client.</p>
<h3>Who We Are</h3>
<p>Champion Travels & Tours is a leading travel agency in Bangladesh, specializing in religious pilgrimage services. With over a decade of experience, we have successfully assisted thousands of pilgrims in fulfilling their spiritual obligations. Our team comprises experienced professionals and religious scholars dedicated to guiding you at every step.</p>
`
            }
        ],
        enabled: true
    },
    {
        id: '#privacy-policy',
        title: 'Privacy Policy',
        bannerSubtitle: 'Your privacy is important to us.',
        seo: {
            title: 'Privacy Policy | Champion Travels & Tours',
            description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
            keywords: 'privacy policy, data protection'
        },
        contentBlocks: [
            {
                type: 'html',
                content: `
<p>At Champion Travels & Tours, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.</p>
<h4>Information We Collect</h4>
<p>We may collect personal information such as your name, contact details, passport information, and payment details when you book a service with us.</p>
<h4>How We Use Your Information</h4>
<p>We use your information to process your bookings, facilitate visa applications, and communicate with you regarding your travel arrangements.</p>
`
            }
        ],
        enabled: true
    },
    {
        id: '#hotel-booking',
        title: 'Luxury Hotel Booking',
        bannerSubtitle: 'Stay in comfort near the Haram.',
        seo: {
            title: 'Hotel Booking Service | Champion Travels',
            description: 'Book luxury hotels in Makkah and Madinah. We offer competitive rates for 5-star, 4-star, and standard hotels.',
            keywords: 'Makkah hotel booking, Madinah hotels, 5 star hotels Makkah'
        },
        contentBlocks: [
            {
                type: 'html',
                content: `
<p>We have established partnerships with leading hotels in Makkah and Madinah to offer you the best rates and convenient locations. Whether you prefer a room with a Kaaba view or a budget-friendly option near the Haram, we have you covered.</p>
<ul>
    <li><strong>Makkah Hotels:</strong> Fairmont Clock Tower, Swissotel, Pullman Zamzam, and more.</li>
    <li><strong>Madinah Hotels:</strong> Anwar Al Madinah, Oberoi, Hilton, and more.</li>
</ul>
`
            },
            {
                type: 'button',
                text: 'Inquire for Hotel Booking',
                href: '#contact?subject=Hotel Booking Inquiry'
            }
        ],
        enabled: true
    },
    {
        id: '#umrah-training',
        title: 'Umrah Training Program',
        bannerSubtitle: 'Learn the rituals before you go.',
        seo: {
            title: 'Umrah Training | Champion Travels',
            description: 'Join our pre-departure Umrah training sessions to learn the correct procedures and rituals of Umrah.',
            keywords: 'Umrah training, Hajj workshop, pilgrimage guide'
        },
        contentBlocks: [
            {
                type: 'html',
                content: `
<p>Proper knowledge is essential for a valid Umrah. We conduct regular training workshops for our pilgrims to educate them about the rituals (Manasik) of Umrah.</p>
<p>Our sessions cover:</p>
<ul>
    <li>How to wear Ihram.</li>
    <li>Rules and prohibitions of Ihram.</li>
    <li>Step-by-step guide to Tawaf and Sa'i.</li>
    <li>Common mistakes to avoid.</li>
</ul>
`
            },
            {
                type: 'button',
                text: 'Register for Next Workshop',
                href: '#contact?subject=Umrah Training Registration'
            }
        ],
        enabled: true
    }
];
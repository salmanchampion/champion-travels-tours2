
import React, { useState } from 'react';
import InteractiveMap from '../components/InteractiveMap';

// Detailed Site Data
const siteDetails = {
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
};

const ZiyaratPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'makkah' | 'madinah'>('makkah');

  return (
    <div className="bg-[#0B0F19] min-h-screen pt-20">
      
      {/* --- Cinematic Hero --- */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0">
             <img 
                src="https://i.postimg.cc/jSKtdnQ4/HD-wallpaper-mecca-madina-during-evening-time-ramzan.jpg" 
                alt="Islamic Heritage" 
                className="w-full h-full object-cover opacity-50 scale-110 animate-[kenBurns_20s_ease-out_infinite_alternate]"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent"></div>
           </div>
           <div className="relative z-10 text-center max-w-5xl px-4">
               <div className="inline-block border border-[var(--color-primary)]/30 px-6 py-2 rounded-full bg-black/30 backdrop-blur-sm mb-6">
                    <span className="text-[var(--color-primary)] text-sm tracking-[0.3em] uppercase font-bold">Historical Ziyarat Tours</span>
               </div>
               <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 drop-shadow-2xl animate-fade-in-up">
                   Echoes of History
               </h1>
               <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
                   Walk in the footsteps of the Prophet (PBUH) and his companions. Witness the sacred landmarks that shaped the history of Islam.
               </p>
           </div>
           <style>{`
             @keyframes kenBurns {
               0% { transform: scale(1); }
               100% { transform: scale(1.1); }
             }
           `}</style>
      </div>

      {/* --- Intro Quote --- */}
      <div className="py-20 container mx-auto px-4 text-center">
          <div className="inline-block p-10 border-y border-[var(--color-primary)]/20 relative max-w-4xl mx-auto">
              <div className="text-3xl md:text-4xl font-display text-gray-300 italic">
                  "Do not undertake a journey except to three Mosques: Al-Masjid Al-Haram, the Mosque of the Messenger (PBUH), and Al-Masjid Al-Aqsa."
              </div>
              <div className="text-[var(--color-primary)] mt-4 font-bold uppercase tracking-widest text-sm">- Sahih Bukhari</div>
          </div>
      </div>

      {/* --- Interactive Map Section (Premium Frame) --- */}
      <section className="py-16 bg-[#111827] relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="mb-12 text-center">
                   <h2 className="text-4xl font-display font-bold text-white">Interactive Exploration</h2>
                   <div className="w-20 h-1 bg-[var(--color-primary)] mx-auto mt-4 rounded-full"></div>
                   <p className="text-[var(--color-muted-text)] mt-4 text-lg">Click on the markers below to discover sacred locations.</p>
              </div>
              
              {/* Gold Frame Container for Map */}
              <div className="p-[2px] bg-gradient-to-b from-[#C5A47E] via-[#8B6E4E] to-[#5D4037] rounded-xl shadow-2xl">
                  <div className="bg-[#0B0F19] rounded-lg overflow-hidden p-1">
                      <InteractiveMap />
                  </div>
              </div>
          </div>
      </section>

      {/* --- Journey Through Time (List View) --- */}
      <section className="py-24 bg-[#0B0F19]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                  <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">Sacred Landmarks</h2>
                  
                  {/* Custom Tab Switcher */}
                  <div className="inline-flex bg-[#1F2937] p-1.5 rounded-full border border-gray-700 shadow-lg">
                      <button 
                        onClick={() => setActiveTab('makkah')}
                        className={`px-8 md:px-12 py-3 rounded-full font-bold text-lg transition-all duration-500 ${activeTab === 'makkah' ? 'bg-[var(--color-primary)] text-white shadow-[0_0_20px_rgba(197,164,126,0.4)]' : 'text-gray-400 hover:text-white'}`}
                      >
                          Makkah
                      </button>
                      <button 
                        onClick={() => setActiveTab('madinah')}
                        className={`px-8 md:px-12 py-3 rounded-full font-bold text-lg transition-all duration-500 ${activeTab === 'madinah' ? 'bg-[var(--color-secondary)] text-black shadow-[0_0_20px_rgba(76,175,80,0.4)]' : 'text-gray-400 hover:text-white'}`}
                      >
                          Madinah
                      </button>
                  </div>
              </div>

              <div className="space-y-24">
                  {siteDetails[activeTab].map((site, index) => (
                      <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center group`} data-aos="fade-up">
                          
                          {/* Image Card */}
                          <div className="lg:w-1/2 w-full">
                              <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-2xl border border-gray-800 group-hover:border-[var(--color-primary)]/50 transition-colors duration-500">
                                  <img src={site.img} alt={site.title} className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                  <div className="absolute top-4 right-4">
                                      <span className="px-4 py-1.5 bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                          {site.significance}
                                      </span>
                                  </div>
                              </div>
                          </div>

                          {/* Text Content */}
                          <div className="lg:w-1/2 w-full">
                              <h3 className="text-4xl font-display font-bold text-white mb-2">{site.title}</h3>
                              <h4 className="text-xl text-[var(--color-primary)] font-serif italic mb-6">{site.subtitle}</h4>
                              <p className="text-lg text-gray-400 leading-relaxed mb-8 border-l-2 border-[var(--color-primary)] pl-6">
                                  {site.desc}
                              </p>
                              <a href="#contact?subject=Ziyarat Inquiry" className="inline-flex items-center space-x-2 text-white font-bold hover:text-[var(--color-primary)] transition-colors group/btn">
                                  <span>Book a Guided Visit</span>
                                  <svg className="w-5 h-5 transform transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                              </a>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20 bg-[var(--color-primary)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/arabesque.png')] opacity-10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Experience History Firsthand</h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                  Join our guided Ziyarat tours led by knowledgeable scholars who bring these historical sites to life.
              </p>
              <a 
                href="#contact?subject=Book Ziyarat Tour" 
                className="inline-block bg-white text-[var(--color-primary)] font-bold py-4 px-12 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl transform hover:-translate-y-1"
              >
                  Reserve Your Seat
              </a>
          </div>
      </section>

    </div>
  );
};

export default ZiyaratPage;

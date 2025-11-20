import React, { useContext } from 'react';
import PageBanner from '../components/PageBanner';
import TeamMemberCard from '../components/TeamMemberCard';
import { DataContext } from '../contexts/DataContext';

const DecorativeLine: React.FC = () => (
    <div className="flex justify-center items-center my-4">
        <div className="h-px bg-gray-600 w-16"></div>
        <img src="https://i.postimg.cc/d1qHbrGz/decorative-gold-line.png" alt="decorative element" className="h-8 mx-4" />
        <div className="h-px bg-gray-600 w-16"></div>
    </div>
);


const TeamPage: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { pageBanner, chairman, talentedEmployees, chairmanTitle, employeesTitle, employeesSubtitle } = appData.pages.team;
    
    const visibleEmployees = talentedEmployees.filter(member => member.enabled);

  return (
    <div className="pt-20 bg-[var(--color-dark-bg)]">
        <PageBanner
            title={pageBanner.title}
            subtitle={pageBanner.subtitle}
        />

        <section className="py-20 bg-[var(--color-dark-bg)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Honourable Chairman */}
                {chairman.enabled && (
                    <>
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-light-text)]">{chairmanTitle}</h2>
                            <DecorativeLine />
                        </div>
                        <div className="max-w-xs mx-auto mb-20">
                            <TeamMemberCard {...chairman} />
                        </div>
                    </>
                )}

                {/* Talented Employees */}
                <div id="talented-employee" className="text-center mb-16 scroll-mt-20">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-light-text)]">{employeesTitle}</h2>
                     <p className="mt-4 text-lg text-[var(--color-muted-text)] max-w-3xl mx-auto">{employeesSubtitle}</p>
                    <DecorativeLine />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {visibleEmployees.map((member) => (
                        <TeamMemberCard key={member.name} {...member} />
                    ))}
                </div>
            </div>
        </section>
    </div>
  );
};

export default TeamPage;
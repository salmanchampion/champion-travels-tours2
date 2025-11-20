import React from 'react';

// Social Icon SVGs
const FacebookIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z"/></svg>;
const PhoneIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.02.74-.25 1.02l-2.2 2.2z"></path></svg>;
const WhatsAppIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.45L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.803 6.22l-1.02 3.712 3.745-1.017z"></path></svg>;
const EmailIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>;

interface SocialLinkProps {
  href: string;
  bgColor: string;
  icon: React.ReactNode;
  name: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, bgColor, icon, name }) => (
  <div className="relative group">
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center w-8 h-8 rounded-full text-white ${bgColor} transition-transform hover:scale-110`}
    >
      {icon}
    </a>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--color-dark-bg)] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
      {name}
      <svg className="absolute text-[var(--color-dark-bg)] h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
    </div>
  </div>
);

interface TeamMemberCardProps {
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
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ name, role, imageUrl, title, socials }) => {
  return (
    <div className="bg-white rounded-[var(--ui-border-radius)] shadow-[var(--ui-shadow)] overflow-hidden text-center transform hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
      <div className="flex-shrink-0">
        <img src={imageUrl} alt={name} className="w-full h-64 object-cover object-top" />
      </div>
      <div className="p-4 bg-gradient-to-t from-amber-500 to-amber-400 flex-grow flex flex-col justify-center">
        <h3 className="text-xl font-bold text-[var(--color-dark-bg)] font-display">{name}</h3>
        {title && <p className="text-md text-gray-900 font-semibold">{title}</p>}
        <p className="text-sm text-gray-800 font-medium uppercase">{role}</p>
      </div>
      <div className="bg-white p-3">
        <div className="flex justify-center space-x-3">
          {socials?.email && <SocialLink href={`mailto:${socials.email}`} bgColor="bg-gray-600" icon={<EmailIcon />} name="Email" />}
          {socials?.facebook && <SocialLink href={socials.facebook} bgColor="bg-blue-600" icon={<FacebookIcon />} name="Facebook" />}
          {socials?.phone && <SocialLink href={`tel:${socials.phone}`} bgColor="bg-blue-500" icon={<PhoneIcon />} name="Phone" />}
          {socials?.whatsapp && <SocialLink href={`https://wa.me/${socials.whatsapp.replace(/\+/g, '')}`} bgColor="bg-green-500" icon={<WhatsAppIcon />} name="WhatsApp" />}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
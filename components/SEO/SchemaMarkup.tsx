
import React, { useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';

const SchemaMarkup: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { contact } = appData.pages;
  const siteName = appData.globalConfig?.siteIdentity?.siteName || 'Champion Travels & Tours';
  const logoUrl = appData.site.logoUrl;
  
  const config = appData.globalConfig?.seoSchema;

  if (config && !config.enabled) return null;

  // Extract phone and address
  const phone = contact.contactInfo.find(c => c.label === 'Phone')?.value.split(',')[0] || '+8801718425042';
  const address = contact.contactInfo.find(c => c.label === 'Address')?.value || 'Dhaka, Bangladesh';

  const socialLinks = config?.sameAs?.length ? config.sameAs : appData.header.socialLinks?.map(link => link.href) || [];

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": config?.organizationType || "TravelAgency",
    "name": siteName,
    "image": logoUrl,
    "@id": window.location.origin,
    "url": window.location.origin,
    "telephone": phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
      "addressLocality": "Dhaka",
      "postalCode": "1000",
      "addressCountry": "BD"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.7340, // Approx Dhaka
      "longitude": 90.4120
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday"
      ],
      "opens": "09:00",
      "closes": "20:00"
    },
    "sameAs": socialLinks
  };

  // Product Schema for Hajj Packages
  const hajjProductSchemas = appData.hajjPackages
    .filter(pkg => pkg.enabled)
    .map(pkg => ({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": pkg.name,
      "image": pkg.image,
      "description": pkg.shortDescription,
      "brand": {
        "@type": "Brand",
        "name": siteName
      },
      "offers": {
        "@type": "Offer",
        "url": `${window.location.origin}/#hajj`,
        "priceCurrency": "BDT",
        "price": pkg.price.replace(/[^0-9]/g, ''), // Extract numeric value roughly
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2025-12-31"
      }
    }));

  // Product Schema for Umrah Packages
  const umrahProductSchemas = appData.umrahPackages
    .filter(pkg => pkg.enabled)
    .map(pkg => ({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": pkg.name,
      "image": pkg.image,
      "description": pkg.shortDescription,
      "brand": {
        "@type": "Brand",
        "name": siteName
      },
      "offers": {
        "@type": "Offer",
        "url": `${window.location.origin}/#umrah`,
        "priceCurrency": "BDT",
        "price": pkg.price.replace(/[^0-9]/g, ''),
        "availability": "https://schema.org/InStock"
      }
    }));

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      {hajjProductSchemas.map((schema, index) => (
        <script key={`hajj-schema-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      {umrahProductSchemas.map((schema, index) => (
        <script key={`umrah-schema-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </>
  );
};

export default SchemaMarkup;

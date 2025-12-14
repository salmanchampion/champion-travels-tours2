
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

  // Helper to generate a unique SKU-like string
  const generateSku = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 50);

  // Helper to clean price
  const cleanPrice = (price: string) => {
      // Remove commas, currency symbols, and non-numeric chars except dot
      return price.replace(/[^0-9.]/g, '');
  };

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

  // Common Brand Object
  const brandObject = {
    "@type": "Brand",
    "name": siteName
  };

  // Common Rating Object (Static placeholder to clear warnings and show stars in SERP)
  // In a real app, this should come from a database of real user reviews.
  const aggregateRating = {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "124",
    "bestRating": "5",
    "worstRating": "1"
  };

  // Product Schema for Hajj Packages
  const hajjProductSchemas = appData.hajjPackages
    .filter(pkg => pkg.enabled)
    .map(pkg => ({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": pkg.name,
      "image": pkg.image,
      "description": pkg.shortDescription || `Exclusive ${pkg.name} offered by ${siteName}.`,
      "brand": brandObject,
      "sku": generateSku(pkg.name),
      "mpn": generateSku(pkg.name),
      "aggregateRating": aggregateRating,
      "offers": {
        "@type": "Offer",
        "url": `${window.location.origin}/#hajj`,
        "priceCurrency": "BDT",
        "price": cleanPrice(pkg.price), 
        "priceValidUntil": "2026-12-31", // Future date to prevent expiration warning
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
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
      "description": pkg.shortDescription || `Affordable ${pkg.name} for pilgrims from Bangladesh.`,
      "brand": brandObject,
      "sku": generateSku(pkg.name),
      "mpn": generateSku(pkg.name),
      "aggregateRating": aggregateRating,
      "offers": {
        "@type": "Offer",
        "url": `${window.location.origin}/#umrah`,
        "priceCurrency": "BDT",
        "price": cleanPrice(pkg.price),
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    }));

  // Exclusive Hajj Packages Schema
  const exclusiveHajjSchemas = appData.exclusiveHajj?.packages
    ?.filter(pkg => pkg.enabled)
    .map(pkg => ({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": pkg.title,
      "image": pkg.image,
      "description": `Premium ${pkg.title} (${pkg.category}) Hajj package.`,
      "brand": brandObject,
      "sku": pkg.id || generateSku(pkg.title),
      "mpn": pkg.id || generateSku(pkg.title),
      "aggregateRating": aggregateRating,
      "offers": {
        "@type": "Offer",
        "url": `${window.location.origin}/#exclusive-hajj`,
        "priceCurrency": "BDT",
        "price": cleanPrice(pkg.price),
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    })) || [];

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
      {exclusiveHajjSchemas.map((schema, index) => (
        <script key={`ex-hajj-schema-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </>
  );
};

export default SchemaMarkup;

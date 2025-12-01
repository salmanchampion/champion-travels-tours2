
export const printPackage = (pkg: any, logoUrl: string, contactInfo: any[]) => {
    const printWindow = window.open('', '', 'width=900,height=800');
    if (!printWindow) return;

    const contactPhone = contactInfo.find(c => c.label === 'Phone')?.value || '';
    const contactEmail = contactInfo.find(c => c.label === 'Email')?.value || '';
    const address = contactInfo.find(c => c.label === 'Address')?.value || '';

    // Handle feature list (Exclusive packages use 'features', Legacy uses 'special' string)
    let featuresHtml = '';
    if (Array.isArray(pkg.features)) {
        featuresHtml = `<ul class="features-list">${pkg.features.map((f: string) => `<li>${f}</li>`).join('')}</ul>`;
    } else if (pkg.special) {
        featuresHtml = `<p class="special-note"><strong>Special Services:</strong> ${pkg.special}</p>`;
    }

    // Handle hotels
    const makkahHotel = pkg.makkahHotel || pkg.hotelMakkah || 'N/A';
    const madinahHotel = pkg.madinahHotel || pkg.hotelMadinah || 'N/A';

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${pkg.title || pkg.name} - Brochure</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap');
                body { font-family: 'Hind Siliguri', sans-serif; padding: 40px; color: #333; line-height: 1.6; max-width: 800px; mx-auto; }
                .header { text-align: center; border-bottom: 2px solid #C5A47E; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { height: 80px; margin-bottom: 10px; }
                .company-name { color: #C5A47E; font-size: 28px; margin: 0; font-weight: bold; text-transform: uppercase; }
                .contact-info { font-size: 12px; color: #666; margin-top: 5px; }
                
                .package-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; background: #f9f9f9; p: 20px; border-radius: 8px; }
                .package-title { font-size: 26px; color: #111827; margin: 0 0 5px 0; }
                .package-category { background: #C5A47E; color: white; padding: 4px 12px; border-radius: 15px; font-size: 12px; display: inline-block; margin-bottom: 10px;}
                .package-price { font-size: 28px; font-weight: bold; color: #C5A47E; }
                .package-duration { font-size: 14px; color: #666; font-weight: bold; }

                .main-image { width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 30px; }
                
                .grid-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                .info-box { background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #C5A47E; }
                .info-label { font-size: 12px; text-transform: uppercase; color: #666; font-weight: bold; display: block; margin-bottom: 4px; }
                .info-value { font-size: 16px; font-weight: 600; color: #333; }

                .features-section { margin-bottom: 30px; }
                .section-title { font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 15px; color: #C5A47E; font-weight: bold; }
                .features-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0; list-style: none; }
                .features-list li { background: #fff; border: 1px solid #eee; padding: 10px; border-radius: 4px; display: flex; align-items: center; }
                .features-list li:before { content: '✓'; color: #C5A47E; margin-right: 10px; font-weight: bold; }
                .special-note { font-style: italic; color: #555; background: #fff8e1; padding: 10px; border-radius: 4px; }

                .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
                .print-btn { display: block; width: 100%; padding: 15px; background: #C5A47E; color: white; text-align: center; text-decoration: none; font-weight: bold; font-size: 18px; margin-bottom: 20px; border-radius: 8px; cursor: pointer; border: none; }
                @media print {
                    .print-btn { display: none; }
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            <button onclick="window.print()" class="print-btn">Click Here to Print / Save as PDF</button>
            
            <div class="header">
                <img src="${logoUrl}" class="logo" alt="Logo" />
                <h1 class="company-name">Champion Travels & Tours</h1>
                <div class="contact-info">
                    ${address}<br/>
                    Phone: ${contactPhone} | Email: ${contactEmail}
                </div>
            </div>

            <img src="${pkg.image}" class="main-image" alt="Package Image" />

            <div class="package-header">
                <div style="flex: 1">
                    <span class="package-category">${pkg.category || 'Standard'}</span>
                    <h2 class="package-title">${pkg.title || pkg.name}</h2>
                    <div class="package-duration">Duration: ${pkg.duration || pkg.date}</div>
                </div>
                <div style="text-align: right">
                    <div class="package-price">${pkg.price}</div>
                    <div style="font-size: 12px; color: #888;">per person</div>
                </div>
            </div>

            <div class="grid-section">
                <div class="info-box">
                    <span class="info-label">Makkah Hotel</span>
                    <span class="info-value">${makkahHotel}</span>
                </div>
                <div class="info-box">
                    <span class="info-label">Madinah Hotel</span>
                    <span class="info-value">${madinahHotel}</span>
                </div>
                ${pkg.flightsUp ? `
                <div class="info-box">
                    <span class="info-label">Flights</span>
                    <span class="info-value">${pkg.flightsUp} / ${pkg.flightsDown}</span>
                </div>` : ''}
                ${pkg.food ? `
                <div class="info-box">
                    <span class="info-label">Food</span>
                    <span class="info-value">${pkg.food}</span>
                </div>` : ''}
            </div>

            <div class="features-section">
                <h3 class="section-title">Package Inclusions & Features</h3>
                ${featuresHtml}
                ${pkg.shortDescription ? `<p style="margin-top: 15px; color: #555;">${pkg.shortDescription}</p>` : ''}
                ${pkg.note ? `<p style="margin-top: 10px; font-size: 13px; color: #e63946;"><strong>Note:</strong> ${pkg.note}</p>` : ''}
            </div>

            <div class="footer">
                <p>Generated from <strong>championtravelsbd.com</strong></p>
                <p>Authorized Agency | Hajj License No. 1432 | Umrah License No. 515</p>
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

export const printComparison = (packages: any[], logoUrl: string) => {
    const printWindow = window.open('', '', 'width=1100,height=800');
    if (!printWindow) return;

    let tableHeaders = '';
    let priceRow = '';
    let durationRow = '';
    let makkahRow = '';
    let madinahRow = '';
    let featureRow = '';

    packages.forEach(pkg => {
        tableHeaders += `<th style="width: ${100/packages.length}%">${pkg.title || pkg.name}<br><span style="font-size: 12px; font-weight: normal; background: #eee; padding: 2px 6px; border-radius: 4px; color: #333;">${pkg.category || 'Standard'}</span></th>`;
        priceRow += `<td><strong>${pkg.price}</strong></td>`;
        durationRow += `<td>${pkg.duration || pkg.date}</td>`;
        makkahRow += `<td>${pkg.makkahHotel || pkg.hotelMakkah || '-'}</td>`;
        madinahRow += `<td>${pkg.madinahHotel || pkg.hotelMadinah || '-'}</td>`;
        
        let feat = '';
        if (Array.isArray(pkg.features)) feat = pkg.features.join(', ');
        else feat = pkg.special || '-';
        featureRow += `<td>${feat}</td>`;
    });

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Package Comparison - Champion Travels</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap');
                body { font-family: 'Hind Siliguri', sans-serif; padding: 30px; text-align: center; }
                .logo { height: 60px; margin-bottom: 20px; }
                h2 { color: #C5A47E; margin-bottom: 30px; text-transform: uppercase; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #111827; color: #C5A47E; padding: 15px; font-size: 18px; border: 1px solid #333; vertical-align: top; }
                td { padding: 15px; border: 1px solid #ddd; font-size: 14px; vertical-align: top; }
                tr:nth-child(even) { background: #f9f9f9; }
                .label-col { text-align: left; font-weight: bold; background: #f3f4f6; width: 150px; color: #555; }
                .print-btn { background: #C5A47E; color: white; border: none; padding: 10px 20px; cursor: pointer; font-size: 16px; border-radius: 5px; margin-bottom: 20px; }
                @media print { .print-btn { display: none; } }
            </style>
        </head>
        <body>
            <button onclick="window.print()" class="print-btn">Print Comparison</button>
            <img src="${logoUrl}" class="logo" alt="Logo" />
            <h2>Package Comparison</h2>
            <table>
                <thead>
                    <tr>
                        <th class="label-col" style="background: transparent; border: none;"></th>
                        ${tableHeaders}
                    </tr>
                </thead>
                <tbody>
                    <tr><td class="label-col">Price</td>${priceRow}</tr>
                    <tr><td class="label-col">Duration</td>${durationRow}</tr>
                    <tr><td class="label-col">Makkah Hotel</td>${makkahRow}</tr>
                    <tr><td class="label-col">Madinah Hotel</td>${madinahRow}</tr>
                    <tr><td class="label-col">Features</td>${featureRow}</tr>
                </tbody>
            </table>
            <p style="margin-top: 40px; color: #888; font-size: 12px;">Generated from Champion Travels & Tours Website</p>
        </body>
        </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

import json

with open("src/pr_options_data.json", "r", encoding="utf-8") as f:
    pr_options = json.load(f)

programmatic_code = f"""import {{ MODELS }} from './models_data.js';

export const PR_OPTIONS = {json.dumps(pr_options, indent=2, ensure_ascii=False)};

export function renderProgrammaticCarPage(model, prOption, lang = 'en') {{
  const modelName = model.name;
  const prTitle = prOption.title[lang] || prOption.title.en;
  const prDesc = prOption.desc[lang] || prOption.desc.en;
  const savings = model.savingsEur.toLocaleString();

  let pageTitle = `${{modelName}} with ${{prOption.code}} | Sweden Currency Arbitrage | DreamCarHunt™`;
  let metaDesc = `Hunt verified ${{modelName}} equipped with ${{prTitle}}. Sourced directly from Sweden with Car.info official verification and ~€${{savings}} currency arbitrage savings.`;

  if (lang === 'ro') {{
    pageTitle = `${{modelName}} cu ${{prOption.code}} | Arbitraj Suedia | DreamCarHunt™ România`;
    metaDesc = `Găsește ${{modelName}} cu dotarea rară ${{prTitle}}. Import direct din Suedia cu verificare istoric Car.info și o economie reală de ~${{savings}} €!`;
  }} else if (lang === 'it') {{
    pageTitle = `${{modelName}} con ${{prOption.code}} | Arbitraggio Svezia | DreamCarHunt™ Italia`;
    metaDesc = `Trova ${{modelName}} configurata con ${{prTitle}}. Importazione dalla Svezia con certificazione Car.info e risparmio reale di ~€${{savings}}.`;
  }}

  const prefix = lang === 'ro' ? '/ro/' : (lang === 'it' ? '/it/' : '/');
  const basePath = `hunt/${{model.slug}}/${{prOption.slug}}`;
  const canonicalUrl = `https://dreamcarhunt.com${{prefix}}${{basePath}}`;
  const relatedModels = MODELS.filter(m => m.brand === model.brand && m.slug !== model.slug).slice(0, 3);
  const otherPrs = PR_OPTIONS.filter(p => p.slug !== prOption.slug).slice(0, 5);

  return `<!DOCTYPE html>
<html lang="${{lang}}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${{pageTitle}}</title>
    <meta name="description" content="${{metaDesc}}">
    <link rel="canonical" href="${{canonicalUrl}}">
    
    <!-- Hreflang Tags -->
    <link rel="alternate" hreflang="en" href="https://dreamcarhunt.com/${{basePath}}">
    <link rel="alternate" hreflang="ro" href="https://dreamcarhunt.com/ro/${{basePath}}">
    <link rel="alternate" hreflang="it" href="https://dreamcarhunt.com/it/${{basePath}}">
    <link rel="alternate" hreflang="x-default" href="https://dreamcarhunt.com/${{basePath}}">

    <!-- Open Graph -->
    <meta property="og:site_name" content="DreamCarHunt">
    <meta property="og:type" content="product">
    <meta property="og:title" content="${{pageTitle}}">
    <meta property="og:description" content="${{metaDesc}}">
    <meta property="og:url" content="${{canonicalUrl}}">
    <meta property="og:image" content="https://dreamcarhunt.com/og-image.jpg">
    <meta property="og:image:secure_url" content="https://dreamcarhunt.com/og-image.jpg">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="https://dreamcarhunt.com/og-image.jpg">

    <!-- Fonts & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <link rel="stylesheet" href="/style.css">

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@graph": [
        {{
          "@type": "Product",
          "name": "${{modelName}} with ${{prTitle}}",
          "description": "${{metaDesc}}",
          "brand": {{
            "@type": "Brand",
            "name": "${{model.brand}}"
          }},
          "offers": {{
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": "${{model.baseEur}}",
            "itemCondition": "https://schema.org/UsedCondition",
            "availability": "https://schema.org/InStock",
            "seller": {{
              "@type": "AutoDealer",
              "name": "DreamCarHunt VIP Concierge",
              "telephone": "+393209481876"
            }}
          }}
        }},
        {{
          "@type": "BreadcrumbList",
          "itemListElement": [
            {{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://dreamcarhunt.com${{prefix}}"
            }},
            {{
              "@type": "ListItem",
              "position": 2,
              "name": "${{model.brand}}",
              "item": "https://dreamcarhunt.com${{prefix}}#inventory"
            }},
            {{
              "@type": "ListItem",
              "position": 3,
              "name": "${{modelName}}",
              "item": "${{canonicalUrl}}"
            }}
          ]
        }}
      ]
    }}
    </script>
</head>
<body>

    <!-- TOP ANNOUNCEMENT BAR -->
    <div class="top-bar">
        <span>⚡ <strong>RADAR MATCH:</strong> ${{modelName}} &bull; Factory Code: <strong>${{prOption.code}}</strong> &bull; Estimated Arbitrage Discount: <strong>~€${{savings}}</strong></span>
    </div>

    <!-- NAVBAR -->
    <header class="navbar">
        <div class="nav-container">
            <a href="${{prefix}}" class="logo">
                <span class="logo-icon"><i class="fa-solid fa-crosshairs"></i></span>
                <span class="logo-text">DREAMCAR<strong>HUNT</strong></span>
                <span class="logo-tag">${{prOption.code}}</span>
            </a>

            <nav class="nav-links">
                <a href="#vehicle-audit">Specification Audit</a>
                <a href="#arbitrage-math">Arbitrage Breakdown</a>
                <a href="#vip-concierge" class="nav-cta"><i class="fa-solid fa-bolt"></i> Commission This Hunt</a>
            </nav>
        </div>
    </header>

    <!-- BREADCRUMBS -->
    <div class="container" style="padding-top:20px;">
        <nav style="font-size:0.85rem; color:#64748b;">
            <a href="${{prefix}}" style="color:#38bdf8; text-decoration:none;">Home</a> &gt; 
            <span style="color:#94a3b8;">${{model.brand}}</span> &gt; 
            <span style="color:#cbd5e1;">${{modelName}} [${{prOption.code}}]</span>
        </nav>
    </div>

    <!-- HERO -->
    <section class="hero" style="padding: 40px 0 30px;">
        <div class="container">
            <div class="hero-badge">
                <span class="pulse-dot"></span> EUROPEAN FACTORY UNICORN CONFIGURATION
            </div>
            <h1 style="font-size: 2.8rem;">${{modelName}}<br><span class="gradient-text">with Factory ${{prOption.code}}</span></h1>
            <p class="hero-subtitle">
                Looking for a genuine factory-specified <strong>${{modelName}}</strong> with <strong>${{prTitle}}</strong>? Standard dealer portals miss this code. We locate them through Scandinavian arbitrage for an average saving of <strong>€${{savings}}</strong>.
            </p>
        </div>
    </section>

    <!-- ARBITRAGE VALUE BREAKDOWN SECTION -->
    <section id="arbitrage-math" class="section-arbitrage" style="padding: 20px 0 60px;">
        <div class="container">
            <div class="arbitrage-box">
                <div class="arbitrage-text">
                    <span class="badge-sub">FINANCIAL ADVANTAGE</span>
                    <h2>Why Source This ${{model.brand}} From Sweden:</h2>
                    <ul class="benefit-list">
                        <li><i class="fa-solid fa-check-circle"></i> <strong>Official Swedish Registry (Car.info):</strong> 100% verified digital mileage and full maintenance timeline recorded by the Swedish government.</li>
                        <li><i class="fa-solid fa-check-circle"></i> <strong>Factory Equipped ${{prOption.code}}:</strong> Built to withstand Nordic extremes with authentic factory assembly, not aftermarket retrofits.</li>
                        <li><i class="fa-solid fa-check-circle"></i> <strong>Zero Customs Duties:</strong> Sweden is an EU member state. Transport directly to your door with 0% customs tariffs.</li>
                        <li><i class="fa-solid fa-check-circle"></i> <strong>Pre-Purchase 150-Point Audit:</strong> Paint depth gauge analysis, electronic fault scan, and road test before transport release.</li>
                    </ul>
                </div>
                <div class="arbitrage-calc">
                    <div class="calc-card">
                        <div class="live-rate-tag">
                            <i class="fa-solid fa-chart-line"></i> <strong>SWEDISH ARBITRAGE LIVE</strong>
                        </div>
                        <h3>Financial Audit &bull; ${{modelName}}</h3>
                        <div class="calc-results" style="margin-top: 20px;">
                            <div class="res-row"><span>Sweden Purchase Price:</span> <strong>${{model.priceSek}} (~€${{model.baseEur.toLocaleString()}})</strong></div>
                            <div class="res-row"><span>Logistics &amp; On-Site Audit:</span> <strong>+€1,200</strong></div>
                            <div class="res-row"><span>Total Landed Price:</span> <strong>€${{(model.baseEur + 1200).toLocaleString()}}</strong></div>
                            <div class="res-row"><span>Continental Market (Mobile.de):</span> <strong>${{model.marketEur}}</strong></div>
                            <div class="res-row highlight">
                                <span>Estimated Net Arbitrage Savings:</span>
                                <strong style="color: var(--accent-gold); font-size: 1.4rem;">~€${{savings}}</strong>
                            </div>
                        </div>
                        <a href="https://wa.me/393209481876?text=Hello!%20I%20am%20interested%20in%20commissioning%20a%20hunt%20for%20a%20${{encodeURIComponent(model.name)}}%20with%20factory%20option%20${{prOption.code}}." target="_blank" class="btn-calc-cta" style="margin-top: 20px;">
                            <i class="fa-brands fa-whatsapp"></i> Commission This Exact Car on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- PR CODE DETAILS SECTION -->
    <section id="vehicle-audit" class="section-audit" style="padding: 60px 0; background: rgba(16, 22, 36, 0.5);">
        <div class="container">
            <div style="text-align: center; max-width: 800px; margin: 0 auto 40px;">
                <span class="badge-sub">FACTORY EQUIPMENT PROFILE</span>
                <h2 style="font-size: 2.2rem; margin-top: 8px;">Factory ${{prOption.code}} Engineering Analysis</h2>
                <p style="color: var(--text-muted);">${{prDesc}}</p>
            </div>

            <div class="audit-grid">
                <div class="audit-card">
                    <div class="audit-icon"><i class="fa-solid fa-microchip"></i></div>
                    <h3>Factory ECU Integration</h3>
                    <p>Unlike aftermarket retrofits, factory option ${{prOption.code}} is coded directly into the main CAN-bus gateways, enabling instrument cluster and smartphone control.</p>
                </div>
                <div class="audit-card">
                    <div class="audit-icon"><i class="fa-solid fa-shield-halved"></i></div>
                    <h3>Resale Value Retention</h3>
                    <p>European enthusiast collectors and savvy buyers specifically filter for ${{prOption.code}}. This configuration maintains high liquidity and residual value.</p>
                </div>
                <div class="audit-card">
                    <div class="audit-icon"><i class="fa-solid fa-snowflake"></i></div>
                    <h3>Nordic Specification</h3>
                    <p>Swedish-market vehicles with ${{prOption.code}} typically include auxiliary battery upgrades, corrosion-protected wiring, and cold-climate thermal packages.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- OTHER PR OPTIONS FOR THIS CAR -->
    <section style="padding: 40px 0;">
        <div class="container">
            <h3 style="font-size:1.4rem; font-weight:800; margin-bottom:16px; text-align:center;">Other Rare Options for ${{modelName}}</h3>
            <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center;">
                ${{otherPrs.map(op => `
                    <a href="${{prefix}}hunt/${{model.slug}}/${{op.slug}}" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px 16px; color:#cbd5e1; font-size:0.85rem; text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
                        <i class="fa-solid fa-tag" style="color:#38bdf8;"></i>
                        <strong>${{op.code}}</strong> - ${{op.title[lang] || op.title.en}}
                    </a>
                `).join('')}}
            </div>
        </div>
    </section>

    <!-- RELATED SIBLING MODELS -->
    <section class="section-related" style="padding: 60px 0;">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 30px;">Other High-Demand ${{model.brand}} Hunts</h2>
            <div class="car-grid">
                ${{relatedModels.map(rm => `
                    <div class="car-card">
                        <div class="car-card-body">
                            <span class="car-tag">${{rm.body}} &bull; ${{rm.hp}} HP</span>
                            <h3>${{rm.name}}</h3>
                            <div class="car-price-row">
                                <span>Nordic Arbitrage:</span>
                                <strong>~€${{rm.baseEur.toLocaleString()}}</strong>
                            </div>
                            <div class="car-price-row">
                                <span>Estimated Savings:</span>
                                <strong style="color: var(--accent-gold);">€${{rm.savingsEur.toLocaleString()}}</strong>
                            </div>
                            <a href="${{prefix}}hunt/${{rm.slug}}/${{prOption.slug}}" class="btn-card-hunt">
                                Hunt This Model with ${{prOption.code}} &rarr;
                            </a>
                        </div>
                    </div>
                `).join('')}}
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <div class="logo" style="margin-bottom: 12px;">
                        <span class="logo-icon"><i class="fa-solid fa-crosshairs"></i></span>
                        <span class="logo-text">DREAMCAR<strong>HUNT</strong></span>
                    </div>
                    <p>The European AI Car Hunting Engine. Specialized in finding rare factory option packages through Scandinavian currency arbitrage.</p>
                </div>
                <div class="footer-col">
                    <h4>Direct VIP Concierge</h4>
                    <p>WhatsApp: <strong>+39 320 948 1876</strong></p>
                    <p>VasileDev Group &bull; P.IVA IT04226190041</p>
                    <p>Garessio (CN), Italy &bull; Pan-European Delivery</p>
                </div>
                <div class="footer-col">
                    <h4>Global Network</h4>
                    <p>✈️ <a href="https://airparkrefund.com" target="_blank">AirParkRefund.com</a></p>
                    <p>🛡️ <a href="https://verifydating.net" target="_blank">VerifyDating.net</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 DreamCarHunt™ by VasileDev Group. All rights reserved. Powered by Cloudflare Edge.</p>
            </div>
        </div>
    </footer>

    <!-- FLOATING WHATSAPP BUTTON -->
    <a href="https://wa.me/393209481876?text=Hello!%20I%20am%20interested%20in%20hunting%20a%20${{encodeURIComponent(model.name)}}%20with%20code%20${{prOption.code}}." target="_blank" class="floating-wa">
        <i class="fa-brands fa-whatsapp"></i>
        <span class="floating-wa-pulse"></span>
    </a>

    <script src="/app.js"></script>
</body>
</html>`;
}}

export function generateSitemapXml(type = 'cars', lang = 'en') {{
  const prefix = lang === 'ro' ? '/ro/' : (lang === 'it' ? '/it/' : '/');
  const now = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n';

  if (type === 'cars') {{
    for (const model of MODELS) {{
      for (const pr of PR_OPTIONS) {{
        const path = `${{prefix}}hunt/${{model.slug}}/${{pr.slug}}`;
        xml += '  <url>\\n';
        xml += `    <loc>https://dreamcarhunt.com${{path}}</loc>\\n`;
        xml += `    <lastmod>${{now}}</lastmod>\\n`;
        xml += '    <changefreq>weekly</changefreq>\\n';
        xml += '    <priority>0.8</priority>\\n';
        xml += '  </url>\\n';
      }}
    }}
  }} else if (type === 'models') {{
    for (const model of MODELS) {{
      const path = `${{prefix}}hunt/${{model.slug}}/${{PR_OPTIONS[0].slug}}`;
      xml += '  <url>\\n';
      xml += `    <loc>https://dreamcarhunt.com${{path}}</loc>\\n`;
      xml += `    <lastmod>${{now}}</lastmod>\\n`;
      xml += '    <changefreq>weekly</changefreq>\\n';
      xml += '    <priority>0.9</priority>\\n';
      xml += '  </url>\\n';
    }}
  }}

  xml += '</urlset>';
  return xml;
}}
"""

with open("src/programmatic.js", "w", encoding="utf-8") as f:
    f.write(programmatic_code)

print(f"Generated src/programmatic.js with {len(pr_options)} PR options.")

/**
 * DreamCarHunt™ Engine 2.0
 * Live ECB Currency Arbitrage & Surgical PR Option Code Intelligence
 */

window.currentSekRate = 11.38;

const PR_CATALOG = [
    {
        code: '9M9',
        brand: 'VAG / PORSCHE',
        category: 'CLIMATE',
        tier: 'unicorn',
        name: {
            en: 'Factory Webasto Auxiliary Heater with Remote + App',
            ro: 'Încălzire Auxiliară Webasto din Fabrică (Telecomandă + Aplicație)',
            it: 'Riscaldamento Ausiliario Webasto da Fabbrica (Telecomando + App)'
        },
        desc: {
            en: 'Heats engine coolant and cabin prior to departure. Preserves engine life from cold starts and defrosts windows effortlessly in freezing temperatures.',
            ro: 'Preîncălzește antigelul motorului și habitaclul înainte de plecare. Elimină uzura la pornirea la rece și dezgheață geamurile instant.',
            it: 'Preriscalda il circuito motore e l\'abitacolo prima della partenza. Elimina l\'usura da avviamento a freddo e sbrina i vetri istantaneamente.'
        }
    },
    {
        code: 'VW6',
        brand: 'PORSCHE / AUDI',
        category: 'ACOUSTICS',
        tier: 'unicorn',
        name: {
            en: 'Acoustic Double Glazed Heat-Insulating Glass',
            ro: 'Geamuri Duble Atermice Izolate Fonic (Strat PVB Dublu)',
            it: 'Doppi Vetri Acustici Termoisolanti (Laminato Fonoassorbente)'
        },
        desc: {
            en: 'Dual-pane laminated glass with specialized acoustic PVB foil. Reduces highway wind noise by up to 6dB and blocks infrared solar radiation.',
            ro: 'Geamuri laminate duble cu folie acustică PVB intermediară. Reduce zgomotul de rulare pe autostradă cu până la 6dB și filtrează căldura solară.',
            it: 'Vetri doppi stratificati con pellicola acustica PVB. Riduce il fruscio aerodinamico autostradale fino a 6dB e isola dal calore estivo.'
        }
    },
    {
        code: '1BK',
        brand: 'PORSCHE',
        category: 'CHASSIS',
        tier: 'very-rare',
        name: {
            en: 'Adaptive Air Suspension with PASM & Height Level Control',
            ro: 'Suspensie Pneumatică Adaptivă PASM cu Reglaj pe Înălțime',
            it: 'Sospensioni Pneumatiche Adattive PASM con Regolazione Livello'
        },
        desc: {
            en: 'Full air suspension featuring continuous electronic damping (PASM). Enables ground clearance adjustments between off-road clearance and aerodynamic high-speed lowering.',
            ro: 'Perne de aer integrate cu amortizoare adaptive PASM. Permite ridicarea pentru teren accidentat și coborârea la viteze de croazieră.',
            it: 'Sospensioni ad aria complete con controllo elettronico PASM. Regolazione altezza da terra per fuoristrada e abbassamento aerodinamico in autostrada.'
        }
    },
    {
        code: '1BY',
        brand: 'AUDI',
        category: 'CHASSIS',
        tier: 'very-rare',
        name: {
            en: 'Audi 4-Corner Air Suspension for Allroad Models',
            ro: 'Suspensie Pneumatică Allroad pe 4 Colțuri (Garda la Sol Variabilă)',
            it: 'Sospensioni Pneumatiche 4-Corner Audi Allroad'
        },
        desc: {
            en: 'Dedicated high-travel air suspension designed for extreme Nordic terrain and silky asphalt floating.',
            ro: 'Suspensie pe perne de aer cu cursă extinsă special calibrată pentru carosabili nordici dificili și confort regal pe autostradă.',
            it: 'Sospensioni ad aria ad escursione maggiorata progettate per il clima nordico e massimo comfort di marcia.'
        }
    },
    {
        code: '0N5',
        brand: 'AUDI / PORSCHE',
        category: 'CHASSIS',
        tier: 'unicorn',
        name: {
            en: 'All-Wheel Steering (Rear-Axle Dynamic Steering)',
            ro: 'Direcție Integrală Dinamică (Punte Spate Viratoare)',
            it: 'Asse Posteriore Sterzante (Dynamic All-Wheel Steering)'
        },
        desc: {
            en: 'Turns rear wheels opposite to front at city speeds for a compact turning radius, and in-phase at highway speeds for unmatched stability.',
            ro: 'Rotește roțile spate în sens opus la viteze mici (parcare facilă) și în același sens la viteze mari pentru stabilitate chirurgicală pe viraje.',
            it: 'Sterza le ruote posteriori in controfase a bassa velocità e in fase ad alta velocità per stabilità chirurgica in curva.'
        }
    },
    {
        code: '4D3',
        brand: 'VAG / PORSCHE',
        category: 'INTERIOR',
        tier: 'rare',
        name: {
            en: 'Front Seat Active Climate Ventilation & Cooling',
            ro: 'Ventilație Activă în Scaunele din Față (Cu Răcire)',
            it: 'Ventilazione Attiva Sedili Anteriori con Funzione Rinfrescante'
        },
        desc: {
            en: 'Perforated leather seats with 3-stage integrated suction fans pulling moisture and heat away from driver and passenger.',
            ro: 'Piele perforată de lux cu ventilatoare integrate în șezut și spătar ce absorb căldura și umezeala pe timp de vară.',
            it: 'Pelle traforata con ventole integrate a 3 velocità che aspirano calore e umidità per viaggi impeccabili.'
        }
    },
    {
        code: '4D5',
        brand: 'AUDI / PORSCHE',
        category: 'INTERIOR',
        tier: 'very-rare',
        name: {
            en: 'Front Seat Climate Ventilation + Pneumatic Massage',
            ro: 'Ventilație Scaune + Masaj Pneumatic cu 10 Puncte',
            it: 'Ventilazione Sedili Anteriori + Massaggio Pneumatico 10 Punti'
        },
        desc: {
            en: 'Combines multi-stage seat cooling with therapeutic pneumatic air chambers massaging back muscles on long European road trips.',
            ro: 'Combină răcirea activă cu perne de aer pneumatice ce masează coloana și umerii la drum lung.',
            it: 'Combina ventilazione attiva e cuscini pneumatici ad aria per massaggi rigeneranti nei lunghi viaggi europei.'
        }
    },
    {
        code: '3FU',
        brand: 'VAG / PORSCHE',
        category: 'INTERIOR',
        tier: 'rare',
        name: {
            en: 'Panoramic Tilt & Slide Dual Glass Sunroof System',
            ro: 'Plafon Panoramic Glisant din Sticlă cu Trapă Electrică',
            it: 'Tetto Panoramico Apribile in Vetro a Due Sezioni'
        },
        desc: {
            en: 'Full-length tinted panoramic roof flooding the cabin with natural light and opening electric wind deflector.',
            ro: 'Plafon panoramic complet din sticlă securizată cu trapă culisantă și jaluzea electrică acționată din buton.',
            it: 'Ampio tetto panoramico in vetro scuro che inonda l\'abitacolo di luce con tendina parasole elettrica.'
        }
    },
    {
        code: 'QR5',
        brand: 'PORSCHE',
        category: 'PERFORMANCE',
        tier: 'very-rare',
        name: {
            en: 'Sport Chrono Package with Steering Wheel Mode Switch',
            ro: 'Pachet Sport Chrono (Ceas Bord + Selector Moduri pe Volan)',
            it: 'Pacchetto Sport Chrono con Selettore Modalità al Volante'
        },
        desc: {
            en: 'Features the iconic analog/digital dashboard stopwatch, Launch Control, and steering wheel rotary switch for Sport Plus and Sport Response modes.',
            ro: 'Include cronometrul analogic pe bord, Launch Control pentru demaraje fulger și selectorul rotativ Sport Plus pe volan.',
            it: 'Include il cronometro analogico su plancia, Launch Control e rotore al volante per mappatura Sport Plus.'
        }
    },
    {
        code: '9VL',
        brand: 'PORSCHE',
        category: 'AUDIO',
        tier: 'rare',
        name: {
            en: 'BOSE® Surround Sound System (14 Speakers, 710 Watts)',
            ro: 'Sistem Audio Premium BOSE® Surround (14 Difuzoare, 710W)',
            it: 'Impianto Audio BOSE® Surround (14 Altoparlanti, 710 Watt)'
        },
        desc: {
            en: 'Acoustically tuned for the vehicle chassis with active AudioPilot noise compensation and dedicated subwoofer.',
            ro: 'Calibrat acustic pentru cabină, cu compensare activă a zgomotului exterior AudioPilot și subwoofer de putere.',
            it: 'Tarato su misura per l\'abitacolo con compensazione attiva AudioPilot e subwoofer ad alta pressione.'
        }
    },
    {
        code: '9VJ',
        brand: 'PORSCHE',
        category: 'AUDIO',
        tier: 'unicorn',
        name: {
            en: 'Burmester® High-End 3D Surround Sound (21 Speakers, 1455W)',
            ro: 'Sistem Ultra-Exclusiv Burmester® 3D High-End (21 Difuzoare, 1455W)',
            it: 'Sistema Burmester® High-End 3D Surround (21 Altoparlanti, 1455W)'
        },
        desc: {
            en: 'The absolute pinnacle of automotive audio. Ribbon tweeters (AMT), class-D amplifiers, and concert-hall 3D spatial acoustics.',
            ro: 'Vârful absolut în acustica auto mondială. Tweetere tip panglică (AMT), incinte din aluminiu și realism de sală de concert.',
            it: 'Il massimo assoluto dell\'audio automobilistico. Tweeter a nastro AMT e spazialità sonora da sala da concerto.'
        }
    },
    {
        code: '1D3',
        brand: 'VAG / PORSCHE',
        category: 'UTILITY',
        tier: 'rare',
        name: {
            en: 'Electric Deployable Trailer Tow Hitch (Swiveling Towbar)',
            ro: 'Cârlig de Remorcare Retractabil Electric din Buton',
            it: 'Gancio Traino Estraibile Elettricamente con Pulsante'
        },
        desc: {
            en: 'Hides completely under the bumper at the press of a button in the trunk. Critical for boat, bike, or caravan towing.',
            ro: 'Se ascunde complet sub bara spate la simpla apăsare a unui buton din portbagaj. Esențial pentru suporturi de biciclete sau remorcă.',
            it: 'Scompare completamente sotto il paraurti premendo un tasto nel bagagliaio. Indispensabile per portabici o carrelli.'
        }
    }
];

// --- 1. LIVE CURRENCY ARBITRAGE ENGINE ---
async function fetchLiveExchangeRate() {
    try {
        const res = await fetch('/api/exchange-rate');
        if (res.ok) {
            const data = await res.json();
            if (data && data.rates && data.rates.SEK) {
                window.currentSekRate = parseFloat(data.rates.SEK);
                updateLiveRateBadges(window.currentSekRate, data.date);
            }
        }
    } catch (err) {
        console.debug('ECB rate fallback active:', err);
    }
    calculateSavings();
}

function updateLiveRateBadges(rate, date) {
    const rateElements = document.querySelectorAll('.live-rate-tag');
    rateElements.forEach(el => {
        el.innerHTML = `<i class="fa-solid fa-chart-line"></i> <strong>ECB LIVE:</strong> 1 EUR = ${rate.toFixed(2)} SEK <span style="opacity:0.75; font-size:0.7rem;">(${date || 'Live'})</span>`;
    });
}

function calculateSavings() {
    const sekInput = document.getElementById('calc-sek');
    if (!sekInput) return;

    const sek = parseFloat(sekInput.value) || 0;
    const rate = window.currentSekRate || 11.38;
    const netEur = Math.round(sek / rate);
    const transportAudit = 1200; // Estimated door-to-door transport + pre-purchase technical audit
    const totalLandedEur = netEur + transportAudit;
    
    // Average continental market comparison (German Mobile.de / Italian AutoScout24 premium)
    const localMarket = Math.round(netEur * 1.185);
    const netSavings = localMarket - totalLandedEur;
    const savingsPercent = Math.max(0, Math.round((netSavings / localMarket) * 100));

    const lang = document.documentElement.lang || 'en';
    const locale = lang === 'ro' ? 'ro-RO' : (lang === 'it' ? 'it-IT' : 'de-DE');

    const fmt = (num) => (lang === 'en' ? '€' : '') + num.toLocaleString(locale) + (lang !== 'en' ? ' €' : '');

    const eurOutput = document.getElementById('calc-eur');
    const diffOutput = document.getElementById('calc-diff');
    const landedOutput = document.getElementById('calc-landed');
    const marketOutput = document.getElementById('calc-market');
    const pctOutput = document.getElementById('calc-percent');

    if (eurOutput) eurOutput.innerText = fmt(netEur);
    if (landedOutput) landedOutput.innerText = fmt(totalLandedEur);
    if (marketOutput) marketOutput.innerText = fmt(localMarket);
    if (diffOutput) diffOutput.innerText = '+' + fmt(netSavings);
    if (pctOutput) pctOutput.innerText = `(-${savingsPercent}%)`;
}

// --- 2. PR-CODE EXPLORER & DECODER ---
function renderPrGrid(filterCategory = 'ALL', searchQuery = '') {
    const grid = document.getElementById('pr-grid');
    if (!grid) return;

    const lang = document.documentElement.lang || 'en';
    const q = searchQuery.toLowerCase().trim();

    const filtered = PR_CATALOG.filter(item => {
        const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
        const matchesQuery = !q || 
            item.code.toLowerCase().includes(q) ||
            (item.name[lang] || item.name.en).toLowerCase().includes(q) ||
            (item.desc[lang] || item.desc.en).toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #94a3b8;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; color: #eab308; margin-bottom: 12px;"></i>
                <p>No PR code matched your filter. Type another code (e.g. 9M9, VW6, 1BK) or select "All".</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(item => {
        const name = item.name[lang] || item.name.en;
        const desc = item.desc[lang] || item.desc.en;
        const tierClass = item.tier;
        const tierLabel = item.tier.replace('-', ' ');
        const btnText = lang === 'ro' ? 'Vânează acest cod' : (lang === 'it' ? 'Cerca questo codice' : 'Hunt this code');

        return `
            <div class="pr-card">
                <div class="pr-card-header">
                    <span class="pr-code-tag">${item.code}</span>
                    <span class="pr-tier-badge ${tierClass}">${tierLabel}</span>
                </div>
                <h3 class="pr-card-title">${name}</h3>
                <p class="pr-card-desc">${desc}</p>
                <div class="pr-card-footer">
                    <span class="pr-brand-label"><i class="fa-solid fa-car-side"></i> ${item.brand}</span>
                    <button class="btn-pr-action" onclick="selectPrForHunt('${item.code}', '${encodeURIComponent(name)}')">
                        <i class="fa-solid fa-crosshairs"></i> ${btnText}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function filterPrCategory(cat, element) {
    document.querySelectorAll('.pr-cat-pill').forEach(p => p.classList.remove('active'));
    if (element) element.classList.add('active');
    
    const searchInput = document.getElementById('pr-search-input');
    const query = searchInput ? searchInput.value : '';
    renderPrGrid(cat, query);
}

function searchPrInput(val) {
    const activePill = document.querySelector('.pr-cat-pill.active');
    const cat = activePill ? activePill.getAttribute('data-cat') || 'ALL' : 'ALL';
    renderPrGrid(cat, val);
}

function selectPrForHunt(code, encodedName) {
    const name = decodeURIComponent(encodedName);
    
    // Find matching checkbox in VIP concierge form and highlight it
    const checkboxes = document.querySelectorAll('.checkbox-row input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (cb.value.includes(code) || cb.parentElement.innerText.includes(code)) {
            cb.checked = true;
            cb.parentElement.style.transition = 'all 0.3s ease';
            cb.parentElement.style.outline = '2px solid #38bdf8';
            cb.parentElement.style.background = 'rgba(56, 189, 248, 0.2)';
            cb.parentElement.style.borderRadius = '6px';
            setTimeout(() => {
                cb.parentElement.style.outline = 'none';
                cb.parentElement.style.background = 'transparent';
            }, 4000);
        }
    });

    const modelInput = document.getElementById('lead-model');
    if (modelInput && !modelInput.value) {
        modelInput.value = `Porsche Macan / Audi / BMW cu ${code}`;
    }

    const conciergeSection = document.getElementById('vip-concierge');
    if (conciergeSection) {
        conciergeSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- 3. FAST UNICORN GALLERY FILTERING ---
function applyFilter(filterCode) {
    const pills = document.querySelectorAll('.search-pills .pill');
    pills.forEach(p => p.classList.remove('active'));
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }

    const searchInput = document.getElementById('ai-search-input');
    const lang = document.documentElement.lang || 'en';

    if (lang === 'ro') {
        if (filterCode === '9M9') searchInput.value = 'Modele cu încălzire Webasto din fabrică (9M9)';
        if (filterCode === 'VW6') searchInput.value = 'Modele cu geamuri duble acustice (VW6)';
        if (filterCode === '1BK') searchInput.value = 'Modele cu suspensie pneumatică adaptivă (1BK/1BY)';
        if (filterCode === 'SEK') searchInput.value = 'Arbitraj Suedia (-15% reducere curs)';
    } else if (lang === 'it') {
        if (filterCode === '9M9') searchInput.value = 'Modelli con riscaldamento Webasto (9M9)';
        if (filterCode === 'VW6') searchInput.value = 'Modelli con doppi vetri acustici (VW6)';
        if (filterCode === '1BK') searchInput.value = 'Modelli con sospensioni pneumatiche (1BK/1BY)';
        if (filterCode === 'SEK') searchInput.value = 'Arbitraggio Svezia (-15% cambio SEK)';
    } else {
        if (filterCode === '9M9') searchInput.value = 'Vehicles with factory Webasto heater (9M9)';
        if (filterCode === 'VW6') searchInput.value = 'Vehicles with acoustic double glass (VW6)';
        if (filterCode === '1BK') searchInput.value = 'Vehicles with adaptive air suspension (1BK/1BY)';
        if (filterCode === 'SEK') searchInput.value = 'Swedish arbitrage vehicles (-15% discount)';
    }

    // Interactive card highlight
    const carCards = document.querySelectorAll('.car-card');
    carCards.forEach(card => {
        const text = card.innerText.toUpperCase();
        if (filterCode === 'ALL' || text.includes(filterCode)) {
            card.classList.remove('hidden-filter');
            card.classList.add('highlight-filter');
        } else {
            card.classList.remove('highlight-filter');
            // If SEK filter, highlight Sweden cards
            if (filterCode === 'SEK' && text.includes('SWEDEN')) {
                card.classList.remove('hidden-filter');
                card.classList.add('highlight-filter');
            }
        }
    });

    const unicornsSection = document.getElementById('unicorns');
    if (unicornsSection) {
        unicornsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function triggerSearch() {
    const query = document.getElementById('ai-search-input').value.trim();
    if (!query) return;

    const carCards = document.querySelectorAll('.car-card');
    const upper = query.toUpperCase();
    carCards.forEach(card => {
        const text = card.innerText.toUpperCase();
        if (text.includes(upper)) {
            card.classList.remove('hidden-filter');
            card.classList.add('highlight-filter');
        } else {
            card.classList.remove('highlight-filter');
        }
    });

    const unicornsSection = document.getElementById('unicorns');
    if (unicornsSection) {
        unicornsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- 4. VIP CONCIERGE & PAYPAL BUSINESS ENGINE ---
window.selectedTier = 'VIP_CONCIERGE';

function selectPricingTier(tier) {
    window.selectedTier = tier;
    const standardCard = document.getElementById('tier-card-standard');
    const vipCard = document.getElementById('tier-card-vip');
    if (tier === 'STANDARD') {
        if (standardCard) standardCard.classList.add('selected');
        if (vipCard) vipCard.classList.remove('selected');
    } else {
        if (standardCard) standardCard.classList.remove('selected');
        if (vipCard) vipCard.classList.add('selected');
    }
}

let paypalSdkPromise = null;
function loadPayPalSdk(currency = 'EUR') {
    if (window.paypal) return Promise.resolve(window.paypal);
    if (paypalSdkPromise) return paypalSdkPromise;

    paypalSdkPromise = fetch('/api/paypal/settings')
        .then(res => res.json())
        .then(data => {
            if (!data || !data.clientId) {
                throw new Error('PayPal client ID missing from settings');
            }
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `https://www.paypal.com/sdk/js?client-id=${data.clientId}&currency=${currency}&intent=capture&components=buttons`;
                script.onload = () => resolve(window.paypal);
                script.onerror = (err) => reject(err);
                document.head.appendChild(script);
            });
        });

    return paypalSdkPromise;
}

function renderPayPalButtons(orderReference, amount, currency) {
    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    container.innerHTML = '<div style="color:#94a3b8; font-size:13px; padding:10px;">⏳ Loading secure PayPal checkout...</div>';

    loadPayPalSdk(currency)
        .then(paypal => {
            container.innerHTML = '';
            paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'pay'
                },
                createOrder: function() {
                    return fetch('/api/paypal/create-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderReference })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (!data || !data.id) throw new Error('Order creation failed');
                        return data.id;
                    });
                },
                onApprove: function(data) {
                    container.innerHTML = '<div style="color:#10b981; font-weight:700; padding:15px;">✓ Payment authorized! Generating certified vehicle dossier...</div>';
                    return fetch('/api/paypal/capture-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: data.orderID, orderReference })
                    })
                    .then(res => res.json())
                    .then(captureData => {
                        if (captureData && captureData.redirectUrl) {
                            window.location.href = captureData.redirectUrl;
                        } else {
                            window.location.href = `/dossier/${orderReference}`;
                        }
                    })
                    .catch(err => {
                        console.error('Capture error:', err);
                        container.innerHTML = '<div style="color:#ef4444; padding:10px;">Payment error. Please contact WhatsApp support.</div>';
                    });
                },
                onError: function(err) {
                    console.error('PayPal button error:', err);
                    container.innerHTML = '<div style="color:#f59e0b; padding:10px;">PayPal unavailable. Please reach out via WhatsApp for direct invoice.</div>';
                }
            }).render('#paypal-button-container');
        })
        .catch(err => {
            console.warn('PayPal SDK initialization notice:', err);
            container.innerHTML = '<div style="color:#94a3b8; font-size:13px; padding:10px;">Please use the WhatsApp direct link below to finalize your booking.</div>';
        });
}

function submitLead(e) {
    e.preventDefault();
    const model = document.getElementById('lead-model').value.trim();
    const budget = document.getElementById('lead-budget').value.trim();
    const name = document.getElementById('lead-name').value.trim();
    const phone = document.getElementById('lead-phone').value.trim();
    const email = document.getElementById('lead-email').value.trim();

    const options = [];
    document.querySelectorAll('.checkbox-row input:checked').forEach(cb => options.push(cb.value));

    const lang = document.documentElement.lang || 'en';
    const currency = (lang === 'ro') ? 'RON' : 'EUR';

    const leadData = {
        model, budget, name, phone, email, options, lang,
        tier: window.selectedTier,
        timestamp: new Date().toISOString()
    };
    
    // Backup to localStorage
    try {
        let existingLeads = JSON.parse(localStorage.getItem('dreamcarhunt_leads') || '[]');
        existingLeads.push(leadData);
        localStorage.setItem('dreamcarhunt_leads', JSON.stringify(existingLeads));
    } catch (e) {}

    // 1. Cloudflare D1 Leads Backup
    fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, model, budget, options, lang })
    }).catch(err => console.debug('D1 notice:', err));

    // 2. Create Order in car_orders table
    fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name, phone, email, model,
            tier: window.selectedTier,
            currency,
            lang
        })
    })
    .then(res => res.json())
    .then(orderData => {
        const orderRef = (orderData && orderData.orderReference) ? orderData.orderReference : `DCH-${Date.now().toString().slice(-6)}`;
        const amount = orderData && orderData.amount ? orderData.amount : (window.selectedTier === 'STANDARD' ? 19.90 : 49.90);
        const cur = orderData && orderData.currency ? orderData.currency : currency;

        // Populate Checkout Summary
        const refEl = document.getElementById('checkout-order-ref');
        const modelEl = document.getElementById('summary-model');
        const tierEl = document.getElementById('summary-tier');
        const amountEl = document.getElementById('summary-amount');

        if (refEl) refEl.innerText = orderRef;
        if (modelEl) modelEl.innerText = model;
        if (tierEl) tierEl.innerText = window.selectedTier === 'STANDARD' ? 'Standard Factory Audit' : 'VIP Concierge Hunt';
        if (amountEl) amountEl.innerText = `${amount.toFixed(2)} ${cur}`;

        // Dynamic WhatsApp Direct Action with Order Ref
        let waMsgText = '';
        if (lang === 'ro') {
            waMsgText = `Salut Vasile! Sunt ${name}. Am lansat comanda ${orderRef} pe DreamCarHunt™:\n\n🚗 Model: ${model}\n📦 Pachet: ${window.selectedTier === 'STANDARD' ? 'Audit Standard (99 lei)' : 'VIP Concierge (249 lei)'}\n💰 Buget: ${budget} €\n🛠️ Dotări: ${options.join(', ') || 'Unicorn spec'}\n📞 Telefon: ${phone}\n✉️ Email: ${email}`;
        } else if (lang === 'it') {
            waMsgText = `Ciao Vasile! Sono ${name}. Ho inviato l'ordine ${orderRef} su DreamCarHunt™:\n\n🚗 Modello: ${model}\n📦 Livello: ${window.selectedTier === 'STANDARD' ? 'Audit Standard (€19.90)' : 'VIP Concierge (€49.90)'}\n💰 Budget: ${budget} €\n🛠️ Dotazioni: ${options.join(', ') || 'Top di gamma'}\n📞 Telefono: ${phone}\n✉️ Email: ${email}`;
        } else {
            waMsgText = `Hello Vasile! I am ${name}. I submitted order ${orderRef} on DreamCarHunt™:\n\n🚗 Model: ${model}\n📦 Tier: ${window.selectedTier === 'STANDARD' ? 'Standard Audit (€19.90)' : 'VIP Concierge (€49.90)'}\n💰 Budget: €${budget}\n🛠️ PR options: ${options.join(', ') || 'Unicorn spec'}\n📞 Phone: ${phone}\n✉️ Email: ${email}`;
        }

        const waBtn = document.getElementById('lead-wa-btn');
        if (waBtn) {
            waBtn.href = `https://wa.me/393209481876?text=${encodeURIComponent(waMsgText)}`;
        }

        // Switch to checkout display
        const formEl = document.getElementById('order-form');
        const bannerEl = document.getElementById('success-banner');
        if (formEl) formEl.style.display = 'none';
        if (bannerEl) bannerEl.classList.remove('hidden');

        // Render live PayPal & Card Buttons
        renderPayPalButtons(orderRef, amount, cur);
    })
    .catch(err => {
        console.error('Order creation error:', err);
        // Fallback display
        document.getElementById('order-form').style.display = 'none';
        document.getElementById('success-banner').classList.remove('hidden');
    });
}

function loadLiveStats() {
    fetch('/api/stats')
        .then(r => r.json())
        .then(data => {
            if (!data || !data.success) return;
            const statSavings = document.getElementById('stat-savings');
            if (statSavings && data.average_savings_eur) {
                const lang = document.documentElement.lang || 'en';
                const formatted = data.average_savings_eur.toLocaleString(lang === 'ro' ? 'ro-RO' : (lang === 'it' ? 'it-IT' : 'de-DE'));
                statSavings.innerText = lang === 'en' ? `~€${formatted}` : `~${formatted} €`;
            }
        })
        .catch(err => console.debug('Live stats notice:', err));
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    fetchLiveExchangeRate();
    renderPrGrid('ALL', '');
    loadLiveStats();
    
    // Register PWA service worker if available
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
});

// Interactive VIN Audit Redirect to carVertical (-20%)
function auditVin(inputId = 'vin-input') {
    const el = document.getElementById(inputId);
    const vin = el ? el.value.trim().toUpperCase() : '';
    const lang = document.documentElement.lang || 'en';
    
    if (!vin || vin.length < 5) {
        const msg = lang === 'ro' 
            ? 'Te rugăm să introduci o serie de șasiu validă (VIN).' 
            : (lang === 'it' ? 'Inserisci un numero di telaio (VIN) valido.' : 'Please enter a valid Chassis / VIN code.');
        alert(msg);
        if (el) el.focus();
        return;
    }
    
    window.open('/go/carvertical?vin=' + encodeURIComponent(vin), '_blank');
}


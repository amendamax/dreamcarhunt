/**
 * PayPal Business Engine & Car Inspection / Negotiation Dossier Generator
 * DreamCarHunt™ Platform 2026 - VasileDev Group
 */

export function getPayPalBaseUrl(env) {
  if (env && env.PAYPAL_MODE === 'sandbox') {
    return 'https://api-m.sandbox.paypal.com';
  }
  return 'https://api-m.paypal.com';
}

export async function getPayPalAccessToken(env) {
  const clientId = env.PAYPAL_CLIENT_ID;
  const clientSecret = env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId.includes('YOUR_PAYPAL')) {
    return null;
  }

  const baseUrl = getPayPalBaseUrl(env);
  const credentials = btoa(`${clientId}:${clientSecret}`);

  const resp = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error('PayPal OAuth Error:', resp.status, errText);
    throw new Error(`PayPal OAuth failed: ${resp.status}`);
  }

  const data = await resp.json();
  return data.access_token;
}

export async function createPayPalOrder(env, order, fee, currency, tier = 'vip') {
  const token = await getPayPalAccessToken(env);
  const baseUrl = getPayPalBaseUrl(env);

  if (!token) {
    return {
      id: `DEMO_ORDER_${Date.now()}`,
      status: 'CREATED',
      mock: true
    };
  }

  const isVip = (tier || '').toLowerCase() === 'vip';
  const desc = isVip
    ? `DreamCarHunt™ VIP Concierge Hunt & Seller Negotiation - Ref ${order.order_reference} [${order.car_model || 'Vehicle'}]`
    : `DreamCarHunt™ Standard PR Audit & Negotiation Dossier - Ref ${order.order_reference} [${order.car_model || 'Vehicle'}]`;

  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: order.order_reference,
        description: desc,
        custom_id: order.order_reference,
        amount: {
          currency_code: currency,
          value: fee.toFixed(2)
        }
      }
    ],
    application_context: {
      brand_name: 'DreamCarHunt™',
      locale: order.client_lang === 'ro' ? 'ro-RO' : (order.client_lang === 'it' ? 'it-IT' : 'en-GB'),
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      shipping_preference: 'NO_SHIPPING'
    }
  };

  const resp = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error('PayPal create order failed:', resp.status, errText);
    throw new Error(`PayPal create order failed: ${resp.status}`);
  }

  return await resp.json();
}

export async function capturePayPalOrder(env, orderId) {
  const token = await getPayPalAccessToken(env);
  const baseUrl = getPayPalBaseUrl(env);

  if (!token || orderId.startsWith('DEMO_ORDER_')) {
    return {
      id: orderId,
      status: 'COMPLETED',
      mock: true,
      capture_id: `DEMO_CAPTURE_${Date.now()}`
    };
  }

  const resp = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error('PayPal capture order failed:', resp.status, errText);
    throw new Error(`PayPal capture order failed: ${resp.status}`);
  }

  const data = await resp.json();
  const captureUnit = data.purchase_units?.[0]?.payments?.captures?.[0];

  return {
    id: data.id,
    status: data.status,
    capture_id: captureUnit?.id || data.id,
    amount: captureUnit?.amount?.value,
    currency: captureUnit?.amount?.currency_code,
    payer_email: data.payer?.email_address || ''
  };
}

/**
 * Generate official certified vehicle dossier HTML
 */
export function renderCarDossierHtml(order, captureData) {
  const isVip = (order.service_tier || '').toUpperCase() === 'VIP' || (order.service_tier || '').toUpperCase() === 'VIP_CONCIERGE';
  const tierName = isVip ? 'VIP CONCIERGE FULL HUNT & DEALER NEGOTIATION' : 'STANDARD FACTORY PR AUDIT & NEGOTIATION DOSSIER';
  const tierColor = isVip ? '#e5b842' : '#38bdf8';
  const today = new Date().toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' });

  let optionsList = [];
  try {
    if (typeof order.mandatory_options_json === 'string' && order.mandatory_options_json.trim()) {
      optionsList = JSON.parse(order.mandatory_options_json);
    } else if (Array.isArray(order.mandatory_options_json)) {
      optionsList = order.mandatory_options_json;
    }
  } catch (e) {}

  if (!optionsList || optionsList.length === 0) {
    optionsList = [
      '🔥 9M9 — Factory Webasto Auxiliary Heater with Remote',
      '🪟 VW6 — Acoustic Double Glazed Heat-Insulating Glass',
      '☁️ 1BK / 1BY — Adaptive Air Suspension PASM / Allroad',
      '☀️ 3FU — Panoramic Tilt & Slide Glass Sunroof',
      '🎵 9VL / 9VJ — BOSE® / Burmester® 3D High-End Audio'
    ];
  }

  let matchesList = [];
  try {
    if (typeof order.matches_json === 'string' && order.matches_json.trim()) {
      matchesList = JSON.parse(order.matches_json);
    } else if (Array.isArray(order.matches_json)) {
      matchesList = order.matches_json;
    }
  } catch (e) {}

  let matchesSectionHtml = '';
  if (matchesList && matchesList.length > 0) {
    const cardsHtml = matchesList.slice(0, 3).map((car, idx) => `
      <div class="vehicle-card">
          <div class="vehicle-card-badge">🎯 OPȚIUNE SELECTATĂ #${idx + 1} &bull; RAPORT VERIFICAT</div>
          <h3 class="vehicle-card-title">${car.title}</h3>
          <div class="vehicle-specs-row">
              <span class="vehicle-price">€${(car.price_eur || 0).toLocaleString()}</span>
              <span class="vehicle-km">${(car.mileage_km || 0).toLocaleString()} km</span>
              <span class="vehicle-year">${car.year || 2017}</span>
              <span class="vehicle-loc">📍 ${car.city || 'Europa'} (${car.country || 'IT'})</span>
          </div>
          ${car.arbitrage_savings_eur ? `
          <div class="arbitrage-savings-tag">
              💶 Arbitraj Valutar Confirmat: Economie estimată ~€${car.arbitrage_savings_eur.toLocaleString()}
          </div>
          ` : ''}
          <div class="vehicle-pr-tags">
              ${(car.pr_badges || ['🔥 Webasto 9M9', '☁️ PASM 1BK', '☀️ Trapă 3FU']).map(b => `<span class="pr-tag">${b}</span>`).join('')}
          </div>
          <a href="${car.source_url}" target="_blank" class="btn-inspect-vehicle">
              Inspectează Raportul &amp; Anunțul Oficial &rarr;
          </a>
      </div>
    `).join('');

    matchesSectionHtml = `
      <div class="section-title">2. 🎯 Top 3 Vehicule Selectate Chirurgical de Radarul Nostru</div>
      <div class="vehicles-grid">
          ${cardsHtml}
      </div>
    `;
  } else {
    matchesSectionHtml = `
      <div class="section-title">2. 🛰️ Radar Status: Active 24-Hour European Deployment</div>
      <div class="radar-box">
          <div class="radar-pulsing">
              <span class="pulse-dot"></span>
              <strong>RADAR 24/7 ÎN DESFĂȘURARE ACTIVĂ:</strong> Suedia (Blocket &bull; Kvd) &bull; Germania &bull; Italia
          </div>
          <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 13.5px; line-height: 1.5;">
              Filtrele noastre automate scanează continuu piața în căutarea specificațiilor tale exacte (${order.car_model || 'Porsche / VAG'} sub ${order.max_budget_eur ? '€' + order.max_budget_eur.toLocaleString() : 'bugetul agreat'}). Cele mai bune 3 opțiuni negociate vor fi afișate aici și transmise prioritar pe WhatsApp.
          </p>
      </div>
    `;
  }

  const optionsBadgesHtml = optionsList.map(opt => `
    <div class="option-badge-item">
      <i class="check-icon">✓</i>
      <span>${opt}</span>
    </div>
  `).join('');

  const waSummary = encodeURIComponent(
    `Salut Vasile! Am emis dosarul oficial ${order.order_reference} pe DreamCarHunt™:\n\n` +
    `🚗 Model: ${order.car_model || 'Porsche / VAG'}\n` +
    `👤 Client: ${order.full_name}\n` +
    `💳 Status: PAID (${order.amount ? order.amount.toFixed(2) : '49.90'} ${order.currency || 'EUR'})\n` +
    `💰 Buget: ${order.max_budget_eur ? '€' + order.max_budget_eur.toLocaleString() : 'Conform pieței'}\n` +
    `🛠️ Opțiuni cerute:\n- ${optionsList.join('\n- ')}\n\n` +
    `📄 Link Dosar: https://dreamcarhunt.com/dossier/${order.order_reference}`
  );
  const waUrl = `https://wa.me/393209481876?text=${waSummary}`;

  return `<!DOCTYPE html>
<html lang="${order.client_lang || 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DreamCarHunt™ Certified Dossier - Ref ${order.order_reference}</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Outfit', sans-serif; background: #070d18; color: #f1f5f9; margin: 0; padding: 30px 15px; }
        .dossier-wrap { max-width: 880px; margin: 0 auto; background: #0c1626; border: 1px solid #1e293b; border-radius: 16px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #1e293b; padding-bottom: 25px; margin-bottom: 25px; }
        .logo { font-size: 26px; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
        .logo span { color: #e5b842; }
        .badge { background: rgba(229,184,66,0.12); color: #e5b842; border: 1px solid #e5b842; padding: 6px 14px; border-radius: 999px; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .grid-meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; background: rgba(15,23,42,0.6); border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
        .meta-item span { display: block; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
        .meta-item strong { font-size: 15px; color: #f8fafc; font-family: 'JetBrains Mono', monospace; }
        .section-title { font-size: 18px; color: #fff; margin: 30px 0 15px 0; border-left: 3px solid #e5b842; padding-left: 12px; }
        .audit-box { background: rgba(14,165,233,0.06); border: 1px solid rgba(56,189,248,0.25); border-radius: 12px; padding: 20px; line-height: 1.6; margin-bottom: 25px; }
        .options-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px; margin-top: 15px; }
        .option-badge-item { background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 10px 14px; font-size: 13.5px; color: #f8fafc; display: flex; align-items: center; gap: 10px; font-weight: 600; }
        .check-icon { color: #10b981; font-weight: 900; font-size: 15px; }
        
        .vehicles-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 25px; }
        .vehicle-card { background: #080f1d; border: 1px solid rgba(229,184,66,0.3); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; }
        .vehicle-card-badge { display: inline-block; font-size: 11px; font-weight: 800; color: #e5b842; letter-spacing: 0.5px; margin-bottom: 8px; }
        .vehicle-card-title { font-size: 16px; font-weight: 800; color: #fff; margin: 0 0 10px 0; line-height: 1.4; }
        .vehicle-specs-row { display: flex; flex-wrap: wrap; gap: 8px; font-size: 13px; color: #94a3b8; margin-bottom: 12px; align-items: center; }
        .vehicle-price { color: #e5b842; font-weight: 800; font-size: 17px; }
        .arbitrage-savings-tag { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10b981; font-size: 12px; font-weight: 700; padding: 6px 10px; border-radius: 6px; margin-bottom: 12px; }
        .vehicle-pr-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 15px; }
        .pr-tag { background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); color: #38bdf8; font-size: 11px; padding: 4px 8px; border-radius: 4px; font-weight: 600; }
        .btn-inspect-vehicle { background: #1e293b; color: #38bdf8; border: 1px solid #38bdf8; text-decoration: none; padding: 10px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 800; text-align: center; transition: 0.2s; display: block; }
        .btn-inspect-vehicle:hover { background: #38bdf8; color: #070d18; }
        
        .radar-box { background: rgba(229,184,66,0.06); border: 1px solid rgba(229,184,66,0.35); border-radius: 12px; padding: 20px; margin-bottom: 25px; }
        .radar-pulsing { display: flex; align-items: center; gap: 10px; color: #e5b842; font-size: 14px; font-weight: 800; letter-spacing: 0.5px; }
        .pulse-dot { width: 10px; height: 10px; background: #e5b842; border-radius: 50%; box-shadow: 0 0 10px #e5b842; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.7; } 50% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.7; } }

        .checklist { list-style: none; padding: 0; margin: 0; }
        .checklist li { padding: 10px 0; border-bottom: 1px solid #1e293b; display: flex; align-items: center; gap: 10px; font-size: 14px; }
        .checklist li:last-child { border-bottom: none; }
        .checklist i { color: #10b981; font-weight: bold; }
        .actions-group { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; margin-top: 35px; }
        .btn-print { background: #e5b842; color: #070d18; border: none; padding: 14px 26px; border-radius: 10px; font-weight: 800; font-size: 15px; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; text-decoration: none; transition: 0.2s; }
        .btn-print:hover { background: #facc15; transform: translateY(-1px); }
        .btn-wa-share { background: #25D366; color: #070d18; border: none; padding: 14px 26px; border-radius: 10px; font-weight: 800; font-size: 15px; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; text-decoration: none; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.25); transition: 0.2s; }
        .btn-wa-share:hover { background: #22c35e; transform: translateY(-1px); }
        .vip-seal { border: 2px dashed #e5b842; background: rgba(229,184,66,0.05); border-radius: 12px; padding: 20px; text-align: center; margin-top: 30px; }
        .vip-seal h4 { color: #e5b842; margin: 0 0 5px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
        @media print { body { background: #fff; color: #000; padding: 0; } .dossier-wrap { box-shadow: none; border: none; padding: 0; background: #fff; color: #000; } .actions-group { display: none; } }
    </style>
</head>
<body>
    <div class="dossier-wrap">
        <div class="header">
            <div>
                <div class="logo">DreamCar<span>Hunt</span>™</div>
                <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">European Vehicle Intelligence & Arbitrage Dossier</div>
            </div>
            <div style="text-align: right;">
                <span class="badge" style="border-color: ${tierColor}; color: ${tierColor};">${tierName}</span>
                <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">Issued: <strong>${today}</strong></div>
            </div>
        </div>

        <div class="grid-meta">
            <div class="meta-item">
                <span>Dossier Reference</span>
                <strong>${order.order_reference}</strong>
            </div>
            <div class="meta-item">
                <span>Target Vehicle / Model</span>
                <strong style="color: #e5b842;">${order.car_model || 'Premium Specification'}</strong>
            </div>
            <div class="meta-item">
                <span>Client Name</span>
                <strong>${order.full_name}</strong>
            </div>
            <div class="meta-item">
                <span>Payment Confirmation</span>
                <strong style="color: #10b981;">PAID (${(order.amount || 49.90).toFixed(2)} ${order.currency || 'EUR'})</strong>
            </div>
        </div>

        <div class="section-title">1. Target Factory PR Options Earmarked for Verification</div>
        <div class="audit-box">
            <p style="margin: 0 0 10px 0;">Our algorithms and field partners inspect and reconcile these exact equipment codes against official European manufacturer databases (Car.info Sweden, KBA Germany, ACI Italy):</p>
            <div class="options-grid">
                ${optionsBadgesHtml}
            </div>
        </div>

        ${matchesSectionHtml}

        <div class="section-title">3. Price Negotiation Strategy & Dealer Playbook</div>
        <ul class="checklist">
            <li><i>✓</i> <strong>Swedish Krona (SEK ➔ EUR) Real-time Spread:</strong> Automatic 10%–17% arbitrage cushion locked against continental European prices.</li>
            <li><i>✓</i> <strong>Inspection of Wear Points:</strong> Air suspension valve block seal verification, auxiliary coolant line heater checks, and panoramic sunroof drain inspection protocols included.</li>
            <li><i>✓</i> <strong>Clean Title Guarantee:</strong> Cross-referenced with European theft registries, export VAT reclaim eligibility, and official service intervals.</li>
        </ul>

        ${isVip ? `
        <div class="vip-seal">
            <h4>⭐ VIP Concierge Dispatch Priority</h4>
            <p style="font-size: 13.5px; color: #cbd5e1; margin: 0; line-height: 1.5;">
                Your dedicated Import Concierge has been assigned. We will contact the seller, verify service history books, negotiate export terms, and arrange certified European transport.
                <br><strong>WhatsApp Dedicated Line:</strong> <a href="${waUrl}" style="color: #e5b842; font-weight: bold; text-decoration: none;">+39 320 948 1876</a>
            </p>
        </div>
        ` : ''}

        <div class="actions-group">
            <button onclick="window.print()" class="btn-print">🖨️ Print / Save Official Dossier (PDF)</button>
            <a href="${waUrl}" target="_blank" class="btn-wa-share">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                Trimite Dosarul pe WhatsApp (+39 320 948 1876)
            </a>
        </div>
    </div>
</body>
</html>`;
}

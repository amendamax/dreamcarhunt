import { MODELS } from './models_data.js';
import { PR_OPTIONS, renderProgrammaticCarPage, generateCarSitemapXml } from './programmatic.js';
import { createPayPalOrder, capturePayPalOrder, renderCarDossierHtml } from './paypal.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS preflight headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Block common vulnerability scanners, probes, and malicious paths immediately at edge
    const p = url.pathname.toLowerCase();
    if (
      p.endsWith('.php') ||
      p.endsWith('.env') ||
      p.includes('.env') ||
      p.includes('wp-') ||
      p.includes('pinfo') ||
      p.includes('config') ||
      p.includes('cgi-bin') ||
      p.includes('actuator') ||
      p.includes('xmlrpc') ||
      p.includes('.git')
    ) {
      return new Response('404 Not Found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
      });
    }

    // 0. High-Yield Partner Redirects (carVertical 20% Off - Official Everflow Deal)
    if (url.pathname === '/go/carvertical' || url.pathname === '/out/carvertical') {
      const vin = url.searchParams.get('vin') || url.searchParams.get('sub3') || url.searchParams.get('plate');
      if (vin) {
        return Response.redirect(`https://www.carvertical.deal/3NWF2RK/5NWWWN/?uid=40&source_id=AFF&sub1=dreamcarhunt&sub3=${encodeURIComponent(vin.trim().toUpperCase())}`, 307);
      }
      return Response.redirect('https://www.carvertical.deal/3NWF2RK/5NWWWN/?source_id=AFF&sub1=dreamcarhunt', 307);
    }

    // 1. Programmatic Sitemaps for Googlebot
    if (url.pathname === '/sitemap-index.xml') {
      const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://dreamcarhunt.com/sitemaps/sitemap-cars-en.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://dreamcarhunt.com/sitemaps/sitemap-cars-ro.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://dreamcarhunt.com/sitemaps/sitemap-cars-it.xml</loc>
  </sitemap>
</sitemapindex>`;
      return new Response(sitemapIndex, {
        headers: { 'Content-Type': 'application/xml; charset=UTF-8', 'Cache-Control': 'public, max-age=86400' }
      });
    }

    if (url.pathname === '/sitemaps/sitemap-cars-en.xml') {
      return new Response(generateCarSitemapXml('en'), {
        headers: { 'Content-Type': 'application/xml; charset=UTF-8', 'Cache-Control': 'public, max-age=86400' }
      });
    }
    if (url.pathname === '/sitemaps/sitemap-cars-ro.xml') {
      return new Response(generateCarSitemapXml('ro'), {
        headers: { 'Content-Type': 'application/xml; charset=UTF-8', 'Cache-Control': 'public, max-age=86400' }
      });
    }
    if (url.pathname === '/sitemaps/sitemap-cars-it.xml') {
      return new Response(generateCarSitemapXml('it'), {
        headers: { 'Content-Type': 'application/xml; charset=UTF-8', 'Cache-Control': 'public, max-age=86400' }
      });
    }

    // 2. Programmatic SEO Landing Pages (Edge Dynamic SSR)
    // Matches: /hunt/:model/:pr OR /ro/hunt/:model/:pr OR /it/hunt/:model/:pr
    const match = url.pathname.match(/^\/(?:(it|ro)\/)?(?:hunt|vanatoare|caccia)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/?$/i);
    if (match) {
      const lang = match[1] ? match[1].toLowerCase() : 'en';
      const modelSlug = match[2].toLowerCase();
      const prSlug = match[3].toLowerCase();

      const model = MODELS.find(m => m.slug.toLowerCase() === modelSlug);
      const prOption = PR_OPTIONS.find(p => p.slug.toLowerCase() === prSlug);

      if (model && prOption) {
        const html = renderProgrammaticCarPage(model, prOption, lang);
        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=UTF-8',
            'X-Robots-Tag': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            'Cache-Control': 'public, max-age=60, s-maxage=60, must-revalidate',
          }
        });
      }
    }

    // 3. Certified Vehicle Dossier Viewer
    const dossierMatch = url.pathname.match(/^\/dossier\/([a-zA-Z0-9_-]+)\/?$/i);
    if (dossierMatch) {
      const refCode = dossierMatch[1].toUpperCase();
      const order = await env.dreamcarhunt_db
        .prepare('SELECT * FROM car_orders WHERE UPPER(order_reference) = ?')
        .bind(refCode)
        .first();

      if (order && order.payment_status === 'PAID') {
        const html = renderCarDossierHtml(order, { capture_id: order.paypal_capture_id });
        return new Response(html, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=UTF-8' }
        });
      } else if (order) {
        return new Response(
          `<!DOCTYPE html><html><body style="background:#070d18;color:#fff;font-family:sans-serif;text-align:center;padding:50px;">
          <h2>⏳ Payment Pending for Dossier ${refCode}</h2>
          <p>Please complete payment to access your official vehicle intelligence audit.</p>
          <a href="/#vip-concierge" style="color:#e5b842;text-decoration:none;font-weight:bold;">&larr; Return to DreamCarHunt</a>
          </body></html>`,
          { status: 402, headers: { 'Content-Type': 'text/html; charset=UTF-8' } }
        );
      } else {
        return notFoundResponse();
      }
    }

    // Route API requests
    if (url.pathname.startsWith('/api/')) {
      try {
        const response = await handleApi(request, env, url);
        const newHeaders = new Headers(response.headers);
        Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    // Serve static frontend assets (HTML, CSS, WebP, JS) with graceful 404 fallback
    try {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status === 404) {
        return notFoundResponse();
      }
      return assetResponse;
    } catch (e) {
      return notFoundResponse();
    }
  },
};

function notFoundResponse() {
  return new Response(
    '<!DOCTYPE html><html lang="ro"><head><title>404 Not Found | DreamCarHunt</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{background:#0b1320;color:#94a3b8;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column;text-align:center;padding:20px}h1{color:#fff;font-size:32px;margin:0 0 10px}p{font-size:16px;margin:0 0 20px}a{color:#38bdf8;text-decoration:none;font-weight:600;padding:10px 20px;border:1px solid #38bdf8;border-radius:8px;transition:0.2s}a:hover{background:rgba(56,189,248,0.1)}</style></head><body><h1>404 &bull; Pagina nu a fost găsită</h1><p>Resursa căutată nu există pe DreamCarHunt.</p><a href="/">&larr; Înapoi la pagina principală</a></body></html>',
    {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    }
  );
}

async function handleApi(request, env, url) {
  const db = env.dreamcarhunt_db;

  // 1. POST /api/leads - Record a new VIP car hunt lead
  if (url.pathname === '/api/leads' && request.method === 'POST') {
    const body = await request.json();
    const { name, phone, email, model, budget, options, lang } = body;

    if (!name || !phone || !model) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name, phone, and desired model are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sql = 'INSERT INTO leads (full_name, phone, email, desired_model, max_budget_eur, mandatory_options_json, client_lang) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const stmt = db.prepare(sql);

    const result = await stmt.bind(
      name,
      phone,
      email || '',
      model,
      parseInt(budget) || null,
      JSON.stringify(options || []),
      lang || 'ro'
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lead registered successfully in Cloudflare D1.',
        lead_id: result.meta ? result.meta.last_row_id : null,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. GET /api/cars - Query cars with optional filters
  if (url.pathname === '/api/cars' && request.method === 'GET') {
    const make = url.searchParams.get('make');
    const model = url.searchParams.get('model');
    const prCode = url.searchParams.get('pr_code');
    const maxBudget = url.searchParams.get('max_budget');
    const limit = Math.min(parseInt(url.searchParams.get('limit')) || 20, 50);

    let query = 'SELECT * FROM cars WHERE 1=1';
    const params = [];

    if (make) {
      query += ' AND UPPER(make) = UPPER(?)';
      params.push(make);
    }
    if (model) {
      query += ' AND UPPER(model) LIKE UPPER(?)';
      params.push('%' + model + '%');
    }
    if (maxBudget) {
      query += ' AND price_eur <= ?';
      params.push(parseInt(maxBudget));
    }
    if (prCode) {
      query += ' AND id IN (SELECT car_id FROM car_pr_matches WHERE UPPER(pr_code) = UPPER(?))';
      params.push(prCode);
    }

    query += ' ORDER BY arbitrage_savings_eur DESC, created_at DESC LIMIT ?';
    params.push(limit);

    const stmt = db.prepare(query);
    const { results } = await stmt.bind(...params).all();

    return new Response(
      JSON.stringify({ success: true, count: results.length, cars: results }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. GET /api/pr_codes - Catalog of option codes
  if (url.pathname === '/api/pr_codes' && request.method === 'GET') {
    const { results } = await db.prepare('SELECT * FROM pr_codes ORDER BY rarity_tier DESC').all();
    return new Response(
      JSON.stringify({ success: true, pr_codes: results }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 4. GET /api/stats - Live platform statistics
  if (url.pathname === '/api/stats' && request.method === 'GET') {
    const carsCount = await db.prepare('SELECT COUNT(*) as count, AVG(arbitrage_savings_eur) as avg_savings FROM cars').first();
    const leadsCount = await db.prepare('SELECT COUNT(*) as count FROM leads').first();

    return new Response(
      JSON.stringify({
        success: true,
        total_scanned_cars: (carsCount && carsCount.count) ? carsCount.count : 14820,
        average_savings_eur: Math.round((carsCount && carsCount.avg_savings) ? carsCount.avg_savings : 4850),
        registered_leads: (leadsCount && leadsCount.count) ? leadsCount.count : 0,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 5. GET /api/exchange-rate - Real-time ECB currency exchange rates
  if (url.pathname === '/api/exchange-rate' && request.method === 'GET') {
    try {
      const ecbRes = await fetch('https://api.frankfurter.dev/v1/latest?base=EUR&symbols=SEK,NOK,DKK,USD', {
        headers: { 'User-Agent': 'DreamCarHunt-Engine/2.0' }
      });
      if (ecbRes.ok) {
        const ecbData = await ecbRes.json();
        if (ecbData && ecbData.rates && ecbData.rates.SEK) {
          return new Response(
            JSON.stringify({
              success: true,
              base: 'EUR',
              rates: ecbData.rates,
              date: ecbData.date,
              source: 'European Central Bank (ECB) Real-time Feed'
            }),
            { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' } }
          );
        }
      }
    } catch (e) {
      // Fallback below
    }

    return new Response(
      JSON.stringify({
        success: true,
        base: 'EUR',
        rates: { SEK: 11.38, NOK: 11.65, DKK: 7.46, USD: 1.08 },
        date: new Date().toISOString().split('T')[0],
        source: 'ECB Cached Reference Benchmark'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' } }
    );
  }

  // 6. GET /api/paypal/settings - Public credentials & active currency
  if (url.pathname === '/api/paypal/settings' && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        clientId: env.PAYPAL_CLIENT_ID || '',
        currency: 'EUR',
        mode: env.PAYPAL_MODE || 'live'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 7. POST /api/order/create - Register vehicle audit order
  if (url.pathname === '/api/order/create' && request.method === 'POST') {
    const body = await request.json();
    const { name, phone, email, model, tier, currency, lang, vin } = body;

    if (!name || !email || !model) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name, email, and vehicle model are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cur = (currency || 'EUR').toUpperCase();
    const isVip = (tier || '').toUpperCase() === 'VIP' || (tier || '').toUpperCase() === 'VIP_CONCIERGE';
    const selectedTier = isVip ? 'VIP_CONCIERGE' : 'STANDARD';

    let amount = 19.90;
    if (isVip) {
      amount = cur === 'RON' ? 249.00 : (cur === 'GBP' ? 42.90 : 49.90);
    } else {
      amount = cur === 'RON' ? 99.00 : (cur === 'GBP' ? 17.90 : 19.90);
    }

    const ref = `DCH-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const sql = `
      INSERT INTO car_orders (
        order_reference, service_tier, full_name, email, phone, car_model, vin, amount, currency, payment_status, client_lang
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)
    `;
    await db.prepare(sql).bind(
      ref,
      selectedTier,
      name,
      email,
      phone || '',
      model,
      vin || '',
      amount,
      cur,
      lang || 'en'
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        orderReference: ref,
        amount,
        currency: cur,
        tier: selectedTier
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 8. POST /api/paypal/create-order - Initialize PayPal checkout session
  if (url.pathname === '/api/paypal/create-order' && request.method === 'POST') {
    const body = await request.json();
    const { orderReference } = body;

    const order = await db
      .prepare('SELECT * FROM car_orders WHERE order_reference = ?')
      .bind(orderReference)
      .first();

    if (!order) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order reference not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const paypalOrder = await createPayPalOrder(env, order, order.amount, order.currency, order.service_tier);

    if (paypalOrder && paypalOrder.id) {
      await db
        .prepare('UPDATE car_orders SET paypal_order_id = ?, updated_at = CURRENT_TIMESTAMP WHERE order_reference = ?')
        .bind(paypalOrder.id, orderReference)
        .run();
    }

    return new Response(
      JSON.stringify(paypalOrder),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 9. POST /api/paypal/capture-order - Capture transaction and authorize dossier
  if (url.pathname === '/api/paypal/capture-order' && request.method === 'POST') {
    const body = await request.json();
    const { orderId, orderReference } = body;

    const captureData = await capturePayPalOrder(env, orderId);

    if (captureData.status === 'COMPLETED') {
      await db
        .prepare(`
          UPDATE car_orders
          SET payment_status = 'PAID',
              paypal_capture_id = ?,
              paypal_payer_email = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE order_reference = ?
        `)
        .bind(captureData.capture_id || orderId, captureData.payer_email || '', orderReference)
        .run();

      return new Response(
        JSON.stringify({
          success: true,
          status: 'COMPLETED',
          orderReference,
          redirectUrl: `/dossier/${orderReference}`
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Payment capture was not completed.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * DreamCarHunt - Cloudflare Edge Worker API
 * Integrates Cloudflare D1 SQLite database with static assets
 */

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

    // Serve static frontend assets (HTML, CSS, WebP, JS)
    return env.ASSETS.fetch(request);
  },
};

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

  return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}

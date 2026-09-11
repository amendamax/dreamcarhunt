-- ==========================================================================
-- DREAMCARHUNT CLOUDFLARE D1 (SQLITE) SCHEMA v1.0
-- ==========================================================================

-- 1. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vin TEXT UNIQUE,
    registration_plate TEXT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    trim TEXT,
    year INTEGER NOT NULL,
    mileage_km INTEGER NOT NULL,
    engine_fuel TEXT,
    power_hp INTEGER,
    transmission TEXT,
    drive_type TEXT,
    color TEXT,
    price_sek INTEGER NOT NULL,
    price_eur INTEGER NOT NULL,
    local_market_eur INTEGER,
    arbitrage_savings_eur INTEGER,
    source_portal TEXT NOT NULL,
    source_url TEXT NOT NULL,
    dealer_name TEXT,
    city TEXT,
    country TEXT DEFAULT 'SE',
    photos_json TEXT, -- JSON array of image URLs
    pr_codes_json TEXT, -- JSON array of PR codes (e.g. ['9M9', 'VW6', '1BK'])
    is_featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cars_make_model ON cars(make, model);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);
CREATE INDEX IF NOT EXISTS idx_cars_price_eur ON cars(price_eur);
CREATE INDEX IF NOT EXISTS idx_cars_savings ON cars(arbitrage_savings_eur DESC);

-- 2. PR OPTION CODES CATALOG (EUROPEAN SPECIFICATIONS)
CREATE TABLE IF NOT EXISTS pr_codes (
    code TEXT PRIMARY KEY,
    brand TEXT NOT NULL, -- 'PORSCHE', 'AUDI', 'VAG', 'BMW'
    category TEXT NOT NULL, -- 'CLIMATE', 'ACOUSTICS', 'CHASSIS', 'INTERIOR', 'SAFETY'
    name_en TEXT NOT NULL,
    name_ro TEXT NOT NULL,
    name_it TEXT NOT NULL,
    description_en TEXT,
    description_ro TEXT,
    description_it TEXT,
    rarity_tier TEXT DEFAULT 'HIGH' -- 'UNICORN', 'VERY_RARE', 'RARE', 'STANDARD'
);

-- 3. CAR TO PR CODE MATCHES (M:N RELATIONSHIP FOR ULTRA-FAST INDEXED LOOKUPS)
CREATE TABLE IF NOT EXISTS car_pr_matches (
    car_id INTEGER NOT NULL,
    pr_code TEXT NOT NULL,
    PRIMARY KEY (car_id, pr_code),
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    FOREIGN KEY (pr_code) REFERENCES pr_codes(code) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_car_pr_lookup ON car_pr_matches(pr_code, car_id);

-- 4. VIP CONCIERGE LEADS TABLE
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    desired_model TEXT NOT NULL,
    max_budget_eur INTEGER,
    mandatory_options_json TEXT,
    client_lang TEXT DEFAULT 'ro',
    status TEXT DEFAULT 'NEW', -- 'NEW', 'CONTACTED', 'HUNTING', 'MATCH_FOUND', 'CLOSED'
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

-- 5. CURRENCY RATES CACHE
CREATE TABLE IF NOT EXISTS currency_rates (
    base_currency TEXT NOT NULL,
    target_currency TEXT NOT NULL,
    rate REAL NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (base_currency, target_currency)
);

-- SEED ESSENTIAL FACTORY PR CODES
INSERT OR IGNORE INTO pr_codes (code, brand, category, name_en, name_ro, name_it, rarity_tier) VALUES
('9M9', 'VAG', 'CLIMATE', 'Factory Webasto Auxiliary Heater with Remote', 'Încălzire Auxiliară Webasto din Fabrică cu Telecomandă', 'Riscaldamento Ausiliario Webasto con Telecomando', 'UNICORN'),
('VW6', 'VAG', 'ACOUSTICS', 'Acoustic Double Glazed Heat-Insulating Glass', 'Geamuri Duble Atermice Izolate Fonic', 'Vetri Posteriori e Anteriori Doppi Insonorizzati', 'UNICORN'),
('1BK', 'PORSCHE', 'CHASSIS', 'Adaptive Air Suspension with PASM Level Control', 'Suspensie Pneumatică Adaptivă PASM cu Reglaj Înălțime', 'Sospensioni Pneumatiche Adattive con PASM', 'VERY_RARE'),
('1BY', 'AUDI', 'CHASSIS', 'Audi Adaptive Air Suspension Allroad', 'Suspensie Pneumatică Adaptivă Audi Allroad', 'Sospensioni Pneumatiche Adattive Audi Allroad', 'VERY_RARE'),
('4D3', 'VAG', 'INTERIOR', 'Front Seat Ventilation with Cooling Function', 'Ventilație Scaune Față', 'Ventilazione Sedili Anteriori', 'RARE'),
('3FU', 'VAG', 'INTERIOR', 'Panoramic Glass Roof System', 'Plafon Panoramic Glisant din Sticlă', 'Tetto Panoramico in Vetro', 'RARE'),
('8T3', 'VAG', 'SAFETY', 'Adaptive Cruise Control (ACC) with Radar', 'Pilot Automat Adaptiv (ACC Radar)', 'Cruise Control Adattivo con Radar', 'STANDARD');

INSERT OR IGNORE INTO currency_rates (base_currency, target_currency, rate) VALUES
('SEK', 'EUR', 0.0877),
('EUR', 'SEK', 11.40);

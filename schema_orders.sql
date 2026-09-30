CREATE TABLE IF NOT EXISTS car_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_reference TEXT UNIQUE NOT NULL,
    lead_id INTEGER,
    car_id INTEGER,
    service_tier TEXT DEFAULT 'STANDARD',
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    car_model TEXT,
    vin TEXT,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'EUR',
    payment_status TEXT DEFAULT 'PENDING',
    paypal_order_id TEXT,
    paypal_capture_id TEXT,
    paypal_payer_email TEXT,
    client_lang TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_car_orders_ref ON car_orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_car_orders_status ON car_orders(payment_status);

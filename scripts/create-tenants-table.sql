-- Create tenants table for storing registered tenant accounts
CREATE TABLE IF NOT EXISTS tenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    unit_number TEXT NOT NULL,
    building TEXT NOT NULL,
    phone TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    move_in_date DATE,
    lease_end_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tenants_email ON tenants(email);
CREATE INDEX IF NOT EXISTS idx_tenants_unit ON tenants(unit_number, building);

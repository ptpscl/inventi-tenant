-- Create maintenance requests table for storing all tenant requests
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT UNIQUE NOT NULL, -- Human-readable ID like MNT-2024-001
    tenant_id INTEGER NOT NULL,
    tenant_email TEXT NOT NULL,
    request_type TEXT NOT NULL CHECK (request_type IN ('maintenance', 'incident', 'service', 'visitor')),
    category TEXT NOT NULL,
    subcategory TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'acknowledged', 'in-progress', 'completed', 'cancelled')),
    location TEXT NOT NULL,
    preferred_time TEXT,
    photos TEXT, -- JSON array of photo URLs
    contact_permission BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    scheduled_date DATETIME,
    completed_date DATETIME,
    assigned_to TEXT,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    notes TEXT,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_requests_tenant ON maintenance_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_priority ON maintenance_requests(priority);
CREATE INDEX IF NOT EXISTS idx_requests_type ON maintenance_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_requests_created ON maintenance_requests(created_at);

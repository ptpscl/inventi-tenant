-- Create table for tracking request status updates and communications
CREATE TABLE IF NOT EXISTS request_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER NOT NULL,
    update_type TEXT NOT NULL CHECK (update_type IN ('status_change', 'comment', 'photo_added', 'scheduled', 'completed')),
    old_status TEXT,
    new_status TEXT,
    message TEXT,
    created_by TEXT NOT NULL, -- 'tenant' or staff member name
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    photos TEXT, -- JSON array of additional photos
    FOREIGN KEY (request_id) REFERENCES maintenance_requests(id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_updates_request ON request_updates(request_id);
CREATE INDEX IF NOT EXISTS idx_updates_created ON request_updates(created_at);

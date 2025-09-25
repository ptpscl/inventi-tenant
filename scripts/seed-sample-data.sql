-- Insert sample tenant data
INSERT OR IGNORE INTO tenants (email, first_name, last_name, unit_number, building, phone, emergency_contact_name, emergency_contact_phone, move_in_date, lease_end_date) VALUES
('john.doe@email.com', 'John', 'Doe', '305', 'Building A', '+1-555-0123', 'Jane Doe', '+1-555-0124', '2023-01-15', '2024-12-31'),
('sarah.wilson@email.com', 'Sarah', 'Wilson', '412', 'Building B', '+1-555-0125', 'Mike Wilson', '+1-555-0126', '2023-03-01', '2025-02-28'),
('mike.chen@email.com', 'Mike', 'Chen', '208', 'Building A', '+1-555-0127', 'Lisa Chen', '+1-555-0128', '2023-06-01', '2024-05-31');

-- Insert sample maintenance requests
INSERT OR IGNORE INTO maintenance_requests (
    request_id, tenant_id, tenant_email, request_type, category, title, description, 
    priority, status, location, preferred_time, contact_permission, created_at
) VALUES
('MNT-2024-001', 1, 'john.doe@email.com', 'maintenance', 'Plumbing', 'Leaky Kitchen Faucet', 'The kitchen faucet has been dripping constantly for the past week. Water is pooling around the base.', 'medium', 'in-progress', 'Kitchen', 'Morning (9 AM - 12 PM)', TRUE, '2024-01-15 09:30:00'),
('INC-2024-001', 2, 'sarah.wilson@email.com', 'incident', 'Safety', 'Broken Hallway Light', 'The hallway light fixture fell and shattered. Glass debris in the corridor needs immediate cleanup.', 'high', 'completed', 'Hallway outside Unit 412', 'ASAP', TRUE, '2024-01-14 16:45:00'),
('SRV-2024-001', 3, 'mike.chen@email.com', 'service', 'Cleaning', 'Deep Carpet Cleaning', 'Request professional carpet cleaning service for living room and bedrooms before lease renewal.', 'low', 'submitted', 'Living Room, Bedrooms', 'Afternoon (1 PM - 5 PM)', FALSE, '2024-01-16 11:20:00');

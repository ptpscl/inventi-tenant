-- Insert sample maintenance requests data
INSERT OR IGNORE INTO maintenance_requests (
    request_id, tenant_id, tenant_email, request_type, category, title, description, 
    priority, status, location, preferred_time, contact_permission, created_at
) VALUES
('MNT-2024-001', 1, 'john.doe@email.com', 'maintenance', 'Plumbing', 'Leaky Kitchen Faucet', 'The kitchen faucet has been dripping constantly for the past week. Water is pooling around the base and causing damage to the cabinet below. The drip rate has increased significantly over the last two days.', 'medium', 'in-progress', 'Building A, Floor 3, Unit 305', 'Morning (9 AM - 12 PM)', 1, '2024-01-15 09:30:00'),

('INC-2024-001', 2, 'sarah.wilson@email.com', 'incident', 'Safety', 'Broken Hallway Light Fixture', 'The hallway light fixture outside my unit fell and shattered around 4 PM today. There is broken glass scattered across the hallway floor that needs immediate cleanup. The fixture appears to have fallen due to a loose mounting bracket.', 'high', 'completed', 'Building B, Floor 4, Hallway outside Unit 412', 'ASAP', 1, '2024-01-14 16:45:00'),

('SRV-2024-001', 3, 'mike.chen@email.com', 'service', 'Cleaning', 'Deep Carpet Cleaning Request', 'I would like to request professional carpet cleaning service for my living room and both bedrooms before my lease renewal next month. The carpets have some stains from normal wear and tear that regular vacuuming cannot remove.', 'low', 'submitted', 'Building A, Floor 2, Unit 208', 'Afternoon (1 PM - 5 PM)', 0, '2024-01-16 11:20:00'),

('VIS-2024-001', 1, 'john.doe@email.com', 'visitor', 'Delivery', 'Large Furniture Delivery Access', 'I have a large sectional sofa being delivered this Friday and need assistance with building access and elevator reservation. The delivery window is 10 AM to 2 PM. The delivery team will need access to the freight elevator.', 'medium', 'acknowledged', 'Building A, Floor 3, Unit 305', 'Morning (10 AM - 2 PM)', 1, '2024-01-17 08:15:00'),

('MNT-2024-002', 2, 'sarah.wilson@email.com', 'maintenance', 'Electrical', 'Bedroom Outlet Not Working', 'The electrical outlet next to my bed stopped working yesterday. I have tried resetting the circuit breaker but it did not help. This outlet powers my bedside lamp and phone charger, so it is quite inconvenient.', 'medium', 'submitted', 'Building B, Floor 4, Unit 412', 'Flexible', 1, '2024-01-18 14:30:00');

-- Insert sample request updates
INSERT OR IGNORE INTO request_updates (request_id, update_type, old_status, new_status, message, created_by, created_at) VALUES
(1, 'status_change', 'submitted', 'acknowledged', 'Request received and assigned to maintenance team.', 'Property Manager', '2024-01-15 10:00:00'),
(1, 'status_change', 'acknowledged', 'in-progress', 'Maintenance technician dispatched to unit.', 'Maintenance Team', '2024-01-15 14:30:00'),
(2, 'status_change', 'submitted', 'acknowledged', 'Emergency cleanup crew dispatched immediately.', 'Property Manager', '2024-01-14 17:00:00'),
(2, 'status_change', 'acknowledged', 'in-progress', 'Cleanup in progress, new fixture being installed.', 'Maintenance Team', '2024-01-14 18:30:00'),
(2, 'status_change', 'in-progress', 'completed', 'Hallway cleaned and new fixture installed. Issue resolved.', 'Maintenance Team', '2024-01-14 20:00:00'),
(4, 'status_change', 'submitted', 'acknowledged', 'Freight elevator reserved for Friday 10 AM - 2 PM.', 'Property Manager', '2024-01-17 09:00:00');

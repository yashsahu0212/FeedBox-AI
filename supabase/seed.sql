-- ========================================================
-- CampusAI Maintenance Portal — Supabase Seed Data
-- File: supabase/seed.sql
-- ========================================================

-- Insert Initial 9 Departments
INSERT INTO public.departments (id, name, code, description) VALUES
  ('11111111-1111-1111-1111-111111111101', 'CTS', 'CTS', 'Computer & Technology Services, Campus IT Infrastructure, Wi-Fi, and Network Operations'),
  ('11111111-1111-1111-1111-111111111102', 'Administration', 'ADMIN', 'General Administrative Desk, Campus Security, Transport, and Logistics'),
  ('11111111-1111-1111-1111-111111111103', 'Placement Cell', 'PLACEMENT', 'Career Services, Campus Recruitment Drives, and Corporate Liaison'),
  ('11111111-1111-1111-1111-111111111104', 'Hostel', 'HOSTEL', 'Student Residences, Mess Facilities, Water Supply, and Hostel Maintenance'),
  ('11111111-1111-1111-1111-111111111105', 'Academic', 'ACADEMIC', 'Classrooms, Lecture Halls, Curriculum Support, and Faculty Labs'),
  ('11111111-1111-1111-1111-111111111106', 'Examination Cell', 'EXAM', 'Exams, Grade Cards, Result Processing, and Hall Tickets'),
  ('11111111-1111-1111-1111-111111111107', 'Student Welfare', 'WELFARE', 'Clubs, Events, Sports Complex, Grievance Redressal, and Counseling'),
  ('11111111-1111-1111-1111-111111111108', 'Finance', 'FINANCE', 'Fee Payment, Scholarships, Refunds, and Financial Desk'),
  ('11111111-1111-1111-1111-111111111109', 'Maintenance', 'MAINT', 'Civil, Electrical, Plumbing, HVAC, and Campus Physical Maintenance')
ON CONFLICT (code) DO NOTHING;

-- Insert Sample Reports
INSERT INTO public.reports (id, title, description, category, urgency, status, department_id, location, ai_classification, created_at, resolved_at) VALUES
  (
    '22222222-2222-2222-2222-222222222201',
    'Wi-Fi signal drops continuously in Library 2nd Floor',
    'Access point AP-L2-04 drops signal every 8-10 minutes on the second floor study hall. Signal registers 4 bars but IP leases fail systematically.',
    'issue',
    'high',
    'processing',
    '11111111-1111-1111-1111-111111111101',
    'Library, 2nd Floor Study Hall',
    '{"category": "issue", "suggested_department": "CTS", "confidence": 0.96, "urgency": "high"}'::jsonb,
    NOW() - INTERVAL '2 days',
    NULL
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    'Broken classroom fan in Room 302',
    'Overhead oscillating fan squeaks intensely during lectures and smells of burnt wiring.',
    'complaint',
    'medium',
    'resolved',
    '11111111-1111-1111-1111-111111111109',
    'Academic Building A, Room 302',
    '{"category": "complaint", "suggested_department": "Maintenance", "confidence": 0.94, "urgency": "medium"}'::jsonb,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '1 day'
  ),
  (
    '22222222-2222-2222-2222-222222222203',
    'Placement Portal registration submission error',
    'Unable to upload updated resume PDF for upcoming TechCorp recruitment drive. Shows HTTP 500 error.',
    'issue',
    'critical',
    'processing',
    '11111111-1111-1111-1111-11111111103',
    'Online Placement Portal / Block C',
    '{"category": "issue", "suggested_department": "Placement Cell", "confidence": 0.98, "urgency": "critical"}'::jsonb,
    NOW() - INTERVAL '1 day',
    NULL
  ),
  (
    '22222222-2222-2222-2222-222222222204',
    'Hot water supply disruption in Hostel Block B',
    'Geyser circuit breaker trips every morning at 7:00 AM on 3rd floor west wing.',
    'complaint',
    'high',
    'submitted',
    '11111111-1111-1111-1111-111111111104',
    'Hostel Block B, 3rd Floor',
    '{"category": "complaint", "suggested_department": "Hostel", "confidence": 0.95, "urgency": "high"}'::jsonb,
    NOW() - INTERVAL '3 hours',
    NULL
  ),
  (
    '22222222-2222-2222-2222-222222222205',
    'Library 2nd floor natural light seating suggestion',
    'Reorienting the study carrels toward natural light along the north window bay would double usable space.',
    'feedback',
    'low',
    'processing',
    '11111111-1111-1111-1111-111111111105',
    'Central Library, North Bay',
    '{"category": "feedback", "suggested_department": "Academic", "confidence": 0.89, "urgency": "low"}'::jsonb,
    NOW() - INTERVAL '1 week',
    NULL
  );

-- Sample Status History
INSERT INTO public.report_status_history (report_id, changed_by_name, old_status, new_status, note, created_at) VALUES
  ('22222222-2222-2222-2222-222222222201', 'System AI', 'none', 'submitted', 'Report received and classified by AI', NOW() - INTERVAL '2 days'),
  ('22222222-2222-2222-2222-222222222201', 'CTS Admin', 'submitted', 'processing', 'Technician dispatched to inspect library AP-L2-04 router', NOW() - INTERVAL '1 day'),
  ('22222222-2222-2222-2222-222222222202', 'Maintenance Admin', 'submitted', 'processing', 'Assigned to Electrical Team', NOW() - INTERVAL '4 days'),
  ('22222222-2222-2222-2222-222222222202', 'Maintenance Admin', 'processing', 'resolved', 'Replaced faulty fan motor unit with quiet dual-bearing assembly', NOW() - INTERVAL '1 day');

-- Sample Comments
INSERT INTO public.report_comments (report_id, admin_name, department_name, comment, created_at) VALUES
  ('22222222-2222-2222-2222-222222222201', 'Alex Vance', 'CTS', 'Resetting access point router firmware and checking DHCP lease limits.', NOW() - INTERVAL '18 hours'),
  ('22222222-2222-2222-2222-222222222203', 'Rohan Sharma', 'Placement Cell', 'High priority flag raised for TechCorp drive applicants. IT team notified.', NOW() - INTERVAL '12 hours');

-- ========================================================
-- CampusAI Maintenance Portal — Supabase PostgreSQL Schema
-- Migration File: 20261006_initial_schema.sql
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. DEPARTMENT ADMINS TABLE (Maps Supabase Auth users to departments)
CREATE TABLE IF NOT EXISTS public.department_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'department_admin' CHECK (role IN ('department_admin', 'department_manager', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'issue' CHECK (category IN ('complaint', 'issue', 'feedback', 'compliment')),
    urgency TEXT NOT NULL DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'processing', 'resolved', 'rejected')),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    location TEXT,
    attachment_url TEXT,
    ai_classification JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 4. REPORT COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.report_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_name TEXT,
    department_name TEXT,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. REPORT STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.report_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    changed_by_name TEXT,
    old_status TEXT,
    new_status TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERIES
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_reports_department_id ON public.reports(department_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_urgency ON public.reports(urgency);
CREATE INDEX IF NOT EXISTS idx_reports_category ON public.reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_submitted_by ON public.reports(submitted_by);
CREATE INDEX IF NOT EXISTS idx_report_comments_report_id ON public.report_comments(report_id);
CREATE INDEX IF NOT EXISTS idx_report_status_history_report_id ON public.report_status_history(report_id);
CREATE INDEX IF NOT EXISTS idx_dept_admins_user_id ON public.department_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_dept_admins_dept_id ON public.department_admins(department_id);

-- ========================================================
-- AUTOMATIC TRIGGER FOR UPDATED_AT TIMESTAMPS
-- ========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON public.reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dept_admins_updated_at
    BEFORE UPDATE ON public.department_admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_comments_updated_at
    BEFORE UPDATE ON public.report_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_status_history ENABLE ROW LEVEL SECURITY;

-- 1. DEPARTMENTS POLICIES
-- Anyone authenticated or anonymous can read department listings
CREATE POLICY "Departments are readable by all authenticated users"
    ON public.departments FOR SELECT
    USING (true);

-- 2. DEPARTMENT ADMINS POLICIES
-- Admins can view their own mapping record or super admins can view all
CREATE POLICY "Admins can view their own profile"
    ON public.department_admins FOR SELECT
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.department_admins da
            WHERE da.user_id = auth.uid() AND da.role = 'super_admin'
        )
    );

-- 3. REPORTS POLICIES
-- Department Admins can view reports assigned to their department (or super admin view all)
-- Students can view reports they submitted
CREATE POLICY "Admins view assigned department reports or students view own"
    ON public.reports FOR SELECT
    USING (
        -- Admin matches department
        EXISTS (
            SELECT 1 FROM public.department_admins da
            WHERE da.user_id = auth.uid()
            AND (da.department_id = reports.department_id OR da.role = 'super_admin')
        )
        -- Student matches submitted_by or public submission
        OR auth.uid() = submitted_by
        OR submitted_by IS NULL
    );

-- Anyone can submit a report (Student / User submission)
CREATE POLICY "Anyone can insert reports"
    ON public.reports FOR INSERT
    WITH CHECK (true);

-- Department Admins can update reports in their department
CREATE POLICY "Admins update assigned department reports"
    ON public.reports FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.department_admins da
            WHERE da.user_id = auth.uid()
            AND (da.department_id = reports.department_id OR da.role = 'super_admin')
        )
    );

-- 4. REPORT COMMENTS POLICIES
CREATE POLICY "Admins view and insert comments for department reports"
    ON public.report_comments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.reports r
            JOIN public.department_admins da ON (da.department_id = r.department_id OR da.role = 'super_admin')
            WHERE r.id = report_comments.report_id AND da.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.reports r
            WHERE r.id = report_comments.report_id AND r.submitted_by = auth.uid()
        )
    );

-- 5. REPORT STATUS HISTORY POLICIES
CREATE POLICY "Admins view and insert status history for department reports"
    ON public.report_status_history FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.reports r
            JOIN public.department_admins da ON (da.department_id = r.department_id OR da.role = 'super_admin')
            WHERE r.id = report_status_history.report_id AND da.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.reports r
            WHERE r.id = report_status_history.report_id AND r.submitted_by = auth.uid()
        )
    );

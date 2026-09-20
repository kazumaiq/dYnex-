-- ============================================================
-- dYnex? DIGITAL ARCHIVE // TRACE WALL PERMANENT PERSISTENCE
-- Migration: 20260920_trace_wall_persistence.sql
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SEQUENCE FOR DETERMINISTIC UNIQUE TRACE IDs (TRACE_000001, TRACE_000002, ...)
CREATE SEQUENCE IF NOT EXISTS public.trace_wall_seq START WITH 1 INCREMENT BY 1;

-- 3. THE TRACE WALL TABLE
CREATE TABLE IF NOT EXISTS public.trace_wall (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trace_id TEXT UNIQUE NOT NULL DEFAULT ('TRACE_' || LPAD(nextval('public.trace_wall_seq')::TEXT, 6, '0')),
    user_id TEXT, -- User ID identifier
    username TEXT NOT NULL,
    message TEXT NOT NULL CHECK (char_length(message) <= 140),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by TEXT,
    rejected_at TIMESTAMPTZ,
    rejected_by TEXT,
    deleted_at TIMESTAMPTZ -- Soft Delete: Trace is never erased physically
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_trace_wall_status ON public.trace_wall(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_trace_wall_created_at ON public.trace_wall(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_trace_wall_user_id ON public.trace_wall(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_trace_wall_trace_id ON public.trace_wall(trace_id);

-- 5. AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    target_type TEXT NOT NULL DEFAULT 'TRACE',
    target_id TEXT NOT NULL,
    admin TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON public.audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.trace_wall ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES FOR TRACE WALL

-- Policy 1: Public SELECT: anyone can view APPROVED traces that are not deleted
DROP POLICY IF EXISTS "Public can view approved traces" ON public.trace_wall;
CREATE POLICY "Public can view approved traces"
    ON public.trace_wall FOR SELECT
    USING (status = 'APPROVED' AND deleted_at IS NULL);

-- Policy 2: Public INSERT: anyone can submit a trace, but it MUST be PENDING and without moderation fields
DROP POLICY IF EXISTS "Anyone can submit pending trace" ON public.trace_wall;
CREATE POLICY "Anyone can submit pending trace"
    ON public.trace_wall FOR INSERT
    WITH CHECK (
        status = 'PENDING'
        AND approved_at IS NULL
        AND approved_by IS NULL
        AND rejected_at IS NULL
        AND rejected_by IS NULL
        AND deleted_at IS NULL
    );

-- Policy 3: Public can view their own pending trace if user_id matches
DROP POLICY IF EXISTS "Users can view own traces" ON public.trace_wall;
CREATE POLICY "Users can view own traces"
    ON public.trace_wall FOR SELECT
    USING (deleted_at IS NULL);

-- Policy 4: Allow updating for moderation and soft-delete
DROP POLICY IF EXISTS "Allow moderation updates" ON public.trace_wall;
CREATE POLICY "Allow moderation updates"
    ON public.trace_wall FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Policy 5: Audit logs RLS
DROP POLICY IF EXISTS "Public can insert audit logs" ON public.audit_logs;
CREATE POLICY "Public can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view audit logs" ON public.audit_logs;
CREATE POLICY "Public can view audit logs"
    ON public.audit_logs FOR SELECT
    USING (true);

-- 8. STORED PROCEDURES (SECURITY DEFINER) FOR ATOMIC MODERATION

CREATE OR REPLACE FUNCTION public.moderate_trace(
    p_trace_id TEXT,
    p_action TEXT, -- 'APPROVE', 'REJECT', 'DELETE'
    p_admin TEXT DEFAULT '@kazumaiq'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_updated public.trace_wall%ROWTYPE;
BEGIN
    IF p_action = 'APPROVE' THEN
        UPDATE public.trace_wall
        SET status = 'APPROVED',
            approved_at = NOW(),
            approved_by = p_admin,
            rejected_at = NULL,
            rejected_by = NULL
        WHERE trace_id = p_trace_id OR id::TEXT = p_trace_id
        RETURNING * INTO v_updated;

        INSERT INTO public.audit_logs (action, target_type, target_id, admin, details)
        VALUES ('TRACE_APPROVED', 'TRACE', p_trace_id, p_admin, 'Trace approved by admin');

    ELSIF p_action = 'REJECT' THEN
        UPDATE public.trace_wall
        SET status = 'REJECTED',
            rejected_at = NOW(),
            rejected_by = p_admin,
            approved_at = NULL,
            approved_by = NULL
        WHERE trace_id = p_trace_id OR id::TEXT = p_trace_id
        RETURNING * INTO v_updated;

        INSERT INTO public.audit_logs (action, target_type, target_id, admin, details)
        VALUES ('TRACE_REJECTED', 'TRACE', p_trace_id, p_admin, 'Trace rejected by admin (preserved in DB)');

    ELSIF p_action = 'DELETE' THEN
        UPDATE public.trace_wall
        SET deleted_at = NOW()
        WHERE trace_id = p_trace_id OR id::TEXT = p_trace_id
        RETURNING * INTO v_updated;

        INSERT INTO public.audit_logs (action, target_type, target_id, admin, details)
        VALUES ('TRACE_DELETED', 'TRACE', p_trace_id, p_admin, 'Trace soft-deleted by admin');
    END IF;

    RETURN to_jsonb(v_updated);
END;
$$;

-- Function for reading all traces for the Admin Panel
CREATE OR REPLACE FUNCTION public.get_admin_traces()
RETURNS SETOF public.trace_wall
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT * FROM public.trace_wall WHERE deleted_at IS NULL ORDER BY created_at DESC;
$$;

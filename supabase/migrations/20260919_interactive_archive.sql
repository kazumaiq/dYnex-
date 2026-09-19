-- ============================================================
-- dYnex? DIGITAL ARCHIVE // INTERACTIVE COMMUNITY SCHEMA
-- PostgreSQL + Row Level Security (RLS)
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    node_number TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'MODERATOR', 'ADMIN')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BLOCKED', 'ARCHIVED')),
    public_profile BOOLEAN NOT NULL DEFAULT true,
    show_traces BOOLEAN NOT NULL DEFAULT true,
    show_signals BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. AUDIENCE SIGNALS (COMMENTS UNDER RELEASES)
CREATE TABLE IF NOT EXISTS public.signal_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    release_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    content TEXT NOT NULL CHECK (char_length(content) <= 280),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. THE TRACE WALL
CREATE TABLE IF NOT EXISTS public.traces (
    id TEXT PRIMARY KEY, -- e.g. TRACE_004281
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    content TEXT NOT NULL CHECK (char_length(content) <= 140),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SIGNATURE WALL
CREATE TABLE IF NOT EXISTS public.signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    phrase TEXT CHECK (char_length(phrase) <= 64),
    seed BIGINT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ASYNCHRONOUS TRANSMISSIONS
CREATE TABLE IF NOT EXISTS public.transmissions (
    id TEXT PRIMARY KEY, -- e.g. TRN-78421
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    username TEXT NOT NULL,
    contact TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'READ', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. FIT / COLLABORATION REQUESTS
CREATE TABLE IF NOT EXISTS public.collaborations (
    id TEXT PRIMARY KEY, -- e.g. COL-91024
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    username TEXT NOT NULL,
    contact TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('FIT', 'COLLAB')),
    message TEXT NOT NULL,
    audio_file_name TEXT NOT NULL,
    audio_file_size BIGINT NOT NULL,
    audio_file_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'LISTENED', 'ACCEPTED', 'REJECTED', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. AUDIT LOG (MODERATION HISTORY)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    moderator_username TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('SIGNAL', 'TRACE', 'SIGNATURE', 'TRANSMISSION', 'COLLAB', 'USER')),
    target_id TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_signals_release ON public.signal_comments(release_id, status);
CREATE INDEX IF NOT EXISTS idx_signals_user ON public.signal_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_traces_status ON public.traces(status);
CREATE INDEX IF NOT EXISTS idx_signatures_status ON public.signatures(status);
CREATE INDEX IF NOT EXISTS idx_transmissions_status ON public.transmissions(status);
CREATE INDEX IF NOT EXISTS idx_collabs_status ON public.collaborations(status);

-- 10. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signal_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transmissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 11. RLS POLICIES

-- Profiles: Public can view non-private profiles; users can update own profile
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (public_profile = true OR auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Signals: Approved signals are public; users can view their own pending; users can insert
CREATE POLICY "Approved signals are public" 
    ON public.signal_comments FOR SELECT 
    USING (status = 'APPROVED' OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can leave signals" 
    ON public.signal_comments FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

-- Traces: Approved traces are public; users can view/delete their own trace
CREATE POLICY "Approved traces are public" 
    ON public.traces FOR SELECT 
    USING (status = 'APPROVED' OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can submit 1 trace" 
    ON public.traces FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trace" 
    ON public.traces FOR DELETE 
    USING (auth.uid() = user_id);

-- Signatures: Approved signatures are public; users can submit
CREATE POLICY "Approved signatures are public" 
    ON public.signatures FOR SELECT 
    USING (status = 'APPROVED' OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can submit 1 signature" 
    ON public.signatures FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

-- Transmissions: Only sender and moderators/admins can read transmissions
CREATE POLICY "Users can view own transmissions" 
    ON public.transmissions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can submit transmissions" 
    ON public.transmissions FOR INSERT 
    WITH CHECK (true);

-- Collaborations: Only sender and moderators/admins can view collabs
CREATE POLICY "Users can view own collabs" 
    ON public.collaborations FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can submit collabs" 
    ON public.collaborations FOR INSERT 
    WITH CHECK (true);

-- 12. STORAGE BUCKETS (COLLAB AUDIO & AVATARS)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('collab-audio', 'collab-audio', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create Commissions Table
CREATE TABLE public.commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT,
    artwork_type TEXT,
    description TEXT,
    special_instructions TEXT,
    customer_budget NUMERIC,
    quoted_price NUMERIC,
    width NUMERIC,
    height NUMERIC,
    size_unit TEXT NOT NULL DEFAULT 'in',
    orientation TEXT,
    frame_option TEXT,
    preferred_style TEXT,
    preferred_colors TEXT[],
    artwork_purpose TEXT,
    deadline TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'Draft',
    payment_status TEXT NOT NULL DEFAULT 'Unpaid',
    assigned_artist_id UUID,
    estimated_completion TIMESTAMPTZ,
    admin_notes TEXT,
    internal_notes TEXT,
    quotation_notes TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',
    completion_percentage INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Commission Reference Images Table
CREATE TABLE public.commission_reference_images (
    id BIGSERIAL PRIMARY KEY,
    commission_id UUID NOT NULL REFERENCES public.commissions(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Commission Updates Table
CREATE TABLE public.commission_updates (
    id BIGSERIAL PRIMARY KEY,
    commission_id UUID NOT NULL REFERENCES public.commissions(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    message TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_reference_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_updates ENABLE ROW LEVEL SECURITY;

-- Commissions Table Policies
CREATE POLICY "Users can view their own commissions" ON public.commissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own commissions" ON public.commissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own commissions" ON public.commissions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own commissions" ON public.commissions
    FOR DELETE USING (auth.uid() = user_id AND status = 'Draft');

CREATE POLICY "Admins can view all commissions" ON public.commissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update all commissions" ON public.commissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Commission Reference Images Table Policies
CREATE POLICY "Users can view reference images of their own commissions" ON public.commission_reference_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.commissions
            WHERE commissions.id = commission_id AND commissions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert reference images for their own commissions" ON public.commission_reference_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.commissions
            WHERE commissions.id = commission_id AND commissions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete reference images for their own commissions" ON public.commission_reference_images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.commissions
            WHERE commissions.id = commission_id AND commissions.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all reference images" ON public.commission_reference_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Commission Updates Table Policies
CREATE POLICY "Users can view updates for their own commissions" ON public.commission_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.commissions
            WHERE commissions.id = commission_id AND commissions.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all updates" ON public.commission_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert updates" ON public.commission_updates
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Create storage bucket for commission references
INSERT INTO storage.buckets (id, name, public)
VALUES ('commission-references', 'commission-references', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage objects in commission-references bucket
CREATE POLICY "Commission reference images are viewable by everyone" ON storage.objects
    FOR SELECT USING (bucket_id = 'commission-references');

CREATE POLICY "Authenticated users can upload reference images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'commission-references' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Owners can delete their own reference images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'commission-references' AND
        auth.uid() = owner
    );

-- 1. Extend public.orders Table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_reference TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_screenshot TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_notes TEXT;

-- 2. Create public.payment_submissions Table
CREATE TABLE IF NOT EXISTS public.payment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL,
    payment_reference TEXT NOT NULL,
    payment_screenshot TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Payment Submitted',
    admin_notes TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Enable RLS on payment_submissions
ALTER TABLE public.payment_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for payment_submissions
CREATE POLICY "Users can view their own payment submissions" ON public.payment_submissions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can insert payment submissions" ON public.payment_submissions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all payment submissions" ON public.payment_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 3. Create Storage Bucket for Payment Proofs
INSERT INTO storage.buckets (id, name, public) VALUES
('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for payment-proofs Bucket in storage.objects
CREATE POLICY "Payment proofs are viewable by owner and admin" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'payment-proofs' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'admin'
            )
        )
    );

CREATE POLICY "Authenticated users can upload payment proofs" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'payment-proofs' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Admins have full control over payment proofs" ON storage.objects
    FOR ALL USING (
        bucket_id = 'payment-proofs' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 4. Seed Payment Config Settings
INSERT INTO public.site_settings (key, value, created_at, updated_at) VALUES
('easy_paisa_number', '+92 325 2538104', now(), now()),
('easy_paisa_title', 'Abdul Manan Iqbal Mughal', now(), now()),
('bank_name', 'Meezan Bank', now(), now()),
('bank_account', '01020304050607', now(), now()),
('payment_instructions', 'Please transfer the grand total to our EasyPaisa account or Bank account. Upload the payment receipt screenshot and provide the Transaction ID / Reference ID for verification.', now(), now()),
('enable_easy_paisa', 'true', now(), now()),
('enable_bank_transfer', 'false', now(), now())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

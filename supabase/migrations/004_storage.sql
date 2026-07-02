-- Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('artworks', 'artworks', true),
('artists', 'artists', true),
('avatars', 'avatars', true),
('temporary-uploads', 'temporary-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage buckets
-- 1. Read access for all public buckets
CREATE POLICY "Public storage items are globally viewable" ON storage.objects
    FOR SELECT USING (bucket_id IN ('artworks', 'artists', 'avatars', 'temporary-uploads'));

-- 2. Write access for avatars
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated users can update their own avatars" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND
        auth.role() = 'authenticated'
    );

-- 3. Write access for admins on artworks and artists
CREATE POLICY "Admins can upload artworks and artists assets" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id IN ('artworks', 'artists') AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Trigger to automatically create a profile in public.profiles when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Art Collector'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        'customer'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

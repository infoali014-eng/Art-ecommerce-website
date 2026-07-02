import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const StorageService = {
  async uploadFile(bucketName: string, path: string, file: File): Promise<string> {
    const { data, error } = await supabase.storage.from(bucketName).upload(path, file, {
      upsert: true,
    });

    if (error) throw error;
    return data.path;
  },

  async deleteFile(bucketName: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucketName).remove([path]);
    if (error) throw error;
  },

  getPublicUrl(bucketName: string, path: string): string {
    if (!path) return '';
    // Support transition: if it is already a full URL, return it unchanged
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    return data.publicUrl;
  },
};
export default StorageService;

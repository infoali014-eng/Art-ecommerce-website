import categoriesData from '@/data/categories.json';
import { createClient } from '@/lib/supabase/client';
import { StorageService } from '@/services/storage.service';

import { Category } from '@/types';

const supabase = createClient();
const localCategories = categoriesData as Category[];

export function mapDbCategoryToUi(dbCategory: any): Category {
  const imageUrl = StorageService.getPublicUrl('artworks', dbCategory.image_url);

  return {
    id: dbCategory.id,
    name: dbCategory.name,
    slug: dbCategory.slug,
    description: dbCategory.description || '',
    image: imageUrl,
  };
}

export const CategoryRepository = {
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase.from('categories').select('*').is('deleted_at', null);
      if (error) throw error;
      return (data || []).map(mapDbCategoryToUi);
    } catch (e) {
      console.warn('[CategoryRepository] getCategories failed, falling back to mock JSON:', e);
      return localCategories;
    }
  },

  // Future Admin Operations
  async createCategory(category: any) {
    const { data, error } = await (supabase as any)
      .from('categories')
      .insert(category)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, updates: any) {
    const { data, error } = await (supabase as any)
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string) {
    const { error } = await (supabase as any)
      .from('categories')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },
};
export default CategoryRepository;

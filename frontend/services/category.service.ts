import { CategoryRepository } from '@/repositories/category.repository';

import { Category } from '@/types';

export const CategoryService = {
  async getCategories(): Promise<Category[]> {
    return await CategoryRepository.getCategories();
  },
};
export default CategoryService;

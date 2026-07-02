import { CollectionRepository } from '@/repositories/collection.repository';

import { Collection } from '@/types';

export const CollectionService = {
  async getCollections(): Promise<Collection[]> {
    return await CollectionRepository.getCollections();
  },
};
export default CollectionService;

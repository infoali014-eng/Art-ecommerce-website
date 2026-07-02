import { ArtistRepository } from '@/repositories/artist.repository';

import { Artist } from '@/types';

export const ArtistService = {
  async getArtists(): Promise<Artist[]> {
    return await ArtistRepository.getArtists();
  },

  async getArtistById(id: string): Promise<Artist | null> {
    return await ArtistRepository.getArtistById(id);
  },
};
export default ArtistService;

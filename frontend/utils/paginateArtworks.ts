import { Artwork } from '@/types';

export function paginateArtworks(artworks: Artwork[], limit: number): Artwork[] {
  return artworks.slice(0, limit);
}
export default paginateArtworks;

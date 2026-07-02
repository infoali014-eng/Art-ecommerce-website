import { Artwork } from '@/types';

export function getRelatedArtworks(
  artworks: Artwork[],
  currentArtwork: Artwork,
  limit: number = 4
): Artwork[] {
  return artworks
    .filter(
      (art) =>
        art.id !== currentArtwork.id &&
        (art.category === currentArtwork.category || art.collection === currentArtwork.collection)
    )
    .slice(0, limit);
}
export default getRelatedArtworks;

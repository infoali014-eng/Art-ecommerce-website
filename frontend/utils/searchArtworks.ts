import { Artwork } from '@/types';

export function searchArtworks(artworks: Artwork[], query: string): Artwork[] {
  if (!query) return artworks;
  const q = query.toLowerCase().trim();
  return artworks.filter((art) => {
    return (
      art.title.toLowerCase().includes(q) ||
      art.artist.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q) ||
      art.medium.toLowerCase().includes(q) ||
      art.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });
}
export default searchArtworks;

import { useState } from 'react';

import { Artwork } from '@/types';

export function useQuickView() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const openQuickView = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const closeQuickView = () => {
    setSelectedArtwork(null);
  };

  return {
    selectedArtwork,
    openQuickView,
    closeQuickView,
    isOpen: selectedArtwork !== null,
  };
}
export default useQuickView;

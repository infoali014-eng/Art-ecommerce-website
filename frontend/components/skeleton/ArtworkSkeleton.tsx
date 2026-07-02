import React from 'react';

export const ArtworkSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-4 animate-pulse">
      {/* Aspect Ratio Box for Image */}
      <div className="w-full aspect-[3/4] bg-primary/5 border border-primary/5" />
      {/* Title placeholder */}
      <div className="h-5 w-2/3 bg-primary/5" />
      {/* Artist placeholder */}
      <div className="h-4 w-1/3 bg-primary/5" />
      {/* Price placeholder */}
      <div className="h-4 w-1/4 bg-primary/5" />
    </div>
  );
};
export default ArtworkSkeleton;

import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="w-full border border-primary/5 bg-white p-6 flex flex-col gap-4 animate-pulse">
      <div className="h-6 w-1/2 bg-primary/5" />
      <div className="h-4 w-5/6 bg-primary/5" />
      <div className="h-4 w-4/6 bg-primary/5" />
      <div className="h-10 w-full bg-primary/5 mt-4" />
    </div>
  );
};
export default CardSkeleton;

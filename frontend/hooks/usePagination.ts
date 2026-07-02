import { useState } from 'react';

export function usePagination(initialLimit: number = 12, step: number = 6) {
  const [limit, setLimit] = useState(initialLimit);

  const loadMore = () => {
    setLimit((prev) => prev + step);
  };

  const resetPagination = () => {
    setLimit(initialLimit);
  };

  return {
    limit,
    loadMore,
    resetPagination,
  };
}
export default usePagination;

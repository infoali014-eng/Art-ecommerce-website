'use client';

import { useEffect, useState, useTransition } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { FilterParams } from '@/utils/filterArtworks';
import { SortOption } from '@/utils/sortArtworks';

// Configurable simulated delay constant for skeletons (0 to disable)
const SIMULATED_LOAD_DELAY_MS = 400;

export function useArtworkFilters(defaultCategory: string = 'all') {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || defaultCategory);
  const [priceMin, setPriceMin] = useState(Number(searchParams.get('priceMin')) || 0);
  const [priceMax, setPriceMax] = useState(Number(searchParams.get('priceMax')) || 10000);
  const [medium, setMedium] = useState(searchParams.get('medium') || 'all');
  const [orientation, setOrientation] = useState(searchParams.get('orientation') || 'all');
  const [availability, setAvailability] = useState(searchParams.get('availability') || 'all');
  const [featured, setFeatured] = useState(searchParams.get('featured') === 'true');
  const [newArrival, setNewArrival] = useState(searchParams.get('newArrival') === 'true');
  const [popular, setPopular] = useState(searchParams.get('popular') === 'true');
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'newest'
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (category && category !== 'all') params.set('category', category);
    if (priceMin > 0) params.set('priceMin', priceMin.toString());
    if (priceMax < 10000) params.set('priceMax', priceMax.toString());
    if (medium && medium !== 'all') params.set('medium', medium);
    if (orientation && orientation !== 'all') params.set('orientation', orientation);
    if (availability && availability !== 'all') params.set('availability', availability);
    if (featured) params.set('featured', 'true');
    if (newArrival) params.set('newArrival', 'true');
    if (popular) params.set('popular', 'true');
    if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);

    const queryStr = params.toString();
    const targetUrl = queryStr ? `${pathname}?${queryStr}` : pathname;

    if (SIMULATED_LOAD_DELAY_MS > 0) {
      setIsLoading(true);
      const delayTimer = setTimeout(() => {
        startTransition(() => {
          router.push(targetUrl, { scroll: false });
        });
        setIsLoading(false);
      }, SIMULATED_LOAD_DELAY_MS);

      return () => clearTimeout(delayTimer);
    } else {
      startTransition(() => {
        router.push(targetUrl, { scroll: false });
      });
    }
  }, [
    searchQuery,
    category,
    priceMin,
    priceMax,
    medium,
    orientation,
    availability,
    featured,
    newArrival,
    popular,
    sortBy,
    pathname,
    router,
  ]);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setCategory(searchParams.get('category') || defaultCategory);
    setPriceMin(Number(searchParams.get('priceMin')) || 0);
    setPriceMax(Number(searchParams.get('priceMax')) || 10000);
    setMedium(searchParams.get('medium') || 'all');
    setOrientation(searchParams.get('orientation') || 'all');
    setAvailability(searchParams.get('availability') || 'all');
    setFeatured(searchParams.get('featured') === 'true');
    setNewArrival(searchParams.get('newArrival') === 'true');
    setPopular(searchParams.get('popular') === 'true');
    setSortBy((searchParams.get('sort') as SortOption) || 'newest');
  }, [searchParams, defaultCategory]);

  const resetFilters = () => {
    setSearchQuery('');
    setCategory(defaultCategory);
    setPriceMin(0);
    setPriceMax(10000);
    setMedium('all');
    setOrientation('all');
    setAvailability('all');
    setFeatured(false);
    setNewArrival(false);
    setPopular(false);
    setSortBy('newest');
  };

  const filters: FilterParams = {
    category,
    priceMin,
    priceMax,
    medium,
    orientation,
    availability,
    featured,
    newArrival,
    popular,
  };

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filters,
    setCategory,
    setPriceMin,
    setPriceMax,
    setMedium,
    setOrientation,
    setAvailability,
    setFeatured,
    setNewArrival,
    setPopular,
    resetFilters,
    isLoading: isLoading || isPending,
  };
}
export default useArtworkFilters;

'use client';

import React, { useState } from 'react';

import { SlidersHorizontal } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { QuickViewModal } from '@/components/modals/QuickViewModal';
import { FilterSidebar } from '@/components/sections/FilterSidebar';
import { SearchBar } from '@/components/sections/SearchBar';
import { ArtworkSkeleton } from '@/components/skeleton/ArtworkSkeleton';
import { ArtworkCard } from '@/components/ui/ArtworkCard';
import { Button } from '@/components/ui/Button';
import { useArtworkFilters } from '@/hooks/useArtworkFilters';
import { usePagination } from '@/hooks/usePagination';
import { useQuickView } from '@/hooks/useQuickView';
import { ArtworkService } from '@/services/artwork.service';
import { filterArtworks } from '@/utils/filterArtworks';
import { paginateArtworks } from '@/utils/paginateArtworks';
import { searchArtworks } from '@/utils/searchArtworks';
import { sortArtworks, SortOption } from '@/utils/sortArtworks';

interface GalleryContentProps {
  categorySlug?: string;
  hideCategoryFilter?: boolean;
}

export const GalleryContent: React.FC<GalleryContentProps> = ({
  categorySlug = 'all',
  hideCategoryFilter = false,
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Hook states
  const {
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
    isLoading,
  } = useArtworkFilters(categorySlug);

  const { limit, loadMore, resetPagination } = usePagination(12, 6);
  const { selectedArtwork, openQuickView, closeQuickView, isOpen: quickViewOpen } = useQuickView();

  // Load static data via service
  const rawArtworks = ArtworkService.getAllArtworks();

  // Pipeline execution
  const searched = searchArtworks(rawArtworks, searchQuery);
  const filtered = filterArtworks(searched, filters);
  const sorted = sortArtworks(filtered, sortBy);
  const paginated = paginateArtworks(sorted, limit);

  const totalResults = sorted.length;
  const hasMore = limit < totalResults;

  const handleFilterUpdate = (key: string, value: string | number | boolean) => {
    resetPagination();
    if (key === 'category') setCategory(value as string);
    if (key === 'priceMin') setPriceMin(value as number);
    if (key === 'priceMax') setPriceMax(value as number);
    if (key === 'medium') setMedium(value as string);
    if (key === 'orientation') setOrientation(value as string);
    if (key === 'availability') setAvailability(value as string);
    if (key === 'featured') setFeatured(value as boolean);
    if (key === 'newArrival') setNewArrival(value as boolean);
    if (key === 'popular') setPopular(value as boolean);
  };

  const handleResetAll = () => {
    resetPagination();
    resetFilters();
  };

  const sortingOptions = [
    { label: 'Newest Releases', value: 'newest' },
    { label: 'Oldest Releases', value: 'oldest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Alphabetical (A-Z)', value: 'alphabetical' },
    { label: 'Popularity', value: 'popularity' },
  ];

  return (
    <Section padding="none" className="pb-24">
      <Container>
        {/* Layout Wrapper */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Filters */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterUpdate}
            onReset={handleResetAll}
            isOpen={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            hideCategoryFilter={hideCategoryFilter}
          />

          {/* Main Catalog View Area */}
          <div className="flex-grow w-full space-y-8">
            {/* Top Toolbar: Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <SearchBar
                value={searchQuery}
                onChange={(val) => {
                  resetPagination();
                  setSearchQuery(val);
                }}
                className="max-w-xl flex-grow"
              />

              {/* Controls and Dropdowns */}
              <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4 shrink-0">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-primary/10 px-4 py-3 text-xs uppercase tracking-wider text-primary bg-white cursor-pointer hover:border-accent hover:text-accent transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>

                <div className="flex items-center gap-2 font-sans text-xs w-full md:w-auto">
                  <span className="text-secondary/70 shrink-0 uppercase tracking-widest text-[10px]">
                    Sort By:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      resetPagination();
                      setSortBy(e.target.value as SortOption);
                    }}
                    className="bg-white border border-primary/10 px-3 py-3 focus:outline-none focus:border-accent cursor-pointer text-xs w-full md:w-44 text-primary"
                  >
                    {sortingOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count Banner */}
            <div className="flex items-center justify-between text-[11px] font-sans uppercase tracking-widest text-secondary/70">
              <span>
                Showing {paginated.length} of {totalResults} Artworks
              </span>
              {searchQuery && <span>Query: &ldquo;{searchQuery}&rdquo;</span>}
            </div>

            {/* Catalog Grid / Loading State / Empty State */}
            {isLoading ? (
              // Loading Skeleton State
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ArtworkSkeleton key={i} />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              // Elegant Empty State
              <div className="border border-primary/5 bg-white py-24 px-6 text-center max-w-2xl mx-auto flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border border-accent/20 flex items-center justify-center mb-6 bg-background text-accent">
                  <SlidersHorizontal className="w-6 h-6 stroke-[1.2]" />
                </div>
                <h3 className="font-cormorant text-2xl font-light text-primary mb-3">
                  No Artworks Found
                </h3>
                <p className="font-sans text-xs text-secondary font-light max-w-sm mb-8 leading-relaxed">
                  We could not find any matching artworks in our gallery catalog. Try clearing or
                  adjusting your filter values.
                </p>
                <Button variant="primary" size="sm" onClick={handleResetAll}>
                  Reset All Filters
                </Button>
              </div>
            ) : (
              // Active Product Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginated.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} onQuickView={openQuickView} />
                ))}
              </div>
            )}

            {/* Load More Pagination */}
            {!isLoading && hasMore && (
              <div className="text-center pt-8 border-t border-primary/5">
                <Button variant="outline" size="lg" onClick={loadMore}>
                  Load More Artworks
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Quick View Modal dialog */}
      <QuickViewModal artwork={selectedArtwork} isOpen={quickViewOpen} onClose={closeQuickView} />
    </Section>
  );
};
export default GalleryContent;

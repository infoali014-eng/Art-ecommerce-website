'use client';

import React from 'react';

import { X } from 'lucide-react';

import { FilterParams } from '@/utils/filterArtworks';

import { Button } from '../ui/Button';

interface FilterSidebarProps {
  filters: FilterParams;
  onFilterChange: (key: keyof FilterParams, value: string | number | boolean) => void;
  onReset: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  hideCategoryFilter?: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  isOpen = false,
  onClose,
  hideCategoryFilter = false,
}) => {
  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Paintings', value: 'paintings' },
    { label: 'Calligraphy', value: 'calligraphy' },
    { label: 'Sketches', value: 'sketches' },
  ];

  const orientations = [
    { label: 'All Orientations', value: 'all' },
    { label: 'Portrait', value: 'portrait' },
    { label: 'Landscape', value: 'landscape' },
    { label: 'Square', value: 'square' },
  ];

  const availabilities = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Reserved', value: 'reserved' },
    { label: 'Sold', value: 'sold' },
  ];

  const mediums = [
    { label: 'All Mediums', value: 'all' },
    { label: 'Oil', value: 'oil' },
    { label: 'Gold Leaf', value: 'gold leaf' },
    { label: 'Acrylic', value: 'acrylic' },
    { label: 'Plaster', value: 'plaster' },
    { label: 'Sumi Ink', value: 'sumi' },
    { label: 'Charcoal', value: 'charcoal' },
    { label: 'Graphite', value: 'graphite' },
    { label: 'Silverpoint', value: 'silverpoint' },
  ];

  const sidebarContent = (
    <div className="space-y-8 font-sans">
      {/* Category Section */}
      {!hideCategoryFilter && (
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-4">
            Category
          </h4>
          <div className="space-y-2.5">
            {categories.map((cat) => (
              <label
                key={cat.value}
                className="flex items-center text-xs text-primary cursor-pointer hover:text-accent transition-colors"
              >
                <input
                  type="radio"
                  name="category-filter"
                  checked={(filters.category || 'all') === cat.value}
                  onChange={() => onFilterChange('category', cat.value)}
                  className="mr-3 accent-accent cursor-pointer"
                />
                {cat.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-4">
          Price Limit ({filters.priceMin || 0} - {filters.priceMax || 10000})
        </h4>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={filters.priceMax ?? 10000}
            onChange={(e) => onFilterChange('priceMax', Number(e.target.value))}
            className="w-full accent-accent bg-primary/10 h-1 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-[9px] uppercase tracking-wider text-secondary block mb-1">
                Min
              </label>
              <input
                type="number"
                value={filters.priceMin ?? 0}
                onChange={(e) => onFilterChange('priceMin', Number(e.target.value))}
                className="w-full bg-white border border-primary/10 text-xs px-2.5 py-1.5 focus:outline-none"
              />
            </div>
            <div className="w-1/2">
              <label className="text-[9px] uppercase tracking-wider text-secondary block mb-1">
                Max
              </label>
              <input
                type="number"
                value={filters.priceMax ?? 10000}
                onChange={(e) => onFilterChange('priceMax', Number(e.target.value))}
                className="w-full bg-white border border-primary/10 text-xs px-2.5 py-1.5 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Medium Section */}
      <div>
        <h4 className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-4">
          Medium
        </h4>
        <select
          value={filters.medium || 'all'}
          onChange={(e) => onFilterChange('medium', e.target.value)}
          className="w-full bg-white border border-primary/10 px-3 py-2 text-xs focus:outline-none focus:border-accent cursor-pointer"
        >
          {mediums.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orientation Section */}
      <div>
        <h4 className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-4">
          Orientation
        </h4>
        <div className="space-y-2.5">
          {orientations.map((ort) => (
            <label
              key={ort.value}
              className="flex items-center text-xs text-primary cursor-pointer hover:text-accent transition-colors"
            >
              <input
                type="radio"
                name="orientation-filter"
                checked={(filters.orientation || 'all') === ort.value}
                onChange={() => onFilterChange('orientation', ort.value)}
                className="mr-3 accent-accent cursor-pointer"
              />
              {ort.label}
            </label>
          ))}
        </div>
      </div>

      {/* Availability Section */}
      <div>
        <h4 className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-4">
          Availability
        </h4>
        <div className="space-y-2.5">
          {availabilities.map((av) => (
            <label
              key={av.value}
              className="flex items-center text-xs text-primary cursor-pointer hover:text-accent transition-colors"
            >
              <input
                type="radio"
                name="availability-filter"
                checked={(filters.availability || 'all') === av.value}
                onChange={() => onFilterChange('availability', av.value)}
                className="mr-3 accent-accent cursor-pointer"
              />
              {av.label}
            </label>
          ))}
        </div>
      </div>

      {/* Specials Checkbox Tags */}
      <div>
        <h4 className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-4">
          Curator Tags
        </h4>
        <div className="space-y-2.5">
          <label className="flex items-center text-xs text-primary cursor-pointer hover:text-accent transition-colors">
            <input
              type="checkbox"
              checked={!!filters.featured}
              onChange={(e) => onFilterChange('featured', e.target.checked)}
              className="mr-3 accent-accent w-3.5 h-3.5 cursor-pointer"
            />
            Featured Works
          </label>
          <label className="flex items-center text-xs text-primary cursor-pointer hover:text-accent transition-colors">
            <input
              type="checkbox"
              checked={!!filters.newArrival}
              onChange={(e) => onFilterChange('newArrival', e.target.checked)}
              className="mr-3 accent-accent w-3.5 h-3.5 cursor-pointer"
            />
            New Arrivals
          </label>
          <label className="flex items-center text-xs text-primary cursor-pointer hover:text-accent transition-colors">
            <input
              type="checkbox"
              checked={!!filters.popular}
              onChange={(e) => onFilterChange('popular', e.target.checked)}
              className="mr-3 accent-accent w-3.5 h-3.5 cursor-pointer"
            />
            Popular / Highlighted
          </label>
        </div>
      </div>

      {/* Reset Action */}
      <div className="pt-6 border-t border-primary/5">
        <Button variant="outline" size="sm" onClick={onReset} fullWidth>
          Reset Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky View */}
      <div className="hidden lg:block w-64 shrink-0 pr-8 border-r border-primary/5 sticky top-24 self-start h-[calc(100vh-120px)] overflow-y-auto pr-6">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Slide-over */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-primary/40 backdrop-blur-xs cursor-pointer"
          onClick={onClose}
        />

        {/* Drawer container */}
        <div
          className={`absolute inset-y-0 left-0 max-w-xs w-full bg-background p-6 shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-primary/5 mb-6">
            <h3 className="font-cormorant text-xl font-medium tracking-wide text-primary">
              Filters
            </h3>
            <button
              onClick={onClose}
              className="text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto pr-2 pb-6">{sidebarContent}</div>
        </div>
      </div>
    </>
  );
};
export default FilterSidebar;

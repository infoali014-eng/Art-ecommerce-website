'use client';

import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, SlidersHorizontal, Search } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDef {
  key: string;
  label: string;
  options: FilterOption[];
}

interface BulkAction {
  label: string;
  onClick: (selectedIds: any[]) => void;
  variant?: 'danger' | 'primary' | 'secondary';
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  filters?: FilterDef[];
  bulkActions?: BulkAction[];
  onRowClick?: (row: T) => void;
  rowIdKey?: keyof T;
}

export default function AdminDataTable<T extends Record<string, any>>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search records...',
  filters = [],
  bulkActions = [],
  onRowClick,
  rowIdKey = 'id',
}: AdminDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Clear selections if data changes
  React.useEffect(() => {
    setSelectedRows(new Set());
  }, [data]);

  // Handle sorting trigger
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Filter and Search data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.keys(activeFilters).forEach((filterKey) => {
      const val = activeFilters[filterKey];
      if (val) {
        result = result.filter((row) => String(row[filterKey]) === val);
      }
    });

    // Apply search term
    if (searchTerm && searchKey) {
      result = result.filter((row) =>
        String(row[searchKey] || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Apply sort
    if (sortKey) {
      result.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        const comparison = String(valA).localeCompare(String(valB), undefined, {
          numeric: true,
          sensitivity: 'base',
        });

        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchTerm, searchKey, activeFilters, sortKey, sortOrder]);

  // Paginated partition
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(processedData.length / rowsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = paginatedData.map((row) => row[rowIdKey as string]);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: any) => {
    const next = new Set(selectedRows);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedRows(next);
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedRows.has(row[rowIdKey as string]));

  return (
    <div className="space-y-4 font-sans">
      {/* Search / Filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        {searchKey && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-primary/5 focus:border-accent rounded-sm pl-9 pr-4 py-2 text-xs focus:outline-none transition-all duration-200"
            />
          </div>
        )}

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          {filters.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 border rounded-sm text-xs transition-colors duration-200 ${
                showFilters || Object.values(activeFilters).some(Boolean)
                  ? 'bg-accent/10 border-accent/30 text-accent font-medium'
                  : 'bg-white border-primary/5 hover:border-primary/10 text-secondary'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          )}

          {bulkActions.length > 0 && selectedRows.size > 0 && (
            <div className="flex gap-2">
              {bulkActions.map((act) => (
                <button
                  key={act.label}
                  onClick={() => act.onClick(Array.from(selectedRows))}
                  className={`px-3 py-2 rounded-sm text-xs transition-colors duration-200 ${
                    act.variant === 'danger'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : act.variant === 'primary'
                      ? 'bg-accent text-white hover:bg-accent/90'
                      : 'bg-white border border-primary/5 hover:bg-primary/5 text-secondary'
                  }`}
                >
                  {act.label} ({selectedRows.size})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expanded filters panel */}
      {showFilters && filters.length > 0 && (
        <div className="bg-white border border-primary/5 p-4 rounded-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filters.map((f) => (
            <div key={f.key} className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                {f.label}
              </label>
              <select
                value={activeFilters[f.key] || ''}
                onChange={(e) => {
                  setActiveFilters({ ...activeFilters, [f.key]: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-2.5 py-1.5 text-xs focus:outline-none focus:border-accent rounded-sm"
              >
                <option value="">All {f.label}s</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="flex items-end">
            <button
              onClick={() => {
                setActiveFilters({});
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="text-[10px] text-accent uppercase tracking-wider font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white border border-primary/5 rounded-sm overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-primary/5">
                {bulkActions.length > 0 && (
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="accent-accent"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`p-4 text-[10px] text-secondary font-medium uppercase tracking-wider ${
                      col.sortable ? 'cursor-pointer select-none hover:text-primary' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.label}</span>
                      {col.sortable && sortKey === col.key && (
                        sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-accent" /> : <ChevronDown className="w-3.5 h-3.5 text-accent" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => {
                  const rowId = row[rowIdKey as string];
                  const isSelected = selectedRows.has(rowId);
                  return (
                    <tr
                      key={rowId || idx}
                      onClick={() => onRowClick && onRowClick(row)}
                      className={`transition-colors duration-150 ${
                        onRowClick ? 'cursor-pointer hover:bg-[#FAF8F5]' : ''
                      } ${isSelected ? 'bg-accent/5' : ''}`}
                    >
                      {bulkActions.length > 0 && (
                        <td
                          className="p-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(rowId)}
                            className="accent-accent"
                          />
                        </td>
                      )}
                      {columns.map((col) => {
                        const cellVal = row[col.key];
                        return (
                          <td key={col.key} className="p-4 text-xs font-light text-primary">
                            {col.render ? col.render(cellVal, row) : String(cellVal ?? '-')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)}
                    className="p-12 text-center text-secondary/60 text-xs font-light"
                  >
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-primary/5 flex items-center justify-between bg-[#FAF8F5]">
            <div className="text-[11px] text-secondary font-light">
              Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
              {Math.min(currentPage * rowsPerPage, processedData.length)} of{' '}
              {processedData.length} entries
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 border border-primary/5 hover:border-primary/10 rounded bg-white text-secondary hover:text-primary disabled:opacity-40 transition-all duration-150"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-primary font-medium px-2">
                {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 border border-primary/5 hover:border-primary/10 rounded bg-white text-secondary hover:text-primary disabled:opacity-40 transition-all duration-150"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

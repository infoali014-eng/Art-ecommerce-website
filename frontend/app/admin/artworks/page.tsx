'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Paintbrush,
  Plus,
  Edit2,
  Trash2,
  Archive,
  RefreshCw,
  Copy,
  Eye,
} from 'lucide-react';
import { AdminRepository } from '@/repositories/admin.repository';
import { AdminService } from '@/services/admin.service';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { Artwork, Category, Collection, Artist } from '@/types';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminDrawer from '@/components/admin/AdminDrawer';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import LoadingButton from '@/components/ui/LoadingButton';

export default function AdminArtworksPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer / Form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('Add New Artwork');
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal confirm state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; title: string; action: 'archive' | 'restore' } | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [artworkId, setArtworkId] = useState(''); // Only editable on create
  const [artistName, setArtistName] = useState('');
  const [artistId, setArtistId] = useState('');
  const [categoryId, setCategoryId] = useState('paintings');
  const [collectionId, setCollectionId] = useState('');
  const [price, setPrice] = useState('');
  const [medium, setMedium] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'square'>('portrait');
  const [availability, setAvailability] = useState<'available' | 'sold' | 'reserved'>('available');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [technique, setTechnique] = useState('');
  const [featured, setFeatured] = useState(false);
  const [popular, setPopular] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [isOriginal, setIsOriginal] = useState(true);
  const [framingAvailable, setFramingAvailable] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState('5-7 business days');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [formLoading, setFormLoading] = useState(false);

  // Form Element Refs for Validation Focus
  const titleInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [artList, catList, colList, artstList] = await Promise.all([
        AdminRepository.getArtworks(true), // Include archived
        AdminRepository.getCategories(),
        AdminRepository.getCollections(),
        AdminRepository.getArtists(),
      ]);
      setArtworks(artList);
      setCategories(catList);
      setCollections(colList);
      setArtists(artstList);
    } catch (e) {
      console.error(e);
      addToast('Failed to load artwork inventory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setTitle('');
    setArtworkId('');
    setArtistName('');
    setArtistId('');
    setCategoryId('paintings');
    setCollectionId('');
    setPrice('');
    setMedium('');
    setDimensions('');
    setOrientation('portrait');
    setAvailability('available');
    setYear(String(new Date().getFullYear()));
    setDescription('');
    setStory('');
    setTechnique('');
    setFeatured(false);
    setPopular(false);
    setNewArrival(false);
    setIsOriginal(true);
    setFramingAvailable(false);
    setEstimatedDelivery('5-7 business days');
    setTags('');
    setImages(['']);
  };

  const handleOpenAdd = () => {
    resetForm();
    setFormMode('create');
    setDrawerTitle('Add New Artwork');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (art: Artwork) => {
    setFormMode('edit');
    setEditingId(art.id);
    setDrawerTitle(`Edit Masterwork: ${art.title}`);

    // Populating inputs
    setTitle(art.title);
    setArtworkId(art.id);
    setArtistName(art.artist);
    setArtistId(art.artistId || '');
    setCategoryId(art.category);
    setCollectionId(art.collection || '');
    setPrice(String(art.price));
    setMedium(art.medium);
    setDimensions(art.dimensions);
    setOrientation(art.orientation);
    setAvailability(art.availability);
    setYear(String(art.year));
    setDescription(art.description);
    setStory(art.story);
    setTechnique(art.technique);
    setFeatured(art.featured);
    setPopular(art.popular);
    setNewArrival(art.newArrival);
    setIsOriginal(art.isOriginal);
    setFramingAvailable(art.framingAvailable);
    setEstimatedDelivery(art.estimatedDelivery);
    setTags(art.tags.join(', '));
    setImages(art.images.length > 0 ? art.images : ['']);

    setIsDrawerOpen(true);
  };

  const handleOpenDuplicate = (art: Artwork) => {
    resetForm();
    setFormMode('create');
    setDrawerTitle('Duplicate Artwork');

    setTitle(`${art.title} (Copy)`);
    setArtworkId(`${art.id}-copy`);
    setArtistName(art.artist);
    setArtistId(art.artistId || '');
    setCategoryId(art.category);
    setCollectionId(art.collection || '');
    setPrice(String(art.price));
    setMedium(art.medium);
    setDimensions(art.dimensions);
    setOrientation(art.orientation);
    setAvailability(art.availability);
    setYear(String(art.year));
    setDescription(art.description);
    setStory(art.story);
    setTechnique(art.technique);
    setFeatured(art.featured);
    setPopular(art.popular);
    setNewArrival(art.newArrival);
    setIsOriginal(art.isOriginal);
    setFramingAvailable(art.framingAvailable);
    setEstimatedDelivery(art.estimatedDelivery);
    setTags(art.tags.join(', '));
    setImages(art.images);

    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formLoading) return;

    // Front-end Validation focus checks
    if (!title.trim()) {
      titleInputRef.current?.focus();
      return;
    }
    if (formMode === 'create' && !artworkId.trim()) {
      idInputRef.current?.focus();
      return;
    }
    if (!price || isNaN(Number(price))) {
      priceInputRef.current?.focus();
      return;
    }

    setFormLoading(true);

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const filteredImages = images.map((img) => img.trim()).filter(Boolean);

    const payload: Omit<Artwork, 'createdAt'> = {
      id: artworkId,
      slug: artworkId,
      title,
      artist: artistName || 'Unknown Artist',
      artistId,
      description,
      story,
      technique,
      price: Number(price),
      category: categoryId as any,
      medium,
      dimensions,
      orientation,
      availability,
      featured,
      popular,
      newArrival,
      isOriginal,
      framingAvailable,
      estimatedDelivery,
      tags: parsedTags,
      images: filteredImages.length > 0 ? filteredImages : ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800'],
      collection: collectionId || undefined,
      year: Number(year),
    };

    try {
      const adminId = user?.id || null;
      if (formMode === 'create') {
        // Verify unique slug
        const exists = artworks.some((art) => art.id === artworkId);
        if (exists) {
          addToast('Artwork ID already exists. Please choose a unique ID.', 'error');
          idInputRef.current?.focus();
          setFormLoading(false);
          return;
        }
        await AdminService.createArtwork(adminId, payload);
        addToast('Artwork created successfully.', 'success');
      } else {
        await AdminService.updateArtwork(adminId, editingId!, payload);
        addToast('Artwork updated successfully.', 'success');
      }
      setIsDrawerOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to save artwork changes.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleArchiveClick = (art: any, action: 'archive' | 'restore') => {
    setConfirmTarget({ id: art.id, title: art.title, action });
    setIsConfirmOpen(true);
  };

  const handleConfirmToggleArchive = async () => {
    if (!confirmTarget) return;
    try {
      const adminId = user?.id || null;
      const isArchived = confirmTarget.action === 'restore'; // True if we are restoring
      await AdminService.toggleArtworkArchive(adminId, confirmTarget.id, confirmTarget.title, isArchived);
      addToast(
        `Artwork "${confirmTarget.title}" ${
          confirmTarget.action === 'archive' ? 'archived' : 'restored'
        } successfully.`,
        'success'
      );
      setIsConfirmOpen(false);
      setConfirmTarget(null);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to change archival status.', 'error');
    }
  };

  // Bulk options
  const handleBulkArchive = async (ids: string[]) => {
    try {
      const adminId = user?.id || null;
      await Promise.all(
        ids.map((id) => {
          const art = artworks.find((a) => a.id === id);
          return AdminService.toggleArtworkArchive(adminId, id, art?.title || id, false);
        })
      );
      addToast(`${ids.length} artworks archived successfully.`, 'success');
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to archive selected artworks.', 'error');
    }
  };

  // Image helpers
  const handleAddImageRow = () => {
    setImages([...images, '']);
  };

  const handleRemoveImageRow = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    setImages(next.length === 0 ? [''] : next);
  };

  const handleImageChange = (index: number, val: string) => {
    const next = [...images];
    next[index] = val;
    setImages(next);
  };

  // Data Table setup
  const columns = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (val: string, row: Artwork) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/5 border border-primary/5 rounded overflow-hidden relative shrink-0">
            <img
              src={row.images[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800'}
              alt={val}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <span className="font-semibold text-primary block">{val}</span>
            <span className="text-[10px] text-secondary/50 font-mono block">{row.id}</span>
          </div>
        </div>
      ),
    },
    { key: 'artist', label: 'Artist', sortable: true },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (val: number) => <span className="font-medium text-accent">${val.toLocaleString()}</span>,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (val: string) => <span className="capitalize">{val}</span>,
    },
    {
      key: 'availability',
      label: 'Availability',
      sortable: true,
      render: (val: string) => (
        <span
          className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
            val === 'available'
              ? 'bg-green-50 text-green-700 border border-green-100'
              : val === 'sold'
              ? 'bg-red-50 text-red-700 border border-red-100'
              : 'bg-amber-50 text-amber-700 border border-amber-100'
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => {
        const isSoftDeleted = !!row.deletedAt;
        return (
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleOpenEdit(row)}
              className="p-1 hover:text-accent border border-primary/5 rounded bg-white transition-all duration-150"
              title="Edit masterwork"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleOpenDuplicate(row)}
              className="p-1 hover:text-accent border border-primary/5 rounded bg-white transition-all duration-150"
              title="Duplicate"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleToggleArchiveClick(row, isSoftDeleted ? 'restore' : 'archive')}
              className={`p-1 border rounded bg-white transition-all duration-150 ${
                isSoftDeleted
                  ? 'hover:text-green-600 border-green-200 text-green-600'
                  : 'hover:text-red-500 border-primary/5'
              }`}
              title={isSoftDeleted ? 'Restore artwork' : 'Archive artwork'}
            >
              {isSoftDeleted ? <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" /> : <Archive className="w-3.5 h-3.5" />}
            </button>
          </div>
        );
      },
    },
  ];

  const tableFilters = [
    {
      key: 'category',
      label: 'Category',
      options: categories.map((c) => ({ label: c.name, value: c.id })),
    },
    {
      key: 'availability',
      label: 'Availability',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Sold', value: 'sold' },
        { label: 'Reserved', value: 'reserved' },
      ],
    },
  ];

  const tableBulkActions = [
    { label: 'Archive Selected', onClick: handleBulkArchive, variant: 'danger' as const },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Controls */}
      <div className="flex justify-between items-center border-b border-primary/5 pb-4">
        <div>
          <span className="text-accent text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1">
            CATALOG WORKSPACE
          </span>
          <h1 className="font-cormorant text-3xl font-light text-primary tracking-wide">
            Artwork Inventory
          </h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-accent hover:bg-accent/90 text-white text-xs px-4 py-2.5 rounded-sm transition-colors duration-200 shadow-md font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>New Artwork</span>
        </button>
      </div>

      {/* Main Table view */}
      {loading ? (
        <div className="bg-white p-12 border border-primary/5 rounded text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
          <span className="text-xs text-secondary/60 font-light">Loading masterworks database...</span>
        </div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={artworks}
          searchKey="title"
          searchPlaceholder="Search by artwork title..."
          filters={tableFilters}
          bulkActions={tableBulkActions}
          onRowClick={handleOpenEdit}
        />
      )}

      {/* Slide-over Form Drawer */}
      <AdminDrawer isOpen={isDrawerOpen} title={drawerTitle} onClose={() => setIsDrawerOpen(false)}>
        <form onSubmit={handleSave} className="space-y-6 text-xs text-secondary">
          {/* Main info row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Artwork Title *
              </label>
              <input
                type="text"
                required
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Unique Slug ID *
              </label>
              <input
                type="text"
                required
                ref={idInputRef}
                disabled={formMode === 'edit'}
                value={artworkId}
                onChange={(e) => setArtworkId(e.target.value)}
                placeholder="e.g. whispers-horizon-1"
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Artist Profile
              </label>
              <select
                value={artistId}
                onChange={(e) => {
                  setArtistId(e.target.value);
                  const found = artists.find((art) => art.id === e.target.value);
                  if (found) setArtistName(found.name);
                }}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-2.5 py-2 focus:outline-none focus:border-accent rounded-sm"
              >
                <option value="">Choose Artist Profile</option>
                {artists.map((artst) => (
                  <option key={artst.id} value={artst.id}>
                    {artst.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-2.5 py-2 focus:outline-none focus:border-accent rounded-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Acquisition Price ($) *
              </label>
              <input
                type="number"
                required
                ref={priceInputRef}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Theme Collection
              </label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-2.5 py-2 focus:outline-none focus:border-accent rounded-sm"
              >
                <option value="">None (Standard Catalog)</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Medium details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Medium
              </label>
              <input
                type="text"
                placeholder="e.g. Oil on Canvas"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Dimensions
              </label>
              <input
                type="text"
                placeholder="e.g. 40 x 30 in"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-2.5 py-2 focus:outline-none focus:border-accent rounded-sm"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
                <option value="square">Square</option>
              </select>
            </div>
          </div>

          {/* Status and Year details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Availability
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-2.5 py-2 focus:outline-none focus:border-accent rounded-sm"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Creation Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Estimated Delivery
              </label>
              <input
                type="text"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-1">
            <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Curator Curation Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm resize-none font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Behind the Masterpiece Story
            </label>
            <textarea
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm resize-none font-sans"
            />
          </div>

          {/* Checkboxes row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <label className="flex items-center text-[10px] text-secondary font-medium uppercase tracking-wider select-none cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="mr-2 accent-accent"
              />
              Featured
            </label>
            <label className="flex items-center text-[10px] text-secondary font-medium uppercase tracking-wider select-none cursor-pointer">
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="mr-2 accent-accent"
              />
              Popular
            </label>
            <label className="flex items-center text-[10px] text-secondary font-medium uppercase tracking-wider select-none cursor-pointer">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={(e) => setNewArrival(e.target.checked)}
                className="mr-2 accent-accent"
              />
              New Arrival
            </label>
            <label className="flex items-center text-[10px] text-secondary font-medium uppercase tracking-wider select-none cursor-pointer">
              <input
                type="checkbox"
                checked={isOriginal}
                onChange={(e) => setIsOriginal(e.target.checked)}
                className="mr-2 accent-accent"
              />
              Original
            </label>
            <label className="flex items-center text-[10px] text-secondary font-medium uppercase tracking-wider select-none cursor-pointer">
              <input
                type="checkbox"
                checked={framingAvailable}
                onChange={(e) => setFramingAvailable(e.target.checked)}
                className="mr-2 accent-accent"
              />
              Framing
            </label>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Search Tags (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. minimal, nature, traditional, gold"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm"
            />
          </div>

          {/* Image Upload list */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-primary/5 pb-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Artwork Images URLs *
              </label>
              <button
                type="button"
                onClick={handleAddImageRow}
                className="text-[9px] text-accent uppercase font-bold hover:underline"
              >
                Add Image Row
              </button>
            </div>
            <div className="space-y-2">
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    required
                    placeholder="https://example.com/image.jpg"
                    value={img}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    className="flex-1 bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageRow(idx)}
                      className="p-2 border border-red-100 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-primary/5 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 border border-primary/5 hover:bg-primary/5 text-secondary text-xs rounded-sm transition-colors duration-150"
            >
              Cancel
            </button>
            <LoadingButton type="submit" variant="primary" loading={formLoading}>
              Save Masterwork
            </LoadingButton>
          </div>
        </form>
      </AdminDrawer>

      {/* Confirmation Modal */}
      <AdminConfirmModal
        isOpen={isConfirmOpen}
        title={confirmTarget?.action === 'archive' ? 'Archive Artwork?' : 'Restore Artwork?'}
        message={
          confirmTarget?.action === 'archive'
            ? `Are you sure you want to archive "${confirmTarget?.title}"? It will be hidden from the public art gallery collections.`
            : `Are you sure you want to restore "${confirmTarget?.title}" back to active listing?`
        }
        confirmLabel={confirmTarget?.action === 'archive' ? 'Archive' : 'Restore'}
        onConfirm={handleConfirmToggleArchive}
        onCancel={() => setIsConfirmOpen(false)}
        variant={confirmTarget?.action === 'archive' ? 'danger' : 'primary'}
      />
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';

import { Edit2, FolderTree, Plus, Trash2 } from 'lucide-react';

import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminDrawer from '@/components/admin/AdminDrawer';
import LoadingButton from '@/components/ui/LoadingButton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { AdminRepository } from '@/repositories/admin.repository';
import { AdminService } from '@/services/admin.service';
import { StorageService } from '@/services/storage.service';

import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer / Form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('Add New Category');
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal Confirm state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string } | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [catId, setCatId] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await AdminRepository.getCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
      addToast('Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setName('');
    setCatId('');
    setDescription('');
    setImage('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setFormMode('create');
    setDrawerTitle('Add New Category');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setFormMode('edit');
    setEditingId(c.id);
    setDrawerTitle(`Edit Category: ${c.name}`);

    setName(c.name);
    setCatId(c.id);
    setDescription(c.description);
    setImage(c.image);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !catId.trim() || formLoading) return;

    setFormLoading(true);

    const payload: Category = {
      id: catId,
      slug: catId,
      name,
      description,
      image: image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800',
    };

    try {
      const adminId = user?.id || null;
      if (formMode === 'create') {
        const exists = categories.some((c) => c.id === catId);
        if (exists) {
          addToast('Category ID already exists.', 'error');
          setFormLoading(false);
          return;
        }
        await AdminService.createCategory(adminId, payload);
        addToast('Category created successfully.', 'success');
      } else {
        await AdminService.updateCategory(adminId, editingId!, payload);
        addToast('Category updated successfully.', 'success');
      }
      setIsDrawerOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to save category.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (c: Category) => {
    setConfirmTarget({ id: c.id, name: c.name });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;

    try {
      const adminId = user?.id || null;
      await AdminService.deleteCategory(adminId, confirmTarget.id, confirmTarget.name);
      addToast(`Category "${confirmTarget.name}" archived successfully.`, 'success');
      setIsConfirmOpen(false);
      setConfirmTarget(null);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to delete category.', 'error');
    }
  };

  // Data Table setup
  const columns = [
    {
      key: 'name',
      label: 'Category Details',
      sortable: true,
      render: (val: string, row: Category) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/5 border border-primary/5 rounded overflow-hidden relative shrink-0">
            <img
              src={
                row.image ||
                'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800'
              }
              alt={val}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <span className="font-semibold text-primary block">{val}</span>
            <span className="text-[10px] text-secondary/50 font-mono block">ID: {row.id}</span>
          </div>
        </div>
      ),
    },
    { key: 'description', label: 'Description', sortable: false },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Category) => (
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1 hover:text-accent border border-primary/5 rounded bg-white transition-all duration-150"
            title="Edit category"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-1 hover:text-red-500 border border-primary/5 rounded bg-white transition-all duration-150"
            title="Archive category"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-primary/5 pb-4">
        <div>
          <span className="text-accent text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1">
            SITE TAXONOMIES
          </span>
          <h1 className="font-cormorant text-3xl font-light text-primary tracking-wide">
            Gallery Categories
          </h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-accent hover:bg-accent/90 text-white text-xs px-4 py-2.5 rounded-sm transition-colors duration-200 shadow-md font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Table view */}
      {loading ? (
        <div className="bg-white p-12 border border-primary/5 rounded text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
          <span className="text-xs text-secondary/60 font-light">
            Loading categories database...
          </span>
        </div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={categories}
          searchKey="name"
          searchPlaceholder="Search category by name..."
          onRowClick={handleOpenEdit}
        />
      )}

      {/* Drawer */}
      <AdminDrawer isOpen={isDrawerOpen} title={drawerTitle} onClose={() => setIsDrawerOpen(false)}>
        <form onSubmit={handleSave} className="space-y-6 text-xs text-secondary">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                disabled={formMode === 'edit'}
                value={catId}
                onChange={(e) => setCatId(e.target.value)}
                placeholder="e.g. paintings"
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Curation Banner Image URL / Upload Image
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/banner.jpg"
                className="flex-1 bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm text-xs"
              />
              <input
                type="file"
                id="file-upload-category-banner"
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    setFormLoading(true);
                    const cleanedName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9./_-]/g, '_')}`;
                    await StorageService.uploadFile('artworks', cleanedName, file);
                    const publicUrl = StorageService.getPublicUrl('artworks', cleanedName);
                    setImage(publicUrl);
                    addToast('Category banner uploaded successfully!', 'success');
                  } catch (err) {
                    console.error(err);
                    addToast('Failed to upload banner image.', 'error');
                  } finally {
                    setFormLoading(false);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('file-upload-category-banner')?.click()}
                className="px-3 py-2 bg-primary hover:bg-accent text-white hover:text-primary transition-colors text-xs font-semibold rounded-sm cursor-pointer whitespace-nowrap"
              >
                Upload
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Curation Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm resize-none font-sans"
            />
          </div>

          <div className="pt-4 border-t border-primary/5 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 border border-primary/5 hover:bg-primary/5 text-secondary text-xs rounded-sm transition-colors duration-150"
            >
              Cancel
            </button>
            <LoadingButton type="submit" variant="primary" loading={formLoading}>
              Save Category
            </LoadingButton>
          </div>
        </form>
      </AdminDrawer>

      {/* Confirmation Modal */}
      <AdminConfirmModal
        isOpen={isConfirmOpen}
        title="Archive Category?"
        message={`Are you sure you want to archive "${confirmTarget?.name}"? You can restore it later in database operations.`}
        confirmLabel="Archive"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}

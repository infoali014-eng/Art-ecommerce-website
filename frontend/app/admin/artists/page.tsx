'use client';

import React, { useEffect, useState } from 'react';

import { Edit2, Plus, Trash2, UserCircle } from 'lucide-react';

import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminDrawer from '@/components/admin/AdminDrawer';
import LoadingButton from '@/components/ui/LoadingButton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { AdminRepository } from '@/repositories/admin.repository';
import { AdminService } from '@/services/admin.service';
import { StorageService } from '@/services/storage.service';

import { Artist } from '@/types';

export default function AdminArtistsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer / Form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('Add New Artist');
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal Confirm state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string } | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [artistId, setArtistId] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [mediums, setMediums] = useState('');
  const [statement, setStatement] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await AdminRepository.getArtists();
      setArtists(data);
    } catch (e) {
      console.error(e);
      addToast('Failed to load artists database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setName('');
    setArtistId('');
    setBio('');
    setAvatar('');
    setMediums('');
    setStatement('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setFormMode('create');
    setDrawerTitle('Add New Artist Profile');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (art: Artist) => {
    setFormMode('edit');
    setEditingId(art.id);
    setDrawerTitle(`Edit Artist Profile: ${art.name}`);

    setName(art.name);
    setArtistId(art.id);
    setBio(art.bio);
    setAvatar(art.avatar);
    setMediums(art.mediums.join(', '));
    setStatement(art.statement);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !artistId.trim() || formLoading) return;

    setFormLoading(true);

    const parsedMediums = mediums
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const payload: Artist = {
      id: artistId,
      slug: artistId,
      name,
      bio,
      avatar: avatar || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800',
      mediums: parsedMediums,
      statement,
    };

    try {
      const adminId = user?.id || null;
      if (formMode === 'create') {
        const exists = artists.some((a) => a.id === artistId);
        if (exists) {
          addToast('Artist ID already exists.', 'error');
          setFormLoading(false);
          return;
        }
        await AdminService.createArtist(adminId, payload);
        addToast('Artist profile created.', 'success');
      } else {
        await AdminService.updateArtist(adminId, editingId!, payload);
        addToast('Artist profile updated.', 'success');
      }
      setIsDrawerOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to save artist profile.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (art: Artist) => {
    setConfirmTarget({ id: art.id, name: art.name });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;

    try {
      const adminId = user?.id || null;
      await AdminService.deleteArtist(adminId, confirmTarget.id, confirmTarget.name);
      addToast(`Artist profile for "${confirmTarget.name}" archived.`, 'success');
      setIsConfirmOpen(false);
      setConfirmTarget(null);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to delete artist profile.', 'error');
    }
  };

  // Data Table setup
  const columns = [
    {
      key: 'name',
      label: 'Artist Details',
      sortable: true,
      render: (val: string, row: Artist) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border border-primary/5 bg-[#FAF8F5] overflow-hidden relative shrink-0">
            <img
              src={
                row.avatar ||
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
    {
      key: 'mediums',
      label: 'Medium Specialties',
      render: (val: string[]) => <span>{val.join(', ')}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Artist) => (
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1 hover:text-accent border border-primary/5 rounded bg-white transition-all duration-150"
            title="Edit profile"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-1 hover:text-red-500 border border-primary/5 rounded bg-white transition-all duration-150"
            title="Archive profile"
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
            CREATIVES WORKSPACE
          </span>
          <h1 className="font-cormorant text-3xl font-light text-primary tracking-wide">
            Studio Artists Registry
          </h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-accent hover:bg-accent/90 text-white text-xs px-4 py-2.5 rounded-sm transition-colors duration-200 shadow-md font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>New Artist</span>
        </button>
      </div>

      {/* Table view */}
      {loading ? (
        <div className="bg-white p-12 border border-primary/5 rounded text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
          <span className="text-xs text-secondary/60 font-light">Loading artists database...</span>
        </div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={artists}
          searchKey="name"
          searchPlaceholder="Search artists by name..."
          onRowClick={handleOpenEdit}
        />
      )}

      {/* Drawer */}
      <AdminDrawer isOpen={isDrawerOpen} title={drawerTitle} onClose={() => setIsDrawerOpen(false)}>
        <form onSubmit={handleSave} className="space-y-6 text-xs text-secondary">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Artist Name *
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
                value={artistId}
                onChange={(e) => setArtistId(e.target.value)}
                placeholder="e.g. master-ali"
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Profile Avatar URL
              </label>
              <div className="flex items-center space-x-2 w-full">
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1 bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm text-xs"
                />
                <input
                  type="file"
                  id="file-upload-artist-avatar"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setFormLoading(true);
                      const cleanedName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9./_-]/g, '_')}`;
                      await StorageService.uploadFile('artists', cleanedName, file);
                      const publicUrl = StorageService.getPublicUrl('artists', cleanedName);
                      setAvatar(publicUrl);
                      addToast('Avatar uploaded successfully!', 'success');
                    } catch (err) {
                      console.error(err);
                      addToast('Failed to upload avatar.', 'error');
                    } finally {
                      setFormLoading(false);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('file-upload-artist-avatar')?.click()}
                  className="px-3 py-2 bg-primary hover:bg-accent text-white hover:text-primary transition-colors text-xs font-semibold rounded-sm cursor-pointer"
                >
                  Upload
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Medium Specialties (Comma-separated)
              </label>
              <input
                type="text"
                required
                value={mediums}
                onChange={(e) => setMediums(e.target.value)}
                placeholder="e.g. Calligraphy, Oil painting, Charcoal"
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Curator Artist Statement
            </label>
            <textarea
              rows={3}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm resize-none font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Creative Biography
            </label>
            <textarea
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
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
              Save Artist Profile
            </LoadingButton>
          </div>
        </form>
      </AdminDrawer>

      {/* Confirmation Modal */}
      <AdminConfirmModal
        isOpen={isConfirmOpen}
        title="Archive Artist Profile?"
        message={`Are you sure you want to archive "${confirmTarget?.name}"'s creative profile?`}
        confirmLabel="Archive"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}

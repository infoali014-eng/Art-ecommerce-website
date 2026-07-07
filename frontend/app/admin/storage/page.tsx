/* eslint-disable */
'use client';

import React, { useEffect, useState } from 'react';
import {
  HardDrive,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Calendar,
  Paperclip,
} from 'lucide-react';
import { StorageService } from '@/services/storage.service';
import { useToast } from '@/hooks/useToast';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

interface StorageFile {
  name: string;
  id?: string;
  created_at?: string;
  metadata?: Record<string, any>;
}

export default function AdminStoragePage() {
  const { addToast } = useToast();

  const [buckets, setBuckets] = useState<{ id: string; name: string }[]>([]);
  const [selectedBucket, setSelectedBucket] = useState('');
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loadingBuckets, setLoadingBuckets] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(false);

  // Deletion state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBucket) return;

    try {
      setUploading(true);
      const cleanedName = file.name.replace(/[^a-zA-Z0-9./_-]/g, '_');
      await StorageService.uploadFile(selectedBucket, cleanedName, file);
      addToast('Asset uploaded successfully!', 'success');
      loadFiles();
    } catch (err) {
      console.error(err);
      addToast('Failed to upload asset.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const loadBuckets = async () => {
    try {
      setLoadingBuckets(true);
      const list = await StorageService.listBuckets();
      setBuckets(list);
      if (list.length > 0) {
        setSelectedBucket(list[0].id);
      }
    } catch (e) {
      console.error(e);
      addToast('Failed to load storage buckets.', 'error');
    } finally {
      setLoadingBuckets(false);
    }
  };

  const loadFiles = async () => {
    if (!selectedBucket) return;
    try {
      setLoadingFiles(true);
      const list = await StorageService.listFiles(selectedBucket);
      setFiles((list || []) as any);
    } catch (e) {
      console.error(e);
      addToast('Failed to load files in bucket.', 'error');
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    loadBuckets();
  }, []);

  useEffect(() => {
    loadFiles();
  }, [selectedBucket]);

  const handleDeleteClick = (name: string) => {
    setFileToDelete(name);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete || !selectedBucket) return;

    try {
      await StorageService.deleteFile(selectedBucket, fileToDelete);
      addToast('File deleted successfully.', 'success');
      setIsConfirmOpen(false);
      setFileToDelete(null);
      loadFiles();
    } catch (e) {
      console.error(e);
      addToast('Failed to delete file.', 'error');
    }
  };

  // Helpers
  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const isImageFile = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '');
  };

  const getFilePublicUrl = (fileName: string) => {
    return StorageService.getPublicUrl(selectedBucket, fileName);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-primary/5 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <span className="text-accent text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1">
            RESOURCE MANAGEMENT
          </span>
          <h1 className="font-cormorant text-3xl font-light text-primary tracking-wide">
            Visual Storage Explorer
          </h1>
        </div>

        {/* Bucket Select & Upload */}
        {!loadingBuckets && buckets.length > 0 && (
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-secondary font-medium uppercase tracking-wider text-[10px]">
                Bucket:
              </span>
              <select
                value={selectedBucket}
                onChange={(e) => setSelectedBucket(e.target.value)}
                className="bg-white border border-primary/5 px-3 py-1.5 focus:outline-none focus:border-accent rounded-sm font-semibold text-primary"
              >
                {buckets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.id})
                  </option>
                ))}
              </select>
            </div>

            <input
              type="file"
              id="storage-upload-input"
              className="hidden"
              onChange={handleUploadFile}
              disabled={uploading}
              accept="image/*"
            />
            <button
              type="button"
              onClick={() => document.getElementById('storage-upload-input')?.click()}
              disabled={uploading}
              className="bg-primary hover:bg-accent text-white hover:text-primary transition-colors duration-150 px-4 py-2 text-xs uppercase font-semibold tracking-wider rounded-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {uploading ? 'Uploading...' : 'Upload Asset'}
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loadingFiles ? (
        <div className="bg-white p-12 border border-primary/5 rounded text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
          <span className="text-xs text-secondary/60 font-light">Listing files metadata...</span>
        </div>
      ) : (
        /* Files Grid */
        <div>
          {files.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {files.map((file) => {
                const isImg = isImageFile(file.name);
                const publicUrl = getFilePublicUrl(file.name);
                const fileSize = file.metadata?.size;
                const fileMime = file.metadata?.mimetype;

                return (
                  <div
                    key={file.name}
                    className="bg-white border border-primary/5 rounded-sm overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-300 group"
                  >
                    {/* Visual Preview */}
                    <div className="aspect-video bg-[#FAF8F5] border-b border-primary/5 flex items-center justify-center relative overflow-hidden shrink-0">
                      {isImg ? (
                        <img
                          src={publicUrl}
                          alt={file.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Paperclip className="w-8 h-8 text-secondary/30 stroke-[1.2]" />
                      )}
                      {/* Open original file */}
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="View Full Size"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* File Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
                      <div className="space-y-1">
                        <div className="font-semibold text-primary truncate" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-[10px] text-secondary/50 font-light flex items-center space-x-1.5">
                          <span>{formatBytes(fileSize)}</span>
                          {fileMime && (
                            <>
                              <span>&bull;</span>
                              <span className="truncate max-w-[80px]" title={fileMime}>
                                {fileMime.split('/').pop()}
                              </span>
                            </>
                          )}
                        </div>
                        {file.created_at && (
                          <div className="text-[9px] text-secondary/40 font-light flex items-center space-x-1 pt-1">
                            <Calendar className="w-3 h-3 stroke-[1.2]" />
                            <span>{new Date(file.created_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-2 border-t border-primary/5 w-full">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(publicUrl);
                            addToast('URL copied to clipboard!', 'success');
                          }}
                          className="flex items-center space-x-1 px-2.5 py-1.5 text-[10px] uppercase font-semibold tracking-wider border border-accent/20 text-accent hover:bg-accent/5 rounded transition-colors duration-150 cursor-pointer"
                        >
                          <span>Copy URL</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(file.name)}
                          className="flex items-center space-x-1 px-2.5 py-1.5 text-[10px] uppercase font-semibold tracking-wider border border-red-100 text-red-500 hover:bg-red-50 rounded transition-colors duration-150 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-16 border border-primary/5 rounded text-center max-w-lg mx-auto flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-primary/5 bg-[#FAF7F2] flex items-center justify-center text-secondary/30 mb-4">
                <ImageIcon className="w-6 h-6 stroke-[1.2]" />
              </div>
              <h3 className="font-cormorant text-xl text-primary font-medium mb-1">
                Bucket is Empty
              </h3>
              <p className="text-secondary/60 text-xs font-light">
                There are no uploaded assets in this storage bucket.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <AdminConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Resource File?"
        message={`Are you sure you want to permanently delete "${fileToDelete}"? This action is irreversible and will break any references to this image.`}
        confirmLabel="Delete File"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}

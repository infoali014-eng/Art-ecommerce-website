'use client';

import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'primary';
}

export default function AdminConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'primary',
}: AdminConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="bg-white border border-primary/10 w-full max-w-md rounded-sm overflow-hidden shadow-2xl relative z-10 font-sans transform transition-all duration-300 scale-100">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-accent/10 text-accent'
              }`}
            >
              {variant === 'danger' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-cormorant text-xl text-primary font-medium tracking-wide">
                {title}
              </h3>
              <p className="text-secondary/70 text-xs font-light leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-6 py-4 border-t border-primary/5 bg-[#FAF8F5] flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-primary/5 hover:border-primary/10 bg-white hover:bg-primary/5 text-secondary text-xs rounded-sm transition-colors duration-150"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white text-xs rounded-sm transition-colors duration-150 font-medium ${
              variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-accent hover:bg-accent/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

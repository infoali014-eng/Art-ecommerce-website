/* eslint-disable */
'use client';

import React from 'react';
import { X } from 'lucide-react';

interface AdminDrawerProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function AdminDrawer({ isOpen, title, onClose, children }: AdminDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-90 flex justify-end">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/35 backdrop-blur-[2px] transition-opacity duration-300"
      />

      {/* Slide-over panel */}
      <div className="bg-white border-l border-primary/10 w-full max-w-2xl h-full shadow-2xl relative z-10 flex flex-col font-sans transition-transform duration-300 ease-in-out translate-x-0">
        {/* Drawer Header */}
        <div className="h-20 border-b border-primary/5 px-6 md:px-8 flex items-center justify-between shrink-0 bg-[#FAF8F5]">
          <h3 className="font-cormorant text-2xl text-primary font-medium tracking-wide">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-secondary/60 hover:text-primary border border-primary/5 hover:border-primary/10 rounded-sm bg-white transition-all duration-150"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

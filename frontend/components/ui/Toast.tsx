'use client';

import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

import { useToast } from '@/hooks/useToast';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full font-sans">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              layout
              className="flex items-center justify-between gap-3 bg-white border border-primary/10 shadow-xl p-4 text-xs tracking-wide uppercase font-medium"
            >
              <div className="flex items-center gap-2.5">
                {isSuccess && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                {isError && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                {!isSuccess && !isError && <Info className="w-4 h-4 text-accent shrink-0" />}
                <span className="text-primary font-sans font-light normal-case tracking-normal">
                  {toast.message}
                </span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-secondary/50 hover:text-primary transition-colors cursor-pointer"
                aria-label="Dismiss Toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
export default ToastContainer;

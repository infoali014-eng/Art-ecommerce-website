'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';

import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { formatCurrency } from '@/utils/formatCurrency';

import { Button } from '../ui/Button';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    tax,
    grandTotal,
  } = useCart();

  const { addToast } = useToast();

  const handleRemove = (id: string, title: string) => {
    removeItem(id);
    addToast(`Removed "${title}" from your shopping bag.`, 'info');
  };

  const handleIncrement = (id: string, currentQty: number) => {
    updateQuantity(id, currentQty + 1);
  };

  const handleDecrement = (id: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-primary/40 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer container panel */}
          <div className="absolute inset-y-0 right-0 max-w-md w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full bg-background shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-accent" />
                  <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide">
                    Shopping Bag
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-secondary hover:text-primary transition-colors cursor-pointer"
                  aria-label="Close Cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  /* Empty state illustration */
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-full border border-primary/5 bg-white flex items-center justify-center text-secondary/40">
                      <ShoppingBag className="w-6 h-6 stroke-[1.2]" />
                    </div>
                    <div>
                      <h4 className="font-cormorant text-xl font-light text-primary mb-1">
                        Your bag is empty
                      </h4>
                      <p className="text-xs text-secondary font-light max-w-[240px]">
                        Exquisite original artworks are waiting to command your space.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4"
                    >
                      Continue Gallery View
                    </Button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-6 border-b border-primary/5 last:border-b-0"
                    >
                      {/* Product image link */}
                      <div className="relative w-20 aspect-[3/4] bg-background border border-primary/5 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Info details */}
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-cormorant text-base text-primary font-medium tracking-wide leading-tight">
                              {item.title}
                            </h4>
                            <button
                              onClick={() => handleRemove(item.id, item.title)}
                              className="text-secondary/40 hover:text-red-500 transition-colors cursor-pointer"
                              aria-label="Remove Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {item.frameOption !== 'none' && (
                            <span className="inline-block bg-accent/10 text-accent text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 mt-1.5">
                              Frame: {item.frameOption}
                            </span>
                          )}
                        </div>

                        {/* Controls row */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-primary/10 bg-white">
                            <button
                              onClick={() => handleDecrement(item.id, item.quantity)}
                              className="px-2 py-1 hover:bg-primary/5 text-secondary hover:text-primary transition-colors cursor-pointer disabled:opacity-40"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease Quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs text-primary font-medium min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncrement(item.id, item.quantity)}
                              className="px-2 py-1 hover:bg-primary/5 text-secondary hover:text-primary transition-colors cursor-pointer"
                              aria-label="Increase Quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs font-semibold text-primary">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary / Actions */}
              {items.length > 0 && (
                <div className="p-6 border-t border-primary/5 bg-[#FAF7F2] space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-secondary">
                      <span>Subtotal</span>
                      <span className="text-primary font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-secondary">
                      <span>Insured Art Shipping</span>
                      <span className="text-primary font-medium">
                        {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-secondary">
                      <span>Sales Tax (8%)</span>
                      <span className="text-primary font-medium">{formatCurrency(tax)}</span>
                    </div>
                    <div className="border-t border-primary/5 my-2 pt-2 flex justify-between text-sm font-semibold text-primary">
                      <span>Grand Total</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Button variant="primary" fullWidth disabled>
                      Checkout (Coming Soon)
                    </Button>
                    <Link href="/cart" className="block w-full">
                      <Button variant="outline" fullWidth onClick={() => setIsCartOpen(false)}>
                        View Shopping Bag
                      </Button>
                    </Link>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="block w-full text-center text-[10px] uppercase tracking-widest text-secondary hover:text-primary transition-colors py-1.5 cursor-pointer"
                    >
                      Continue Gallery Browsing
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default CartDrawer;

'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowLeft, ClipboardList, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { formatCurrency } from '@/utils/formatCurrency';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shipping, tax, grandTotal } = useCart();

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
    <>
      <Navbar />
      <Breadcrumbs customLabels={{ cart: 'Shopping Bag' }} />

      <PageWrapper className="pt-8">
        <Section padding="none" className="pb-24 font-sans">
          <Container>
            {/* Header Section */}
            <div className="mb-12">
              <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium block mb-2">
                YOUR SELECTIONS
              </span>
              <h1 className="font-cormorant text-4xl md:text-5xl font-light text-primary tracking-wide">
                Shopping Bag
              </h1>
              <div className="w-12 h-[1px] bg-accent mt-4" />
            </div>

            {items.length === 0 ? (
              /* Empty Cart View */
              <div className="border border-primary/5 bg-white py-24 px-6 text-center max-w-2xl mx-auto flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border border-primary/5 bg-background flex items-center justify-center text-secondary/40 mb-6">
                  <ShoppingBag className="w-6 h-6 stroke-[1.2]" />
                </div>
                <h3 className="font-cormorant text-2xl font-light text-primary mb-3">
                  Your Bag is Empty
                </h3>
                <p className="font-sans text-xs text-secondary font-light max-w-xs mb-8 leading-relaxed">
                  No artworks have been added to your shopping bag yet. Browse our curated gallery
                  to acquire original works.
                </p>
                <Link href="/gallery">
                  <Button variant="primary" size="sm">
                    Browse Fine Gallery
                  </Button>
                </Link>
              </div>
            ) : (
              /* Active Cart Grid */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                {/* Left Side: Table of items */}
                <div className="lg:col-span-2 space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-primary/5 p-6 flex flex-col sm:flex-row gap-6 relative hover:shadow-md transition-shadow duration-300"
                    >
                      {/* Image Preview */}
                      <div className="relative w-24 aspect-[3/4] bg-background border border-primary/5 overflow-hidden shrink-0 self-center sm:self-start">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <div>
                              <h3 className="font-cormorant text-xl font-medium text-primary tracking-wide">
                                {item.title}
                              </h3>
                              <span className="text-[10px] text-secondary uppercase tracking-wider block mt-0.5">
                                Original Art
                              </span>
                            </div>
                            <span className="font-sans text-sm font-semibold text-primary">
                              {formatCurrency(item.price)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.frameOption !== 'none' && (
                              <span className="bg-accent/10 text-accent text-[9px] uppercase tracking-widest font-semibold px-2.5 py-0.5">
                                Frame: {item.frameOption}
                              </span>
                            )}
                            <span className="bg-primary/5 text-secondary text-[9px] uppercase tracking-widest font-medium px-2.5 py-0.5">
                              COA Authentication Included
                            </span>
                          </div>

                          {/* Notes field */}
                          <div className="mb-4 flex items-center gap-2 text-xs">
                            <ClipboardList className="w-4 h-4 text-secondary/60 shrink-0" />
                            <span className="text-secondary font-light">
                              Notes: {item.notes || 'None added'}
                            </span>
                          </div>
                        </div>

                        {/* Quantity and Remove Row */}
                        <div className="flex items-center justify-between border-t border-primary/5 pt-4">
                          <div className="flex items-center border border-primary/10 bg-white">
                            <button
                              onClick={() => handleDecrement(item.id, item.quantity)}
                              className="px-2.5 py-1.5 hover:bg-primary/5 text-secondary hover:text-primary transition-colors cursor-pointer disabled:opacity-40"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease Quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-4 text-xs text-primary font-medium min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncrement(item.id, item.quantity)}
                              className="px-2.5 py-1.5 hover:bg-primary/5 text-secondary hover:text-primary transition-colors cursor-pointer"
                              aria-label="Increase Quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-6">
                            <span className="text-xs font-semibold text-primary">
                              Total: {formatCurrency(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => handleRemove(item.id, item.title)}
                              className="inline-flex items-center gap-1 text-secondary/50 hover:text-red-500 transition-colors text-[10px] uppercase tracking-widest font-medium cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4">
                    <Link
                      href="/gallery"
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Gallery</span>
                    </Link>
                  </div>
                </div>

                {/* Right Side: Order Summary Panel */}
                <div className="bg-[#FAF7F2] border border-primary/5 p-8 space-y-6 lg:sticky lg:top-24">
                  <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide border-b border-primary/5 pb-3">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-secondary">
                      <span>Subtotal</span>
                      <span className="text-primary font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-secondary">
                      <span>Insured Shipping Courier</span>
                      <span className="text-primary font-medium">
                        {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-secondary">
                      <span>Estimated Sales Tax (8%)</span>
                      <span className="text-primary font-medium">{formatCurrency(tax)}</span>
                    </div>
                    <div className="border-t border-primary/5 my-4 pt-4 flex justify-between text-sm font-semibold text-primary">
                      <span>Grand Total</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-primary/5">
                    <Button variant="primary" size="lg" fullWidth disabled>
                      Checkout (Coming Soon)
                    </Button>
                    <p className="text-[10px] text-secondary font-light text-center leading-relaxed">
                      Insured luxury courier delivery and certificate of authenticity included. Mock
                      checkout portal.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}

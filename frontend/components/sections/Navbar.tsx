'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { motion } from 'framer-motion';
import { ChevronDown, Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';

import { navigation } from '@/config/navigation';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

import { Container } from '../layout/Container';

import { CartDrawer } from './CartDrawer';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, isCartOpen, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-primary/5 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-cormorant text-2xl font-semibold tracking-[0.2em] text-primary hover:text-accent transition-colors duration-300"
          >
            AURA
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              if (item.items) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      className={`font-sans text-xs uppercase tracking-widest flex items-center gap-1 py-2 cursor-pointer transition-colors duration-300 ${
                        pathname.startsWith(item.href)
                          ? 'text-accent font-medium'
                          : 'text-primary hover:text-accent'
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Dropdown Items */}
                    <div
                      className={`absolute top-full left-0 mt-1 w-56 bg-background border border-primary/5 shadow-xl transition-all duration-300 ${
                        dropdownOpen
                          ? 'opacity-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 translate-y-2 pointer-events-none'
                      }`}
                    >
                      <div className="py-2">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className={`block px-5 py-2.5 text-[11px] uppercase tracking-wider transition-colors duration-200 ${
                              pathname === subItem.href
                                ? 'bg-primary/5 text-accent font-medium'
                                : 'text-primary hover:bg-primary/5 hover:text-accent'
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`font-sans text-xs uppercase tracking-widest transition-colors duration-300 ${
                    pathname === item.href
                      ? 'text-accent font-medium'
                      : 'text-primary hover:text-accent'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              aria-label="Search"
              className="text-primary hover:text-accent transition-colors duration-300 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="text-primary hover:text-accent transition-colors duration-300 relative"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <motion.span
                  key={`wish-${wishlistCount}`}
                  initial={{ scale: 0.5, opacity: 0.5 }}
                  animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-1.5 -right-1.5 bg-accent text-[9px] text-primary w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              aria-label="Cart"
              className="text-primary hover:text-accent transition-colors duration-300 relative cursor-pointer bg-transparent border-0 p-0"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <motion.span
                  key={`cart-${itemCount}`}
                  initial={{ scale: 0.5, opacity: 0.5 }}
                  animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-1.5 -right-1.5 bg-accent text-[9px] text-primary w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              aria-label="Search"
              className="text-primary hover:text-accent transition-colors duration-300"
            >
              <Search className="w-4 h-4" />
            </button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="text-primary hover:text-accent transition-colors duration-300 relative"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <motion.span
                  key={`wish-mob-${wishlistCount}`}
                  initial={{ scale: 0.5, opacity: 0.5 }}
                  animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-1.5 -right-1.5 bg-accent text-[9px] text-primary w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              aria-label="Cart"
              className="text-primary hover:text-accent transition-colors duration-300 relative cursor-pointer bg-transparent border-0 p-0"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <motion.span
                  key={`cart-mob-${itemCount}`}
                  initial={{ scale: 0.5, opacity: 0.5 }}
                  animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-1.5 -right-1.5 bg-accent text-[9px] text-primary w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Mobile Menu"
              className="text-primary hover:text-accent transition-colors duration-300 cursor-pointer"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 top-[60px] bg-background z-30 transition-all duration-500 ease-in-out md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col p-8 space-y-6 h-full overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.label} className="flex flex-col space-y-3">
              {item.items ? (
                <>
                  <span className="font-sans text-xs uppercase tracking-widest text-secondary">
                    {item.label}
                  </span>
                  <div className="pl-4 flex flex-col space-y-3 border-l border-primary/5">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className={`font-sans text-xs uppercase tracking-widest transition-colors duration-300 ${
                          pathname === subItem.href
                            ? 'text-accent font-medium'
                            : 'text-primary hover:text-accent'
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`font-sans text-xs uppercase tracking-widest transition-colors duration-300 ${
                    pathname === item.href
                      ? 'text-accent font-medium'
                      : 'text-primary hover:text-accent'
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
      <CartDrawer />
    </header>
  );
};
export default Navbar;

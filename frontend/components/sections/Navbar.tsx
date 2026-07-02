'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { motion } from 'framer-motion';
import { ChevronDown, Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';

import { navigation } from '@/config/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { useWishlist } from '@/hooks/useWishlist';
import { AuthService } from '@/services/auth.service';

import { Container } from '../layout/Container';

import { CartDrawer } from './CartDrawer';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, isCartOpen, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      addToast('Logged out successfully.', 'info');
      router.push('/');
    } catch {
      addToast('Logout failed.', 'error');
    }
  };

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

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors duration-300 relative cursor-pointer"
                  aria-label="User profile menu"
                >
                  <div className="w-6 h-6 rounded-full bg-accent/10 border border-primary/5 flex items-center justify-center text-[10px] font-bold text-accent">
                    {user?.user_metadata?.full_name
                      ? user.user_metadata.full_name.substring(0, 1).toUpperCase()
                      : 'C'}
                  </div>
                  <ChevronDown className="w-3 h-3 text-secondary" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-48 bg-white border border-primary/5 shadow-xl py-2 z-50 text-xs font-sans">
                    <div className="px-4 py-2 border-b border-primary/5 text-secondary font-light">
                      Acquirer:{' '}
                      <span className="font-semibold text-primary block truncate">
                        {user?.user_metadata?.full_name || user?.email}
                      </span>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-primary hover:bg-accent/5 transition-colors"
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-primary hover:bg-accent/5 transition-colors"
                    >
                      Acquisitions History
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left block px-4 py-2 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-xs uppercase tracking-widest bg-primary text-white hover:bg-accent hover:text-primary transition-colors px-3 py-1.5 font-medium"
                >
                  Register
                </Link>
              </div>
            )}
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

            {isAuthenticated ? (
              <Link
                href="/profile"
                className="w-6 h-6 rounded-full bg-accent/10 border border-primary/5 flex items-center justify-center text-[10px] font-bold text-accent shrink-0"
                aria-label="Profile"
              >
                {user?.user_metadata?.full_name
                  ? user.user_metadata.full_name.substring(0, 1).toUpperCase()
                  : 'C'}
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-[10px] uppercase tracking-widest font-medium text-secondary hover:text-primary transition-colors shrink-0"
              >
                Login
              </Link>
            )}

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

          {/* Mobile Auth Links */}
          <div className="border-t border-primary/5 pt-6 flex flex-col space-y-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="font-sans text-xs uppercase tracking-widest text-primary hover:text-accent transition-colors"
                >
                  Your Profile
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setIsOpen(false)}
                  className="font-sans text-xs uppercase tracking-widest text-primary hover:text-accent transition-colors"
                >
                  Acquisitions History
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left font-sans text-xs uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="font-sans text-xs uppercase tracking-widest text-primary hover:text-accent transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="font-sans text-xs uppercase tracking-widest text-primary hover:text-accent transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <CartDrawer />
    </header>
  );
};
export default Navbar;

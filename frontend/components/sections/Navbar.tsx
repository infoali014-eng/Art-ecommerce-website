'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { navigation } from '@/config/navigation';
import { Container } from '../layout/Container';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

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
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
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
              href="/cart"
              aria-label="Cart"
              className="text-primary hover:text-accent transition-colors duration-300 relative"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-[9px] text-primary w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>
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
              href="/cart"
              aria-label="Cart"
              className="text-primary hover:text-accent transition-colors duration-300 relative"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-[9px] text-primary w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>
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
    </header>
  );
};
export default Navbar;

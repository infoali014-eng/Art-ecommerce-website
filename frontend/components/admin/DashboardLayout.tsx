'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  ChevronLeft,
  ChevronRight,
  FolderTree,
  HardDrive,
  HeartHandshake,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Paintbrush,
  Scroll,
  Settings,
  ShoppingCart,
  UserCircle,
  Users,
  X,
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { AuthService } from '@/services/auth.service';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Artworks', href: '/admin/artworks', icon: Paintbrush },
  { name: 'Commissions', href: '/admin/commissions', icon: HeartHandshake },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Collections', href: '/admin/collections', icon: Layers },
  { name: 'Artists', href: '/admin/artists', icon: UserCircle },
  { name: 'Storage', href: '/admin/storage', icon: HardDrive },
  { name: 'Activity Log', href: '/admin/activity', icon: Scroll },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      addToast('Logged out successfully.', 'success');
      window.location.href = '/login';
    } catch (e) {
      console.error(e);
      addToast('Logout failed.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex font-sans">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 bg-[#1A1816] text-[#E5DCD3] z-50 flex flex-col transition-all duration-300 border-r border-white/5 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Header Branding */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center font-cormorant text-white font-medium text-lg shadow-[0_2px_10px_rgba(201,173,123,0.3)]">
              M
            </span>
            {(!collapsed || mobileOpen) && (
              <span className="font-cormorant text-xl font-light tracking-[0.1em] text-white">
                MANAN{' '}
                <span className="text-accent font-normal text-xs uppercase tracking-widest block font-sans">
                  ADMIN
                </span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-sm transition-all duration-200 text-xs font-light tracking-wide ${
                  isActive
                    ? 'bg-accent text-white font-medium shadow-[0_2px_8px_rgba(201,173,123,0.25)]'
                    : 'hover:bg-white/5 hover:text-white text-[#A39B94]'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="w-[18px] h-[18px] stroke-[1.4] shrink-0" />
                {(!collapsed || mobileOpen) && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/5 space-y-2">
          {(!collapsed || mobileOpen) && user && (
            <div className="flex items-center space-x-3 px-2 py-1 mb-2">
              <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-cormorant text-accent font-medium text-sm">
                {user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-medium text-white truncate">
                  {user.user_metadata?.full_name || 'Admin'}
                </div>
                <div className="text-[10px] text-white/40 truncate">{user.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-light text-red-400 hover:bg-red-950/20 rounded-sm transition-colors duration-200"
          >
            <LogOut className="w-[18px] h-[18px] stroke-[1.4] shrink-0" />
            {(!collapsed || mobileOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main body wrapper */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top bar header */}
        <header className="h-20 bg-white border-b border-primary/5 px-6 md:px-8 flex items-center justify-between sticky top-0 z-35 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1 text-secondary/70 hover:text-primary transition-colors duration-200"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex items-center justify-center p-1.5 border border-primary/5 hover:border-primary/10 rounded-sm text-secondary/60 hover:text-primary transition-all duration-200 bg-white"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4 stroke-[1.5]" />
              ) : (
                <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
              )}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-[10px] uppercase tracking-widest text-accent font-medium px-3 py-1.5 border border-accent/20 hover:bg-accent/5 rounded-sm transition-colors duration-200 font-sans"
            >
              Public Gallery
            </Link>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

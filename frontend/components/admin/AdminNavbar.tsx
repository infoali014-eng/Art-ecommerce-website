'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  CheckCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  HeartHandshake,
  ShoppingCart,
  Users,
  Paintbrush,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AdminRepository } from '@/repositories/admin.repository';
import { Notification } from '@/types';

interface AdminNavbarProps {
  onMenuClick: () => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

export default function AdminNavbar({ onMenuClick, collapsed, setCollapsed }: AdminNavbarProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await AdminRepository.globalSearch(searchTerm);
        setSearchResults(results);
        setShowSearchDropdown(true);
      } catch (e) {
        console.error('Failed global search:', e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await AdminRepository.getNotifications(user.id);
      setNotifications(data);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 30 seconds for live updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await AdminRepository.markAllNotificationsRead(user.id);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkOneRead = async (id: number) => {
    try {
      await AdminRepository.markNotificationRead(id);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="h-20 bg-white border-b border-primary/5 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      {/* Sidebar triggers */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
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

      {/* Global Search and Tools */}
      <div className="flex-1 max-w-md mx-6 relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
          <input
            type="text"
            placeholder="Global search (Artworks, commissions, orders...)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full bg-[#FAF8F5] border border-primary/5 focus:border-accent rounded-sm pl-9 pr-4 py-2 text-xs font-sans focus:outline-none transition-all duration-200"
          />
        </div>

        {/* Global Search Results Overlay */}
        {showSearchDropdown && searchResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary/10 rounded-sm shadow-xl max-h-[400px] overflow-y-auto z-40 p-3 font-sans">
            <h4 className="text-[10px] text-secondary font-medium uppercase tracking-wider mb-2 border-b border-primary/5 pb-1">
              Search Results
            </h4>

            {/* Artworks section */}
            {searchResults.artworks?.length > 0 && (
              <div className="mb-3">
                <div className="text-[9px] uppercase tracking-widest text-accent font-semibold flex items-center mb-1.5">
                  <Paintbrush className="w-3 h-3 mr-1" /> Artworks
                </div>
                {searchResults.artworks.map((art: any) => (
                  <Link
                    key={art.id}
                    href={`/admin/artworks?id=${art.id}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="block px-2 py-1.5 hover:bg-[#FAF8F5] rounded text-xs text-primary transition-colors duration-150"
                  >
                    <span className="font-medium">{art.title}</span>{' '}
                    <span className="text-[10px] text-secondary font-light">by {art.artist_name}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Commissions section */}
            {searchResults.commissions?.length > 0 && (
              <div className="mb-3">
                <div className="text-[9px] uppercase tracking-widest text-accent font-semibold flex items-center mb-1.5">
                  <HeartHandshake className="w-3 h-3 mr-1" /> Commissions
                </div>
                {searchResults.commissions.map((comm: any) => (
                  <Link
                    key={comm.id}
                    href={`/admin/commissions?id=${comm.id}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="block px-2 py-1.5 hover:bg-[#FAF8F5] rounded text-xs text-primary transition-colors duration-150"
                  >
                    <span className="font-medium">{comm.title}</span>{' '}
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/5 text-secondary uppercase font-light ml-2">
                      {comm.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Orders section */}
            {searchResults.orders?.length > 0 && (
              <div className="mb-3">
                <div className="text-[9px] uppercase tracking-widest text-accent font-semibold flex items-center mb-1.5">
                  <ShoppingCart className="w-3 h-3 mr-1" /> Orders
                </div>
                {searchResults.orders.map((ord: any) => (
                  <Link
                    key={ord.id}
                    href={`/admin/orders?id=${ord.id}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="block px-2 py-1.5 hover:bg-[#FAF8F5] rounded text-xs text-primary transition-colors duration-150"
                  >
                    <span className="font-medium">{ord.customer_name}</span>{' '}
                    <span className="text-[10px] text-secondary font-light">({ord.customer_email})</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Artists section */}
            {searchResults.artists?.length > 0 && (
              <div className="mb-3">
                <div className="text-[9px] uppercase tracking-widest text-accent font-semibold flex items-center mb-1.5">
                  <Users className="w-3 h-3 mr-1" /> Artists
                </div>
                {searchResults.artists.map((artst: any) => (
                  <Link
                    key={artst.id}
                    href={`/admin/artists?id=${artst.id}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="block px-2 py-1.5 hover:bg-[#FAF8F5] rounded text-xs text-primary transition-colors duration-150"
                  >
                    {artst.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Empty check */}
            {(!searchResults.artworks?.length &&
              !searchResults.commissions?.length &&
              !searchResults.orders?.length &&
              !searchResults.artists?.length) && (
              <div className="text-center py-6 text-xs text-secondary/60">
                No matching results found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bell / Notifications dropdown wrapper */}
      <div className="flex items-center space-x-4">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 border border-primary/5 hover:border-primary/10 rounded-sm text-secondary/70 hover:text-primary transition-all duration-200 bg-[#FAF8F5] relative"
          >
            <Bell className="w-4 h-4 stroke-[1.5]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-white text-[9px] font-sans font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown popover */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-primary/10 rounded-sm shadow-xl z-40 font-sans">
              <div className="flex justify-between items-center px-4 py-3 border-b border-primary/5 bg-[#FAF8F5]">
                <span className="text-[10px] text-primary font-medium uppercase tracking-wider">
                  Notifications ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[9px] text-accent uppercase tracking-wider font-semibold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[300px] overflow-y-auto divide-y divide-primary/5">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs transition-colors duration-150 relative ${
                        !n.isRead ? 'bg-accent/5' : 'hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="font-semibold text-primary mb-0.5">{n.title}</div>
                      <p className="text-secondary font-light text-[11px] leading-relaxed mb-1.5">
                        {n.message}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-secondary/40 font-light">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                        {!n.isRead && (
                          <button
                            onClick={() => handleMarkOneRead(n.id)}
                            className="text-[9px] text-accent font-medium hover:underline flex items-center"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" /> Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-secondary/60 text-xs font-light">
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Link
          href="/"
          className="text-[10px] uppercase tracking-widest text-accent font-medium px-3.5 py-1.5 border border-accent/20 hover:bg-accent/5 rounded-sm transition-colors duration-200 font-sans"
        >
          Public Gallery
        </Link>
      </div>
    </header>
  );
}

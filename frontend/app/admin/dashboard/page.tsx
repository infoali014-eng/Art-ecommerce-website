'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import {
  FolderOpen,
  HardDrive,
  HeartHandshake,
  Paintbrush,
  PlusCircle,
  Scroll,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';

import { useToast } from '@/hooks/useToast';
import { AdminRepository } from '@/repositories/admin.repository';
import { DashboardService } from '@/services/dashboard.service';
import { StatisticsService } from '@/services/statistics.service';

import { AdminActivity, DashboardStats } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<{ month: string; sales: number }[]>([]);
  const [categoryShare, setCategoryShare] = useState<{ category: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [sData, aData, trend, share] = await Promise.all([
        DashboardService.getStats(),
        AdminRepository.getAdminActivities(),
        StatisticsService.getMonthlyRevenueTrend(),
        StatisticsService.getCategorySalesShare(),
      ]);
      setStats(sData);
      setActivities(aData.slice(0, 5));
      setRevenueTrend(trend);
      setCategoryShare(share);
    } catch (e) {
      console.error(e);
      addToast('Failed to load dashboard metrics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6 font-sans">
        <div className="h-10 w-48 bg-primary/5 animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white border border-primary/5 rounded-sm animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-white border border-primary/5 rounded-sm animate-pulse lg:col-span-2" />
          <div className="h-96 bg-white border border-primary/5 rounded-sm animate-pulse" />
        </div>
      </div>
    );
  }

  // Format bytes helper
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Find max sales value to scale revenue chart
  const maxSales = Math.max(...revenueTrend.map((t) => t.sales), 1000);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <span className="text-accent text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1">
          MANAGEMENT OVERVIEW
        </span>
        <h1 className="font-cormorant text-3xl md:text-4xl font-light text-primary tracking-wide">
          Curatorial Control Center
        </h1>
        <div className="w-12 h-[1px] bg-accent mt-3" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white border border-primary/5 p-6 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Total Collectors
            </span>
            <span className="text-3xl font-light text-primary">{stats.totalUsers}</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center text-accent">
            <Users className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>

        {/* Total Artworks */}
        <div className="bg-white border border-primary/5 p-6 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Total Masterworks
            </span>
            <span className="text-3xl font-light text-primary">{stats.totalArtworks}</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center text-accent">
            <Paintbrush className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-primary/5 p-6 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Acquisitions
            </span>
            <span className="text-3xl font-light text-primary">{stats.totalOrders}</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center text-accent">
            <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white border border-primary/5 p-6 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="text-2xl font-light text-accent">
              $
              {stats.revenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center text-accent">
            <TrendingUp className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* Main Charts & Feed layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white border border-primary/5 p-6 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)] lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-primary/5 pb-4">
            <h3 className="font-cormorant text-xl text-primary font-medium tracking-wide">
              Revenue Analytics
            </h3>
            <span className="text-[10px] text-secondary/60">Annual trend</span>
          </div>
          <div className="h-64 flex items-end justify-between gap-2.5 pt-6 px-4">
            {revenueTrend.map((t) => {
              const heightPct = Math.max((t.sales / maxSales) * 100, 2);
              return (
                <div
                  key={t.month}
                  className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                >
                  <div className="w-full relative flex justify-center">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-[#1A1816] text-[#E5DCD3] text-[9px] px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md z-10">
                      ${t.sales.toLocaleString()}
                    </div>
                    {/* Visual Bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-accent/20 group-hover:bg-accent rounded-t-[1px] transition-all duration-300 min-h-[4px]"
                    />
                  </div>
                  <span className="text-[10px] text-secondary/70 font-light group-hover:text-primary transition-colors duration-150">
                    {t.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions & Media Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-primary/5 p-6 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-4">
            <h3 className="font-cormorant text-xl text-primary font-medium tracking-wide border-b border-primary/5 pb-4">
              Quick Controls
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/artworks"
                className="flex flex-col items-center justify-center p-4 border border-primary/5 hover:border-accent/40 rounded bg-[#FAF8F5] text-secondary/70 hover:text-accent transition-all duration-200 gap-2 text-center"
              >
                <PlusCircle className="w-5 h-5 stroke-[1.4]" />
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  Add Artwork
                </span>
              </Link>
              <Link
                href="/admin/storage"
                className="flex flex-col items-center justify-center p-4 border border-primary/5 hover:border-accent/40 rounded bg-[#FAF8F5] text-secondary/70 hover:text-accent transition-all duration-200 gap-2 text-center"
              >
                <FolderOpen className="w-5 h-5 stroke-[1.4]" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Storage</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex flex-col items-center justify-center p-4 border border-primary/5 hover:border-accent/40 rounded bg-[#FAF8F5] text-secondary/70 hover:text-accent transition-all duration-200 gap-2 text-center"
              >
                <Settings className="w-5 h-5 stroke-[1.4]" />
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  Site Settings
                </span>
              </Link>
              <Link
                href="/admin/activity"
                className="flex flex-col items-center justify-center p-4 border border-primary/5 hover:border-accent/40 rounded bg-[#FAF8F5] text-secondary/70 hover:text-accent transition-all duration-200 gap-2 text-center"
              >
                <Scroll className="w-5 h-5 stroke-[1.4]" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Audit Log</span>
              </Link>
            </div>
          </div>

          {/* Media Info */}
          <div className="bg-white border border-primary/5 p-6 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Storage Usage
              </span>
              <span className="text-xl font-light text-primary">
                {formatBytes(stats.storageUsage.totalBytes)}
              </span>
              <span className="text-[10px] text-secondary/50 block font-light">
                Across {stats.storageUsage.fileCount} uploaded reference/artwork media files
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center text-accent">
              <HardDrive className="w-5 h-5 stroke-[1.5]" />
            </div>
          </div>
        </div>
      </div>

      {/* Newest Lists Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Commissions */}
        <div className="bg-white border border-primary/5 p-6 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-4">
          <div className="flex justify-between items-center border-b border-primary/5 pb-4">
            <h3 className="font-cormorant text-xl text-primary font-medium tracking-wide">
              Recent Commission Requests
            </h3>
            <Link
              href="/admin/commissions"
              className="text-[9px] text-accent uppercase tracking-wider font-semibold hover:underline"
            >
              Manage all
            </Link>
          </div>
          <div className="divide-y divide-primary/5">
            {stats.latestCommissions.map((comm) => (
              <div key={comm.id} className="py-3 flex justify-between items-center">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-primary">{comm.title}</div>
                  <div className="text-[10px] text-secondary/60 font-light">
                    Budget: ${comm.customerBudget} | Style: {comm.preferredStyle || 'Custom'}
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-accent/10 text-accent font-semibold uppercase tracking-wider">
                  {comm.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Admin Activities */}
        <div className="bg-white border border-primary/5 p-6 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-4">
          <div className="flex justify-between items-center border-b border-primary/5 pb-4">
            <h3 className="font-cormorant text-xl text-primary font-medium tracking-wide">
              Curator Audit Feed
            </h3>
            <Link
              href="/admin/activity"
              className="text-[9px] text-accent uppercase tracking-wider font-semibold hover:underline"
            >
              Full Log
            </Link>
          </div>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className="flex items-start space-x-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-primary font-light">
                      <span className="font-semibold">{act.adminName}</span>{' '}
                      {act.action.toLowerCase()}{' '}
                      <span className="font-medium text-accent">&ldquo;{act.target}&rdquo;</span>
                    </p>
                    <span className="text-[9px] text-secondary/40 font-light">
                      {new Date(act.createdAt).toLocaleTimeString()} —{' '}
                      {new Date(act.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-secondary/60 font-light">
                No activity logged yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

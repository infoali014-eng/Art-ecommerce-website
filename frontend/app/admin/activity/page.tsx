'use client';

import React, { useEffect, useState } from 'react';

import { Scroll, Shield, Terminal } from 'lucide-react';

import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminDrawer from '@/components/admin/AdminDrawer';
import { useToast } from '@/hooks/useToast';
import { AdminRepository } from '@/repositories/admin.repository';

import { AdminActivity } from '@/types';

export default function AdminActivityPage() {
  const { addToast } = useToast();

  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer detail overlay
  const [selectedActivity, setSelectedActivity] = useState<AdminActivity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await AdminRepository.getAdminActivities();
      setActivities(data);
    } catch (e) {
      console.error(e);
      addToast('Failed to load audit activities log.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetail = (act: AdminActivity) => {
    setSelectedActivity(act);
    setIsDrawerOpen(true);
  };

  // Data Table setup
  const columns = [
    {
      key: 'adminName',
      label: 'Administrator',
      sortable: true,
      render: (val: string, row: AdminActivity) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 bg-primary/5 rounded border border-primary/5 flex items-center justify-center text-secondary/60">
            <Shield className="w-3.5 h-3.5 stroke-[1.4]" />
          </div>
          <div>
            <span className="font-semibold text-primary block">{val}</span>
            <span className="text-[9px] text-secondary/40 font-mono block">
              {row.adminId?.slice(0, 8)}...
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Operation Action',
      sortable: true,
      render: (val: string) => (
        <span className="text-[10px] px-2 py-0.5 rounded bg-primary/5 text-secondary uppercase font-semibold">
          {val}
        </span>
      ),
    },
    {
      key: 'target',
      label: 'Target Record',
      sortable: true,
      render: (val: string) => <span className="font-medium text-accent">&ldquo;{val}&rdquo;</span>,
    },
    {
      key: 'createdAt',
      label: 'Timestamp',
      sortable: true,
      render: (val: string) => <span>{new Date(val).toLocaleString()}</span>,
    },
    {
      key: 'actions',
      label: 'Details',
      render: (_: any, row: AdminActivity) => (
        <button
          onClick={() => handleOpenDetail(row)}
          className="px-2.5 py-1.5 border border-primary/5 hover:border-accent hover:text-accent rounded bg-white text-secondary text-xs transition-all duration-150 font-medium"
        >
          View Diffs
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-primary/5 pb-4">
        <span className="text-accent text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1">
          SECURITY LOGS
        </span>
        <h1 className="font-cormorant text-3xl font-light text-primary tracking-wide">
          Curator Audit Activities
        </h1>
      </div>

      {/* Table view */}
      {loading ? (
        <div className="bg-white p-12 border border-primary/5 rounded text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
          <span className="text-xs text-secondary/60 font-light">Loading audit logs...</span>
        </div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={activities}
          searchKey="action"
          searchPlaceholder="Search logs by action name..."
          onRowClick={handleOpenDetail}
        />
      )}

      {/* Detail drawer overlay */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        title="Audit Value Log Details"
        onClose={() => setIsDrawerOpen(false)}
      >
        {selectedActivity && (
          <div className="space-y-6 text-xs text-secondary font-sans">
            <div className="bg-[#FAF8F5] border border-primary/5 p-5 rounded space-y-3">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-0.5">
                  Action Triggered
                </span>
                <div className="font-semibold text-primary text-sm uppercase">
                  {selectedActivity.action}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-primary/5 pt-3">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-0.5">
                    Curator
                  </span>
                  <div className="text-primary">{selectedActivity.adminName}</div>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-0.5">
                    Target Instance
                  </span>
                  <div className="text-primary font-medium">
                    &ldquo;{selectedActivity.target}&rdquo;
                  </div>
                </div>
              </div>
            </div>

            {/* Diffs payload representation */}
            <div className="space-y-4">
              <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block border-b border-primary/5 pb-1">
                Data Diffs Log payload
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Previous Value */}
                <div className="space-y-2">
                  <div className="text-[9px] uppercase tracking-wider text-secondary/50 font-semibold">
                    Previous JSON Value
                  </div>
                  <pre className="bg-[#1A1816] text-[#E5DCD3] p-4 rounded overflow-auto text-[10px] font-mono leading-relaxed h-80 border border-white/5">
                    {selectedActivity.previousValue
                      ? JSON.stringify(selectedActivity.previousValue, null, 2)
                      : '// No previous value recorded'}
                  </pre>
                </div>

                {/* New Value */}
                <div className="space-y-2">
                  <div className="text-[9px] uppercase tracking-wider text-secondary/50 font-semibold">
                    New JSON Value
                  </div>
                  <pre className="bg-[#1A1816] text-[#E5DCD3] p-4 rounded overflow-auto text-[10px] font-mono leading-relaxed h-80 border border-white/5">
                    {selectedActivity.newValue
                      ? JSON.stringify(selectedActivity.newValue, null, 2)
                      : '// No mutations payload recorded'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}

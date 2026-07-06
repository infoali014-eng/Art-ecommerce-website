'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  KeyRound,
  History,
} from 'lucide-react';
import { AdminRepository } from '@/repositories/admin.repository';
import { AdminService } from '@/services/admin.service';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile, Order, Commission } from '@/types';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminDrawer from '@/components/admin/AdminDrawer';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import LoadingButton from '@/components/ui/LoadingButton';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer / Selection
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [userCommissions, setUserCommissions] = useState<Commission[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modal Confirm state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string; action: 'disable' | 'enable' | 'role' } | null>(null);

  // Form Fields
  const [adminRole, setAdminRole] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await AdminRepository.getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
      addToast('Failed to load user directories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetail = async (usr: UserProfile) => {
    setSelectedUser(usr);
    setAdminRole(usr.adminRole || '');
    setIsDrawerOpen(true);

    try {
      const [allOrders, allCommissions] = await Promise.all([
        AdminRepository.getOrders(),
        AdminRepository.getCommissions(),
      ]);
      setUserOrders(allOrders.filter((o) => o.userId === usr.id));
      setUserCommissions(allCommissions.filter((c) => c.userId === usr.id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleRoleClick = (usr: UserProfile) => {
    setConfirmTarget({ id: usr.id, name: usr.fullName, action: 'role' });
    setIsConfirmOpen(true);
  };

  const handleToggleBlockClick = (usr: UserProfile) => {
    const action = usr.deletedAt ? 'enable' : 'disable';
    setConfirmTarget({ id: usr.id, name: usr.fullName, action });
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmTarget || actionLoading) return;

    setActionLoading(true);
    try {
      const adminId = user?.id || null;
      const targetUser = users.find((u) => u.id === confirmTarget.id);

      if (confirmTarget.action === 'role' && targetUser) {
        await AdminService.toggleUserRole(adminId, confirmTarget.id, targetUser.role, confirmTarget.name);
        addToast(`User role updated successfully.`, 'success');
      } else if (confirmTarget.action === 'disable' && targetUser) {
        await AdminService.toggleUserBlock(adminId, confirmTarget.id, false, confirmTarget.name);
        addToast(`User account disabled.`, 'success');
      } else if (confirmTarget.action === 'enable' && targetUser) {
        await AdminService.toggleUserBlock(adminId, confirmTarget.id, true, confirmTarget.name);
        addToast(`User account enabled.`, 'success');
      }

      setIsConfirmOpen(false);
      setConfirmTarget(null);
      setIsDrawerOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Operation failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveAdminRole = async () => {
    if (!selectedUser || actionLoading) return;

    setActionLoading(true);
    try {
      const adminId = user?.id || null;
      await AdminService.updateUserAdminRole(adminId, selectedUser.id, adminRole || null, selectedUser.fullName);
      addToast('Admin RBAC role updated.', 'success');
      setIsDrawerOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to save admin role.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTriggerResetPassword = async () => {
    if (!selectedUser) return;
    try {
      // Supabase reset password email trigger
      const { error } = await AdminRepository.createNotification(
        selectedUser.id,
        'System Account Update',
        'Your security credentials recovery request was triggered by curators. Follow email instructions if you receive them.',
        'general'
      );
      if (error) throw error;
      addToast(`Account notification triggered.`, 'success');
    } catch (e) {
      console.error(e);
      addToast('Failed to trigger notification alert.', 'error');
    }
  };

  // Data Table setup
  const columns = [
    {
      key: 'fullName',
      label: 'User Info',
      sortable: true,
      render: (val: string, row: UserProfile) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center font-cormorant text-accent font-semibold text-xs">
            {val.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-semibold text-primary block">{val}</span>
            <span className="text-[10px] text-secondary/40 font-mono block">{row.id.slice(0, 8)}...</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (val: string, row: UserProfile) => (
        <span
          className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
            val === 'admin'
              ? 'bg-accent/10 text-accent border border-accent/20'
              : 'bg-primary/5 text-secondary border border-primary/5'
          }`}
        >
          {val} {row.adminRole ? `(${row.adminRole})` : ''}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Registered',
      sortable: true,
      render: (val: string) => <span>{new Date(val).toLocaleDateString()}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: any, row: UserProfile) => (
        <span
          className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
            row.deletedAt
              ? 'bg-red-50 text-red-700 border border-red-100'
              : 'bg-green-50 text-green-700 border border-green-100'
          }`}
        >
          {row.deletedAt ? 'Disabled' : 'Active'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_: any, row: UserProfile) => (
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleOpenDetail(row)}
            className="px-2 py-1.5 border border-primary/5 hover:border-accent hover:text-accent rounded bg-white text-secondary text-xs transition-all duration-150 font-medium"
          >
            Manage
          </button>
          <button
            onClick={() => handleToggleBlockClick(row)}
            className={`p-1.5 border rounded bg-white transition-all duration-150 ${
              row.deletedAt ? 'hover:text-green-600 border-green-200 text-green-600' : 'hover:text-red-500 border-primary/5'
            }`}
            title={row.deletedAt ? 'Enable User' : 'Disable User'}
          >
            {row.deletedAt ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-primary/5 pb-4">
        <span className="text-accent text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1">
          USER DIRECTORY
        </span>
        <h1 className="font-cormorant text-3xl font-light text-primary tracking-wide">
          Store Collectors Registry
        </h1>
      </div>

      {/* Table view */}
      {loading ? (
        <div className="bg-white p-12 border border-primary/5 rounded text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
          <span className="text-xs text-secondary/60 font-light">Loading user records...</span>
        </div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={users}
          searchKey="fullName"
          searchPlaceholder="Search collectors by name..."
          onRowClick={handleOpenDetail}
        />
      )}

      {/* Detail drawer workspace */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        title={selectedUser ? `Collector Profile: ${selectedUser.fullName}` : 'User Profile'}
        onClose={() => setIsDrawerOpen(false)}
      >
        {selectedUser && (
          <div className="space-y-8 text-xs text-secondary">
            {/* Summary Details */}
            <div className="bg-[#FAF8F5] border border-primary/5 p-5 rounded space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-0.5">
                    User UUID
                  </span>
                  <div className="font-mono text-primary select-all">{selectedUser.id}</div>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    selectedUser.role === 'admin'
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'bg-primary/5 text-secondary border border-primary/5'
                  }`}
                >
                  {selectedUser.role}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-primary/5 pt-3">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-0.5">
                    Register Date
                  </span>
                  <div className="text-primary">{new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-0.5">
                    Last Update
                  </span>
                  <div className="text-primary">{new Date(selectedUser.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-3 border border-primary/5 p-4 rounded bg-[#FAF8F5]">
              <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                User Security Credentials
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => handleToggleRoleClick(selectedUser)}
                  className="flex items-center space-x-2 px-3.5 py-2 border border-primary/10 hover:border-accent hover:text-accent rounded bg-white font-semibold transition-colors duration-150 text-[10px] uppercase tracking-wider"
                >
                  <Shield className="w-3.5 h-3.5 stroke-[1.4]" />
                  <span>Toggle Admin Status</span>
                </button>
                <button
                  type="button"
                  onClick={handleTriggerResetPassword}
                  className="flex items-center space-x-2 px-3.5 py-2 border border-primary/10 hover:border-accent hover:text-accent rounded bg-white font-semibold transition-colors duration-150 text-[10px] uppercase tracking-wider"
                >
                  <KeyRound className="w-3.5 h-3.5 stroke-[1.4]" />
                  <span>Credential Reset Notification</span>
                </button>
              </div>
            </div>

            {/* Admin RBAC Role editing */}
            {selectedUser.role === 'admin' && (
              <div className="space-y-3 border border-primary/5 p-4 rounded bg-[#FAF8F5]">
                <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                  Assign Administrative Permissions (RBAC)
                </span>
                <div className="flex gap-3">
                  <select
                    value={adminRole}
                    onChange={(e) => setAdminRole(e.target.value)}
                    className="flex-1 bg-white border border-primary/5 px-2.5 py-1.5 focus:outline-none focus:border-accent rounded-sm"
                  >
                    <option value="">No Special RBAC Permissions (General Admin)</option>
                    <option value="super_admin">Super Admin (All operations)</option>
                    <option value="gallery_manager">Gallery Manager (Artwork catalog CRUD)</option>
                    <option value="commission_manager">Commission Manager (Quotes and status)</option>
                    <option value="support">Customer Support (User registry and orders)</option>
                    <option value="content_editor">Content Editor (Banners, metadata, collections)</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleSaveAdminRole}
                    className="px-4 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-sm font-semibold transition-colors duration-150"
                  >
                    Save Permissions
                  </button>
                </div>
              </div>
            )}

            {/* Transactional History lists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Acquisitions history */}
              <div className="space-y-2 border border-primary/5 p-4 rounded bg-[#FAF8F5]">
                <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block border-b border-primary/5 pb-2">
                  Acquisitions History ({userOrders.length})
                </span>
                <div className="divide-y divide-primary/5 max-h-[200px] overflow-y-auto pr-1">
                  {userOrders.length > 0 ? (
                    userOrders.map((ord) => (
                      <div key={ord.id} className="py-2 flex justify-between items-center text-[10px]">
                        <div>
                          <div className="font-semibold text-primary">#{ord.id.slice(0, 8)}</div>
                          <div className="text-secondary/60">{new Date(ord.createdAt).toLocaleDateString()}</div>
                        </div>
                        <span className="font-medium text-accent">${ord.total.toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-secondary/40 font-light">No acquisitions yet</div>
                  )}
                </div>
              </div>

              {/* Commission history */}
              <div className="space-y-2 border border-primary/5 p-4 rounded bg-[#FAF8F5]">
                <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block border-b border-primary/5 pb-2">
                  Custom Commissions ({userCommissions.length})
                </span>
                <div className="divide-y divide-primary/5 max-h-[200px] overflow-y-auto pr-1">
                  {userCommissions.length > 0 ? (
                    userCommissions.map((comm) => (
                      <div key={comm.id} className="py-2 flex justify-between items-center text-[10px]">
                        <div>
                          <div className="font-semibold text-primary">{comm.title}</div>
                          <div className="text-secondary/60">Budget: ${comm.customerBudget}</div>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 bg-primary/5 text-secondary uppercase font-semibold">
                          {comm.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-secondary/40 font-light">No commission records</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>

      {/* Confirmation Modal */}
      <AdminConfirmModal
        isOpen={isConfirmOpen}
        title={
          confirmTarget?.action === 'role'
            ? 'Toggle Administrative Role?'
            : confirmTarget?.action === 'disable'
            ? 'Disable User Account?'
            : 'Enable User Account?'
        }
        message={
          confirmTarget?.action === 'role'
            ? `Are you sure you want to alter the administrator authorization for "${confirmTarget?.name}"?`
            : confirmTarget?.action === 'disable'
            ? `Are you sure you want to disable "${confirmTarget?.name}"'s account? They will lose store login privileges.`
            : `Are you sure you want to enable "${confirmTarget?.name}"'s account?`
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setIsConfirmOpen(false)}
        variant={confirmTarget?.action === 'disable' ? 'danger' : 'primary'}
      />
    </div>
  );
}

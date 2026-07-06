/* eslint-disable */
'use client';

import React, { useEffect, useState } from 'react';
import {
  HeartHandshake,
  DollarSign,
  User,
  Calendar,
  AlertCircle,
  FileText,
  Send,
  UserCheck,
  Eye,
} from 'lucide-react';
import { AdminRepository } from '@/repositories/admin.repository';
import { AdminService } from '@/services/admin.service';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { Commission, Artist, UserProfile } from '@/types';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminDrawer from '@/components/admin/AdminDrawer';
import LoadingButton from '@/components/ui/LoadingButton';

export default function AdminCommissionsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer / Selection
  const [selectedComm, setSelectedComm] = useState<Commission | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Quick Action form inputs
  const [assignedArtistId, setAssignedArtistId] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [quotationNotes, setQuotationNotes] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [statusVal, setStatusVal] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [commList, artList, profList] = await Promise.all([
        AdminRepository.getCommissions(),
        AdminRepository.getArtists(),
        AdminRepository.getUsers(),
      ]);
      setCommissions(commList);
      setArtists(artList);
      setProfiles(profList);
    } catch (e) {
      console.error(e);
      addToast('Failed to load commissions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetail = (comm: Commission) => {
    setSelectedComm(comm);
    setAssignedArtistId(comm.assignedArtistId || '');
    setInternalNotes(comm.internalNotes || '');
    setQuotedPrice(comm.quotedPrice ? String(comm.quotedPrice) : '');
    setQuotationNotes(comm.quotationNotes || '');
    setStatusVal(comm.status);
    setUpdateMessage('');
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComm || actionLoading) return;

    setActionLoading(true);
    try {
      const adminId = user?.id || null;
      await AdminService.updateCommissionStatus(
        adminId,
        selectedComm.id,
        statusVal,
        selectedComm.status,
        updateMessage || 'Status updated by curators.'
      );

      // Create notification for collector
      await AdminRepository.createNotification(
        selectedComm.userId,
        `Commission Request Update`,
        `Your request "${selectedComm.title}" status has changed from ${selectedComm.status} to ${statusVal}.`,
        'commission'
      );

      addToast('Commission status updated successfully.', 'success');
      setIsDrawerOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to update status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignArtist = async () => {
    if (!selectedComm || actionLoading) return;
    setActionLoading(true);
    try {
      const adminId = user?.id || null;
      const artist = artists.find((a) => a.id === assignedArtistId);
      const artistName = artist ? artist.name : 'None';

      await AdminService.assignArtistToCommission(
        adminId,
        selectedComm.id,
        assignedArtistId || null,
        artistName
      );

      addToast(`Artist assignment updated.`, 'success');
      setIsDrawerOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to assign artist.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateNotes = async () => {
    if (!selectedComm || actionLoading) return;
    setActionLoading(true);
    try {
      const adminId = user?.id || null;
      await AdminRepository.updateCommissionInternalNotes(selectedComm.id, internalNotes);
      await AdminService.log(adminId, 'Commission Notes Updated', `Commission ${selectedComm.id}`);
      addToast('Internal notes updated.', 'success');
      setIsDrawerOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to save notes.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComm || !quotedPrice || actionLoading) return;

    setActionLoading(true);
    try {
      const adminId = user?.id || null;
      await AdminService.sendCommissionQuote(
        adminId,
        selectedComm.id,
        Number(quotedPrice),
        quotationNotes
      );

      // Create notification for collector
      await AdminRepository.createNotification(
        selectedComm.userId,
        `Art Quotation Received`,
        `Curators have sent a price quote of $${Number(quotedPrice).toLocaleString()} for your custom commission request.`,
        'commission'
      );

      addToast('Price quotation dispatched to collector.', 'success');
      setIsDrawerOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to send quote.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper selectors
  const getCustomerName = (uid: string) => {
    const prof = profiles.find((p) => p.id === uid);
    return prof ? prof.fullName : 'Anonymous';
  };

  // Data Table column declarations
  const columns = [
    {
      key: 'title',
      label: 'Request',
      sortable: true,
      render: (val: string, row: Commission) => (
        <div>
          <span className="font-semibold text-primary block">{val}</span>
          <span className="text-[10px] text-secondary/50 block font-light">Type: {row.artworkType}</span>
        </div>
      ),
    },
    {
      key: 'userId',
      label: 'Collector',
      render: (val: string) => <span>{getCustomerName(val)}</span>,
    },
    {
      key: 'customerBudget',
      label: 'Budget',
      sortable: true,
      render: (val: number) => <span className="font-medium text-accent">${val.toLocaleString()}</span>,
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (val: string) => (
        <span
          className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
            val === 'high'
              ? 'bg-red-50 text-red-700'
              : val === 'medium'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val: string) => (
        <span className="text-[9px] px-2 py-0.5 rounded bg-primary/5 text-secondary uppercase font-semibold">
          {val}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Submitted',
      sortable: true,
      render: (val: string) => <span>{new Date(val).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_: any, row: Commission) => (
        <button
          onClick={() => handleOpenDetail(row)}
          className="px-2.5 py-1.5 border border-primary/5 hover:border-accent hover:text-accent rounded bg-white text-secondary text-xs transition-all duration-150"
        >
          View Workspace
        </button>
      ),
    },
  ];

  const tableFilters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Submitted', value: 'Submitted' },
        { label: 'Under Review', value: 'Under Review' },
        { label: 'Quotation Sent', value: 'Quotation Sent' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Rejected', value: 'Rejected' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      options: [
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' },
      ],
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-primary/5 pb-4">
        <span className="text-accent text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1">
          CURATION PIPELINE
        </span>
        <h1 className="font-cormorant text-3xl font-light text-primary tracking-wide">
          Custom Commissions Workspace
        </h1>
      </div>

      {/* Table view */}
      {loading ? (
        <div className="bg-white p-12 border border-primary/5 rounded text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
          <span className="text-xs text-secondary/60 font-light">Loading commissions board...</span>
        </div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={commissions}
          searchKey="title"
          searchPlaceholder="Search by commission request title..."
          filters={tableFilters}
          onRowClick={handleOpenDetail}
        />
      )}

      {/* Drawer detailed view */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        title={selectedComm ? `Commission: ${selectedComm.title}` : 'Workspace'}
        onClose={() => setIsDrawerOpen(false)}
      >
        {selectedComm && (
          <div className="space-y-8 text-xs text-secondary">
            {/* Primary Details Card */}
            <div className="bg-[#FAF8F5] border border-primary/5 p-5 rounded space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-0.5">
                    Collector
                  </span>
                  <div className="font-semibold text-primary">{getCustomerName(selectedComm.userId)}</div>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-0.5">
                    Request Date
                  </span>
                  <div className="text-primary">{new Date(selectedComm.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-0.5">
                    Customer Budget
                  </span>
                  <div className="text-accent font-semibold">${selectedComm.customerBudget}</div>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-0.5">
                    Quoted Final Price
                  </span>
                  <div className="text-primary font-semibold">
                    {selectedComm.quotedPrice ? `$${selectedComm.quotedPrice}` : 'Not Quoted Yet'}
                  </div>
                </div>
              </div>

              <div className="border-t border-primary/5 pt-3">
                <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-1">
                  Curation Specifications
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-secondary/60">Type:</span> {selectedComm.artworkType}
                  </div>
                  <div>
                    <span className="text-[10px] text-secondary/60">Size:</span>{' '}
                    {selectedComm.width && selectedComm.height
                      ? `${selectedComm.width}x${selectedComm.height} ${selectedComm.sizeUnit}`
                      : 'Not Specified'}
                  </div>
                  <div>
                    <span className="text-[10px] text-secondary/60">Style:</span>{' '}
                    {selectedComm.preferredStyle || 'Custom'}
                  </div>
                  <div>
                    <span className="text-[10px] text-secondary/60">Frame:</span> {selectedComm.frameOption}
                  </div>
                </div>
              </div>

              <div className="border-t border-primary/5 pt-3">
                <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-1">
                  Collector Request Description
                </span>
                <p className="text-[11px] leading-relaxed font-light font-sans text-primary">
                  {selectedComm.description}
                </p>
              </div>
            </div>

            {/* Reference Images */}
            {selectedComm.referenceImages && selectedComm.referenceImages.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                  Reference Images ({selectedComm.referenceImages.length})
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {selectedComm.referenceImages.map((img) => (
                    <a
                      key={img.id}
                      href={img.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square border border-primary/5 bg-[#FAF8F5] rounded overflow-hidden hover:opacity-90 transition-opacity relative group block"
                    >
                      <img src={img.imageUrl} alt="Reference" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline updates */}
            {selectedComm.updates && selectedComm.updates.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                  Curation Status Timeline Log
                </span>
                <div className="border-l border-accent/20 pl-4 space-y-4 font-sans">
                  {selectedComm.updates.map((upd) => (
                    <div key={upd.id} className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-white shadow-sm" />
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-semibold text-primary">
                          Changed to: <span className="text-accent">{upd.newStatus}</span>
                        </div>
                        <p className="text-[10px] font-light text-secondary/80 italic leading-relaxed">
                          &ldquo;{upd.message}&rdquo;
                        </p>
                        <span className="text-[9px] text-secondary/40 font-light">
                          {new Date(upd.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CURATOR CONTROLS TABS */}
            <div className="border-t border-primary/5 pt-6 space-y-6">
              <h3 className="font-cormorant text-xl text-primary font-medium tracking-wide border-b border-primary/5 pb-2">
                Curator Response Workspace
              </h3>

              {/* Status Update Form */}
              <form onSubmit={handleUpdateStatus} className="space-y-3 border border-primary/5 p-4 rounded bg-[#FAF8F5]">
                <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                  Status Pipeline Update
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value)}
                    className="w-full bg-white border border-primary/5 px-2.5 py-1.5 focus:outline-none focus:border-accent rounded-sm"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Preview Ready">Preview Ready</option>
                    <option value="Revision Requested">Revision Requested</option>
                    <option value="Final Review">Final Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Enter status update details message..."
                    value={updateMessage}
                    onChange={(e) => setUpdateMessage(e.target.value)}
                    className="w-full bg-white border border-primary/5 px-3 py-1.5 focus:outline-none focus:border-accent rounded-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <LoadingButton type="submit" variant="primary" loading={actionLoading}>
                    Apply Pipeline Status
                  </LoadingButton>
                </div>
              </form>

              {/* Send Quote Form */}
              {selectedComm.status === 'Under Review' && (
                <form onSubmit={handleSendQuote} className="space-y-3 border border-accent/20 p-4 rounded bg-accent/5">
                  <span className="text-[10px] text-accent font-semibold uppercase tracking-wider block">
                    Prepare Curation Price Quote
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                      <input
                        type="number"
                        required
                        placeholder="Quoted Price ($)"
                        value={quotedPrice}
                        onChange={(e) => setQuotedPrice(e.target.value)}
                        className="w-full bg-white border border-primary/5 pl-9 pr-3 py-1.5 focus:outline-none focus:border-accent rounded-sm"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Pricing quotation terms details note..."
                      value={quotationNotes}
                      onChange={(e) => setQuotationNotes(e.target.value)}
                      className="w-full bg-white border border-primary/5 px-3 py-1.5 focus:outline-none focus:border-accent rounded-sm sm:col-span-2"
                    />
                  </div>
                  <div className="flex justify-end">
                    <LoadingButton type="submit" variant="primary" loading={actionLoading}>
                      Dispatch Quotation Quote
                    </LoadingButton>
                  </div>
                </form>
              )}

              {/* Artist Assignment Form */}
              <div className="space-y-3 border border-primary/5 p-4 rounded bg-[#FAF8F5]">
                <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                  Assign Studio Artist
                </span>
                <div className="flex gap-3">
                  <select
                    value={assignedArtistId}
                    onChange={(e) => setAssignedArtistId(e.target.value)}
                    className="flex-1 bg-white border border-primary/5 px-2.5 py-1.5 focus:outline-none focus:border-accent rounded-sm"
                  >
                    <option value="">No Artist Assigned</option>
                    {artists.map((art) => (
                      <option key={art.id} value={art.id}>
                        {art.name} ({art.mediums.join(', ')})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAssignArtist}
                    className="px-4 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-sm font-semibold transition-colors duration-150"
                  >
                    Assign Artist
                  </button>
                </div>
              </div>

              {/* Internal Notes Form */}
              <div className="space-y-3 border border-primary/5 p-4 rounded bg-[#FAF8F5]">
                <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                  Internal Curatorial Notes (Admin eyes only)
                </span>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Save private internal details about this order..."
                  className="w-full bg-white border border-primary/5 px-3 py-2 focus:outline-none focus:border-accent rounded-sm resize-none font-sans"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleUpdateNotes}
                    className="px-4 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-sm font-semibold transition-colors duration-150"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}

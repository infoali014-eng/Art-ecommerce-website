'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  CreditCard,
  ExternalLink,
  Eye,
  Info,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import LoadingButton from '@/components/ui/LoadingButton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { PaymentRepository } from '@/repositories/payment.repository';
import { AdminService } from '@/services/admin.service';

export default function AdminPaymentsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox / Image Zoom modal state
  const [activeZoomUrl, setActiveZoomUrl] = useState<string | null>(null);

  // Action input states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState<Record<string, string>>({});
  const [showRejectForm, setShowRejectForm] = useState<Record<string, boolean>>({});

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await PaymentRepository.getPendingPayments();
      setSubmissions(data);
    } catch (e: any) {
      console.error(e);
      addToast('Failed to load pending payment submissions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleApprove = async (submission: any) => {
    const adminId = user?.id || '';
    if (!adminId) {
      addToast('Admin session expired. Please relogin.', 'error');
      return;
    }

    setActionLoading(submission.order_id);
    try {
      // 1. Verify payment in database
      await PaymentRepository.verifyPayment(
        submission.order_id,
        adminId,
        'Payment verified successfully by admin.'
      );

      // 2. Create admin activity log
      await AdminService.log(
        adminId,
        'Payment Verified',
        `Order ${submission.order_id}`,
        { status: 'Payment Submitted' },
        { status: 'Verified', orderStatus: 'Processing' }
      );

      addToast('Payment approved successfully!', 'success');
      loadSubmissions();
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Verification failed.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (submission: any) => {
    const adminId = user?.id || '';
    const reason = rejectionNotes[submission.order_id]?.trim() || '';

    if (!adminId) {
      addToast('Admin session expired. Please relogin.', 'error');
      return;
    }

    if (!reason) {
      addToast('Please enter a rejection reason.', 'error');
      return;
    }

    setActionLoading(submission.order_id);
    try {
      // 1. Reject payment in database
      await PaymentRepository.rejectPayment(submission.order_id, adminId, reason);

      // 2. Create admin activity log
      await AdminService.log(
        adminId,
        'Payment Rejected',
        `Order ${submission.order_id}`,
        { status: 'Payment Submitted' },
        { status: 'Rejected', notes: reason }
      );

      addToast('Payment rejected and feedback stored.', 'info');
      // Clear states
      const updatedNotes = { ...rejectionNotes };
      delete updatedNotes[submission.order_id];
      setRejectionNotes(updatedNotes);

      const updatedShow = { ...showRejectForm };
      delete updatedShow[submission.order_id];
      setShowRejectForm(updatedShow);

      loadSubmissions();
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Rejection failed.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(val * 280);
  };

  if (loading) {
    return (
      <div className="bg-white p-12 border border-primary/5 rounded text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
        <span className="text-xs text-secondary/60 font-light font-sans">
          Loading pending payments...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-primary/5 pb-4">
        <span className="text-accent text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1">
          FINANCIAL OPERATIONS
        </span>
        <h1 className="font-cormorant text-3xl font-light text-primary tracking-wide">
          Payment Verification Desk
        </h1>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white border border-primary/5 p-12 text-center rounded-sm max-w-2xl mx-auto flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Check className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h2 className="font-cormorant text-xl font-light text-primary mb-2">
            No Pending Payments
          </h2>
          <p className="text-xs text-secondary font-light max-w-xs leading-relaxed">
            All submitted checkout payments are fully processed and approved. Excellent job!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => {
            const order = sub.orders;
            const items = order?.order_items || [];
            const isRejectOpen = !!showRejectForm[sub.order_id];

            return (
              <div
                key={sub.id}
                className="bg-white border border-primary/5 rounded-sm shadow-sm p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left: Screenshot preview */}
                <div className="lg:col-span-3 space-y-3">
                  <span className="text-secondary/60 uppercase tracking-wider text-[9px] font-semibold block">
                    Proof Screenshot
                  </span>
                  {sub.payment_screenshot ? (
                    <div
                      onClick={() => setActiveZoomUrl(sub.payment_screenshot)}
                      className="relative aspect-[3/4] w-full border border-primary/5 bg-background overflow-hidden cursor-zoom-in group rounded"
                    >
                      <Image
                        src={sub.payment_screenshot}
                        alt="Payment Proof"
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-300">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[3/4] w-full bg-[#FAF8F5] border border-primary/5 flex items-center justify-center text-secondary/30 text-xs">
                      No screenshot
                    </div>
                  )}
                  <span className="text-[10px] text-secondary font-light text-center block">
                    Click image to expand / view details
                  </span>
                </div>

                {/* Center: Details */}
                <div className="lg:col-span-6 space-y-4 text-xs font-sans">
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-100 text-amber-800 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded">
                      {sub.payment_method}
                    </span>
                    <span className="text-[10px] text-secondary">
                      Submitted:{' '}
                      {new Date(sub.submitted_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Customer details */}
                  <div className="space-y-1.5 p-3.5 border border-primary/5 bg-[#FAF8F5] rounded">
                    <h4 className="font-semibold text-primary text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-accent" />
                      <span>Customer Details</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-secondary pt-1.5">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-primary">Name:</span>
                        <span>{order?.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-secondary/60" />
                        <span>{order?.customer_email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-secondary/60" />
                        <span>{order?.customer_phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-secondary/60" />
                        <span>{order?.shipping_city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Artwork summary */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary text-[10px] uppercase tracking-wider">
                      Acquired Artwork Items
                    </h4>
                    {items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between border-b border-primary/5 pb-1"
                      >
                        <span className="text-secondary font-medium">
                          {item.title} (
                          {item.frame_option === 'none' ? 'No Frame' : item.frame_option})
                        </span>
                        <span className="text-primary font-semibold">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-primary text-sm pt-2">
                      <span>Total Verified Amount:</span>
                      <span className="text-accent">{formatCurrency(sub.amount)}</span>
                    </div>
                  </div>

                  {/* Transaction info */}
                  <div className="p-3 border border-primary/5 rounded space-y-1 bg-white">
                    <span className="text-secondary/60 block uppercase tracking-wider text-[9px]">
                      Transaction Reference ID
                    </span>
                    <span className="font-mono text-primary text-sm font-semibold select-all block">
                      {sub.payment_reference}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="lg:col-span-3 space-y-4">
                  <span className="text-secondary/60 uppercase tracking-wider text-[9px] font-semibold block">
                    Verification Controls
                  </span>

                  <div className="flex flex-col gap-3">
                    <LoadingButton
                      onClick={() => handleApprove(sub)}
                      variant="primary"
                      fullWidth
                      loading={actionLoading === sub.order_id}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve Payment
                    </LoadingButton>

                    <button
                      type="button"
                      onClick={() => {
                        setShowRejectForm({
                          ...showRejectForm,
                          [sub.order_id]: !isRejectOpen,
                        });
                      }}
                      className="w-full inline-flex items-center justify-center bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 transition-colors py-2 text-xs font-semibold cursor-pointer rounded-sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject Payment
                    </button>
                  </div>

                  {/* Rejection slide-down form */}
                  <AnimatePresence>
                    {isRejectOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-3 pt-3 border-t border-primary/5 overflow-hidden"
                      >
                        <div className="space-y-1">
                          <label className="text-[9px] text-red-800 font-semibold uppercase tracking-wider block">
                            Rejection Reason *
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Explain why the payment cannot be verified (e.g. ID mismatch, screenshot blurry)..."
                            value={rejectionNotes[sub.order_id] || ''}
                            onChange={(e) =>
                              setRejectionNotes({
                                ...rejectionNotes,
                                [sub.order_id]: e.target.value,
                              })
                            }
                            className="w-full bg-red-50/30 border border-red-100 px-3 py-2 text-xs focus:outline-none focus:border-red-400 rounded-sm font-sans resize-none"
                          />
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                          disabled={actionLoading === sub.order_id}
                          onClick={() => handleReject(sub)}
                        >
                          Confirm Rejection
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox / Zoom Portal */}
      <AnimatePresence>
        {activeZoomUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveZoomUrl(null)}
            className="fixed inset-0 bg-primary/95 z-[9999] flex items-center justify-center p-6 cursor-zoom-out"
          >
            <div className="relative w-full max-w-4xl h-full max-h-[85vh]">
              <Image src={activeZoomUrl} alt="Enlarged Proof" fill className="object-contain" />
            </div>
            <button
              onClick={() => setActiveZoomUrl(null)}
              className="absolute top-6 right-6 text-white hover:text-accent p-2 cursor-pointer bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

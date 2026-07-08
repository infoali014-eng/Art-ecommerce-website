'use client';

import React, { useEffect, useRef, useState } from 'react';

import { DollarSign, Mail, MapPin, Phone, Printer, ShoppingCart, Truck } from 'lucide-react';

import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminDrawer from '@/components/admin/AdminDrawer';
import LoadingButton from '@/components/ui/LoadingButton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { AdminRepository } from '@/repositories/admin.repository';
import { AdminService } from '@/services/admin.service';

import { Order } from '@/types';

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer / Selection
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Quick Action form inputs
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Invoice Print Ref
  const invoiceRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await AdminRepository.getOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
      addToast('Failed to load order acquisitions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetail = (ord: Order) => {
    setSelectedOrder(ord);
    setOrderStatus(ord.status);
    setPaymentStatus(ord.paymentStatus);
    setTrackingNumber(ord.trackingNumber || '');
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || actionLoading) return;

    setActionLoading(true);
    try {
      const adminId = user?.id || null;
      await AdminService.updateOrderStatus(adminId, selectedOrder.id, orderStatus, trackingNumber);

      // Create notification for collector
      if (selectedOrder.userId) {
        await AdminRepository.createNotification(
          selectedOrder.userId,
          `Order Acquisition Update`,
          `Your order #${selectedOrder.id.slice(0, 8)} status has changed to ${orderStatus}. ${
            trackingNumber ? `Tracking number: ${trackingNumber}` : ''
          }`,
          'order'
        );
      }

      addToast('Order fulfillment status updated.', 'success');
      setIsDrawerOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to update order status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedOrder || actionLoading) return;

    setActionLoading(true);
    try {
      const adminId = user?.id || null;
      await AdminService.updateOrderPaymentStatus(adminId, selectedOrder.id, paymentStatus);
      addToast('Order payment status updated.', 'success');
      setIsDrawerOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to update payment status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrintInvoice = () => {
    const printContent = invoiceRef.current?.innerHTML;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    const originalTitle = document.title;

    document.title = `Invoice-${selectedOrder?.id.slice(0, 8)}`;
    document.body.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; color: #1a1816; max-width: 800px; margin: 0 auto;">
        ${printContent}
      </div>
    `;

    window.print();
    document.body.innerHTML = originalContent;
    document.title = originalTitle;
    window.location.reload(); // Reload to restore React state cleanly
  };

  // Data Table setup
  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      render: (val: string) => <span className="font-mono font-semibold">{val.slice(0, 8)}</span>,
    },
    { key: 'customerName', label: 'Collector', sortable: true },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-accent">${val.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      label: 'Fulfillment',
      sortable: true,
      render: (val: string) => (
        <span
          className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
            val === 'Delivered'
              ? 'bg-green-50 text-green-700 border border-green-100'
              : val === 'Cancelled'
                ? 'bg-red-50 text-red-700 border border-red-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      sortable: true,
      render: (val: string) => (
        <span
          className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
            val === 'Paid'
              ? 'bg-green-50 text-green-700 border border-green-100'
              : val === 'Refunded'
                ? 'bg-red-50 text-red-700 border border-red-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (val: string) => <span>{new Date(val).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_: any, row: Order) => (
        <button
          onClick={() => handleOpenDetail(row)}
          className="px-2.5 py-1.5 border border-primary/5 hover:border-accent hover:text-accent rounded bg-white text-secondary text-xs transition-all duration-150"
        >
          Fulfillment
        </button>
      ),
    },
  ];

  const tableFilters = [
    {
      key: 'status',
      label: 'Fulfillment',
      options: [
        { label: 'Pending', value: 'Pending' },
        { label: 'Processing', value: 'Processing' },
        { label: 'Shipped', value: 'Shipped' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'Cancelled', value: 'Cancelled' },
      ],
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      options: [
        { label: 'Unpaid', value: 'Unpaid' },
        { label: 'Paid', value: 'Paid' },
        { label: 'Refunded', value: 'Refunded' },
      ],
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-primary/5 pb-4">
        <span className="text-accent text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1">
          FULFILLMENT CENTER
        </span>
        <h1 className="font-cormorant text-3xl font-light text-primary tracking-wide">
          Store Orders & Shipments
        </h1>
      </div>

      {/* Table view */}
      {loading ? (
        <div className="bg-white p-12 border border-primary/5 rounded text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
          <span className="text-xs text-secondary/60 font-light">Loading logistics catalog...</span>
        </div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={orders}
          searchKey="customerName"
          searchPlaceholder="Search by collector name..."
          filters={tableFilters}
          onRowClick={handleOpenDetail}
        />
      )}

      {/* Drawer detailed view */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        title={selectedOrder ? `Order Fulfillment: #${selectedOrder.id.slice(0, 8)}` : 'Workspace'}
        onClose={() => setIsDrawerOpen(false)}
      >
        {selectedOrder && (
          <div className="space-y-8 text-xs text-secondary">
            {/* Print Action */}
            <div className="flex justify-end border-b border-primary/5 pb-4">
              <button
                type="button"
                onClick={handlePrintInvoice}
                className="flex items-center space-x-2 text-[10px] uppercase tracking-wider text-accent font-semibold px-3 py-1.5 border border-accent/20 hover:bg-accent/5 rounded"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-[#FAF8F5] border border-primary/5 p-5 rounded space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-0.5">
                    Acquisition Owner
                  </span>
                  <div className="font-semibold text-primary">{selectedOrder.customerName}</div>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-secondary/50 block mb-0.5">
                    Order Date
                  </span>
                  <div className="text-primary">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-primary/5 pt-3">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-secondary/50 block">
                    Contact Credentials
                  </span>
                  <div className="flex items-center space-x-2 text-primary">
                    <Mail className="w-3.5 h-3.5 stroke-[1.4] text-secondary/40" />
                    <span>{selectedOrder.customerEmail}</span>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div className="flex items-center space-x-2 text-primary pt-0.5">
                      <Phone className="w-3.5 h-3.5 stroke-[1.4] text-secondary/40" />
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-secondary/50 block">
                    Shipping Logistics Address
                  </span>
                  <div className="flex items-start space-x-2 text-primary">
                    <MapPin className="w-3.5 h-3.5 stroke-[1.4] text-secondary/40 shrink-0 mt-0.5" />
                    <div>
                      <div>{selectedOrder.shippingAddress}</div>
                      <div>
                        {selectedOrder.shippingCity}, {selectedOrder.shippingState || ''}{' '}
                        {selectedOrder.shippingZip}
                      </div>
                      <div className="font-semibold uppercase tracking-wider text-[9px] text-accent mt-0.5">
                        {selectedOrder.shippingCountry}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-2">
              <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Acquired Items ({selectedOrder.items?.length || 0})
              </span>
              <div className="border border-primary/5 rounded divide-y divide-primary/5 overflow-hidden">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="p-3 bg-white flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-primary">{item.title}</div>
                      <div className="text-[10px] text-secondary/60">
                        Frame: {item.frameOption} | Qty: {item.quantity}
                      </div>
                    </div>
                    <span className="font-semibold text-accent">
                      ${item.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial summary */}
            <div className="bg-[#FAF8F5] border border-primary/5 p-4 rounded space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Discount</span>
                  <span>-${selectedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Courier Logistics</span>
                <span>${selectedOrder.shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-primary/5 pt-2 font-semibold text-primary">
                <span>Total Amount Paid</span>
                <span className="text-accent">${selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* CURATOR CONTROLS */}
            <div className="border-t border-primary/5 pt-6 space-y-6">
              <h3 className="font-cormorant text-xl text-primary font-medium tracking-wide border-b border-primary/5 pb-2">
                Logistics Control Desk
              </h3>

              {/* Status Update Form */}
              <form
                onSubmit={handleUpdateStatus}
                className="space-y-3 border border-primary/5 p-4 rounded bg-[#FAF8F5]"
              >
                <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                  Logistics Shipping Status
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full bg-white border border-primary/5 px-2.5 py-1.5 focus:outline-none focus:border-accent rounded-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                    <input
                      type="text"
                      placeholder="Tracking Number..."
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full bg-white border border-primary/5 pl-9 pr-3 py-1.5 focus:outline-none focus:border-accent rounded-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <LoadingButton type="submit" variant="primary" loading={actionLoading}>
                    Apply Logistics Status
                  </LoadingButton>
                </div>
              </form>

              {/* Payment update */}
              <div className="space-y-3 border border-primary/5 p-4 rounded bg-[#FAF8F5]">
                <span className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                  Payment Settlement Status
                </span>
                <div className="flex gap-3">
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="flex-1 bg-white border border-primary/5 px-2.5 py-1.5 focus:outline-none focus:border-accent rounded-sm"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleUpdatePaymentStatus}
                    className="px-4 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-sm font-semibold transition-colors duration-150"
                  >
                    Apply Payment
                  </button>
                </div>
              </div>
            </div>

            {/* Hidden Printable Invoice Segment */}
            <div className="hidden">
              <div ref={invoiceRef} className="space-y-8 font-sans">
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b-[2px] border-primary pb-6">
                  <div>
                    <h1 className="text-3xl font-light font-cormorant tracking-wide text-primary">
                      MANAN ART GALLERY
                    </h1>
                    <span className="text-[10px] text-accent uppercase tracking-widest block mt-0.5">
                      Bespoke Masterwork Acquisitions Receipt
                    </span>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-semibold text-primary">Invoice Number</div>
                    <div className="font-mono text-secondary mb-1">
                      #INV-{selectedOrder.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div className="text-secondary/60">
                      Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Billing details */}
                <div className="grid grid-cols-2 gap-8 text-xs">
                  <div>
                    <h4 className="font-semibold text-[10px] uppercase tracking-wider text-secondary mb-2">
                      Acquirer Details
                    </h4>
                    <div className="text-primary font-medium">{selectedOrder.customerName}</div>
                    <div className="text-secondary">{selectedOrder.customerEmail}</div>
                    {selectedOrder.customerPhone && (
                      <div className="text-secondary">{selectedOrder.customerPhone}</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[10px] uppercase tracking-wider text-secondary mb-2">
                      Courier Shipping Destination
                    </h4>
                    <div className="text-secondary">
                      <div>{selectedOrder.shippingAddress}</div>
                      <div>
                        {selectedOrder.shippingCity}, {selectedOrder.shippingState || ''}{' '}
                        {selectedOrder.shippingZip}
                      </div>
                      <div className="font-semibold text-primary">
                        {selectedOrder.shippingCountry}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border border-primary rounded overflow-hidden">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-[#FAF8F5] border-b border-primary">
                        <th className="p-3 font-semibold uppercase text-[9px] tracking-wider">
                          Item Name
                        </th>
                        <th className="p-3 font-semibold uppercase text-[9px] tracking-wider">
                          Details
                        </th>
                        <th className="p-3 font-semibold uppercase text-[9px] tracking-wider text-right">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                      {selectedOrder.items?.map((item) => (
                        <tr key={item.id}>
                          <td className="p-3 font-semibold text-primary">{item.title}</td>
                          <td className="p-3 text-secondary">
                            Frame: {item.frameOption} | Qty: {item.quantity}
                          </td>
                          <td className="p-3 text-right font-medium text-accent">
                            ${item.price.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total box */}
                <div className="w-64 ml-auto space-y-2 border-t-[2px] border-primary pt-4 text-xs">
                  <div className="flex justify-between text-secondary">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${selectedOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-secondary">
                    <span>Logistics</span>
                    <span>${selectedOrder.shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-primary border-t border-primary/5 pt-2 text-sm">
                    <span>Total Paid</span>
                    <span className="text-accent">${selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="border-t border-primary/5 pt-8 text-center text-[10px] text-secondary/40 leading-relaxed font-light">
                  Manan Art Gallery &copy; {new Date().getFullYear()} — Thank you for your support.
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}

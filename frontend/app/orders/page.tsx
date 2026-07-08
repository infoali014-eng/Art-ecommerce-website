'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Truck,
} from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const TIMELINE_STEPS = [
  { label: 'Pending Payment', icon: Clock },
  { label: 'Payment Submitted', icon: CreditCard },
  { label: 'Payment Verified', icon: CheckCircle2 },
  { label: 'Preparing Artwork', icon: ShoppingBag },
  { label: 'Shipped', icon: Truck },
  { label: 'Delivered', icon: MapPin },
];

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { addToast } = useToast();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (e: any) {
      console.error(e);
      addToast('Failed to load order history.', 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const getActiveStep = (orderStatus: string, paymentStatus: string) => {
    // Mapping DB statuses to timeline steps indices:
    // 0: Pending Payment
    // 1: Payment Submitted / Rejected
    // 2: Payment Verified
    // 3: Preparing / Processing
    // 4: Shipped
    // 5: Delivered

    if (paymentStatus === 'Rejected') return 1;
    if (orderStatus === 'Delivered') return 5;
    if (orderStatus === 'Shipped') return 4;
    if (orderStatus === 'Processing' || orderStatus === 'Preparing') return 3;
    if (paymentStatus === 'Verified') return 2;
    if (paymentStatus === 'Payment Submitted' || paymentStatus === 'Submitted') return 1;
    return 0; // Pending Payment
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <PageWrapper className="pt-24 bg-[#FAF8F5]">
          <Section className="py-24 text-center">
            <Container className="max-w-md mx-auto flex flex-col items-center">
              <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-secondary text-xs font-light font-sans">
                Checking session state...
              </p>
            </Container>
          </Section>
        </PageWrapper>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <PageWrapper className="pt-24 bg-[#FAF8F5]">
          <Section className="py-24">
            <Container className="max-w-xl mx-auto">
              <div className="border border-primary/5 bg-white p-8 md:p-12 text-center rounded-sm shadow-sm">
                <ShoppingBag className="w-12 h-12 text-accent mx-auto mb-6 stroke-[1.2]" />
                <h2 className="font-cormorant text-3xl font-light text-primary mb-4">
                  Access Acquisitions History
                </h2>
                <p className="font-sans text-xs text-secondary font-light max-w-sm mx-auto mb-8 leading-relaxed">
                  Please log into your collector account to view your artwork purchases, track
                  delivery status, and verify payment timelines.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => router.push('/login?redirectTo=/orders')}
                >
                  Login to Continue &rarr;
                </Button>
              </div>
            </Container>
          </Section>
        </PageWrapper>
        <Footer />
      </>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(val * 280);
  };

  return (
    <>
      <Navbar />
      <Breadcrumbs customLabels={{ orders: 'Acquisitions History' }} />

      <PageWrapper className="pt-8 bg-[#FAF8F5] font-sans">
        <Section padding="none" className="pb-24">
          <Container>
            {/* Header */}
            <div className="mb-12">
              <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium block mb-2">
                COLLECTOR PORTAL
              </span>
              <h1 className="font-cormorant text-4xl md:text-5xl font-light text-primary tracking-wide">
                Your Acquisitions
              </h1>
              <div className="w-12 h-[1px] bg-accent mt-4" />
            </div>

            {loadingOrders ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-xs text-secondary/60 font-light">
                  Retrieving acquisitions...
                </span>
              </div>
            ) : orders.length === 0 ? (
              <div className="border border-primary/5 bg-white py-20 px-6 text-center max-w-2xl mx-auto flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border border-primary/5 bg-[#FAF7F2] flex items-center justify-center text-secondary/40 mb-6">
                  <ShoppingBag className="w-6 h-6 stroke-[1.2]" />
                </div>
                <h3 className="font-cormorant text-2xl font-light text-primary mb-3">
                  No Orders Yet
                </h3>
                <p className="font-sans text-xs text-secondary font-light max-w-xs mb-8 leading-relaxed">
                  You have not acquired any masterworks yet. Discover original paintings,
                  calligraphy, and sketches in our catalog.
                </p>
                <Link href="/gallery">
                  <Button variant="primary" size="sm">
                    Explore Fine Gallery
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-10">
                {orders.map((order) => {
                  const activeStep = getActiveStep(order.status, order.payment_status);
                  const isRejected = order.payment_status === 'Rejected';

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-primary/5 rounded-sm shadow-sm overflow-hidden"
                    >
                      {/* Order Metadata Strip */}
                      <div className="bg-[#FAF8F5] border-b border-primary/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                        <div className="flex flex-wrap gap-x-8 gap-y-2">
                          <div>
                            <span className="text-secondary/60 block uppercase tracking-wider text-[9px]">
                              Date Placed
                            </span>
                            <span className="font-medium text-primary">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div>
                            <span className="text-secondary/60 block uppercase tracking-wider text-[9px]">
                              Total Amount
                            </span>
                            <span className="font-semibold text-accent">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                          <div>
                            <span className="text-secondary/60 block uppercase tracking-wider text-[9px]">
                              Order ID
                            </span>
                            <span className="font-mono text-primary">{order.id}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase tracking-wider font-semibold">
                            Payment Status:
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                              isRejected
                                ? 'bg-red-50 text-red-700 border border-red-100'
                                : order.payment_status === 'Verified'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                      </div>

                      {/* Main Info */}
                      <div className="p-6 md:p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                          {/* Left: Product Info */}
                          <div className="md:col-span-4 space-y-4">
                            <h3 className="font-cormorant text-xl font-light text-primary pb-2 border-b border-primary/5">
                              Acquired Masterwork
                            </h3>
                            {order.order_items?.map((item: any) => (
                              <div key={item.id} className="flex gap-4">
                                <div className="font-sans text-xs space-y-1">
                                  <span className="font-semibold text-primary block text-sm">
                                    {item.title}
                                  </span>
                                  <span className="text-secondary block">
                                    Frame Style:{' '}
                                    <strong className="text-primary font-medium">
                                      {item.frame_option === 'none'
                                        ? 'No Frame'
                                        : item.frame_option}
                                    </strong>
                                  </span>
                                  <span className="text-secondary block">
                                    Qty: {item.quantity} | Price: {formatCurrency(item.price)}
                                  </span>
                                </div>
                              </div>
                            ))}

                            {/* Shipping address info */}
                            <div className="pt-4 text-xs space-y-1 font-sans text-secondary">
                              <span className="font-semibold text-primary block uppercase tracking-wider text-[9px] mb-1">
                                Shipping Details
                              </span>
                              <span className="block font-medium text-primary">
                                {order.customer_name}
                              </span>
                              <span className="block">{order.shipping_address}</span>
                              <span className="block">
                                {order.shipping_city}, {order.shipping_state} - {order.shipping_zip}
                              </span>
                              <span className="block">Phone: {order.customer_phone}</span>
                            </div>
                          </div>

                          {/* Right: Payment submission info */}
                          <div className="md:col-span-8 space-y-4">
                            <h3 className="font-cormorant text-xl font-light text-primary pb-2 border-b border-primary/5">
                              Payment Submission Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                              <div className="space-y-2">
                                <div>
                                  <span className="text-secondary/60 block uppercase tracking-wider text-[9px]">
                                    Payment Method
                                  </span>
                                  <span className="font-medium text-primary">
                                    {order.payment_method}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-secondary/60 block uppercase tracking-wider text-[9px]">
                                    Transaction Reference ID
                                  </span>
                                  <span className="font-mono text-primary font-semibold">
                                    {order.payment_reference || 'N/A'}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <span className="text-secondary/60 block uppercase tracking-wider text-[9px] mb-1">
                                  Uploaded Receipt Proof
                                </span>
                                {order.payment_screenshot ? (
                                  <a
                                    href={order.payment_screenshot}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-accent border border-accent/20 px-3 py-1.5 hover:bg-accent hover:text-primary transition-all rounded-sm font-semibold"
                                  >
                                    <span>View Screenshot</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                ) : (
                                  <span className="text-secondary font-light">
                                    No proof uploaded
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Rejected Notice Alert */}
                            {isRejected && (
                              <div className="bg-red-50 border border-red-100 p-4 rounded flex items-start gap-3 mt-4">
                                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <div className="text-xs font-sans">
                                  <span className="font-semibold text-red-800 block">
                                    Payment Verification Rejected
                                  </span>
                                  <p className="text-red-700 mt-1">
                                    <strong>Curator Notes: </strong>
                                    {order.payment_notes ||
                                      'Your transaction screenshot could not be matched. Please double check the ID and contact support.'}
                                  </p>
                                  <a
                                    href="https://wa.me/923252538104"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-red-800 font-semibold underline mt-3 hover:text-primary"
                                  >
                                    <MessageCircle className="w-4 h-4 fill-red-800 text-white" />
                                    <span>Contact Owner on WhatsApp</span>
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Timeline Progress Tracker */}
                        <div className="pt-6 border-t border-primary/5">
                          <span className="text-[10px] text-secondary/60 uppercase tracking-wider font-semibold block mb-8 font-sans">
                            Acquisition Status Timeline
                          </span>

                          {/* Animated Progress Steps */}
                          <div className="relative">
                            {/* Connector Line */}
                            <div className="absolute top-4 left-4 right-4 sm:left-10 sm:right-10 h-0.5 bg-primary/5 -z-10">
                              <motion.div
                                className="h-full bg-accent"
                                initial={{ width: '0%' }}
                                animate={{
                                  width: `${(activeStep / (TIMELINE_STEPS.length - 1)) * 100}%`,
                                }}
                                transition={{ duration: 1, ease: 'easeInOut' }}
                              />
                            </div>

                            {/* Dots Grid */}
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-8 gap-x-2 relative z-10">
                              {TIMELINE_STEPS.map((step, idx) => {
                                const StepIcon = step.icon;
                                const isCompleted = idx < activeStep;
                                const isActive = idx === activeStep;
                                const isUpcoming = idx > activeStep;

                                return (
                                  <div
                                    key={step.label}
                                    className="flex flex-col items-center text-center space-y-2.5"
                                  >
                                    <motion.div
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ delay: idx * 0.15 }}
                                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                                        isCompleted
                                          ? 'bg-accent border-accent text-primary'
                                          : isActive
                                            ? 'bg-white border-accent text-accent shadow-md shadow-accent/15'
                                            : 'bg-white border-primary/5 text-secondary/40'
                                      }`}
                                    >
                                      {isActive ? (
                                        <motion.div
                                          animate={{ scale: [1, 1.1, 1] }}
                                          transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                          <StepIcon className="w-4 h-4 stroke-[2]" />
                                        </motion.div>
                                      ) : (
                                        <StepIcon className="w-4 h-4 stroke-[1.5]" />
                                      )}
                                    </motion.div>
                                    <span
                                      className={`text-[9px] uppercase tracking-wider font-medium max-w-[80px] leading-tight ${
                                        isCompleted || isActive
                                          ? 'text-primary font-semibold'
                                          : 'text-secondary/40'
                                      }`}
                                    >
                                      {step.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}

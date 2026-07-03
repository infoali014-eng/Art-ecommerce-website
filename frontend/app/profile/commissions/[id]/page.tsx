'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';
import { ArrowLeft, Clock, DollarSign, Eye } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { CommissionService } from '@/services/commission.service';

import { Commission } from '@/types';

export default function CommissionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { user, loading } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const [commission, setCommission] = useState<Commission | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchDetails = async () => {
      try {
        setDetailsLoading(true);
        const data = await CommissionService.getCommissionDetails(resolvedParams.id);
        if (!data || data.userId !== user.id) {
          addToast('Commission request not found.', 'error');
          router.push('/profile/commissions');
          return;
        }
        setCommission(data);
      } catch (e) {
        console.error(e);
        addToast('Failed to load commission details.', 'error');
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchDetails();
  }, [user, loading, resolvedParams.id, addToast, router]);

  // Happy-path milestones for vertical timeline progress
  const milestones = [
    'Submitted',
    'Under Review',
    'Quotation Sent',
    'Approved',
    'In Progress',
    'Preview Ready',
    'Completed',
  ];

  // Helper to determine milestone status
  const getMilestoneIndex = (status: string) => {
    if (status === 'Draft') return -1;
    if (status === 'Rejected' || status === 'Cancelled') return -1;
    if (status === 'Waiting For Approval') return 2;
    if (status === 'Revision Requested') return 4;
    if (status === 'Final Review') return 5;
    if (status === 'Delivered') return 6;
    return milestones.indexOf(status);
  };

  const currentMilestoneIdx = commission ? getMilestoneIndex(commission.status) : -1;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Quotation Sent':
      case 'Waiting For Approval':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Approved':
      case 'Completed':
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-accent/5 text-accent border-accent/10';
    }
  };

  if (loading || detailsLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center font-sans text-xs text-secondary">
          Loading tracker details...
        </div>
        <Footer />
      </>
    );
  }

  if (!commission) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Breadcrumbs
        customLabels={{
          profile: 'Your Account',
          commissions: 'Commissions',
          [resolvedParams.id]: commission.title || 'Inquiry Details',
        }}
      />

      <PageWrapper className="pt-8 font-sans">
        <Section padding="none" className="pb-24">
          <Container>
            {/* Header / Back Link */}
            <div className="mb-12 space-y-4">
              <Link
                href="/profile/commissions"
                className="inline-flex items-center text-xs text-secondary/80 hover:text-accent font-medium tracking-wider uppercase transition-colors duration-300 animate-fade-in"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                <span>Back to commissions</span>
              </Link>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-accent text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1 animate-slide-up">
                    BESPOKE INQUIRY TRACKER
                  </span>
                  <h1 className="font-cormorant text-3xl sm:text-4xl font-light text-primary tracking-wide">
                    {commission.title}
                  </h1>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1 border rounded-xs ${getStatusBadgeStyle(
                      commission.status
                    )}`}
                  >
                    {commission.status}
                  </span>
                </div>
              </div>
              <div className="w-12 h-[1px] bg-accent mt-4" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Left Column: Vertical Timeline */}
              <div className="bg-white border border-primary/5 p-8 space-y-8 shadow-xs">
                <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide border-b border-primary/5 pb-3">
                  Curation Progress
                </h3>

                {/* Vertical Timeline container */}
                <div className="relative pl-8 space-y-8 text-xs font-sans">
                  {/* Timeline path line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-primary/5 z-0" />
                  {currentMilestoneIdx >= 0 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: `${(currentMilestoneIdx / (milestones.length - 1)) * 100}%`,
                      }}
                      transition={{ duration: 1, ease: 'easeInOut' }}
                      className="absolute left-[15px] top-2 w-[1px] bg-accent z-0 origin-top"
                    />
                  )}

                  {milestones.map((m, idx) => {
                    const isCompleted = idx < currentMilestoneIdx;
                    const isActive = idx === currentMilestoneIdx;
                    const isPending = idx > currentMilestoneIdx;

                    return (
                      <div key={m} className="relative flex items-start gap-4">
                        {/* Node marker */}
                        <div className="absolute left-[-25px] top-1 z-10 flex items-center justify-center">
                          {isCompleted ? (
                            <motion.div
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              className="w-4 h-4 rounded-full bg-accent flex items-center justify-center text-white"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </motion.div>
                          ) : isActive ? (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="w-4 h-4 rounded-full bg-accent border-2 border-white ring-2 ring-accent/30 flex items-center justify-center"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-white border border-primary/10" />
                          )}
                        </div>

                        {/* Title & Details */}
                        <div className="space-y-0.5">
                          <span
                            className={`font-semibold uppercase tracking-wider block text-[10px] ${
                              isActive
                                ? 'text-accent'
                                : isPending
                                  ? 'text-secondary/50'
                                  : 'text-primary'
                            }`}
                          >
                            {m}
                          </span>
                          <span className="text-[10px] text-secondary/60 font-light block">
                            {m === 'Submitted' && 'Inquiry recorded successfully.'}
                            {m === 'Under Review' && 'Curators matching with artists.'}
                            {m === 'Quotation Sent' && 'Negotiated pricing submitted.'}
                            {m === 'Approved' && 'Draft approved & signed off.'}
                            {m === 'In Progress' && 'Artwork creation underway.'}
                            {m === 'Preview Ready' && 'High-res image proof ready.'}
                            {m === 'Completed' && 'Professionally crated & dispatched.'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Specs & Attachments */}
              <div className="lg:col-span-2 space-y-8">
                {/* Specifications Grid */}
                <div className="bg-white border border-primary/5 p-8 space-y-6 shadow-xs">
                  <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide border-b border-primary/5 pb-3">
                    Specifications
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-xs font-sans text-secondary">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-primary block mb-1">
                        Artwork Type
                      </span>
                      <span className="font-light">{commission.artworkType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-primary block mb-1">
                        Dimensions (W x H)
                      </span>
                      <span className="font-light">
                        {commission.width} x {commission.height} {commission.sizeUnit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-primary block mb-1">
                        Orientation
                      </span>
                      <span className="font-light uppercase">{commission.orientation}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-primary block mb-1">
                        Preferred Style
                      </span>
                      <span className="font-light">
                        {commission.preferredStyle || 'Curation matched'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-primary block mb-1">
                        Purpose
                      </span>
                      <span className="font-light">{commission.artworkPurpose || 'Decor'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-primary block mb-1">
                        Framing Selection
                      </span>
                      <span className="font-light">{commission.frameOption || 'Unframed'}</span>
                    </div>
                    {commission.preferredColors && commission.preferredColors.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-[10px] uppercase font-semibold text-primary block mb-1">
                          Colors requested
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {commission.preferredColors.map((color) => (
                            <span
                              key={color}
                              className="px-2 py-0.5 border border-primary/5 bg-[#FAF7F2] text-[10px] font-medium"
                            >
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing / Timeline Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pricing Details */}
                  <div className="bg-white border border-primary/5 p-8 space-y-4 shadow-xs">
                    <h4 className="font-cormorant text-xl font-light text-primary tracking-wide flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-accent stroke-[1.2]" />
                      <span>Negotiated Value</span>
                    </h4>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-primary/5 pb-2">
                        <span className="text-secondary/70 font-light">Your Budget:</span>
                        <span className="font-semibold text-primary">
                          ${commission.customerBudget}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-secondary/70 font-light">Quoted Price:</span>
                        <span className="font-semibold text-accent text-sm">
                          {commission.quotedPrice
                            ? `$${commission.quotedPrice}`
                            : 'Awaiting curation review'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Completion Estimate */}
                  <div className="bg-white border border-primary/5 p-8 space-y-4 shadow-xs">
                    <h4 className="font-cormorant text-xl font-light text-primary tracking-wide flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent stroke-[1.2]" />
                      <span>Timeline Estimates</span>
                    </h4>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-primary/5 pb-2">
                        <span className="text-secondary/70 font-light">Target Curation:</span>
                        <span className="font-semibold text-primary">
                          {commission.deadline
                            ? new Date(commission.deadline).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-secondary/70 font-light">Estimated Delivery:</span>
                        <span className="font-semibold text-accent">
                          {commission.estimatedCompletion
                            ? new Date(commission.estimatedCompletion).toLocaleDateString()
                            : 'Awaiting curation review'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reference Images */}
                {commission.referenceImages && commission.referenceImages.length > 0 && (
                  <div className="bg-white border border-primary/5 p-8 space-y-6 shadow-xs">
                    <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide border-b border-primary/5 pb-3">
                      Reference Attachments
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {commission.referenceImages.map((img) => (
                        <div
                          key={img.id}
                          className="relative aspect-square border border-primary/5 bg-[#FAF7F2] overflow-hidden group rounded-xs"
                        >
                          <img
                            src={img.imageUrl}
                            alt="Reference"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-primary/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <a
                              href={img.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-white rounded-full p-2 text-secondary hover:text-accent shadow-sm"
                              title="Open image"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Log Updates History */}
                {commission.updates && commission.updates.length > 0 && (
                  <div className="bg-white border border-primary/5 p-8 space-y-6 shadow-xs">
                    <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide border-b border-primary/5 pb-3">
                      History Log
                    </h3>
                    <div className="space-y-4 text-xs font-sans text-secondary">
                      {commission.updates.map((update) => (
                        <div
                          key={update.id}
                          className="border-b border-primary/5 pb-4 last:border-b-0 last:pb-0 space-y-1.5 animate-slide-up"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {update.oldStatus && (
                                <>
                                  <span className="text-[10px] font-semibold text-secondary/40 line-through">
                                    {update.oldStatus}
                                  </span>
                                  <span className="text-secondary/40">→</span>
                                </>
                              )}
                              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                                {update.newStatus}
                              </span>
                            </div>
                            <span className="text-[10px] text-secondary/50 font-light">
                              {new Date(update.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {update.message && (
                            <p className="font-light leading-relaxed text-secondary/90 italic">
                              &ldquo;{update.message}&rdquo;
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}

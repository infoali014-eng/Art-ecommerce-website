'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowRight, Calendar, DollarSign, Layers, Palette } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { CommissionService } from '@/services/commission.service';

import { Commission } from '@/types';

export default function CommissionsListPage() {
  const { user, loading } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchCommissions = async () => {
      try {
        setListLoading(true);
        const data = await CommissionService.getUserCommissions(user.id);
        setCommissions(data);
      } catch (e) {
        console.error('Failed to load commissions:', e);
        addToast('Failed to load your commission inquiries.', 'error');
      } finally {
        setListLoading(false);
      }
    };

    fetchCommissions();
  }, [user, loading, addToast, router]);

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

  if (loading || listLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center font-sans text-xs text-secondary">
          Loading commission list...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Breadcrumbs customLabels={{ profile: 'Your Account', commissions: 'Commissions' }} />

      <PageWrapper className="pt-8 font-sans">
        <Section padding="none" className="pb-24">
          <Container>
            {/* Header */}
            <div className="mb-12">
              <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium block mb-2">
                COLLECTOR DASHBOARD
              </span>
              <h1 className="font-cormorant text-4xl md:text-5xl font-light text-primary tracking-wide">
                Your Commissions
              </h1>
              <div className="w-12 h-[1px] bg-accent mt-4" />
            </div>

            {commissions.length === 0 ? (
              <div className="max-w-md mx-auto text-center border border-primary/5 p-12 bg-white space-y-6">
                <Layers className="w-12 h-12 text-secondary/40 mx-auto stroke-[1.2]" />
                <div className="space-y-2">
                  <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide">
                    No Commissions Logged
                  </h3>
                  <p className="text-xs text-secondary font-light leading-relaxed">
                    You have not submitted any bespoke custom artwork inquiries yet. Start one of
                    our curation inquiries to co-create with master artists.
                  </p>
                </div>
                <div className="pt-4">
                  <Button variant="primary" onClick={() => router.push('/custom-order')}>
                    Create Commission Request
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
                {commissions.map((c) => {
                  const hasThumbnail = c.referenceImages && c.referenceImages.length > 0;
                  const thumbUrl = hasThumbnail ? c.referenceImages![0].imageUrl : null;

                  return (
                    <div
                      key={c.id}
                      className="bg-white border border-primary/5 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                    >
                      {/* Image Thumbnail / Category Icon */}
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-[#FAF7F2] border border-primary/5 rounded-xs overflow-hidden shrink-0 flex items-center justify-center">
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt="commission thumbnail"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Palette className="w-6 h-6 text-accent/50 stroke-[1.2]" />
                          )}
                        </div>

                        {/* Title and details */}
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-cormorant text-2xl font-light text-primary tracking-wide">
                              {c.title || 'Untitled Commission Draft'}
                            </span>
                            <span
                              className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 border rounded-xs ${getStatusBadgeStyle(
                                c.status
                              )}`}
                            >
                              {c.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary font-light">
                            <div className="flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-secondary/60" />
                              <span>{c.artworkType}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-secondary/60" />
                              <span>Requested: {new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-secondary/60" />
                              <span>Budget: ${c.customerBudget}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action trigger */}
                      <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2 items-stretch shrink-0">
                        {c.status === 'Draft' ? (
                          <Link href="/custom-order" className="w-full">
                            <Button variant="outline" size="sm" fullWidth>
                              Resume Draft
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/profile/commissions/${c.id}`} className="w-full">
                            <Button variant="primary" size="sm" className="group" fullWidth>
                              <span>Curation Tracker</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 ml-1.5" />
                            </Button>
                          </Link>
                        )}
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

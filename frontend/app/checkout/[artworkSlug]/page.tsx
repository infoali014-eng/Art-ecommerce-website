import React from 'react';

import { notFound } from 'next/navigation';

import { PageWrapper } from '@/components/layout/PageWrapper';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { AdminRepository } from '@/repositories/admin.repository';
import { ArtworkService } from '@/services/artwork.service';

import { CheckoutFormClient } from './CheckoutFormClient';

interface PageProps {
  params: Promise<{ artworkSlug: string }>;
  searchParams: Promise<{ frame?: string }>;
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const { artworkSlug } = await params;
  const { frame } = await searchParams;

  const artwork = await ArtworkService.getArtworkBySlug(artworkSlug);

  if (!artwork || artwork.availability === 'sold') {
    notFound();
  }

  // Load payment settings dynamically from database
  const settings = await AdminRepository.getSiteSettings();

  return (
    <>
      <Navbar />
      <Breadcrumbs
        customLabels={{
          checkout: 'Checkout',
          [artworkSlug]: artwork.title,
        }}
      />
      <PageWrapper className="pt-8 bg-[#FAF8F5]">
        <CheckoutFormClient artwork={artwork} selectedFrame={frame || 'none'} settings={settings} />
      </PageWrapper>
      <Footer />
    </>
  );
}

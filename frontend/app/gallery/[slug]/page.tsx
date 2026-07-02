import React from 'react';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageWrapper } from '@/components/layout/PageWrapper';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ArtworkService } from '@/services/artwork.service';

import { ArtworkDetailClient } from './ArtworkDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await ArtworkService.getArtworkBySlug(slug);

  if (!artwork) {
    return {
      title: 'Artwork Not Found',
    };
  }

  return {
    title: `${artwork.title} | ${artwork.artist} | AURA Art Gallery`,
    description: artwork.description,
    openGraph: {
      title: `${artwork.title} | ${artwork.artist}`,
      description: artwork.description,
      images: [{ url: artwork.images[0] }],
    },
  };
}

// Generate static routes at build time for optimization
export async function generateStaticParams() {
  const artworks = await ArtworkService.getAllArtworks();
  return artworks.map((art) => ({
    slug: art.slug,
  }));
}

export default async function ArtworkPage({ params }: PageProps) {
  const { slug } = await params;
  const artwork = await ArtworkService.getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  const artist = artwork.artistId ? await ArtworkService.getArtistById(artwork.artistId) : null;
  const related = await ArtworkService.getRelatedArtworks(slug, 4);

  return (
    <>
      <Navbar />
      <Breadcrumbs customLabels={{ gallery: 'Gallery', [slug]: artwork.title }} />
      <PageWrapper className="pt-8">
        <ArtworkDetailClient artwork={artwork} artist={artist} relatedArtworks={related} />
      </PageWrapper>
      <Footer />
    </>
  );
}

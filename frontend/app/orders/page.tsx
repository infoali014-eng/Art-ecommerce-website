'use client';

import React from 'react';

import Link from 'next/link';

import { ShoppingBag } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';

export default function OrdersPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs customLabels={{ orders: 'Acquisitions History' }} />

      <PageWrapper className="pt-8 font-sans">
        <Section padding="none" className="pb-24">
          <Container>
            {/* Header */}
            <div className="mb-12">
              <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium block mb-2">
                COLLECTOR HISTORY
              </span>
              <h1 className="font-cormorant text-4xl md:text-5xl font-light text-primary tracking-wide">
                Your Acquisitions
              </h1>
              <div className="w-12 h-[1px] bg-accent mt-4" />
            </div>

            {/* Empty Acquisitions View */}
            <div className="border border-primary/5 bg-white py-20 px-6 text-center max-w-2xl mx-auto flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-primary/5 bg-[#FAF7F2] flex items-center justify-center text-secondary/40 mb-6">
                <ShoppingBag className="w-6 h-6 stroke-[1.2]" />
              </div>
              <h3 className="font-cormorant text-2xl font-light text-primary mb-3">
                No Orders Yet
              </h3>
              <p className="font-sans text-xs text-secondary font-light max-w-xs mb-8 leading-relaxed">
                You have not acquired any masterworks yet. Discover original paintings, calligraphy,
                and sketches in our catalog.
              </p>
              <Link href="/gallery">
                <Button variant="primary" size="sm">
                  Explore Fine Gallery
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}

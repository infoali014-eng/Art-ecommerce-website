import React from 'react';

import Link from 'next/link';

import { ArrowRight, CheckCircle, Clock } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import { Button } from '@/components/ui/Button';

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24 bg-[#FAF8F5]">
        <Section padding="lg">
          <Container className="max-w-xl mx-auto">
            <div className="border border-primary/5 bg-white p-8 md:p-12 text-center rounded-sm shadow-sm space-y-6">
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto stroke-[1.2]" />

              <div className="space-y-2">
                <span className="text-emerald-600 text-[10px] uppercase tracking-[0.2em] font-semibold block">
                  Acquisition Request Submitted
                </span>
                <h1 className="font-cormorant text-4xl font-light text-primary tracking-wide">
                  Order Placed Successfully
                </h1>
              </div>

              <div className="w-12 h-[1px] bg-accent mx-auto" />

              <p className="font-sans text-xs text-secondary font-light max-w-sm mx-auto leading-relaxed">
                Your payment screenshot has been uploaded. Our gallery curators are now verifying
                the transaction details.
              </p>

              {/* Time check banner */}
              <div className="bg-[#FAF8F5] border border-primary/5 p-4 rounded flex items-center justify-center gap-3 max-w-sm mx-auto">
                <Clock className="w-5 h-5 text-accent shrink-0" />
                <div className="text-left text-xs font-sans">
                  <span className="font-semibold text-primary block">Verification Timeline</span>
                  <span className="text-[10px] text-secondary font-light">
                    Usually completed within 15–60 minutes.
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/orders">
                  <Button variant="primary" size="md">
                    View Acquisitions History
                  </Button>
                </Link>
                <Link href="/gallery">
                  <Button variant="secondary" size="md">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}

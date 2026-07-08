import React from 'react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24 font-sans text-primary">
        <Section padding="lg">
          <Container className="max-w-3xl">
            <h1 className="font-cormorant text-4xl font-light tracking-wide mb-8">
              Terms & Conditions
            </h1>
            <div className="space-y-6 text-sm text-secondary font-light leading-relaxed">
              <p>
                Welcome to Manan Art Gallery! These terms and conditions outline the rules and
                regulations for the use of Manan Art Gallery&apos;s Website, located at Daska,
                Punjab, Pakistan.
              </p>
              <p>
                By accessing this website, we assume you accept these terms and conditions. Do not
                continue to use Manan Art Gallery if you do not agree to take all of the terms and
                conditions stated on this page.
              </p>
              <h2 className="font-cormorant text-2xl font-normal text-primary mt-8 mb-4">
                Art Acquisition and Shipping
              </h2>
              <p>
                All artworks listed are original creations or authenticated custom commission
                pieces. Ownership of the artwork is transferred upon successful receipt of payment
                verification and shipment delivery.
              </p>
              <p>
                Shipping schedules are estimates based on standard delivery timelines within
                Pakistan. Any delays caused by local shipping couriers are beyond our direct
                control, but we will coordinate with you to resolve delivery issues.
              </p>
              <h2 className="font-cormorant text-2xl font-normal text-primary mt-8 mb-4">
                Payment Verification
              </h2>
              <p>
                Orders made via EasyPaisa or Bank Transfer require the user to submit an authentic
                transaction reference and screenshot proof. Manan Art Gallery reserves the right to
                hold, reject, or cancel any orders where the payment cannot be fully verified.
              </p>
              <h2 className="font-cormorant text-2xl font-normal text-primary mt-8 mb-4">
                Intellectual Property
              </h2>
              <p>
                Unless otherwise stated, Manan Art Gallery and/or its licensors own the intellectual
                property rights for all material on Manan Art Gallery. All intellectual property
                rights are reserved. You must not republish, sell, rent, sub-license, reproduce,
                duplicate, or copy material from our gallery.
              </p>
            </div>
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}

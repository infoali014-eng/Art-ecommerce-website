import React from 'react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24 font-sans text-primary">
        <Section padding="lg">
          <Container className="max-w-3xl">
            <h1 className="font-cormorant text-4xl font-light tracking-wide mb-8">
              Privacy Policy
            </h1>
            <div className="space-y-6 text-sm text-secondary font-light leading-relaxed">
              <p>
                At Manan Art Gallery, accessible from Daska, Pakistan, one of our main priorities is
                the privacy of our visitors. This Privacy Policy document contains types of
                information that is collected and recorded by Manan Art Gallery and how we use it.
              </p>
              <h2 className="font-cormorant text-2xl font-normal text-primary mt-8 mb-4">
                Consent
              </h2>
              <p>
                By using our website, you hereby consent to our Privacy Policy and agree to its
                terms.
              </p>
              <h2 className="font-cormorant text-2xl font-normal text-primary mt-8 mb-4">
                Information We Collect
              </h2>
              <p>
                The personal information that you are asked to provide, and the reasons why you are
                asked to provide it, will be made clear to you at the point we ask you to provide
                your personal information.
              </p>
              <p>
                If you contact us directly, we may receive additional information about you such as
                your name, email address, phone number, the contents of the message and/or
                attachments you may send us, and any other information you may choose to provide.
              </p>
              <p>
                When you place a custom order or purchase an artwork, we request shipping
                information including your name, email address, shipping address, and phone number
                to fulfill the delivery.
              </p>
              <h2 className="font-cormorant text-2xl font-normal text-primary mt-8 mb-4">
                How We Use Your Information
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Process your orders and manage shipping details</li>
                <li>Send you emails regarding order status, newsletters, or support updates</li>
              </ul>
            </div>
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}

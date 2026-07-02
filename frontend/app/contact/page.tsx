'use client';

import React, { useState } from 'react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';

export default function ContactPage() {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24">
        <Section padding="lg">
          <Container>
            <span className="text-accent font-sans text-xs uppercase tracking-[0.2em] font-medium block mb-4 text-center">
              CURATOR INQUIRIES
            </span>
            <h1 className="font-cormorant text-4xl sm:text-5xl font-light text-center tracking-wide mb-12">
              Connect With Us
            </h1>
            <div className="w-12 h-[1px] bg-accent mx-auto mb-16" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
              {/* Contact Information */}
              <div className="space-y-10">
                <div>
                  <h3 className="font-cormorant text-2xl font-light text-primary mb-4 tracking-wide">
                    The Gallery
                  </h3>
                  <p className="font-sans text-sm text-secondary font-light leading-relaxed tracking-wide">
                    Located in the heart of the arts district, AURA Gallery provides a peaceful sanctuary to view masterworks in person. Private tours can be scheduled through our curator office.
                  </p>
                </div>

                <div className="space-y-4 font-sans text-xs text-secondary tracking-wider uppercase font-medium">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-accent mb-1">Address</span>
                    <span className="text-primary font-normal">{siteConfig.contact.address}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-accent mb-1">Email</span>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:text-accent font-normal transition-colors cursor-pointer">
                      {siteConfig.contact.email}
                    </a>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-accent mb-1">Phone</span>
                    <span className="text-primary font-normal">{siteConfig.contact.phone}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-accent mb-1">Hours</span>
                    <span className="text-primary font-normal">{siteConfig.contact.hours}</span>
                  </div>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="bg-white border border-primary/5 p-8 shadow-xs">
                {success ? (
                  <div className="bg-emerald-50/50 text-emerald-800 p-8 border border-emerald-100 text-xs font-sans text-center uppercase tracking-wider h-full flex items-center justify-center">
                    Thank you. Your message has been sent to our curator team.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="font-cormorant text-xl font-light text-primary mb-2 tracking-wide">
                      Submit a Message
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="First Name" placeholder="Jane" required />
                      <Input label="Last Name" placeholder="Doe" required />
                    </div>
                    <Input label="Email Address" type="email" placeholder="jane@example.com" required />
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-secondary mb-1.5 font-medium font-sans">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Detail your inquiry here..."
                        required
                        className="w-full bg-white border border-primary/10 px-4 py-3 text-sm font-sans focus:outline-none focus:border-accent transition-colors duration-300 resize-none"
                      />
                    </div>
                    <Button variant="primary" size="md" type="submit" fullWidth>
                      Send Message
                    </Button>
                  </form>
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

'use client';

import React, { useState } from 'react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';

export default function CustomOrderPage() {
  const [medium, setMedium] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [success, setSuccess] = useState(false);

  const mediums = [
    { label: 'Oil Painting', value: 'oil' },
    { label: 'Acrylic / Mixed Media', value: 'acrylic' },
    { label: 'Sumi Ink Calligraphy', value: 'calligraphy' },
    { label: 'Graphite / Charcoal Sketch', value: 'sketch' },
  ];

  const sizes = [
    { label: 'Small (11" x 14" or 12" x 16")', value: 'small' },
    { label: 'Medium (16" x 20" or 18" x 24")', value: 'medium' },
    { label: 'Large (24" x 36" or 30" x 40")', value: 'large' },
    { label: 'Oversized (36" x 48" or custom)', value: 'oversized' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setMedium('');
      setDimensions('');
    }, 4000);
  };

  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24">
        <Section padding="lg">
          <Container>
            <span className="text-accent font-sans text-xs uppercase tracking-[0.2em] font-medium block mb-4 text-center">
              COMMISSION PIPELINE
            </span>
            <h1 className="font-cormorant text-4xl sm:text-5xl font-light text-center tracking-wide mb-12">
              Custom Artwork Commission
            </h1>
            <div className="w-12 h-[1px] bg-accent mx-auto mb-16" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
              {/* Process Description */}
              <div className="space-y-8 pr-4">
                <div>
                  <h3 className="font-cormorant text-2xl font-light text-primary mb-4 tracking-wide">
                    The Commission Process
                  </h3>
                  <p className="font-sans text-sm text-secondary font-light leading-relaxed tracking-wide mb-6">
                    Commissioning a custom artwork is an intimate process between collector, artist,
                    and curator. Whether you require a specific dimension for an architectural niche
                    or a bespoke calligraphy inscription, our team ensures the result is a
                    museum-quality asset.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="font-cormorant text-2xl text-accent font-light italic w-8 shrink-0">
                      01
                    </div>
                    <div>
                      <h4 className="font-sans text-xs uppercase tracking-wider font-semibold text-primary mb-1">
                        Consultation
                      </h4>
                      <p className="font-sans text-xs text-secondary font-light leading-relaxed">
                        Detail your medium, space requirements, and style preference. We align your
                        vision with our master artists.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="font-cormorant text-2xl text-accent font-light italic w-8 shrink-0">
                      02
                    </div>
                    <div>
                      <h4 className="font-sans text-xs uppercase tracking-wider font-semibold text-primary mb-1">
                        Sketch Proposal
                      </h4>
                      <p className="font-sans text-xs text-secondary font-light leading-relaxed">
                        You receive structural sketches and color swatches for spatial review and
                        confirmation.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="font-cormorant text-2xl text-accent font-light italic w-8 shrink-0">
                      03
                    </div>
                    <div>
                      <h4 className="font-sans text-xs uppercase tracking-wider font-semibold text-primary mb-1">
                        Creation & Delivery
                      </h4>
                      <p className="font-sans text-xs text-secondary font-light leading-relaxed">
                        The piece is hand-crafted, professionally framed, and delivered in custom
                        wooden crates with a Certificate of Authenticity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission Form */}
              <div className="bg-white border border-primary/5 p-8 shadow-xs">
                {success ? (
                  <div className="bg-emerald-50/50 text-emerald-800 p-8 border border-emerald-100 text-xs font-sans text-center uppercase tracking-wider h-full flex flex-col items-center justify-center space-y-4">
                    <span className="font-semibold text-sm text-emerald-900">Request Logged</span>
                    <span>
                      Our curation board will review your requirements and submit a quote within 48
                      hours.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="font-cormorant text-xl font-light text-primary mb-2 tracking-wide">
                      Commission Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Full Name" placeholder="Arthur Pendragon" required />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="arthur@camelot.com"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Dropdown
                        label="Select Medium"
                        options={mediums}
                        selectedValue={medium}
                        onSelect={setMedium}
                        placeholder="Choose Medium"
                      />
                      <Dropdown
                        label="Target Dimensions"
                        options={sizes}
                        selectedValue={dimensions}
                        onSelect={setDimensions}
                        placeholder="Choose Dimensions"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-secondary mb-1.5 font-medium font-sans">
                        Stylistic Notes & Spatial Context
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe the wall color, room lighting, and elements you wish to capture..."
                        required
                        className="w-full bg-white border border-primary/10 px-4 py-3 text-sm font-sans focus:outline-none focus:border-accent transition-colors duration-300 resize-none"
                      />
                    </div>

                    <Button variant="primary" size="md" type="submit" fullWidth>
                      Submit Commission Inquiry
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

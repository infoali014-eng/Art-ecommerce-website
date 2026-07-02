import React from 'react';

import Link from 'next/link';

import { Clock, Mail, MapPin, Phone } from 'lucide-react';

import { siteConfig } from '@/config/site';

import { Container } from '../layout/Container';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-background border-t border-white/5 pt-20 pb-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <h3 className="font-cormorant text-2xl font-semibold tracking-[0.2em] text-white">
              AURA
            </h3>
            <p className="font-sans text-xs text-background/60 leading-relaxed font-light">
              An elegant space dedicated to showcasing fine original art, calligraphic scripts, and
              pencil studies. Designing luxury assets for timeless interiors.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-sans text-xs uppercase tracking-widest text-accent font-semibold">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="font-sans text-xs text-background/70 hover:text-accent transition-colors duration-250 font-light"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="font-sans text-xs text-background/70 hover:text-accent transition-colors duration-250 font-light"
                >
                  Gallery Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="font-sans text-xs text-background/70 hover:text-accent transition-colors duration-250 font-light"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-order"
                  className="font-sans text-xs text-background/70 hover:text-accent transition-colors duration-250 font-light"
                >
                  Custom Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="font-sans text-xs text-background/70 hover:text-accent transition-colors duration-250 font-light"
                >
                  About the Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h4 className="font-sans text-xs uppercase tracking-widest text-accent font-semibold">
              The Gallery
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-xs text-background/70 font-light">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-background/70 font-light">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-background/70 font-light">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </li>
              <li className="flex items-start gap-3 text-xs text-background/70 font-light">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{siteConfig.contact.hours}</span>
              </li>
            </ul>
          </div>

          {/* Socials & Newsletter */}
          <div className="space-y-6">
            <h4 className="font-sans text-xs uppercase tracking-widest text-accent font-semibold">
              Connect
            </h4>
            <div className="flex gap-4">
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-background/70 hover:text-accent transition-colors duration-250 text-xs uppercase tracking-wider"
              >
                Instagram
              </a>
              <span className="text-white/10">/</span>
              <a
                href={siteConfig.links.pinterest}
                target="_blank"
                rel="noreferrer"
                className="text-background/70 hover:text-accent transition-colors duration-250 text-xs uppercase tracking-wider"
              >
                Pinterest
              </a>
              <span className="text-white/10">/</span>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className="text-background/70 hover:text-accent transition-colors duration-250 text-xs uppercase tracking-wider"
              >
                Twitter
              </a>
            </div>
            <div className="pt-2">
              <h5 className="font-sans text-[10px] uppercase tracking-widest text-background/50 mb-3 font-medium">
                Curator&apos;s Newsletter
              </h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-background focus:outline-none focus:border-accent w-full"
                />
                <button className="bg-accent text-primary px-4 text-xs uppercase tracking-wider font-semibold hover:bg-white hover:text-primary transition-all duration-300 cursor-pointer">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-white/5 pt-10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-background/40">
          <p>&copy; {currentYear} AURA Gallery. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-accent transition-colors duration-250">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors duration-250">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
export default Footer;

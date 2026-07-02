'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChevronRight, Home } from 'lucide-react';

import { Container } from '../layout/Container';

interface BreadcrumbsProps {
  customLabels?: Record<string, string>;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customLabels = {}, className = '' }) => {
  const pathname = usePathname();

  // Split path into segments and remove empty items
  const segments = pathname.split('/').filter((s) => s);

  if (segments.length === 0) return null; // No breadcrumbs on homepage

  const formatLabel = (segment: string): string => {
    if (customLabels[segment]) return customLabels[segment];

    // Convert slug (e.g. "whispers-of-horizon") to Title Case
    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`bg-transparent py-4 border-b border-primary/5 font-sans ${className}`}
    >
      <Container>
        <ol className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-secondary font-medium">
          {/* Home Link */}
          <li className="flex items-center">
            <Link href="/" className="hover:text-accent transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </li>

          {/* Path segments */}
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const href = '/' + segments.slice(0, index + 1).join('/');

            return (
              <li key={segment} className="flex items-center space-x-2">
                <ChevronRight className="w-3 h-3 text-secondary/40 shrink-0" />
                {isLast ? (
                  <span className="text-primary select-none font-semibold" aria-current="page">
                    {formatLabel(segment)}
                  </span>
                ) : (
                  <Link href={href} className="hover:text-accent transition-colors">
                    {formatLabel(segment)}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
};
export default Breadcrumbs;

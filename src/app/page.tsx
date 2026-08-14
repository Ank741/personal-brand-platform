import React, { Suspense } from 'react';
import { headers } from 'next/headers';
import { resolveClientProfile } from '@/lib/tenant';
import { SiteHeader } from '@/components/brand/SiteHeader';
import { Hero } from '@/components/brand/Hero';
import { CredibilityStrip } from '@/components/brand/CredibilityStrip';
import { About } from '@/components/brand/About';
import { Expertise } from '@/components/brand/Expertise';
import { Achievements } from '@/components/brand/Achievements';
import { Ideas } from '@/components/brand/Ideas';
import { Speaking } from '@/components/brand/Speaking';
import { Videos } from '@/components/brand/Videos';
import { Courses } from '@/components/brand/Courses';
import { Community } from '@/components/brand/Community';
import { Portfolio } from '@/components/brand/Portfolio';
import { Contact } from '@/components/brand/Contact';
import { SiteFooter } from '@/components/brand/SiteFooter';
import { DevPlatformSwitcher } from '@/components/brand/DevPlatformSwitcher';
import type { Metadata } from 'next';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const headerList = await headers();
  const host = headerList.get('host');
  const clientSlug = typeof params.client === 'string' ? params.client : null;

  const client = resolveClientProfile({ hostname: host, clientSlug });

  return {
    title: client.seo.title,
    description: client.seo.description,
    keywords: client.seo.keywords,
    openGraph: {
      title: client.seo.title,
      description: client.seo.description,
      images: client.seo.ogImage ? [{ url: client.seo.ogImage }] : undefined,
    },
    alternates: {
      canonical: `https://${client.domain}`,
    },
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const headerList = await headers();
  const host = headerList.get('host');
  const clientSlug = typeof params.client === 'string' ? params.client : null;

  const client = resolveClientProfile({ hostname: host, clientSlug });

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: client.name,
    jobTitle: client.professionalTitle,
    description: client.shortBio,
    address: {
      '@type': 'PostalAddress',
      addressLocality: client.location,
    },
    sameAs: [
      client.social.linkedin,
      client.social.x,
      client.social.youtube,
      client.social.instagram,
    ].filter(Boolean),
  };

  return (
    <main className="min-h-screen bg-white font-sans antialiased text-gray-900 selection:bg-teal-100">
      {/* Schema.org Person Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Dynamic Brand Component Suite */}
      <SiteHeader client={client} />
      <Hero client={client} />
      <CredibilityStrip client={client} />
      <About client={client} />
      <Expertise client={client} />
      <Achievements client={client} />
      <Ideas client={client} />
      <Speaking client={client} />
      <Videos client={client} />
      <Courses client={client} />
      <Community client={client} />
      <Portfolio client={client} />
      <Contact client={client} />
      <SiteFooter client={client} />

      {/* Development Only Platform Switcher */}
      <Suspense fallback={null}>
        <DevPlatformSwitcher currentClientId={client.id} />
      </Suspense>
    </main>
  );
}

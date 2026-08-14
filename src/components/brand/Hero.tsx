import React from 'react';
import { ClientProfile } from '@/types/client';
import { ImagePlaceholder } from './ImagePlaceholder';

interface HeroProps {
  client: ClientProfile;
}

export function Hero({ client }: HeroProps) {
  const { name, professionalTitle, headline, subHeadline, location, profileImage, primaryCtaText, social, brand, sections } = client;
  const isExecutive = brand.heroVariant === 'executive';

  const ctaLabel = primaryCtaText || (
    professionalTitle.toLowerCase().includes('consultant')
      ? 'Work With Me'
      : professionalTitle.toLowerCase().includes('speaker')
      ? 'Speaking Inquiry'
      : professionalTitle.toLowerCase().includes('advisor')
      ? 'Advisory Inquiry'
      : 'Connect With Me'
  );

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2);
  };

  if (isExecutive) {
    return (
      <section className="relative bg-slate-950 text-white py-24 lg:py-32 border-b border-slate-800 overflow-hidden">
        {/* Subtle Architectural Line Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Main Editorial Text Block */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Metadata Pill */}
              <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brand.accentColor }} />
                <span>{name}</span>
                <span className="text-slate-600">—</span>
                <span className="text-slate-400">{location}</span>
              </div>

              {/* Bold Editorial Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white leading-[1.12]">
                {headline}
              </h1>

              {/* Sub-headline positioning */}
              <p className="text-lg sm:text-xl text-slate-300 font-sans font-light leading-relaxed max-w-2xl border-l-2 pl-5 border-slate-800">
                {subHeadline}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {sections.contact && (
                  <a
                    href="#contact"
                    className="px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white rounded shadow-lg transition-transform active:scale-95 hover:opacity-95"
                    style={{ backgroundColor: brand.accentColor }}
                  >
                    {ctaLabel}
                  </a>
                )}
                {sections.about && (
                  <a
                    href="#about"
                    className="px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-900 border border-slate-800 rounded hover:bg-slate-850 hover:text-white transition-colors"
                  >
                    Read Profile
                  </a>
                )}
              </div>

              {/* Social Channels */}
              <div className="pt-4 flex items-center space-x-6 text-slate-400">
                {social.linkedin && (
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" aria-label="LinkedIn">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
                {social.x && (
                  <a href={social.x} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" aria-label="X">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X
                  </a>
                )}
              </div>

            </div>

            {/* Portrait Area */}
            <div className="lg:col-span-5">
              <div className="relative group">
                <div 
                  className="absolute -inset-1 rounded-xl opacity-20 blur-xl transition-opacity group-hover:opacity-40"
                  style={{ backgroundColor: brand.accentColor }}
                />
                {profileImage ? (
                  <div className="relative overflow-hidden rounded-xl border border-slate-800 shadow-2xl bg-slate-900">
                    <img
                      src={profileImage}
                      alt={`${name} Portrait`}
                      className="w-full h-[460px] sm:h-[520px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                  </div>
                ) : (
                  <ImagePlaceholder
                    alt={`${name} Signature Portrait`}
                    aspectRatio="portrait"
                    iconType="person"
                    clientInitials={getInitials(name)}
                    subtext="Portrait / Signature Visual"
                    className="w-full bg-slate-900 border-slate-800 rounded-lg shadow-2xl"
                  />
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // Modern Warm Variant
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-teal-50/50 via-white to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-teal-100/60 border border-teal-200/80 text-xs font-semibold text-teal-900">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brand.accentColor }} />
              <span>{location}</span>
              <span className="text-teal-400">•</span>
              <span className="text-teal-800">{professionalTitle}</span>
            </div>

            <div className="space-y-4">
              <span className="block text-sm font-semibold tracking-wider uppercase text-teal-800 font-sans">
                {name}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-gray-900 leading-[1.15]">
                {headline}
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-gray-600 font-sans font-normal leading-relaxed max-w-2xl">
              {subHeadline}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              {sections.contact && (
                <a
                  href="#contact"
                  className="px-7 py-3.5 text-sm font-semibold text-white rounded-full shadow-md hover:shadow-lg transition-all"
                  style={{ backgroundColor: brand.accentColor }}
                >
                  {ctaLabel}
                </a>
              )}
              {sections.about && (
                <a
                  href="#about"
                  className="px-7 py-3.5 text-sm font-semibold text-teal-900 bg-white border border-teal-200 rounded-full shadow-sm hover:bg-teal-50 transition-colors"
                >
                  Read Story & Vision
                </a>
              )}
            </div>

            {/* Social Links */}
            <div className="pt-4 flex items-center space-x-6 text-gray-500 text-xs font-semibold tracking-wider uppercase">
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-teal-900 transition-colors">
                  LinkedIn
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-teal-900 transition-colors">
                  YouTube
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-teal-900 transition-colors">
                  Instagram
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative group">
              <div 
                className="absolute -inset-2 rounded-3xl opacity-20 blur-2xl transition-opacity group-hover:opacity-30"
                style={{ backgroundColor: brand.accentColor }}
              />
              {profileImage ? (
                <div className="relative overflow-hidden rounded-3xl border border-teal-100/90 shadow-xl bg-white">
                  <img
                    src={profileImage}
                    alt={`${name} Portrait`}
                    className="w-full h-[460px] sm:h-[520px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ) : (
                <ImagePlaceholder
                  alt={`${name} Signature Portrait`}
                  aspectRatio="portrait"
                  iconType="person"
                  clientInitials={getInitials(name)}
                  subtext="Portrait / Signature Visual"
                  className="w-full bg-white shadow-xl rounded-3xl border border-teal-100/90"
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

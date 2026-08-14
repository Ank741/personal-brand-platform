import React from 'react';
import { ClientProfile } from '@/types/client';

interface AboutProps {
  client: ClientProfile;
}

export function About({ client }: AboutProps) {
  const { name, professionalTitle, shortBio, longBio, storyHeadline, philosophyQuote, sections, brand, location } = client;

  if (!sections.about) {
    return null;
  }

  const isExecutive = brand.aboutVariant === 'executive-split';

  if (isExecutive) {
    return (
      <section id="about" className="py-28 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Personal Story & Executive Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight mt-3">
              {storyHeadline || `The Vision Behind ${name.split(' ')[0]}'s Leadership`}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Main Long Story & Philosophy */}
            <div className="lg:col-span-7 space-y-8">
              <p className="text-xl font-sans font-light text-slate-200 leading-relaxed border-l-2 pl-6" style={{ borderColor: brand.accentColor }}>
                {shortBio}
              </p>

              {philosophyQuote && (
                <blockquote className="p-8 rounded-xl bg-slate-950 border border-slate-800 space-y-3 my-8">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    Leadership Philosophy
                  </div>
                  <p className="text-lg font-serif italic text-slate-100 leading-relaxed">
                    “{philosophyQuote}”
                  </p>
                  <footer className="text-xs text-slate-400 font-sans">
                    — {name}, {professionalTitle}
                  </footer>
                </blockquote>
              )}

              <div className="text-slate-300 font-sans text-base leading-relaxed space-y-6 font-light">
                <p>{longBio}</p>
              </div>
            </div>

            {/* Side Editorial Snapshot */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Executive Summary
                  </div>
                  <div className="text-xl font-bold text-white mt-1 font-serif">{name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{professionalTitle} • {location}</div>
                </div>

                <div className="space-y-4 text-xs text-slate-300">
                  <div>
                    <span className="block font-semibold uppercase text-slate-400">Primary Domain</span>
                    <span>Corporate Strategy & Operating Model Scale</span>
                  </div>
                  <div>
                    <span className="block font-semibold uppercase text-slate-400">Advisory Scope</span>
                    <span>Boardrooms, C-Suite Leadership & Institutional Investors</span>
                  </div>
                </div>

                {sections.contact && (
                  <a
                    href="#contact"
                    className="block text-center w-full py-3 text-xs font-bold uppercase tracking-wider text-white rounded transition-transform active:scale-95 shadow-sm"
                    style={{ backgroundColor: brand.accentColor }}
                  >
                    Request Executive Profile
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // Modern Magazine Narrative Variant (Dr. Maya Verma)
  return (
    <section id="about" className="py-28 bg-white">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1 bg-teal-50 text-teal-800 border border-teal-100 rounded-full">
            Story & Mission
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900 tracking-tight">
            {storyHeadline || `Pioneering Compassionate Care & Innovation`}
          </h2>
        </div>

        {/* Magazine Editorial Body */}
        <div className="space-y-10">
          
          {/* Pull Quote */}
          {philosophyQuote && (
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-teal-50/60 to-emerald-50/30 border border-teal-100/90 text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-800">
                Core Belief
              </span>
              <blockquote className="text-xl sm:text-2xl font-serif text-gray-900 leading-relaxed italic">
                “{philosophyQuote}”
              </blockquote>
              <div className="text-xs font-semibold text-teal-900">
                — {name}
              </div>
            </div>
          )}

          <div className="text-lg font-normal text-gray-700 leading-relaxed font-sans border-l-4 border-teal-600 pl-6">
            {shortBio}
          </div>

          <div className="prose prose-lg text-gray-600 font-sans leading-relaxed space-y-6">
            <p>{longBio}</p>
          </div>

        </div>

      </div>
    </section>
  );
}

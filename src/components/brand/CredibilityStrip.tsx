import React from 'react';
import { ClientProfile } from '@/types/client';

interface CredibilityStripProps {
  client: ClientProfile;
}

export function CredibilityStrip({ client }: CredibilityStripProps) {
  const { achievements, sections, brand, credibilityLabel } = client;

  if (!sections.achievements || !achievements || achievements.length === 0) {
    return null;
  }

  const isExecutive = brand.heroVariant === 'executive';

  if (isExecutive) {
    return (
      <section className="border-y border-slate-800 bg-slate-950 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          {credibilityLabel && (
            <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">
              {credibilityLabel}
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {achievements.map((item, idx) => (
              <div key={idx} className="pt-4 md:pt-0 first:pt-0 md:px-6 space-y-1">
                <div
                  className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight"
                  style={{ color: brand.accentColor }}
                >
                  {item.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {item.label}
                </div>
                {item.sublabel && (
                  <div className="text-[11px] text-slate-500 font-sans">
                    {item.sublabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Modern Variant (Maya Verma)
  return (
    <section className="border-y border-teal-100/60 bg-teal-50/40 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {credibilityLabel && (
          <div className="text-center text-xs font-bold uppercase tracking-widest text-teal-800 mb-8">
            {credibilityLabel}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {achievements.map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-teal-100/80 shadow-sm space-y-1">
              <div className="text-3xl font-extrabold text-teal-800 font-mono tracking-tight">
                {item.value}
              </div>
              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

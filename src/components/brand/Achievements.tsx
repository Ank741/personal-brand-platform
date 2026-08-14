import React from 'react';
import { ClientProfile } from '@/types/client';

interface AchievementsProps {
  client: ClientProfile;
}

export function Achievements({ client }: AchievementsProps) {
  const { achievements, sections, brand } = client;

  if (!sections.achievements || !achievements || achievements.length === 0) {
    return null;
  }

  const isExecutive = brand.achievementsVariant === 'executive-stats';

  if (isExecutive) {
    return (
      <section id="achievements" className="py-20 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {achievements.map((item, idx) => (
              <div key={idx} className="pt-6 md:pt-0 first:pt-0 md:px-6">
                <div
                  className="text-4xl sm:text-5xl font-extrabold tracking-tight"
                  style={{ color: brand.accentColor }}
                >
                  {item.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Modern Strip Variant (Maya Verma)
  return (
    <section id="achievements" className="py-16 bg-gradient-to-r from-teal-900 via-teal-850 to-emerald-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {achievements.map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-4xl font-extrabold tracking-tight text-teal-300">
                {item.value}
              </div>
              <div className="text-xs font-medium text-teal-100 uppercase tracking-widest mt-2">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

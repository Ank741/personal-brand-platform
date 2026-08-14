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
  const count = achievements.length;

  // Adaptive Grid Classes based on Metric Count
  const getGridClasses = (numItems: number, executive: boolean) => {
    if (numItems === 1) {
      return executive
        ? 'flex justify-center max-w-xl mx-auto text-center'
        : 'flex justify-center max-w-md mx-auto text-center';
    }
    if (numItems === 2) {
      return 'grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800';
    }
    if (numItems === 3) {
      return 'grid grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800';
    }
    return 'grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800';
  };

  if (isExecutive) {
    return (
      <section id="achievements" className="py-20 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className={getGridClasses(count, true)}>
            {achievements.map((item, idx) => (
              <div key={idx} className="pt-6 sm:pt-0 first:pt-0 sm:px-6">
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

  // Modern Strip Variant
  const getModernGridClasses = (numItems: number) => {
    if (numItems === 1) return 'flex justify-center max-w-md mx-auto';
    if (numItems === 2) return 'grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-8';
    return 'grid grid-cols-1 sm:grid-cols-3 max-w-6xl mx-auto gap-8';
  };

  return (
    <section id="achievements" className="py-16 bg-gradient-to-r from-teal-900 via-teal-850 to-emerald-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className={getModernGridClasses(count)}>
          {achievements.map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm w-full text-center">
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

import React from 'react';
import { ClientProfile } from '@/types/client';

interface ExpertiseProps {
  client: ClientProfile;
}

export function Expertise({ client }: ExpertiseProps) {
  const { expertise, sections, brand } = client;

  if (!sections.expertise || !expertise || expertise.length === 0) {
    return null;
  }

  const isEditorial = brand.expertiseVariant === 'editorial-list';

  if (isEditorial) {
    return (
      <section id="expertise" className="py-24 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Strategic Capability
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Areas of Executive Expertise
            </h3>
          </div>

          <div className="space-y-8">
            {expertise.map((item, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="flex items-start space-x-6">
                  <span className="text-2xl font-black text-slate-600 font-mono">
                    0{idx + 1}
                  </span>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Cards Grid Variant (Maya Verma)
  return (
    <section id="expertise" className="py-24 bg-teal-50/30 border-y border-teal-100/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14 text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-800">
            Clinical & Advisory Focus
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Core Innovation Domains
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {expertise.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-teal-100/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: brand.accentColor }}
              >
                0{idx + 1}
              </div>
              <h4 className="text-xl font-bold text-gray-900">
                {item.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

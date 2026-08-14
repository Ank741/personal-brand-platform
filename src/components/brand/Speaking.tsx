import React from 'react';
import { ClientProfile } from '@/types/client';

interface SpeakingProps {
  client: ClientProfile;
}

export function Speaking({ client }: SpeakingProps) {
  const { speaking, sections, brand, name } = client;

  if (!sections.speaking || !speaking || speaking.length === 0) {
    return null;
  }

  const isExecutive = brand.heroVariant === 'executive';

  if (isExecutive) {
    return (
      <section id="speaking" className="py-28 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Keynotes & Key Engagements
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight mt-2">
                Executive Speaking & Advisory
              </h2>
            </div>

            {sections.contact && (
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white rounded transition-transform active:scale-95 shadow-md self-start lg:self-auto"
                style={{ backgroundColor: brand.accentColor }}
              >
                Inquire for Keynote / Speaking
              </a>
            )}
          </div>

          <div className="space-y-6">
            {speaking.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all"
              >
                <div className="space-y-3 max-w-3xl">
                  <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                    <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-blue-400 uppercase">
                      {item.type || 'Keynote'}
                    </span>
                    {item.location && <span>{item.location}</span>}
                    {item.date && <span>• {item.date}</span>}
                  </div>
                  <h3 className="text-2xl font-serif text-white">{item.title}</h3>
                  <p className="text-slate-300 text-sm font-sans font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    );
  }

  // Modern Variant (Maya Verma)
  return (
    <section id="speaking" className="py-28 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-800">
              Keynotes & Dialogues
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900 tracking-tight mt-2">
              Public Speaking & Symposia
            </h2>
          </div>

          {sections.contact && (
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-white rounded-full shadow-md hover:shadow-lg transition-all self-start lg:self-auto"
              style={{ backgroundColor: brand.accentColor }}
            >
              Invite {name.split(' ')[0]} to Speak
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {speaking.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-teal-50/30 border border-teal-100/80 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <span className="px-3 py-1 bg-white border border-teal-100 text-teal-900 text-xs font-semibold rounded-full inline-block">
                  {item.type || 'Keynote Topic'}
                </span>
                <h3 className="text-2xl font-serif text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>

              {(item.location || item.date) && (
                <div className="text-xs text-gray-400 font-medium pt-2 border-t border-teal-100/60">
                  {item.location} {item.date && `• ${item.date}`}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

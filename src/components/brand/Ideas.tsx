import React from 'react';
import { ClientProfile } from '@/types/client';

interface IdeasProps {
  client: ClientProfile;
}

export function Ideas({ client }: IdeasProps) {
  const { ideas, sections, brand, name } = client;

  if (!sections.ideas || !ideas || ideas.length === 0) {
    return null;
  }

  const isExecutive = brand.heroVariant === 'executive';

  if (isExecutive) {
    return (
      <section id="ideas" className="py-28 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Thought Leadership & Essays
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight mt-2">
                Perspectives on Strategy & Scale
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-xs font-sans">
              Published insights by {name} on corporate governance, transformation, and long-term enterprise value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ideas.map((item, idx) => (
              <article
                key={idx}
                className="group bg-slate-900/90 rounded-xl p-8 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-6 hover-lift"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-mono rounded">
                      {item.type || item.category || 'Article'}
                    </span>
                    {item.date && (
                      <span className="text-xs text-slate-500 font-mono">{item.date}</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-serif text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm font-sans font-light leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {item.url && (
                  <a
                    href={item.url}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors pt-2"
                  >
                    Read Full Essay
                    <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                )}
              </article>
            ))}
          </div>

        </div>
      </section>
    );
  }

  // Modern Thought Leadership Variant (Maya Verma)
  return (
    <section id="ideas" className="py-28 bg-teal-50/20 border-t border-teal-100/60">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-800">
            Insights & Ideas
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900 tracking-tight">
            Published Thinking & Research
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ideas.map((item, idx) => (
            <article
              key={idx}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-teal-100/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 bg-teal-50 text-teal-900 border border-teal-100 text-xs font-semibold rounded-full">
                    {item.type || item.category || 'Perspective'}
                  </span>
                  {item.date && (
                    <span className="text-xs text-gray-400">{item.date}</span>
                  )}
                </div>
                <h3 className="text-2xl font-serif text-gray-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm font-sans leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {item.url && (
                <a
                  href={item.url}
                  className="inline-flex items-center text-sm font-semibold text-teal-800 hover:underline pt-2"
                >
                  Explore Perspective
                  <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              )}
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

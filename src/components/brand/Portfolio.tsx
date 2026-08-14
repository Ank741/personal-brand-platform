import React from 'react';
import { ClientProfile } from '@/types/client';
import { ImagePlaceholder } from './ImagePlaceholder';

interface PortfolioProps {
  client: ClientProfile;
}

export function Portfolio({ client }: PortfolioProps) {
  const { portfolio, sections, brand } = client;

  if (!sections.portfolio || !portfolio || portfolio.length === 0) {
    return null;
  }

  const isCaseStudy = brand.portfolioVariant === 'case-study-cards';

  if (isCaseStudy) {
    return (
      <section id="portfolio" className="py-24 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Case Studies
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Selected Operating Transformations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 rounded-xl border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 transition-all space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {item.category && (
                      <span className="text-xs font-semibold px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-md">
                        {item.category}
                      </span>
                    )}
                    {item.metrics && (
                      <span className="text-xs font-bold text-blue-400">
                        {item.metrics}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-white">{item.title}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>
                </div>

                {item.url && (
                  <a
                    href={item.url}
                    className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Examine Case Study
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Minimal Grid Variant (Maya Verma)
  return (
    <section id="portfolio" className="py-24 bg-white border-t border-teal-100/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-800 mb-2">
            Clinical Projects
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Selected Health Initiatives
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolio.map((item, idx) => (
            <div
              key={idx}
              className="bg-teal-50/40 rounded-3xl p-8 border border-teal-100/80 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {item.category && (
                    <span className="text-xs font-semibold px-3 py-1 bg-white border border-teal-100 text-teal-900 rounded-full">
                      {item.category}
                    </span>
                  )}
                  {item.metrics && (
                    <span className="text-xs font-bold text-teal-700">
                      {item.metrics}
                    </span>
                  )}
                </div>
                <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>

              {item.url && (
                <a
                  href={item.url}
                  className="inline-flex items-center text-sm font-semibold text-teal-800 hover:underline"
                >
                  View Initiative
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

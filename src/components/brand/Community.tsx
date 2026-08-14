import React from 'react';
import { ClientProfile } from '@/types/client';

interface CommunityProps {
  client: ClientProfile;
}

export function Community({ client }: CommunityProps) {
  const { communities, sections, brand } = client;

  if (!sections.communities || !communities || communities.length === 0) {
    return null;
  }

  return (
    <section id="community" className="py-20 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Network & Advisory
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Communities & Initiatives
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {communities.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.name}</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{item.description}</p>
              </div>

              {item.url && (
                <a
                  href={item.url}
                  className="inline-flex items-center text-sm font-semibold hover:underline"
                  style={{ color: brand.accentColor }}
                >
                  Join / Explore Network
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

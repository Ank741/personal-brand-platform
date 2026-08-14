import React from 'react';
import { ClientProfile } from '@/types/client';

interface GalleryProps {
  client: ClientProfile;
}

export function Gallery({ client }: GalleryProps) {
  const { gallery, sections, brand } = client;

  if (!sections.gallery || !gallery || gallery.length < 3) {
    return null;
  }

  const isExecutive = brand.heroVariant === 'executive';

  return (
    <section id="gallery" className={`py-20 border-b ${isExecutive ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className={`text-xs font-semibold uppercase tracking-widest ${isExecutive ? 'text-slate-400' : 'text-teal-700'}`}>
            Life & Perspectives
          </span>
          <h2 className={`text-3xl sm:text-4xl font-serif mt-2 font-normal ${isExecutive ? 'text-white' : 'text-slate-900'}`}>
            Beyond the Boardroom
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gallery.map((item, idx) => (
            <div key={idx} className={`group relative overflow-hidden rounded-xl aspect-[4/3] ${isExecutive ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <img
                src={item.image}
                alt={item.title || `Gallery visual ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {item.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                  <span className="text-xs font-medium text-slate-200 tracking-wider uppercase">
                    {item.title}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

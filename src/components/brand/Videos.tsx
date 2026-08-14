import React from 'react';
import { ClientProfile } from '@/types/client';
import { ImagePlaceholder } from './ImagePlaceholder';

interface VideosProps {
  client: ClientProfile;
}

export function Videos({ client }: VideosProps) {
  const { videos, sections, brand } = client;

  if (!sections.videos || !videos || videos.length === 0) {
    return null;
  }

  return (
    <section id="videos" className="py-20 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Media & Broadcasts
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Featured Keynotes & Interviews
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((item, idx) => (
            <div key={idx} className="bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-700/60 flex flex-col justify-between">
              <div>
                <ImagePlaceholder
                  alt={item.title}
                  aspectRatio="video"
                  iconType="video"
                  className="w-full border-0 bg-gray-800"
                />
                <div className="p-6">
                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                </div>
              </div>
              <div className="px-6 pb-6">
                <a
                  href={item.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-wider hover:underline"
                  style={{ color: brand.accentColor }}
                >
                  Watch Video
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 15l5-3-5-3v6z"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

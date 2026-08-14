import React from 'react';

interface ImagePlaceholderProps {
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  iconType?: 'person' | 'document' | 'video' | 'speech' | 'community' | 'portfolio' | 'course';
  clientInitials?: string;
  subtext?: string;
}

export function ImagePlaceholder({
  alt,
  className = '',
  aspectRatio = 'portrait',
  iconType = 'person',
  clientInitials,
  subtext = 'Portrait / Signature Visual',
}: ImagePlaceholderProps) {
  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : 'aspect-[16/9]';

  return (
    <div
      className={`relative overflow-hidden bg-slate-900/90 border border-slate-800 text-slate-400 flex flex-col items-center justify-center p-8 text-center transition-all duration-300 hover:border-slate-700 ${aspectClass} ${className}`}
      aria-label={alt}
    >
      {/* Decorative Editorial Border */}
      <div className="absolute inset-4 border border-slate-800/60 pointer-events-none rounded-lg" />

      {/* Center Visual Badge */}
      <div className="relative z-10 space-y-3 flex flex-col items-center">
        {clientInitials ? (
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center text-white font-serif text-2xl tracking-wider shadow-inner">
            {clientInitials}
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-slate-300 shadow-sm">
            {iconType === 'person' && (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            {iconType === 'video' && (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {iconType === 'speech' && (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            )}
            {iconType === 'portfolio' && (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )}
            {iconType === 'document' && (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
          </div>
        )}

        <div className="space-y-1 max-w-[200px]">
          <div className="text-xs font-medium text-slate-300 font-sans tracking-wide uppercase">
            {alt}
          </div>
          <div className="text-[10px] text-slate-500 tracking-wider font-mono uppercase">
            {subtext}
          </div>
        </div>
      </div>
    </div>
  );
}

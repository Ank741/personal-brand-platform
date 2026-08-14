import React from 'react';
import { ClientProfile } from '@/types/client';
import { ImagePlaceholder } from './ImagePlaceholder';

interface CoursesProps {
  client: ClientProfile;
}

export function Courses({ client }: CoursesProps) {
  const { courses, sections, brand } = client;

  if (!sections.courses || !courses || courses.length === 0) {
    return null;
  }

  return (
    <section id="courses" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Education & Workshops
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Programs & Courses
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50/70 rounded-2xl p-8 border border-gray-200/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold px-3 py-1 bg-white border border-gray-200 rounded-full text-gray-600 inline-block mb-4">
                  {item.platform}
                </span>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{item.description}</p>
              </div>

              {item.url && (
                <a
                  href={item.url}
                  className="inline-flex items-center text-sm font-semibold hover:underline"
                  style={{ color: brand.accentColor }}
                >
                  View Course Details
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

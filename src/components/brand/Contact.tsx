import React from 'react';
import { ClientProfile } from '@/types/client';

interface ContactProps {
  client: ClientProfile;
}

export function Contact({ client }: ContactProps) {
  const { name, contact, sections, brand } = client;

  if (!sections.contact) {
    return null;
  }

  return (
    <section id="contact" className="py-20 bg-gray-900 text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Get in Touch
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
            Let’s Connect & Collaborate
          </h3>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Interested in executive advisory, keynote speaking, or advisory partnerships with {name}? Reach out directly.
          </p>

          <div className="p-8 rounded-2xl bg-gray-800/90 border border-gray-700/80 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gray-700/60 text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase">Direct Email</div>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-lg font-semibold text-white hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            {contact.location && (
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-700/50">
                <div className="p-3 rounded-xl bg-gray-700/60 text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-400 uppercase">Base Location</div>
                  <div className="text-base font-medium text-white">{contact.location}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

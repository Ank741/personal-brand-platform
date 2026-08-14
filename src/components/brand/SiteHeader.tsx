'use client';

import React, { useState } from 'react';
import { ClientProfile } from '@/types/client';

interface SiteHeaderProps {
  client: ClientProfile;
}

export function SiteHeader({ client }: SiteHeaderProps) {
  const { name, professionalTitle, sections, brand } = client;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isExecutive = brand.heroVariant === 'executive';

  const navLinks = [
    { key: 'about', label: 'About', href: '#about', visible: sections.about },
    { key: 'expertise', label: 'Expertise', href: '#expertise', visible: sections.expertise },
    { key: 'achievements', label: 'Impact', href: '#achievements', visible: sections.achievements },
    { key: 'ideas', label: 'Ideas', href: '#ideas', visible: sections.ideas },
    { key: 'speaking', label: 'Speaking', href: '#speaking', visible: sections.speaking },
    { key: 'videos', label: 'Videos', href: '#videos', visible: sections.videos },
    { key: 'courses', label: 'Courses', href: '#courses', visible: sections.courses },
    { key: 'communities', label: 'Community', href: '#community', visible: sections.communities },
    { key: 'portfolio', label: 'Portfolio', href: '#portfolio', visible: sections.portfolio },
    { key: 'contact', label: 'Contact', href: '#contact', visible: sections.contact },
  ].filter((item) => item.visible);

  return (
    <header className={`sticky top-0 z-50 transition-colors ${
      isExecutive ? 'bg-slate-950/90 border-slate-800 text-white' : 'bg-white/90 border-gray-100 text-gray-900'
    } backdrop-blur-md border-b`}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo / Name */}
        <a href="#" className="flex flex-col group">
          <span className={`text-xl font-extrabold tracking-tight transition-opacity ${
            isExecutive ? 'text-white' : 'text-gray-900'
          }`}>
            {name}
          </span>
          <span className={`text-[11px] font-semibold tracking-wider uppercase ${
            isExecutive ? 'text-slate-400' : 'text-gray-500'
          }`}>
            {professionalTitle}
          </span>
        </a>

        {/* Desktop Navigation */}
        {navLinks.length > 0 && (
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isExecutive ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Action Button */}
        <div className="hidden sm:flex items-center space-x-4">
          {sections.contact && (
            <a
              href="#contact"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white rounded-lg transition-transform active:scale-95 shadow-sm"
              style={{ backgroundColor: brand.accentColor }}
            >
              Contact
            </a>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-6 py-6 space-y-4 ${
          isExecutive ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100'
        }`}>
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-semibold transition-colors ${
                  isExecutive ? 'text-slate-200 hover:text-white' : 'text-gray-800 hover:text-gray-900'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          {sections.contact && (
            <div className="pt-4 border-t border-gray-200/20">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-3 text-sm font-semibold text-white rounded-lg"
                style={{ backgroundColor: brand.accentColor }}
              >
                Contact
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

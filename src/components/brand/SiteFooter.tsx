import React from 'react';
import { ClientProfile } from '@/types/client';

interface SiteFooterProps {
  client: ClientProfile;
}

export function SiteFooter({ client }: SiteFooterProps) {
  const { name, professionalTitle, social } = client;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-white font-bold text-lg">{name}</div>
          <div className="text-xs text-gray-500">{professionalTitle}</div>
        </div>

        <div className="text-xs text-gray-500 text-center md:text-right">
          © {currentYear} {name}. All rights reserved. Powered by Personal Brand Platform.
        </div>
      </div>
    </footer>
  );
}

'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface DevPlatformSwitcherProps {
  currentClientId: string;
}

export function DevPlatformSwitcher({ currentClientId }: DevPlatformSwitcherProps) {
  // Production Hardening: Never render in production mode or Vercel production deployments
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    return null;
  }

  // Strictly render ONLY in local development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <DevSwitcherInner currentClientId={currentClientId} />;
}

function DevSwitcherInner({ currentClientId }: { currentClientId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSwitch = (clientId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('client', clientId);
    router.push(`/?${params.toString()}`);
  };

  const clientList = [
    { id: 'alex-morgan', label: 'Alex Morgan' },
    { id: 'maya-verma', label: 'Dr. Maya Verma' },
    { id: 'sam-taylor', label: 'Sam Taylor' },
    { id: 'palak-mehta', label: 'Palak Mehta' },
    { id: 'rohan-kapoor', label: 'Rohan Kapoor' },
    { id: 'amay-goyal', label: 'Jeeboy Koshy (Amay)' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-900/95 text-white p-3 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md text-xs font-sans max-w-md pointer-events-auto">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
        <div className="flex items-center space-x-1.5 font-bold tracking-wide uppercase text-[10px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>V1 Tenant Switcher</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Dev Only</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {clientList.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSwitch(c.id)}
            className={`py-1.5 px-2.5 rounded-lg font-semibold text-[11px] transition-all whitespace-nowrap ${
              currentClientId === c.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

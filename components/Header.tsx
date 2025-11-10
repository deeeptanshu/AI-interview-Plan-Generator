import React from 'react';

export const Header: React.FC = () => (
  <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 via-green-500 to-sky-500 shadow-lg shadow-blue-500/20 flex-shrink-0"></div>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">AI Interview Plan Builder</h1>
        <p className="text-sm text-slate-400">Design a structured, role-ready interview plan in minutes.</p>
      </div>
    </div>
  </header>
);

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl mx-auto px-8 py-10 flex justify-between items-center relative z-20 border-b border-theme-border/50">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-theme-text flex items-center justify-center rounded-theme">
          <span className="text-theme-bg font-black text-xl leading-none">V</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black font-theme-heading tracking-tight text-theme-text uppercase leading-none">Verbal</span>
          <span className="technical-label mt-1 text-theme-accent">Professional Grade</span>
        </div>
      </div>
      
      <div className="flex items-center gap-10">
          <div className="hidden sm:flex flex-col items-end">
            <span className="technical-label">Connection</span>
            <span className="text-xs font-bold text-theme-text uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              Voice Engine Active
            </span>
          </div>
          <div className="w-10 h-10 border border-theme-border flex items-center justify-center bg-theme-card hover:border-theme-accent transition-colors cursor-pointer rounded-theme group">
            <svg className="w-5 h-5 text-theme-text/40 group-hover:text-theme-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
      </div>
    </header>
  );
};

export default Header;

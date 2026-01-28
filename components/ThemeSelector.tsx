
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from '../constants';
import { ThemeConfig } from '../types';

interface ThemeSelectorProps {
  activeTheme: string;
  onThemeChange: (theme: ThemeConfig) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ activeTheme, onThemeChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
      {THEMES.map((theme) => (
        <motion.button
          key={theme.name}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onThemeChange(theme)}
          className={`relative flex flex-col items-start text-left p-6 transition-all duration-300 border-2 ${
            activeTheme === theme.name 
              ? 'border-theme-accent ring-2 ring-theme-accent/20' 
              : 'border-theme-border hover:border-theme-accent/50'
          } bg-theme-card rounded-theme overflow-hidden`}
        >
          {/* Theme Name */}
          <span className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            {theme.name}
            {activeTheme === theme.name && (
              <motion.div 
                layoutId="active-dot"
                className="w-2 h-2 rounded-full bg-theme-accent" 
              />
            )}
          </span>

          {/* Miniature Dashboard Preview */}
          <div 
            className="w-full h-32 rounded border shadow-inner mb-4 relative overflow-hidden flex flex-col p-2 gap-2"
            style={{ 
              backgroundColor: theme.bg, 
              borderColor: theme.border,
              fontFamily: theme.fontBody 
            }}
          >
            {/* Miniature Header */}
            <div className="w-full h-4 flex justify-between items-center px-1">
              <div className="w-8 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
              <div className="flex gap-1">
                 <div className="w-2 h-2 rounded-full bg-gray-300" />
                 <div className="w-2 h-2 rounded-full bg-gray-300" />
              </div>
            </div>

            {/* Miniature Layout */}
            <div className="flex-1 flex gap-2">
               <div className="w-1/3 h-full rounded border flex flex-col p-1 gap-1" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                  <div className="w-full h-1 bg-gray-200" />
                  <div className="w-full h-1 bg-gray-200" />
                  <div className="w-full h-2 mt-auto" style={{ backgroundColor: theme.accent }} />
               </div>
               <div className="flex-1 h-full rounded border flex flex-col p-1 gap-1" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                  <div className="w-3/4 h-2 bg-gray-200" />
                  <div className="w-full h-1 bg-gray-100" />
                  <div className="w-full h-1 bg-gray-100" />
                  <div className="w-1/2 h-1 bg-gray-100" />
               </div>
            </div>

            {/* Glass Effect Overlay for Creative */}
            {theme.glass && (
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none" />
            )}
          </div>

          <p className="text-[10px] font-bold opacity-60 uppercase">
            Click to apply interface
          </p>
        </motion.button>
      ))}
    </div>
  );
};

export default ThemeSelector;

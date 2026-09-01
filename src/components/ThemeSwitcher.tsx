import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, Sun, Moon, Monitor, Laptop } from 'lucide-react';
import { useTheme, THEMES, ThemeMode } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, currentThemeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-slate-200 rounded-xl text-xs font-medium transition-all hover:border-cyan-500/40 flex items-center gap-1.5 cursor-pointer shadow-sm group"
        title="切换网页视觉风格 (Linear / 现代清爽白 / 钛金 / 霓虹科技)"
      >
        <Palette className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
        <span className="hidden sm:inline">风格主题:</span>
        <span className="font-bold text-cyan-300 flex items-center gap-1">
          <span>{currentThemeConfig.icon}</span>
          <span>{currentThemeConfig.name}</span>
        </span>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-3 shadow-2xl shadow-black/60 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 px-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold text-slate-100">视觉设计风格 (Theme Styles)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              4 种工业级设计语言
            </span>
          </div>

          {/* Theme Option Cards */}
          <div className="space-y-1.5">
            {THEMES.map((item) => {
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTheme(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer group/theme ${
                    isSelected
                      ? 'bg-white/10 border-cyan-400/50 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Visual Color Preview Swatch */}
                    <div 
                      className="w-7 h-7 rounded-lg border flex items-center justify-center text-sm shrink-0 shadow-inner"
                      style={{ 
                        backgroundColor: item.previewBg,
                        borderColor: item.previewBorder
                      }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.previewAccent }}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-100 group-hover/theme:text-cyan-300 transition-colors truncate">
                          {item.name}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${
                          item.id === 'linear' 
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' 
                            : item.id === 'light'
                            ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                            : 'bg-white/5 text-slate-400 border-white/10'
                        }`}>
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-1.5 border-t border-white/10 px-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>实时生效 · 支持持久化记忆</span>
            <span className="font-mono text-cyan-400">System v2.6</span>
          </div>
        </div>
      )}
    </div>
  );
};

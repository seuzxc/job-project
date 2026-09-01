import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'apple' | 'linear' | 'light' | 'titanium' | 'cyber';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  subtitle: string;
  tag: string;
  icon: string;
  previewBg: string;
  previewCard: string;
  previewBorder: string;
  previewAccent: string;
  textColor: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'apple',
    name: '现代苹果 (Apple Cupertino)',
    subtitle: 'macOS Sequoia 亚克力毛玻璃 · 连续圆角 Bento 便当盒',
    tag: '官方推荐 · 旗舰品质',
    icon: '🍎',
    previewBg: '#f5f5f7',
    previewCard: '#ffffff',
    previewBorder: 'rgba(0,0,0,0.08)',
    previewAccent: '#0071e3',
    textColor: 'text-[#1d1d1f]'
  },
  {
    id: 'linear',
    name: 'Linear 极简暗黑',
    subtitle: 'Vercel / Linear 现代黑曜石与精密微边框',
    tag: '极客 · 暗色',
    icon: '⬛',
    previewBg: '#09090b',
    previewCard: '#18181b',
    previewBorder: '#27272a',
    previewAccent: '#38bdf8',
    textColor: 'text-zinc-100'
  },
  {
    id: 'light',
    name: 'Notion 极简白昼',
    subtitle: 'Stripe / Notion 纯白昼卡片与高对比度易读排版',
    tag: '明亮 · 纯白',
    icon: '⬜',
    previewBg: '#f8fafc',
    previewCard: '#ffffff',
    previewBorder: '#e2e8f0',
    previewAccent: '#0284c7',
    textColor: 'text-slate-900'
  },
  {
    id: 'titanium',
    name: '北欧钛灰工作室',
    subtitle: '哑光石墨灰与沉浸式冷灰质感',
    tag: '优雅 · 沉静',
    icon: '🔘',
    previewBg: '#131418',
    previewCard: '#1c1d22',
    previewBorder: '#2e3038',
    previewAccent: '#10b981',
    textColor: 'text-stone-100'
  },
  {
    id: 'cyber',
    name: '深空霓虹科技',
    subtitle: '经典深空黑曜石与荧光青蓝呼吸光晕',
    tag: '科技 · 动态',
    icon: '🌌',
    previewBg: '#0a0c10',
    previewCard: '#0f172a',
    previewBorder: 'rgba(6,182,212,0.3)',
    previewAccent: '#06b6d4',
    textColor: 'text-cyan-300'
  }
];

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  currentThemeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('career_agent_theme') as ThemeMode;
    return saved && ['apple', 'linear', 'light', 'titanium', 'cyber'].includes(saved) ? saved : 'apple';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('career_agent_theme', newTheme);
  };

  const currentThemeConfig = THEMES.find(t => t.id === theme) || THEMES[0];

  useEffect(() => {
    // Remove all previous theme classes
    document.documentElement.classList.remove('theme-apple', 'theme-linear', 'theme-light', 'theme-titanium', 'theme-cyber');
    document.documentElement.classList.add(`theme-${theme}`);
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentThemeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

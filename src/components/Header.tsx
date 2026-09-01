import React from 'react';
import { 
  Bot, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Layers, 
  Play, 
  FastForward, 
  BookOpen, 
  ExternalLink,
  RefreshCw,
  Sliders,
  Network,
  FolderGit2
} from 'lucide-react';
import { HarnessState } from '../types/harness';
import { STATE_LABELS } from '../data/mockData';
import { ThemeSwitcher } from './ThemeSwitcher';

interface HeaderProps {
  currentState: HarnessState;
  isRunning: boolean;
  onOpenArchitecture: () => void;
  onOpenAgentCollaboration: () => void;
  onOpenSharedContext: () => void;
  onOpenToolRegistry: () => void;
  onOpenProfile: () => void;
  onReset: () => void;
  assetsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentState,
  isRunning,
  onOpenArchitecture,
  onOpenAgentCollaboration,
  onOpenSharedContext,
  onOpenToolRegistry,
  onOpenProfile,
  onReset,
  assetsCount
}) => {
  const stateMeta = STATE_LABELS[currentState] || { label: currentState, desc: '', icon: '⚡' };

  return (
    <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-30 px-4 py-2.5 shadow-lg shadow-black/20">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Brand & Product Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950/90 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Career Agent <span className="text-cyan-400">Harness</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  v2.6 Enterprise Engine
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              多 Agent 求职工作流系统 · LLM + Tool Calling + Harness + Human-in-the-Loop + 知识库回写
            </p>
          </div>
        </div>

        {/* Right: Quick Action Modals & Badges */}
        <div className="flex items-center gap-2">
          {/* Visual Theme Switcher */}
          <ThemeSwitcher />

          {/* Architecture Spec Button */}
          <button
            onClick={onOpenArchitecture}
            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-slate-200 rounded-xl text-xs font-medium transition-all hover:border-cyan-500/40 flex items-center gap-1.5 cursor-pointer"
            title="查看多 Agent Harness 架构设计规范与交互逻辑"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">架构设计全景</span>
          </button>

          {/* Multi-Agent Collaboration Modal Button */}
          <button
            onClick={onOpenAgentCollaboration}
            className="px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-medium transition-all hover:border-cyan-500/60 flex items-center gap-1.5 cursor-pointer shadow-sm shadow-cyan-500/10"
            title="查看多 Agent 星型协同拓扑、DAG 执行编排、消息总线与效能治理"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Agent 协同拓扑</span>
          </button>

          {/* Tool Registry Button */}
          <button
            onClick={onOpenToolRegistry}
            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-slate-200 rounded-xl text-xs font-medium transition-all hover:border-cyan-500/40 flex items-center gap-1.5 cursor-pointer"
            title="查看注册的四大类工具 Schema 及调用权限"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Tool Registry</span>
          </button>

          {/* Candidate Assets Vault */}
          <button
            onClick={onOpenProfile}
            className="px-2.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-medium transition-all hover:border-indigo-500/60 flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-500/10"
            title="查看与管理全局资产（自我介绍、定位、风险与边界、项目资产、AI知识库、机会评估、Mock面试、面试复盘）"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">全局资产管理</span>
            {assetsCount !== undefined && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-indigo-500/20 border border-indigo-500/30 text-indigo-200">
                {assetsCount}
              </span>
            )}
          </button>

          {/* Desensitized Badge */}
          <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md rounded-xl text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">100% 虚构脱敏</span>
          </div>
        </div>
      </div>
    </header>
  );
};

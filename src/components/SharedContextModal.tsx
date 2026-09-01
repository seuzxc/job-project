import React, { useState } from 'react';
import { 
  Database, 
  Code2, 
  Eye, 
  Check, 
  Copy, 
  User, 
  FileCheck2, 
  Sparkles,
  Layers,
  X,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { SharedRunContext } from '../types/harness';

interface SharedContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  runContext: SharedRunContext;
}

export const SharedContextModal: React.FC<SharedContextModalProps> = ({
  isOpen,
  onClose,
  runContext
}) => {
  const [activeTab, setActiveTab] = useState<'structured' | 'json'>('structured');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(runContext, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl text-white shadow-lg shadow-cyan-500/25">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Shared Run Context 全局上下文
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Read-only Snapshot · Centralized Merge
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                所有 Agent 统一通过只读快照 + 集中裁决共享全局上下文，彻底避免信息割裂与重复加载
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Structured / JSON Switcher */}
            <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveTab('structured')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                  activeTab === 'structured'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                结构化概览
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                  activeTab === 'json'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                JSON Payload
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'structured' ? (
            <div className="space-y-4">
              {/* Top Banner Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Run Identifier</span>
                  <div className="text-sm font-mono font-bold text-cyan-300">
                    {runContext.runId}
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    唯一会话 ID · 状态机隔离
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">活跃求职目标</span>
                  <div className="text-sm font-bold text-slate-200 truncate">
                    {runContext.activeOpportunity?.company || '全局求职资产库'}
                  </div>
                  <span className="text-[10px] text-emerald-400 block font-mono">
                    {runContext.activeOpportunity?.salaryRange || '45k-65k · 16薪'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">一致性保障机制</span>
                  <div className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>只读快照 + 集中裁决</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    杜绝各 Agent 越权写冲突
                  </span>
                </div>
              </div>

              {/* Candidate Profile Details */}
              <div className="bg-slate-950/60 rounded-2xl border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold text-slate-200">
                      候选人基准画像 (Candidate Baseline Persona)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    {runContext.candidateProfile.experienceYears} 年经验 · {runContext.candidateProfile.title}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-slate-400 block font-mono text-[10px]">核心定位与竞争优势:</span>
                    <div className="space-y-1 pt-0.5">
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {runContext.candidateProfile.positioning}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {runContext.candidateProfile.strengths.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-slate-200 border border-white/10 text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-slate-400 block font-mono text-[10px]">定位与不可妥协底线 (Risk Boundaries):</span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                      {runContext.candidateProfile.riskBoundaries.map((b, i) => (
                        <li key={i} className="text-[10px]">{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Retrieved Assets for this Run */}
              <div className="bg-slate-950/60 rounded-2xl border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-slate-200">
                      本次运行挂载的资产文件 (Retrieved Assets)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {runContext.retrievedAssets.length} 项已挂载
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {runContext.retrievedAssets.map((assetName, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-200 font-mono truncate">{assetName}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {assetName.endsWith('.pdf') ? 'PDF' : 'MD'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-mono">
                        已注入只读快照供各专职 Agent 实时索引与检索
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  SharedRunContext 全量不可变状态树
                </span>
                <button
                  onClick={handleCopyJson}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 flex items-center gap-1.5 text-[10px] font-mono transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? '已复制到剪贴板' : '复制 JSON'}
                </button>
              </div>
              <pre className="p-4 bg-slate-950/80 rounded-2xl border border-white/10 text-slate-300 font-mono text-[11px] max-h-[60vh] overflow-y-auto leading-relaxed">
                {JSON.stringify(runContext, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

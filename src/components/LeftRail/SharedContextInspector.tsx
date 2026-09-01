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
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SharedRunContext } from '../../types/harness';

interface SharedContextInspectorProps {
  runContext: SharedRunContext;
}

export const SharedContextInspector: React.FC<SharedContextInspectorProps> = ({ runContext }) => {
  const [activeTab, setActiveTab] = useState<'structured' | 'json'>('structured');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(runContext, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Shared Run Context</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 text-[10px]">
            <button
              onClick={() => setActiveTab('structured')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTab === 'structured' ? 'bg-white/10 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              概览
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTab === 'json' ? 'bg-white/10 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              JSON
            </button>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-200"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        所有 Agent 统一通过只读快照 + 集中裁决共享全局上下文，彻底避免信息割裂与重复加载。
      </p>

      {isExpanded && (
        <>
          {activeTab === 'structured' ? (
            <div className="space-y-2 text-xs">
              {/* Run ID & Workflow */}
              <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Run ID:</span>
                  <span className="font-mono text-cyan-300 font-semibold">{runContext.runId}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">活跃目标:</span>
                  <span className="text-slate-200 font-medium truncate max-w-[140px]">
                    {runContext.activeOpportunity?.company || '全局求职资产库'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">薪资/职级预设:</span>
                  <span className="text-emerald-400 font-mono">
                    {runContext.activeOpportunity?.salaryRange || '45k-65k · 16薪'}
                  </span>
                </div>
              </div>

              {/* Candidate Info Capsule */}
              <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium text-[11px]">
                  <User className="w-3 h-3 text-cyan-400" />
                  <span>{runContext.candidateProfile.name}</span>
                  <span className="text-slate-500 font-normal">({runContext.candidateProfile.experienceYears} 年经验)</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {runContext.candidateProfile.positioning}
                </p>
              </div>

              {/* Loaded Assets Count */}
              <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <FileCheck2 className="w-3 h-3 text-amber-400" />
                    已挂载资产 ({runContext.retrievedAssets.length}):
                  </span>
                  <span className="text-slate-400 font-mono text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10">Read-Only</span>
                </div>
                <div className="space-y-1">
                  {runContext.retrievedAssets.map((asset, idx) => (
                    <div key={idx} className="text-[10px] text-slate-300 font-mono bg-white/5 px-2 py-1 rounded-lg border border-white/10 truncate">
                      📄 {asset}
                    </div>
                  ))}
                </div>
              </div>

              {/* Human Review Status */}
              <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">门禁确认状态:</span>
                <span className={`px-2.5 py-0.5 rounded-lg font-mono font-medium ${
                  runContext.humanReviewStatus === 'approved'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : runContext.humanReviewStatus === 'pending_review'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                    : 'bg-white/5 text-slate-400 border border-white/10'
                }`}>
                  {runContext.humanReviewStatus === 'approved' ? '已授权写回' : runContext.humanReviewStatus === 'pending_review' ? '等待人工确认' : '未就绪'}
                </span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <pre className="bg-slate-950/90 text-slate-300 p-3 rounded-xl border border-white/10 font-mono text-[10px] max-h-64 overflow-y-auto leading-relaxed">
                {JSON.stringify(runContext, null, 2)}
              </pre>
              <button
                onClick={handleCopyJson}
                className="absolute top-2 right-2 px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-[10px] text-slate-200 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 text-cyan-400" />}
                {copied ? '已复制' : '复制 JSON'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

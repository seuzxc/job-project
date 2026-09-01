import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  X, 
  FileText, 
  Edit3, 
  FolderCheck, 
  AlertCircle,
  Eye,
  GitPullRequest
} from 'lucide-react';
import { WritebackPlanItem, SharedRunContext } from '../../types/harness';

interface HumanReviewGateProps {
  runContext: SharedRunContext;
  onApproveWriteback: () => void;
  onRejectWriteback: () => void;
  onToggleItem: (id: string) => void;
  isRunning: boolean;
}

export const HumanReviewGate: React.FC<HumanReviewGateProps> = ({
  runContext,
  onApproveWriteback,
  onRejectWriteback,
  onToggleItem,
  isRunning
}) => {
  const isPending = runContext.humanReviewStatus === 'pending_review';
  const isApproved = runContext.humanReviewStatus === 'approved';
  const isRejected = runContext.humanReviewStatus === 'rejected';
  const planItems = runContext.writebackPlan;

  return (
    <div className={`backdrop-blur-xl border rounded-2xl p-4 shadow-xl shadow-black/20 space-y-3.5 transition-all ${
      isPending
        ? 'bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/20 shadow-amber-950/30 animate-in fade-in'
        : isApproved
        ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/20'
        : 'bg-white/5 border-white/10'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
              <ShieldAlert className="w-4 h-4" />
            </div>
          ) : isApproved ? (
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400">
              <GitPullRequest className="w-4 h-4" />
            </div>
          )}
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Human Review Gate (人工确认门禁)
            </h3>
            <p className="text-[11px] text-slate-400">
              {isPending
                ? '⚠️ 门禁已拦截：请审查下方写回项与差异对比，确认是否物理写入知识库'
                : isApproved
                ? '✅ 人工授权已通过，已由 Memory Curator Agent 执行写回'
                : '知识库回写安全防护罩 (Prevent Hallucination Writeback)'}
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
          isPending
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
            : isApproved
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            : 'bg-white/5 border border-white/10 text-slate-400'
        }`}>
          {isPending ? 'Pending Approval' : isApproved ? 'Approved' : 'Gate Arming'}
        </span>
      </div>

      {/* Writeback Items Checklist */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 font-semibold block">
          待审核写回知识清单 ({planItems.length} 项):
        </span>

        {planItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (isPending) onToggleItem(item.id);
            }}
            className={`p-3 rounded-xl border transition-all ${
              item.selected
                ? 'bg-slate-900/60 border-cyan-500/50 ring-1 ring-cyan-500/20'
                : 'bg-slate-950/40 border-white/5 opacity-60'
            } ${isPending ? 'cursor-pointer hover:border-cyan-400' : ''}`}
          >
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => {}}
                disabled={!isPending}
                className="mt-0.5 rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{item.title}</span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {item.targetFolder}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons for Gate */}
      {isPending && (
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
          <button
            onClick={onRejectWriteback}
            className="px-3.5 py-1.5 bg-white/5 hover:bg-rose-500/20 text-rose-300 text-xs font-medium rounded-xl border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>拒绝写回 (Reject)</span>
          </button>

          <button
            onClick={onApproveWriteback}
            className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>人工确认并授权写回 (Approve & Writeback)</span>
          </button>
        </div>
      )}
    </div>
  );
};

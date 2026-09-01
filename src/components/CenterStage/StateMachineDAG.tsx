import React, { useState } from 'react';
import { 
  Check, 
  Circle, 
  ArrowRight, 
  ShieldAlert, 
  AlertCircle, 
  Sparkles, 
  HelpCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Info,
  ChevronDown,
  GitPullRequest,
  ArrowDown,
  FileText,
  Copy,
  FolderGit2,
  Database,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { HarnessState, SharedRunContext, WritebackPlanItem } from '../../types/harness';
import { STATE_FLOW_ORDER, STATE_LABELS, INITIAL_WRITEBACK_ITEMS } from '../../data/mockData';
import { HumanReviewGate } from '../RightRail/HumanReviewGate';

interface StateMachineDAGProps {
  currentState: HarnessState;
  runContext: SharedRunContext;
  onApproveWriteback: () => void;
  onRejectWriteback: () => void;
  onToggleItem: (id: string) => void;
  onOpenAssetInGlobalVault: (item: WritebackPlanItem) => void;
  isRunning: boolean;
}

const STATE_DETAILS: Record<HarnessState, { guard: string; artifact: string; rollback: string }> = {
  created: {
    guard: '生成全局唯一 runId，初始化空白上下文对象',
    artifact: 'SharedRunContext (Empty)',
    rollback: '重置所有暂存内存与缓存'
  },
  input_received: {
    guard: '捕获 OCR / PDF 文本 / 网页 URL，校验脱敏过滤规则',
    artifact: 'userInput.rawContent (Cleaned)',
    rollback: '提示用户补齐输入或重新上传'
  },
  parsed: {
    guard: '文档抽取模型完成分块解析与实体提取',
    artifact: 'Parsed Sections & Entities',
    rollback: '降级为标准纯文本正则解析'
  },
  context_loaded: {
    guard: '注入候选人画像 (7年AI产品) 与 3 大核心项目 STAR 资产',
    artifact: 'candidateProfile & retrievedAssets',
    rollback: '仅加载只读脱敏公开资产'
  },
  tools_called: {
    guard: '并发调用 Tool Registry，执行 4 级容错保护',
    artifact: 'toolTrace[] & externalResearch',
    rollback: '触发熔断并记录 Trace 告警'
  },
  analysis_generated: {
    guard: '专职 Agent 完成多维量化推断，组装 Writeback Plan',
    artifact: 'writebackPlan[] (Staged Markdown)',
    rollback: '触发 Reflection 重新校验 Schema'
  },
  human_review_required: {
    guard: '门禁阻断物理写入，等待人类专家在 UI 逐项审核',
    artifact: 'HumanReviewGate (Pending Authorization)',
    rollback: '若人工拒绝则取消全部暂存写回'
  },
  approved: {
    guard: '人类专家完成签字授权',
    artifact: 'humanReviewStatus = "approved"',
    rollback: '保留审核历史并归档'
  },
  written_back: {
    guard: 'Memory Curator 执行安全沙箱写入',
    artifact: 'Obsidian Vault Markdown Files',
    rollback: '原子撤销已写入文件并恢复快照'
  },
  completed: {
    guard: '状态机收敛，闭环完成',
    artifact: 'Final Run Snapshot & Trace Archive',
    rollback: '只读归档'
  },
  tool_failed: {
    guard: '工具异常或超出重试上限',
    artifact: 'Error Trace Item',
    rollback: '启动熔断保护，防止死循环'
  },
  needs_user_clarification: {
    guard: '输入关键参数缺失',
    artifact: 'Clarification Prompt',
    rollback: '挂起工作流等待用户补充'
  },
  writeback_rejected: {
    guard: '人工在门禁中拒绝写回',
    artifact: 'Rejection Log & Staged Trash',
    rollback: '放弃写回，保留只读报告'
  }
};

export const StateMachineDAG: React.FC<StateMachineDAGProps> = ({ 
  currentState,
  runContext,
  onApproveWriteback,
  onRejectWriteback,
  onToggleItem,
  onOpenAssetInGlobalVault,
  isRunning
}) => {
  const [selectedState, setSelectedState] = useState<HarnessState | null>(null);
  const currentIndex = STATE_FLOW_ORDER.indexOf(currentState);
  const isSpecialState = currentState === 'tool_failed' || currentState === 'needs_user_clarification' || currentState === 'writeback_rejected';

  const isGatePending = runContext.humanReviewStatus === 'pending_review';
  const isGateApproved = runContext.humanReviewStatus === 'approved';
  const isWrittenBackOrBeyond = currentIndex >= 8 || currentState === 'written_back' || currentState === 'completed';

  // Current active files to write back
  const currentPlanItems = runContext.writebackPlan && runContext.writebackPlan.length > 0
    ? runContext.writebackPlan
    : INITIAL_WRITEBACK_ITEMS.slice(0, 1);

  const [selectedTargetFileId, setSelectedTargetFileId] = useState<string>(
    currentPlanItems[0]?.id || INITIAL_WRITEBACK_ITEMS[0]?.id || ''
  );
  const [copiedPath, setCopiedPath] = useState(false);

  const activeTargetFile = currentPlanItems.find(f => f.id === selectedTargetFileId) || currentPlanItems[0] || INITIAL_WRITEBACK_ITEMS[0];
  const fullTargetFilePath = `${activeTargetFile?.targetFolder || ''}${activeTargetFile?.targetFileName || ''}`;

  const handleCopyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!fullTargetFilePath) return;
    navigator.clipboard.writeText(fullTargetFilePath);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const activeInspectState = selectedState || currentState;
  const activeDetail = STATE_DETAILS[activeInspectState] || STATE_DETAILS['created'];
  const activeMeta = STATE_LABELS[activeInspectState];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs">
            ⚙️
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Harness 确定性状态机 (Deterministic State Machine)
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isGatePending && (
            <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 animate-pulse flex items-center gap-1 font-bold">
              <ShieldAlert className="w-3 h-3" />
              7号节点门禁待审批
            </span>
          )}
          <div className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
            收敛保障 · 无死循环
          </div>
        </div>
      </div>

      {/* State Details Drawer (Moved ABOVE the State Machine Progress Bar) */}
      <div className="p-3 bg-slate-950/70 border border-white/10 rounded-xl space-y-2 text-xs backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{activeMeta.icon}</span>
            <span className="font-mono font-bold text-cyan-300">
              {activeMeta.label}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ({activeMeta.desc})
            </span>
          </div>
          {currentState === activeInspectState && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              ● 当前运行状态 (Current)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] font-mono pt-1">
          <div className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
            <span className="text-slate-400 block font-bold">状态前置条件 (Entrance Guard):</span>
            <span className="text-slate-200">{activeDetail.guard}</span>
          </div>
          <div className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
            <span className="text-slate-400 block font-bold">产出资产 (State Artifact):</span>
            <span className="text-cyan-300 font-bold">{activeDetail.artifact}</span>
          </div>
          <div className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
            <span className="text-slate-400 block font-bold">安全兜底策略 (Rollback Invariant):</span>
            <span className="text-slate-200">{activeDetail.rollback}</span>
          </div>
        </div>
      </div>

      {/* Main Linear Transition Flow (Harness 状态机进度条) */}
      <div className="overflow-x-auto pb-2 pt-1">
        <div className="flex items-center min-w-[720px] justify-between relative px-2">
          {/* Background connect line */}
          <div className="absolute left-6 right-6 top-4 h-0.5 bg-white/10 -z-0" />

          {STATE_FLOW_ORDER.map((state, idx) => {
            const isPassed = currentIndex > idx && !isSpecialState;
            const isCurrent = currentState === state;
            const isSelected = selectedState === state;
            const meta = STATE_LABELS[state];
            const isNode7 = idx === 6; // 7. human_review_required
            const isNode9 = idx === 8; // 9. written_back

            return (
              <div 
                key={state} 
                onClick={() => setSelectedState(state === selectedState ? null : state)}
                className="relative z-10 flex flex-col items-center group cursor-pointer"
              >
                {/* Node 7 Special Indicator Badge */}
                {isNode7 && isGatePending && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-20 pointer-events-none">
                    <span className="text-[8px] font-mono font-bold bg-amber-500 text-slate-950 px-1 py-0.2 rounded shadow">
                      Gate!
                    </span>
                  </div>
                )}

                {/* Node 9 Special Indicator Badge */}
                {isNode9 && (currentState === 'written_back' || isGateApproved) && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
                    <span className="text-[8px] font-mono font-bold bg-emerald-500 text-slate-950 px-1 py-0.2 rounded shadow">
                      Vault
                    </span>
                  </div>
                )}

                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono transition-all duration-300 ${
                    isCurrent
                      ? isNode7
                        ? 'bg-amber-400 text-slate-950 font-bold ring-4 ring-amber-400/40 scale-110 shadow-lg shadow-amber-500/50 animate-pulse'
                        : isNode9
                        ? 'bg-emerald-400 text-slate-950 font-bold ring-4 ring-emerald-400/40 scale-110 shadow-lg shadow-emerald-500/50 animate-pulse'
                        : 'bg-cyan-400 text-slate-950 font-bold ring-4 ring-cyan-400/30 scale-110 shadow-lg shadow-cyan-500/40 animate-pulse'
                      : isPassed
                      ? 'bg-emerald-400/90 text-slate-950 font-bold shadow-sm'
                      : isSelected
                      ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-200'
                      : isNode7
                      ? 'bg-slate-950/90 border-2 border-amber-500/40 text-amber-300 hover:border-amber-400'
                      : isNode9
                      ? 'bg-slate-950/90 border-2 border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
                      : 'bg-slate-950/80 border border-white/15 text-slate-400 hover:border-white/30'
                  }`}
                >
                  {isPassed ? <Check className="w-4 h-4 text-slate-950 stroke-[2.5]" /> : isCurrent ? meta.icon : idx + 1}
                </div>

                <div className="text-center mt-1.5 space-y-0.5">
                  <span
                    className={`text-[10px] font-mono whitespace-nowrap block transition-colors ${
                      isCurrent
                        ? isNode7 
                          ? 'text-amber-300 font-bold' 
                          : isNode9
                          ? 'text-emerald-300 font-bold'
                          : 'text-cyan-300 font-bold'
                        : isPassed
                        ? 'text-emerald-300 font-medium'
                        : isSelected
                        ? 'text-cyan-200'
                        : isNode7
                        ? 'text-amber-400/80 group-hover:text-amber-200 font-medium'
                        : isNode9
                        ? 'text-emerald-400/80 group-hover:text-emerald-200 font-medium'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {meta.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Human Review Gate Confirmation Box (随着进度条到达节点7联动出现) */}
      {(currentIndex >= 6 || selectedState === 'human_review_required' || isGatePending) && (
        <div className="pt-1 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative">
            {/* Visual pointer connecting Node 7 to the Gate confirmation card */}
            <div className="flex items-center justify-between mb-1.5 px-1 text-xs">
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-400">
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                <span className="bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  [节点 7] Human Review Gate 人工确认门禁交互区
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {isGateApproved ? '✓ 门禁审核已通过' : isGatePending ? '⏳ 等待人工审批' : '已到达节点 7'}
              </span>
            </div>

            <HumanReviewGate
              runContext={runContext}
              onApproveWriteback={onApproveWriteback}
              onRejectWriteback={onRejectWriteback}
              onToggleItem={onToggleItem}
              isRunning={isRunning}
            />
          </div>
        </div>
      )}

      {/* SECTION 2: Node 9 Written-Back Target File Path Action Card (随着进度条到达节点9联动出现，已移除提示部分) */}
      {(currentIndex >= 8 || selectedState === 'written_back' || currentState === 'written_back' || currentState === 'completed') && (
        <div className="pt-1 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative">
            {/* Visual pointer connecting Node 9 to the written-back target path card */}
            <div className="flex items-center justify-between mb-1.5 px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400">
                  <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                  <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    [节点 9] Written-Back 写入目标文件路径
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                <span className={`px-2 py-0.5 rounded-full border ${
                  isWrittenBackOrBeyond
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : isGateApproved
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 border-white/10'
                }`}>
                  {isWrittenBackOrBeyond 
                    ? '✓ 已落盘安全沙箱' 
                    : isGateApproved 
                    ? '⏳ 授权完毕·正在执行回写' 
                    : '🔒 等待门禁授权'}
                </span>
              </div>
            </div>

            {/* Node 9 Content Card: Only Target Path with Jump to Global Asset Management (Tip section removed) */}
            <div className="bg-slate-950/70 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-3.5 shadow-xl shadow-black/20 space-y-3">
              {/* Multiple files tab switcher if applicable */}
              {currentPlanItems.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {currentPlanItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedTargetFileId(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        activeTargetFile?.id === item.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                          : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                      }`}
                    >
                      <FileText className="w-3 h-3 text-emerald-400" />
                      <span>{item.targetFileName}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Target Path Action Banner */}
              <div className="bg-slate-900/90 border border-white/10 hover:border-emerald-500/40 rounded-xl p-3.5 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        当前写入目标文件路径 (Target File Path):
                      </span>
                    </div>
                    
                    {/* Clickable Path Area */}
                    <button
                      onClick={() => onOpenAssetInGlobalVault(activeTargetFile)}
                      className="w-full text-left group/path flex items-center justify-between gap-3 bg-slate-950/90 hover:bg-emerald-950/30 px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer shadow-inner"
                      title="点击跳转到全局资产管理中查看此文件"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover/path:scale-105 transition-transform shrink-0">
                          <FolderGit2 className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-xs text-slate-100 font-bold truncate group-hover/path:text-emerald-300 transition-colors">
                          {fullTargetFilePath}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 group-hover/path:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium shrink-0 transition-colors">
                        <span>跳转全局资产管理查看</span>
                        <ExternalLink className="w-3 h-3 group-hover/path:translate-x-0.5 group-hover/path:-translate-y-0.5 transition-transform" />
                      </div>
                    </button>
                  </div>

                  {/* Secondary Copy Button */}
                  <div className="flex items-center gap-2 sm:self-end shrink-0">
                    <button
                      onClick={handleCopyPath}
                      className="px-3 py-2 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="复制目标文件路径"
                    >
                      {copiedPath ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{copiedPath ? '已复制路径' : '复制路径'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Special Branch State Bar (if triggered) */}
      {isSpecialState && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between text-xs text-rose-300 animate-in fade-in backdrop-blur-md">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold">分支触发: {STATE_LABELS[currentState]?.label}</span>
              <p className="text-[11px] text-rose-300/80">{STATE_LABELS[currentState]?.desc}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-200 border border-rose-500/30">
            Harness Safety Rollback
          </span>
        </div>
      )}
    </div>
  );
};

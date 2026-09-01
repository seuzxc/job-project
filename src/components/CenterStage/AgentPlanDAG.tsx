import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  GitFork, 
  ShieldCheck,
  BrainCircuit,
  MessageSquare,
  Network,
  Activity,
  Layers,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Zap,
  Radio,
  Lock,
  ArrowUpRight,
  Database
} from 'lucide-react';
import { WorkflowId, AgentId, HarnessState, AgentMessage } from '../../types/harness';
import { AGENT_DIRECTORY, WORKFLOWS_CONFIG, getInterAgentMessages } from '../../data/mockData';

interface AgentPlanDAGProps {
  workflowId: WorkflowId;
  currentState: HarnessState;
  isRunning: boolean;
}

type ViewMode = 'topology' | 'dag_phases' | 'message_bus' | 'metrics';

export const AgentPlanDAG: React.FC<AgentPlanDAGProps> = ({
  workflowId,
  currentState,
  isRunning
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('topology');
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [selectedMsgTypeFilter, setSelectedMsgTypeFilter] = useState<string>('ALL');

  const currentWorkflow = WORKFLOWS_CONFIG.find((w) => w.id === workflowId)!;
  const primaryAgentId = currentWorkflow.primaryAgent;
  const primaryAgent = AGENT_DIRECTORY[primaryAgentId];
  const orchestrator = AGENT_DIRECTORY['orchestrator_agent'];
  const memoryCurator = AGENT_DIRECTORY['memory_curator_agent'];

  const messages: AgentMessage[] = getInterAgentMessages(workflowId, currentState);

  const getOrchestratorThought = () => {
    switch (currentState) {
      case 'created':
      case 'input_received':
        return '正在解析用户输入结构与意图，准备将候选人画像与定位规则注入 Run Context...';
      case 'parsed':
      case 'context_loaded':
        return `Run Context 已就绪，分派专职 [${primaryAgent.name}] 启动领域推断链路...`;
      case 'tools_called':
        return `[${primaryAgent.name}] 正在并发调用 Tool Registry，检索必要背景与知识资产...`;
      case 'analysis_generated':
        return '结构化推断已生成，生成 Writeback Plan 并交由 Human Review Gate 门禁拦截...';
      case 'human_review_required':
        return '门禁拦截中：等待人类专家在右侧审查写回项与 Markdown 差异对比...';
      case 'approved':
      case 'written_back':
        return `门禁已授权！分派 [${memoryCurator.name}] 执行安全写回至 Obsidian 知识库...`;
      case 'completed':
        return '全链路闭环完成，所有 Agent 协同记录与执行轨迹已归档。';
      case 'tool_failed':
        return '捕获到工具调用异常，启动熔断保护机制并记录 Trace...';
      case 'needs_user_clarification':
        return '缺少必要输入参数，向用户发起澄清提示...';
      case 'writeback_rejected':
        return '人工拒绝知识库写回，回滚暂存区文件，终止写入操作。';
      default:
        return 'Orchestrator 正在维护全局状态机收敛...';
    }
  };

  const handleCopyMessage = (msg: AgentMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(msg.fullPayload, null, 2));
    setCopiedMsgId(msg.id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    if (selectedMsgTypeFilter === 'ALL') return true;
    return m.type === selectedMsgTypeFilter;
  });

  // Calculate dynamic active state of agents
  const isOrchestratorActive = true;
  const isPrimaryActive = ['parsed', 'context_loaded', 'tools_called', 'analysis_generated'].includes(currentState);
  const isMemoryCuratorActive = ['analysis_generated', 'human_review_required', 'approved', 'written_back'].includes(currentState);

  // Satellite agents list for topology layout
  const satelliteAgents: { id: AgentId; angle: number; isPrimary: boolean; isActive: boolean }[] = [
    { id: 'jd_opportunity_agent', angle: -140, isPrimary: primaryAgentId === 'jd_opportunity_agent', isActive: primaryAgentId === 'jd_opportunity_agent' && isPrimaryActive },
    { id: 'interview_recap_agent', angle: -70, isPrimary: primaryAgentId === 'interview_recap_agent', isActive: primaryAgentId === 'interview_recap_agent' && isPrimaryActive },
    { id: 'mock_interview_agent', angle: 0, isPrimary: primaryAgentId === 'mock_interview_agent', isActive: primaryAgentId === 'mock_interview_agent' && isPrimaryActive },
    { id: 'knowledge_intake_agent', angle: 70, isPrimary: primaryAgentId === 'knowledge_intake_agent', isActive: primaryAgentId === 'knowledge_intake_agent' && isPrimaryActive },
    { id: 'memory_curator_agent', angle: 140, isPrimary: false, isActive: isMemoryCuratorActive }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20 space-y-3.5">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Multi-Agent 协作与通信中枢
              <span className="text-[10px] font-mono font-normal text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Star Topology
              </span>
            </h3>
          </div>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setViewMode('topology')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
              viewMode === 'topology'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3 h-3" />
            <span>拓扑与通信</span>
          </button>

          <button
            onClick={() => setViewMode('dag_phases')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
              viewMode === 'dag_phases'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitFork className="w-3 h-3" />
            <span>执行编排 DAG</span>
          </button>

          <button
            onClick={() => setViewMode('message_bus')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer relative ${
              viewMode === 'message_bus'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            <span>消息总线</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          <button
            onClick={() => setViewMode('metrics')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
              viewMode === 'metrics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>效能治理</span>
          </button>
        </div>
      </div>

      {/* Orchestrator Live Thought Balloon */}
      <div className="p-3.5 bg-slate-950/70 backdrop-blur-md border border-cyan-500/30 rounded-xl flex items-start gap-3 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
        <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0 mt-0.5">
          <BrainCircuit className="w-4 h-4" />
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-300 font-mono">Orchestrator 调度决策实况</span>
              {isRunning ? (
                <span className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Reasoning & Dispatching...
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono">State: {currentState}</span>
              )}
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              Run Context Synced
            </span>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            {getOrchestratorThought()}
          </p>
        </div>
      </div>

      {/* View 1: Interactive Star Topology Graph with Animated Message Signals */}
      {viewMode === 'topology' && (
        <div className="space-y-3">
          {/* SVG Animated Topology Canvas */}
          <div className="relative bg-slate-950/80 rounded-2xl border border-white/10 p-4 h-[270px] flex items-center justify-center overflow-hidden">
            {/* Grid backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
            
            {/* Center Orchestrator Node */}
            <div 
              onClick={() => setSelectedAgentId('orchestrator_agent')}
              className="absolute z-20 flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
              style={{ left: '50%', top: '48%', transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600/90 to-cyan-700/90 border-2 border-cyan-400 shadow-lg shadow-cyan-500/30 flex items-center justify-center text-2xl backdrop-blur-md">
                  🎯
                </div>
                {/* Active pulse ring */}
                <div className="absolute -inset-1 rounded-2xl border border-cyan-400/50 animate-ping pointer-events-none opacity-40" />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-indigo-950 border border-cyan-400/50 text-[9px] font-mono font-bold text-cyan-300">
                  HUB
                </span>
              </div>
              <span className="text-[11px] font-bold text-cyan-200 mt-1 font-mono">Orchestrator</span>
              <span className="text-[9px] text-slate-400 font-mono">意图路由与调度</span>
            </div>

            {/* Satellite Agent Nodes positioned radially */}
            {satelliteAgents.map((sat, idx) => {
              const agent = AGENT_DIRECTORY[sat.id];
              // Radius in px
              const radiusX = 175;
              const radiusY = 88;
              const rad = (sat.angle * Math.PI) / 180;
              const leftPercent = 50 + (radiusX * Math.cos(rad)) / 2.2;
              const topPercent = 48 + (radiusY * Math.sin(rad)) / 1.5;

              return (
                <div
                  key={sat.id}
                  onClick={() => setSelectedAgentId(sat.id)}
                  className={`absolute z-20 flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 ${
                    sat.isActive ? 'opacity-100 scale-105' : sat.isPrimary ? 'opacity-90' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="relative">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg border transition-all ${
                      sat.isActive
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-500/30'
                        : sat.isPrimary
                        ? 'bg-slate-900/90 border-cyan-500/50'
                        : 'bg-slate-900/80 border-white/10'
                    }`}>
                      {agent.avatar}
                    </div>

                    {sat.isActive && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-pulse" />
                    )}

                    {sat.isPrimary && (
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-[8px] font-mono text-cyan-300 font-bold">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-mono font-medium mt-1 truncate max-w-[90px] text-center ${
                    sat.isActive ? 'text-cyan-300 font-bold' : 'text-slate-300'
                  }`}>
                    {agent.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}

            {/* SVG Connecting Curves & Flow Animation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Connecting dashed lines from Hub to all Satellite Nodes */}
              {satelliteAgents.map((sat) => {
                const radiusX = 175;
                const radiusY = 88;
                const rad = (sat.angle * Math.PI) / 180;
                // Center coordinates (assuming 400x270 approx)
                const cx = 50; // in percent
                const cy = 48; // in percent
                const targetX = 50 + (radiusX * Math.cos(rad)) / 2.2;
                const targetY = 48 + (radiusY * Math.sin(rad)) / 1.5;

                return (
                  <g key={`line_${sat.id}`}>
                    <line
                      x1={`${cx}%`}
                      y1={`${cy}%`}
                      x2={`${targetX}%`}
                      y2={`${targetY}%`}
                      stroke={sat.isActive ? '#22d3ee' : '#334155'}
                      strokeWidth={sat.isActive ? '2' : '1'}
                      strokeDasharray={sat.isActive ? '4 4' : '2 2'}
                      strokeOpacity={sat.isActive ? 0.9 : 0.4}
                      className={sat.isActive ? 'animate-[dash_1.5s_linear_infinite]' : ''}
                    />
                    {sat.isActive && (
                      <circle
                        r="3.5"
                        fill="#22d3ee"
                        filter="url(#glow)"
                        className="animate-pulse"
                      >
                        <animateMotion
                          path={`M 0,0 L ${((targetX - cx) * 3).toFixed(1)},${((targetY - cy) * 2).toFixed(1)}`}
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Bottom Floating Hint */}
            <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                点击 Agent 节点查看系统 Prompt、Tool 权限与当前执行上下文
              </span>
              <span className="text-cyan-300/80 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                双向通信协议: Shared Context RPC
              </span>
            </div>
          </div>

          {/* Quick Details of Active Primary Agent */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Phase 1: Dispatch</span>
              <div className="flex items-center gap-2">
                <span className="text-base">{orchestrator.avatar}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{orchestrator.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">意图解析与上下文注入</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 ring-1 ring-cyan-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-300 uppercase">Phase 2: Execution</span>
                <span className="text-cyan-400 text-[10px] font-mono font-bold">Active Expert</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">{primaryAgent.avatar}</span>
                <div>
                  <h4 className="text-xs font-bold text-cyan-200">{primaryAgent.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{primaryAgent.role}</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Phase 3: Writeback</span>
                <span className="text-rose-400 text-[10px] font-mono">Gate Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">{memoryCurator.avatar}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{memoryCurator.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">门禁拦截与 Obsidian 写入</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Execution Sequence DAG Phases */}
      {viewMode === 'dag_phases' && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                  Phase 1: 路由分发
                </span>
                <span className="text-emerald-400 text-[10px] font-mono">✓ Ready</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-200">Orchestrator 意图解析</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  解析用户多模态输入（OCR/PDF/长文），校验脱敏规则，装载候选人基准画像与 3 大核心项目资产。
                </p>
              </div>
              <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Output: SharedContext</span>
                <span className="text-cyan-400">200 OK</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 ring-1 ring-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                  Phase 2: 并发调用
                </span>
                <span className="text-cyan-400 text-[10px] font-mono">Concurrent</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-cyan-200">{primaryAgent.name}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  并行调用 Tool Registry 读取资产与外部行业信号，执行 5 维匹配/攻防抽取/追问链生成。
                </p>
              </div>
              <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Tools: 2-3 Concurrent</span>
                <span className="text-emerald-400">Isolated</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  Phase 3: 结构化决策
                </span>
                <span className="text-amber-400 text-[10px] font-mono">Gate Armed</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-200">生成 Writeback Plan</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  严格按 Schema 组装 Frontmatter 与 Markdown 内容，生成 Diff 摘要并向 Human Review Gate 挂起。
                </p>
              </div>
              <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Gate: Pending Review</span>
                <span className="text-amber-300">Paused</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  Phase 4: 安全落盘
                </span>
                <span className="text-slate-400 text-[10px] font-mono">Atomic</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-200">{memoryCurator.name}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  人类专家在 UI 确认授权后，Memory Curator 执行原子写回至 Obsidian 知识库，完成状态机收敛闭环。
                </p>
              </div>
              <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Vault: sample-data/</span>
                <span className="text-emerald-400">Persistent</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>DAG 确定性保障：严格单向有向无环图，禁止不可控 Agent 自主跨级回环。</span>
            </span>
            <span className="text-cyan-300">Deterministic Invariant</span>
          </div>
        </div>
      )}

      {/* View 3: Live Inter-Agent Message Bus */}
      {viewMode === 'message_bus' && (
        <div className="space-y-2.5">
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-2 pb-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400">类型过滤:</span>
              {['ALL', 'DISPATCH_TASK', 'CONTEXT_INJECTION', 'WRITEBACK_PROPOSAL', 'GATE_CONFIRMATION'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedMsgTypeFilter(t)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    selectedMsgTypeFilter === t
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/10'
                  }`}
                >
                  {t === 'ALL' ? '全部' : t}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              已捕获: <strong className="text-cyan-300">{filteredMessages.length}</strong> 条 RPC 报文
            </span>
          </div>

          {/* Messages Stream */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredMessages.map((msg) => {
              const sender = AGENT_DIRECTORY[msg.sender];
              const receiver = AGENT_DIRECTORY[msg.receiver];

              return (
                <div
                  key={msg.id}
                  className="bg-slate-950/70 border border-white/10 rounded-xl p-3 space-y-2 text-xs hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-400">{msg.timestamp}</span>
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300 flex items-center gap-1">
                        {sender?.avatar} {sender?.name.split(' ')[0]}
                        <ArrowRight className="w-3 h-3 text-slate-500 inline" />
                        {receiver?.avatar} {receiver?.name.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold border ${
                        msg.type === 'DISPATCH_TASK'
                          ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                          : msg.type === 'CONTEXT_INJECTION'
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          : msg.type === 'WRITEBACK_PROPOSAL'
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}>
                        {msg.type}
                      </span>
                      <button
                        onClick={(e) => handleCopyMessage(msg, e)}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        title="复制 Payload JSON"
                      >
                        {copiedMsgId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-200 text-[11px] font-mono leading-relaxed">
                    {msg.payloadSummary}
                  </p>

                  <div className="bg-slate-900/80 p-2 rounded-lg border border-white/5 font-mono text-[10px] text-slate-400 max-h-24 overflow-y-auto">
                    <pre>{JSON.stringify(msg.fullPayload, null, 2)}</pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 4: Agent Collaboration Metrics */}
      {viewMode === 'metrics' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">活跃 Agent 节点</span>
              <span className="text-lg font-bold text-cyan-300 font-mono">3 / 6</span>
              <span className="text-[9px] text-emerald-400 block">Hub + Primary + Curator</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">平均 Handoff 延迟</span>
              <span className="text-lg font-bold text-cyan-300 font-mono">42 ms</span>
              <span className="text-[9px] text-slate-400 block">Memory Buffer 直连</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">RPC 消息交互数</span>
              <span className="text-lg font-bold text-cyan-300 font-mono">{messages.length} 帧</span>
              <span className="text-[9px] text-emerald-400 block">100% 成功交付</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">安全门禁拦截率</span>
              <span className="text-lg font-bold text-rose-300 font-mono">100%</span>
              <span className="text-[9px] text-rose-400/90 block">0 盲目无感写入</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/10 text-xs space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Agent Token 预算分配与消耗分布
            </h4>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>🎯 Orchestrator Agent (意图分类与编排)</span>
                <span>480 Tok (12%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '12%' }} />
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>{primaryAgent.avatar} {primaryAgent.name} (结构化领域推断)</span>
                <span>2,650 Tok (68%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '68%' }} />
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>💾 Memory Curator Agent (Markdown 与 Frontmatter 格式化)</span>
                <span>720 Tok (20%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Detail Modal / Drawer when clicking any node in topology */}
      {selectedAgentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl shadow-black/60 overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{AGENT_DIRECTORY[selectedAgentId].avatar}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {AGENT_DIRECTORY[selectedAgentId].name}
                  </h3>
                  <p className="text-xs font-mono text-cyan-300">
                    {AGENT_DIRECTORY[selectedAgentId].role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgentId(null)}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-slate-300 cursor-pointer"
              >
                关闭
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 font-bold block">Agent 职责描述:</span>
                <p className="leading-relaxed text-slate-200">
                  {AGENT_DIRECTORY[selectedAgentId].desc}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block">推理模型参数:</span>
                  <span className="text-cyan-300 font-bold">Gemini 1.5 / 2.0 Flash</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block">Temperature 采样:</span>
                  <span className="text-cyan-300 font-bold">0.2 (严格确定性)</span>
                </div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 font-bold block">安全沙箱与隔离策略:</span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                  所有输入均通过只读快照访问 Run Context，禁止直接操作系统文件。写回操作统一交由 Human Review Gate 与 Memory Curator 执行。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

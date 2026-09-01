import React, { useState, useMemo } from 'react';
import { 
  Terminal, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  Copy, 
  ShieldAlert, 
  Clock, 
  Cpu, 
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  BarChart2,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  ExternalLink,
  Code2,
  Zap,
  Flame,
  FileText
} from 'lucide-react';
import { ToolTraceItem, ToolCategory } from '../../types/harness';
import { AGENT_DIRECTORY, TOOL_REGISTRY } from '../../data/mockData';

interface ToolTraceStreamProps {
  traces: ToolTraceItem[];
}

type TraceViewMode = 'inspector' | 'waterfall' | 'metrics';

export const ToolTraceStream: React.FC<ToolTraceStreamProps> = ({ traces }) => {
  const [viewMode, setViewMode] = useState<TraceViewMode>('inspector');
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(traces[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto expand first trace when traces change
  React.useEffect(() => {
    if (traces.length > 0 && !expandedTraceId) {
      setExpandedTraceId(traces[0].id);
    }
  }, [traces, expandedTraceId]);

  const handleCopy = (trace: ToolTraceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(trace, null, 2));
    setCopiedId(trace.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedTraceId(expandedTraceId === id ? null : id);
  };

  // Filter traces
  const filteredTraces = useMemo(() => {
    return traces.filter((t) => {
      const matchesSearch = 
        t.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        JSON.stringify(t.inputPayload).toLowerCase().includes(searchQuery.toLowerCase()) ||
        JSON.stringify(t.outputPayload).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.callerAgent.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [traces, searchQuery, selectedCategory, selectedStatus]);

  // Aggregate Metrics
  const totalDuration = useMemo(() => traces.reduce((acc, t) => acc + t.durationMs, 0), [traces]);
  const totalTokens = useMemo(() => traces.reduce((acc, t) => acc + t.tokensUsed, 0), [traces]);
  const maxSingleDuration = useMemo(() => Math.max(...traces.map((t) => t.durationMs), 500), [traces]);

  const getCategoryLabel = (cat: ToolCategory) => {
    switch (cat) {
      case 'asset_read':
        return { label: '资产只读', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' };
      case 'document':
        return { label: '文档抽取', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' };
      case 'external':
        return { label: '外部检索', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };
      case 'writeback':
        return { label: '知识写回', color: 'bg-rose-500/10 text-rose-300 border-rose-500/30' };
    }
  };

  const getLatencyColor = (ms: number) => {
    if (ms < 180) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (ms < 350) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20 space-y-3.5">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Tool Trace 执行轨迹与参数流
              <span className="text-[10px] font-mono font-normal text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                {traces.length} Calls Recorded
              </span>
            </h3>
          </div>
        </div>

        {/* View mode toggle tabs */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setViewMode('inspector')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
              viewMode === 'inspector'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>参数轨迹详情</span>
          </button>

          <button
            onClick={() => setViewMode('waterfall')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
              viewMode === 'waterfall'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>瀑布流时序</span>
          </button>

          <button
            onClick={() => setViewMode('metrics')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
              viewMode === 'metrics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>性能与开销</span>
          </button>
        </div>
      </div>

      {traces.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs font-mono bg-white/[0.02] rounded-2xl border border-white/10 space-y-2">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <p className="text-slate-300 font-medium">尚未启动工作流</p>
          <p className="text-slate-400 text-[11px]">
            点击上方「▶ 启动工作流」即可实时捕获并发 Tool Calling、入参校验、上下文注入与结果回填轨迹。
          </p>
        </div>
      ) : (
        <>
          {/* Filter & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索工具名、入参、出参关键词或 Agent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'asset_read', 'document', 'external', 'writeback'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/10'
                  }`}
                >
                  {cat === 'ALL' ? '全部类别' : cat === 'asset_read' ? '资产' : cat === 'document' ? '文档' : cat === 'external' ? '外部' : '写回'}
                </button>
              ))}
            </div>
          </div>

          {/* VIEW 1: Deep Parameter & Result Inspector */}
          {viewMode === 'inspector' && (
            <div className="space-y-2.5">
              {filteredTraces.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs font-mono bg-slate-950/40 rounded-xl border border-white/10">
                  没有找到符合过滤条件的 Tool Trace 记录
                </div>
              ) : (
                filteredTraces.map((trace, idx) => {
                  const isExpanded = expandedTraceId === trace.id;
                  const callerAgent = AGENT_DIRECTORY[trace.callerAgent];
                  const categoryInfo = getCategoryLabel(trace.category);
                  const toolDef = TOOL_REGISTRY.find((t) => t.name === trace.toolName);

                  return (
                    <div
                      key={trace.id}
                      className={`border rounded-2xl transition-all overflow-hidden backdrop-blur-md ${
                        isExpanded
                          ? 'bg-slate-900/70 border-cyan-500/50 ring-1 ring-cyan-500/20 shadow-lg shadow-black/30'
                          : 'bg-slate-950/50 border-white/10 hover:bg-slate-900/40 hover:border-white/20'
                      }`}
                    >
                      {/* Header row */}
                      <div
                        onClick={() => toggleExpand(trace.id)}
                        className="p-3 flex items-center justify-between gap-2 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className="text-slate-400">
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4" />}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-mono font-bold text-cyan-300 truncate">
                            {trace.toolName}()
                          </span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${categoryInfo.color}`}>
                            {categoryInfo.label}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hidden md:inline-flex items-center gap-1">
                            <span>{callerAgent?.avatar}</span>
                            <span className="truncate">{callerAgent?.name.split(' ')[0]}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 ${getLatencyColor(trace.durationMs)}`}>
                            <Clock className="w-3 h-3" />
                            {trace.durationMs}ms
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 hidden sm:inline">
                            {trace.tokensUsed} Tok
                          </span>
                          {trace.status === 'success' && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              200 OK
                            </span>
                          )}
                          {trace.status === 'gated' && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3" />
                              Gate Armed
                            </span>
                          )}
                          {trace.status === 'failed' && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Failed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expanded Payload & Parameter Stream Inspector */}
                      {isExpanded && (
                        <div className="p-4 border-t border-white/10 bg-slate-950/80 space-y-3 text-xs">
                          {/* Parameter Transmission Diagram / Pathway */}
                          <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 space-y-2">
                            <span className="text-[10px] font-mono text-slate-400 font-bold block uppercase tracking-wider">
                              🔗 参数传递与数据流向轨迹 (Data Transmission Chain)
                            </span>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                              <div className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 flex items-center gap-1.5">
                                <span>{callerAgent?.avatar}</span>
                                <span>{callerAgent?.name}</span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <div className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 font-bold">
                                {trace.toolName}()
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <div className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-200">
                                RunContext Buffer
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <div className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-200">
                                {trace.category === 'writeback' ? 'Human Review Gate' : 'Downstream Inference'}
                              </div>
                            </div>
                          </div>

                          {/* Tool Metadata bar */}
                          {toolDef && (
                            <div className="text-[11px] text-slate-400 bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                                <strong>Tool 职责:</strong> {toolDef.description}
                              </span>
                              <span className="font-mono text-[10px] text-cyan-300">
                                权限所有者: {toolDef.agentOwner.map((o) => AGENT_DIRECTORY[o]?.name.split(' ')[0]).join(', ')}
                              </span>
                            </div>
                          )}

                          {/* Two-Column IO Payload Viewer */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Input Arguments */}
                            <div className="bg-slate-900/90 border border-white/10 rounded-xl p-3 space-y-1.5 flex flex-col">
                              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                                <span className="text-cyan-400 font-mono font-bold flex items-center gap-1">
                                  <Code2 className="w-3.5 h-3.5" />
                                  // 入参 payload (Input Arguments)
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">
                                  {Object.keys(trace.inputPayload).length} keys
                                </span>
                              </div>
                              <pre className="text-slate-300 font-mono text-[11px] max-h-44 overflow-y-auto leading-relaxed bg-slate-950/70 p-2.5 rounded-lg border border-white/5 flex-1">
                                {JSON.stringify(trace.inputPayload, null, 2)}
                              </pre>
                            </div>

                            {/* Output Return Value */}
                            <div className="bg-slate-900/90 border border-white/10 rounded-xl p-3 space-y-1.5 flex flex-col">
                              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  // 返回结果 (Return Output Payload)
                                </span>
                                <button
                                  onClick={(e) => handleCopy(trace, e)}
                                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-[10px] text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  {copiedId === trace.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                                  {copiedId === trace.id ? '已复制' : '复制 JSON'}
                                </button>
                              </div>
                              <pre className="text-slate-300 font-mono text-[11px] max-h-44 overflow-y-auto leading-relaxed bg-slate-950/70 p-2.5 rounded-lg border border-white/5 flex-1">
                                {JSON.stringify(trace.outputPayload, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* VIEW 2: Waterfall Gantt Latency Timeline */}
          {viewMode === 'waterfall' && (
            <div className="space-y-3">
              <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-white/10">
                  <span>工具调用瀑布流 (Concurrency & Duration Timeline)</span>
                  <span>总耗时: <strong className="text-cyan-300">{totalDuration}ms</strong></span>
                </div>

                <div className="space-y-3">
                  {traces.map((trace, idx) => {
                    const widthPercent = Math.max((trace.durationMs / maxSingleDuration) * 100, 15);
                    const callerAgent = AGENT_DIRECTORY[trace.callerAgent];

                    return (
                      <div 
                        key={trace.id} 
                        onClick={() => {
                          setViewMode('inspector');
                          setExpandedTraceId(trace.id);
                        }}
                        className="space-y-1 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">#{idx + 1}</span>
                            <span className="text-cyan-300 font-bold group-hover:underline">
                              {trace.toolName}()
                            </span>
                            <span className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.2 rounded border border-white/10">
                              {callerAgent?.avatar} {callerAgent?.name.split(' ')[0]}
                            </span>
                          </div>
                          <span className="text-slate-300">{trace.durationMs} ms</span>
                        </div>

                        {/* Bar */}
                        <div className="w-full h-4 bg-slate-900/90 rounded-lg p-0.5 border border-white/5 overflow-hidden flex items-center">
                          <div
                            className={`h-full rounded-md transition-all duration-500 flex items-center px-2 text-[9px] font-mono font-bold text-slate-950 ${
                              trace.status === 'gated'
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                : trace.status === 'failed'
                                ? 'bg-gradient-to-r from-rose-400 to-rose-500'
                                : 'bg-gradient-to-r from-cyan-400 to-teal-400 shadow-sm shadow-cyan-500/40'
                            }`}
                            style={{ width: `${widthPercent}%` }}
                          >
                            <span className="truncate">{trace.durationMs}ms ({trace.tokensUsed}tok)</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: Trace Telemetry & Metrics */}
          {viewMode === 'metrics' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">总调用延迟 (Latency)</span>
                  <span className="text-lg font-bold text-cyan-300 font-mono">{totalDuration} ms</span>
                  <span className="text-[9px] text-emerald-400 block">Avg: {(totalDuration / (traces.length || 1)).toFixed(0)} ms / call</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">工具消耗 Token 统计</span>
                  <span className="text-lg font-bold text-cyan-300 font-mono">{totalTokens} Tok</span>
                  <span className="text-[9px] text-cyan-400 block">Context 注入率 100%</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">沙箱隔离成功率</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">100%</span>
                  <span className="text-[9px] text-emerald-400 block">0 宿主系统越权</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">四级容错状态</span>
                  <span className="text-lg font-bold text-cyan-300 font-mono">L0 常规</span>
                  <span className="text-[9px] text-slate-400 block">指数退避 + 熔断保护已待命</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-xl space-y-2 text-xs">
                <h4 className="font-bold text-slate-200 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  四级异常自愈与熔断机制 (Four-Level Self-Healing Architecture)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                    <strong className="text-cyan-300">Level 1 - Schema Mismatch:</strong> 本地自动修补缺失字段，进行类型规整后重试。
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                    <strong className="text-cyan-300">Level 2 - Transient Network:</strong> 指数退避 (100ms, 300ms, 900ms) 重试最多 3 次。
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                    <strong className="text-cyan-300">Level 3 - Semantic Conflict:</strong> 触发 Reflection 机制重新审视上下文与提示词。
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                    <strong className="text-cyan-300">Level 4 - Hard Breaker:</strong> 超出预算或持续异常时立即硬熔断，保持上下文完整。
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

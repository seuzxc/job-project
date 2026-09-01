import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  ShieldAlert, 
  ShieldCheck, 
  BookOpen, 
  Search, 
  FileText, 
  Database,
  ArrowRight,
  Code,
  CheckCircle2
} from 'lucide-react';
import { TOOL_REGISTRY, AGENT_DIRECTORY } from '../../data/mockData';
import { ToolCategory, ToolDefinition } from '../../types/harness';

interface ToolRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolRegistryModal: React.FC<ToolRegistryModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [activeTool, setActiveTool] = useState<ToolDefinition>(TOOL_REGISTRY[0]);

  if (!isOpen) return null;

  const categories: { id: ToolCategory | 'all'; label: string; icon: string; count: number }[] = [
    { id: 'all', label: '全部工具', icon: '⚡', count: TOOL_REGISTRY.length },
    { id: 'asset_read', label: '1. 资产只读 (Asset Read)', icon: '📖', count: TOOL_REGISTRY.filter(t => t.category === 'asset_read').length },
    { id: 'document', label: '2. 文档抽取 (Document)', icon: '📄', count: TOOL_REGISTRY.filter(t => t.category === 'document').length },
    { id: 'external', label: '3. 外部检索 (External)', icon: '🌐', count: TOOL_REGISTRY.filter(t => t.category === 'external').length },
    { id: 'writeback', label: '4. 知识库写回 (Writeback)', icon: '🛡️', count: TOOL_REGISTRY.filter(t => t.category === 'writeback').length }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? TOOL_REGISTRY 
    : TOOL_REGISTRY.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Harness Tool Registry
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {TOOL_REGISTRY.length} Tools Registered
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                严格的工具分类、调用权限鉴权、Schema 校验与 Human-in-the-Loop 副作用隔离
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Categories & Tool List */}
          <div className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-950/40">
            {/* Category Filter Pills */}
            <div className="p-3 border-b border-slate-800/80 flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    selectedCategory === c.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-75 font-mono">({c.count})</span>
                </button>
              ))}
            </div>

            {/* Tools list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredTools.map((tool) => {
                const isSelected = activeTool.id === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-indigo-500/60 shadow-sm'
                        : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-indigo-300">
                        {tool.name}
                      </span>
                      {tool.isHumanGated ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono flex items-center gap-0.5">
                          <ShieldAlert className="w-2.5 h-2.5" />
                          Gated
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          Auto
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {tool.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Tool Detail Inspector */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-900/60">
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white font-mono">{activeTool.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full uppercase font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    {activeTool.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeTool.description}
                </p>
              </div>
              {activeTool.isHumanGated && (
                <div className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>需通过 Human Review Gate 授权</span>
                </div>
              )}
            </div>

            {/* Authorized Agent Callers */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🤖 授权调用的 Agent 角色</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeTool.agentOwner.map((agentKey) => {
                  const agent = AGENT_DIRECTORY[agentKey];
                  return (
                    <div
                      key={agentKey}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-1.5 text-slate-200"
                    >
                      <span>{agent.avatar}</span>
                      <span className="font-medium">{agent.name}</span>
                      <span className="text-slate-500 font-mono text-[10px]">({agent.role})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* JSON Schema Definition */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Parameters JSON Schema</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Pydantic / Zod Compliant</span>
              </div>
              <div className="space-y-2 text-xs">
                {Object.entries(activeTool.parametersSchema).map(([paramName, def]) => {
                  const paramDef = def as { type: string; description: string; required?: boolean };
                  return (
                    <div
                      key={paramName}
                      className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-indigo-300 font-bold">{paramName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-800 text-amber-300">
                            {paramDef.type}
                          </span>
                          {paramDef.required && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-rose-500/20 text-rose-300">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{paramDef.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Design Philosophy Note */}
            <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-indigo-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                Harness 隔离设计原则
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                所有 Tool 不允许包含隐式全局状态。只读工具（Asset Read / External）支持高并发安全调用；所有具备副作用的写回工具（Writeback Tools）必须生成 Writeback Plan 并经人工审核后方可调用。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

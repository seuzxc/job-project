import React from 'react';
import { 
  X, 
  Layers, 
  Cpu, 
  Database, 
  ShieldCheck, 
  GitFork, 
  FolderCheck, 
  CheckCircle,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import { AGENT_DIRECTORY } from '../data/mockData';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-cyan-500/25">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Career Agent Harness 架构全景白皮书
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  AI Product Portfolio Spec
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                LLM + Tool Calling + Harness + State Machine + Human-in-the-Loop + Knowledge Writeback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Section 1: Core Design Philosophy */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4.5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              1. 核心设计哲学：用确定性工程对冲大模型概率风险
            </h3>
            <p className="leading-relaxed text-slate-300 text-xs">
              在传统单 Agent 对话中，模型容易在长链任务中陷入“状态发散、Token 爆炸、死循环与破坏性写库”。
              Career Agent Harness 的核心思路是：<strong className="text-white">状态机做骨架约束边界，专职 Agent 负责泛化推断，Tool Registry 隔离副作用，Human Gate 守住底线。</strong>
            </p>
          </div>

          {/* Section 2: Multi-Agent Star Topology */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4.5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GitFork className="w-4 h-4 text-cyan-400" />
              2. 6 大专职 Agent 协同星型架构 (Specialized Agents)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {Object.values(AGENT_DIRECTORY).map((agent) => (
                <div key={agent.name} className="bg-slate-950/60 backdrop-blur-md border border-white/10 p-3.5 rounded-xl space-y-1.5 hover:border-cyan-500/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{agent.avatar}</span>
                    <div>
                      <h4 className="font-bold text-slate-200 text-xs">{agent.name}</h4>
                      <p className="text-[10px] text-cyan-400 font-mono">{agent.role}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{agent.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Shared Run Context & Tool Isolation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4.5 space-y-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-cyan-400" />
                3. Shared Run Context (共享运行上下文)
              </h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                所有 Agent 共享统一数据总线（包含输入、候选人资产、外部检索、工具轨迹与写回计划）。各 Agent 仅拥有只读快照视图，状态变更由总控 Orchestrator 集中校验合并，杜绝数据割裂与多 Agent 互相覆写。
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4.5 space-y-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                4. Tool Registry 与四级异常自愈
              </h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                工具划分为 4 类（资产只读、文档抽取、外部检索、知识写回）。对 Schema Mismatch 进行本地修补，对网络抖动指数退避，对语义冲突触发 Reflection，对超预算执行硬熔断。
              </p>
            </div>
          </div>

          {/* Section 4: Human Review Gate & Writeback */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4.5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              5. Human Review Gate 与 Obsidian 知识库闭环
            </h3>
            <p className="leading-relaxed text-slate-300 text-xs">
              所有具备物理副作用的写回工具被打上 <code className="text-rose-300 font-mono">isHumanGated: true</code> 标记。系统首先生成包含差异对比的 Writeback Plan，经由人类专家在 UI 点击确认后，才由 Memory Curator Agent 执行结构化写入。
            </p>
            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-white/10 font-mono text-[11px] text-slate-400 space-y-1">
              <span className="text-cyan-300 font-bold block">📁 知识库目录规范:</span>
              <div>├── sample-data/outputs/jd-opportunity/ (岗位评估与招呼语)</div>
              <div>├── sample-data/outputs/interview-recap/ (面试复盘与攻防点)</div>
              <div>├── sample-data/outputs/mock-interview/ (模拟题库与追问链)</div>
              <div>└── sample-data/outputs/knowledge-intake/ (技术概念与高阶话术)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

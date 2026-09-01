import React from 'react';
import { X, Network, Sparkles } from 'lucide-react';
import { WorkflowId, HarnessState } from '../types/harness';
import { AgentPlanDAG } from './CenterStage/AgentPlanDAG';

interface AgentCollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowId: WorkflowId;
  currentState: HarnessState;
  isRunning: boolean;
}

export const AgentCollaborationModal: React.FC<AgentCollaborationModalProps> = ({
  isOpen,
  onClose,
  workflowId,
  currentState,
  isRunning
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-cyan-500/25">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Multi-Agent 协同与通信中枢
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Star Topology · Event Mesh
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                中心路由 Orchestrator + 领域专家 Agent + 状态机确定性 DAG + 实时 RPC 消息总线
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

        {/* Modal Body with Scrollable Area */}
        <div className="p-5 overflow-y-auto space-y-4">
          <AgentPlanDAG
            workflowId={workflowId}
            currentState={currentState}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  );
};

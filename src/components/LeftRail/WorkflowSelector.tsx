import React from 'react';
import { 
  Briefcase, 
  FileText, 
  Sparkles, 
  Compass, 
  Mic, 
  BookOpen, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { WorkflowId } from '../../types/harness';
import { WORKFLOWS_CONFIG, AGENT_DIRECTORY } from '../../data/mockData';

interface WorkflowSelectorProps {
  activeWorkflow: WorkflowId;
  onSelectWorkflow: (id: WorkflowId) => void;
  isRunning: boolean;
}

export const WorkflowSelector: React.FC<WorkflowSelectorProps> = ({
  activeWorkflow,
  onSelectWorkflow,
  isRunning
}) => {
  const getWorkflowIcon = (id: WorkflowId) => {
    switch (id) {
      case 'jd_evaluation':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'interview_recap':
        return <FileText className="w-4 h-4 text-amber-400" />;
      case 'mock_interview':
        return <Mic className="w-4 h-4 text-purple-400" />;
      case 'knowledge_intake':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      default:
        return <Briefcase className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>四大多 Agent 工作流</span>
        </div>
        <span className="text-[10px] text-cyan-300/80 font-mono px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
          4 Workflows
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {WORKFLOWS_CONFIG.map((wf) => {
          const isActive = activeWorkflow === wf.id;
          const primaryAgent = AGENT_DIRECTORY[wf.primaryAgent];

          return (
            <button
              key={wf.id}
              onClick={() => {
                if (!isRunning) {
                  onSelectWorkflow(wf.id);
                }
              }}
              disabled={isRunning}
              className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                  : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20'
              } ${isRunning ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-indigo-500" />
              )}
              
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-white/5 border border-white/10'}`}>
                    {getWorkflowIcon(wf.id)}
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold ${isActive ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white'}`}>
                      {wf.name}
                    </h3>
                  </div>
                </div>
                {isActive && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                {wf.shortDesc}
              </p>

              {/* Agent Tag */}
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>{primaryAgent.avatar}</span>
                  <span className="font-mono text-slate-300 font-medium truncate max-w-[130px]">
                    {primaryAgent.name}
                  </span>
                </div>
                <span className="text-slate-500 font-mono flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5 text-cyan-400/70" />
                  ~1.5s
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

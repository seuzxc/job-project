import React from 'react';
import { 
  Play, 
  RotateCcw, 
  StepForward, 
  ShieldAlert, 
  CheckCircle2, 
  FastForward, 
  Sliders
} from 'lucide-react';
import { HarnessState } from '../../types/harness';

interface HarnessControlBarProps {
  currentState: HarnessState;
  isRunning: boolean;
  stepMode: boolean;
  setStepMode: (val: boolean) => void;
  speed?: number;
  setSpeed?: (val: number) => void;
  onStartWorkflow: () => void;
  onStepNext: () => void;
  onReset: () => void;
  onTriggerFailureBranch?: (branch: 'tool_failed' | 'needs_user_clarification') => void;
  progressPercent: number;
}

export const HarnessControlBar: React.FC<HarnessControlBarProps> = ({
  currentState,
  isRunning,
  stepMode,
  setStepMode,
  speed = 1,
  setSpeed,
  onStartWorkflow,
  onStepNext,
  onReset,
  onTriggerFailureBranch,
  progressPercent
}) => {
  const isCompleted = currentState === 'completed';
  const isWaitingReview = currentState === 'human_review_required';
  const isFailed = currentState === 'tool_failed' || currentState === 'needs_user_clarification' || currentState === 'writeback_rejected';

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Main Action Buttons & Mode Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isRunning && !stepMode && !isCompleted && !isWaitingReview && (
            <button
              onClick={onStartWorkflow}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>启动 Agent 工作流 (Run)</span>
            </button>
          )}

          {stepMode && !isCompleted && (
            <button
              onClick={onStepNext}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <StepForward className="w-3.5 h-3.5" />
              <span>单步推进 (Step Next)</span>
            </button>
          )}

          {isRunning && (
            <div className="px-4 py-2 bg-white/5 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium rounded-xl flex items-center gap-2 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Agent 正在执行工具链...</span>
            </div>
          )}

          {isWaitingReview && (
            <div className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium rounded-xl flex items-center gap-2 animate-pulse backdrop-blur-md">
              <ShieldAlert className="w-4 h-4" />
              <span>到达 Human Review Gate 门禁，请在右侧审查写回项</span>
            </div>
          )}

          {isCompleted && (
            <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium rounded-xl flex items-center gap-2 backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4" />
              <span>工作流执行完毕并成功完成闭环</span>
            </div>
          )}

          {/* Stepper / Execution Mode Switcher (自动流转 / 单步测试) */}
          <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setStepMode(false)}
              disabled={isRunning}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                !stepMode
                  ? 'bg-cyan-600 text-white font-medium shadow-sm shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="自动连续运行整个 Agent 工作流"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>自动流转</span>
            </button>
            <button
              onClick={() => setStepMode(true)}
              disabled={isRunning}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                stepMode
                  ? 'bg-cyan-600 text-white font-medium shadow-sm shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="单步测试模式：每一步暂停由人工触发单步推进"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>单步测试</span>
            </button>
          </div>

          {/* Speed Selector (if auto) */}
          {!stepMode && setSpeed && (
            <div className="hidden md:flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-2 py-1 gap-1 text-slate-400">
              <span className="text-[11px] font-mono">速度:</span>
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  disabled={isRunning}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    speed === s ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold' : 'hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}

          <button
            onClick={onReset}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="重置状态机与执行上下文"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>流转进度: {Math.round(progressPercent)}%</span>
          <span className="text-cyan-400/80">Harness State Monotonic Flow</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <div
            className={`h-full transition-all duration-300 ${
              isFailed
                ? 'bg-rose-500'
                : isCompleted
                ? 'bg-emerald-400'
                : 'bg-gradient-to-r from-cyan-400 to-indigo-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

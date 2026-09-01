import React, { useState } from 'react';
import { 
  Mic, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  MessageSquare, 
  ArrowRight,
  RefreshCw,
  ThumbsUp,
  Award
} from 'lucide-react';
import { MockInterviewOutput } from '../../types/harness';

interface MockInterviewInteractiveProps {
  mockData: MockInterviewOutput;
}

export const MockInterviewInteractive: React.FC<MockInterviewInteractiveProps> = ({ mockData }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});
  const [evaluationScores, setEvaluationScores] = useState<Record<number, { score: number; comment: string }>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);

  const currentQuestion = mockData.followUpChain[activeStepIndex];

  const handleFillRecommended = () => {
    setUserInputs({
      ...userInputs,
      [activeStepIndex]: currentQuestion.recommendedAnswer
    });
  };

  const handleEvaluateAnswer = () => {
    const input = userInputs[activeStepIndex];
    if (!input || input.trim().length === 0) return;

    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationScores({
        ...evaluationScores,
        [activeStepIndex]: {
          score: 93,
          comment: '回答结构严密，准确拆解了并发数据隔离与总控裁决机制，展现了工业级架构素养。'
        }
      });
    }, 600);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              面试官动态追问链模拟 (Interactive Follow-Up Chain)
            </h3>
            <p className="text-[11px] text-slate-400">
              深度多轮追问 · 支持自主拟答与 Agent 实时打分
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {mockData.followUpChain.map((q, idx) => (
            <button
              key={q.step}
              onClick={() => setActiveStepIndex(idx)}
              className={`w-6 h-6 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                activeStepIndex === idx
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400/40 shadow-sm'
                  : evaluationScores[idx]
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {q.step}
            </button>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-purple-500/30 rounded-xl p-3.5 space-y-2 shadow-inner">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-purple-300 font-bold flex items-center gap-1.5">
            <span>🎙️ 面试官 (业务 VP):</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">第 {currentQuestion.step} 轮深度追问</span>
        </div>
        <p className="text-xs font-semibold text-slate-100 leading-relaxed font-mono">
          {currentQuestion.interviewerQuestion}
        </p>
      </div>

      {/* User Input & Practice Arena */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">✍️ 候选人拟答区:</span>
          <button
            onClick={handleFillRecommended}
            className="text-[11px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-mono transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            一键填入金牌示范回答
          </button>
        </div>

        <textarea
          value={userInputs[activeStepIndex] || ''}
          onChange={(e) => setUserInputs({ ...userInputs, [activeStepIndex]: e.target.value })}
          rows={3}
          className="w-full bg-slate-950/60 border border-white/10 focus:border-purple-500/80 rounded-xl p-3 text-xs text-slate-200 font-mono resize-none focus:outline-none"
          placeholder="输入您的回答，或点击上方填入 Agent 推荐的金牌回答..."
        />

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleEvaluateAnswer}
            disabled={!userInputs[activeStepIndex] || isEvaluating}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20 cursor-pointer"
          >
            {isEvaluating ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Award className="w-3 h-3" />
            )}
            <span>{isEvaluating ? '正在打分...' : 'Mock Agent 评估打分'}</span>
          </button>

          {activeStepIndex < mockData.followUpChain.length - 1 && (
            <button
              onClick={() => setActiveStepIndex(activeStepIndex + 1)}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
            >
              <span>下一轮追问</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
            </button>
          )}
        </div>
      </div>

      {/* Instant Evaluation Feedback Result */}
      {evaluationScores[activeStepIndex] && (
        <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 rounded-xl p-3.5 text-xs text-slate-200 space-y-1.5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Agent 评分: {evaluationScores[activeStepIndex].score} / 100
            </span>
            <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-500/20 px-2 py-0.5 rounded-full">
              Excellent Framing
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            {evaluationScores[activeStepIndex].comment}
          </p>
        </div>
      )}
    </div>
  );
};

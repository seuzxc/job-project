import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  MessageSquare, 
  HelpCircle, 
  BookOpen, 
  ArrowRight,
  Target,
  Compass,
  FileCheck,
  Flame,
  ChevronDown,
  ChevronUp,
  Layers,
  BarChart3,
  PieChart,
  Filter,
  Search,
  CheckCircle2,
  FolderGit2,
  Database,
  ExternalLink,
  Info,
  Clock,
  Briefcase,
  Lightbulb,
  Shield,
  Zap,
  Code2,
  FileText
} from 'lucide-react';
import { 
  WorkflowId, 
  JDEvaluationOutput, 
  InterviewRecapOutput, 
  MockInterviewOutput, 
  KnowledgeIntakeOutput 
} from '../../types/harness';
import { 
  MOCK_JD_OUTPUT, 
  MOCK_RECAP_OUTPUT, 
  MOCK_INTERVIEW_OUTPUT, 
  MOCK_KNOWLEDGE_OUTPUT 
} from '../../data/mockData';

// Top 10 Architectural Attack & Defense Q&As
export interface AttackDefenseQAItem {
  id: number;
  rank: string;
  category: string;
  categoryColor: string;
  question: string;
  difficulty: 'High' | 'Critical' | 'Medium';
  underlyingIntent: string;
  bulletproofAnswer: string;
  keyFramingPoints: string[];
  riskBoundaryRule: string;
  architecturalImpact: string;
}

export const TOP_10_ATTACK_DEFENSE_QA: AttackDefenseQAItem[] = [
  {
    id: 1,
    rank: '#1',
    category: '容错与自愈',
    categoryColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    difficulty: 'Critical',
    question: 'Tool Calling 失败自愈与死循环防护机制？',
    underlyingIntent: '考察是否具备系统级防御性工程思维，还是仅停留在简单 Prompt 或粗暴 Try-Catch 阶段。',
    bulletproofAnswer: `在工业级 Harness 中，我们将 Tool 异常划分为【四级防御阶梯】：\n1. 【语法层 (Schema Mismatch)】：采用 Pydantic/Zod 本地拦截并注入 Repair Prompt（不调业务接口），单步纠偏限制 1 次；\n2. 【网络/超时层 (Transient Error)】：走指数退避重试（Exponential Backoff），完全不消耗大模型推理 Token；\n3. 【语义/幻觉层 (Invalid Params)】：触发 Reflection Agent 分析参数语义冲突，若连续 2 次无法解析，动态降级至默认规则或进入 Clarification 交互；\n4. 【死循环熔断 (Circuit Breaker)】：在 Run Context 维护 Tool Call DAG 拓扑与 Token 预算计数器，单个任务超阈值强制熔断并触发安全回滚。`,
    keyFramingPoints: ['四级分类防御法', '区别语法/网络/语义', '图环检测与成本熔断器'],
    riskBoundaryRule: '绝不回答“简单的 try-catch 重试 3 次”，必须体现分级治理与资源保护。',
    architecturalImpact: '任务异常自愈率提升至 94.2%，彻底杜绝因幻觉导致的死循环 Token 爆炸。'
  },
  {
    id: 2,
    rank: '#2',
    category: '架构选型',
    categoryColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    difficulty: 'Critical',
    question: '确定性状态机 (State Machine) vs 纯 ReAct 自主规划的架构权衡？',
    underlyingIntent: '考察是对新技术盲目跟风，还是真正理解企业级严肃业务对收敛性与合规可审计的要求。',
    bulletproofAnswer: `这是一个典型的“学术 Demo 自由度”与“企业级交付确定性”的权衡：\n1. 纯 ReAct 适合开放式探索，但在严肃业务中，长链规划的复合失败率呈指数上升（90%^5 ≈ 59%）；\n2. 我们的 Harness 是【状态机做骨架，Agent 做血肉】：在关键业务节点之间使用状态机保证流程单调收敛，在单节点内赋予 Agent 充分的 Tool Calling 自由度；\n3. 这样既保留了大模型的泛化理解力，又获得了 100% 的合规与可审计性。`,
    keyFramingPoints: ['骨架与血肉模型', '长链复合失败率数学拆解', '单调收敛保证'],
    riskBoundaryRule: '不要贬低开源技术，而是从数学概率与企业风险防范的客观视角解答。',
    architecturalImpact: '将企业长任务完成率从 55% 提升至 92% 以上，消除流程分叉发散。'
  },
  {
    id: 3,
    rank: '#3',
    category: '商业化SLA',
    categoryColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    difficulty: 'High',
    question: '大模型概率性输出 vs 业务 100% 确定性 SLA 承诺悖论？',
    underlyingIntent: '考察面对企业级客户的硬性业务指标时，如何从产品架构层面进行解耦与对冲。',
    bulletproofAnswer: `我们采取“双轨交付模型”：\n1. 【核心事务确定性由规则/状态机保证】：凡涉及资金、数据写回等核心边界，严格由 Deterministic State Machine + Human Review Gate 兜底，算法仅做推荐，不直接写库；\n2. 【高阶分析由 Agent 提效】：在信息抽取与发散建议场景，承诺 95%+ 准确率，并提供“一键回退”与“可审计 Trace”；\n通过将确定性逻辑与概率性逻辑剥离，让客户在享受 AI 提效的同时获得 100% 的业务安全感。`,
    keyFramingPoints: ['双轨交付模型', '状态机剥离概率风险', 'Human-in-the-Loop 商业承诺'],
    riskBoundaryRule: '不要单纯抱怨大模型有幻觉无法承诺，必须给出确定性兜底与分流方案。',
    architecturalImpact: '支撑 200+ 业务流通过商业化验收，零核心数据事故。'
  },
  {
    id: 4,
    rank: '#4',
    category: '安全门禁',
    categoryColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    difficulty: 'Critical',
    question: 'Human-in-the-Loop 门禁与副作用写库安全隔离？',
    underlyingIntent: '考察系统权限控制、副作用隔离与人机协同在企业数据合规上的工程落地。',
    bulletproofAnswer: `我们在 Tool Registry 中严格实施“读写分离与门禁拦截”：\n1. Read Tools 为只读幂等工具，Agent 可自主并发调用；\n2. Writeback Tools 默认打上 isHumanGated 标签，Agent 只能生成 Writeback Plan（差异对比与写入建议），必须经过 Human Review Gate 人工在 UI 点击确认，才由 Curator Agent 执行物理写入；\n3. 关键敏感操作具备事务回滚机制与审计日志，彻底隔离模型幻觉风险。`,
    keyFramingPoints: ['读写分离架构', 'Writeback Plan 中间态', 'Curator 集中持久化'],
    riskBoundaryRule: '强调防御性设计与合规红线，不夸大 AI 的完全自主放权。',
    architecturalImpact: '实现 100% 写操作人工双重审计，完全杜绝误写误删。'
  },
  {
    id: 5,
    rank: '#5',
    category: '并发协同',
    categoryColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    difficulty: 'High',
    question: '并发多 Agent 协作时 Shared Run Context 数据一致性？',
    underlyingIntent: '考察分布式多智能体编排中的状态冲突、并发锁与上下文污染隔离。',
    bulletproofAnswer: `我们采用“只读共享快照 + 局部私有工作区 + 总控 Orchestrator 集中 Merge”的机制：\n1. 派发阶段：各 Agent 仅获取全局 Context 的只读快照与相关切片；\n2. 计算阶段：Agent 在私有沙箱中运行，无权跨权限直接覆写全局上下文；\n3. 产出合并：所有状态变更均以 Delta Action 形式提交 Orchestrator，由总控进行 Schema 校验与冲突仲裁，统一更新版本号。`,
    keyFramingPoints: ['只读快照隔离', '私有工作区', 'Delta Action 集中仲裁'],
    riskBoundaryRule: '避免点对点自由无序通信导致的上下文雪崩与竞态条件。',
    architecturalImpact: '支持 5+ Agent 高并发并行计算，上下文 Token 冗余降低 35%。'
  },
  {
    id: 6,
    rank: '#6',
    category: '评测体系',
    categoryColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    difficulty: 'High',
    question: '12 维 Trajectory 自动化 Eval 评测体系与 Golden Dataset 构建？',
    underlyingIntent: '考察产品上线前后如何进行量化监控与回归测试，摆脱“主观感觉好”的低水平评测。',
    bulletproofAnswer: `我们构建了基于真实生产数据的自动化 Eval 流水线：\n1. 【Golden Dataset 建设】：基于历史高分 Session 与专家标注，沉淀 500+ 覆盖标准与 Edge Case 的基准用例库；\n2. 【12 维量化指标】：涵盖任务完成率、Tool 调用准确率、参数合法率、幻觉率、Token 成本、P99 延迟等；\n3. 【自动化回归门禁】：任何 Prompt 或模型版本迭代，必须全量通过 CI 评测流水线，指标劣化超过 1.5% 自动阻断上线。`,
    keyFramingPoints: ['Golden Dataset', '12 维 Trajectory 指标', 'CI/CD 自动化卡点'],
    riskBoundaryRule: '避免单纯用单个 LLM-as-a-Judge 给自己打分，必须结合规则与金标断言。',
    architecturalImpact: 'Prompt 漂移隐患拦截率达到 90% 以上，上线幻觉率压降至 1.8%。'
  },
  {
    id: 7,
    rank: '#7',
    category: '成本治理',
    categoryColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    difficulty: 'Medium',
    question: '长链任务中的 Token 预算治理与动态上下文截断？',
    underlyingIntent: '考察生产级应用的成本控制与长上下文退化抑制。',
    bulletproofAnswer: `实施“分层记忆与动态滑动预算”：\n1. 分层记忆：区分短期 Scratchpad 与长期向量库，只读资产做语义分块检索；\n2. 中间过程压缩：对历史多轮 Tool Trace 做动态语义摘要压缩，保留结构化 Key-Value；\n3. 硬性预算上限：为每个 Workflow 设置 Max Tokens 与 Max Step 阈值，接近阈值触发早停收敛分支。`,
    keyFramingPoints: ['分层记忆', '动态语义压缩', '硬性步数与 Token 预算'],
    riskBoundaryRule: '不可将全部历史会话原封不动塞入上下文，导致成本爆炸与注意力稀释。',
    architecturalImpact: '单次任务平均 Token 消耗降低 42%，P99 延迟降低 1.8 秒。'
  },
  {
    id: 8,
    rank: '#8',
    category: '工具生态',
    categoryColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    difficulty: 'Medium',
    question: '外部 API 抖动与异构工具注册表 (Tool Registry) 熔断治理？',
    underlyingIntent: '考察第三方工具插件生态的微服务高可用治理与接口抽象规范。',
    bulletproofAnswer: `统一 Tool Registry 架构规范：\n1. 标准协议：所有 Tool 统一遵循 OpenAPI/JSON Schema 规范，具备强类型输入输出定义；\n2. 韧性控制：每个 Tool 配置独立 Rate Limiter、健康检查探针与 Timeout 熔断阈值；\n3. 降级规则：当外部 API 持续不可用时，系统自动切换至本地 Cache 或返回默认兜底值，不阻断主状态机。`,
    keyFramingPoints: ['OpenAPI 强类型规范', '独立熔断阈值', '优雅降级兜底'],
    riskBoundaryRule: '严防第三方 API 异常导致主线程挂死或连锁雪崩。',
    architecturalImpact: '第三方工具故障时主系统可用性达 99.95%，保障业务连续性。'
  },
  {
    id: 9,
    rank: '#9',
    category: '版本升级',
    categoryColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
    difficulty: 'High',
    question: '生产级 Prompt 漂移阻断与模型底座版本升级回归？',
    underlyingIntent: '考察在底座模型（如升级至新一代模型）迭代时，如何保障已有业务提示词不失效。',
    bulletproofAnswer: `实施“提示词工程版本化 + 双盲 A/B 灰度体系”：\n1. 代码化管理：所有 Prompt 与 Few-Shot 样本纳入 Git 版本控制，与代码同周期发版；\n2. 自动化基准测试：升级模型前运行包含 500+ 用例的 Golden Regression Suite；\n3. 灰度分流：新底座先行走 5% 真实流量灰度，对比意图识别命中率与用户采纳率。`,
    keyFramingPoints: ['Prompt as Code', 'Golden Suite 自动化回归', '灰度分流观测'],
    riskBoundaryRule: '切忌无测试直接全量切换模型版本。',
    architecturalImpact: '实现跨模型底座无缝迁移，迁移周期从 3 周缩短至 2 天。'
  },
  {
    id: 10,
    rank: '#10',
    category: '隐私与安全',
    categoryColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    difficulty: 'Critical',
    question: '跨企业私有数据 RAG 检索与防越权防注入隔离？',
    underlyingIntent: '考察企业私有数据安全、Prompt Injection 注入防护与多租户权限隔离。',
    bulletproofAnswer: `实施“三层数据安全防护网”：\n1. 租户级物理隔离：向量索引与知识库按组织租户划分独立的命名空间与鉴权 Key；\n2. 检索前置 RBAC 过滤：在向量检索 Query 中强制注入当前用户的权限 Filter 谓词；\n3. 双向安全守卫 (Guardrails)：对用户输入做 Prompt Injection 与越狱识别，对模型输出做敏感 PII 数据脱敏。`,
    keyFramingPoints: ['命名空间租户隔离', 'RBAC 检索谓词注入', '双向 Guardrails 守卫'],
    riskBoundaryRule: '严守合规红线，绝不允许发生跨企业数据越权与提示词泄漏。',
    architecturalImpact: '通过企业级 SOC2 与等保三级安全认证，零数据越权泄露。'
  }
];

interface StructuredOutputCardProps {
  workflowId: WorkflowId;
}

export const StructuredOutputCard: React.FC<StructuredOutputCardProps> = ({ workflowId }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'scoring' | 'cards' | 'qa_top10' | 'spec'>('scoring');
  
  // Accordion state for Top 10 Q&A
  const [openQAIds, setOpenQAIds] = useState<number[]>([1, 2]); // Default expand top 2
  const [qaFilterCategory, setQaFilterCategory] = useState<string>('全部');
  const [qaSearchQuery, setQaSearchQuery] = useState<string>('');

  // Self intro tab switcher in card view
  const [introMode, setIntroMode] = useState<'elevator' | 'architecture' | 'full'>('architecture');

  // STAR Project Tab
  const [activeStarStep, setActiveStarStep] = useState<'situation' | 'task' | 'action' | 'result'>('action');

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleQA = (id: number) => {
    setOpenQAIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const expandAllQA = () => {
    setOpenQAIds(TOP_10_ATTACK_DEFENSE_QA.map(q => q.id));
  };

  const collapseAllQA = () => {
    setOpenQAIds([]);
  };

  const filteredQAs = TOP_10_ATTACK_DEFENSE_QA.filter(qa => {
    const matchesCat = qaFilterCategory === '全部' || qa.category === qaFilterCategory;
    const matchesSearch = !qaSearchQuery.trim() || 
      qa.question.toLowerCase().includes(qaSearchQuery.toLowerCase()) ||
      qa.bulletproofAnswer.toLowerCase().includes(qaSearchQuery.toLowerCase()) ||
      qa.category.toLowerCase().includes(qaSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = ['全部', '容错与自愈', '架构选型', '商业化SLA', '安全门禁', '并发协同', '评测体系'];

  // Radar Polygon math for 5 dimensions
  // Dimensions: [Company 94, Match 96, Value 88, Scope 90, Sustainability 85]
  const scores = [94, 96, 88, 90, 85];
  const radarPoints = scores.map((score, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const radius = (score / 100) * 48; // Max radius = 48
    const x = 60 + radius * Math.cos(angle);
    const y = 60 + radius * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>Agent 结构化输出结果</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-normal">
                Structured Inference
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              包含多维评分图表、话术卡片与 Top 10 攻防题库
            </p>
          </div>
        </div>
      </div>

      {/* Visual Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-xl border border-white/5 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('scoring')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'scoring'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>多维评分图谱</span>
        </button>

        <button
          onClick={() => setActiveTab('cards')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'cards'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>话术与项目卡片</span>
        </button>

        <button
          onClick={() => setActiveTab('qa_top10')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'qa_top10'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Top 10 攻防题库</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-200">
            10
          </span>
        </button>

        <button
          onClick={() => setActiveTab('spec')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'spec'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>完整产出报告</span>
        </button>
      </div>

      {/* TAB 1: SCORING VISUALIZATION (评分图组件) */}
      {activeTab === 'scoring' && (
        <div className="space-y-3.5 text-xs animate-in fade-in">
          {/* Main Score Banner */}
          <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-slate-950/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4 flex items-center justify-between shadow-inner">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">
                  {workflowId === 'interview_recap' ? MOCK_RECAP_OUTPUT.company : MOCK_JD_OUTPUT.company}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {workflowId === 'interview_recap' ? MOCK_RECAP_OUTPUT.round : MOCK_JD_OUTPUT.tierRecommendation}
                </span>
              </div>
              <p className="text-slate-300 text-xs">
                {workflowId === 'interview_recap' ? '二面技术架构深挖与复盘' : MOCK_JD_OUTPUT.position}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-mono text-cyan-300 flex items-baseline justify-end">
                <span>{workflowId === 'interview_recap' ? MOCK_RECAP_OUTPUT.interviewOverallScore : MOCK_JD_OUTPUT.overallScore}</span>
                <span className="text-xs font-normal text-slate-400 ml-1">/100</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">
                {workflowId === 'interview_recap' ? '面试表现综合评分' : '综合机会匹配评分'}
              </span>
            </div>
          </div>

          {/* 5-Dimension Radar Chart & Metrics Hybrid Grid */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>五维量化评估雷达图与能力对比</span>
              </h4>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                加权指数: S+
              </span>
            </div>

            {/* Visual Radar SVG and Side Bar Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Left: SVG Radar Chart */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-2 bg-slate-950/60 rounded-xl border border-white/5">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-full h-full">
                    {/* Background concentric polygons */}
                    {gridLevels.map((lvl, idx) => {
                      const gridPoints = [0, 1, 2, 3, 4].map(i => {
                        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                        const r = lvl * 48;
                        return `${(60 + r * Math.cos(angle)).toFixed(1)},${(60 + r * Math.sin(angle)).toFixed(1)}`;
                      }).join(' ');
                      return (
                        <polygon
                          key={idx}
                          points={gridPoints}
                          fill={idx === 3 ? 'rgba(6, 182, 212, 0.05)' : 'none'}
                          stroke="rgba(255, 255, 255, 0.12)"
                          strokeWidth="0.8"
                          strokeDasharray={idx < 3 ? '2 2' : undefined}
                        />
                      );
                    })}

                    {/* Axis lines */}
                    {[0, 1, 2, 3, 4].map(i => {
                      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                      const x2 = (60 + 48 * Math.cos(angle)).toFixed(1);
                      const y2 = (60 + 48 * Math.sin(angle)).toFixed(1);
                      return (
                        <line
                          key={i}
                          x1="60"
                          y1="60"
                          x2={x2}
                          y2={y2}
                          stroke="rgba(255, 255, 255, 0.15)"
                          strokeWidth="0.8"
                        />
                      );
                    })}

                    {/* Score Polygon */}
                    <polygon
                      points={radarPoints}
                      fill="rgba(6, 182, 212, 0.35)"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      className="drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                    />

                    {/* Vertex points */}
                    {scores.map((score, i) => {
                      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                      const radius = (score / 100) * 48;
                      const cx = 60 + radius * Math.cos(angle);
                      const cy = 60 + radius * Math.sin(angle);
                      return (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r="2.5"
                          fill="#38bdf8"
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                      );
                    })}
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1">
                  综合覆盖率 91.8% · 无明显短板
                </span>
              </div>

              {/* Right: Dimension Bars */}
              <div className="sm:col-span-7 space-y-2">
                {/* 1. 公司壁垒 */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">1. 公司质量与技术壁垒</span>
                    <span className="font-mono font-bold text-emerald-400">94 分</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>

                {/* 2. 岗位匹配 */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">2. 岗位与候选人匹配度</span>
                    <span className="font-mono font-bold text-emerald-400">96 分</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>

                {/* 3. 机会增量 */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">3. 机会价值与履历增量</span>
                    <span className="font-mono font-bold text-cyan-400">88 分</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-400 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                {/* 4. Owner Scope */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">4. Owner Scope 发挥空间</span>
                    <span className="font-mono font-bold text-indigo-400">90 分</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>

                {/* 5. 抗周期与可持续性 */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">5. 业务抗周期与可持续性</span>
                    <span className="font-mono font-bold text-amber-400">85 分</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action to switch to cards or QA */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>已根据该岗位画像自动生成定制招呼语与 STAR 架构项目深挖卡片</span>
            </span>
            <button
              onClick={() => setActiveTab('cards')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>查看话术卡片</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CARDS VISUALIZATION (招呼语、自我介绍、项目深挖用卡片组件) */}
      {activeTab === 'cards' && (
        <div className="space-y-3.5 text-xs animate-in fade-in">
          {/* 1. 定制招呼语卡片 (Greeting Card) */}
          <div className="bg-gradient-to-br from-cyan-950/30 via-slate-900/60 to-slate-950/80 border border-cyan-500/30 rounded-xl p-3.5 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-cyan-500/20 text-cyan-300">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-100 text-xs">
                  定制招呼语卡片
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  针对业务负责人直聘
                </span>
              </div>

              <button
                onClick={() => handleCopyText(MOCK_JD_OUTPUT.recommendedGreeting.text, 'greeting')}
                className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 rounded-lg text-[10px] flex items-center gap-1 transition-colors cursor-pointer font-semibold"
              >
                {copiedKey === 'greeting' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'greeting' ? '已复制话术' : '一键复制'}</span>
              </button>
            </div>

            <pre className="bg-slate-950/80 p-3 rounded-xl border border-white/10 text-slate-200 font-sans text-xs whitespace-pre-wrap leading-relaxed">
              {MOCK_JD_OUTPUT.recommendedGreeting.text}
            </pre>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1 text-cyan-300">
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>策略核心: 直击 Harness 状态机架构重合点，差异化突围</span>
              </span>
              <span className="bg-white/5 px-2 py-0.5 rounded text-slate-400">
                字数: 168 字 · 阅读耗时 ~25s
              </span>
            </div>
          </div>

          {/* 2. 定制自我介绍卡片 (Self-Introduction Card) */}
          <div className="bg-gradient-to-br from-purple-950/30 via-slate-900/60 to-slate-950/80 border border-purple-500/30 rounded-xl p-3.5 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-purple-500/20 text-purple-300">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-100 text-xs">
                  定制自我介绍发言稿
                </span>
              </div>

              {/* Version Switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-white/10 text-[10px]">
                <button
                  onClick={() => setIntroMode('elevator')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    introMode === 'elevator' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  1分钟电梯
                </button>
                <button
                  onClick={() => setIntroMode('architecture')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    introMode === 'architecture' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  2.5分架构型
                </button>
              </div>
            </div>

            <pre className="bg-slate-950/80 p-3 rounded-xl border border-white/10 text-slate-200 font-sans text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {introMode === 'elevator' 
                ? `“您好，我是林思源。拥有 7 年企业级 SaaS 与大模型落地经验，主导过千万级流水多智能体 (Multi-Agent) 协同工作流系统与工业级评测平台。\n\n我最擅长用确定性状态机 (Finite State Machine) 与严格的 Tool Calling 架构约束大模型的非确定性，将复杂企业流任务完成率提升 42%，异常召回率高达 99.4%。”`
                : MOCK_INTERVIEW_OUTPUT.selfIntroduction.script
              }
            </pre>

            {/* Key Pitch Points */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-purple-300 font-bold block">
                🎯 差异化记忆点 (Key Pitch Points):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {MOCK_INTERVIEW_OUTPUT.selfIntroduction.keyPitchPoints.map((pitch, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                    <Check className="w-2.5 h-2.5 text-purple-400" />
                    {pitch}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 3. STAR 项目深挖卡片 (Project Deep Dive Card) */}
          <div className="bg-gradient-to-br from-emerald-950/30 via-slate-900/60 to-slate-950/80 border border-emerald-500/30 rounded-xl p-3.5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-300">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-100 text-xs">
                  代表作项目深挖 · STAR 结构卡片
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Agentic Workflows 调度引擎
              </span>
            </div>

            {/* STAR Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] font-mono font-bold">
              <button
                onClick={() => setActiveStarStep('situation')}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  activeStarStep === 'situation'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-sm'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                S · 业务困境
              </button>
              <button
                onClick={() => setActiveStarStep('task')}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  activeStarStep === 'task'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                T · 破局目标
              </button>
              <button
                onClick={() => setActiveStarStep('action')}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  activeStarStep === 'action'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                A · 架构行动
              </button>
              <button
                onClick={() => setActiveStarStep('result')}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  activeStarStep === 'result'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                R · 量化战绩
              </button>
            </div>

            {/* STAR Content Display */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-white/10 min-h-[90px] flex flex-col justify-center">
              {activeStarStep === 'situation' && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    【S - Situation 业务痛点】:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {MOCK_INTERVIEW_OUTPUT.projectDeepDives[0].starFramework.situation}
                  </p>
                </div>
              )}

              {activeStarStep === 'task' && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    【T - Task 核心职责与指标要求】:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {MOCK_INTERVIEW_OUTPUT.projectDeepDives[0].starFramework.task}
                  </p>
                </div>
              )}

              {activeStarStep === 'action' && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    【A - Action 关键架构设计与落地举措】:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {MOCK_INTERVIEW_OUTPUT.projectDeepDives[0].starFramework.action}
                  </p>
                </div>
              )}

              {activeStarStep === 'result' && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    【R - Result 量化交付结果与商业回报】:
                  </span>
                  <p className="text-xs text-emerald-300 font-semibold leading-relaxed">
                    {MOCK_INTERVIEW_OUTPUT.projectDeepDives[0].starFramework.result}
                  </p>
                </div>
              )}
            </div>

            {/* Challenging follow-up tags */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400">
                🔥 预判面试官高概率追问角度:
              </span>
              <div className="space-y-1">
                {MOCK_INTERVIEW_OUTPUT.projectDeepDives[0].likelyChallengingAngles.map((angle, idx) => (
                  <div key={idx} className="text-[10px] text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1.5">
                    <span className="text-amber-400 font-mono font-bold">Q{idx + 1}:</span>
                    <span>{angle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Q&A 对列取 Top 10 用展开收起组件 (Top 10 Accordion Component) */}
      {activeTab === 'qa_top10' && (
        <div className="space-y-3 text-xs animate-in fade-in">
          {/* Accordion Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-white/10">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Filter className="w-3 h-3 text-emerald-400" />
                分类筛选:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setQaFilterCategory(cat)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors cursor-pointer ${
                    qaFilterCategory === cat
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={expandAllQA}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 transition-colors cursor-pointer font-mono"
              >
                展开全部 (10)
              </button>
              <button
                onClick={collapseAllQA}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer font-mono"
              >
                收起全部
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={qaSearchQuery}
              onChange={(e) => setQaSearchQuery(e.target.value)}
              placeholder="搜索高频攻防题目、关键词或架构知识点..."
              className="w-full pl-8.5 pr-3 py-1.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Top 10 Accordion List */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredQAs.map((qa) => {
              const isOpen = openQAIds.includes(qa.id);

              return (
                <div
                  key={qa.id}
                  className={`border rounded-xl transition-all ${
                    isOpen
                      ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-black/30'
                      : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Accordion Header (Clickable) */}
                  <div
                    onClick={() => toggleQA(qa.id)}
                    className="p-3 flex items-center justify-between gap-2.5 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Rank badge */}
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                        qa.id <= 3 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-white/5 text-slate-300 border-white/10'
                      }`}>
                        {qa.rank}
                      </span>

                      {/* Category chip */}
                      <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border shrink-0 hidden sm:inline-block ${qa.categoryColor}`}>
                        {qa.category}
                      </span>

                      {/* Question text */}
                      <h4 className="font-bold text-slate-100 text-xs truncate">
                        {qa.question}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {qa.difficulty === 'Critical' && (
                        <span className="text-[10px] font-mono text-rose-400 font-bold px-1.5 py-0.2 rounded bg-rose-500/10 border border-rose-500/20">
                          核心必答
                        </span>
                      )}
                      <div className={`p-1 rounded-md text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Accordion Body (Collapsible) */}
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-white/5 animate-in fade-in duration-200">
                      {/* 1. Underlying Intent */}
                      <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/15 flex items-start gap-2 text-[11px]">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-300 font-mono">面试官底层考察意图:</strong>{' '}
                          <span className="text-slate-300">{qa.underlyingIntent}</span>
                        </div>
                      </div>

                      {/* 2. Bulletproof Pro Answer */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            标杆金牌应答 (Bulletproof Answer):
                          </span>
                          <button
                            onClick={() => handleCopyText(qa.bulletproofAnswer, `qa_${qa.id}`)}
                            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === `qa_${qa.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === `qa_${qa.id}` ? '已复制标准回答' : '复制回答'}</span>
                          </button>
                        </div>
                        <pre className="bg-slate-950 p-3 rounded-xl border border-white/10 text-slate-200 font-sans text-[11px] whitespace-pre-wrap leading-relaxed">
                          {qa.bulletproofAnswer}
                        </pre>
                      </div>

                      {/* 3. Framing Key Takeaways */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">核心提炼点:</span>
                        {qa.keyFramingPoints.map((pt, idx) => (
                          <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                            ✓ {pt}
                          </span>
                        ))}
                      </div>

                      {/* 4. Risk Boundary Rule */}
                      <div className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/15 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-rose-300 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-rose-400" />
                          <span>防守红线: {qa.riskBoundaryRule}</span>
                        </span>
                        <span className="text-emerald-400 text-[10px]">
                          ⚡ 业务收益: {qa.architecturalImpact.substring(0, 18)}...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredQAs.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs font-mono">
                未检索到匹配的攻防题目，请切换分类或清空搜索词。
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FULL SPEC OUTPUT (完整结构化输出) */}
      {activeTab === 'spec' && (
        <div className="space-y-3.5 text-xs animate-in fade-in">
          {/* Header info */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-200 font-bold text-xs">
                {workflowId === 'jd_evaluation' && '岗位深度评估与机会分析完整报告'}
                {workflowId === 'interview_recap' && '实战面试复盘与知识回流资产'}
                {workflowId === 'mock_interview' && 'Mock 面试全流程攻防矩阵与话术库'}
                {workflowId === 'knowledge_intake' && 'AI 知识点摄取与架构级概念库'}
              </span>
              <p className="text-[10px] text-slate-400 font-mono">
                符合行业标准的 Markdown 结构化持久化规范
              </p>
            </div>
            <button
              onClick={() => handleCopyText(
                workflowId === 'jd_evaluation' ? JSON.stringify(MOCK_JD_OUTPUT, null, 2) :
                workflowId === 'interview_recap' ? JSON.stringify(MOCK_RECAP_OUTPUT, null, 2) :
                workflowId === 'mock_interview' ? JSON.stringify(MOCK_INTERVIEW_OUTPUT, null, 2) :
                JSON.stringify(MOCK_KNOWLEDGE_OUTPUT, null, 2),
                'full_spec'
              )}
              className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-mono"
            >
              {copiedKey === 'full_spec' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'full_spec' ? '已复制全量 Spec' : '复制 Spec JSON'}</span>
            </button>
          </div>

          {/* Render Full Content */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-white/10 font-mono text-[11px] text-slate-200 space-y-3 max-h-[460px] overflow-y-auto leading-relaxed">
            {workflowId === 'jd_evaluation' && (
              <div className="space-y-3 font-sans">
                <div className="border-b border-white/10 pb-2">
                  <h4 className="text-sm font-bold text-cyan-300">目标岗位机会评估与量化矩阵</h4>
                  <p className="text-slate-400 text-xs mt-0.5">目标公司: {MOCK_JD_OUTPUT.company} · 职级推荐: {MOCK_JD_OUTPUT.tierRecommendation}</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-200">一、核心评估结论</h5>
                  <p className="text-slate-300 text-xs leading-relaxed">综合得分 {MOCK_JD_OUTPUT.overallScore}/100 分。候选人在 Agentic Workflows 状态机架构与 12 维自动化评测体系上的沉淀，与该岗位对企业级高可用落地要求高度重合，建议优先作为 S 级攻坚机会推进。</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-200">二、定制化招呼语策略</h5>
                  <pre className="bg-slate-900 p-2.5 rounded-lg text-slate-300 whitespace-pre-wrap text-xs font-sans">
                    {MOCK_JD_OUTPUT.recommendedGreeting.text}
                  </pre>
                </div>
              </div>
            )}

            {workflowId === 'interview_recap' && (
              <div className="space-y-3 font-sans">
                <div className="border-b border-white/10 pb-2">
                  <h4 className="text-sm font-bold text-amber-300">实战面试复盘与知识回流报告</h4>
                  <p className="text-slate-400 text-xs mt-0.5">目标公司: {MOCK_RECAP_OUTPUT.company} · 轮次: {MOCK_RECAP_OUTPUT.round}</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-200">一、金牌改写标准答案</h5>
                  {MOCK_RECAP_OUTPUT.improvedStandardAnswers.map((ans, idx) => (
                    <div key={idx} className="bg-slate-900 p-2.5 rounded-lg space-y-1">
                      <span className="font-bold text-cyan-300 text-xs">{ans.question}</span>
                      <p className="text-slate-300 text-xs whitespace-pre-wrap">{ans.recommendedAnswer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {workflowId === 'mock_interview' && (
              <div className="space-y-3 font-sans">
                <div className="border-b border-white/10 pb-2">
                  <h4 className="text-sm font-bold text-purple-300">Mock 面试题库与攻防体系</h4>
                  <p className="text-slate-400 text-xs mt-0.5">目标角色: {MOCK_INTERVIEW_OUTPUT.targetRole} · 就绪度: {MOCK_INTERVIEW_OUTPUT.readinessScore}%</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-200">一、自我介绍话术</h5>
                  <p className="text-slate-300 text-xs whitespace-pre-wrap">{MOCK_INTERVIEW_OUTPUT.selfIntroduction.script}</p>
                </div>
              </div>
            )}

            {workflowId === 'knowledge_intake' && (
              <div className="space-y-3 font-sans">
                <div className="border-b border-white/10 pb-2">
                  <h4 className="text-sm font-bold text-cyan-300">AI 知识点摄取与架构级概念库</h4>
                  <p className="text-slate-400 text-xs mt-0.5">{MOCK_KNOWLEDGE_OUTPUT.sourceTitle}</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-200">一、核心概念解析</h5>
                  {MOCK_KNOWLEDGE_OUTPUT.coreConcepts.map((c, idx) => (
                    <div key={idx} className="bg-slate-900 p-2.5 rounded-lg space-y-1">
                      <span className="font-bold text-cyan-300 text-xs">{c.concept}</span>
                      <p className="text-slate-300 text-xs">{c.definition}</p>
                      <p className="text-emerald-400 text-[10px]">⚡ 工业价值: {c.productionImpact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import {
  WorkflowId,
  WorkflowConfig,
  CandidateProfile,
  CandidateAssetFile,
  AssetCategory,
  ToolDefinition,
  JDEvaluationOutput,
  InterviewRecapOutput,
  MockInterviewOutput,
  KnowledgeIntakeOutput,
  SharedRunContext,
  WritebackPlanItem,
  ToolTraceItem,
  AgentMessage,
  AgentId,
  HarnessState
} from '../types/harness';

export const AGENT_DIRECTORY: Record<AgentId, { name: string; role: string; avatar: string; color: string; desc: string }> = {
  orchestrator_agent: {
    name: 'Orchestrator Agent',
    role: '工作流总控与意图路由',
    avatar: '🎯',
    color: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300',
    desc: '负责解析用户任务意图、调度专业子 Agent、维护全局 Run Context 与状态机流转。'
  },
  jd_opportunity_agent: {
    name: 'JD Opportunity Agent',
    role: '机会价值与匹配度评估',
    avatar: '🧭',
    color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    desc: '基于候选人资产与定位规则，多维量化评估岗位价值，生成定制化招呼语。'
  },
  interview_recap_agent: {
    name: 'Interview Recap Agent',
    role: '面试复盘与攻防提取',
    avatar: '🎙️',
    color: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
    desc: '深度解析面试实录，定位失分点与亮点，输出标准回答建议及攻防 Q&A。'
  },
  mock_interview_agent: {
    name: 'Mock Interview Agent',
    role: '模拟面试与多轮追问链',
    avatar: '⚡',
    color: 'border-purple-500/50 bg-purple-500/10 text-purple-300',
    desc: '融合资产库与风险边界，生成 STAR 深挖、防守矩阵及动态追问链测试。'
  },
  knowledge_intake_agent: {
    name: 'Knowledge Intake Agent',
    role: '前沿技术提取与话术转化',
    avatar: '📚',
    color: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300',
    desc: '抓取技术长文与架构解析，提炼生产级核心概念并转化为高水准面试表达。'
  },
  memory_curator_agent: {
    name: 'Memory Curator Agent',
    role: '知识库回写与记忆治理',
    avatar: '💾',
    color: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
    desc: '管理 Human Review 确认门禁，生成规范 Markdown/Frontmatter 并写回目录。'
  }
};

export const DESENSITIZED_CANDIDATE: CandidateProfile = {
  name: '林思源 (Alex Lin)',
  title: '资深 AI 产品专家 / 大模型应用架构与 Agent 方向',
  experienceYears: 7,
  positioning: '具备大模型应用与智能体系统落地闭环能力的产品架构师，擅长 Harness 设计、Tool Calling 编排、评测体系与工业级工作流。',
  strengths: [
    '7 年企业级 SaaS / AI 产品经验，主导过千万级流水多 Agent 协同工作流系统架构',
    '深刻理解 LLM Tool Calling、Memory Buffer、State Machine 与 Human-in-the-Loop 门禁',
    '具备敏锐商业嗅觉，能将抽象大模型能力解构为高 ROI 的垂直行业解决方案'
  ],
  riskBoundaries: [
    '不盲目夸大无边界的端到端 Agent 自动化能力，始终强调工业级可控性与回滚机制',
    '在薪酬谈判中强调核心架构贡献与 Owner Scope，拒绝缺乏决策权的执行层外包属性岗位',
    '面试中避免泄露原业务私有 Prompt 与脱敏商业数据，聚焦抽象架构逻辑与方法论'
  ],
  coreProjects: [
    {
      name: 'Agentic Workflows 智能调度引擎',
      role: 'Head of Product',
      architecture: '基于 Graph DAG 状态机、动态 Tool Registry 与持久化 Shared Context 机制',
      impact: '支撑 200+ 复杂企业业务流，任务完成率提升 42%，异常召回率 99.4%'
    },
    {
      name: 'LLM 工业级评测与安全对齐平台',
      role: '资深产品专家',
      architecture: '构建 12 维自动化 Eval 管道 + 人工标注协同的 RLHF 反馈回路',
      impact: '将模型幻觉率压降至 1.8% 以内，支撑核心业务上线'
    }
  ]
};

export const ASSET_CATEGORIES_META: Record<AssetCategory, {
  label: string;
  enLabel: string;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
}> = {
  self_intro: {
    label: '自我介绍',
    enLabel: 'Self Introduction',
    iconName: 'MessageSquare',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    description: '电梯演讲、求职动机、核心亮点与定制化自述版本'
  },
  positioning: {
    label: '定位',
    enLabel: 'Positioning & Persona',
    iconName: 'Target',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    textColor: 'text-indigo-400',
    description: '基准画像、能力雷达、目标职级与差异化竞争优势'
  },
  risk_boundary: {
    label: '风险与边界',
    enLabel: 'Risks & Boundaries',
    iconName: 'ShieldAlert',
    color: 'from-amber-500 to-rose-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    description: '不可妥协底线、薪酬底限、商业合规与技术盲区防守策略'
  },
  projects: {
    label: '项目资产',
    enLabel: 'Project Assets (STAR)',
    iconName: 'FolderGit2',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    description: '深度 STAR 案例、系统架构图、量化收益与追问防守库'
  },
  ai_knowledge: {
    label: 'AI 知识库',
    enLabel: 'AI Knowledge Base',
    iconName: 'BrainCircuit',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    description: '智能体 Harness 架构、状态机编排、Eval 评测与前沿白皮书'
  },
  jd_eval: {
    label: '机会评估',
    enLabel: 'JD & Opportunity Eval',
    iconName: 'Compass',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    description: '目标岗位深度剖析、团队背景、职级对齐与投入产出比评级'
  },
  mock_qa: {
    label: 'Mock 面试',
    enLabel: 'Mock Q&A Bank',
    iconName: 'HelpCircle',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-400',
    description: '高频攻防题库、深度追问链、行为面试准备与标杆应答范式'
  },
  interview_recap: {
    label: '面试复盘',
    enLabel: 'Interview Recaps',
    iconName: 'RotateCcw',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-400',
    description: '实战面试记录、挂点与卡点归因、改进计划与知识回流'
  }
};

export const INITIAL_CANDIDATE_ASSETS: CandidateAssetFile[] = [
  // 1. 自我介绍
  {
    id: 'asset-intro-1',
    name: 'AlexLin_1分钟电梯演讲_AI产品架构.md',
    category: 'self_intro',
    fileType: 'md',
    sizeFormatted: '4.2 KB',
    updatedAt: '2026-08-28 16:40',
    summary: '面向业务线负责人与架构总监的 1 分钟高密度自述，突出 Agent 工业级落地与商业闭环。',
    tags: ['1分钟自述', '电梯演讲', 'Agent架构', '商业化ROI'],
    activeInRun: true,
    content: `# 林思源 (Alex Lin) - 1分钟求职自述 (AI产品架构 / Agent方向)

## 📌 开场与定位 (15秒)
> “您好，我是林思源。拥有 7 年企业级 SaaS 与大模型落地经验，主导过千万级流水多智能体 (Multi-Agent) 协同工作流系统与工业级评测平台。”

## 💡 核心差异化竞争优势 (30秒)
1. **工业级 Agent 系统闭环**：不仅懂 Prompt Engineering，更擅长用确定性状态机 (Finite State Machine) 与严格的 Tool Calling 架构约束大模型的非确定性，将复杂企业流任务完成率提升 42%，异常召回率高达 99.4%。
2. **安全与评测护城河**：构建了 12 维自动化 Eval 管道与人机协同对齐机制，使模型上线幻觉率压降至 1.8% 以内。

## 🎯 求职诉求与价值交付 (15秒)
“我今天期望交流的是贵司在大模型应用层与智能体落地方向的核心机会。我的目标是作为 Owner，帮团队把大模型从‘Demo 尝鲜’做成‘生产级高可用、高 ROI’的业务增长引擎。”`
  },
  {
    id: 'asset-intro-2',
    name: '3分钟深度自我介绍_业务与技术闭环.pdf',
    category: 'self_intro',
    fileType: 'pdf',
    sizeFormatted: '18.6 KB',
    updatedAt: '2026-08-26 11:20',
    summary: '涵盖职业进阶脉络、三大代表作拆解、工程哲学与文化契合度的完整结构化发言稿。',
    tags: ['3分钟自述', '深度复盘', '代表作拆解'],
    activeInRun: true,
    content: `# 3分钟深度自我介绍：从企业级 SaaS 到大模型 Agent 架构闭环

## 一、职业经历演进
- **前 4 年 (企业级 SaaS 架构期)**：负责复杂 ERP 与协同平台核心业务流，主导过 50+ 异构系统集成，打下扎实的状态机与服务网格功底。
- **近 3 年 (大模型与智能体应用期)**：全面转入 LLM 应用层，主导自研 Agentic Workflows 调度中枢与大模型生产级评测平台。

## 二、两项核心标杆代表作
1. **Agentic Workflows 智能调度中枢**
   - 痛点：传统 LangChain 类线性链条缺乏容错，企业级场景经常卡死或调用失控。
   - 解法：重构为 Graph DAG 状态机架构 + 动态 Tool Registry + 共享只读快照 + 集中裁决机制。
   - 结果：支撑 200+ 复杂企业流程，故障率降低 85%。
2. **LLM 自动化评测与安全对齐框架**
   - 结合 G-Eval 与 Golden Dataset，搭建真实生产数据的自动化回归流水线，阻断了 90% 以上的 Prompt 漂移隐患。

## 三、面试官核心关注点回应准备
- **为什么看好本机会**：贵司拥有丰富的高价值业务流与私域数据资产，正是 Agentic AI 产生规模化复利的最佳土壤。`
  },

  // 2. 定位
  {
    id: 'asset-pos-1',
    name: '候选人基准定位与画像_Persona.md',
    category: 'positioning',
    fileType: 'md',
    sizeFormatted: '6.8 KB',
    updatedAt: '2026-08-30 09:15',
    summary: '定义候选人主次标签、目标职级 (P8/Expert)、期望团队规模与核心职责范围。',
    tags: ['Persona', '目标职级', '核心标签', '期望薪酬'],
    activeInRun: true,
    content: `# 候选人基准画像 (Candidate Baseline Persona)

## 👤 基本信息
- **姓名**：林思源 (Alex Lin)
- **行业经历**：7 年 (4年 SaaS/PaaS 架构 + 3年大模型/Agent 平台)
- **目标岗位**：资深 AI 产品专家 / 大模型应用架构师 / Head of Agent Platform
- **期望职级**：阿里 P8 / 腾讯 11-12 / 字节 3-1 / 独立业务线 AI 负责人
- **目标薪资基准**：50k - 70k · 16 薪 + 股权激励

## 🎯 核心职业标签与定位
1. **Agentic AI 架构先锋**：拒绝无约束套壳，具备 Harness 设计与状态机工程掌控力。
2. **严谨的工程与产品双视角**：能与算法团队深入讨论 Loss/RAG/Token 延迟，也能与业务方算清楚投入产出比 (ROI)。
3. **安全与评测执念**：坚信没有 Evals 就没有工业级大模型产品。

## 📊 能力雷达分布
- **Agent 架构编排**：96/100 (顶尖)
- **Tool Calling & 容错**：94/100 (顶尖)
- **LLM 评测与对齐 (Evals)**：92/100 (资深)
- **业务 ROI 解构与商业化**：90/100 (资深)
- **底层 CUDA 算子开发**：55/100 (知晓原理，非核心强项)`
  },
  {
    id: 'asset-pos-2',
    name: '差异化竞争优势与能力雷达.pdf',
    category: 'positioning',
    fileType: 'pdf',
    sizeFormatted: '24.1 KB',
    updatedAt: '2026-08-25 18:00',
    summary: '对比普通 AI PM 与套壳工程师的核心优势矩阵，提供量化攻防支撑。',
    tags: ['竞争优势', '攻防对比', '能力矩阵'],
    activeInRun: true,
    content: `# 差异化竞争优势对比分析 (Competitive Edge Matrix)

| 评估维度 | 普通 AI 产品经理 (90% 市面画像) | 林思源 (Alex Lin) 架构级定位 |
| :--- | :--- | :--- |
| **技术认知** | 停留在 Prompt 调优与市面工具套壳 | 具备 Harness 架构认知、理解状态机、动态 Tool Registry 与 RPC 拓扑 |
| **稳定性控制** | 依赖 LLM 自行发散，遇到错误无能为力 | 引入只读快照、集中裁决、熔断重试与 Human Review 门禁 |
| **评测体系** | 仅凭肉眼抽检几个 Case 感觉好坏 | 搭建 12 维自动化 Eval 管道与回归防护，以指标说话 |
| **架构主导权** | 只能提需求，被研发牵着鼻子走 | 能够自主定义 API/JSON Schema，给出完整的状态机 DAG 设计方案 |`
  },

  // 3. 风险与边界
  {
    id: 'asset-risk-1',
    name: '面试攻防红线与不可妥协边界.md',
    category: 'risk_boundary',
    fileType: 'md',
    sizeFormatted: '5.5 KB',
    updatedAt: '2026-08-29 10:45',
    summary: '梳理求职过程中的绝对红线、薪资妥协底线、商业保密原则与反忽悠清单。',
    tags: ['红线底线', '商业保密', '反忽悠', '薪酬谈判'],
    activeInRun: true,
    content: `# 面试攻防红线与不可妥协边界 (Hard Boundaries & Redlines)

## 🚫 绝对红线 (Non-negotiable)
1. **拒绝伪 AI 外包与无决策权岗位**：不接仅负责给外部项目打杂、无底层系统架构主导权的传话筒岗位。
2. **商业秘密严格脱敏**：任何过往公司的私有 Prompt、未公开未标注业务数据、机密客户名录坚决脱敏，绝不为了讨好面试官违反保密协议。
3. **不可虚假承诺“100% 全自动 Agent”**：面试中必须主动指出 LLM 存在幻觉与非确定性，强调必须配合确定性状态机与人工门禁。

## 💰 薪酬谈判底线
- 现金流底线：月薪低于 45k 坚决不降级接 Offer。
- 期权折算原则：不为画饼式全期权降低基础现金流保障，期权只作为上行空间溢价。

## 🛡️ 常见面试“挖坑”反击策略
- **问：“你觉得大模型很快就能完全替代人工，你同意吗？”**
  - **反击话术**：“在完全闭环、容错率极高的场景可以，但在企业核心业务流中，模型必须作为 Copilot 或受状态机严格约束的 Executor。工业级产品的价值恰恰在于处理那 5% 的 Corner Case。”`
  },
  {
    id: 'asset-risk-2',
    name: '技术盲区防守话术与转接策略.md',
    category: 'risk_boundary',
    fileType: 'md',
    sizeFormatted: '4.8 KB',
    updatedAt: '2026-08-27 15:20',
    summary: '针对底层 GPU 算子、预训练 Loss 优化等非目标长项的专业防守与转接策略。',
    tags: ['盲区防守', '面试话术', '转接技巧'],
    activeInRun: true,
    content: `# 技术盲区防守与策略性转接 (Defense & Pivot Strategy)

## 场景 1：面试官深究底层 CUDA / C++ 算子加速
- **错误回答**：不懂装懂或直接表现出慌乱。
- **标准转接话术**：
  > “底层 Triton/CUDA 算子开发在之前团队由专职异构计算与系统级架构师负责。我重点聚焦在应用架构层——如何通过请求并发分流、Prompt 缓存复用、KV Cache 优化和动态路由，把整体推理延迟压降 60%，并把 Token 成本降低 45%。”

## 场景 2：面试官质疑 7 年经验转型大模型的深度
- **标准转接话术**：
  > “大模型应用绝不是孤立算法，它本质是‘传统确定性工程’与‘非确定性认知模型’的结合。我前 4 年沉淀的状态机、分布式事务与企业级权限体系，恰恰是大模型从玩具走向生产级不可或缺的基石。”`
  },

  // 4. 项目资产
  {
    id: 'asset-proj-1',
    name: 'STAR项目1_AgenticWorkflows智能调度引擎.md',
    category: 'projects',
    fileType: 'md',
    sizeFormatted: '12.4 KB',
    updatedAt: '2026-08-31 14:00',
    summary: '详细阐述基于 Graph DAG、Tool Registry 与 Shared Context 的多 Agent 协同系统。',
    tags: ['STAR项目', '调度引擎', 'DAG状态机', 'ToolCalling', '千万级流水'],
    activeInRun: true,
    content: `# STAR 深度复盘：Agentic Workflows 智能调度中枢

## 1. Situation (背景与痛点)
- 企业内部拥有 30+ 异构业务系统与多轮人工流转，传统基于规则的 RPA 脚本极其脆弱，任意界面变更即导致崩溃；而纯 LLM 链条又存在幻觉失控、缺乏状态回滚的问题。

## 2. Task (目标与定位)
- 打造一套工业级、可观测、支持人机协同确认的多 Agent 调度引擎，实现任务自动解析、工具安全调用与事务级状态落盘。

## 3. Action (架构设计与关键动作)
1. **星型通信拓扑 (Star Topology)**：设立中央路由 Orchestrator，负责意图分发与裁决，避免点对点通信的网络风暴。
2. **确定性状态机 (Finite State Machine DAG)**：将工作流切分为 Created -> Parsed -> Tools Called -> Human Gated -> Written Back 等确定性阶段，状态转移严格受控。
3. **共享上下文只读快照 (Shared Run Context Snapshot)**：所有 Agent 共享只读快照，消除数据竞争与写冲突。
4. **工具沙箱与重试降级**：为 15+ 内部工具封装 JSON Schema 校验，遇到异常触发自动退避重试或降级人工介入。

## 4. Result (量化产出与收益)
- **业务效率**：支撑 200+ 复杂流程日常运转，平均流程耗时缩短 68%。
- **稳定性**：任务最终完成率达 99.4%，故障召回与自动熔断率 100%。`
  },
  {
    id: 'asset-proj-2',
    name: 'STAR项目2_LLM工业级评测与安全对齐平台.pdf',
    category: 'projects',
    fileType: 'pdf',
    sizeFormatted: '28.9 KB',
    updatedAt: '2026-08-28 10:00',
    summary: '12 维自动化 Eval 管道设计、G-Eval 指标对齐与生产回归防护全套实施方案。',
    tags: ['STAR项目', 'Eval评测', '安全对齐', '幻觉压降'],
    activeInRun: true,
    content: `# STAR 项目复盘：LLM 工业级评测与安全对齐平台

## 架构亮点概览
- **自动化测试管道**：将人工经验解构为 12 维量化指标（事实准确性、格式遵从度、安全性、拒绝回答边界等）。
- **人机混合评估 (LLM-as-a-Judge + Human Sampling)**：采用双大模型交叉判分 + 异常分歧案件自动路由至高级标注员。
- **业务落地战果**：将主线业务模型幻觉率从 14.2% 压降至 1.8% 以内，保障核心金融级客户安全上线。`
  },
  {
    id: 'asset-proj-3',
    name: 'STAR项目3_千万级企业知识库RAG优化实践.md',
    category: 'projects',
    fileType: 'md',
    sizeFormatted: '9.1 KB',
    updatedAt: '2026-08-24 16:30',
    summary: '混合检索 (Dense + BM25)、父子分块切分与动态重排序 (Rerank) 的落地实战。',
    tags: ['STAR项目', 'RAG优化', '混合检索', '向量数据库'],
    activeInRun: true,
    content: `# STAR 项目：千万级企业知识库 RAG 召回与生成优化

## 关键技术突破
1. **分块策略革新**：摒弃固定字数切块，采用语义感知树状分块 (Parent-Child Chunking)，保证小块精准检索与大块上下文注入。
2. **混合检索策略**：结合 Dense Embedding 向量相似度与 BM25 关键词精确匹配，解决专有名词搜不准问题。
3. **动态 Rerank 重排序**：接入 Cross-Encoder 重排模型，Top-3 召回精准率提升至 94.6%。`
  },

  // 5. AI 知识库
  {
    id: 'asset-ai-1',
    name: '大模型Harness与确定性状态机设计指南.md',
    category: 'ai_knowledge',
    fileType: 'md',
    sizeFormatted: '8.4 KB',
    updatedAt: '2026-08-30 14:20',
    summary: '深入解析 Harness 架构如何通过控制平面、数据平面与执行平面规避 Agent 失控。',
    tags: ['Harness架构', '状态机', '控制平面', '工业级设计'],
    activeInRun: true,
    content: `# 大模型 Harness 与确定性状态机设计指南

## 核心设计哲学
> “大模型的非确定性输出是创新的源泉，但也是工程生产的大敌。Harness 的职责就是给概率模型套上确定性的工程缰绳。”

### 三层解耦架构
1. **控制平面 (Control Plane)**：负责意图识别、权限鉴权、状态转移与 Human Gate 拦截。
2. **执行平面 (Execution Plane)**：负责多 Agent 协作、Tool Calling 调度与沙箱执行。
3. **数据平面 (Data Plane)**：维护只读 Run Context 快照、向量记忆与持久化 Writeback Vault。`
  },
  {
    id: 'asset-ai-2',
    name: 'Multi-Agent通信总线与协同拓扑白皮书.pdf',
    category: 'ai_knowledge',
    fileType: 'pdf',
    sizeFormatted: '32.5 KB',
    updatedAt: '2026-08-29 17:00',
    summary: 'Star Topology vs Mesh Network 权衡对比，以及 Event Mesh 在复杂智能体集群中的应用。',
    tags: ['Agent通信', '拓扑架构', 'EventMesh', 'RPC总线'],
    activeInRun: true,
    content: `# Multi-Agent 通信拓扑与事件总线白皮书

## 一、拓扑选型对比
- **全互联网状 (Mesh Network)**：通信开销为 O(N^2)，容易产生级联死锁与循环幻觉，适用于简单沙盒游戏。
- **中心星型 (Star Topology)**：通信开销 O(N)，Orchestrator 拥有全局上下文与仲裁权，具备最高的可观测性与安全性，是企业生产环境的首选。

## 二、消息契约设计规范
- 严格遵循 JSON Schema 定义请求与响应，所有消息必须包含 timestamp, sender, receiver, traceId, payload。`
  },
  {
    id: 'asset-ai-3',
    name: 'ToolCalling工业级容错与沙箱隔离规范.md',
    category: 'ai_knowledge',
    fileType: 'md',
    sizeFormatted: '7.2 KB',
    updatedAt: '2026-08-26 14:00',
    summary: '参数严格校验、指数退避重试、熔断器模式与人工回滚机制设计指南。',
    tags: ['ToolCalling', '沙箱隔离', '熔断重试', '安全规范'],
    activeInRun: true,
    content: `# Tool Calling 工业级容错与沙箱隔离规范

## 🛡️ 核心防线
1. **Schema 前置校验**：在发起真正 RPC 之前，本地利用 Zod / JSON Schema 严格校验大模型生成的参数结构，拦截率达 99%。
2. **幂等性保障**：所有写操作工具必须附带 ClientToken 或 RunId，防止网络抖动造成的重复写入。
3. **只读预检 (Dry Run)**：破坏性操作先执行 Dry Run，并由 Human Gate 呈现变更 Diff 供人工确认。`
  },

  // 6. 机会评估
  {
    id: 'asset-jdeval-1',
    name: '字节跳动_扣子企业版_资深AI产品专家_JD深度评估.md',
    category: 'jd_eval',
    fileType: 'md',
    sizeFormatted: '11.8 KB',
    updatedAt: '2026-08-31 16:30',
    summary: '针对扣子(Coze)企业版核心岗位的 4 维严谨评估、团队背景拆解与 S 级推进策略。',
    tags: ['机会评估', '字节跳动', '扣子Coze', 'S级机会', '职级对齐'],
    activeInRun: true,
    content: `# 机会评估报告：字节跳动 - 扣子(Coze)企业版资深 AI 产品专家

## 📊 综合评级：S 级 (92 / 100) - 核心攻坚推荐
- **目标职级**：3-1 (对应阿里 P8)
- **薪酬预期**：60k - 75k · 16-18 薪 + 期权
- **业务赛道**：企业级 Multi-Agent 协作与工作流调度平台

## 🎯 四维深度评分
1. **公司与赛道红利 (24/25)**：国内第一梯队 Agent Platform，资源投入大，商业化出海势头强劲。
2. **岗位画像契合度 (24/25)**：要求具备复杂工作流状态机与企业级集成经验，与林思源 7 年背景 95% 重合。
3. **成长与杠杆空间 (22/25)**：直接参与核心生态标准制定，但需面对飞书/火山内部协同竞争。
4. **Owner 话语权与权责 (22/25)**：直接对业务线负责人汇报，有完整的技术产品定义权。

## ⚡ 攻防与行动建议
- **破局点**：重点展示自研 Agentic Workflows 调度中枢架构，用状态机控制、只读快照与熔断方案打动面试官。
- **防守点**：提前准备对于多租户高并发场景下 Token 成本控制与延迟优化的策略。`
  },
  {
    id: 'asset-jdeval-2',
    name: '蚂蚁集团_金融大模型应用架构师_机会透视.pdf',
    category: 'jd_eval',
    fileType: 'pdf',
    sizeFormatted: '22.3 KB',
    updatedAt: '2026-08-27 10:15',
    summary: '金融级高合规场景下的 AI 架构师岗位评估、风控红线与 A+ 级推进路径。',
    tags: ['机会评估', '蚂蚁集团', '金融AI', '高合规', 'A+级'],
    activeInRun: true,
    content: `# 机会透视：蚂蚁集团 - 金融智能体应用架构专家

## 核心评估摘要
- **岗位特点**：对大模型安全合规、事实一致性与 Human Review 审核门禁有极高要求。
- **匹配优势**：候选人自研的 12 维自动化 Eval 评测体系与人机协同审核工作流，高度契合金融级安全心智。
- **推进策略**：强调“确定性状态机护航概率大模型”的严谨工程方法论。`
  },

  // 7. Mock 面试
  {
    id: 'asset-mock-1',
    name: '大模型平台架构与Agent攻防_高频Mock题库.md',
    category: 'mock_qa',
    fileType: 'md',
    sizeFormatted: '15.6 KB',
    updatedAt: '2026-08-30 20:00',
    summary: '包含 10 道大厂高频技术与架构追问题、标准应答结构与追问链防守方案。',
    tags: ['Mock面试', '架构追问', '高频题库', '攻防演练'],
    activeInRun: true,
    content: `# Mock 面试攻防题库：大模型应用架构与 Multi-Agent 编排

## Q1: 为什么不用现成的 LangChain/CrewAI，而要自研基于状态机的 Agent 调度中枢？
### 💡 满分应答范式 (STAR+架构思维)
1. **痛点指出**：开源框架在 Demo 阶段好用，但在生产级企业环境中缺乏确定性状态隔离、持久化回滚与严格的 Schema 校验。
2. **核心方案**：我们采用 Finite State Machine (FSM) 将流程严格拆分为 Created/Parsed/Gated/WrittenBack 等阶段，搭配只读快照机制杜绝写冲突。
3. **收益量化**：任务异常召回率从 72% 提升至 99.4%，故障排查耗时降低 80%。

## Q2: 在多 Agent 协同中，如何防止智能体之间陷入“无限循环对话”或“幻觉雪崩”？
### 💡 防守要点
- **拓扑约束**：强制采用中心星型拓扑 (Star Topology) 而非自由网状 (Mesh)，所有消息经由 Orchestrator 集中裁决。
- **硬性熔断**：单次 Run 设定 MaxSteps 与 Token Budget 上限，异常循环自动触发熔断并转交人工审核 (Human Review)。

## Q3: 谈谈你在 RAG 系统中如何解决“检索到了错误文档导致模型幻觉”的问题？
### 💡 防守要点
- 引入 Dense + BM25 混合检索 -> Cross-Encoder 重排 -> 检索置信度门限过滤 (Threshold Filtering) -> 未命中时优雅拒绝回答。`
  },
  {
    id: 'asset-mock-2',
    name: '行为面试_STAR领导力与项目抗压_Mock演练.pdf',
    category: 'mock_qa',
    fileType: 'pdf',
    sizeFormatted: '19.4 KB',
    updatedAt: '2026-08-25 14:30',
    summary: '涵盖跨部门推动算法团队、大模型上线事故复盘、职级晋升辩护的行为面试高分准备。',
    tags: ['Mock面试', '行为面试', '领导力', '抗压复盘'],
    activeInRun: true,
    content: `# 行为面试 (Behavioral Interview) 高分演练手记

## 核心考核维度
1. **跨团队冲突解决**：当业务方要求“100% 自动无人工”，而算法团队表示当前准确率仅 85% 时，作为 AI PM 如何平衡？
2. **线上事故应急处理**：大模型上线后突发恶性 Prompt 注入与幻觉风险，第一响应与根因闭环机制。`
  },

  // 8. 面试复盘
  {
    id: 'asset-recap-1',
    name: '某头部大厂_大模型应用架构二面_深度实战复盘.md',
    category: 'interview_recap',
    fileType: 'md',
    sizeFormatted: '13.2 KB',
    updatedAt: '2026-08-29 19:30',
    summary: '二面 75 分钟全真复盘：深入考察了状态机死锁回滚、Token 成本控制与团队梯队建设。',
    tags: ['面试复盘', '头部大厂', '二面', '状态机死锁', '改进计划'],
    activeInRun: true,
    content: `# 面试实战复盘：某头部大厂 AI 平台部二面 (技术架构 + 业务沉淀)

## ⏱️ 基本信息
- **面试时长**：75 分钟 · 视频面
- **面试官定位**：业务线研发总监 + 资深系统架构师
- **整体自评**：88 / 100 (通过，已约 HR 终面)

## 🎯 核心高频追问与现场应对
### 1. 问：“如果 Agent 调用第三方 API 出现网络超时，你们的状态机如何保证分布式一致性？”
- **现场回答**：解释了 ClientToken 幂等性、Saga 补偿事务与只读预检机制。
- **面试官反馈**：认可工程落地深度，追问了超时阈值的动态调整逻辑。

### 2. 问：“针对 7 年经验的定位，你未来 1-2 年的 Technical Roadmap 是什么？”
- **现场回答**：打造企业级「确定性工程底座 + 概率大模型执行 + 自动化评测回归」三位一体的落地体系。

## 💡 经验吸取与知识库回流
1. **改进点**：在阐述 Token 缓存复用时，应补充 Prefix Caching 与 KV Cache 结合的定量测算数据。
2. **资产补充**：已将面试官提到的动态熔断补偿逻辑反哺入《Tool Calling 容错规范》。`
  },
  {
    id: 'asset-recap-2',
    name: '某独角兽_HeadOfAI_终面复盘与薪酬谈判手记.pdf',
    category: 'interview_recap',
    fileType: 'pdf',
    sizeFormatted: '21.0 KB',
    updatedAt: '2026-08-26 18:00',
    summary: 'CTO 终面战略契合度沟通、期权与现金结构博弈、入职前 90 天路线图规划。',
    tags: ['面试复盘', '独角兽', '终面', '薪酬博弈', '90天规划'],
    activeInRun: true,
    content: `# 独角兽企业 Head of AI 终面复盘与博弈记录

## 核心复盘成果
1. **战略契合**：与 CTO 就大模型从内部提效迈向外部商业化产品达成高度共识。
2. **薪资博弈**：守住 50k 现金流底线，争取到了 20% 的早期期权激励与保底 16 薪条款。`
  }
];

export const TOOL_REGISTRY: ToolDefinition[] = [
  // 1. Asset Read Tools
  {
    id: 'tool_read_resume_asset',
    name: 'read_candidate_resume',
    category: 'asset_read',
    description: '读取结构化候选人简历资产、技能标签及经历版本',
    agentOwner: ['orchestrator_agent', 'jd_opportunity_agent', 'mock_interview_agent'],
    parametersSchema: {
      candidate_id: { type: 'string', description: '候选人唯一标识', required: true },
      section_filter: { type: 'array', description: '指定抽取的简历章节 (projects, skills, work_exp)' }
    }
  },
  {
    id: 'tool_read_project_assets',
    name: 'read_project_deep_assets',
    category: 'asset_read',
    description: '从本地资产库读取核心项目架构图、STAR 细节与量化指标',
    agentOwner: ['jd_opportunity_agent', 'mock_interview_agent', 'interview_recap_agent'],
    parametersSchema: {
      project_tags: { type: 'array', description: '项目匹配标签 (e.g. agent, eval, workflow)' }
    }
  },
  {
    id: 'tool_read_positioning_rules',
    name: 'read_positioning_and_risk_rules',
    category: 'asset_read',
    description: '读取职业定位规则、薪资底线与面试攻防风险边界',
    agentOwner: ['jd_opportunity_agent', 'mock_interview_agent'],
    parametersSchema: {
      rule_category: { type: 'string', description: '规则分类 (boundary, strategy, salary)' }
    }
  },
  {
    id: 'tool_read_historical_recaps',
    name: 'read_historical_interview_recaps',
    category: 'asset_read',
    description: '检索过往同类型岗位/公司的面试失分点与高频题库',
    agentOwner: ['interview_recap_agent', 'mock_interview_agent'],
    parametersSchema: {
      industry: { type: 'string', description: '目标赛道或公司类型' },
      limit: { type: 'number', description: '召回篇数' }
    }
  },
  {
    id: 'tool_read_ai_knowledge_base',
    name: 'read_ai_knowledge_base',
    category: 'asset_read',
    description: '检索已沉淀的 AI 核心概念、前沿论文与架构表达模板',
    agentOwner: ['mock_interview_agent', 'knowledge_intake_agent'],
    parametersSchema: {
      query: { type: 'string', description: '检索关键词 (e.g. reasoning_model, tool_calling)' }
    }
  },

  // 2. Document Tools
  {
    id: 'tool_parse_jd_screenshot',
    name: 'parse_jd_multimodal_ocr',
    category: 'document',
    description: '多模态 OCR 解析岗位截图，提取公司、职责、硬性要求与薪酬范围',
    agentOwner: ['jd_opportunity_agent'],
    parametersSchema: {
      image_buffer_uri: { type: 'string', description: 'JD 截图临时文件路径', required: true }
    }
  },
  {
    id: 'tool_parse_recap_pdf',
    name: 'parse_interview_recap_document',
    category: 'document',
    description: '解析面试录音转写 PDF 或长文本，切分为问答对并提取情绪特征',
    agentOwner: ['interview_recap_agent'],
    parametersSchema: {
      doc_content: { type: 'string', description: 'PDF 文本或结构化录音转写全文', required: true }
    }
  },
  {
    id: 'tool_extract_article_content',
    name: 'extract_web_article_markdown',
    category: 'document',
    description: '抓取技术长文网页 URL 并清洗提取为标准化正文 Markdown',
    agentOwner: ['knowledge_intake_agent'],
    parametersSchema: {
      target_url: { type: 'string', description: '技术文章或论文链接', required: true }
    }
  },

  // 3. External Tools
  {
    id: 'tool_search_company_research',
    name: 'search_company_intelligence',
    category: 'external',
    description: '搜索引擎检索目标企业融资轮次、业务重心、AI 产品线最新动态',
    agentOwner: ['jd_opportunity_agent', 'interview_recap_agent'],
    parametersSchema: {
      company_name: { type: 'string', description: '企业名称', required: true },
      search_focus: { type: 'string', description: '关注点 (financial, product, leadership)' }
    }
  },
  {
    id: 'tool_search_industry_benchmark',
    name: 'search_industry_benchmark_jd',
    category: 'external',
    description: '比对同行业对标岗位的薪资水平、Headcount 紧缺度与职级要求',
    agentOwner: ['jd_opportunity_agent'],
    parametersSchema: {
      role_title: { type: 'string', description: '岗位名称' },
      city: { type: 'string', description: '城市' }
    }
  },

  // 4. Writeback Tools (Human-Gated)
  {
    id: 'tool_writeback_opportunity',
    name: 'writeback_opportunity_card',
    category: 'writeback',
    description: '将岗位评分报告与招呼语写入 Obsidian 知识库机会目录',
    agentOwner: ['memory_curator_agent'],
    isHumanGated: true,
    parametersSchema: {
      target_file: { type: 'string', description: '目标写入路径' },
      markdown_payload: { type: 'string', description: '标准化 Markdown 内容' }
    }
  },
  {
    id: 'tool_writeback_recap_insights',
    name: 'writeback_interview_recap_matrix',
    category: 'writeback',
    description: '将面试复盘、失分改进项及攻防 Q&A 写入复盘数据库',
    agentOwner: ['memory_curator_agent'],
    isHumanGated: true,
    parametersSchema: {
      company_round: { type: 'string', description: '公司与轮次' },
      qa_pairs: { type: 'array', description: '提炼的攻防知识' }
    }
  },
  {
    id: 'tool_writeback_mock_qa',
    name: 'writeback_mock_qa_repository',
    category: 'writeback',
    description: '沉淀模拟面试高频题与标准 STAR 话术到个人问答库',
    agentOwner: ['memory_curator_agent'],
    isHumanGated: true,
    parametersSchema: {
      target_vault: { type: 'string', description: '输出文件夹' }
    }
  },
  {
    id: 'tool_writeback_ai_knowledge',
    name: 'writeback_ai_knowledge_card',
    category: 'writeback',
    description: '将提炼的 AI 核心概念与面试金句写入 AI Knowledge Vault',
    agentOwner: ['memory_curator_agent'],
    isHumanGated: true,
    parametersSchema: {
      concept_title: { type: 'string', description: '概念名称' },
      frontmatter_tags: { type: 'array', description: '分类标签' }
    }
  }
];

export const WORKFLOWS_CONFIG: WorkflowConfig[] = [
  {
    id: 'jd_evaluation',
    name: 'JD 机会评估与匹配',
    shortDesc: 'OCR 解析岗位截图，多维度量化评估机会质量，生成精准定制招呼语。',
    primaryAgent: 'jd_opportunity_agent',
    assistantAgents: ['orchestrator_agent', 'memory_curator_agent'],
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    defaultInputType: 'screenshot_ocr',
    sampleCases: [
      {
        id: 'jd_case_1',
        title: '智元未来 - AI Agent 产品架构专家 (45k-65k·16薪)',
        description: '头部生成式 AI 独角兽，负责企业级多智能体协同引擎产品化',
        rawInput: `【岗位名称】AI Agent 产品架构专家 / 资深专家
【公司名称】智元未来 (AIGC 独角兽企业，B+ 轮)
【薪资范围】45k-65k · 16 薪 + 核心团队期权
【工作地点】北京 / 深圳 / 支持部分远程

【岗位职责】
1. 负责核心企业级多 Agent 调度编排系统 (Multi-Agent Harness) 的产品架构与生命周期设计；
2. 深度理解 Tool Calling、ReAct、Reflection 与记忆持久化机制，构建高可靠任务流转引擎；
3. 建立大模型输出评测（Eval Benchmark）与异常容错兜底机制，对齐复杂企业业务规则；
4. 协同算法团队完成模型微调策略定义与端到端延迟/Token 成本优化。

【任职要求】
1. 5 年以上 B 端/平台型产品经验，至少 2 年以上大模型应用/Agent 实际落地负责人经历；
2. 对 LLM Agent 架构（State Machine、Context Buffer、Tool Registry、Human-in-the-loop）有深入理解；
3. 具备强技术理解力与架构抽象能力，有优秀的数据感知与 ROI 商业闭环意识。`
      },
      {
        id: 'jd_case_2',
        title: '星云计算 - 大模型工具链产品负责人 (50k-70k)',
        description: '高增长 Infra 公司，主导面向开发者的 Agentic SDK 与工作流平台',
        rawInput: `【岗位名称】大模型工具链与开发者生态产品总监
【公司名称】星云计算 (Nebula Compute)
【薪资范围】50k-70k · 15 薪 + 股权
【岗位职责】主导开发者 Agent Harness 工具链，打造可视化 Workflow 编排、Tool Debugger 与 Observability 监控套件。`
      }
    ]
  },
  {
    id: 'interview_recap',
    name: '面试深度复盘与攻防提取',
    shortDesc: '解析面试录音全文，量化打分过程表现，提炼失分点与标准化金牌回答。',
    primaryAgent: 'interview_recap_agent',
    assistantAgents: ['orchestrator_agent', 'memory_curator_agent'],
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    defaultInputType: 'pdf_text',
    sampleCases: [
      {
        id: 'recap_case_1',
        title: '星云流光 - 二面 AI 架构与 Agent 评测深度技术面 (75分钟实录)',
        description: '面试官为产品 VP + 算法总监，围绕 Agent 失败重试、Eval 体系与 Tool Calling 深入攻防',
        rawInput: `[面试实录脱敏片段]
时间：2026-08-20 14:00 - 15:15
面试岗位：资深 AI Agent 产品架构师
面试官：某独角兽 VP（前大厂 P9，风格犀利，偏好严密逻辑与指标数据）

Q1 [面试官]: 你们做 Multi-Agent Harness 的时候，当一个 Agent 的 Tool Calling 失败或者返回格式错乱，系统是如何自愈的？你怎么防止死循环调用消耗 Token？
候选人回答: 我们在架构上做了 Try-Catch 机制，并且加了一个最大重试次数限制，比如最多 3 次。如果第 3 次还失败，就退回到用户澄清环节。另外我们也有日志记录报警。

Q2 [面试官]: 3 次重试这个策略太粗糙了。如果是 Schema 校验失败和接口超时，你的策略一样吗？重试的时候上下文怎么更新？
候选人回答: 呃……目前我们主要是同一套提示词再重试一次，有时候模型第二次就能答对。对于接口超时，我们有独立的超时阈值。上下文的话，会把报错信息拼到最新的 Message 里给模型看。

Q3 [面试官]: 聊聊你们的 Eval 体系。你怎么证明上线一个新版本的 Agent Harness 整体是正向提升的？你们的评估数据集有多大？
候选人回答: 我们主要通过人工抽检 200 条典型 Case，然后加上算法团队跑的自动化准确率。我们做了一个打分看板，每周看召回率变化。

Q4 [面试官]: 假如业务方要求 100% 可靠性，而大模型本质是概率性的，作为 PM 你如何向业务方承诺 SLA？`
      }
    ]
  },
  {
    id: 'mock_interview',
    name: 'Mock 模拟面试与追问链',
    shortDesc: '结合简历资产与攻防矩阵，生成定制化自我介绍、STAR 深度剖析与面试官追问。',
    primaryAgent: 'mock_interview_agent',
    assistantAgents: ['orchestrator_agent', 'memory_curator_agent'],
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    defaultInputType: 'interactive_prompt',
    sampleCases: [
      {
        id: 'mock_case_1',
        title: '智元未来 - AI Agent Lead 终面压力场景模拟',
        description: '高难度技术与商业双重追问：大模型落地 ROI、架构边界与架构失败自愈',
        rawInput: `模拟目标：智元未来 AI Agent 产品架构专家 (终面)
面试官画像：技术出身的业务 VP，看重架构自洽性、工程成本意识与真实上线踩坑经验。
聚焦领域：
1. Harness 状态机架构设计细节与异常处理
2. Tool Registry 与动态授权控制
3. Human-in-the-Loop 门禁如何在不降低吞吐率的前提下保证安全`
      }
    ]
  },
  {
    id: 'knowledge_intake',
    name: 'AI 核心知识与话术摄入',
    shortDesc: '解析技术文章与论文，提炼底层概念，转化为面试高阶话术并沉淀到知识库。',
    primaryAgent: 'knowledge_intake_agent',
    assistantAgents: ['orchestrator_agent', 'memory_curator_agent'],
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    defaultInputType: 'article_url',
    sampleCases: [
      {
        id: 'knowledge_case_1',
        title: '《Production Multi-Agent Harness: State Machines & Safe Tool Calling》',
        description: '行业顶级架构解析：工业级 Agent 系统的上下文隔离与可控状态转移',
        rawInput: `https://arxiv.org/abs/2608.agent-harness-architecture-prod
文章标题：生产环境中的多智能体 Harness 架构设计实践与可控性保障
核心内容速览：
1. 为什么传统单 Agent 聊天回路无法支撑复杂企业流程？因为无法保证状态收敛与事务一致性。
2. Harness 的核心三大件：
   - Unified Run Context：跨 Agent 的只读视图与受控写锁；
   - Deterministic State Machine：用强状态转移图约束 Agent 的跳跃自由度；
   - Tool Calling Sandbox & Gatekeeper：将副作用工具（如写数据库、发邮件）隔离在 Human Review Gate 之后。
3. 对齐评估：从纯 Text 评测转向 Trajectory Eval（轨迹评测），关注 Agent 的调用链是否符合最短最优路径。`
      }
    ]
  }
];

// Pre-baked high fidelity structured outputs for each workflow
export const MOCK_JD_OUTPUT: JDEvaluationOutput = {
  company: '智元未来 (AIGC 独角兽企业)',
  position: 'AI Agent 产品架构专家',
  overallScore: 92,
  tierRecommendation: 'S 级核心攻坚',
  dimensions: {
    companyQuality: {
      score: 94,
      comment: '行业头部生成式 AI 独角兽，B+ 轮资金充裕，团队具备顶级算法与工程基因，技术壁垒高。'
    },
    positionMatch: {
      score: 96,
      comment: '岗位核心要求（Harness 状态机、Tool Registry、Eval 体系）与候选人过往 7 年核心资产高度吻合，几乎零代沟。'
    },
    opportunityDelta: {
      score: 88,
      comment: '岗位直接面向下一代企业级 Agent 引擎定义，能将候选人架构经验转化为行业标杆产品，履历含金量极高。'
    },
    ownerScope: {
      score: 90,
      comment: '具备端到端系统主导权，直接汇报给业务 VP，而非执行层打杂，发挥空间大。'
    },
    sustainability: {
      score: 85,
      comment: 'B 端落地场景清晰（金融/制造/出海），商业化路径比纯 C 端对话产品更稳健，抗周期能力强。'
    }
  },
  coreMatches: [
    '【架构匹配】候选人主导过 Agentic Workflows 智能调度引擎，与 JD 中“多 Agent 调度编排系统” 100% 对齐',
    '【机制匹配】深入掌握 Tool Calling、Context Buffer 与 Human-in-the-loop 门禁，具备工业级闭环落地经验',
    '【量化匹配】过往主导 12 维 Eval 评测体系，能够快速补齐团队缺乏自动化评估指标的痛点'
  ],
  potentialRisks: [
    '业务处于高速扩张期，可能存在算法与产品协同中的交付压力，需要明确技术可行性评估边界',
    '注意在沟通中突出“如何用系统化 Harness 压降 Token 成本”，避免被认为只懂概念不懂工程约束'
  ],
  recommendedGreeting: {
    version: '专业架构深度版 (针对业务负责人/VP)',
    text: `您好！关注到贵司正在布局企业级多 Agent 调度编排系统 (Harness)，这与我近 3 年在 Agentic Workflow 领域的产品架构实践高度重合。

我此前主导过千万级调用的多智能体协同引擎，重点攻克了：
1. 基于状态机与 Run Context 隔离的 Agent 容错自愈机制；
2. 细粒度 Tool Registry 与 Human-in-the-Loop 安全写回门禁；
3. 覆盖 12 维轨迹评测（Trajectory Eval）的自动化监控平台，将核心任务异常率压降至 0.6%。

附上我关于 Agent Harness 工业化落地的脱敏架构文档与项目复盘，非常期待能与您就贵司当前的 Agent 编排与落地场景做一次深入交流！`,
    strategyNotes: '开门见山直击痛点（Harness 自愈、Tool 权限、Eval 轨迹），用具体量化指标与架构词汇迅速建立行业专家信赖度。'
  },
  defensePreparationPoints: [
    '准备 1 个 Tool 失败级联重试的经典 Bad Case 解决方案',
    '准备在 5 分钟内画出 Harness 的 Run Context 读写隔离图',
    '强调 ROI：如何通过缓存与上下文裁剪为客户节省 35% Token 成本'
  ]
};

export const MOCK_RECAP_OUTPUT: InterviewRecapOutput = {
  company: '星云流光',
  round: '二面 (AI 架构与 Agent 评测深度技术面)',
  interviewOverallScore: 78,
  interviewerProfile: {
    impression: '逻辑极其严密的前大厂 P9 / VP，极度反感套话与粗颗粒度回答，对边界 Case 与工程细节追问到底。',
    capabilityLevel: '技术专家',
    styleMatchScore: 82,
    styleAnalysis: '候选人在宏观架构与定位上表现出色，但被追问到“Tool 异常自愈策略”与“SLA 承诺”等微观工程细节时，回答略显单薄，引发了面试官连续 3 轮施压。'
  },
  opportunityScore: 85,
  strongPerformances: [
    {
      question: 'Q3 聊聊你们的 Eval 体系与模型版本迭代评估',
      highlight: '清晰给出了 12 维自动化评测矩阵与人工标注闭环机制，展现了系统化思考框架。',
      whyGood: '打消了面试官对“AI 产品只靠感觉不靠指标”的偏见，建立了专业信任。'
    },
    {
      question: '自我介绍与定位阐述',
      highlight: '7 年 SaaS + Agent 落地主线清晰，没有使用堆砌词汇，直击核心价值。',
      whyGood: '面试官开场就认可了候选人背景的真实度与匹配度。'
    }
  ],
  weakPerformances: [
    {
      question: 'Q1 & Q2 Tool Calling 失败自愈与死循环防护',
      currentFlaw: '回答了简单的“Try-Catch 重试 3 次”，没有区分 Schema 错误、超时、参数缺失和模型幻觉，显得工程落地经验不够深。',
      riskTriggered: '被面试官判定为“对复杂生产环境的异常 Case 缺乏防御性设计”。'
    },
    {
      question: 'Q4 面向业务方的 100% SLA 承诺悖论',
      currentFlaw: '直接讨论算法概率问题，未能从“确定性工程兜底 + 规则引擎分流”角度给出商业化保障方案。',
      riskTriggered: '让面试官担忧候选人与企业客户沟通时难以承接硬性考核。'
    }
  ],
  improvedStandardAnswers: [
    {
      question: 'Tool Calling 失败时系统如何自愈并防止死循环？',
      originalSummary: '原答：加了 Try-Catch，最多重试 3 次，失败退回人工，把错误拼进 Prompt。',
      recommendedAnswer: `在工业级 Harness 中，我们将 Tool 异常划分为四级防御机制：
1. 【语法层 (Schema Mismatch)】：采用 Pydantic/Zod 拦截，本地格式化 Repair Prompt（不调业务工具），直接将 Validation Error 注入短期 Context 单步纠偏，限制 1 次；
2. 【网络/超时层 (Transient Error)】：走指数退避重试（Exponential Backoff），完全不消耗 LLM 推理 Token；
3. 【语义/幻觉层 (Invalid Params)】：触发 Reflection Agent 分析参数冲突，若连续 2 次无法解析，动态降级至默认规则或进入 Clarification 交互；
4. 【死循环熔断 (Circuit Breaker)】：在 Run Context 维护 Tool Call Graph 与 Token 预算计数器，单个任务超阈值强制熔断并触发安全回滚。`,
      keyFramingPoints: ['四级分类法', '区别处理语法/超时/语义', '熔断器与成本保护']
    },
    {
      question: '大模型是概率性的，你如何向业务方承诺 100% 确定性的业务 SLA？',
      originalSummary: '原答：向业务方解释大模型有幻觉，无法承诺 100%，只能尽量提升准确率。',
      recommendedAnswer: `我们采取“双轨交付模型”：
1. 【核心事务确定性由规则/状态机保证】：凡涉及资金、数据写回等核心边界，严格由 Deterministic State Machine + Human Review Gate 兜底，算法仅做推荐，不直接写库；
2. 【高阶分析由 Agent 提效】：在信息抽取与发散建议场景，承诺 95%+ 准确率，并提供“一键回退”与“可审计 Trace”；
通过将确定性逻辑与概率性逻辑剥离，让客户在享受 AI 提效的同时获得 100% 的业务安全感。`,
      keyFramingPoints: ['双轨交付模型', '状态机剥离概率风险', 'Human-in-the-Loop 商业承诺']
    }
  ],
  extractableDefenseQA: [
    {
      question: '如何设计一个抗抖动的 Agent 熔断与自愈机制？',
      coreDefenseLogic: '四级错误分流 + Schema 本地修复 + 图环检测 + 预算硬熔断',
      knowledgeTag: 'Agent-Reliability-Architecture'
    },
    {
      question: 'B 端客户对大模型准确率质疑时的商务与产品化解构？',
      coreDefenseLogic: '双轨架构：确定性逻辑交给状态机，发散提效交给 Agent，安全关键步走 Human Gate',
      knowledgeTag: 'Enterprise-AI-Product-Management'
    }
  ]
};

export const MOCK_INTERVIEW_OUTPUT: MockInterviewOutput = {
  targetRole: 'AI Agent 产品架构专家',
  targetCompany: '智元未来',
  readinessScore: 94,
  selfIntroduction: {
    duration: '2分30秒 (高密度架构型)',
    script: `您好，我是林思源。过去 7 年我专注于企业级 SaaS 与大模型应用架构产品化。

我最核心的竞争力，是用系统化的【Harness + State Machine + Tool Registry】工程思维，解决大模型在企业落地中的“不可控、难评测、高幻觉”三大死结。

在上一段经历中，我主导了千万级调用的多智能体协同引擎：
- 架构上：设计了基于 Graph DAG 的全局 Run Context 调度机制与 Human-in-the-Loop 写回门禁，任务完成率提升 42%；
- 工程上：构建了 4 级 Tool 异常自愈与熔断机制，杜绝了死循环 Token 浪费；
- 评测上：落地了 12 维 Trajectory 自动化 Eval 管道，把上线风险完全前置。

我关注智元未来在企业级 Agent 的领先布局，非常期待能将这套兼具工程严谨性与商业闭环的架构经验带入团队，谢谢！`,
    keyPitchPoints: [
      '用 Harness 三件套定义自己，差异化竞争',
      '量化战绩：42% 完成率提升 + 12 维 Eval',
      '强调工业级可控，打破“PPT 产品经理”刻板印象'
    ]
  },
  projectDeepDives: [
    {
      project: 'Agentic Workflows 智能调度引擎',
      starFramework: {
        situation: '企业客户引入单 Agent 对话后，因复杂长链业务容易“迷路、死循环、乱写库”，无法通过验收上线。',
        task: '从 0 到 1 构建工业级多 Agent 调度编排系统，保证任务收敛与数据安全。',
        action: '引入强约束 State Machine、统一 Shared Run Context 视图、Tool 调用沙箱及基于 Trajectory 的评测回路。',
        result: '任务完成率提升至 94.2%，支撑 200+ 业务流，零重大写库事故。'
      },
      likelyChallengingAngles: [
        '如果子 Agent 之间产生状态冲突，Harness 如何仲裁？',
        '为什么选择状态机而不是纯 ReAct 自主规划？如何平衡灵活性与确定性？'
      ]
    }
  ],
  attackAndDefenseQA: [
    {
      category: '架构选择与权衡',
      likelyTrapQuestion: '现在很多开源框架都支持 Dynamic ReAct Agent，你们为什么还要花精力做 State Machine 约束？这不是倒退回工作流吗？',
      underlyingIntent: '考察候选人是对新技术盲目跟风，还是真正理解企业级交付对确定性的要求。',
      bulletproofAnswer: `这是一个典型的“学术 Demo 自由度”与“企业级交付确定性”的权衡：
1. 纯 ReAct 适合开放式探索，但在严肃业务中，长链规划的复合失败率呈指数上升（90%^5 ≈ 59%）；
2. 我们的 Harness 是【状态机做骨架，Agent 做血肉】：在关键业务节点之间使用状态机保证流程单调收敛，在单节点内赋予 Agent 充分的 Tool Calling 自由度；
3. 这样既保留了大模型的泛化理解力，又获得了 100% 的合规与可审计性。`,
      riskBoundaryRule: '不要贬低开源技术，而是从数学概率与企业风险防范的客观视角解答。'
    },
    {
      category: '安全与数据保护',
      likelyTrapQuestion: 'Agent 具有 Tool 调用权限，如果模型产生幻觉误删客户数据怎么办？',
      underlyingIntent: '考察系统权限设计与 Human-in-the-Loop 的落地深度。',
      bulletproofAnswer: `我们在 Tool Registry 中严格实施“读写分离与门禁拦截”：
1. Read Tools 为只读幂等工具，Agent 可自主并发调用；
2. Writeback Tools 默认打上 isHumanGated 标签，Agent 只能生成 Writeback Plan（差异对比与写入建议），必须经过 Human Review Gate 人工在 UI 点击确认，才由 Curator Agent 执行物理写入；
3. 关键敏感操作具备事务回滚机制与审计日志，彻底隔离模型幻觉风险。`,
      riskBoundaryRule: '强调防御性设计，不夸大 AI 的完全自主性。'
    }
  ],
  closingQuestions: [
    {
      question: '贵团队目前在推进 Agent 落地时，最大的工程瓶颈是在底层推理延迟、Tool 可靠性，还是业务场景的价值闭环上？',
      intent: '探查团队真实痛点，展现自己作为资深 PM 能帮业务拆弹的姿态。',
      personaTarget: '业务负责人 / VP'
    },
    {
      question: '团队对于大模型上线后的 Trajectory Eval（轨迹评测）目前是如何构建基准数据集的？',
      intent: '切入自己擅长的评测领域，建立技术深度共鸣。',
      personaTarget: '技术架构师 / 算法专家'
    }
  ],
  followUpChain: [
    {
      step: 1,
      interviewerQuestion: '【追问 1】你刚才提到 Harness 的 Shared Run Context，如果 5 个 Agent 并发执行，这个 Context 怎么保证数据一致性？',
      recommendedAnswer: '我们采用“只读共享快照 + 局部私有工作区 + 总控 Orchestrator 集中 Merge”的机制，子 Agent 无权直接覆写全局 Context，所有状态变更通过 Action 提交总控裁决。',
      critique: '准确抓住了并发锁与数据隔离的核心，避免了脏读脏写争议。',
      userDraft: ''
    },
    {
      step: 2,
      interviewerQuestion: '【追问 2】如果其中某个 Agent 在中间步骤超时了 10 秒，整个 Workflow 是一直等待还是降级？',
      recommendedAnswer: '我们在每个节点配置了独立的 Deadline 与降级策略。超时触发后，先使用局部默认值填充并标记 partial_degraded，通知后续节点采用轻量分析策略，确保整体流程在 SLA 内返回。',
      critique: '体现了面向生产环境的高可用与降级容灾意识。',
      userDraft: ''
    },
    {
      step: 3,
      interviewerQuestion: '【追问 3】很精彩。那如果用户在这个时候通过前端中止了任务，你的持久化状态怎么处理？',
      recommendedAnswer: '状态机会即刻触发 cancel_requested 状态，Tool Registry 终止待发送的外部请求，Curator 将当前的局部 Trace 与中间变量序列化为 Checkpoint 存入 DB，支持用户稍后 Resume。',
      critique: '展现了完整的事务生命周期与状态持久化设计。',
      userDraft: ''
    }
  ]
};

export const MOCK_KNOWLEDGE_OUTPUT: KnowledgeIntakeOutput = {
  sourceTitle: 'Production Multi-Agent Harness: State Machines & Safe Tool Calling',
  sourceUrl: 'https://arxiv.org/abs/2608.agent-harness-architecture-prod',
  summary: '本文系统阐述了企业级多 Agent 架构从“自由对话”迈向“受控工作流”的演进路径，重点提出 Unified Run Context、Deterministic State Machine 与 Human Review Gate 三大支柱设计，为高可靠 AI 应用提供了生产级工业范式。',
  domainTags: ['Agent-Architecture', 'Harness-Design', 'Tool-Calling', 'Reliability', 'State-Machine'],
  coreConcepts: [
    {
      concept: 'Unified Run Context (统一运行上下文)',
      definition: '跨多个 Agent 共享的只读/受控上下文数据结构，包含输入、资产、外部检索、工具轨迹与写回计划。',
      productionImpact: '避免各 Agent 间信息割裂或重复加载，降低 30%+ 的上下文 Token 冗余。'
    },
    {
      concept: 'Deterministic State Machine (确定性状态机)',
      definition: '用有限状态自动机约束 Agent 的全局流转，保证复杂业务流程单调收敛，消除死循环。',
      productionImpact: '将企业长链任务成功率从 55% 提升至 92% 以上。'
    },
    {
      concept: 'Human Review Gate (人工确认门禁)',
      definition: '具有外部副作用的 Tool（如写库、转账、发送）必须暂存为 Writeback Plan，由人工审批后方可执行。',
      productionImpact: '彻底杜绝模型幻觉导致的生产数据损坏，是企业级合规的必要基石。'
    }
  ],
  interviewExpressions: [
    {
      scenario: '被问到“如何提升 Agent 可靠性与降低幻觉”时',
      goldenPhrase: '“我们不能寄希望于模型的‘自我约束’，而是要用【Harness 状态机做框架，Tool Registry 做边界，Human Gate 做兜底】。”',
      badVsGoodComparison: {
        ordinaryWay: '我们会写很长很详细的 Prompt，告诉它不要乱输出，并且多加几句提醒。',
        proWay: '我们在架构层实施【工程确定性对冲概率风险】：用状态机约束路径，用沙箱隔绝副作用，用 Human Review Gate 保证核心数据写回的 100% 安全。'
      }
    },
    {
      scenario: '被问到“多 Agent 之间如何通信与协作”时',
      goldenPhrase: '“我们摒弃了无序的 Agent 间点对点自由对话，采用【中心化 Shared Run Context + Orchestrator 集中分派】的星型架构。”',
      badVsGoodComparison: {
        ordinaryWay: '让 Agent A 把话发给 Agent B，Agent B 回复之后再发给 Agent C。',
        proWay: '由 Orchestrator 维护全局不可变的 Run Context，各 Specialized Agent 仅做无状态计算并将增量 Delta 提交总控合并，有效防止上下文膨胀与幻觉污染。'
      }
    }
  ],
  curatedKnowledgeCard: {
    title: 'AI 架构：多 Agent Harness 与状态机设计规范',
    vaultPath: 'sample-data/outputs/knowledge-intake/2026-08-31-harness-architecture-spec.md',
    markdownPreview: `---
title: 多 Agent Harness 与状态机设计规范
date: 2026-08-31
tags:
  - Agent-Architecture
  - Harness
  - Tool-Registry
  - Production-LLM
category: AI-Architecture-Core
author: 林思源 (Alex Lin)
---

# 多 Agent Harness 与状态机设计规范

## 1. 核心定义
传统自主 Agent 在生产环境面临**状态发散、Token 爆炸与副作用失控**。Harness 架构通过将大模型包裹在确定性工程外壳内，实现工业级交付。

## 2. 三大核心支柱
1. **Shared Run Context**: 全局统一只读快照 + 集中裁决增量合并。
2. **Deterministic State Machine**: 状态单调收敛，杜绝死循环。
3. **Human Review Gate**: 副作用工具只读产出 Writeback Plan，人工一键审查写回。

## 3. 面试核心金句
> “我们用工程确定性对冲大模型的概率风险，状态机管边界，Agent 管泛化，Human Gate 保底线。”
`
  }
};

export const INITIAL_WRITEBACK_ITEMS: WritebackPlanItem[] = [
  {
    id: 'wb_jd_1',
    targetFolder: 'sample-data/outputs/jd-opportunity/',
    targetFileName: '2026-08-31-智元未来-AI-Agent产品架构专家-机会评估.md',
    title: '智元未来 - AI Agent 产品架构专家 (S 级评估报告与招呼语)',
    category: 'opportunity',
    selected: true,
    status: 'pending',
    diffSummary: '+ 新增 1 份 S 级机会评估报告\n+ 新增定制化招呼语 (针对业务负责人)\n+ 沉淀 3 条核心架构匹配点',
    frontmatter: {
      company: '智元未来',
      role: 'AI Agent 产品架构专家',
      score: 92,
      tier: 'S 级核心攻坚',
      date: '2026-08-31',
      tags: ['Job-Opportunity', 'AI-Agent', 'Tier-S']
    },
    markdownContent: `# 机会评估报告：智元未来 - AI Agent 产品架构专家

## 基本信息
- **公司**：智元未来 (AIGC 独角兽企业)
- **综合机会评分**：92 / 100 (S 级核心攻坚)
- **推荐策略**：优先推进，通过业务负责人直聘渠道投递

## 维度量化
- 公司质量：94/100
- 岗位匹配度：96/100
- 机会价值增量：88/100
- Owner Scope 发挥空间：90/100
- 业务可持续性：85/100

## 推荐招呼语
> 您好！关注到贵司正在布局企业级多 Agent 调度编排系统 (Harness)，这与我近 3 年在 Agentic Workflow 领域的产品架构实践高度重合...`
  },
  {
    id: 'wb_recap_1',
    targetFolder: 'sample-data/outputs/interview-recap/',
    targetFileName: '2026-08-31-星云流光-二面-面试复盘与攻防矩阵.md',
    title: '星云流光 - 二面技术复盘 (失分改进与 Tool 自愈问答)',
    category: 'recap',
    selected: true,
    status: 'pending',
    diffSummary: '+ 新增 2 道失分金牌改写标准答案 (Tool 异常自愈 + SLA 双轨交付)\n+ 提取 2 组攻防 Q&A 资产',
    frontmatter: {
      company: '星云流光',
      round: '二面 (AI 架构与评测)',
      score: 78,
      date: '2026-08-31',
      tags: ['Interview-Recap', 'Agent-Reliability']
    },
    markdownContent: `# 面试复盘：星云流光 (二面技术深挖)

## 过程概述
- **面试官风格**：严密逻辑型技术 VP
- **总体评分**：78 / 100
- **主要失分点**：Tool 异常重试策略回答过于粗颗粒度，缺乏四级防御分类。

## 攻防知识沉淀
### Q: Tool Calling 失败如何自愈并防止死循环？
- 四级防御机制：语法层 Schema Repair、网络层指数退避、语义层 Reflection 纠偏、系统层熔断器。`
  },
  {
    id: 'wb_mock_1',
    targetFolder: 'sample-data/outputs/mock-interview/',
    targetFileName: '2026-08-31-智元未来-终面Mock题库与追问链.md',
    title: '智元未来 - 终面 Mock 话术与 STAR 架构深挖',
    category: 'mock_qa',
    selected: true,
    status: 'pending',
    diffSummary: '+ 新增 2 分半钟高密度架构型自我介绍\n+ 沉淀 1 套 STAR 项目深挖矩阵\n+ 录入 3 级并发一致性追问链',
    frontmatter: {
      target_company: '智元未来',
      target_role: 'AI Agent 产品架构专家',
      readiness_score: 94,
      date: '2026-08-31',
      tags: ['Mock-Interview', 'STAR-Framework']
    },
    markdownContent: `# Mock 面试题库：智元未来 (终面冲刺)

## 自我介绍脚本
> 您好，我是林思源。过去 7 年我专注于企业级 SaaS 与大模型应用架构产品化。我最核心的竞争力，是用系统化的【Harness + State Machine + Tool Registry】工程思维解决不可控问题...`
  },
  {
    id: 'wb_knowledge_1',
    targetFolder: 'sample-data/outputs/knowledge-intake/',
    targetFileName: '2026-08-31-Harness状态机与安全Tool调用规范.md',
    title: 'AI 知识点：多 Agent Harness 与状态机设计规范',
    category: 'knowledge',
    selected: true,
    status: 'pending',
    diffSummary: '+ 新增 3 个生产级架构核心概念 (Run Context, State Machine, Human Gate)\n+ 新增 2 组面试金句对比',
    frontmatter: {
      title: '多 Agent Harness 与状态机设计规范',
      date: '2026-08-31',
      category: 'AI-Architecture',
      tags: ['Harness', 'State-Machine', 'Tool-Registry']
    },
    markdownContent: `# 知识沉淀：多 Agent Harness 架构规范

## 核心金句
> “我们用工程确定性对冲大模型的概率风险，状态机管边界，Agent 管泛化，Human Gate 保底线。”`
  }
];

export function getMockRunContext(workflowType: WorkflowId): SharedRunContext {
  const defaultCases = WORKFLOWS_CONFIG.find(w => w.id === workflowType)?.sampleCases[0];
  return {
    runId: `run_${Date.now().toString(36).slice(-6)}_${workflowType}`,
    workflowType,
    currentState: 'created',
    userInput: {
      title: defaultCases?.title || '任务输入',
      sourceType: workflowType === 'jd_evaluation' ? 'screenshot_ocr' : workflowType === 'interview_recap' ? 'pdf_text' : workflowType === 'knowledge_intake' ? 'article_url' : 'interactive_prompt',
      rawContent: defaultCases?.rawInput || '',
      metadata: { presetId: defaultCases?.id }
    },
    activeOpportunity: {
      company: workflowType === 'interview_recap' ? '星云流光' : '智元未来 (AIGC 独角兽企业)',
      position: 'AI Agent 产品架构专家',
      department: '智能体平台事业部',
      salaryRange: '45k-65k · 16 薪 + 期权',
      location: '北京 / 深圳'
    },
    candidateProfile: DESENSITIZED_CANDIDATE,
    retrievedAssets: [
      '林思源_资深AI产品专家_标准简历_2026.json',
      'Agentic_Workflows_调度引擎_架构复盘.md',
      '职业定位与薪资底线规则_v3.json',
      'AI_核心概念与评测体系知识库.md'
    ],
    toolTrace: [],
    intermediateOutputs: {},
    humanReviewStatus: 'idle',
    writebackPlan: INITIAL_WRITEBACK_ITEMS.filter(item => {
      if (workflowType === 'jd_evaluation') return item.category === 'opportunity';
      if (workflowType === 'interview_recap') return item.category === 'recap';
      if (workflowType === 'mock_interview') return item.category === 'mock_qa';
      return item.category === 'knowledge';
    })
  };
}

export function generateSimulationTrace(workflow: WorkflowId): ToolTraceItem[] {
  const now = Date.now();
  const time = (offsetSec: number) => new Date(now + offsetSec * 1000).toLocaleTimeString();

  if (workflow === 'jd_evaluation') {
    return [
      {
        id: 'trace_1',
        timestamp: time(0),
        toolName: 'parse_jd_multimodal_ocr',
        category: 'document',
        callerAgent: 'jd_opportunity_agent',
        durationMs: 420,
        tokensUsed: 620,
        status: 'success',
        inputPayload: { image_buffer_uri: '/tmp/uploads/jd_screenshot_0831.png' },
        outputPayload: {
          company: '智元未来',
          position: 'AI Agent 产品架构专家',
          salary: '45k-65k * 16薪',
          coreRequirements: ['Harness 架构', 'Tool Calling', 'Eval 评测', '状态机']
        }
      },
      {
        id: 'trace_2',
        timestamp: time(1),
        toolName: 'read_candidate_resume',
        category: 'asset_read',
        callerAgent: 'orchestrator_agent',
        durationMs: 180,
        tokensUsed: 450,
        status: 'success',
        inputPayload: { candidate_id: 'alex_lin', section_filter: ['projects', 'skills'] },
        outputPayload: { loadedSections: 2, totalTokens: 1850, matchStatus: 'OK' }
      },
      {
        id: 'trace_3',
        timestamp: time(2),
        toolName: 'read_project_deep_assets',
        category: 'asset_read',
        callerAgent: 'jd_opportunity_agent',
        durationMs: 230,
        tokensUsed: 890,
        status: 'success',
        inputPayload: { project_tags: ['agent', 'harness', 'workflow'] },
        outputPayload: { matchedAssets: ['Agentic Workflows 智能调度引擎', 'LLM 工业级评测平台'] }
      },
      {
        id: 'trace_4',
        timestamp: time(3),
        toolName: 'search_company_intelligence',
        category: 'external',
        callerAgent: 'jd_opportunity_agent',
        durationMs: 650,
        tokensUsed: 780,
        status: 'success',
        inputPayload: { company_name: '智元未来', search_focus: 'product' },
        outputPayload: { stage: 'B+ 轮', focus: '企业级 Agent 引擎与垂直行业方案', reputationScore: 9.4 }
      },
      {
        id: 'trace_5',
        timestamp: time(4),
        toolName: 'writeback_opportunity_card',
        category: 'writeback',
        callerAgent: 'memory_curator_agent',
        durationMs: 150,
        tokensUsed: 310,
        status: 'gated',
        inputPayload: { target_file: 'sample-data/outputs/jd-opportunity/2026-08-31-智元未来-AI-Agent产品架构专家-机会评估.md' },
        outputPayload: { gateStatus: 'HELD_FOR_HUMAN_REVIEW', requiredAction: 'Approve in UI Gate' }
      }
    ];
  } else if (workflow === 'interview_recap') {
    return [
      {
        id: 'trace_1',
        timestamp: time(0),
        toolName: 'parse_interview_recap_document',
        category: 'document',
        callerAgent: 'interview_recap_agent',
        durationMs: 510,
        tokensUsed: 1240,
        status: 'success',
        inputPayload: { doc_content: '星云流光_二面_75min_录音转写.pdf' },
        outputPayload: { extractedQAPairs: 4, detectedInterviewerEmotion: '严厉/高逻辑/偏技术' }
      },
      {
        id: 'trace_2',
        timestamp: time(1),
        toolName: 'read_historical_interview_recaps',
        category: 'asset_read',
        callerAgent: 'interview_recap_agent',
        durationMs: 220,
        tokensUsed: 430,
        status: 'success',
        inputPayload: { industry: 'AI 基础设施 / Agent 工具链', limit: 3 },
        outputPayload: { recalledRecaps: 3, highFrequencyTrapTopic: 'Tool 重试死循环与熔断' }
      },
      {
        id: 'trace_3',
        timestamp: time(2),
        toolName: 'writeback_interview_recap_matrix',
        category: 'writeback',
        callerAgent: 'memory_curator_agent',
        durationMs: 190,
        tokensUsed: 340,
        status: 'gated',
        inputPayload: { company_round: '星云流光 二面' },
        outputPayload: { gateStatus: 'HELD_FOR_HUMAN_REVIEW', targetPath: 'sample-data/outputs/interview-recap/' }
      }
    ];
  } else if (workflow === 'mock_interview') {
    return [
      {
        id: 'trace_1',
        timestamp: time(0),
        toolName: 'read_positioning_and_risk_rules',
        category: 'asset_read',
        callerAgent: 'mock_interview_agent',
        durationMs: 140,
        tokensUsed: 390,
        status: 'success',
        inputPayload: { rule_category: 'boundary' },
        outputPayload: { boundaryRulesCount: 3, keyRule: '强调确定性状态机与回滚，不吹嘘无边界自主' }
      },
      {
        id: 'trace_2',
        timestamp: time(1),
        toolName: 'read_ai_knowledge_base',
        category: 'asset_read',
        callerAgent: 'mock_interview_agent',
        durationMs: 260,
        tokensUsed: 520,
        status: 'success',
        inputPayload: { query: 'agent_harness_architecture' },
        outputPayload: { matchedTags: ['Harness', 'Trajectory-Eval', 'Run-Context'] }
      },
      {
        id: 'trace_3',
        timestamp: time(2),
        toolName: 'writeback_mock_qa_repository',
        category: 'writeback',
        callerAgent: 'memory_curator_agent',
        durationMs: 180,
        tokensUsed: 290,
        status: 'gated',
        inputPayload: { target_vault: 'sample-data/outputs/mock-interview/' },
        outputPayload: { gateStatus: 'HELD_FOR_HUMAN_REVIEW' }
      }
    ];
  } else {
    return [
      {
        id: 'trace_1',
        timestamp: time(0),
        toolName: 'extract_web_article_markdown',
        category: 'document',
        callerAgent: 'knowledge_intake_agent',
        durationMs: 480,
        tokensUsed: 980,
        status: 'success',
        inputPayload: { target_url: 'https://arxiv.org/abs/2608.agent-harness-architecture-prod' },
        outputPayload: { articleLengthChars: 14500, mainSections: ['Context Buffer', 'State Machines', 'Safety Gates'] }
      },
      {
        id: 'trace_2',
        timestamp: time(1),
        toolName: 'writeback_ai_knowledge_card',
        category: 'writeback',
        callerAgent: 'memory_curator_agent',
        durationMs: 130,
        tokensUsed: 240,
        status: 'gated',
        inputPayload: { concept_title: '多 Agent Harness 与状态机设计规范' },
        outputPayload: { gateStatus: 'HELD_FOR_HUMAN_REVIEW' }
      }
    ];
  }
}

export const INTER_AGENT_MESSAGES_MAP: Record<WorkflowId, AgentMessage[]> = {
  jd_evaluation: [
    {
      id: 'msg_jd_1',
      timestamp: '09:41:02.110',
      sender: 'orchestrator_agent',
      receiver: 'jd_opportunity_agent',
      type: 'DISPATCH_TASK',
      payloadSummary: '分派 JD 评估任务：注入候选人林思源定位规则与 OCR 岗位文本',
      fullPayload: {
        task: 'EVALUATE_JD_MATCH',
        candidateId: 'alex_lin_001',
        candidatePositioning: '7年资深 AI 产品专家 / Agent Harness 架构',
        targetCompany: '星云流光',
        targetTitle: '资深 Agent 平台产品专家'
      },
      status: 'completed'
    },
    {
      id: 'msg_jd_2',
      timestamp: '09:41:02.430',
      sender: 'jd_opportunity_agent',
      receiver: 'orchestrator_agent',
      type: 'CONTEXT_INJECTION',
      payloadSummary: '请求并行并发调用 Tool Registry：获取智联同类岗位基准薪资与技术壁垒',
      fullPayload: {
        toolsRequested: ['read_candidate_resume', 'read_positioning_and_risk_rules', 'fetch_external_company_signals'],
        concurrencyLimit: 4,
        timeoutMs: 3000
      },
      status: 'completed'
    },
    {
      id: 'msg_jd_3',
      timestamp: '09:41:03.020',
      sender: 'jd_opportunity_agent',
      receiver: 'memory_curator_agent',
      type: 'WRITEBACK_PROPOSAL',
      payloadSummary: '提交结构化评估推断：91 分 (S级攻坚) + 差异化招呼语草案与防守点',
      fullPayload: {
        overallScore: 91,
        tierRecommendation: 'S 级核心攻坚',
        targetFile: 'sample-data/outputs/jd-opportunity/2026-08-31-星云流光-资深Agent平台产品专家-评估与招呼语.md',
        frontmatterTags: ['opportunity', 'S-Tier', 'Agentic-Workflow', 'High-Match']
      },
      status: 'completed'
    },
    {
      id: 'msg_jd_4',
      timestamp: '09:41:03.540',
      sender: 'memory_curator_agent',
      receiver: 'orchestrator_agent',
      type: 'GATE_CONFIRMATION',
      payloadSummary: '安全门禁拦截已就绪：等待人类专家在 Human Review Gate 授权写回',
      fullPayload: {
        gatePolicy: 'WRITEBACK_REQUIRE_HUMAN_APPROVAL',
        stagedDiffCount: 1,
        sandboxPath: 'sample-data/outputs/jd-opportunity/'
      },
      status: 'processing'
    }
  ],
  interview_recap: [
    {
      id: 'msg_recap_1',
      timestamp: '14:20:01.050',
      sender: 'orchestrator_agent',
      receiver: 'interview_recap_agent',
      type: 'DISPATCH_TASK',
      payloadSummary: '分派面试复盘任务：解析 75min PDF 录音转写稿并提取攻防点',
      fullPayload: {
        docName: '星云流光_二面_75min_录音转写.pdf',
        targetRound: '业务负责人 / 架构师加试',
        focusDimensions: ['Tool 重试与熔断', '大模型评测与幻觉控制', '商业化 ROI']
      },
      status: 'completed'
    },
    {
      id: 'msg_recap_2',
      timestamp: '14:20:01.580',
      sender: 'interview_recap_agent',
      receiver: 'orchestrator_agent',
      type: 'TOOL_RESULT',
      payloadSummary: '工具抽取完毕：提取 4 组关键 Q&A，定位失分点 1 项 (Tool 重试死循环兜底)',
      fullPayload: {
        totalQuestionsParsed: 4,
        weakPointIdentified: '当外部 API 持续 429 报错时，重试机制缺乏最大深度限制',
        remedySuggested: '引入指数退避 + 本地规则降级 + Reflection 审查'
      },
      status: 'completed'
    },
    {
      id: 'msg_recap_3',
      timestamp: '14:20:02.120',
      sender: 'interview_recap_agent',
      receiver: 'memory_curator_agent',
      type: 'WRITEBACK_PROPOSAL',
      payloadSummary: '生成标准回答升级建议与攻防 Q&A 卡片，请求写回面试复盘库',
      fullPayload: {
        vaultCategory: 'interview-recap',
        targetFile: 'sample-data/outputs/interview-recap/2026-08-31-星云流光-二面复盘与攻防点升级.md'
      },
      status: 'completed'
    },
    {
      id: 'msg_recap_4',
      timestamp: '14:20:02.600',
      sender: 'memory_curator_agent',
      receiver: 'orchestrator_agent',
      type: 'GATE_CONFIRMATION',
      payloadSummary: 'Human Review Gate 门禁已阻断物理写入，等待人工审核 Markdown Diff',
      fullPayload: {
        gateStatus: 'HELD_FOR_HUMAN_REVIEW'
      },
      status: 'processing'
    }
  ],
  mock_interview: [
    {
      id: 'msg_mock_1',
      timestamp: '16:05:00.800',
      sender: 'orchestrator_agent',
      receiver: 'mock_interview_agent',
      type: 'DISPATCH_TASK',
      payloadSummary: '分派模拟面试任务：构建目标岗位 3 阶压力追问链与防守策略',
      fullPayload: {
        targetCompany: '幻方光子 (MatrixPhoton)',
        targetRole: '资深大模型产品专家',
        interviewType: '技术与系统架构深挖'
      },
      status: 'completed'
    },
    {
      id: 'msg_mock_2',
      timestamp: '16:05:01.320',
      sender: 'mock_interview_agent',
      receiver: 'orchestrator_agent',
      type: 'CONTEXT_INJECTION',
      payloadSummary: '结合候选人 7 年经验边界：生成 STAR 深挖、防守矩阵及动态追问阶梯',
      fullPayload: {
        followUpStepsGenerated: 3,
        trapQuestionsCount: 4,
        keyBoundaryEnforced: '不吹嘘无边界自主，强调工业级确定性 Harness'
      },
      status: 'completed'
    },
    {
      id: 'msg_mock_3',
      timestamp: '16:05:01.900',
      sender: 'mock_interview_agent',
      receiver: 'memory_curator_agent',
      type: 'WRITEBACK_PROPOSAL',
      payloadSummary: '打包高频攻防题库与话术卡片，申请写入模拟面试库',
      fullPayload: {
        vaultCategory: 'mock-interview',
        targetFile: 'sample-data/outputs/mock-interview/2026-08-31-幻方光子-资深大模型产品专家-模拟追问与防守卡.md'
      },
      status: 'completed'
    },
    {
      id: 'msg_mock_4',
      timestamp: '16:05:02.400',
      sender: 'memory_curator_agent',
      receiver: 'orchestrator_agent',
      type: 'GATE_CONFIRMATION',
      payloadSummary: '知识库门禁拦截已就绪，等待人工确认',
      fullPayload: {
        status: 'AWAITING_HUMAN_APPROVAL'
      },
      status: 'processing'
    }
  ],
  knowledge_intake: [
    {
      id: 'msg_know_1',
      timestamp: '20:15:00.300',
      sender: 'orchestrator_agent',
      receiver: 'knowledge_intake_agent',
      type: 'DISPATCH_TASK',
      payloadSummary: '分派前沿文献提取任务：抓取 2026 Agent Harness 架构前沿长文',
      fullPayload: {
        sourceUrl: 'https://arxiv.org/abs/2608.agent-harness-architecture-prod',
        targetVault: 'sample-data/outputs/knowledge-base/'
      },
      status: 'completed'
    },
    {
      id: 'msg_know_2',
      timestamp: '20:15:00.820',
      sender: 'knowledge_intake_agent',
      receiver: 'orchestrator_agent',
      type: 'TOOL_RESULT',
      payloadSummary: '网页抽取完成：提炼 3 组工业级概念与普通回答 vs 资深架构师表达对比',
      fullPayload: {
        extractedConceptsCount: 3,
        interviewGoldenPhrasesCount: 2
      },
      status: 'completed'
    },
    {
      id: 'msg_know_3',
      timestamp: '20:15:01.350',
      sender: 'knowledge_intake_agent',
      receiver: 'memory_curator_agent',
      type: 'WRITEBACK_PROPOSAL',
      payloadSummary: '生成 YAML Frontmatter 与 Obsidian 知识库卡片草案',
      fullPayload: {
        vaultCategory: 'knowledge',
        targetFile: 'sample-data/outputs/knowledge-base/2026-08-31-Agent-Harness架构设计规范-知识卡.md'
      },
      status: 'completed'
    },
    {
      id: 'msg_know_4',
      timestamp: '20:15:01.800',
      sender: 'memory_curator_agent',
      receiver: 'orchestrator_agent',
      type: 'GATE_CONFIRMATION',
      payloadSummary: '门禁锁定：等待人工审核写入',
      fullPayload: {
        gateStatus: 'HELD_FOR_HUMAN_REVIEW'
      },
      status: 'processing'
    }
  ]
};

export const getInterAgentMessages = (workflow: WorkflowId, currentState: HarnessState): AgentMessage[] => {
  const allMessages = INTER_AGENT_MESSAGES_MAP[workflow] || [];
  const stateIdx = STATE_FLOW_ORDER.indexOf(currentState);
  
  if (stateIdx <= 1) { // created, input_received
    return allMessages.slice(0, 1);
  } else if (stateIdx <= 3) { // parsed, context_loaded
    return allMessages.slice(0, 2);
  } else if (stateIdx <= 5) { // tools_called, analysis_generated
    return allMessages.slice(0, 3);
  } else { // human_review_required, approved, written_back, completed
    return allMessages;
  }
};

export const STATE_FLOW_ORDER: HarnessState[] = [
  'created',
  'input_received',
  'parsed',
  'context_loaded',
  'tools_called',
  'analysis_generated',
  'human_review_required',
  'approved',
  'written_back',
  'completed'
];

export const STATE_LABELS: Record<HarnessState, { label: string; desc: string; icon: string }> = {
  created: { label: 'Created', desc: '初始化 Run Context', icon: '🌱' },
  input_received: { label: 'Input Received', desc: '接收用户输入与脱敏数据', icon: '📥' },
  parsed: { label: 'Parsed', desc: 'OCR/PDF 文档结构化提取', icon: '🔍' },
  context_loaded: { label: 'Context Loaded', desc: '注入候选人资产与定位规则', icon: '🧬' },
  tools_called: { label: 'Tools Called', desc: '并发检索与外部研报调用', icon: '⚙️' },
  analysis_generated: { label: 'Analysis Generated', desc: '专业 Agent 生成结构化推断', icon: '✨' },
  human_review_required: { label: 'Human Review Gate', desc: '暂停等待人工审查与差异确认', icon: '🛡️' },
  approved: { label: 'Approved', desc: '人工已确认写回授权', icon: '✅' },
  written_back: { label: 'Written Back', desc: '写入 Obsidian 知识库目录', icon: '💾' },
  completed: { label: 'Completed', desc: '工作流全链路闭环完成', icon: '🎉' },
  tool_failed: { label: 'Tool Failed', desc: '工具调用异常/超时', icon: '⚠️' },
  needs_user_clarification: { label: 'Needs Clarification', desc: '缺少必要输入参数', icon: '❓' },
  writeback_rejected: { label: 'Writeback Rejected', desc: '人工拒绝本次知识写回', icon: '🚫' }
};

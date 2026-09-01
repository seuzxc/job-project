import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Sparkles, 
  FileCode, 
  Tag, 
  Check, 
  AlertCircle,
  FileCheck2,
  FileSpreadsheet,
  Layers,
  Wand2
} from 'lucide-react';
import { AssetCategory, CandidateAssetFile } from '../../types/harness';
import { ASSET_CATEGORIES_META } from '../../data/mockData';

interface AssetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (newAsset: CandidateAssetFile) => void;
  initialCategory?: AssetCategory;
}

const TEMPLATES: Record<AssetCategory, { title: string; filename: string; content: string; tags: string[] }> = {
  self_intro: {
    title: '1分钟高密度电梯演讲模版',
    filename: 'AlexLin_定制版电梯演讲.md',
    tags: ['电梯演讲', '自述模版', '核心亮点'],
    content: `# 1分钟求职自述模版 (针对业务与架构)

## 📌 开场与定位 (15秒)
> “您好，我是 [姓名]。拥有 [N] 年大模型与企业级系统落地经验，主导过多智能体协同架构与生产级评测平台。”

## 💡 核心差异化优势 (30秒)
1. **工业级 Agent 落地能力**：擅长用状态机与 Tool Calling 架构约束大模型非确定性，大幅提升任务完成率与容错率。
2. **安全与评测闭环**：构建自动化 Eval 管道与人机协同对齐机制，压降核心场景幻觉率。

## 🎯 求职意向与价值匹配 (15秒)
“期望在贵司大模型应用层承担核心架构与业务落地职责，打造高可用、高 ROI 的智能体中枢。”`
  },
  positioning: {
    title: '职业定位与差异化画像模版',
    filename: 'AlexLin_能力雷达与差异化定位.md',
    tags: ['Persona', '能力雷达', '目标定位'],
    content: `# 职业定位与能力画像 (Persona)

## 🎯 目标职级与定位
- **目标岗位**：资深 AI 产品专家 / 大模型应用架构师
- **核心职能**：主导大模型核心工作流设计、Tool Registry 治理与多 Agent 拓扑编排。
- **差异化竞争壁垒**：具备传统企业级复杂系统架构底层逻辑，深谙大模型落地的工程约束与生产边界。`
  },
  risk_boundary: {
    title: '面试攻防红线与谈判底线清单',
    filename: '面试攻防红线与底线规则.md',
    tags: ['红线边界', '商业保密', '薪酬底线'],
    content: `# 面试攻防红线与不可妥协边界 (Risk Boundaries)

## 🚫 核心底线 (Non-negotiable)
1. **商业保密**：严禁在面试中披露原业务未公开的 Prompt、模型参数及私有数据集细节。
2. **拒绝伪需求**：拒绝无实际系统掌控权、纯做传话筒的套壳外包型职位。
3. **真实可控**：客观呈现大模型能力的局限性，坚持“确定性状态机 + 概率大模型”的务实方案。`
  },
  projects: {
    title: 'STAR 深度项目复盘标准模版',
    filename: 'STAR项目复盘_深度架构案例.md',
    tags: ['STAR案例', '项目架构', '量化成果'],
    content: `# STAR 深度复盘：[项目名称]

## 1. Situation (业务背景与技术痛点)
- 描述项目启动前的业务瓶颈、系统脆弱点或模型失控痛点。

## 2. Task (明确目标与架构职责)
- 设定定量指标（如任务完成率、延迟降低比例、幻觉率压降指标）。

## 3. Action (核心架构动作与技术突破)
1. **拓扑与编排**：设计星型路由、状态机 DAG 与共享上下文。
2. **容错机制**：设计工具调用 Schema 校验与熔断降级策略。
3. **人机门禁**：设立关键写操作的 Human Review 审核流。

## 4. Result (业务收益与量化战果)
- 任务完成率提升 X%，系统故障率降低 Y%，支撑千万级业务流水。`
  },
  ai_knowledge: {
    title: 'AI 架构与 Agent 规范白皮书模版',
    filename: 'Multi_Agent通信与状态机设计指南.md',
    tags: ['AI知识库', 'Agent规范', '状态机'],
    content: `# 大模型 Agent 架构设计指南与工程规范

## 一、核心设计原则
1. **控制与执行解耦**：控制平面负责状态机流转与门禁，执行平面专注 Tool Calling。
2. **上下文隔离**：采用只读快照机制，杜绝 Agent 间的直接写冲突。
3. **可观测与回滚**：全链路记录 Token 消耗、Tool Trace 轨迹与决策 Diff。`
  },
  jd_eval: {
    title: '目标岗位与机会深度评估报告模版',
    filename: '目标岗位_JD深度评估与推进策略.md',
    tags: ['机会评估', 'JD剖析', 'ROI评级', '职级对齐'],
    content: `# 目标岗位深度评估报告 (Opportunity Evaluation)

## 📊 综合评级：[S/A/B/C] 级 ([得分]/100)
- **目标公司 / 业务线**：[公司名称] - [业务线/部门]
- **岗位名称 / 职级对齐**：[岗位 Title] · [对标职级]
- **薪酬范围预期**：[Base + 年终 + 股权激励]

## 🎯 四维评估拆解
1. **公司与赛道红利**：业务增长潜力、大模型投入决心与商业化变现路径。
2. **画像与技能匹配**：核心职责与候选人经历重合度，主打优势与差异化壁垒。
3. **成长与杠杆空间**：是否有独立主导权、组织汇报层级与晋升通道。
4. **风险与防守注意**：是否有伪需求风险、组织架构调整隐患或交付不可控因素。`
  },
  mock_qa: {
    title: '大模型与架构高频 Mock 攻防题库模版',
    filename: '大模型架构与高频追问_Mock演练.md',
    tags: ['Mock面试', '架构攻防', '高频追问', 'STAR应答'],
    content: `# Mock 面试攻防题库与标杆应答集

## Q1: [核心技术/架构痛点问题]
### 💡 标杆应答结构 (STAR + 架构决策)
1. **痛点与背景**：明确业界普遍面临的瓶颈。
2. **架构选型与解法**：阐述状态机、Tool Calling 或 RAG 优化核心动作。
3. **量化产出**：指标提升、容错率与成本收益。

## Q2: [行为面试 / 跨部门协作难题]
### 💡 核心防守要点
- 阐述利益相关方对齐、阶段性交付与数据说话的推进策略。`
  },
  interview_recap: {
    title: '全真面试深度实战复盘模版',
    filename: '某大厂_技术二面_全真深度复盘.md',
    tags: ['面试复盘', '实战记录', '挂点归因', '改进计划'],
    content: `# 面试实战深度复盘手记 (Interview Recap)

## ⏱️ 基本信息
- **公司与轮次**：[公司名称] - [初筛/技术一面/架构二面/HR终面]
- **面试官角色**：[技术总监/架构师/业务负责人/HRBP]
- **自评得分与结果**：[得分]/100 · [通过/待定/挂]

## 🎯 关键追问与现场应对
1. **追问 1**：[问题描述] -> [现场作答逻辑] -> [面试官反馈与表情分析]
2. **追问 2**：[问题描述] -> [现场作答逻辑] -> [不足之处]

## 💡 改进计划与知识回流
- **话术修正**：针对回答薄弱点的迭代方案。
- **资产反哺**：需要同步补充进个人知识库或 STAR 案例的要点。`
  }
};

export const AssetUploadModal: React.FC<AssetUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  initialCategory = 'self_intro'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>(initialCategory);
  const [fileType, setFileType] = useState<'md' | 'pdf'>('md');
  const [fileName, setFileName] = useState('');
  const [summary, setSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [content, setContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileSizeText, setFileSizeText] = useState('5.6 KB');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleApplyTemplate = (category: AssetCategory) => {
    const t = TEMPLATES[category];
    setSelectedCategory(category);
    setFileName(t.filename);
    setFileType('md');
    setSummary(`基于 ${ASSET_CATEGORIES_META[category].label} 的标准化结构化文档。`);
    setTagsInput(t.tags.join(', '));
    setContent(t.content);
    setFileSizeText(`${(t.content.length / 1024).toFixed(1)} KB`);
  };

  const handleFileProcess = (file: File) => {
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const isMd = file.name.toLowerCase().endsWith('.md') || file.name.toLowerCase().endsWith('.markdown') || file.name.toLowerCase().endsWith('.txt');

    if (!isPdf && !isMd) {
      alert('请上传 .pdf 或 .md / .txt 格式的资产文件');
      return;
    }

    const type = isPdf ? 'pdf' : 'md';
    setFileType(type);
    setFileName(file.name);
    setFileSizeText(`${(file.size / 1024).toFixed(1)} KB`);

    // Smart auto category detection based on file name
    const lowerName = file.name.toLowerCase();
    let detectedCat: AssetCategory = selectedCategory;
    if (lowerName.includes('自述') || lowerName.includes('介绍') || lowerName.includes('intro') || lowerName.includes('pitch')) {
      detectedCat = 'self_intro';
    } else if (lowerName.includes('定位') || lowerName.includes('画像') || lowerName.includes('persona') || lowerName.includes('position')) {
      detectedCat = 'positioning';
    } else if (lowerName.includes('边界') || lowerName.includes('风险') || lowerName.includes('红线') || lowerName.includes('risk') || lowerName.includes('boundary')) {
      detectedCat = 'risk_boundary';
    } else if (lowerName.includes('star') || lowerName.includes('项目') || lowerName.includes('project') || lowerName.includes('案例')) {
      detectedCat = 'projects';
    } else if (lowerName.includes('knowledge') || lowerName.includes('知识库') || lowerName.includes('白皮书') || lowerName.includes('架构') || lowerName.includes('spec')) {
      detectedCat = 'ai_knowledge';
    } else if (lowerName.includes('jd') || lowerName.includes('评估') || lowerName.includes('机会') || lowerName.includes('eval') || lowerName.includes('opportunity')) {
      detectedCat = 'jd_eval';
    } else if (lowerName.includes('mock') || lowerName.includes('题库') || lowerName.includes('问答') || lowerName.includes('演练') || lowerName.includes('qa')) {
      detectedCat = 'mock_qa';
    } else if (lowerName.includes('复盘') || lowerName.includes('recap') || lowerName.includes('面经') || lowerName.includes('面后') || lowerName.includes('挂点')) {
      detectedCat = 'interview_recap';
    }
    setSelectedCategory(detectedCat);

    if (isMd) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string || '';
        setContent(text);
        // Generate summary from first 100 chars
        const cleanPreview = text.replace(/[#*`>\-_]/g, '').trim();
        setSummary(cleanPreview.slice(0, 120) + '...');
        setTagsInput(`${ASSET_CATEGORIES_META[detectedCat].label}, ${type.toUpperCase()}, 自定义上传`);
      };
      reader.readAsText(file);
    } else {
      // PDF preview simulation extracted text
      const simulatedText = `# 📄 提取自 PDF: ${file.name}

## 文档元数据
- **文件类型**: Adobe PDF Document (Parsed)
- **文件体积**: ${(file.size / 1024).toFixed(1)} KB
- **提取状态**: 结构化语义解析完成 · 向量索引已就绪

## 核心提取摘要
从该 PDF 中成功抽取了针对 ${ASSET_CATEGORIES_META[detectedCat].label} 的核心结构化要点，包含架构拓扑、关键指标数据与话术防守要点。已自动挂载至 Agent 记忆池。`;
      setContent(simulatedText);
      setSummary(`从 PDF 提取的 ${ASSET_CATEGORIES_META[detectedCat].label} 核心资产与结构化要点。`);
      setTagsInput(`${ASSET_CATEGORIES_META[detectedCat].label}, PDF文档, 向量已索引`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) {
      alert('请输入文件名称');
      return;
    }
    if (!content.trim()) {
      alert('请上传文件或输入文档内容');
      return;
    }

    const tags = tagsInput
      .split(/[,，]/)
      .map(t => t.trim())
      .filter(Boolean);

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newAsset: CandidateAssetFile = {
      id: `asset-user-${Date.now()}`,
      name: fileName.trim(),
      category: selectedCategory,
      fileType,
      sizeFormatted: fileSizeText,
      updatedAt: dateStr,
      summary: summary.trim() || `${ASSET_CATEGORIES_META[selectedCategory].label} 核心结构化资产文档。`,
      content: content.trim(),
      tags: tags.length > 0 ? tags : [ASSET_CATEGORIES_META[selectedCategory].label, fileType.toUpperCase()],
      activeInRun: true
    };

    setUploadSuccess(true);
    setTimeout(() => {
      onUpload(newAsset);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl shadow-black/60 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-2xl text-white shadow-lg shadow-indigo-500/25">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                上传/新增全局资产文件
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  支持 PDF / Markdown (.md)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                文件将自动归类并挂载至各专职 Agent 的 Run Context、知识库与向量检索池中
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Quick Template Fillers */}
          <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                快速加载官方规范模版 (Quick Templates):
              </span>
              <span className="text-[10px] text-slate-400">点击一键载入标准格式</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ASSET_CATEGORIES_META) as AssetCategory[]).map(catKey => {
                const meta = ASSET_CATEGORIES_META[catKey];
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => handleApplyTemplate(catKey)}
                    className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-slate-300 text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{meta.label}模版</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-white/15 hover:border-cyan-500/50 bg-white/[0.02] hover:bg-white/[0.04]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,.pdf,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
            />
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-200">
                点击选择文件 或 将本地文件拖拽至此处
              </p>
              <p className="text-slate-400 text-xs">
                支持 <span className="font-mono text-cyan-300 font-semibold">.md</span> (Markdown) 与 <span className="font-mono text-rose-400 font-semibold">.pdf</span> (Adobe PDF)
              </p>
            </div>
          </div>

          {/* Asset Category Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-200 font-mono">
              1. 选择资产分类 (Asset Category):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(ASSET_CATEGORIES_META) as AssetCategory[]).map((catKey) => {
                const meta = ASSET_CATEGORIES_META[catKey];
                const isSelected = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setSelectedCategory(catKey)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `${meta.bgColor} ${meta.borderColor} text-white shadow-md ring-1 ring-cyan-500/40`
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[11px] font-bold ${isSelected ? meta.textColor : 'text-slate-300'}`}>
                        {meta.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <span className="text-[9px] text-slate-400 truncate mt-1">
                      {meta.enLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* File Meta Inputs (Name, Type, Tags, Summary) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300 font-mono">
                2. 文件名称 (File Name)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="例如：AlexLin_1分钟电梯演讲.md"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="flex-1 bg-slate-950/80 border border-white/10 focus:border-cyan-500 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none font-mono"
                />
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as 'md' | 'pdf')}
                  className="bg-slate-950/80 border border-white/10 rounded-xl px-2.5 py-2 text-slate-200 text-xs font-mono outline-none"
                >
                  <option value="md">.MD</option>
                  <option value="pdf">.PDF</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300 font-mono">
                3. 标签 (Tags, 逗号分隔)
              </label>
              <input
                type="text"
                placeholder="例如：1分钟自述, Agent架构, 核心亮点"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-500 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300 font-mono">
              4. 核心一句话摘要 (Summary)
            </label>
            <input
              type="text"
              placeholder="概括该资产的核心价值或应用场景..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-500 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none"
            />
          </div>

          {/* Content Preview & Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-300 font-mono">
                5. 文档正文内容 (Markdown / 提取文本)
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                字数: {content.length} · 预计消耗 ~{Math.ceil(content.length / 3)} Tokens
              </span>
            </div>
            <textarea
              required
              rows={8}
              placeholder="在此粘贴或编辑 Markdown 格式的资产内容..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setFileSizeText(`${(e.target.value.length / 1024).toFixed(1)} KB`);
              }}
              className="w-full bg-slate-950/90 border border-white/10 focus:border-cyan-500 rounded-2xl p-3.5 text-slate-200 font-mono text-[11px] leading-relaxed outline-none resize-y"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              取消
            </button>

            <button
              type="submit"
              disabled={uploadSuccess}
              className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                uploadSuccess
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25 hover:scale-[1.02]'
              }`}
            >
              {uploadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>上传并索引成功!</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>确认上传并挂载至资产库</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

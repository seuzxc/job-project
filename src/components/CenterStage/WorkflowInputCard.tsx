import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Upload, 
  Sparkles, 
  Link2, 
  RotateCcw, 
  Check, 
  Trash2,
  FileCode,
  FileCheck2,
  Eye,
  X,
  Plus,
  Layers,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Globe,
  ExternalLink,
  Loader2,
  Search
} from 'lucide-react';
import { WorkflowId, SharedRunContext } from '../../types/harness';
import { WORKFLOWS_CONFIG, AGENT_DIRECTORY } from '../../data/mockData';

export type InputMode = 'text' | 'screenshot' | 'pdf' | 'markdown' | 'url';

export interface UploadedAttachment {
  id: string;
  type: 'screenshot' | 'pdf' | 'markdown' | 'url';
  name: string;
  sizeFormatted: string;
  previewUrl?: string; // For images or web links
  sourceUrl?: string;  // For url type
  extractedText: string;
  pageCount?: number;
  uploadedAt: string;
}

interface WorkflowInputCardProps {
  workflowId: WorkflowId;
  runContext: SharedRunContext;
  onUpdateInput: (content: string, title?: string) => void;
  isRunning: boolean;
}

// Sample fallback content generators for rich preview when simulated uploads occur
const MOCK_EXTRACTED_TEMPLATES = {
  screenshot: (filename: string) => `【OCR 截图解析成功 - ${filename}】\n` +
    `职位名称: 资深大模型 Agent 产品专家 / 架构师 (LLM Application Lead)\n` +
    `所属部门: 核心技术研发部 · AI Infra 与智能体中枢\n` +
    `薪酬范围: 60k - 85k · 16薪 + 期权股票激励\n` +
    `工作地点: 北京 / 上海 / 远程灵活协同\n\n` +
    `岗位职责 (OCR 识别):\n` +
    `1. 负责企业级多智能体协同框架 (Agent Harness) 的整体架构设计，定义 Agent 状态机流转与执行边界。\n` +
    `2. 主导 Tool Registry 治理、沙箱代码执行与人类在环 (Human-in-the-loop) 安全审查门禁。\n` +
    `3. 建立 Agent 行为 Eval 评测流水线，对长任务规划、幻觉率、Token 成本与延迟进行量化监控。\n\n` +
    `任职要求:\n` +
    `- 5 年以上核心技术产品或架构经验，主导过至少 2 个以上生产级大模型应用落地；\n` +
    `- 熟练掌握 Tool Calling、ReAct、状态机 DAG、Structured Outputs 与向量检索；\n` +
    `- 对大模型工程确定性保障、上下文隔离与失败重试有深入理解。`,

  pdf: (filename: string) => `【PDF 文档解析提取 - ${filename} (共 3 页)】\n` +
    `文档类型: 面试全流程复盘记录 & 关键攻防问答实录\n` +
    `面试对象: 某头部大模型独角兽 · 业务合伙人 & 首席架构师 (终面)\n` +
    `交流时长: 75 分钟 · 综合评定: A+\n\n` +
    `【关键对谈记录摘要】:\n` +
    `Q1 (架构师): “在你们的 Multi-Agent 系统中，如果遇到大模型幻觉导致 Tool 参数错误，你们怎么做到不崩盘且可控？”\n` +
    `A1 (候选人): “我们构建了四级容错阶梯：第一级做严格的 Pydantic Schema 强校验；第二级触发 Reflection 提示大模型自我纠错；第三级接入 Fallback 规则兜底；第四级启动熔断并由 Harness 状态机收敛，杜绝死循环。”\n\n` +
    `Q2 (合伙人): “对我们即将启动的万级 QPS 企业 Agent 平台，你最关心的架构底线是什么？”\n` +
    `A2 (候选人): “状态与计算解耦、全局 Trace 可观测性，以及涉及持久化写操作的 Human Review Gate 人工防线。”`,

  markdown: (filename: string) => `---
title: ${filename}
author: 资深 AI 架构师
category: 大模型架构设计规范与知识库
status: Active
tags: [Agent, 状态机, 容错, 人机协同]
---

# ${filename.replace(/\.md$/, '')}

## 一、核心架构原则 (Architecture Invariants)
1. **控制与执行解耦**：状态机仅负责调度决策流，Tool Registry 专注具体 API 调用。
2. **上下文只读隔离**：各 Agent 只能通过星型中枢交换消息，杜绝全局上下文直接写污染。
3. **人类授权门禁**：对写回知识库 (Writeback) 等不可逆操作，一律触发 Human Review Gate。

## 二、生产级评测体系
- **任务收敛率指标**：确保 10 阶状态机在任意网络抖动或异常下不发生死循环。
- **Token 效益比**：对无效检索与冗余调用施加硬性截断。`,

  url: (url: string) => {
    let hostname = 'web-source.com';
    try {
      hostname = new URL(url).hostname;
    } catch {
      // fallback
    }

    if (url.includes('zhipin') || url.includes('job') || url.includes('lagou') || url.includes('liepin')) {
      return `【网页实时抓取成功 · ${hostname}】\n` +
        `来源 URL: ${url}\n` +
        `抓取时间: ${new Date().toLocaleTimeString()} · 状态码: 200 OK · DOM 正文清晰度: 99.4%\n\n` +
        `【岗位信息】: 资深 LLM Infra & Multi-Agent 架构专家\n` +
        `【所属团队】: 核心模型工程部 · 自主智能体实验室\n` +
        `【职位级别】: P8 / D2 / Staff Engineer · 65k-95k/月 + 长期期权\n` +
        `【职责详情】:\n` +
        `- 负责 Agent Harness 框架从 0 到 1 演进，支撑百万级 Daily Task 稳定调度；\n` +
        `- 规划企业级 Tool 插件生态，解决大模型多步调用过程中的上下文溢出与幻觉累计；\n` +
        `- 建立端到端 Golden Dataset 自动化评估基准，保障代码执行沙箱与持久化写入的安全性。`;
    } else if (url.includes('github') || url.includes('gitlab')) {
      return `【GitHub 仓库与文档抓取 · ${hostname}】\n` +
        `来源 URL: ${url}\n` +
        `抓取内容: README.md & 架构设计规范\n\n` +
        `# Production-Grade Multi-Agent Harness\n` +
        `> Deterministic State Machine, Tool Governance & Human-in-the-Loop Safeguards for LLM Workflows.\n\n` +
        `## Core Modules:\n` +
        `1. **Harness State DAG**: 10-State Linear Guaranteed Convergence Pipeline.\n` +
        `2. **Tool Registry**: Distributed execution with Pydantic validation & timeout circuit breaking.\n` +
        `3. **Memory Curator**: Safe sandboxed writeback with Human Gate authorization.`;
    }

    return `【网页正文提取与去噪 · ${hostname}】\n` +
      `来源 URL: ${url}\n` +
      `页面标题: 企业级大模型落地实战与系统性工程化指南\n` +
      `抓取状态: 已完成 HTML 标签过滤、正文去广告与语义摘要提取\n\n` +
      `【正文核心摘要】:\n` +
      `在将大模型从 Demo 推进至生产环境时，核心矛盾在于“大模型的概率性输出”与“企业业务的确定性要求”。\n` +
      `业界最佳实践是通过 Deterministic Harness (确定性状态机) 进行外层受控包装，结合严格的 Schema 强约束与 Human Review Gate 人工门禁，实现稳定、安全、可追溯的 AI 系统闭环。`;
  }
};

export const WorkflowInputCard: React.FC<WorkflowInputCardProps> = ({
  workflowId,
  runContext,
  onUpdateInput,
  isRunning
}) => {
  const currentWorkflow = WORKFLOWS_CONFIG.find((w) => w.id === workflowId)!;
  const primaryAgent = AGENT_DIRECTORY[currentWorkflow.primaryAgent];
  
  // Active input mode tab
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [selectedCaseId, setSelectedCaseId] = useState(currentWorkflow.sampleCases[0]?.id || '');
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  // Uploaded attachment states
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const [viewingAttachment, setViewingAttachment] = useState<UploadedAttachment | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // URL Input State
  const [inputUrl, setInputUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Hidden file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const mdInputRef = useRef<HTMLInputElement>(null);

  // When workflow changes, update default mode if appropriate
  useEffect(() => {
    setSelectedCaseId(currentWorkflow.sampleCases[0]?.id || '');
    setIsEditingCustom(false);
  }, [workflowId, currentWorkflow]);

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    const foundCase = currentWorkflow.sampleCases.find((c) => c.id === caseId);
    if (foundCase) {
      onUpdateInput(foundCase.rawInput, foundCase.title);
      setIsEditingCustom(false);
    }
  };

  // Helper to append/replace extracted text into runContext
  const syncAttachmentToContext = (newAttachments: UploadedAttachment[]) => {
    if (newAttachments.length === 0) {
      // Revert to original case if no attachments
      const defaultCase = currentWorkflow.sampleCases.find(c => c.id === selectedCaseId) || currentWorkflow.sampleCases[0];
      if (defaultCase) {
        onUpdateInput(defaultCase.rawInput, defaultCase.title);
      }
      return;
    }

    // Merge active attachments text
    const combinedText = newAttachments.map(a => a.extractedText).join('\n\n================================\n\n');
    const title = newAttachments.length === 1 ? newAttachments[0].name : `${newAttachments.length} 份上传附件综合输入`;
    onUpdateInput(combinedText, title);
    setIsEditingCustom(true);
  };

  // Handle local file read
  const processUploadedFiles = (files: FileList | File[], forceType?: 'screenshot' | 'pdf' | 'markdown') => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    fileArray.forEach(file => {
      let fileType: 'screenshot' | 'pdf' | 'markdown' = 'text' as any;
      if (forceType) {
        fileType = forceType;
      } else if (file.type.startsWith('image/') || /\.(png|jpg|jpeg|webp|bmp|svg)$/i.test(file.name)) {
        fileType = 'screenshot';
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        fileType = 'pdf';
      } else if (file.name.endsWith('.md') || file.name.endsWith('.markdown') || file.type.includes('text/markdown')) {
        fileType = 'markdown';
      } else {
        fileType = 'markdown';
      }

      const sizeFormatted = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      // Read content or generate mock OCR/PDF parsing
      if (fileType === 'markdown' || file.type.includes('text')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const attachment: UploadedAttachment = {
            id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'markdown',
            name: file.name,
            sizeFormatted,
            extractedText: text || MOCK_EXTRACTED_TEMPLATES.markdown(file.name),
            uploadedAt: '刚刚上传'
          };
          setAttachments(prev => {
            const next = [attachment, ...prev];
            syncAttachmentToContext(next);
            return next;
          });
        };
        reader.readAsText(file);
      } else if (fileType === 'screenshot') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewUrl = e.target?.result as string;
          const attachment: UploadedAttachment = {
            id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'screenshot',
            name: file.name,
            sizeFormatted,
            previewUrl,
            extractedText: MOCK_EXTRACTED_TEMPLATES.screenshot(file.name),
            uploadedAt: '刚刚上传'
          };
          setAttachments(prev => {
            const next = [attachment, ...prev];
            syncAttachmentToContext(next);
            return next;
          });
        };
        reader.readAsDataURL(file);
      } else if (fileType === 'pdf') {
        const attachment: UploadedAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'pdf',
          name: file.name,
          sizeFormatted,
          pageCount: 3,
          extractedText: MOCK_EXTRACTED_TEMPLATES.pdf(file.name),
          uploadedAt: '刚刚上传'
        };
        setAttachments(prev => {
          const next = [attachment, ...prev];
          syncAttachmentToContext(next);
          return next;
        });
      }
    });
  };

  // Process URL submission
  const handleFetchUrl = (urlToFetch?: string) => {
    const targetUrl = (urlToFetch || inputUrl).trim();
    if (!targetUrl) {
      setUrlError('请输入有效的网页 URL 链接');
      return;
    }

    // Basic URL validation
    let validUrl = targetUrl;
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = `https://${validUrl}`;
    }

    try {
      new URL(validUrl);
    } catch {
      setUrlError('URL 格式不合法，请检查协议与域名');
      return;
    }

    setUrlError(null);
    setIsFetchingUrl(true);

    // Simulate async web crawl & content extraction
    setTimeout(() => {
      let title = '网页提取内容';
      try {
        const parsed = new URL(validUrl);
        title = `${parsed.hostname}${parsed.pathname.length > 1 ? parsed.pathname.substring(0, 15) : ''}`;
      } catch {
        title = validUrl;
      }

      const extracted = MOCK_EXTRACTED_TEMPLATES.url(validUrl);
      const newAtt: UploadedAttachment = {
        id: `att-${Date.now()}`,
        type: 'url',
        name: title,
        sourceUrl: validUrl,
        sizeFormatted: `${(extracted.length / 1024).toFixed(1)} KB`,
        extractedText: extracted,
        uploadedAt: '实时抓取'
      };

      const updated = [newAtt, ...attachments];
      setAttachments(updated);
      syncAttachmentToContext(updated);
      setIsFetchingUrl(false);
      setInputUrl('');
    }, 600);
  };

  // Delete attachment
  const handleDeleteAttachment = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = attachments.filter(a => a.id !== id);
    setAttachments(updated);
    if (viewingAttachment?.id === id) {
      setViewingAttachment(null);
    }
    syncAttachmentToContext(updated);
  };

  // Preset generator for fast 1-click test simulation
  const handleQuickAddSimulated = (type: 'screenshot' | 'pdf' | 'markdown' | 'url') => {
    if (type === 'url') {
      handleFetchUrl('https://www.zhipin.com/job_detail/senior-llm-agent-lead.html');
      return;
    }

    let name = '';
    let extracted = '';
    let previewUrl: string | undefined = undefined;

    if (type === 'screenshot') {
      name = 'Boss直聘_资深大模型Agent专家_JD.png';
      extracted = MOCK_EXTRACTED_TEMPLATES.screenshot(name);
      previewUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60';
    } else if (type === 'pdf') {
      name = '大模型架构面试复盘_三轮对谈实录.pdf';
      extracted = MOCK_EXTRACTED_TEMPLATES.pdf(name);
    } else {
      name = 'Multi_Agent_状态机与执行容错架构指南.md';
      extracted = MOCK_EXTRACTED_TEMPLATES.markdown(name);
    }

    const newAtt: UploadedAttachment = {
      id: `att-${Date.now()}`,
      type,
      name,
      sizeFormatted: type === 'screenshot' ? '1.8 MB' : type === 'pdf' ? '840 KB' : '14 KB',
      previewUrl,
      extractedText: extracted,
      pageCount: type === 'pdf' ? 3 : undefined,
      uploadedAt: '模拟生成'
    };

    const updated = [newAtt, ...attachments];
    setAttachments(updated);
    syncAttachmentToContext(updated);
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20 space-y-3.5">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={(e) => e.target.files && processUploadedFiles(e.target.files, 'screenshot')}
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={pdfInputRef}
        onChange={(e) => e.target.files && processUploadedFiles(e.target.files, 'pdf')}
        accept="application/pdf,.pdf"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={mdInputRef}
        onChange={(e) => e.target.files && processUploadedFiles(e.target.files, 'markdown')}
        accept=".md,.markdown,text/markdown,text/plain"
        multiple
        className="hidden"
      />

      {/* Header: Title & Owner Agent */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{currentWorkflow.name} · 多模态任务输入组件</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                支持 5 种输入模式
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              由 <span className="text-cyan-300 font-semibold">{primaryAgent.name}</span> 编排与语义提取
            </p>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-mono">预设用例:</span>
          {currentWorkflow.sampleCases.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCase(c.id)}
              disabled={isRunning}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCaseId === c.id && !isEditingCustom && attachments.length === 0
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {c.title.split('-')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Selector Tabs & Upload Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/60 p-2 rounded-xl border border-white/5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Tab 1: Text */}
          <button
            onClick={() => setInputMode('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              inputMode === 'text'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>文本直接编辑</span>
          </button>

          {/* Tab 2: URL Link */}
          <button
            onClick={() => setInputMode('url')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              inputMode === 'url'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-sky-400" />
            <span>网页链接 / URL</span>
            {attachments.filter(a => a.type === 'url').length > 0 && (
              <span className="text-[10px] bg-sky-500/30 text-sky-200 px-1.5 py-0.2 rounded-full font-mono">
                {attachments.filter(a => a.type === 'url').length}
              </span>
            )}
          </button>

          {/* Tab 3: Screenshot */}
          <button
            onClick={() => setInputMode('screenshot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              inputMode === 'screenshot'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>截图 / OCR</span>
            {attachments.filter(a => a.type === 'screenshot').length > 0 && (
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded-full font-mono">
                {attachments.filter(a => a.type === 'screenshot').length}
              </span>
            )}
          </button>

          {/* Tab 4: PDF */}
          <button
            onClick={() => setInputMode('pdf')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              inputMode === 'pdf'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
            <span>PDF 文档解析</span>
            {attachments.filter(a => a.type === 'pdf').length > 0 && (
              <span className="text-[10px] bg-amber-500/30 text-amber-200 px-1.5 py-0.2 rounded-full font-mono">
                {attachments.filter(a => a.type === 'pdf').length}
              </span>
            )}
          </button>

          {/* Tab 5: Markdown */}
          <button
            onClick={() => setInputMode('markdown')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              inputMode === 'markdown'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            <span>Markdown 导入</span>
            {attachments.filter(a => a.type === 'markdown').length > 0 && (
              <span className="text-[10px] bg-purple-500/30 text-purple-200 px-1.5 py-0.2 rounded-full font-mono">
                {attachments.filter(a => a.type === 'markdown').length}
              </span>
            )}
          </button>
        </div>

        {/* Upload/Action Trigger Buttons according to Mode */}
        <div className="flex items-center gap-2">
          {inputMode === 'url' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleQuickAddSimulated('url')}
                disabled={isRunning || isFetchingUrl}
                className="px-2 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                title="加载示例 JD 链接进行网页抓取与解析"
              >
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>示例职位链接</span>
              </button>
            </div>
          )}

          {inputMode === 'screenshot' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => imageInputRef.current?.click()}
                disabled={isRunning}
                className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>上传截图</span>
              </button>
              <button
                onClick={() => handleQuickAddSimulated('screenshot')}
                disabled={isRunning}
                className="px-2 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                title="加载预设示例截图进行 OCR 识别测试"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>示例截图</span>
              </button>
            </div>
          )}

          {inputMode === 'pdf' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => pdfInputRef.current?.click()}
                disabled={isRunning}
                className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>上传 PDF</span>
              </button>
              <button
                onClick={() => handleQuickAddSimulated('pdf')}
                disabled={isRunning}
                className="px-2 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                title="加载预设 PDF 复盘记录测试"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>示例 PDF</span>
              </button>
            </div>
          )}

          {inputMode === 'markdown' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => mdInputRef.current?.click()}
                disabled={isRunning}
                className="px-2.5 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>上传 .md 文件</span>
              </button>
              <button
                onClick={() => handleQuickAddSimulated('markdown')}
                disabled={isRunning}
                className="px-2 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                title="加载预设 Markdown 架构文档测试"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>示例 MD</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* URL Input Interactive Bar (When URL mode is active) */}
      {inputMode === 'url' && (
        <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-3 space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="text-sky-300 font-mono font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>输入网页链接 (支持 Boss直聘 / 拉勾 / GitHub / 技术博客 / Notion 等):</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              实时爬虫清洗 · 自动去除冗余广告
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Link2 className="w-4 h-4 text-sky-400" />
              </div>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (urlError) setUrlError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleFetchUrl();
                  }
                }}
                disabled={isRunning || isFetchingUrl}
                placeholder="https://www.zhipin.com/job_detail/xxx.html 或 https://github.com/..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-white/15 focus:border-sky-400 rounded-xl text-xs text-slate-100 font-mono focus:outline-none placeholder:text-slate-500 transition-colors"
              />
            </div>

            <button
              onClick={() => handleFetchUrl()}
              disabled={isRunning || isFetchingUrl || !inputUrl.trim()}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                !inputUrl.trim() || isFetchingUrl || isRunning
                  ? 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30 cursor-pointer'
              }`}
            >
              {isFetchingUrl ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>抓取中...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>抓取并解析</span>
                </>
              )}
            </button>
          </div>

          {urlError && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1 font-mono">
              <AlertCircle className="w-3 h-3" />
              {urlError}
            </p>
          )}

          {/* Quick preset links */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto text-[11px] font-mono text-slate-400">
            <span className="shrink-0 text-slate-400">快速填入:</span>
            <button
              onClick={() => handleFetchUrl('https://www.zhipin.com/job_detail/ai-agent-architect-p8.html')}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-sky-500/20 hover:text-sky-300 text-slate-300 border border-white/10 transition-colors shrink-0 cursor-pointer"
            >
              Boss直聘 Agent 架构师 (65k-95k)
            </button>
            <button
              onClick={() => handleFetchUrl('https://github.com/enterprise-ai/multi-agent-harness-spec')}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-sky-500/20 hover:text-sky-300 text-slate-300 border border-white/10 transition-colors shrink-0 cursor-pointer"
            >
              GitHub 状态机架构规范
            </button>
          </div>
        </div>
      )}

      {/* Uploaded Attachments Chips Bar (支持查看与删除) */}
      {attachments.length > 0 && (
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-mono text-[11px] flex items-center gap-1.5 font-bold">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              已加载输入附件 ({attachments.length}):
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              附件解析内容已自动注入工作流输入上下文
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {attachments.map((att) => {
              const isUrl = att.type === 'url';
              const isImg = att.type === 'screenshot';
              const isPdf = att.type === 'pdf';
              const isMd = att.type === 'markdown';

              return (
                <div
                  key={att.id}
                  onClick={() => setViewingAttachment(att)}
                  className={`group px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 cursor-pointer transition-all ${
                    isUrl
                      ? 'bg-sky-500/10 border-sky-500/30 text-sky-200 hover:border-sky-500/60'
                      : isImg
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 hover:border-emerald-500/60'
                      : isPdf
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200 hover:border-amber-500/60'
                      : 'bg-purple-500/10 border-purple-500/30 text-purple-200 hover:border-purple-500/60'
                  }`}
                >
                  {isUrl && <Link2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                  {isImg && <ImageIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  {isPdf && <FileCheck2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  {isMd && <FileCode className="w-3.5 h-3.5 text-purple-400 shrink-0" />}

                  <span className="max-w-[160px] truncate font-medium">{att.name}</span>
                  <span className="text-[10px] text-slate-400">({att.sizeFormatted})</span>

                  {/* View preview button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingAttachment(att);
                    }}
                    className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                    title="查看附件解析详情"
                  >
                    <Eye className="w-3 h-3" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteAttachment(att.id, e)}
                    disabled={isRunning}
                    className="p-1 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-400 transition-colors"
                    title="删除此附件"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone (When in file modes) */}
      {(inputMode === 'screenshot' || inputMode === 'pdf' || inputMode === 'markdown') && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (inputMode === 'screenshot') imageInputRef.current?.click();
            else if (inputMode === 'pdf') pdfInputRef.current?.click();
            else if (inputMode === 'markdown') mdInputRef.current?.click();
          }}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
              : inputMode === 'screenshot'
              ? 'border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10'
              : inputMode === 'pdf'
              ? 'border-amber-500/30 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10'
              : 'border-purple-500/30 hover:border-purple-400 bg-purple-500/5 hover:bg-purple-500/10'
          }`}
        >
          <div className="p-2.5 rounded-full bg-white/5 border border-white/10">
            {inputMode === 'screenshot' && <ImageIcon className="w-5 h-5 text-emerald-400" />}
            {inputMode === 'pdf' && <FileCheck2 className="w-5 h-5 text-amber-400" />}
            {inputMode === 'markdown' && <FileCode className="w-5 h-5 text-purple-400" />}
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-200">
              {inputMode === 'screenshot' && '点击上传或将岗位 JD / 架构截图拖拽到此处'}
              {inputMode === 'pdf' && '点击上传或将面试实录 / 简历 PDF 拖拽到此处'}
              {inputMode === 'markdown' && '点击上传或将 Markdown 技术规范 (.md) 拖拽到此处'}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              支持批量上传，系统将自动进行 OCR 提取、文档分块与脱敏清洗
            </p>
          </div>
        </div>
      )}

      {/* Main Textarea Input Area */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-mono text-[11px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            当前生效输入文本 (可自由微调):
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {runContext.userInput.rawContent.length} 字符 · ~{Math.round(runContext.userInput.rawContent.length * 0.7)} Tokens
          </span>
        </div>

        <div className="relative">
          <textarea
            value={runContext.userInput.rawContent}
            onChange={(e) => {
              setIsEditingCustom(true);
              onUpdateInput(e.target.value);
            }}
            disabled={isRunning}
            rows={inputMode === 'text' ? 5 : 4}
            className="w-full bg-slate-950/70 border border-white/10 focus:border-cyan-500/80 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed resize-none focus:outline-none transition-colors"
            placeholder="请输入或粘贴岗位 JD、面试复盘文本或技术文章..."
          />
        </div>
      </div>

      {/* Input footer & Compliance Bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 bg-white/[0.03] p-2.5 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-cyan-400 font-bold">🔒 数据合规 & 脱敏:</span>
          <span className="truncate max-w-[280px] sm:max-w-none">
            {attachments.length > 0
              ? `已加载 ${attachments.length} 个附件 · 实体命名与敏感隐私自动脱敏`
              : '使用虚构脱敏样本，绝无真实姓名、电话与私有 JD'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {attachments.length > 0 && (
            <button
              onClick={() => {
                setAttachments([]);
                const firstCase = currentWorkflow.sampleCases[0];
                if (firstCase) {
                  handleSelectCase(firstCase.id);
                }
              }}
              disabled={isRunning}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
            >
              <Trash2 className="w-3 h-3" />
              清空全部附件
            </button>
          )}
          <button
            onClick={() => {
              setAttachments([]);
              const firstCase = currentWorkflow.sampleCases[0];
              if (firstCase) {
                handleSelectCase(firstCase.id);
              }
            }}
            disabled={isRunning}
            className="hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            重置预设
          </button>
        </div>
      </div>

      {/* Attachment Preview Modal */}
      {viewingAttachment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  {viewingAttachment.type === 'url' && <Link2 className="w-4 h-4 text-sky-400" />}
                  {viewingAttachment.type === 'screenshot' && <ImageIcon className="w-4 h-4 text-emerald-400" />}
                  {viewingAttachment.type === 'pdf' && <FileCheck2 className="w-4 h-4 text-amber-400" />}
                  {viewingAttachment.type === 'markdown' && <FileCode className="w-4 h-4 text-purple-400" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>{viewingAttachment.name}</span>
                    {viewingAttachment.sourceUrl && (
                      <a
                        href={viewingAttachment.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-400 hover:text-sky-300 inline-flex items-center"
                        title="在新标签页中打开网页"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {viewingAttachment.sourceUrl ? `来源链接: ${viewingAttachment.sourceUrl} · ` : ''}
                    {viewingAttachment.sizeFormatted} · {viewingAttachment.uploadedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteAttachment(viewingAttachment.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除附件</span>
                </button>
                <button
                  onClick={() => setViewingAttachment(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {viewingAttachment.previewUrl && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-300 block">截图原始图像预览:</span>
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center max-h-64">
                    <img 
                      src={viewingAttachment.previewUrl} 
                      alt="Screenshot Preview" 
                      className="max-h-64 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>提取文本与结构化结果:</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-normal">
                    {viewingAttachment.extractedText.length} 字符
                  </span>
                </span>
                <pre className="bg-slate-950 p-3 rounded-xl border border-white/10 text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {viewingAttachment.extractedText}
                </pre>
              </div>
            </div>

            <div className="p-3 border-t border-white/10 bg-slate-950/60 flex items-center justify-end">
              <button
                onClick={() => setViewingAttachment(null)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

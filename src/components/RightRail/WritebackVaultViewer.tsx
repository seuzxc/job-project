import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  FolderCheck, 
  ExternalLink,
  Code,
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';
import { WritebackPlanItem } from '../../types/harness';
import { INITIAL_WRITEBACK_ITEMS } from '../../data/mockData';

interface WritebackVaultViewerProps {
  activePlanItems: WritebackPlanItem[];
}

export const WritebackVaultViewer: React.FC<WritebackVaultViewerProps> = ({ activePlanItems }) => {
  const [selectedFile, setSelectedFile] = useState<WritebackPlanItem>(
    activePlanItems[0] || INITIAL_WRITEBACK_ITEMS[0]
  );
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(selectedFile.markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFile.markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.targetFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <FolderCheck className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            知识库回写文件预览 (Obsidian Vault Preview)
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          Markdown + Frontmatter
        </span>
      </div>

      <p className="text-[11px] text-slate-400">
        Demo 模式安全沙箱默认仅写入 <code className="text-cyan-300 font-mono">sample-data/outputs/</code> 目录，保护私有真实资产。
      </p>

      {/* Target Folder Tree Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono">
        {INITIAL_WRITEBACK_ITEMS.map((item) => {
          const isSelected = selectedFile.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedFile(item)}
              className={`p-2.5 rounded-xl border text-left transition-all truncate flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200 font-bold shadow-sm'
                  : 'bg-slate-900/40 border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
              <span className="truncate">{item.targetFileName}</span>
            </button>
          );
        })}
      </div>

      {/* File Inspector */}
      <div className="bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 block">写入目标文件路径:</span>
            <span className="font-mono text-xs text-cyan-300 font-bold">
              {selectedFile.targetFolder}{selectedFile.targetFileName}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyMarkdown}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-[10px] text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 text-cyan-400" />}
              {copied ? '已复制' : '复制 MD'}
            </button>
            <button
              onClick={handleDownload}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-[10px] text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Download className="w-2.5 h-2.5 text-cyan-400" />
              下载
            </button>
          </div>
        </div>

        {/* YAML Frontmatter Tags */}
        {selectedFile.frontmatter && (
          <div className="bg-slate-900/80 border border-white/10 rounded-lg p-2.5 text-[10px] font-mono space-y-1">
            <span className="text-slate-400 block font-bold">--- YAML Frontmatter ---</span>
            <div className="flex flex-wrap gap-2 text-slate-300">
              {Object.entries(selectedFile.frontmatter).map(([k, v]) => (
                <span key={k} className="bg-slate-950/80 px-2 py-0.5 rounded border border-white/10">
                  <strong className="text-cyan-300">{k}:</strong> {Array.isArray(v) ? v.join(', ') : String(v)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Markdown Content Preview */}
        <pre className="bg-slate-900/60 p-3 rounded-xl border border-white/10 text-slate-200 font-mono text-[11px] max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
          {selectedFile.markdownContent}
        </pre>
      </div>
    </div>
  );
};

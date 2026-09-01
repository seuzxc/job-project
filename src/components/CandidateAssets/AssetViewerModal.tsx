import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Tag, 
  Calendar, 
  Layers, 
  HardDrive,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Edit3,
  Save
} from 'lucide-react';
import { CandidateAssetFile } from '../../types/harness';
import { ASSET_CATEGORIES_META } from '../../data/mockData';

interface AssetViewerModalProps {
  asset: CandidateAssetFile | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onUpdateAsset?: (updated: CandidateAssetFile) => void;
}

export const AssetViewerModal: React.FC<AssetViewerModalProps> = ({
  asset,
  isOpen,
  onClose,
  onDelete,
  onToggleActive,
  onUpdateAsset
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editSummary, setEditSummary] = useState('');

  if (!isOpen || !asset) return null;

  const meta = ASSET_CATEGORIES_META[asset.category] || ASSET_CATEGORIES_META.self_intro;

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([asset.content], { type: asset.fileType === 'md' ? 'text/markdown;charset=utf-8;' : 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = asset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleStartEdit = () => {
    setEditContent(asset.content);
    setEditSummary(asset.summary);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (onUpdateAsset) {
      onUpdateAsset({
        ...asset,
        content: editContent,
        summary: editSummary,
        sizeFormatted: `${(editContent.length / 1024).toFixed(1)} KB`,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${meta.color} text-white shadow-lg`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 font-mono">
                  {asset.name}
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  asset.fileType === 'md'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  .{asset.fileType.toUpperCase()}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${meta.bgColor} ${meta.textColor} border ${meta.borderColor}`}>
                  {meta.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {asset.summary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Active Toggle */}
            <button
              onClick={() => onToggleActive(asset.id)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                asset.activeInRun
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
              }`}
              title="切换是否挂载至 Agent Run Context"
            >
              {asset.activeInRun ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
              <span>{asset.activeInRun ? '已挂载到 Run' : '未挂载'}</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
              title="复制正文 Markdown"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
              title="下载文件"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => {
                if (confirm(`确定要删除资产文件「${asset.name}」吗？`)) {
                  onDelete(asset.id);
                  onClose();
                }
              }}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors cursor-pointer"
              title="删除文件"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              <span>体积: {asset.sizeFormatted}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>更新时间: {asset.updatedAt}</span>
            </span>
            <span className="text-slate-400">
              预估 Token: ~{Math.ceil(asset.content.length / 3)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {asset.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[10px]">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content Viewer / Editor */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 font-mono mb-1">
                  编辑摘要:
                </label>
                <input
                  type="text"
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 font-mono mb-1">
                  编辑 Markdown 内容:
                </label>
                <textarea
                  rows={16}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-slate-950/90 border border-white/10 rounded-2xl p-4 text-slate-200 font-mono text-xs leading-relaxed outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-5 text-slate-200">
              <div className="markdown-body prose prose-invert max-w-none text-xs leading-relaxed space-y-3">
                <Markdown>{asset.content}</Markdown>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs">
          <div className="text-slate-400 font-mono text-[11px]">
            {isEditing ? '正在编辑模式...' : '只读查看模式 · 专职 Agent 自动向量索引'}
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存修改</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleStartEdit}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>编辑文档</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

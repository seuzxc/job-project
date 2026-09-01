import React, { useState, useMemo } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Award, 
  AlertTriangle, 
  FolderGit2, 
  CheckCircle,
  FileText,
  Upload,
  Plus,
  Search,
  Filter,
  Trash2,
  Eye,
  Download,
  Check,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Layers,
  BrainCircuit,
  MessageSquare,
  Target,
  ShieldAlert,
  HardDrive,
  FileCode,
  SlidersHorizontal,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { CandidateProfile, CandidateAssetFile, AssetCategory } from '../../types/harness';
import { DESENSITIZED_CANDIDATE, ASSET_CATEGORIES_META } from '../../data/mockData';
import { AssetUploadModal } from '../CandidateAssets/AssetUploadModal';
import { AssetViewerModal } from '../CandidateAssets/AssetViewerModal';

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: CandidateAssetFile[];
  onAddAsset: (newAsset: CandidateAssetFile) => void;
  onDeleteAsset: (id: string) => void;
  onToggleActiveAsset: (id: string) => void;
  onUpdateAsset: (updated: CandidateAssetFile) => void;
  candidateProfile?: CandidateProfile;
  targetAssetToView?: CandidateAssetFile | null;
  onClearTargetAsset?: () => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  isOpen,
  onClose,
  assets,
  onAddAsset,
  onDeleteAsset,
  onToggleActiveAsset,
  onUpdateAsset,
  candidateProfile = DESENSITIZED_CANDIDATE,
  targetAssetToView,
  onClearTargetAsset
}) => {
  const [activeTab, setActiveTab] = useState<'assets' | 'persona'>('assets');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<AssetCategory | 'all'>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'md' | 'pdf'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<CandidateAssetFile | null>(null);

  // Automatically open target asset when supplied
  React.useEffect(() => {
    if (isOpen && targetAssetToView) {
      setActiveTab('assets');
      if (targetAssetToView.category) {
        setSelectedCategoryFilter(targetAssetToView.category);
      }
      setViewingAsset(targetAssetToView);
    }
  }, [isOpen, targetAssetToView]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: assets.length };
    (Object.keys(ASSET_CATEGORIES_META) as AssetCategory[]).forEach(cat => {
      counts[cat] = assets.filter(a => a.category === cat).length;
    });
    return counts;
  }, [assets]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      if (selectedCategoryFilter !== 'all' && asset.category !== selectedCategoryFilter) return false;
      if (selectedTypeFilter !== 'all' && asset.fileType !== selectedTypeFilter) return false;
      if (activeOnly && !asset.activeInRun) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = asset.name.toLowerCase().includes(q);
        const matchesSummary = asset.summary.toLowerCase().includes(q);
        const matchesTags = asset.tags.some(t => t.toLowerCase().includes(q));
        const matchesContent = asset.content.toLowerCase().includes(q);
        if (!matchesName && !matchesSummary && !matchesTags && !matchesContent) return false;
      }
      return true;
    });
  }, [assets, selectedCategoryFilter, selectedTypeFilter, activeOnly, searchQuery]);

  if (!isOpen) return null;

  // Statistics
  const activeCount = assets.filter(a => a.activeInRun).length;
  const pdfCount = assets.filter(a => a.fileType === 'pdf').length;
  const mdCount = assets.filter(a => a.fileType === 'md').length;

  const handleExportAll = () => {
    const jsonStr = JSON.stringify(assets, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AlexLin_Candidate_Assets_Export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleToggleAllActive = () => {
    const allActive = assets.every(a => a.activeInRun);
    assets.forEach(a => {
      if (a.activeInRun === allActive) {
        onToggleActiveAsset(a.id);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl shadow-black/60 overflow-hidden">
        {/* Main Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-500/25">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  全局资产管理
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium">
                    {candidateProfile.name} · {candidateProfile.experienceYears} 年经验
                  </span>
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {activeCount} / {assets.length} 项已挂载 Run
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {candidateProfile.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveTab('assets')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                  activeTab === 'assets'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>资产文件库 ({assets.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('persona')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                  activeTab === 'persona'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>基准画像概览</span>
              </button>
            </div>

            {/* Quick Upload Button */}
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>上传文件 (PDF/MD)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {activeTab === 'assets' ? (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setSelectedCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedCategoryFilter === 'all'
                        ? 'bg-white/15 text-white border-white/30 shadow-sm'
                        : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-slate-200'
                    }`}
                  >
                    <span>全部资产</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                      {categoryCounts.all}
                    </span>
                  </button>

                  {(Object.keys(ASSET_CATEGORIES_META) as AssetCategory[]).map(catKey => {
                    const meta = ASSET_CATEGORIES_META[catKey];
                    const isSelected = selectedCategoryFilter === catKey;
                    return (
                      <button
                        key={catKey}
                        onClick={() => setSelectedCategoryFilter(catKey)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? `${meta.bgColor} ${meta.textColor} ${meta.borderColor} shadow-sm ring-1 ring-white/10`
                            : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-slate-200'
                        }`}
                      >
                        <span>{meta.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/20' : 'bg-white/10'}`}>
                          {categoryCounts[catKey] || 0}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportAll}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    title="导出全量资产 JSON"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>导出资产</span>
                  </button>
                  <button
                    onClick={handleToggleAllActive}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    title="批量挂载或卸载"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                    <span>全部挂载/卸载</span>
                  </button>
                </div>
              </div>

              {/* Search and Secondary Filter Bar */}
              <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-[240px] relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索资产文件名、摘要、标签或正文关键字..."
                    className="w-full bg-slate-900/90 border border-white/10 focus:border-indigo-500 rounded-xl pl-9 pr-4 py-1.5 text-slate-100 text-xs outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* File Type Filter */}
                  <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-1 text-[11px] font-mono">
                    <button
                      onClick={() => setSelectedTypeFilter('all')}
                      className={`px-2.5 py-0.5 rounded-lg transition-colors ${
                        selectedTypeFilter === 'all' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      全部
                    </button>
                    <button
                      onClick={() => setSelectedTypeFilter('md')}
                      className={`px-2.5 py-0.5 rounded-lg transition-colors ${
                        selectedTypeFilter === 'md' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      .MD ({mdCount})
                    </button>
                    <button
                      onClick={() => setSelectedTypeFilter('pdf')}
                      className={`px-2.5 py-0.5 rounded-lg transition-colors ${
                        selectedTypeFilter === 'pdf' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      .PDF ({pdfCount})
                    </button>
                  </div>

                  {/* Active Only Filter */}
                  <button
                    onClick={() => setActiveOnly(!activeOnly)}
                    className={`px-2.5 py-1.5 rounded-xl border text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeOnly
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>仅看已挂载 ({activeCount})</span>
                  </button>
                </div>
              </div>

              {/* Assets Grid */}
              {filteredAssets.length === 0 ? (
                <div className="bg-slate-950/40 border border-dashed border-white/15 rounded-2xl p-12 text-center space-y-3">
                  <div className="p-3 bg-white/5 rounded-2xl w-fit mx-auto text-slate-400">
                    <FolderOpen className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-300">未找到符合条件的资产文件</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    您可以尝试清除搜索条件，或者点击右上角「上传文件」添加新的 PDF / Markdown 资产。
                  </p>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium cursor-pointer transition-colors inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>上传新资产</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredAssets.map((asset) => {
                    const meta = ASSET_CATEGORIES_META[asset.category] || ASSET_CATEGORIES_META.self_intro;
                    return (
                      <div
                        key={asset.id}
                        className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 bg-slate-950/70 hover:bg-slate-950/90 ${
                          asset.activeInRun
                            ? 'border-white/15 shadow-md shadow-black/20 hover:border-cyan-500/40'
                            : 'border-white/5 opacity-70 hover:opacity-100 hover:border-white/20'
                        }`}
                      >
                        {/* Card Top Strip */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${meta.bgColor} ${meta.textColor} ${meta.borderColor}`}>
                                {meta.label}
                              </span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold ${
                                asset.fileType === 'md'
                                  ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                              }`}>
                                .{asset.fileType.toUpperCase()}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {asset.sizeFormatted}
                              </span>
                            </div>

                            {/* Active in Run Switch */}
                            <button
                              onClick={() => onToggleActiveAsset(asset.id)}
                              className={`text-[10px] px-2 py-0.5 rounded-full border font-mono transition-all flex items-center gap-1 cursor-pointer ${
                                asset.activeInRun
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-sm'
                                  : 'bg-white/5 text-slate-500 border-white/10 hover:text-slate-300'
                              }`}
                              title={asset.activeInRun ? '已挂载到 Agent 运行上下文' : '未挂载，点击挂载'}
                            >
                              {asset.activeInRun ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                  <span>已挂载</span>
                                </>
                              ) : (
                                <span>未挂载</span>
                              )}
                            </button>
                          </div>

                          {/* File Name */}
                          <h3 
                            onClick={() => setViewingAsset(asset)}
                            className="font-mono font-bold text-slate-100 text-xs hover:text-cyan-300 cursor-pointer transition-colors truncate"
                            title={asset.name}
                          >
                            {asset.name}
                          </h3>

                          {/* Summary */}
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {asset.summary}
                          </p>
                        </div>

                        {/* Card Bottom Strip */}
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1">
                            {asset.tags.slice(0, 2).map((t, idx) => (
                              <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/5 font-mono">
                                #{t}
                              </span>
                            ))}
                            {asset.tags.length > 2 && (
                              <span className="text-[9px] text-slate-500 font-mono">
                                +{asset.tags.length - 2}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setViewingAsset(asset)}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 text-[11px] flex items-center gap-1 transition-colors cursor-pointer font-medium"
                              title="预览阅读 / 编辑"
                            >
                              <Eye className="w-3.5 h-3.5 text-cyan-400" />
                              <span>阅读</span>
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`确定要删除资产文件「${asset.name}」吗？`)) {
                                  onDeleteAsset(asset.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 border border-white/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                              title="删除文件"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Persona Baseline Overview Tab */
            <div className="space-y-4">
              {/* Persona & Positioning */}
              <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 space-y-2">
                <h3 className="font-semibold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>核心职业定位 (Candidate Persona & Positioning)</span>
                </h3>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {candidateProfile.positioning}
                </p>
              </div>

              {/* Core Strengths */}
              <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 space-y-2.5">
                <h3 className="font-semibold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>核心竞争优势 (Core Strengths)</span>
                </h3>
                <div className="space-y-2">
                  {candidateProfile.strengths.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-xs leading-relaxed">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Boundaries & Rules */}
              <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 space-y-2.5">
                <h3 className="font-semibold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>定位规则与面试风险边界 (Risk Boundaries)</span>
                </h3>
                <div className="space-y-2">
                  {candidateProfile.riskBoundaries.map((r, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                      <span className="text-amber-400 shrink-0 mt-0.5">⚠️</span>
                      <span className="text-slate-300 text-xs leading-relaxed">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Project Assets */}
              <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 space-y-3">
                <h3 className="font-semibold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-purple-400" />
                  <span>深度项目资产结构化总结 (Retrieved Project Assets)</span>
                </h3>
                <div className="space-y-2.5">
                  {candidateProfile.coreProjects.map((proj, idx) => (
                    <div key={idx} className="bg-slate-900/90 border border-white/5 p-3.5 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-100 text-xs font-mono">{proj.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium">
                          {proj.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400"><strong className="text-slate-300">架构细节:</strong> {proj.architecture}</p>
                      <p className="text-[11px] text-emerald-400 font-medium"><strong className="text-slate-300">业务产出:</strong> {proj.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AssetUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={onAddAsset}
        initialCategory={selectedCategoryFilter === 'all' ? 'self_intro' : selectedCategoryFilter}
      />

      {/* Viewer Modal */}
      <AssetViewerModal
        asset={viewingAsset}
        isOpen={!!viewingAsset}
        onClose={() => setViewingAsset(null)}
        onDelete={onDeleteAsset}
        onToggleActive={onToggleActiveAsset}
        onUpdateAsset={onUpdateAsset}
      />
    </div>
  );
};

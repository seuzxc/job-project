import React from 'react';
import { 
  FolderGit2, 
  User, 
  Upload, 
  ExternalLink, 
  ShieldCheck, 
  BrainCircuit,
  MessageSquare,
  Target,
  ShieldAlert,
  ChevronRight,
  Plus
} from 'lucide-react';
import { CandidateAssetFile, AssetCategory } from '../../types/harness';
import { ASSET_CATEGORIES_META, DESENSITIZED_CANDIDATE } from '../../data/mockData';

interface CandidateAssetCardProps {
  assets: CandidateAssetFile[];
  onOpenProfile: () => void;
}

export const CandidateAssetCard: React.FC<CandidateAssetCardProps> = ({
  assets,
  onOpenProfile
}) => {
  const activeCount = assets.filter(a => a.activeInRun).length;
  const categories = Object.keys(ASSET_CATEGORIES_META) as AssetCategory[];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              候选人资产中枢
              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {activeCount} 已挂载
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={onOpenProfile}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer font-medium transition-colors"
        >
          <span>管理</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Candidate Persona Snippet */}
      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
            林
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-200">林思源 (Alex Lin)</div>
            <div className="text-[9px] text-slate-400 font-mono">7年 AI 产品架构 · P8 / Expert</div>
          </div>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-white/5 text-slate-400 border border-white/10">
          {assets.length} 文件
        </span>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-1.5">
        {categories.map((catKey) => {
          const meta = ASSET_CATEGORIES_META[catKey];
          const count = assets.filter(a => a.category === catKey).length;
          return (
            <div
              key={catKey}
              onClick={onOpenProfile}
              className="px-2.5 py-1.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 flex items-center justify-between text-[11px] cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${meta.textColor.replace('text-', 'bg-')}`} />
                <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                  {meta.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-mono">
                  {count} 份
                </span>
                <span className="text-[9px] text-slate-500 font-mono group-hover:text-cyan-400 transition-colors">
                  .md/.pdf
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Trigger */}
      <button
        onClick={onOpenProfile}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 hover:from-indigo-500/25 hover:to-cyan-500/25 border border-indigo-500/30 hover:border-cyan-500/50 text-indigo-200 text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
      >
        <Plus className="w-3.5 h-3.5 text-cyan-400" />
        <span>上传 / 管理 PDF与MD 资产</span>
      </button>
    </div>
  );
};

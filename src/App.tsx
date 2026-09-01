import React, { useState, useEffect, useRef } from 'react';
import { 
  WorkflowId, 
  HarnessState, 
  SharedRunContext, 
  ToolTraceItem,
  CandidateAssetFile,
  WritebackPlanItem,
  AssetCategory
} from './types/harness';
import { 
  getMockRunContext, 
  generateSimulationTrace, 
  STATE_FLOW_ORDER,
  INITIAL_CANDIDATE_ASSETS
} from './data/mockData';
import { Header } from './components/Header';
import { WorkflowSelector } from './components/LeftRail/WorkflowSelector';
import { ToolRegistryModal } from './components/LeftRail/ToolRegistryModal';
import { CandidateProfileModal } from './components/LeftRail/CandidateProfileModal';
import { WorkflowInputCard } from './components/CenterStage/WorkflowInputCard';
import { HarnessControlBar } from './components/CenterStage/HarnessControlBar';
import { StateMachineDAG } from './components/CenterStage/StateMachineDAG';
import { ToolTraceStream } from './components/CenterStage/ToolTraceStream';
import { StructuredOutputCard } from './components/RightRail/StructuredOutputCard';
import { ArchitectureModal } from './components/ArchitectureModal';
import { AgentCollaborationModal } from './components/AgentCollaborationModal';
import { SharedContextModal } from './components/SharedContextModal';

export default function App() {
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowId>('jd_evaluation');
  const [runContext, setRunContext] = useState<SharedRunContext>(() => getMockRunContext('jd_evaluation'));
  const [currentState, setCurrentState] = useState<HarnessState>('created');
  const [isRunning, setIsRunning] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [traces, setTraces] = useState<ToolTraceItem[]>([]);

  // Modals
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isSharedContextOpen, setIsSharedContextOpen] = useState(false);
  const [isToolRegistryOpen, setIsToolRegistryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [targetAssetToView, setTargetAssetToView] = useState<CandidateAssetFile | null>(null);

  // Candidate Assets Management
  const [candidateAssets, setCandidateAssets] = useState<CandidateAssetFile[]>(INITIAL_CANDIDATE_ASSETS);

  // Open asset directly in Global Vault Modal
  const handleOpenAssetInGlobalVault = (item: WritebackPlanItem) => {
    let matchingAsset = candidateAssets.find(
      a => a.name === item.targetFileName || a.name.includes(item.targetFileName) || a.id === item.id
    );

    if (!matchingAsset) {
      let category: AssetCategory = 'jd_eval';
      if (item.targetFolder.includes('mock') || item.targetFileName.includes('Mock')) {
        category = 'mock_qa';
      } else if (item.targetFolder.includes('interview') || item.targetFileName.includes('复盘')) {
        category = 'interview_recap';
      } else if (item.targetFolder.includes('ai') || item.targetFileName.includes('架构') || item.targetFileName.includes('Harness')) {
        category = 'ai_knowledge';
      } else if (item.targetFolder.includes('evaluation') || item.targetFileName.includes('评估')) {
        category = 'jd_eval';
      }

      matchingAsset = {
        id: item.id || `writeback-${Date.now()}`,
        name: item.targetFileName,
        category,
        fileType: 'md',
        sizeFormatted: `${(item.markdownContent.length / 1024).toFixed(1)} KB`,
        updatedAt: '刚刚落盘',
        summary: `工作流执行写入到 ${item.targetFolder}${item.targetFileName} 的知识库产物`,
        tags: ['Writeback', 'Harness落盘', item.targetFolder.replace(/[/]/g, '')],
        activeInRun: true,
        content: item.markdownContent
      };

      setCandidateAssets(prev => [matchingAsset!, ...prev]);
    }

    setTargetAssetToView(matchingAsset);
    setIsProfileOpen(true);
  };

  const handleAddAsset = (newAsset: CandidateAssetFile) => {
    setCandidateAssets(prev => [newAsset, ...prev]);
    if (newAsset.activeInRun) {
      setRunContext(prev => ({
        ...prev,
        retrievedAssets: [newAsset.name, ...prev.retrievedAssets.filter(n => n !== newAsset.name)]
      }));
    }
  };

  const handleDeleteAsset = (id: string) => {
    const assetToDelete = candidateAssets.find(a => a.id === id);
    setCandidateAssets(prev => prev.filter(a => a.id !== id));
    if (assetToDelete) {
      setRunContext(prev => ({
        ...prev,
        retrievedAssets: prev.retrievedAssets.filter(n => n !== assetToDelete.name)
      }));
    }
  };

  const handleToggleActiveAsset = (id: string) => {
    setCandidateAssets(prev => prev.map(a => {
      if (a.id === id) {
        const nextActive = !a.activeInRun;
        if (nextActive) {
          setRunContext(rctx => ({
            ...rctx,
            retrievedAssets: [a.name, ...rctx.retrievedAssets.filter(n => n !== a.name)]
          }));
        } else {
          setRunContext(rctx => ({
            ...rctx,
            retrievedAssets: rctx.retrievedAssets.filter(n => n !== a.name)
          }));
        }
        return { ...a, activeInRun: nextActive };
      }
      return a;
    }));
  };

  const handleUpdateAsset = (updated: CandidateAssetFile) => {
    setCandidateAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  // Switch workflow
  const handleSelectWorkflow = (wfId: WorkflowId) => {
    if (isRunning) return;
    setActiveWorkflow(wfId);
    const newContext = getMockRunContext(wfId);
    setRunContext(newContext);
    setCurrentState('created');
    setTraces([]);
  };

  // Update input text
  const handleUpdateInput = (content: string, title?: string) => {
    setRunContext(prev => ({
      ...prev,
      userInput: {
        ...prev.userInput,
        rawContent: content,
        title: title || prev.userInput.title
      }
    }));
  };

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setCurrentState('created');
    const newContext = getMockRunContext(activeWorkflow);
    setRunContext(newContext);
    setTraces([]);
  };

  // Trigger Failure Branch
  const handleTriggerFailureBranch = (branch: 'tool_failed' | 'needs_user_clarification') => {
    setIsRunning(false);
    setCurrentState(branch);
    setRunContext(prev => ({
      ...prev,
      currentState: branch
    }));
  };

  // Step-by-Step execution
  const handleStepNext = () => {
    const currentIndex = STATE_FLOW_ORDER.indexOf(currentState);
    if (currentIndex < 0) {
      setCurrentState(STATE_FLOW_ORDER[0]);
      return;
    }

    if (currentState === 'human_review_required') {
      // Must approve via gate
      return;
    }

    if (currentIndex < STATE_FLOW_ORDER.length - 1) {
      const nextState = STATE_FLOW_ORDER[currentIndex + 1];
      setCurrentState(nextState);
      setRunContext(prev => ({ ...prev, currentState: nextState }));

      if (nextState === 'tools_called') {
        const simTraces = generateSimulationTrace(activeWorkflow);
        setTraces(simTraces);
        setRunContext(prev => ({ ...prev, toolTrace: simTraces }));
      }

      if (nextState === 'human_review_required') {
        setRunContext(prev => ({ ...prev, humanReviewStatus: 'pending_review' }));
      }
    }
  };

  // Auto Run Execution
  const handleStartWorkflow = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentState('input_received');
    setRunContext(prev => ({ ...prev, currentState: 'input_received', humanReviewStatus: 'idle' }));
    setTraces([]);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms / speed));

    (async () => {
      await delay(400);
      setCurrentState('parsed');
      setRunContext(prev => ({ ...prev, currentState: 'parsed' }));

      await delay(450);
      setCurrentState('context_loaded');
      setRunContext(prev => ({ ...prev, currentState: 'context_loaded' }));

      await delay(500);
      setCurrentState('tools_called');
      const simTraces = generateSimulationTrace(activeWorkflow);
      setTraces(simTraces);
      setRunContext(prev => ({ ...prev, currentState: 'tools_called', toolTrace: simTraces }));

      await delay(600);
      setCurrentState('analysis_generated');
      setRunContext(prev => ({ ...prev, currentState: 'analysis_generated' }));

      await delay(500);
      setCurrentState('human_review_required');
      setRunContext(prev => ({ ...prev, currentState: 'human_review_required', humanReviewStatus: 'pending_review' }));
      setIsRunning(false);
    })();
  };

  // Approve Gate
  const handleApproveWriteback = () => {
    setRunContext(prev => ({
      ...prev,
      humanReviewStatus: 'approved',
      writebackPlan: prev.writebackPlan.map(item => ({ ...item, status: item.selected ? 'written' : 'skipped' }))
    }));
    setCurrentState('approved');

    setTimeout(() => {
      setCurrentState('written_back');
      setTimeout(() => {
        setCurrentState('completed');
        setRunContext(prev => ({ ...prev, currentState: 'completed' }));
      }, 400);
    }, 400);
  };

  // Reject Gate
  const handleRejectWriteback = () => {
    setRunContext(prev => ({
      ...prev,
      humanReviewStatus: 'rejected'
    }));
    setCurrentState('writeback_rejected');
  };

  // Toggle writeback items
  const handleToggleItem = (id: string) => {
    setRunContext(prev => ({
      ...prev,
      writebackPlan: prev.writebackPlan.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    }));
  };

  // Calculate progress percentage
  const stateIndex = STATE_FLOW_ORDER.indexOf(currentState);
  const progressPercent = stateIndex >= 0 ? ((stateIndex + 1) / STATE_FLOW_ORDER.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[var(--bg-canvas,#09090b)] text-[var(--text-base,#e4e4e7)] flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors duration-200">
      {/* Top Bar */}
      <Header
        currentState={currentState}
        isRunning={isRunning}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenAgentCollaboration={() => setIsAgentModalOpen(true)}
        onOpenSharedContext={() => setIsSharedContextOpen(true)}
        onOpenToolRegistry={() => setIsToolRegistryOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onReset={handleReset}
        assetsCount={candidateAssets.length}
      />

      {/* Main 3-Column SaaS Workbench */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3.5 lg:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Left Column (Workflows) */}
        <aside className="lg:col-span-3 space-y-3.5 flex flex-col">
          <WorkflowSelector
            activeWorkflow={activeWorkflow}
            onSelectWorkflow={handleSelectWorkflow}
            isRunning={isRunning}
          />
        </aside>

        {/* Center Column (Input, DAG State Machine, Trace) */}
        <section className="lg:col-span-5 space-y-3.5 flex flex-col">
          <WorkflowInputCard
            workflowId={activeWorkflow}
            runContext={runContext}
            onUpdateInput={handleUpdateInput}
            isRunning={isRunning}
          />

          <HarnessControlBar
            currentState={currentState}
            isRunning={isRunning}
            stepMode={stepMode}
            setStepMode={setStepMode}
            speed={speed}
            setSpeed={setSpeed}
            onStartWorkflow={handleStartWorkflow}
            onStepNext={handleStepNext}
            onReset={handleReset}
            onTriggerFailureBranch={handleTriggerFailureBranch}
            progressPercent={progressPercent}
          />

          <StateMachineDAG 
            currentState={currentState} 
            runContext={runContext}
            onApproveWriteback={handleApproveWriteback}
            onRejectWriteback={handleRejectWriteback}
            onToggleItem={handleToggleItem}
            onOpenAssetInGlobalVault={handleOpenAssetInGlobalVault}
            isRunning={isRunning}
          />

          <ToolTraceStream traces={traces} />
        </section>

        {/* Right Column (Structured Output) */}
        <aside className="lg:col-span-4 space-y-3.5 flex flex-col">
          <StructuredOutputCard workflowId={activeWorkflow} />
        </aside>
      </main>

      {/* Footer Info */}
      <footer className="border-t border-white/10 bg-slate-900/40 backdrop-blur-xl px-4 py-2.5 text-center text-slate-400 text-xs font-mono flex items-center justify-center gap-2">
        <span>Career Agent Harness · Multi-Agent Orchestration & Deterministic State Machine</span>
        <span className="text-white/20">·</span>
        <span className="text-cyan-400/90 font-medium">AI Product Manager Portfolio Spec</span>
      </footer>

      {/* Modals */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <AgentCollaborationModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        workflowId={activeWorkflow}
        currentState={currentState}
        isRunning={isRunning}
      />

      <SharedContextModal
        isOpen={isSharedContextOpen}
        onClose={() => setIsSharedContextOpen(false)}
        runContext={runContext}
      />

      <ToolRegistryModal
        isOpen={isToolRegistryOpen}
        onClose={() => setIsToolRegistryOpen(false)}
      />

      <CandidateProfileModal
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setTargetAssetToView(null);
        }}
        assets={candidateAssets}
        onAddAsset={handleAddAsset}
        onDeleteAsset={handleDeleteAsset}
        onToggleActiveAsset={handleToggleActiveAsset}
        onUpdateAsset={handleUpdateAsset}
        targetAssetToView={targetAssetToView}
        onClearTargetAsset={() => setTargetAssetToView(null)}
      />
    </div>
  );
}

export type WorkflowId = 'jd_evaluation' | 'interview_recap' | 'mock_interview' | 'knowledge_intake';

export type AgentId = 
  | 'orchestrator_agent'
  | 'jd_opportunity_agent'
  | 'interview_recap_agent'
  | 'mock_interview_agent'
  | 'knowledge_intake_agent'
  | 'memory_curator_agent';

export type HarnessState = 
  | 'created'
  | 'input_received'
  | 'parsed'
  | 'context_loaded'
  | 'tools_called'
  | 'analysis_generated'
  | 'human_review_required'
  | 'approved'
  | 'written_back'
  | 'completed'
  | 'tool_failed'
  | 'needs_user_clarification'
  | 'writeback_rejected';

export type ToolCategory = 'asset_read' | 'document' | 'external' | 'writeback';

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  agentOwner: AgentId[];
  parametersSchema: Record<string, { type: string; description: string; required?: boolean }>;
  isHumanGated?: boolean;
}

export interface ToolTraceItem {
  id: string;
  timestamp: string;
  toolName: string;
  category: ToolCategory;
  callerAgent: AgentId;
  durationMs: number;
  tokensUsed: number;
  status: 'success' | 'running' | 'failed' | 'gated';
  inputPayload: Record<string, any>;
  outputPayload: Record<string, any>;
}

export interface AgentMessage {
  id: string;
  timestamp: string;
  sender: AgentId;
  receiver: AgentId;
  type: 'DISPATCH_TASK' | 'CONTEXT_INJECTION' | 'TOOL_RESULT' | 'WRITEBACK_PROPOSAL' | 'GATE_CONFIRMATION' | 'REFLECTION_ALERT';
  payloadSummary: string;
  fullPayload: Record<string, any>;
  status: 'sent' | 'processing' | 'received' | 'completed';
}

export interface CandidateProfile {
  name: string;
  title: string;
  experienceYears: number;
  positioning: string;
  strengths: string[];
  riskBoundaries: string[];
  coreProjects: {
    name: string;
    role: string;
    architecture: string;
    impact: string;
  }[];
}

export type AssetCategory = 
  | 'self_intro' 
  | 'positioning' 
  | 'risk_boundary' 
  | 'projects' 
  | 'ai_knowledge'
  | 'jd_eval'
  | 'mock_qa'
  | 'interview_recap';

export interface CandidateAssetFile {
  id: string;
  name: string;
  category: AssetCategory;
  fileType: 'pdf' | 'md';
  sizeFormatted: string;
  updatedAt: string;
  summary: string;
  content: string;
  tags: string[];
  activeInRun: boolean;
}

export interface SharedRunContext {
  runId: string;
  workflowType: WorkflowId;
  currentState: HarnessState;
  userInput: {
    title: string;
    sourceType: 'screenshot_ocr' | 'pdf_text' | 'article_url' | 'interactive_prompt';
    rawContent: string;
    metadata?: Record<string, any>;
  };
  activeOpportunity?: {
    company: string;
    position: string;
    department?: string;
    salaryRange?: string;
    location?: string;
  };
  candidateProfile: CandidateProfile;
  retrievedAssets: string[];
  externalResearch?: Record<string, any>;
  toolTrace: ToolTraceItem[];
  intermediateOutputs: Record<string, any>;
  humanReviewStatus: 'idle' | 'pending_review' | 'approved' | 'rejected' | 'modified';
  writebackPlan: WritebackPlanItem[];
}

export interface WritebackPlanItem {
  id: string;
  targetFolder: string;
  targetFileName: string;
  title: string;
  category: 'opportunity' | 'recap' | 'mock_qa' | 'knowledge';
  selected: boolean;
  frontmatter: Record<string, any>;
  markdownContent: string;
  diffSummary: string;
  status: 'pending' | 'written' | 'skipped';
}

export interface JDEvaluationOutput {
  company: string;
  position: string;
  overallScore: number; // 0-100
  tierRecommendation: 'S 级核心攻坚' | 'A 级值得推进' | 'B 级谨慎试探' | 'C 级不建议投入';
  dimensions: {
    companyQuality: { score: number; comment: string };
    positionMatch: { score: number; comment: string };
    opportunityDelta: { score: number; comment: string };
    ownerScope: { score: number; comment: string };
    sustainability: { score: number; comment: string };
  };
  coreMatches: string[];
  potentialRisks: string[];
  recommendedGreeting: {
    version: string;
    text: string;
    strategyNotes: string;
  };
  defensePreparationPoints: string[];
}

export interface InterviewRecapOutput {
  company: string;
  round: string;
  interviewOverallScore: number;
  interviewerProfile: {
    impression: string;
    capabilityLevel: '技术专家' | '产品总监' | '业务负责人' | 'HRD';
    styleMatchScore: number;
    styleAnalysis: string;
  };
  opportunityScore: number;
  strongPerformances: {
    question: string;
    highlight: string;
    whyGood: string;
  }[];
  weakPerformances: {
    question: string;
    currentFlaw: string;
    riskTriggered: string;
  }[];
  improvedStandardAnswers: {
    question: string;
    originalSummary: string;
    recommendedAnswer: string;
    keyFramingPoints: string[];
  }[];
  extractableDefenseQA: {
    question: string;
    coreDefenseLogic: string;
    knowledgeTag: string;
  }[];
}

export interface MockInterviewOutput {
  targetRole: string;
  targetCompany: string;
  readinessScore: number;
  selfIntroduction: {
    duration: string;
    script: string;
    keyPitchPoints: string[];
  };
  projectDeepDives: {
    project: string;
    starFramework: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
    likelyChallengingAngles: string[];
  }[];
  attackAndDefenseQA: {
    category: string;
    likelyTrapQuestion: string;
    underlyingIntent: string;
    bulletproofAnswer: string;
    riskBoundaryRule: string;
  }[];
  closingQuestions: {
    question: string;
    intent: string;
    personaTarget: string;
  }[];
  followUpChain: {
    step: number;
    interviewerQuestion: string;
    recommendedAnswer: string;
    critique: string;
    userDraft?: string;
  }[];
}

export interface KnowledgeIntakeOutput {
  sourceTitle: string;
  sourceUrl: string;
  summary: string;
  domainTags: string[];
  coreConcepts: {
    concept: string;
    definition: string;
    productionImpact: string;
  }[];
  interviewExpressions: {
    scenario: string;
    goldenPhrase: string;
    badVsGoodComparison: {
      ordinaryWay: string;
      proWay: string;
    };
  }[];
  curatedKnowledgeCard: {
    title: string;
    vaultPath: string;
    markdownPreview: string;
  };
}

export interface WorkflowConfig {
  id: WorkflowId;
  name: string;
  shortDesc: string;
  primaryAgent: AgentId;
  assistantAgents: AgentId[];
  badgeColor: string;
  defaultInputType: 'screenshot_ocr' | 'pdf_text' | 'article_url' | 'interactive_prompt';
  sampleCases: {
    id: string;
    title: string;
    description: string;
    rawInput: string;
  }[];
}

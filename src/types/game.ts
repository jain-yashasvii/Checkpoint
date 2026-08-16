export type GameMode = 'solo_ai' | 'multiplayer_lobby';

export type Demographic = 'teen' | 'college' | 'professional' | 'senior';

export type RoundCategory = 'source' | 'evidence' | 'context' | 'ai_manipulation';

export type MILTheme = 
  | 'ai_and_mil'          // AI and MIL: Innovative solutions addressing challenges posed by AI through MIL
  | 'mil_education'       // MIL Education: Creative approaches to MIL learning in the digital age
  | 'community_impact'    // Community Impact: MIL-based interventions that empower communities
  | 'youth_engagement'    // Youth Engagement: Strategies to position youth organizations as MIL change agents
  | 'open_track';         // Open Track: Other MIL-related ideas aligned with this year’s theme

export type GamePhase = 
  | 'onboarding'
  | 'lobby'
  | 'role_briefing'
  | 'investigation'
  | 'presentation'
  | 'cross_examination'
  | 'voting'
  | 'reveal'
  | 'round_summary'
  | 'game_over'
  | 'passport';

export type InvestigationActionType = 
  | 'check_source'
  | 'verify_date'
  | 'cross_check_network'
  | 'inspect_metadata'
  | 'analyze_ai_artifacts';

export interface InvestigationClue {
  type: InvestigationActionType;
  title: string;
  cost: number;
  unlocked: boolean;
  tactileSymbol: string; // For screen readers and tactile accessibility (e.g. ◆, ▲, ⬟, ⬡, ✦)
  metadataDetails: {
    label: string;
    value: string;
    confidenceNote?: string;
  }[];
  revealedEvidenceText: string;
  pedagogicalInsight: string; // The SIFT / MIL skill takeaway
}

export type AttachedMediaType = 'image' | 'audio' | 'document' | 'chart';

export interface AttachedMedia {
  type: AttachedMediaType;
  title: string;
  url?: string;
  caption: string;
  details: string;
  waveformSim?: number[]; // For audio snippets
  chartData?: { label: string; value: number; baseline?: number }[]; // For charts
  visualArtifactHints?: string[];
}

export interface CardHint {
  level: 1 | 2 | 3;
  title: string;
  hintText: string;
  recommendedVector?: InvestigationActionType;
  siftTip: string;
}

export interface InformationCard {
  id: string;
  roundCategory: RoundCategory;
  milTheme?: MILTheme;
  targetDemographic: Demographic;
  headline: string;
  claimSummary: string;
  allegedSource: {
    name: string;
    domain: string;
    author: string;
    authorBio: string;
    verifiedBadge: boolean;
  };
  publicationDate: string;
  statedEvidence: string;
  contextSnippet: string;
  attachedMedia: AttachedMedia;
  isImposterClaim: boolean; // Hidden during match
  imposterDeceptionType?: 'domain_spoof' | 'cherry_picked_chart' | 'recycled_photo' | 'deepfake_voice' | 'synthetic_gan';
  trueExplanation: string;
  verificationVerdict: 'Legitimate & Corroborated' | 'Misleading & Manipulated' | 'Unverifiable / Inconclusive';
  investigationClues: Record<InvestigationActionType, InvestigationClue>;
  suggestedCrossCheckQuestions: string[];
  hints?: CardHint[];
  milTakeaway?: {
    theme: MILTheme;
    title: string;
    intervention: string;
    milAlignment: string;
  };
}

export interface PlayerPersona {
  id: string;
  name: string;
  roleTitle: string;
  avatar: string;
  color: string;
  isAI: boolean;
  personality: 'analytical_journalist' | 'tech_factchecker' | 'impulsive_sharer' | 'academic_researcher' | 'skeptic_detective';
  personalityDescription: string;
  debateStyle: string;
  defaultSuspicionBias: number;
  voiceGender: 'female' | 'male';
}

export interface PlayerState {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isHost: boolean;
  isAI: boolean;
  isLocalUser: boolean;
  persona?: PlayerPersona;
  isImposter: boolean; // Secret role
  assignedCard: InformationCard;
  tokens: number;
  unlockedClues: InvestigationActionType[];
  investigativeNotes: string[];
  taggedSuspicion: 'low' | 'medium' | 'high' | 'unverifiable';
  ready: boolean;
  hasPresented: boolean;
  votedTargetId: string | null; // player id or 'unverifiable'
  voteReason: string;
  score: number;
  roundScore: number;
}

export interface DialogueMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderColor: string;
  text: string;
  timestamp: number;
  type: 'presentation' | 'question' | 'defense' | 'system' | 'clue_reveal';
  targetPlayerId?: string;
  signGestureKey?: 'fact' | 'evidence' | 'verify' | 'doubt' | 'source' | 'deception';
}

export interface SkillVectors {
  sourceVerification: number; // 0 - 100%
  evidenceAssessment: number;
  contextChecking: number;
  crossReferencing: number;
  aiManipulationDetection: number;
}

export interface VerificationBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: RoundCategory | MILTheme | 'general';
}

export interface VerificationPassport {
  userId: string;
  userName: string;
  avatar: string;
  rankTitle: string; // e.g. "Cadet Fact-Checker", "Lateral Reader", "Media Forensics Specialist", "Truth Sentinel"
  totalGamesPlayed: number;
  totalImpostersIdentified: number;
  unverifiableFlagsUsed: number;
  totalInvestigationTokensSpent: number;
  verificationPoints: number;
  skillVectors: SkillVectors;
  badges: VerificationBadge[];
  recentMatches: {
    date: string;
    gameMode: GameMode;
    score: number;
    imposterCaught: boolean;
    demographic: Demographic;
  }[];
}

export type SupportedLanguage = 'en' | 'es' | 'hi' | 'fr' | 'ar' | 'de' | 'ja';

export interface AccessibilitySettings {
  language: SupportedLanguage;
  highContrast: boolean;
  themeMode?: 'light' | 'dark';
  fontSize: 'normal' | 'large' | 'xl';
  ttsEnabled: boolean;
  ttsSpeed: number; // 0.75, 1, 1.25
  signLanguageEnabled: boolean;
  closedCaptionsEnabled: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  soundEffects: boolean;
}

export interface RoundResolution {
  roundNumber: number;
  actualImposterPlayerId: string;
  actualImposterCardId: string;
  votes: {
    voterId: string;
    votedTargetId: string;
    reason: string;
  }[];
  imposterIdentified: boolean;
  earnedPoints: number;
  debrief: {
    groundTruth: string;
    redFlags: string[];
    realWorldContext: string;
    siftTakeaway: string;
    milTheme?: MILTheme;
    milTakeaway?: {
      theme: MILTheme;
      title: string;
      intervention: string;
      milAlignment: string;
    };
  };
}

export interface GameSettings {
  demographic: Demographic;
  difficulty: 'novice' | 'investigator' | 'expert';
  roundCount: number;
  turnDurationSeconds: number;
  tokenAllowancePerRound: number;
  aiPlayerCount: number;
  milThemeTrack?: MILTheme | 'all';
}

export interface GameState {
  roomId: string;
  gameMode: GameMode;
  currentRoundNumber: number;
  totalRounds: number;
  roundCategory: RoundCategory;
  phase: GamePhase;
  players: PlayerState[];
  activeSpeakerIndex: number;
  phaseTimeRemaining: number;
  chatMessages: DialogueMessage[];
  unlockedCluesGlobal: string[];
  currentResolution?: RoundResolution;
  resolutionHistory: RoundResolution[];
  activeTheme?: MILTheme;
}



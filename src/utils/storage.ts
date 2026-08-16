import { AccessibilitySettings, GameSettings, VerificationBadge, VerificationPassport, GameMode, Demographic } from '../types/game';

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  language: 'en',
  highContrast: false,
  themeMode: 'light',
  fontSize: 'normal',
  ttsEnabled: true,
  ttsSpeed: 1.0,
  signLanguageEnabled: true,
  closedCaptionsEnabled: true,
  reducedMotion: false,
  screenReaderOptimized: false,
  soundEffects: true,
};

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  demographic: 'college',
  difficulty: 'investigator',
  roundCount: 4,
  turnDurationSeconds: 60,
  tokenAllowancePerRound: 5,
  aiPlayerCount: 3,
};

export const INITIAL_BADGES: VerificationBadge[] = [
  {
    id: 'sift_cadet',
    title: 'SIFT Method Cadet',
    description: 'Completed your first full 4-round Media & Information Literacy game.',
    icon: 'Compass',
    unlocked: false,
    category: 'general',
  },
  {
    id: 'lateral_reader',
    title: 'Master of Lateral Reading',
    description: 'Cross-checked sources and identified lookalike domain spoofs.',
    icon: 'Globe',
    unlocked: false,
    category: 'source',
  },
  {
    id: 'chart_dissector',
    title: 'Data & Axis Dissector',
    description: 'Spotted truncated Y-axes, cherry-picked baselines, and misleading percentages.',
    icon: 'BarChart2',
    unlocked: false,
    category: 'evidence',
  },
  {
    id: 'reverse_sleuth',
    title: 'Temporal Timeline Sleuth',
    description: 'Discovered recycled crisis media and mismatched geolocation landmarks.',
    icon: 'Clock',
    unlocked: false,
    category: 'context',
  },
  {
    id: 'deepfake_buster',
    title: 'Neural Artifact Hunter',
    description: 'Detected AI voice cloning spectral cutoffs and GAN anatomical glitches.',
    icon: 'ShieldCheck',
    unlocked: false,
    category: 'ai_manipulation',
  },
  {
    id: 'prudent_verifier',
    title: 'Prudent Sentinel',
    description: 'Correctly flagged inconclusive news with "Unverifiable Claim / Do Not Share".',
    icon: 'AlertCircle',
    unlocked: false,
    category: 'general',
  },
  // Global MIL Theme Badges
  {
    id: 'badge_ai_sentinel',
    title: 'AI & Deepfake Sentinel',
    description: 'Pioneered innovative solutions against generative AI synthetic deception & hallucinated media.',
    icon: 'Sparkles',
    unlocked: false,
    category: 'ai_and_mil',
  },
  {
    id: 'badge_mil_educator',
    title: 'MIL Pedagogy Champion',
    description: 'Mastered creative pedagogical frameworks (SIFT) to teach digital verification.',
    icon: 'Award',
    unlocked: false,
    category: 'mil_education',
  },
  {
    id: 'badge_community_shield',
    title: 'Community Civic Shield',
    description: 'Safeguarded public health and grassroots communities against viral crisis infodemics.',
    icon: 'ShieldAlert',
    unlocked: false,
    category: 'community_impact',
  },
  {
    id: 'badge_youth_ambassador',
    title: 'Youth Change Agent',
    description: 'Empowered peer-to-peer networks and viral social debunking campaigns as an MIL ambassador.',
    icon: 'Flame',
    unlocked: false,
    category: 'youth_engagement',
  },
  {
    id: 'badge_open_track_pioneer',
    title: 'Accessible Integrity Pioneer',
    description: 'Championed inclusive multi-sensory sign language verification and cross-border digital provenance.',
    icon: 'Zap',
    unlocked: false,
    category: 'open_track',
  },
];

const STORAGE_KEYS = {
  PASSPORT: 'info_imposter_passport_v2',
  ACCESSIBILITY: 'info_imposter_a11y_v2',
  GAME_SETTINGS: 'info_imposter_settings_v2',
};

export const StorageService = {
  getAccessibilitySettings(): AccessibilitySettings {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCESSIBILITY);
    if (!raw) return DEFAULT_ACCESSIBILITY_SETTINGS;
    try {
      return { ...DEFAULT_ACCESSIBILITY_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_ACCESSIBILITY_SETTINGS;
    }
  },

  saveAccessibilitySettings(settings: AccessibilitySettings) {
    localStorage.setItem(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(settings));
  },

  getGameSettings(): GameSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
    if (!raw) return DEFAULT_GAME_SETTINGS;
    try {
      return { ...DEFAULT_GAME_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_GAME_SETTINGS;
    }
  },

  saveGameSettings(settings: GameSettings) {
    localStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify(settings));
  },

  getPassport(): VerificationPassport {
    const raw = localStorage.getItem(STORAGE_KEYS.PASSPORT);
    const defaultPassport: VerificationPassport = {
      userId: 'user_' + Math.random().toString(36).substring(2, 9),
      userName: 'Investigator Alpha',
      avatar: '🕵️',
      rankTitle: 'Cadet Fact-Checker',
      totalGamesPlayed: 0,
      totalImpostersIdentified: 0,
      unverifiableFlagsUsed: 0,
      totalInvestigationTokensSpent: 0,
      verificationPoints: 120,
      skillVectors: {
        sourceVerification: 65,
        evidenceAssessment: 50,
        contextChecking: 70,
        crossReferencing: 55,
        aiManipulationDetection: 60,
      },
      badges: INITIAL_BADGES,
      recentMatches: [],
    };

    if (!raw) return defaultPassport;
    try {
      const parsed = JSON.parse(raw);
      return {
        ...defaultPassport,
        ...parsed,
        skillVectors: { ...defaultPassport.skillVectors, ...parsed.skillVectors },
        badges: INITIAL_BADGES.map(b => {
          const found = parsed.badges?.find((pb: VerificationBadge) => pb.id === b.id);
          return found ? { ...b, unlocked: found.unlocked, unlockedAt: found.unlockedAt } : b;
        }),
      };
    } catch {
      return defaultPassport;
    }
  },

  savePassport(passport: VerificationPassport) {
    localStorage.setItem(STORAGE_KEYS.PASSPORT, JSON.stringify(passport));
  },

  updatePassportAfterMatch(
    gameMode: GameMode,
    demographic: Demographic,
    earnedPoints: number,
    imposterCaught: boolean,
    tokensSpent: number,
    unverifiableFlagUsed: boolean,
    skillDeltas: {
      source?: number;
      evidence?: number;
      context?: number;
      crossCheck?: number;
      ai?: number;
    }
  ): { passport: VerificationPassport; newlyUnlockedBadges: VerificationBadge[] } {
    const passport = this.getPassport();
    passport.totalGamesPlayed += 1;
    passport.verificationPoints += earnedPoints;
    passport.totalInvestigationTokensSpent += tokensSpent;
    if (imposterCaught) passport.totalImpostersIdentified += 1;
    if (unverifiableFlagUsed) passport.unverifiableFlagsUsed += 1;

    // Apply skill deltas (clamped 0 to 100)
    const sv = passport.skillVectors;
    if (skillDeltas.source !== undefined) sv.sourceVerification = Math.min(100, Math.max(0, sv.sourceVerification + skillDeltas.source));
    if (skillDeltas.evidence !== undefined) sv.evidenceAssessment = Math.min(100, Math.max(0, sv.evidenceAssessment + skillDeltas.evidence));
    if (skillDeltas.context !== undefined) sv.contextChecking = Math.min(100, Math.max(0, sv.contextChecking + skillDeltas.context));
    if (skillDeltas.crossCheck !== undefined) sv.crossReferencing = Math.min(100, Math.max(0, sv.crossReferencing + skillDeltas.crossCheck));
    if (skillDeltas.ai !== undefined) sv.aiManipulationDetection = Math.min(100, Math.max(0, sv.aiManipulationDetection + skillDeltas.ai));

    // Update Rank
    const avgSkill = (sv.sourceVerification + sv.evidenceAssessment + sv.contextChecking + sv.crossReferencing + sv.aiManipulationDetection) / 5;
    if (avgSkill >= 88 && passport.verificationPoints >= 800) {
      passport.rankTitle = 'Truth Sentinel & Chief Verifier';
    } else if (avgSkill >= 75 && passport.verificationPoints >= 450) {
      passport.rankTitle = 'Media Forensics Specialist';
    } else if (avgSkill >= 60 && passport.verificationPoints >= 200) {
      passport.rankTitle = 'Lead Lateral Reader';
    } else {
      passport.rankTitle = 'Cadet Fact-Checker';
    }

    // Check Badges
    const newlyUnlocked: VerificationBadge[] = [];
    const nowIso = new Date().toISOString().split('T')[0];

    const unlockBadge = (id: string) => {
      const badge = passport.badges.find(b => b.id === id);
      if (badge && !badge.unlocked) {
        badge.unlocked = true;
        badge.unlockedAt = nowIso;
        newlyUnlocked.push(badge);
      }
    };

    if (passport.totalGamesPlayed >= 1) unlockBadge('sift_cadet');
    if (sv.sourceVerification >= 75) unlockBadge('lateral_reader');
    if (sv.evidenceAssessment >= 75) unlockBadge('chart_dissector');
    if (sv.contextChecking >= 75) unlockBadge('reverse_sleuth');
    if (sv.aiManipulationDetection >= 75) unlockBadge('deepfake_buster');
    if (passport.unverifiableFlagsUsed >= 1) unlockBadge('prudent_verifier');
    
    // Global MIL Verification Tracks Unlock Conditions
    if (sv.aiManipulationDetection >= 80) unlockBadge('badge_ai_sentinel');
    if (passport.totalGamesPlayed >= 2 && sv.sourceVerification >= 70) unlockBadge('badge_mil_educator');
    if (passport.totalImpostersIdentified >= 2) unlockBadge('badge_community_shield');
    if (passport.verificationPoints >= 250) unlockBadge('badge_youth_ambassador');
    if (passport.totalGamesPlayed >= 3) unlockBadge('badge_open_track_pioneer');

    // Add match to history
    passport.recentMatches.unshift({
      date: nowIso,
      gameMode,
      score: earnedPoints,
      imposterCaught,
      demographic,
    });
    if (passport.recentMatches.length > 8) {
      passport.recentMatches.pop();
    }

    this.savePassport(passport);
    return { passport, newlyUnlockedBadges: newlyUnlocked };
  },

  getSkillAnalysis(passport: VerificationPassport): {
    strongest: { name: string; value: number; key: string };
    weakest: { name: string; value: number; key: string };
  } {
    const list = [
      { name: 'Source Verification', value: passport.skillVectors.sourceVerification, key: 'source' },
      { name: 'Evidence Assessment', value: passport.skillVectors.evidenceAssessment, key: 'evidence' },
      { name: 'Context & Background', value: passport.skillVectors.contextChecking, key: 'context' },
      { name: 'Cross-Referencing', value: passport.skillVectors.crossReferencing, key: 'crossCheck' },
      { name: 'AI & Media Manipulation', value: passport.skillVectors.aiManipulationDetection, key: 'ai' },
    ];

    list.sort((a, b) => b.value - a.value);
    return {
      strongest: list[0],
      weakest: list[list.length - 1],
    };
  },
};

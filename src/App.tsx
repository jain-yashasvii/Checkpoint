import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Compass, 
  Coins, 
  Clock, 
  Users, 
  Bot, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Award,
  Hand,
  Share2,
  Trophy,
  X
} from 'lucide-react';
import { 
  GameState, 
  GamePhase, 
  GameMode, 
  Demographic, 
  PlayerState, 
  InformationCard, 
  InvestigationActionType, 
  RoundResolution, 
  DialogueMessage, 
  AccessibilitySettings, 
  GameSettings,
  VerificationPassport,
  MILTheme
} from './types/game';
import { SCENARIO_DATABASE, AI_PERSONAS } from './data/scenarios';
import { TRANSLATIONS } from './data/translations';
import { StorageService } from './utils/storage';
import { audioSystem } from './utils/audio';

// Components
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { SignLanguageAvatar, SignGesture } from './components/SignLanguageAvatar';
import { ClosedCaptions } from './components/ClosedCaptions';
import { LobbyView } from './components/LobbyView';
import { CardInspector } from './components/CardInspector';
import { InvestigationDossier } from './components/InvestigationDossier';
import { PresentationPhase } from './components/PresentationPhase';
import { CrossExaminationPhase } from './components/CrossExaminationPhase';
import { VotingPhase } from './components/VotingPhase';
import { RevealAndDebrief } from './components/RevealAndDebrief';
import { VerificationPassportModal } from './components/VerificationPassportModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SharePassportModal } from './components/SharePassportModal';
import { MILThemesHubModal } from './components/MILThemesHubModal';
import { WorldLeaderboardModal } from './components/WorldLeaderboardModal';

export default function App() {
  // Load user settings & passport from persistent storage
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(
    StorageService.getAccessibilitySettings()
  );
  const [gameSettings, setGameSettings] = useState<GameSettings>(
    StorageService.getGameSettings()
  );
  const [passport, setPassport] = useState<VerificationPassport>(
    StorageService.getPassport()
  );

  // Modal states
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showMILThemesModal, setShowMILThemesModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);

  // Active Sign gesture and live caption
  const [currentSignGesture, setCurrentSignGesture] = useState<SignGesture>('idle');
  const [liveCaption, setLiveCaption] = useState<{ speaker: string; text: string; avatar: string } | null>(null);

  // Game Engine State
  const [gameState, setGameState] = useState<GameState>(() => {
    // Generate initial solo room with local user + 3 AI bots
    const initialScenarios = SCENARIO_DATABASE.filter(s => s.targetDemographic === gameSettings.demographic);
    const round1Cards = initialScenarios.filter(s => s.roundCategory === 'source');
    const fallbackCards = SCENARIO_DATABASE.filter(s => s.roundCategory === 'source');
    const available = round1Cards.length >= 4 ? round1Cards : fallbackCards;

    const localCard = available[0] || SCENARIO_DATABASE[0];
    const bot1Card = available[1] || SCENARIO_DATABASE[1];
    const bot2Card = available[2] || SCENARIO_DATABASE[2];
    const bot3Card = available[3] || SCENARIO_DATABASE[3];

    const localUser: PlayerState = {
      id: 'player_local',
      name: passport.userName,
      avatar: passport.avatar || '🕵️',
      color: '#6366f1',
      isAI: false,
      isHost: true,
      isLocalUser: true,
      isImposter: false,
      assignedCard: localCard,
      tokens: gameSettings.tokenAllowancePerRound,
      unlockedClues: [],
      investigativeNotes: [],
      taggedSuspicion: 'medium',
      ready: true,
      hasPresented: false,
      votedTargetId: null,
      voteReason: '',
      score: 0,
      roundScore: 0,
    };

    const botPlayers: PlayerState[] = AI_PERSONAS.slice(0, 3).map((persona, i) => ({
      id: `bot_${persona.id}`,
      name: persona.name,
      avatar: persona.avatar,
      color: persona.color,
      isAI: true,
      isHost: false,
      isLocalUser: false,
      persona: persona,
      isImposter: false,
      assignedCard: [bot1Card, bot2Card, bot3Card][i],
      tokens: gameSettings.tokenAllowancePerRound,
      unlockedClues: ['check_source'],
      investigativeNotes: ['Domain verified on whois.'],
      taggedSuspicion: 'low',
      ready: true,
      hasPresented: false,
      votedTargetId: null,
      voteReason: '',
      score: 0,
      roundScore: 0,
    }));

    return {
      roomId: 'LOBBY1',
      gameMode: 'solo_ai',
      currentRoundNumber: 1,
      totalRounds: 4,
      roundCategory: 'source',
      phase: 'lobby',
      players: [localUser, ...botPlayers],
      activeSpeakerIndex: 0,
      phaseTimeRemaining: gameSettings.turnDurationSeconds,
      chatMessages: [],
      unlockedCluesGlobal: [],
      resolutionHistory: [],
    };
  });

  const t = TRANSLATIONS[accessibilitySettings.language] || TRANSLATIONS.en;
  const localPlayer = gameState.players.find(p => p.isLocalUser) || gameState.players[0];

  // Set document language and text direction (RTL for Arabic)
  useEffect(() => {
    document.documentElement.lang = accessibilitySettings.language;
    document.documentElement.dir = accessibilitySettings.language === 'ar' ? 'rtl' : 'ltr';
  }, [accessibilitySettings.language]);

  // Save settings when changed
  const handleUpdateAccessibility = (newSettings: AccessibilitySettings) => {
    setAccessibilitySettings(newSettings);
    StorageService.saveAccessibilitySettings(newSettings);
  };

  const handleUpdateGameSettings = (newSettings: GameSettings) => {
    setGameSettings(newSettings);
    StorageService.saveGameSettings(newSettings);
  };

  // Helper to trigger live caption + sign gesture + optional TTS
  const triggerDialogue = useCallback((
    speakerName: string,
    speakerAvatar: string,
    text: string,
    gesture: SignGesture = 'fact'
  ) => {
    setLiveCaption({ speaker: speakerName, text, avatar: speakerAvatar });
    setCurrentSignGesture(gesture);

    if (accessibilitySettings.ttsEnabled) {
      audioSystem.speak(
        `${speakerName} says: ${text}`,
        accessibilitySettings.language,
        accessibilitySettings.ttsSpeed
      );
    }
  }, [accessibilitySettings]);

  // Start new match
  const startMatch = useCallback(() => {
    // Determine category based on round 1 (Source)
    const categoryCards = SCENARIO_DATABASE.filter(
      s => s.roundCategory === 'source' && (s.targetDemographic === gameSettings.demographic || s.targetDemographic === 'college')
    );
    const pool = categoryCards.length >= 4 ? categoryCards : SCENARIO_DATABASE.filter(s => s.roundCategory === 'source');
    
    // Pick 1 imposter card and 3 authentic cards
    const imposterCards = pool.filter(c => c.isImposterClaim);
    const authenticCards = pool.filter(c => !c.isImposterClaim);

    const chosenImposterCard = imposterCards[Math.floor(Math.random() * imposterCards.length)] || pool[0];
    const chosenAuthentic = authenticCards.slice(0, 3);

    const matchCards = [chosenImposterCard, ...chosenAuthentic].sort(() => Math.random() - 0.5);

    // Randomly pick which player gets the imposter card
    const imposterPlayerIndex = Math.floor(Math.random() * gameState.players.length);

    const updatedPlayers = gameState.players.map((p, idx) => {
      const isImposter = idx === imposterPlayerIndex;
      const assigned = isImposter ? chosenImposterCard : (matchCards[idx] || chosenAuthentic[0]);
      return {
        ...p,
        isImposter: isImposter,
        assignedCard: assigned,
        tokens: gameSettings.tokenAllowancePerRound,
        unlockedClues: p.isLocalUser ? [] : (['check_source', 'verify_date'] as InvestigationActionType[]),
        investigativeNotes: [],
        taggedSuspicion: 'medium' as const,
        hasPresented: false,
        votedTargetId: null,
        voteReason: '',
      };
    });

    setGameState(prev => ({
      ...prev,
      phase: 'investigation',
      currentRoundNumber: 1,
      roundCategory: 'source',
      players: updatedPlayers,
      activeSpeakerIndex: 0,
      phaseTimeRemaining: gameSettings.turnDurationSeconds,
      chatMessages: [],
    }));

    triggerDialogue(
      'System Moderator',
      '⚖️',
      'Round 1: Source Verification has begun. Inspect your assigned case file and use your SIFT Investigation Tokens.',
      'verify'
    );
  }, [gameSettings, gameState.players, triggerDialogue]);

  // Start match focused on a specific Global MIL Theme
  const handleStartThemeMatch = useCallback((theme: MILTheme, demographic?: Demographic) => {
    setShowMILThemesModal(false);
    audioSystem.playSuccessChime();

    if (demographic) {
      setGameSettings(prev => ({ ...prev, demographic }));
    }

    const themeScenarios = SCENARIO_DATABASE.filter(s => s.milTheme === theme);
    const imposterCards = themeScenarios.filter(c => c.isImposterClaim);
    const authenticCards = themeScenarios.filter(c => !c.isImposterClaim);

    const chosenImposterCard = imposterCards[0] || SCENARIO_DATABASE.find(c => c.isImposterClaim) || SCENARIO_DATABASE[0];
    const fallbackAuthentic = SCENARIO_DATABASE.filter(c => !c.isImposterClaim && c.id !== chosenImposterCard.id);
    const authenticPool = authenticCards.length >= 3 
      ? authenticCards 
      : [...authenticCards, ...fallbackAuthentic];
    const chosenAuthentic = [...authenticPool].sort(() => Math.random() - 0.5).slice(0, 3);

    const imposterPlayerIndex = Math.floor(Math.random() * gameState.players.length);

    let authAssignIdx = 0;
    const updatedPlayers = gameState.players.map((p, idx) => {
      const isImposter = idx === imposterPlayerIndex;
      const assigned = isImposter ? chosenImposterCard : (chosenAuthentic[authAssignIdx++] || chosenAuthentic[0]);
      return {
        ...p,
        isImposter: isImposter,
        assignedCard: assigned,
        tokens: gameSettings.tokenAllowancePerRound,
        unlockedClues: p.isLocalUser ? [] : (['check_source', 'verify_date'] as InvestigationActionType[]),
        investigativeNotes: [],
        taggedSuspicion: 'medium' as const,
        hasPresented: false,
        votedTargetId: null,
        voteReason: '',
      };
    });

    const themeLabels: Record<MILTheme, string> = {
      ai_and_mil: 'AI & Generative Media Forensics',
      mil_education: 'MIL Education & Open Pedagogy',
      community_impact: 'Community & Crisis Integrity',
      youth_engagement: 'Youth Agency & Peer Defense',
      open_track: 'Open Track & Multi-Sensory Accessibility',
    };

    setGameState(prev => ({
      ...prev,
      phase: 'investigation',
      currentRoundNumber: 1,
      roundCategory: chosenImposterCard.roundCategory || 'source',
      activeTheme: theme,
      players: updatedPlayers,
      activeSpeakerIndex: 0,
      phaseTimeRemaining: gameSettings.turnDurationSeconds,
      chatMessages: [],
    }));

    triggerDialogue(
      'Global MIL Theme Track',
      '🌍',
      `Loaded specialized track: ${themeLabels[theme] || theme}. Case files calibrated to international MIL literacy benchmarks.`,
      'verify'
    );
  }, [gameSettings.tokenAllowancePerRound, gameSettings.turnDurationSeconds, gameState.players, triggerDialogue]);

  // Proceed to Next Phase
  const proceedToPresentation = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'presentation',
      activeSpeakerIndex: 0,
      phaseTimeRemaining: 60,
    }));
    const firstSpeaker = gameState.players[0];
    triggerDialogue(
      firstSpeaker.name,
      firstSpeaker.avatar,
      `Presentation phase begins. ${firstSpeaker.name} is now defending their source claim.`,
      'source'
    );
  }, [gameState.players, triggerDialogue]);

  // Countdown timer for Presentation Phase
  useEffect(() => {
    if (gameState.phase !== 'presentation') return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.phaseTimeRemaining <= 1) {
          // Advance to next speaker or next phase
          const nextIndex = prev.activeSpeakerIndex + 1;
          if (nextIndex < prev.players.length) {
            const nextSpeaker = prev.players[nextIndex];
            triggerDialogue(
              nextSpeaker.name,
              nextSpeaker.avatar,
              `${nextSpeaker.name} is now presenting their case defense.`,
              'source'
            );
            return {
              ...prev,
              activeSpeakerIndex: nextIndex,
              phaseTimeRemaining: 60,
            };
          } else {
            // All speakers done, go to cross-examination
            return {
              ...prev,
              phase: 'cross_examination',
              phaseTimeRemaining: 90,
            };
          }
        }
        if (prev.phaseTimeRemaining === 10) {
          audioSystem.playTimerTick();
        }
        return {
          ...prev,
          phaseTimeRemaining: prev.phaseTimeRemaining - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.phase, triggerDialogue]);

  // Spend investigation token
  const handleSpendToken = (action: InvestigationActionType) => {
    if (localPlayer.tokens <= 0) return;

    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.isLocalUser
          ? {
              ...p,
              tokens: p.tokens - 1,
              unlockedClues: [...p.unlockedClues, action],
            }
          : p
      ),
    }));

    const clue = localPlayer.assignedCard.investigationClues[action];
    triggerDialogue(
      'Case Dossier Forensics',
      '🔬',
      `Unlocked ${clue.title}: ${clue.revealedEvidenceText}`,
      action === 'check_source' ? 'source' : action === 'verify_date' ? 'verify' : 'evidence'
    );
  };

  // Update Notes
  const handleUpdateNotes = (notes: string[]) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.isLocalUser ? { ...p, investigativeNotes: notes } : p
      ),
    }));
  };

  // Update Suspicion
  const handleUpdateSuspicion = (rating: 'low' | 'medium' | 'high' | 'unverifiable') => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.isLocalUser ? { ...p, taggedSuspicion: rating } : p
      ),
    }));
  };

  // Defense Statement from Presentation
  const handleSendDefenseStatement = (statement: string) => {
    triggerDialogue(localPlayer.name, localPlayer.avatar, statement, 'fact');

    // Advance to next speaker
    const nextIndex = gameState.activeSpeakerIndex + 1;
    if (nextIndex < gameState.players.length) {
      setGameState(prev => ({
        ...prev,
        activeSpeakerIndex: nextIndex,
        phaseTimeRemaining: 60,
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        phase: 'cross_examination',
        phaseTimeRemaining: 90,
      }));
    }
  };

  // Cross-examination interrogation dialogue
  const handleSendMessage = ({
    text,
    targetPlayerId,
    signGestureKey = 'doubt',
  }: {
    text: string;
    targetPlayerId?: string;
    signGestureKey?: 'fact' | 'evidence' | 'verify' | 'doubt' | 'source' | 'deception';
  }) => {
    const newMsg: DialogueMessage = {
      id: 'msg_' + Date.now(),
      senderId: localPlayer.id,
      senderName: localPlayer.name,
      senderAvatar: localPlayer.avatar,
      senderColor: localPlayer.color,
      targetPlayerId,
      text,
      timestamp: Date.now(),
      type: 'question',
      signGestureKey,
    };

    setGameState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMsg],
    }));

    triggerDialogue(localPlayer.name, localPlayer.avatar, text, signGestureKey);

    // If targeted an AI bot, generate simulated bot response
    if (targetPlayerId) {
      const targetBot = gameState.players.find(p => p.id === targetPlayerId);
      if (targetBot && targetBot.isAI) {
        setTimeout(() => {
          let botReplyText = '';
          let botGesture: SignGesture = 'evidence';

          if (targetBot.isImposter) {
            // Imposter bot defends with persuasive diversion
            const excuses = [
              `The domain was newly configured because our investigative desk recently migrated to cloud hosting! Check our editorial team credentials.`,
              `Our wire source is an independent local affiliate; national syndication is currently reviewing the live report!`,
              `The timestamp discrepancy is just time-zone normalization from UTC servers. The forensic data is intact.`,
              `That visual artifact is standard WebP compression from our CDN, not synthetic generation!`,
            ];
            botReplyText = excuses[Math.floor(Math.random() * excuses.length)];
            botGesture = 'deception';
          } else {
            // Authentic bot defends with real SIFT facts
            botReplyText = `I lateral-checked the publisher domain on official state registries, and the author's academic bio is verified on Google Scholar.`;
            botGesture = 'fact';
          }

          const botMsg: DialogueMessage = {
            id: 'msg_bot_' + Date.now(),
            senderId: targetBot.id,
            senderName: targetBot.name,
            senderAvatar: targetBot.avatar,
            senderColor: targetBot.color,
            targetPlayerId: localPlayer.id,
            text: botReplyText,
            timestamp: Date.now(),
            type: 'defense',
            signGestureKey: botGesture,
          };

          setGameState(prev => ({
            ...prev,
            chatMessages: [...prev.chatMessages, botMsg],
          }));

          triggerDialogue(targetBot.name, targetBot.avatar, botReplyText, botGesture);
        }, 1000);
      }
    }
  };

  // Submit Vote
  const handleSubmitVote = (targetId: string, reason: string) => {
    // Generate AI bots votes
    const actualImposter = gameState.players.find(p => p.isImposter) || gameState.players[1];
    const votes: { voterId: string; votedTargetId: string; reason: string }[] = [
      { voterId: localPlayer.id, votedTargetId: targetId, reason },
    ];

    // Bots vote with simulated accuracy based on difficulty
    gameState.players.filter(p => p.isAI).forEach(bot => {
      const isSmartVote = Math.random() > 0.35;
      const botVotedTarget = isSmartVote
        ? actualImposter.id
        : gameState.players[Math.floor(Math.random() * gameState.players.length)].id;

      votes.push({
        voterId: bot.id,
        votedTargetId: botVotedTarget,
        reason: bot.isImposter ? 'Diverting suspicion away from self' : 'Cross-checked timeline inconsistencies',
      });
    });

    const isLocalUserCorrect = targetId === actualImposter.id;
    const isPrudentFlag = targetId === 'unverifiable_prudent';

    // Calculate Points
    let earnedPoints = 0;
    if (isLocalUserCorrect) earnedPoints += 100;
    if (isPrudentFlag) earnedPoints += 80;
    if (reason.length > 15) earnedPoints += 25; // Critical thinking bonus

    // Round resolution
    const roundResolution: RoundResolution = {
      roundNumber: gameState.currentRoundNumber,
      actualImposterPlayerId: actualImposter.id,
      actualImposterCardId: actualImposter.assignedCard.id,
      votes,
      imposterIdentified: isLocalUserCorrect || isPrudentFlag,
      earnedPoints,
      debrief: {
        groundTruth: actualImposter.assignedCard.trueExplanation || actualImposter.assignedCard.investigationClues.check_source.revealedEvidenceText,
        redFlags: [
          actualImposter.assignedCard.investigationClues.check_source.revealedEvidenceText,
          actualImposter.assignedCard.investigationClues.verify_date.revealedEvidenceText,
          actualImposter.assignedCard.investigationClues.analyze_ai_artifacts.revealedEvidenceText,
        ],
        realWorldContext: actualImposter.assignedCard.trueExplanation || `Disinformation campaigns often leverage high-arousal claims with slight domain spoofs to bypass surface evaluation.`,
        siftTakeaway: `Always apply SIFT: Stop before sharing, Investigate the publisher, Find trusted wire coverage, and Trace evidence to its original timestamp.`,
        milTheme: actualImposter.assignedCard.milTheme,
        milTakeaway: actualImposter.assignedCard.milTakeaway,
      },
    };

    // Update Verification Passport with skill deltas
    const { passport: updatedPassport } = StorageService.updatePassportAfterMatch(
      gameState.gameMode,
      gameSettings.demographic,
      earnedPoints,
      isLocalUserCorrect,
      gameSettings.tokenAllowancePerRound - localPlayer.tokens,
      isPrudentFlag,
      {
        source: isLocalUserCorrect ? 6 : -2,
        evidence: 5,
        context: 5,
        crossCheck: 4,
        ai: isLocalUserCorrect ? 7 : -1,
      }
    );
    setPassport(updatedPassport);

    setGameState(prev => ({
      ...prev,
      phase: 'reveal',
      currentResolution: roundResolution,
      resolutionHistory: [...prev.resolutionHistory, roundResolution],
    }));

    triggerDialogue(
      'Official MIL Debrief',
      '⚖️',
      `The Information Imposter was ${actualImposter.name}! Ground truth breakdown logged.`,
      'deception'
    );
  };

  // Next Round or Match Completion
  const handleNextRound = () => {
    if (gameState.currentRoundNumber < gameState.totalRounds) {
      const nextRoundNum = gameState.currentRoundNumber + 1;
      const categories: ('source' | 'evidence' | 'context' | 'ai_manipulation')[] = [
        'source',
        'evidence',
        'context',
        'ai_manipulation',
      ];
      const nextCategory = categories[nextRoundNum - 1] || 'ai_manipulation';

      // Pick scenario cards for next category, favoring active MIL theme if present
      const themeScenarios = gameState.activeTheme ? SCENARIO_DATABASE.filter(s => s.milTheme === gameState.activeTheme) : [];
      const themeCategoryScenarios = themeScenarios.filter(s => s.roundCategory === nextCategory);
      
      const pool = themeCategoryScenarios.length > 0 ? themeCategoryScenarios : SCENARIO_DATABASE.filter(s => s.roundCategory === nextCategory);
      const imposterCards = pool.filter(c => c.isImposterClaim);
      const chosenImposter = imposterCards[0] || pool.find(c => c.isImposterClaim) || SCENARIO_DATABASE[0];

      const fallbackAuthentic = SCENARIO_DATABASE.filter(c => !c.isImposterClaim && c.id !== chosenImposter.id);
      const authenticPool = pool.filter(c => !c.isImposterClaim).length >= 3 
        ? pool.filter(c => !c.isImposterClaim) 
        : [...pool.filter(c => !c.isImposterClaim), ...fallbackAuthentic];
      const chosenAuthentic = [...authenticPool].sort(() => Math.random() - 0.5).slice(0, 3);

      const imposterIndex = Math.floor(Math.random() * gameState.players.length);

      let authIdx = 0;
      const updatedPlayers = gameState.players.map((p, idx) => {
        const isImp = idx === imposterIndex;
        return {
          ...p,
          isImposter: isImp,
          assignedCard: isImp ? chosenImposter : (chosenAuthentic[authIdx++] || chosenAuthentic[0]),
          tokens: gameSettings.tokenAllowancePerRound,
          unlockedClues: p.isLocalUser ? [] : (['check_source'] as InvestigationActionType[]),
          investigativeNotes: [],
          taggedSuspicion: 'medium' as const,
          hasPresented: false,
          votedTargetId: null,
          voteReason: '',
        };
      });

      setGameState(prev => ({
        ...prev,
        phase: 'investigation',
        currentRoundNumber: nextRoundNum,
        roundCategory: nextCategory,
        players: updatedPlayers,
        currentResolution: undefined,
        activeSpeakerIndex: 0,
        phaseTimeRemaining: gameSettings.turnDurationSeconds,
        chatMessages: [],
      }));

      triggerDialogue(
        'System Moderator',
        '⚖️',
        `Starting Round ${nextRoundNum}: ${nextCategory.replace('_', ' ').toUpperCase()} Verification.`,
        'verify'
      );
    } else {
      // Completed all 4 rounds! Open Passport
      setShowPassportModal(true);
    }
  };

  // Reset / Return to Lobby
  const handleReturnToLobby = () => {
    audioSystem.playClick();
    setGameState(prev => ({
      ...prev,
      phase: 'lobby',
      currentRoundNumber: 1,
      roundCategory: 'source',
      currentResolution: undefined,
    }));
  };

  // Save profile from onboarding modal
  const handleSaveProfile = (profile: {
    name: string;
    demographic: Demographic;
    difficulty: 'novice' | 'investigator' | 'expert';
  }) => {
    const updatedPassport: VerificationPassport = {
      ...passport,
      userName: profile.name,
    };
    StorageService.savePassport(updatedPassport);
    setPassport(updatedPassport);

    const tokenAllowance = profile.difficulty === 'novice' ? 7 : profile.difficulty === 'expert' ? 3 : 5;
    const turnDuration = profile.difficulty === 'novice' ? 90 : profile.difficulty === 'expert' ? 40 : 60;

    const updatedSettings: GameSettings = {
      ...gameSettings,
      demographic: profile.demographic,
      difficulty: profile.difficulty,
      tokenAllowancePerRound: tokenAllowance,
      turnDurationSeconds: turnDuration,
    };
    StorageService.saveGameSettings(updatedSettings);
    setGameSettings(updatedSettings);

    // Update local player and active tokens in state
    setGameState(prev => ({
      ...prev,
      phaseTimeRemaining: prev.phase === 'investigation' ? turnDuration : prev.phaseTimeRemaining,
      players: prev.players.map(p => ({
        ...p,
        name: p.isLocalUser ? profile.name : p.name,
        tokens: tokenAllowance,
      })),
    }));
  };

  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;
  const fontSizeClass =
    accessibilitySettings.fontSize === 'xl'
      ? 'text-lg'
      : accessibilitySettings.fontSize === 'large'
      ? 'text-base'
      : 'text-sm';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${fontSizeClass} ${
        isHighContrast
          ? 'bg-black text-yellow-300 font-bold selection:bg-yellow-400 selection:text-black'
          : isLight
          ? 'bg-slate-50 text-slate-800 selection:bg-indigo-500 selection:text-white'
          : 'bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white'
      }`}
    >
      {/* Background Subtle Gradient Mesh */}
      {!isHighContrast && (
        <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
          <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${
            isLight ? 'bg-amber-200/40' : 'bg-indigo-600/20'
          }`} />
          <div className={`absolute bottom-10 right-1/4 w-96 h-96 rounded-full blur-3xl ${
            isLight ? 'bg-rose-200/30' : 'bg-purple-600/20'
          }`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl ${
            isLight ? 'bg-sky-200/30' : 'bg-cyan-600/10'
          }`} />
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation & Status Header */}
        <header
          className={`sticky top-0 z-30 px-4 sm:px-8 py-3 border-b backdrop-blur-xl transition-all ${
            isHighContrast
              ? 'bg-black border-yellow-400 text-yellow-300'
              : isLight
              ? 'bg-white/90 border-amber-900/10 text-slate-800 shadow-xs'
              : 'bg-slate-900/80 border-slate-800 text-slate-200'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Brand Logo & Round Indicator */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReturnToLobby}
                className={`flex items-center gap-2 font-black text-base sm:text-lg tracking-tight transition ${
                  isLight ? 'text-slate-900 hover:text-indigo-600 font-display' : 'text-white hover:text-cyan-300'
                }`}
              >
                <div className="p-1.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-amber-500 text-white shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="hidden sm:inline">{t.gameTitle}</span>
              </button>

              {gameState.phase !== 'lobby' && (
                <div className={`flex items-center gap-2 pl-3 border-l ${
                  isLight ? 'border-slate-200' : 'border-slate-700'
                }`}>
                  <span className={`text-xs font-mono font-black uppercase px-3 py-1 rounded-full border ${
                    isLight
                      ? 'bg-amber-50 text-amber-900 border-amber-200 shadow-2xs'
                      : 'bg-indigo-500/20 text-cyan-300 border-indigo-500/30'
                  }`}>
                    Round {gameState.currentRoundNumber}/4: {gameState.roundCategory.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Token Counter if in investigation */}
              {gameState.phase === 'investigation' && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-mono font-black shadow-2xs ${
                  isLight
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}>
                  <Coins className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span>{localPlayer.tokens} Tokens</span>
                </div>
              )}

              {/* Global MIL Themes Shortcut */}
              <button
                type="button"
                onClick={() => {
                  audioSystem.playClick();
                  setShowMILThemesModal(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition shadow-2xs border ${
                  isLight
                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200'
                    : 'bg-indigo-950/80 hover:bg-indigo-900/80 text-cyan-300 border-indigo-500/40'
                }`}
                title={t.globalMilThemes}
                aria-label={t.globalMilThemes}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden xl:inline">{t.globalMilThemes}</span>
              </button>

              {/* World Leaderboard Shortcut */}
              <button
                type="button"
                onClick={() => {
                  audioSystem.playClick();
                  setShowLeaderboardModal(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition shadow-2xs border ${
                  isLight
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 hover:border-amber-300'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                }`}
                title={t.worldLeaderboard}
                aria-label={t.worldLeaderboard}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">{t.worldLeaderboard}</span>
              </button>

              {/* Passport Shortcut */}
              <button
                type="button"
                onClick={() => {
                  audioSystem.playClick();
                  setShowPassportModal(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition shadow-2xs border ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                    : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
                }`}
                title={t.viewPassport}
                aria-label={t.viewPassport}
              >
                <Compass className="w-4 h-4 text-indigo-500" />
                <span className="hidden md:inline">{t.viewPassport}</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isLight ? 'bg-amber-100 text-amber-900' : 'bg-black/20 text-amber-300'
                }`}>
                  {passport.verificationPoints} {t.pts}
                </span>
              </button>

              {/* Share Passport Button */}
              <button
                type="button"
                onClick={() => {
                  audioSystem.playSuccessChime();
                  setShowShareModal(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition shadow-2xs border ${
                  isLight
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                    : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-cyan-300 border-indigo-500/40'
                }`}
                title={t.sharePassport}
                aria-label={t.sharePassport}
              >
                <Share2 className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden lg:inline">{t.sharePassport}</span>
              </button>

              {/* Quick Sign Language One-Click Toggle */}
              <button
                onClick={() => {
                  audioSystem.playClick();
                  handleUpdateAccessibility({
                    ...accessibilitySettings,
                    signLanguageEnabled: !accessibilitySettings.signLanguageEnabled,
                  });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black transition shadow-2xs border ${
                  accessibilitySettings.signLanguageEnabled
                    ? isHighContrast
                      ? 'bg-yellow-400 text-black border-yellow-300 ring-2 ring-yellow-400'
                      : isLight
                      ? 'bg-rose-50 text-rose-900 border-rose-300 ring-1 ring-rose-400'
                      : 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white border-pink-400/80 shadow-pink-950/40 ring-1 ring-pink-400/50'
                    : isHighContrast
                    ? 'bg-black text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                    : isLight
                    ? 'bg-white text-slate-700 hover:text-rose-600 border-slate-200 hover:border-rose-300'
                    : 'bg-slate-800/90 text-slate-300 hover:text-pink-300 border-slate-700 hover:border-pink-500/50'
                }`}
                title={
                  accessibilitySettings.signLanguageEnabled
                    ? 'Sign Language Interpreter is ON (Click to toggle off or drag anywhere)'
                    : 'Turn ON Sign Language Interpreter (ISL/ASL)'
                }
                aria-label="Toggle Sign Language Interpreter"
                aria-pressed={accessibilitySettings.signLanguageEnabled}
              >
                <Hand className={`w-3.5 h-3.5 ${accessibilitySettings.signLanguageEnabled ? 'text-rose-600 animate-pulse' : 'text-rose-400'}`} />
                <span className="hidden sm:inline">{t.signLanguage}</span>
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                    accessibilitySettings.signLanguageEnabled
                      ? isLight ? 'bg-rose-200/80 text-rose-950' : 'bg-black/30 text-white'
                      : isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-700/60 text-slate-400'
                  }`}
                >
                  {accessibilitySettings.signLanguageEnabled ? t.on : t.off}
                </span>
              </button>

              {/* Universal Accessibility Toolbar */}
              <AccessibilityToolbar
                settings={accessibilitySettings}
                onUpdateSettings={handleUpdateAccessibility}
              />
            </div>
          </div>
        </header>

        {/* Dynamic Game View Router */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
          {/* LOBBY VIEW */}
          {gameState.phase === 'lobby' && (
            <LobbyView
              gameMode={gameState.gameMode}
              onSetGameMode={mode => setGameState(prev => ({ ...prev, gameMode: mode }))}
              roomCode={gameState.roomId}
              onGenerateRoomCode={() => {
                const code = Math.random().toString(36).substring(2, 8).toUpperCase();
                setGameState(prev => ({ ...prev, roomId: code }));
              }}
              players={gameState.players}
              localPlayer={localPlayer}
              gameSettings={gameSettings}
              accessibilitySettings={accessibilitySettings}
              onUpdateGameSettings={handleUpdateGameSettings}
              onToggleReady={() => {
                setGameState(prev => ({
                  ...prev,
                  players: prev.players.map(p =>
                    p.isLocalUser ? { ...p, ready: !p.ready } : p
                  ),
                }));
              }}
              onStartMatch={startMatch}
              onOpenOnboarding={() => setShowOnboardingModal(true)}
              onOpenPassport={() => setShowPassportModal(true)}
              onOpenMILHub={() => setShowMILThemesModal(true)}
              onOpenLeaderboard={() => setShowLeaderboardModal(true)}
            />
          )}

          {/* INVESTIGATION PHASE */}
          {gameState.phase === 'investigation' && (
            <div className="space-y-6">
              {/* Secret Role Pill Reminder */}
              <div className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl border ${
                isLight
                  ? 'bg-white border-amber-900/10 game-card-shadow'
                  : 'bg-slate-900/70 border-slate-800'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-2xl border ${
                    localPlayer.isImposter
                      ? isLight
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : isLight
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  }`}>
                    {localPlayer.isImposter ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className={`text-xs font-black uppercase tracking-wider ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {t.secretRole}
                    </div>
                    <div className={`text-sm font-black ${
                      localPlayer.isImposter
                        ? isLight ? 'text-rose-600' : 'text-rose-400'
                        : isLight ? 'text-emerald-700' : 'text-emerald-400'
                    }`}>
                      {localPlayer.isImposter ? t.imposterRole : t.verifierRole}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      audioSystem.playClick();
                      handleReturnToLobby();
                    }}
                    className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border transition transform active:scale-98 ${
                      isHighContrast
                        ? 'bg-black text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                        : isLight
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200 shadow-xs'
                        : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-500/30'
                    }`}
                    title={t.exitCase}
                    aria-label={t.exitCase}
                  >
                    <X className="w-4 h-4 text-rose-500" />
                    <span>{t.exitCase}</span>
                  </button>

                  <button
                    onClick={() => {
                      audioSystem.playSuccessChime();
                      proceedToPresentation();
                    }}
                    className={`flex items-center gap-2 px-6 sm:px-7 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition transform active:scale-98 ${
                      isHighContrast
                        ? 'bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-black'
                        : isLight
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
                        : 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-600 hover:to-cyan-600'
                    }`}
                  >
                    <span>Finish Investigation & Present Case</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2-Column Layout: Card Inspector & Investigation Dossier */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CardInspector
                  card={localPlayer.assignedCard}
                  accessibilitySettings={accessibilitySettings}
                  isSecretRoleRevealed={localPlayer.isImposter}
                  onClose={handleReturnToLobby}
                />

                <InvestigationDossier
                  card={localPlayer.assignedCard}
                  tokens={localPlayer.tokens}
                  unlockedClues={localPlayer.unlockedClues}
                  investigativeNotes={localPlayer.investigativeNotes}
                  taggedSuspicion={localPlayer.taggedSuspicion}
                  accessibilitySettings={accessibilitySettings}
                  onSpendToken={handleSpendToken}
                  onUpdateNotes={handleUpdateNotes}
                  onUpdateSuspicion={handleUpdateSuspicion}
                />
              </div>
            </div>
          )}

          {/* PRESENTATION PHASE */}
          {gameState.phase === 'presentation' && (
            <PresentationPhase
              currentSpeaker={gameState.players[gameState.activeSpeakerIndex] || localPlayer}
              players={gameState.players}
              timeRemaining={gameState.phaseTimeRemaining}
              accessibilitySettings={accessibilitySettings}
              onSendDefenseStatement={handleSendDefenseStatement}
              onNextSpeaker={() => {
                const next = gameState.activeSpeakerIndex + 1;
                if (next < gameState.players.length) {
                  setGameState(prev => ({ ...prev, activeSpeakerIndex: next, phaseTimeRemaining: 60 }));
                } else {
                  setGameState(prev => ({ ...prev, phase: 'cross_examination', phaseTimeRemaining: 90 }));
                }
              }}
            />
          )}

          {/* CROSS-EXAMINATION PHASE */}
          {gameState.phase === 'cross_examination' && (
            <CrossExaminationPhase
              players={gameState.players}
              localPlayer={localPlayer}
              messages={gameState.chatMessages}
              accessibilitySettings={accessibilitySettings}
              onSendMessage={handleSendMessage}
              onProceedToVoting={() => {
                setGameState(prev => ({ ...prev, phase: 'voting' }));
              }}
            />
          )}

          {/* VOTING PHASE */}
          {gameState.phase === 'voting' && (
            <VotingPhase
              players={gameState.players}
              localPlayer={localPlayer}
              accessibilitySettings={accessibilitySettings}
              onSubmitVote={handleSubmitVote}
            />
          )}

          {/* REVEAL & DEBRIEF PHASE */}
          {gameState.phase === 'reveal' && gameState.currentResolution && (
            <RevealAndDebrief
              resolution={gameState.currentResolution}
              players={gameState.players}
              currentRoundNumber={gameState.currentRoundNumber}
              totalRounds={gameState.totalRounds}
              roundCategory={gameState.roundCategory}
              accessibilitySettings={accessibilitySettings}
              onNextRound={handleNextRound}
              onViewPassport={() => setShowPassportModal(true)}
              onSharePassport={() => setShowShareModal(true)}
            />
          )}
        </main>

        {/* Global Deaf / Hard-of-Hearing Overlay: Sign Language Avatar (Draggable anywhere on screen) */}
        {accessibilitySettings.signLanguageEnabled && (
          <SignLanguageAvatar
            currentGesture={currentSignGesture}
            currentCaption={liveCaption?.text}
            speakerName={liveCaption?.speaker || 'Interpreter'}
            isHighContrast={isHighContrast}
            onClose={() =>
              handleUpdateAccessibility({
                ...accessibilitySettings,
                signLanguageEnabled: false,
              })
            }
          />
        )}

        {/* Global Live Closed Captions (Draggable on screen) */}
        {accessibilitySettings.closedCaptionsEnabled && liveCaption && (
          <ClosedCaptions
            speakerName={liveCaption.speaker}
            speakerAvatar={liveCaption.avatar}
            text={liveCaption.text}
            isHighContrast={isHighContrast}
            phaseLabel={gameState.phase.replace('_', ' ')}
            onClose={() => setLiveCaption(null)}
          />
        )}

        {/* Verification Passport Modal */}
        {showPassportModal && (
          <VerificationPassportModal
            passport={passport}
            accessibilitySettings={accessibilitySettings}
            onClose={() => setShowPassportModal(false)}
          />
        )}

        {/* Share My Passport Social Media Modal */}
        {showShareModal && (
          <SharePassportModal
            passport={passport}
            accessibilitySettings={accessibilitySettings}
            onClose={() => setShowShareModal(false)}
          />
        )}

        {/* Onboarding & Demographic Profile Modal */}
        {showOnboardingModal && (
          <OnboardingModal
            currentDemographic={gameSettings.demographic}
            difficulty={gameSettings.difficulty}
            playerName={passport.userName}
            settings={accessibilitySettings}
            onSaveProfile={handleSaveProfile}
            onClose={() => setShowOnboardingModal(false)}
          />
        )}

        {/* Global MIL Themes Hub & Curriculum Modal */}
        {showMILThemesModal && (
          <MILThemesHubModal
            accessibilitySettings={accessibilitySettings}
            onClose={() => setShowMILThemesModal(false)}
            onSelectThemeTrack={(theme) => handleStartThemeMatch(theme)}
            onSelectTheme={(theme) => handleStartThemeMatch(theme)}
            onStartCustomMatchWithTheme={(theme, demo) => handleStartThemeMatch(theme, demo)}
          />
        )}

        {/* World Leaderboard Modal */}
        {showLeaderboardModal && (
          <WorldLeaderboardModal
            passport={passport}
            accessibilitySettings={accessibilitySettings}
            onClose={() => setShowLeaderboardModal(false)}
          />
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Briefcase, 
  HeartHandshake, 
  ArrowRight, 
  Check, 
  HelpCircle,
  Award,
  X,
  Coins,
  Clock,
  Gauge,
  Zap,
  Brain,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { Demographic, SupportedLanguage, AccessibilitySettings } from '../types/game';
import { TRANSLATIONS } from '../data/translations';
import { audioSystem } from '../utils/audio';

interface OnboardingModalProps {
  currentDemographic: Demographic;
  difficulty: 'novice' | 'investigator' | 'expert';
  playerName: string;
  settings: AccessibilitySettings;
  onSaveProfile: (profile: {
    name: string;
    demographic: Demographic;
    difficulty: 'novice' | 'investigator' | 'expert';
  }) => void;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  currentDemographic,
  difficulty,
  playerName,
  settings,
  onSaveProfile,
  onClose,
}) => {
  const [name, setName] = useState(playerName || 'Investigator Alex');
  const [selectedDemo, setSelectedDemo] = useState<Demographic>(currentDemographic);
  const [selectedDiff, setSelectedDiff] = useState<'novice' | 'investigator' | 'expert'>(difficulty);
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.en;

  const isLight = settings.themeMode !== 'dark' && !settings.highContrast;

  const DEMOGRAPHICS: { id: Demographic; title: string; desc: string; icon: React.ReactNode; color: string; lightBg: string }[] = [
    {
      id: 'teen',
      title: t.demographicTeen,
      desc: t.demographicTeenDesc,
      icon: <Sparkles className="w-5 h-5" />,
      color: 'from-pink-500/20 to-purple-500/20 border-pink-500/40 text-pink-300',
      lightBg: 'bg-pink-50/70 border-pink-300 text-pink-900 ring-pink-400',
    },
    {
      id: 'college',
      title: t.demographicCollege,
      desc: t.demographicCollegeDesc,
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-cyan-300',
      lightBg: 'bg-sky-50/70 border-sky-300 text-sky-900 ring-sky-400',
    },
    {
      id: 'professional',
      title: t.demographicPro,
      desc: t.demographicProDesc,
      icon: <Briefcase className="w-5 h-5" />,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300',
      lightBg: 'bg-amber-50/70 border-amber-300 text-amber-900 ring-amber-400',
    },
    {
      id: 'senior',
      title: t.demographicSenior,
      desc: t.demographicSeniorDesc,
      icon: <HeartHandshake className="w-5 h-5" />,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
      lightBg: 'bg-emerald-50/70 border-emerald-300 text-emerald-900 ring-emerald-400',
    },
  ];

  // Difficulty configurations with granular token, timer, and challenge metrics
  const DIFFICULTY_SPECS: Record<'novice' | 'investigator' | 'expert', {
    label: string;
    shortTitle: string;
    subtitle: string;
    tokens: number;
    maxTokens: number;
    tokenPercent: number;
    timeSeconds: number;
    maxTimeSeconds: number;
    timePercent: number;
    presentationSeconds: number;
    stealthPercent: number;
    rigorPercent: number;
    badgeStyle: string;
    tokenNote: string;
    timeNote: string;
    synopsis: string;
  }> = {
    novice: {
      label: 'Novice (Cadet)',
      shortTitle: 'Cadet Mode',
      subtitle: 'Generous Tokens & Extended Time',
      tokens: 7,
      maxTokens: 8,
      tokenPercent: 87.5,
      timeSeconds: 90,
      maxTimeSeconds: 90,
      timePercent: 100,
      presentationSeconds: 75,
      stealthPercent: 30,
      rigorPercent: 25,
      badgeStyle: isLight 
        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      tokenNote: 'Ample budget (7 tokens) to unlock 3–4 forensic clues per card.',
      timeNote: 'Extended 90s clock to thoroughly read articles and verify sources.',
      synopsis: 'Perfect for building core lateral reading habits. Imposter claims contain explicit forensic indicators (domain typos, exaggerated dates, visual clues).'
    },
    investigator: {
      label: 'Investigator',
      shortTitle: 'Standard Mode',
      subtitle: 'Tactical Balance & Peer Scrutiny',
      tokens: 5,
      maxTokens: 8,
      tokenPercent: 62.5,
      timeSeconds: 60,
      maxTimeSeconds: 90,
      timePercent: 66.7,
      presentationSeconds: 60,
      stealthPercent: 65,
      rigorPercent: 65,
      badgeStyle: isLight 
        ? 'bg-amber-50 text-amber-900 border-amber-300' 
        : 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      tokenNote: 'Balanced 5 tokens: requires prioritizing 2 key investigative actions.',
      timeNote: 'Standard 60s timer enforcing quick lateral reading and decision-making.',
      synopsis: 'Balanced competitive experience. Imposter claims feature lookalike domain spoofing, cherry-picked data axes, and recycled contextual media.'
    },
    expert: {
      label: 'Truth Sentinel (Expert)',
      shortTitle: 'Expert Mode',
      subtitle: 'Token Scarcity & High-Speed Triage',
      tokens: 3,
      maxTokens: 8,
      tokenPercent: 37.5,
      timeSeconds: 40,
      maxTimeSeconds: 90,
      timePercent: 44.4,
      presentationSeconds: 45,
      stealthPercent: 95,
      rigorPercent: 95,
      badgeStyle: isLight 
        ? 'bg-rose-50 text-rose-900 border-rose-300' 
        : 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      tokenNote: 'Scarcity mode (3 tokens): must rely on instinct and 1 strategic clue.',
      timeNote: 'High pressure 40s clock for rapid forensic cross-examination.',
      synopsis: 'Ultimate disinformation trial. High-fidelity synthetic deepfakes, subtle framing distortions, and sharp AI peer interrogation.'
    }
  };

  const activeSpec = DIFFICULTY_SPECS[selectedDiff];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioSystem.playSuccessChime();
    onSaveProfile({
      name: name.trim() || 'Truth Verifier',
      demographic: selectedDemo,
      difficulty: selectedDiff,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
    >
      <div
        className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 border transition-all my-8 ${
          settings.highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : isLight
            ? 'bg-white text-slate-800 border-amber-900/10 game-card-shadow'
            : 'bg-slate-900 text-slate-100 border-indigo-500/40 shadow-2xl'
        }`}
      >
        <div className={`flex items-center justify-between gap-3 mb-6 pb-4 border-b ${
          isLight ? 'border-slate-100' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              isLight ? 'bg-amber-100 border-amber-200 text-amber-800' : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
            }`}>
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 id="onboarding-heading" className={`text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 ${
                isLight ? 'text-slate-900 font-display' : 'text-white'
              }`}>
                <span>Detective Profile Calibration</span>
                <span className={`text-xs font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  isLight ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-indigo-500/20 text-cyan-300 border-indigo-500/30'
                }`}>
                  MIL Setup
                </span>
              </h2>
              <p className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Personalize your disinformation case file themes and calibration level.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl border transition ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alias / Name Input */}
          <div>
            <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${
              isLight ? 'text-slate-800' : 'text-slate-300'
            }`}>
              {t.playerName}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Inspector Alex"
              className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold focus:outline-none focus:ring-2 ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-amber-500'
                  : 'bg-slate-800/80 border-slate-700 text-white focus:ring-indigo-500'
              }`}
            />
          </div>

          {/* Demographic Selection */}
          <div>
            <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${
              isLight ? 'text-slate-800' : 'text-slate-300'
            }`}>
              {t.selectDemographic}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMOGRAPHICS.map(demo => {
                const isSelected = selectedDemo === demo.id;
                return (
                  <button
                    type="button"
                    key={demo.id}
                    onClick={() => {
                      setSelectedDemo(demo.id);
                      audioSystem.playClick();
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? settings.highContrast
                          ? 'bg-yellow-400 text-black border-yellow-300 font-black'
                          : isLight
                          ? `${demo.lightBg} ring-2 shadow-xs font-black`
                          : `bg-gradient-to-br ${demo.color} ring-2 ring-indigo-400`
                        : isLight
                        ? 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-700'
                        : 'bg-slate-800/40 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 font-black text-sm">
                        {demo.icon}
                        <span>{demo.title}</span>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className={`text-xs leading-snug font-medium ${isLight ? 'text-slate-600' : 'opacity-80'}`}>
                      {demo.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Adaptive Difficulty Calibration */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-xs font-black uppercase tracking-wider ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}>
                  {t.difficulty}
                </label>
                <span className={`text-[10px] font-mono font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Select level to calibrate engine
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'novice', label: 'Novice (Cadet)', desc: 'Clear forensic indicators & ample hints' },
                  { id: 'investigator', label: 'Investigator', desc: 'Subtle clues & realistic forensic metadata' },
                  { id: 'expert', label: 'Truth Sentinel (Expert)', desc: 'Deceptive deepfakes & sharp bot debates' },
                ].map(diff => {
                  const isSelected = selectedDiff === diff.id;
                  return (
                    <button
                      type="button"
                      key={diff.id}
                      onClick={() => {
                        setSelectedDiff(diff.id as 'novice' | 'investigator' | 'expert');
                        audioSystem.playClick();
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition ${
                        isSelected
                          ? settings.highContrast
                            ? 'bg-yellow-400 text-black border-yellow-300 font-black'
                            : isLight
                            ? 'bg-amber-100 border-amber-300 text-amber-950 font-black ring-2 ring-amber-400/40 shadow-xs'
                            : 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                          : isLight
                          ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs font-black">{diff.label}</div>
                      <div className={`text-[10px] mt-0.5 line-clamp-2 font-medium ${
                        isLight ? 'text-slate-500' : 'opacity-75'
                      }`}>
                        {diff.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Difficulty Meter & Impact Analysis */}
            <div className={`p-4 sm:p-5 rounded-3xl border space-y-4 transition-all ${
              settings.highContrast
                ? 'bg-black border-yellow-400 text-yellow-300'
                : isLight
                ? 'bg-amber-50/60 border-amber-900/10 game-card-shadow'
                : 'bg-slate-950/70 border-slate-800'
            }`}>
              {/* Meter Header with Live Mode Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-inherit">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-xl border ${
                    isLight ? 'bg-amber-100 border-amber-200 text-amber-900' : 'bg-indigo-500/20 text-cyan-400 border-indigo-500/30'
                  }`}>
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-black uppercase tracking-wider ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      Visual Difficulty Impact Meter
                    </h4>
                    <p className={`text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Dynamic game engine tuning for {activeSpec.label}
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-mono font-black uppercase px-2.5 py-1 rounded-full border shadow-2xs ${activeSpec.badgeStyle}`}>
                  {activeSpec.shortTitle}: {activeSpec.tokens} Tokens • {activeSpec.timeSeconds}s
                </span>
              </div>

              {/* Main Tailwind Bar Graphs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bar 1: Token Allowance */}
                <div className={`p-3.5 rounded-2xl border space-y-2 ${
                  isLight ? 'bg-white border-amber-900/10' : 'bg-slate-900/90 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-black">
                      <Coins className={`w-3.5 h-3.5 ${
                        selectedDiff === 'novice' 
                          ? 'text-emerald-500' 
                          : selectedDiff === 'investigator' 
                          ? 'text-amber-500' 
                          : 'text-rose-500'
                      }`} />
                      <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>Token Allowance</span>
                    </div>
                    <span className={`font-mono font-black text-xs px-2 py-0.5 rounded-md ${
                      selectedDiff === 'novice'
                        ? isLight ? 'bg-emerald-50 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
                        : selectedDiff === 'investigator'
                        ? isLight ? 'bg-amber-50 text-amber-900' : 'bg-amber-500/20 text-amber-300'
                        : isLight ? 'bg-rose-50 text-rose-900' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {activeSpec.tokens} / 8 Tokens
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="space-y-1">
                    <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${
                      isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
                    }`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out shadow-xs ${
                          selectedDiff === 'novice'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : selectedDiff === 'investigator'
                            ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                            : 'bg-gradient-to-r from-rose-500 to-red-400'
                        }`}
                        style={{ width: `${activeSpec.tokenPercent}%` }}
                      />
                    </div>
                    
                    {/* Token Tick Marks */}
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 px-0.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <span
                          key={num}
                          className={`transition-colors ${
                            num <= activeSpec.tokens 
                              ? isLight ? 'text-slate-800 font-black' : 'text-white font-bold' 
                              : 'text-slate-400 opacity-40'
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className={`text-[10px] leading-tight font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {activeSpec.tokenNote}
                  </p>
                </div>

                {/* Bar 2: Time Limit */}
                <div className={`p-3.5 rounded-2xl border space-y-2 ${
                  isLight ? 'bg-white border-amber-900/10' : 'bg-slate-900/90 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-black">
                      <Clock className={`w-3.5 h-3.5 ${
                        selectedDiff === 'novice' 
                          ? 'text-sky-500' 
                          : selectedDiff === 'investigator' 
                          ? 'text-indigo-500' 
                          : 'text-rose-500'
                      }`} />
                      <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>Investigation Timer</span>
                    </div>
                    <span className={`font-mono font-black text-xs px-2 py-0.5 rounded-md ${
                      selectedDiff === 'novice'
                        ? isLight ? 'bg-sky-50 text-sky-800' : 'bg-sky-500/20 text-sky-300'
                        : selectedDiff === 'investigator'
                        ? isLight ? 'bg-indigo-50 text-indigo-900' : 'bg-indigo-500/20 text-indigo-300'
                        : isLight ? 'bg-rose-50 text-rose-900' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {activeSpec.timeSeconds}s Clock
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="space-y-1">
                    <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${
                      isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
                    }`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out shadow-xs ${
                          selectedDiff === 'novice'
                            ? 'bg-gradient-to-r from-sky-500 to-teal-400'
                            : selectedDiff === 'investigator'
                            ? 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                            : 'bg-gradient-to-r from-rose-500 to-orange-400'
                        }`}
                        style={{ width: `${activeSpec.timePercent}%` }}
                      />
                    </div>
                    
                    {/* Time Tick Marks */}
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 px-0.5">
                      <span>30s</span>
                      <span>45s</span>
                      <span>60s</span>
                      <span>75s</span>
                      <span className="font-bold">90s max</span>
                    </div>
                  </div>

                  <p className={`text-[10px] leading-tight font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {activeSpec.timeNote}
                  </p>
                </div>
              </div>

              {/* Secondary Sub-Meters: Deception Stealth & AI Interrogation Rigor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                  isLight ? 'bg-white/80 border-slate-200' : 'bg-slate-900/60 border-slate-800/80'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span className={`text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Deception Stealth
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          selectedDiff === 'novice'
                            ? 'bg-emerald-500'
                            : selectedDiff === 'investigator'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${activeSpec.stealthPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-black text-slate-500 dark:text-slate-400">
                      {activeSpec.stealthPercent}%
                    </span>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                  isLight ? 'bg-white/80 border-slate-200' : 'bg-slate-900/60 border-slate-800/80'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-indigo-500" />
                    <span className={`text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Bot Debate Rigor
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          selectedDiff === 'novice'
                            ? 'bg-emerald-500'
                            : selectedDiff === 'investigator'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${activeSpec.rigorPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-black text-slate-500 dark:text-slate-400">
                      {activeSpec.rigorPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Calibration Synopsis */}
              <div className={`p-3 rounded-2xl border text-xs font-medium leading-relaxed flex items-start gap-2 ${
                selectedDiff === 'novice'
                  ? isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                  : selectedDiff === 'investigator'
                  ? isLight ? 'bg-amber-50/70 border-amber-200 text-amber-950' : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                  : isLight ? 'bg-rose-50/70 border-rose-200 text-rose-950' : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
              }`}>
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-inherit" />
                <span>{activeSpec.synopsis}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex items-center justify-end gap-3 pt-5 border-t ${
            isLight ? 'border-slate-100' : 'border-slate-800'
          }`}>
            <button
              type="submit"
              className={`flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition transform active:scale-98 ${
                settings.highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-black'
                  : isLight
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                  : 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white'
              }`}
            >
              <span>Save & Launch Match</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


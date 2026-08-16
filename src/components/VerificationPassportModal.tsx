import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Award, 
  ShieldCheck, 
  BarChart2, 
  TrendingUp, 
  Share2, 
  Check, 
  X, 
  Sparkles, 
  Globe, 
  Clock, 
  Coins, 
  Printer, 
  ChevronRight, 
  ExternalLink,
  Star,
  BookOpen,
  Stamp,
  Zap,
  Target,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  VerificationPassport, 
  AccessibilitySettings 
} from '../types/game';
import { StorageService } from '../utils/storage';
import { TRANSLATIONS } from '../data/translations';
import { audioSystem } from '../utils/audio';
import { SharePassportModal } from './SharePassportModal';

interface VerificationPassportModalProps {
  passport: VerificationPassport;
  accessibilitySettings: AccessibilitySettings;
  onClose: () => void;
}

export const VerificationPassportModal: React.FC<VerificationPassportModalProps> = ({
  passport,
  accessibilitySettings,
  onClose,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [activePage, setActivePage] = useState<'id_page' | 'stamps' | 'skills' | 'history'>('id_page');
  const t = TRANSLATIONS[accessibilitySettings.language] || TRANSLATIONS.en;

  const analysis = StorageService.getSkillAnalysis(passport);
  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;
  const unlockedBadgesCount = passport.badges.filter(b => b.unlocked).length;

  // Trigger confetti burst upon opening passport
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899']
      });
    } catch {
      // Ignore if canvas-confetti is unsupported
    }
  }, []);

  const handleOpenShare = () => {
    audioSystem.playSuccessChime();
    setShowShareModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const navTabs = [
    { 
      id: 'id_page' as const, 
      label: t.tabFieldIdentity || 'Field Identity', 
      icon: <Stamp className="w-4 h-4 shrink-0" />,
      badgeText: null
    },
    { 
      id: 'stamps' as const, 
      label: t.tabCollectibleBadges || 'Collectible Badges', 
      icon: <Award className="w-4 h-4 shrink-0 text-amber-500" />,
      badgeText: `${unlockedBadgesCount}/${passport.badges.length}`
    },
    { 
      id: 'skills' as const, 
      label: t.tabSiftRadar || 'SIFT Radar & Rings', 
      icon: <BarChart2 className="w-4 h-4 shrink-0 text-sky-500" />,
      badgeText: null
    },
    { 
      id: 'history' as const, 
      label: t.tabCaseHistory || 'Case History', 
      icon: <Clock className="w-4 h-4 shrink-0 text-emerald-500" />,
      badgeText: passport.recentMatches.length > 0 ? `${passport.recentMatches.length}` : null
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="passport-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      {/* COLLECTIBLE PASSPORT BOOK CONTAINER */}
      <div
        className={`w-full max-w-3xl rounded-3xl p-5 sm:p-8 border-2 transition-all my-6 relative overflow-hidden ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : isLight
            ? 'bg-[#FCFAF7] text-slate-800 border-amber-800/30 shadow-2xl ring-4 ring-amber-900/10'
            : 'bg-slate-900 text-slate-100 border-indigo-500/40 shadow-2xl'
        }`}
      >
        {/* Leather/Foil Embossed Spine Accent on Left */}
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 shadow-inner" />

        {/* Passport Header Bar */}
        <div className={`flex items-center justify-between pb-4 mb-4 border-b pl-2 ${
          isLight ? 'border-amber-900/15' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              isLight ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs' : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
            }`}>
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                }`}>
                  OFFICIAL GLOBAL MIL PASSPORT
                </span>
                <span className="flex items-center text-amber-500 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                </span>
              </div>
              <h2 id="passport-title" className={`text-xl sm:text-2xl font-black mt-0.5 ${
                isLight ? 'text-slate-900 font-display' : 'text-white'
              }`}>
                {t.passportTitle || 'Global MIL Passport'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className={`p-2.5 rounded-2xl border transition ${
                isLight
                  ? 'bg-white hover:bg-amber-50 text-slate-700 border-amber-200 shadow-2xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Print Field Record"
              aria-label="Print Field Record"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className={`p-2.5 rounded-2xl border transition hover:rotate-90 ${
                isHighContrast
                  ? 'bg-black text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 shadow-xs'
                  : 'bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-white border-slate-700'
              }`}
              aria-label="Close passport"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PROMINENT TOP TAB SWITCHER (ALWAYS VISIBLE & HIGH CONTRAST) */}
        <div 
          role="tablist"
          aria-label="Passport Sections"
          className={`p-1.5 rounded-2xl border mb-6 flex items-center gap-1.5 overflow-x-auto scrollbar-none pl-2 ${
            isHighContrast
              ? 'bg-black border-2 border-yellow-400'
              : isLight
              ? 'bg-amber-100/70 border border-amber-300/80 shadow-inner'
              : 'bg-slate-950/90 border border-slate-800/90 shadow-inner'
          }`}
        >
          {navTabs.map(tab => {
            const isActive = activePage === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActivePage(tab.id);
                  audioSystem.playClick();
                }}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? isHighContrast
                      ? 'bg-yellow-400 text-black font-black border-2 border-yellow-400 shadow-sm scale-[1.02]'
                      : isLight
                      ? 'bg-white text-amber-950 font-black shadow-md border border-amber-300/90 ring-2 ring-amber-500/20 scale-[1.02]'
                      : 'bg-indigo-600 text-white font-black shadow-lg border border-indigo-400/50 ring-2 ring-indigo-400/30 scale-[1.02]'
                    : isHighContrast
                    ? 'text-yellow-300 hover:bg-yellow-950/40'
                    : isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-white/60 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 font-semibold'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badgeText && (
                  <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${
                    isActive
                      ? isLight ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-white/20 text-white'
                      : isLight ? 'bg-amber-200/80 text-amber-900' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.badgeText}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* PAGE 1: Identity & Credentials */}
        {activePage === 'id_page' && (
          <div className="space-y-6 animate-fade-in pl-2">
            {/* Passport Identity Card Format */}
            <div className={`p-6 rounded-3xl border relative overflow-hidden ${
              isLight
                ? 'bg-white border-amber-900/20 shadow-md'
                : 'bg-gradient-to-r from-indigo-950/80 via-slate-950 to-purple-950/80 border-indigo-500/40 shadow-xl'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className={`text-5xl p-4 rounded-2xl border-2 shadow-md relative ${
                    isLight ? 'bg-amber-50 border-amber-300' : 'bg-slate-900 border-slate-700'
                  }`}>
                    {passport.avatar}
                    <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-white font-mono font-black text-[9px] uppercase shadow-xs">
                      EXP
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {passport.userName}
                      </h3>
                      <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-cyan-950 border-cyan-800 text-cyan-300'
                      }`}>
                        {passport.rankTitle}
                      </span>
                    </div>

                    <p className={`text-xs font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      PASSPORT NO: {passport.userId}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accredited Global Verifier
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Metric Pods */}
                <div className="flex items-center gap-3">
                  <div className={`text-center px-4 py-3 rounded-2xl border ${
                    isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-950/80 border-slate-800'
                  }`}>
                    <div className={`text-[10px] font-black uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Verification XP</div>
                    <div className={`text-xl font-black font-mono ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
                      {passport.verificationPoints}
                    </div>
                  </div>

                  <div className={`text-center px-4 py-3 rounded-2xl border ${
                    isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-950/80 border-slate-800'
                  }`}>
                    <div className={`text-[10px] font-black uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Matches Solved</div>
                    <div className={`text-xl font-black font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {passport.totalGamesPlayed}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setActivePage('stamps');
                  audioSystem.playClick();
                }}
                className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] flex items-center justify-between ${
                  isLight
                    ? 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-200 text-amber-950 shadow-xs'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-100 shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider">{t.tabCollectibleBadges || 'Collectible Badges'}</div>
                    <div className="text-xs font-bold text-amber-600">{unlockedBadgesCount} / {passport.badges.length} Unlocked</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-500" />
              </button>

              <button
                onClick={() => {
                  setActivePage('skills');
                  audioSystem.playClick();
                }}
                className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] flex items-center justify-between ${
                  isLight
                    ? 'bg-sky-50/80 hover:bg-sky-100/80 border-sky-200 text-sky-950 shadow-xs'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-100 shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-500 border border-sky-500/30">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider">{t.tabSiftRadar || 'SIFT Radar'}</div>
                    <div className="text-xs font-bold text-sky-600">5 Vector Ratings</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-sky-500" />
              </button>

              <button
                onClick={() => {
                  setActivePage('history');
                  audioSystem.playClick();
                }}
                className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] flex items-center justify-between ${
                  isLight
                    ? 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-200 text-emerald-950 shadow-xs'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-100 shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider">{t.tabCaseHistory || 'Case History'}</div>
                    <div className="text-xs font-bold text-emerald-600">{passport.recentMatches.length} Recorded</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-500" />
              </button>
            </div>

            {/* SIFT Strengths & Growth Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-5 rounded-2xl border ${
                isLight ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
              }`}>
                <div className="flex items-center gap-2 font-black text-xs uppercase mb-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Key Verified Strength</span>
                </div>
                <div className="text-sm font-bold flex items-center justify-between">
                  <span>{analysis.strongest.name}</span>
                  <span className="font-mono text-emerald-600 font-black">{analysis.strongest.value}%</span>
                </div>
                <p className="text-xs text-emerald-800/80 mt-1 font-medium">
                  Consistent high accuracy when cross-referencing domain provenance and lateral evidence.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${
                isLight ? 'bg-amber-50/60 border-amber-200 text-amber-950' : 'bg-amber-950/40 border-amber-800 text-amber-200'
              }`}>
                <div className="flex items-center gap-2 font-black text-xs uppercase mb-2">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span>Next Training Objective</span>
                </div>
                <div className="text-sm font-bold flex items-center justify-between">
                  <span>{analysis.weakest.name}</span>
                  <span className="font-mono text-amber-600 font-black">{analysis.weakest.value}%</span>
                </div>
                <p className="text-xs text-amber-800/80 mt-1 font-medium">
                  Focus on inspecting EXIF metadata and generative AI frequency signatures.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: Badges & Stamps (WITH PROMINENT BACK BUTTON) */}
        {activePage === 'stamps' && (
          <div className="space-y-5 animate-fade-in pl-2">
            {/* Top Back and Info Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-dashed border-amber-900/20">
              <button
                onClick={() => {
                  setActivePage('id_page');
                  audioSystem.playClick();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all shadow-sm hover:scale-105 active:scale-95 ${
                  isHighContrast
                    ? 'bg-black text-yellow-300 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                    : isLight
                    ? 'bg-white hover:bg-amber-50 text-amber-950 border-amber-300 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-indigo-500/40 shadow-sm'
                }`}
                title="Return to Field Identity Overview"
                aria-label="Back to Field Identity Overview"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backToOverview || 'Back to Field Identity'}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                  isLight ? 'bg-amber-100/90 text-amber-900 border-amber-300' : 'bg-indigo-950/90 text-indigo-300 border-indigo-800'
                }`}>
                  🏅 {unlockedBadgesCount} of {passport.badges.length} Unlocked
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {passport.badges.map(badge => (
                <div
                  key={badge.id}
                  className={`p-4 sm:p-5 rounded-3xl border-2 transition-all relative overflow-hidden ${
                    badge.unlocked
                      ? isLight
                        ? 'bg-white border-amber-400/80 shadow-md animate-stamp-in'
                        : 'bg-slate-900 border-indigo-500/60 shadow-lg animate-stamp-in'
                      : isLight
                      ? 'bg-slate-100/60 border-dashed border-slate-300 opacity-60'
                      : 'bg-slate-950/40 border-dashed border-slate-800 opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 shrink-0 ${
                        badge.unlocked ? 'border-amber-400 bg-amber-50 text-amber-600' : 'border-slate-300 bg-slate-200 text-slate-400'
                      }`}>
                        {badge.unlocked ? '🏅' : <Lock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className={`text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {badge.title}
                        </h4>
                        <p className={`text-xs font-medium line-clamp-2 mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {badge.description}
                        </p>
                      </div>
                    </div>

                    {badge.unlocked ? (
                      <div className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-black text-[10px] shrink-0">
                        UNLOCKED
                      </div>
                    ) : (
                      <div className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-mono font-bold text-[10px] shrink-0">
                        SEALED
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Quick Navigation Links */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/30">
              <button
                onClick={() => {
                  setActivePage('id_page');
                  audioSystem.playClick();
                }}
                className={`flex items-center gap-1.5 text-xs font-bold transition ${
                  isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Field Identity</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('skills');
                  audioSystem.playClick();
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-sky-500 hover:text-sky-400 transition"
              >
                <span>View SIFT Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* PAGE 3: SIFT Skill Radar & Circular Rings (WITH BACK BUTTON) */}
        {activePage === 'skills' && (
          <div className="space-y-5 animate-fade-in pl-2">
            {/* Top Back and Info Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-dashed border-amber-900/20">
              <button
                onClick={() => {
                  setActivePage('id_page');
                  audioSystem.playClick();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all shadow-sm hover:scale-105 active:scale-95 ${
                  isHighContrast
                    ? 'bg-black text-yellow-300 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                    : isLight
                    ? 'bg-white hover:bg-amber-50 text-amber-950 border-amber-300 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-indigo-500/40 shadow-sm'
                }`}
                title="Return to Field Identity Overview"
                aria-label="Back to Field Identity Overview"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backToOverview || 'Back to Field Identity'}</span>
              </button>

              <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                SIFT Forensic Skill Competencies
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Source Verification & WHOIS', score: passport.skillVectors.sourceVerification, color: 'text-rose-500', stroke: '#F43F5E' },
                { label: 'Evidence Assessment', score: passport.skillVectors.evidenceAssessment, color: 'text-sky-500', stroke: '#0284C7' },
                { label: 'Context & Background Timeline', score: passport.skillVectors.contextChecking, color: 'text-amber-500', stroke: '#D97706' },
                { label: 'Cross-Referencing Wires', score: passport.skillVectors.crossReferencing, color: 'text-emerald-500', stroke: '#10B981' },
                { label: 'AI & Media Forensics', score: passport.skillVectors.aiManipulationDetection, color: 'text-purple-500', stroke: '#9333EA' },
              ].map((skill, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div>
                    <div className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {skill.label}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Proficiency Rating: <strong className={skill.color}>{skill.score}%</strong>
                    </div>
                  </div>

                  {/* Circular SVG Progress Ring */}
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke="currentColor"
                        strokeWidth="4"
                        className={isLight ? 'text-slate-100' : 'text-slate-800'}
                        fill="transparent"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke={skill.stroke}
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={113}
                        strokeDashoffset={113 - (113 * skill.score) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-mono font-black">
                      {skill.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Quick Navigation Links */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/30">
              <button
                onClick={() => {
                  setActivePage('stamps');
                  audioSystem.playClick();
                }}
                className={`flex items-center gap-1.5 text-xs font-bold transition ${
                  isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Collectible Badges</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('history');
                  audioSystem.playClick();
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition"
              >
                <span>Case History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* PAGE 4: Case History (WITH BACK BUTTON) */}
        {activePage === 'history' && (
          <div className="space-y-4 animate-fade-in pl-2">
            {/* Top Back and Info Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-dashed border-amber-900/20">
              <button
                onClick={() => {
                  setActivePage('id_page');
                  audioSystem.playClick();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all shadow-sm hover:scale-105 active:scale-95 ${
                  isHighContrast
                    ? 'bg-black text-yellow-300 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                    : isLight
                    ? 'bg-white hover:bg-amber-50 text-amber-950 border-amber-300 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-indigo-500/40 shadow-sm'
                }`}
                title="Return to Field Identity Overview"
                aria-label="Back to Field Identity Overview"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backToOverview || 'Back to Field Identity'}</span>
              </button>

              <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Recent Investigative Matches
              </h3>
            </div>

            {passport.recentMatches.length === 0 ? (
              <p className={`text-xs italic p-6 text-center rounded-2xl border ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                No completed case files on record yet. Complete your first match to log telemetry!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {passport.recentMatches.map((match, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                      isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className={`font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {match.gameMode.toUpperCase()} Mode • {match.demographic}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {match.date.slice(0, 10)} • Imposter Caught: {match.imposterCaught ? 'Yes ✓' : 'No ✗'}
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-amber-600">
                      +{match.score} PTS
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Quick Navigation Links */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/30">
              <button
                onClick={() => {
                  setActivePage('skills');
                  audioSystem.playClick();
                }}
                className={`flex items-center gap-1.5 text-xs font-bold transition ${
                  isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>SIFT Radar</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('id_page');
                  audioSystem.playClick();
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-500 transition"
              >
                <span>Back to Overview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Passport Footer with Share Button */}
        <div className={`mt-6 pt-4 border-t flex items-center justify-between pl-2 ${
          isLight ? 'border-amber-900/15' : 'border-slate-800'
        }`}>
          <div className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            GLOBAL MIL ALLIANCE OFFICIAL TELEMETRY
          </div>

          <button
            onClick={handleOpenShare}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md transition transform active:scale-95 ${
              isLight
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                : 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>{t.passportShare || 'Share Passport'}</span>
          </button>
        </div>
      </div>

      {showShareModal && (
        <SharePassportModal
          passport={passport}
          accessibilitySettings={accessibilitySettings}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

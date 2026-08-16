import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Coins, 
  Share2,
  TrendingUp,
  Volume2,
  Check
} from 'lucide-react';
import { 
  PlayerState, 
  RoundResolution, 
  AccessibilitySettings,
  RoundCategory 
} from '../types/game';
import { TRANSLATIONS } from '../data/translations';
import { audioSystem } from '../utils/audio';

interface RevealAndDebriefProps {
  resolution: RoundResolution;
  players: PlayerState[];
  currentRoundNumber: number;
  totalRounds: number;
  roundCategory: RoundCategory;
  accessibilitySettings: AccessibilitySettings;
  onNextRound: () => void;
  onViewPassport: () => void;
  onSharePassport?: () => void;
}

export const RevealAndDebrief: React.FC<RevealAndDebriefProps> = ({
  resolution,
  players,
  currentRoundNumber,
  totalRounds,
  roundCategory,
  accessibilitySettings,
  onNextRound,
  onViewPassport,
  onSharePassport,
}) => {
  const [showFullDebrief, setShowFullDebrief] = useState(false);
  const t = TRANSLATIONS[accessibilitySettings.language] || TRANSLATIONS.en;

  const imposterPlayer = players.find(p => p.id === resolution.actualImposterPlayerId);
  const isPlayerWon = resolution.imposterIdentified;
  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;

  useEffect(() => {
    audioSystem.playRevealDramatic();
    const timer = setTimeout(() => {
      if (isPlayerWon) {
        audioSystem.playSuccessChime();
        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.5 },
            colors: ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6']
          });
        } catch {
          // ignore
        }
      }
      setShowFullDebrief(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isPlayerWon]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Big Dramatic Banner */}
      <div
        className={`p-7 sm:p-9 rounded-3xl border transition-all text-center space-y-4 ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : isLight
            ? isPlayerWon
              ? 'bg-gradient-to-b from-emerald-50 via-white to-amber-50/30 border-emerald-300 game-card-shadow'
              : 'bg-gradient-to-b from-rose-50 via-white to-amber-50/30 border-rose-300 game-card-shadow'
            : isPlayerWon
            ? 'bg-gradient-to-b from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/40 shadow-2xl'
            : 'bg-gradient-to-b from-rose-950/80 via-slate-900 to-slate-950 border-rose-500/40 shadow-2xl'
        }`}
      >
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-black uppercase shadow-xs ${
          isLight
            ? 'bg-white border-slate-200 text-slate-700'
            : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}>
          <span>Round {currentRoundNumber} of {totalRounds} Resolution</span>
        </div>

        <div className="text-6xl sm:text-7xl animate-bounce my-3 filter drop-shadow-md">
          {imposterPlayer?.avatar || '🕵️'}
        </div>

        <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${
          isLight ? 'text-slate-900 font-display' : 'text-white'
        }`}>
          {imposterPlayer?.name} was the Information Imposter!
        </h2>

        <div className="text-sm sm:text-base max-w-xl mx-auto font-medium">
          {isPlayerWon ? (
            <div className={`p-3 rounded-2xl border font-bold flex items-center justify-center gap-2 ${
              isLight ? 'bg-emerald-100/70 text-emerald-900 border-emerald-200' : 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
            }`}>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Verifiers Uncovered the Imposter! (+{resolution.earnedPoints} Points)</span>
            </div>
          ) : (
            <div className={`p-3 rounded-2xl border font-bold flex items-center justify-center gap-2 ${
              isLight ? 'bg-rose-100/70 text-rose-900 border-rose-200' : 'bg-rose-950/50 text-rose-300 border-rose-500/30'
            }`}>
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>The Information Imposter Evaded Detection!</span>
            </div>
          )}
        </div>
      </div>

      {/* Forensic Fact-Check Breakdown */}
      {showFullDebrief && (
        <div className="space-y-6 animate-fade-in">
          {/* Ground Truth & Real-World Context */}
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
            isLight
              ? 'bg-white border-amber-900/10 game-card-shadow'
              : 'bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-xl'
          }`}>
            <div className={`flex items-center gap-2.5 pb-3 border-b ${
              isLight ? 'border-slate-100' : 'border-slate-800'
            }`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                isLight ? 'bg-amber-100 border-amber-200 text-amber-800' : 'bg-slate-800 border-slate-700 text-cyan-400'
              }`}>
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Forensic Case Breakdown & Ground Truth
              </h3>
            </div>

            <div className={`p-4 sm:p-5 rounded-2xl border space-y-1.5 ${
              isLight ? 'bg-amber-50/40 border-amber-200/70' : 'bg-slate-950 border-slate-800/80'
            }`}>
              <span className={`text-[10px] font-black uppercase tracking-wider ${
                isLight ? 'text-amber-800' : 'text-cyan-400'
              }`}>
                Ground Truth Verified Verdict:
              </span>
              <p className={`text-xs sm:text-sm leading-relaxed font-medium ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}>
                {resolution.debrief.groundTruth}
              </p>
            </div>

            {/* Red Flags Discovered */}
            <div className="space-y-2.5">
              <span className={`text-xs font-black uppercase tracking-wider block ${
                isLight ? 'text-slate-800' : 'text-slate-300'
              }`}>
                Forensic Red Flags Identified:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {resolution.debrief.redFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 font-medium ${
                      isLight
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real World Impact & SIFT Takeaway */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className={`p-4 sm:p-5 rounded-2xl border ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-wider block mb-1.5 ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}>
                  Real-World Disinformation Pattern:
                </span>
                <p className={`text-xs leading-relaxed font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  {resolution.debrief.realWorldContext}
                </p>
              </div>

              <div className={`p-4 sm:p-5 rounded-2xl border ${
                isLight
                  ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                  : 'bg-indigo-950/40 border-indigo-500/30 text-slate-300'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${
                  isLight ? 'text-indigo-800' : 'text-cyan-300'
                }`}>
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  <span>SIFT Method Core Takeaway:</span>
                </span>
                <p className={`text-xs leading-relaxed font-medium ${isLight ? 'text-indigo-900' : 'text-slate-300'}`}>
                  {resolution.debrief.siftTakeaway}
                </p>
              </div>
            </div>

            {/* Global MIL Theme Takeaway */}
            {resolution.debrief.milTakeaway && (
              <div className={`p-4 sm:p-5 rounded-2xl border space-y-2 ${
                isLight 
                  ? 'bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border-indigo-200/80 text-slate-800' 
                  : 'bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border-indigo-500/30 text-slate-200'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isLight ? 'bg-indigo-100 text-indigo-900' : 'bg-indigo-500/20 text-cyan-300'
                    }`}>
                      Global MIL Theme
                    </span>
                    <span className={`text-xs font-bold ${isLight ? 'text-indigo-900' : 'text-white'}`}>
                      {resolution.debrief.milTakeaway.title}
                    </span>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    isLight ? 'bg-amber-100 text-amber-900' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {resolution.debrief.milTakeaway.milAlignment}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed font-medium ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  <strong className={isLight ? 'text-indigo-950' : 'text-indigo-200'}>Civic Action Plan: </strong>
                  {resolution.debrief.milTakeaway.intervention}
                </p>
              </div>
            )}
          </div>

          {/* Voting Roster Breakdown */}
          <div className={`p-6 rounded-3xl border space-y-3 ${
            isLight ? 'bg-white border-amber-900/10 game-card-shadow' : 'bg-slate-900/80 border-slate-800 shadow-xl'
          }`}>
            <h4 className={`text-xs font-black uppercase tracking-wider ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Ballot Breakdown:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {resolution.votes.map((v, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    {players.find(p => p.id === v.voterId)?.name || 'Verifier'}
                  </span>
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                    → voted{' '}
                    <span className={`font-black ${isLight ? 'text-indigo-700' : 'text-white'}`}>
                      {v.votedTargetId === 'unverifiable_prudent'
                        ? 'Unverifiable Flag'
                        : players.find(p => p.id === v.votedTargetId)?.name || 'Suspect'}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Nav Controls */}
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  audioSystem.playClick();
                  onViewPassport();
                }}
                className={`flex-1 sm:flex-none px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border transition ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Compass className="w-4 h-4 text-indigo-500" />
                <span>{t.viewPassport}</span>
              </button>

              {onSharePassport && (
                <button
                  type="button"
                  onClick={() => {
                    audioSystem.playSuccessChime();
                    onSharePassport();
                  }}
                  className={`flex-1 sm:flex-none px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border shadow-xs transition ${
                    isLight
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 shadow-amber-500/10'
                      : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-cyan-300 border-indigo-500/40'
                  }`}
                  title="Share match performance and verification stats"
                >
                  <Share2 className="w-4 h-4 text-amber-500" />
                  <span>Share Stats</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                audioSystem.playSuccessChime();
                onNextRound();
              }}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition transform active:scale-98 ${
                isHighContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-black'
                  : isLight
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                  : 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white'
              }`}
            >
              <span>{currentRoundNumber < totalRounds ? t.nextRound : t.viewPassport}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


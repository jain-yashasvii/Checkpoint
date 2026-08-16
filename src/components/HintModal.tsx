import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  X, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  Check, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Copy, 
  ArrowRight,
  ShieldCheck,
  Search,
  Eye,
  Lock,
  Unlock,
  Plus
} from 'lucide-react';
import { InformationCard, AccessibilitySettings, CardHint, InvestigationActionType } from '../types/game';
import { TRANSLATIONS } from '../data/translations';
import { getCardHints } from '../utils/hintService';
import { audioSystem } from '../utils/audio';

interface HintModalProps {
  card: InformationCard;
  accessibilitySettings: AccessibilitySettings;
  onClose: () => void;
  onSelectVector?: (type: InvestigationActionType) => void;
  onAddToNotes?: (hintText: string) => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  card,
  accessibilitySettings,
  onClose,
  onSelectVector,
  onAddToNotes,
}) => {
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedLevel, setCopiedLevel] = useState<number | null>(null);

  const t = TRANSLATIONS[accessibilitySettings.language] || TRANSLATIONS.en;
  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;

  const hints: CardHint[] = getCardHints(card);
  const currentHint = hints.find(h => h.level === activeLevel) || hints[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      audioSystem.stopTTS();
    };
  }, [onClose]);

  const handleUnlockNext = () => {
    if (unlockedLevel < 3) {
      audioSystem.playSuccessChime();
      const nextLvl = unlockedLevel + 1;
      setUnlockedLevel(nextLvl);
      setActiveLevel(nextLvl);
    }
  };

  const handleToggleTTS = (text: string) => {
    if (isSpeaking) {
      audioSystem.stopTTS();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      audioSystem.speak(
        `${currentHint.title}. ${text}. ${currentHint.siftTip}`,
        accessibilitySettings.language,
        accessibilitySettings.ttsSpeed,
        () => setIsSpeaking(false)
      );
    }
  };

  const handleCopyNote = (text: string, level: number) => {
    audioSystem.playClick();
    if (onAddToNotes) {
      onAddToNotes(`[Hint L${level}] ${currentHint.title}: ${text}`);
      setCopiedLevel(level);
      setTimeout(() => setCopiedLevel(null), 2000);
    }
  };

  const getTierBadge = (level: number) => {
    switch (level) {
      case 1:
        return {
          title: t.hintLevel1,
          icon: '💡',
          badgeBg: isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          accent: 'border-amber-400'
        };
      case 2:
        return {
          title: t.hintLevel2,
          icon: '🔍',
          badgeBg: isLight ? 'bg-sky-100 text-sky-900 border-sky-300' : 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          accent: 'border-sky-400'
        };
      case 3:
      default:
        return {
          title: t.hintLevel3,
          icon: '✦',
          badgeBg: isLight ? 'bg-purple-100 text-purple-900 border-purple-300' : 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          accent: 'border-purple-400'
        };
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hint-modal-title"
    >
      <div 
        className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : isLight
            ? 'bg-white border-amber-900/15 text-slate-800'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        {/* Modal Top Header */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
          isLight ? 'bg-gradient-to-r from-amber-50/90 via-white to-amber-50/40 border-slate-100' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${
              isLight ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}>
              <Lightbulb className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isLight ? 'bg-indigo-100 text-indigo-900' : 'bg-indigo-500/20 text-cyan-300'
                }`}>
                  SIFT Forensic Assistance
                </span>
                <span className={`text-xs font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                  {unlockedLevel} / 3 Hints Available
                </span>
              </div>
              <h2 id="hint-modal-title" className={`text-lg sm:text-xl font-black mt-0.5 ${isLight ? 'text-slate-900 font-display' : 'text-white'}`}>
                {t.hintFeature} & Investigation Guide
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              audioSystem.playClick();
              onClose();
            }}
            className={`p-2.5 rounded-2xl border transition-all transform active:scale-95 ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
            aria-label="Close Hint Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Selector Tabs */}
        <div className={`px-5 sm:px-6 py-3 border-b flex items-center justify-between gap-2 overflow-x-auto ${
          isLight ? 'bg-slate-50 border-slate-100' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            {hints.map((h) => {
              const tier = getTierBadge(h.level);
              const isUnlocked = h.level <= unlockedLevel;
              const isSelected = h.level === activeLevel;

              return (
                <button
                  key={h.level}
                  type="button"
                  onClick={() => {
                    if (isUnlocked) {
                      audioSystem.playClick();
                      setActiveLevel(h.level);
                    } else {
                      audioSystem.playTokenSpend();
                      handleUnlockNext();
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all whitespace-nowrap ${
                    isSelected
                      ? isLight
                        ? 'bg-white text-slate-900 border-amber-400 shadow-sm ring-2 ring-amber-400/30'
                        : 'bg-indigo-900/70 text-cyan-300 border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                      : isUnlocked
                      ? isLight
                        ? 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                      : isLight
                      ? 'bg-slate-100/60 text-slate-400 border-dashed border-slate-300 hover:border-slate-400'
                      : 'bg-slate-950/60 text-slate-500 border-dashed border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{tier.icon}</span>
                  <span>{tier.title}</span>
                  {!isUnlocked && <Lock className="w-3.5 h-3.5 opacity-60 ml-1" />}
                </button>
              );
            })}
          </div>

          {unlockedLevel < 3 && (
            <button
              type="button"
              onClick={handleUnlockNext}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all shadow-xs shrink-0 ${
                isLight
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.unlockHint}</span>
            </button>
          )}
        </div>

        {/* Active Hint Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Card Target Summary Context */}
          <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
            isLight ? 'bg-slate-50/90 border-slate-200 text-slate-700' : 'bg-slate-950/70 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-mono font-bold text-amber-500 shrink-0">CASE FILE:</span>
              <span className="font-bold truncate">{card.headline}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black shrink-0 ${
              isLight ? 'bg-indigo-100 text-indigo-900' : 'bg-indigo-500/20 text-cyan-300'
            }`}>
              {card.roundCategory.toUpperCase()} DECK
            </span>
          </div>

          {/* Hint Card Box */}
          <div className={`p-6 rounded-3xl border shadow-sm transition-all space-y-4 ${
            isHighContrast
              ? 'bg-black border-yellow-400 text-yellow-300'
              : isLight
              ? `bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 ${getTierBadge(currentHint.level).accent} border`
              : 'bg-slate-950/90 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-inherit/20">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{getTierBadge(currentHint.level).icon}</span>
                <div>
                  <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${getTierBadge(currentHint.level).badgeBg}`}>
                    {getTierBadge(currentHint.level).title}
                  </span>
                  <h3 className={`text-base sm:text-lg font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {currentHint.title}
                  </h3>
                </div>
              </div>

              {/* TTS Read Aloud Button */}
              <button
                type="button"
                onClick={() => handleToggleTTS(currentHint.hintText)}
                className={`p-2.5 rounded-2xl border transition-all ${
                  isSpeaking
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : isLight
                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200'
                    : 'bg-indigo-950/60 hover:bg-indigo-900/60 text-cyan-300 border-indigo-500/40'
                }`}
                title={isSpeaking ? t.ttsStop : t.ttsReadCard}
                aria-label={isSpeaking ? t.ttsStop : t.ttsReadCard}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Hint Detailed Text */}
            <p className={`text-sm sm:text-base leading-relaxed font-medium ${
              isLight ? 'text-slate-800' : 'text-slate-200'
            }`}>
              {currentHint.hintText}
            </p>

            {/* SIFT Principle Takeaway Box */}
            <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
              isLight ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950' : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
            }`}>
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                {currentHint.siftTip}
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-inherit/20">
              <div className="flex items-center gap-2">
                {onAddToNotes && (
                  <button
                    type="button"
                    onClick={() => handleCopyNote(currentHint.hintText, currentHint.level)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all transform active:scale-95 ${
                      copiedLevel === currentHint.level
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                    }`}
                  >
                    {copiedLevel === currentHint.level ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.hintCopied}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t.copyHintToNotes}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {currentHint.recommendedVector && onSelectVector && (
                <button
                  type="button"
                  onClick={() => {
                    audioSystem.playClick();
                    onSelectVector(currentHint.recommendedVector!);
                    onClose();
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase transition-all shadow-xs transform active:scale-95 ${
                    isLight
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Inspect Recommended Vector</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          isLight ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>SIFT Forensic Assistance: <strong>Stop, Investigate, Find, Trace</strong></span>
          </div>

          <button
            type="button"
            onClick={() => {
              audioSystem.playClick();
              onClose();
            }}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
              isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Coins, 
  Search, 
  Calendar, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  PenTool, 
  Tag, 
  HelpCircle, 
  Info,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileCheck,
  Sparkles,
  Compass,
  Zap,
  ArrowDownCircle,
  FileSearch,
  Check,
  Plus,
  Lightbulb
} from 'lucide-react';
import { 
  InformationCard, 
  InvestigationActionType, 
  InvestigationClue, 
  AccessibilitySettings,
  PlayerState
} from '../types/game';
import { TRANSLATIONS } from '../data/translations';
import { getLocalizedActionInfo } from '../utils/localization';
import { audioSystem } from '../utils/audio';
import { SecretRoleCard } from './SecretRoleCard';
import { HintModal } from './HintModal';

interface InvestigationDossierProps {
  card: InformationCard;
  tokens: number;
  unlockedClues: InvestigationActionType[];
  investigativeNotes: string[];
  taggedSuspicion: 'low' | 'medium' | 'high' | 'unverifiable';
  accessibilitySettings: AccessibilitySettings;
  localPlayer?: PlayerState;
  onSpendToken: (action: InvestigationActionType) => void;
  onUpdateNotes: (notes: string[]) => void;
  onUpdateSuspicion: (rating: 'low' | 'medium' | 'high' | 'unverifiable') => void;
}

const ACTION_CONFIG: {
  type: InvestigationActionType;
  title: string;
  tactileSymbol: string;
  siftPillar: string;
  accent: string;
  deckBorder: string;
  badgeBg: string;
  deckTag: string;
}[] = [
  {
    type: 'check_source',
    title: 'Check Source & WHOIS',
    tactileSymbol: '◆',
    siftPillar: 'Stop & Check',
    accent: 'rose',
    deckBorder: 'border-rose-400',
    badgeBg: 'bg-rose-500/15 text-rose-600',
    deckTag: 'DOMAIN TRACE'
  },
  {
    type: 'verify_date',
    title: 'Verify Timeline & Dates',
    tactileSymbol: '📅',
    siftPillar: 'Find Coverage',
    accent: 'sky',
    deckBorder: 'border-sky-400',
    badgeBg: 'bg-sky-500/15 text-sky-600',
    deckTag: 'TEMPORAL RECORD'
  },
  {
    type: 'cross_check_network',
    title: 'Cross-Check News Wires',
    tactileSymbol: '⬡',
    siftPillar: 'Investigate',
    accent: 'emerald',
    deckBorder: 'border-emerald-400',
    badgeBg: 'bg-emerald-500/15 text-emerald-600',
    deckTag: 'LATERAL WIRES'
  },
  {
    type: 'inspect_metadata',
    title: 'Inspect EXIF & Geometry',
    tactileSymbol: '🔬',
    siftPillar: 'Trace Context',
    accent: 'amber',
    deckBorder: 'border-amber-400',
    badgeBg: 'bg-amber-500/15 text-amber-600',
    deckTag: 'EXIF METADATA'
  },
  {
    type: 'analyze_ai_artifacts',
    title: 'Analyze AI & GAN Artifacts',
    tactileSymbol: '✦',
    siftPillar: 'Media Forensics',
    accent: 'purple',
    deckBorder: 'border-purple-400',
    badgeBg: 'bg-purple-500/15 text-purple-600',
    deckTag: 'SYNTHETIC GAN'
  },
];

export const InvestigationDossier: React.FC<InvestigationDossierProps> = ({
  card,
  tokens,
  unlockedClues,
  investigativeNotes,
  taggedSuspicion,
  accessibilitySettings,
  localPlayer,
  onSpendToken,
  onUpdateNotes,
  onUpdateSuspicion,
}) => {
  const [activeClueType, setActiveClueType] = useState<InvestigationActionType>('check_source');
  const [currentNoteText, setCurrentNoteText] = useState('');
  const [spendingAnimation, setSpendingAnimation] = useState<string | null>(null);
  const [isSlotRevealing, setIsSlotRevealing] = useState<boolean>(false);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);

  const t = TRANSLATIONS[accessibilitySettings.language] || TRANSLATIONS.en;
  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;

  const handleActionClick = (type: InvestigationActionType) => {
    setActiveClueType(type);
    if (!unlockedClues.includes(type)) {
      if (tokens > 0) {
        audioSystem.playTokenSpend();
        setSpendingAnimation(type);
        setIsSlotRevealing(true);
        setTimeout(() => {
          onSpendToken(type);
          setSpendingAnimation(null);
          setTimeout(() => setIsSlotRevealing(false), 600);
        }, 350);
      } else {
        audioSystem.playClick();
      }
    } else {
      audioSystem.playClick();
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNoteText.trim()) return;
    audioSystem.playClick();
    onUpdateNotes([...investigativeNotes, currentNoteText.trim()]);
    setCurrentNoteText('');
  };

  const activeClue = card.investigationClues[activeClueType];
  const isUnlocked = unlockedClues.includes(activeClueType);
  const activeConfig = ACTION_CONFIG.find(a => a.type === activeClueType) || ACTION_CONFIG[0];

  return (
    <div className="space-y-6">
      {/* 3D Secret Role Briefing Card (Flip Card) */}
      {localPlayer && (
        <SecretRoleCard
          player={localPlayer}
          accessibilitySettings={accessibilitySettings}
        />
      )}

      {/* Tactile Token Balance & Action Chips Bar */}
      <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${
        isHighContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : isLight
          ? 'bg-white border-amber-900/10 game-card-shadow'
          : 'bg-slate-900 border-slate-800 shadow-xl text-white'
      }`}>
        <div className={`flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b ${
          isLight ? 'border-slate-100' : 'border-slate-800'
        }`}>
          <div>
            <h3 className={`text-base font-black flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <Search className={`w-4 h-4 ${isLight ? 'text-amber-500' : 'text-cyan-400'}`} />
              <span>SIFT Forensic Investigation Vectors</span>
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Select an action chip below to spend gold tokens and unseal forensic telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Need a Hint Button */}
            <button
              type="button"
              onClick={() => {
                audioSystem.playClick();
                setIsHintOpen(true);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all transform active:scale-95 shadow-xs ${
                isLight
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-500/40'
              }`}
              title="Open SIFT Forensic Hint Guide"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>{t.needAHint}</span>
            </button>

            {/* Golden Coin Token Interactive Counter */}
            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border font-mono font-black text-xs shadow-xs transition-transform transform active:scale-95 ${
              isLight
                ? 'bg-gradient-to-r from-amber-50 to-amber-100/70 border-amber-300 text-amber-900'
                : 'bg-gradient-to-r from-amber-950/60 to-slate-900 border-amber-500/40 text-amber-300'
            }`}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-amber-950 flex items-center justify-center shadow-xs animate-coin font-black text-xs">
                🪙
              </div>
              <span>
                {tokens} {t.tokens} AVAILABLE
              </span>
            </div>
          </div>
        </div>

        {/* 5 Tactile Clue Spending Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ACTION_CONFIG.map(action => {
            const unlocked = unlockedClues.includes(action.type);
            const isCurrent = activeClueType === action.type;
            const isSpending = spendingAnimation === action.type;
            const localizedAction = getLocalizedActionInfo(action.type, accessibilitySettings.language);

            return (
              <button
                key={action.type}
                onClick={() => handleActionClick(action.type)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between overflow-hidden transform active:scale-95 ${
                  isCurrent
                    ? isHighContrast
                      ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                      : isLight
                      ? 'bg-gradient-to-b from-amber-50 via-white to-amber-50/30 border-amber-400 ring-2 ring-amber-400/50 shadow-md -translate-y-1'
                      : 'bg-indigo-950/90 border-indigo-400 ring-2 ring-indigo-400/50 shadow-lg -translate-y-1'
                    : isLight
                    ? 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                } ${isSpending ? 'animate-bounce' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono font-bold">
                      {action.tactileSymbol}
                    </span>
                    {unlocked ? (
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" /> {t.unlockedClue}
                      </span>
                    ) : (
                      <div className={`flex items-center gap-1 text-[10px] font-black font-mono px-2 py-0.5 rounded-full border shadow-2xs ${
                        isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        <span>🪙</span> 1 {t.tokens}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs font-black line-clamp-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {localizedAction.title}
                  </div>
                </div>

                <div className={`mt-2.5 text-[10px] font-mono font-bold flex items-center justify-between ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  <span>{localizedAction.pillar}</span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clue Card-Slot Expansion / Revealing Drawer */}
      <div
        className={`relative p-6 sm:p-7 rounded-3xl border transition-all overflow-hidden ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : isLight
            ? `bg-white border-amber-900/15 game-card-shadow text-slate-800 ring-1 ${activeConfig.deckBorder}`
            : 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-2xl'
        }`}
      >
        {/* Animated Scan Beam Laser during reveal */}
        {isSlotRevealing && (
          <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-beam z-20 pointer-events-none shadow-cyan-500/50" />
        )}

        {isUnlocked ? (
          <div className="space-y-5 animate-fade-in">
            {/* Clue Header Badge */}
            <div className={`flex items-center justify-between pb-4 border-b ${
              isLight ? 'border-slate-100' : 'border-slate-800'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border shadow-sm ${
                  isLight ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-indigo-950 border-indigo-500/50 text-cyan-300'
                }`}>
                  {activeClue.tactileSymbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full ${
                      isLight ? 'bg-amber-100 text-amber-900' : 'bg-indigo-500/20 text-cyan-300'
                    }`}>
                      {activeConfig.deckTag}
                    </span>
                    <span className={`text-xs font-bold flex items-center gap-1 ${
                      isLight ? 'text-emerald-700' : 'text-emerald-400'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Clue Unlocked & Logged
                    </span>
                  </div>
                  <h4 className={`text-lg font-black mt-0.5 ${isLight ? 'text-slate-900 font-display' : 'text-white'}`}>
                    {activeClue.title}
                  </h4>
                </div>
              </div>
            </div>

            {/* Non-Binary Metadata Evidence Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeClue.metadataDetails.map((meta, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition hover:shadow-2xs ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800/80'
                  }`}
                >
                  <span className={`text-[10px] uppercase font-mono font-bold block mb-1 ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {meta.label}
                  </span>
                  <p className={`text-xs sm:text-sm font-mono font-black ${
                    isLight ? 'text-indigo-900' : 'text-cyan-300'
                  }`}>
                    {meta.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Forensic Finding Text */}
            <div className={`p-5 rounded-2xl border ${
              isLight ? 'bg-gradient-to-r from-amber-50/60 to-white border-amber-200' : 'bg-slate-950/80 border-slate-800'
            }`}>
              <span className={`text-[10px] font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${
                isLight ? 'text-amber-900' : 'text-slate-400'
              }`}>
                <FileCheck className="w-4 h-4 text-amber-600" />
                <span>Forensic Finding & Observation</span>
              </span>
              <p className={`text-sm leading-relaxed font-sans font-medium ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}>
                {activeClue.revealedEvidenceText}
              </p>
            </div>

            {/* MIL / SIFT Pedagogical Insight */}
            <div className={`p-4 rounded-2xl border text-xs ${
              isLight
                ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
                : 'bg-indigo-950/50 border-indigo-500/30 text-slate-300'
            }`}>
              <div className={`font-black flex items-center gap-1.5 mb-1 ${
                isLight ? 'text-indigo-900' : 'text-indigo-300'
              }`}>
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.pedagogicalInsight}:</span>
              </div>
              <p className={`leading-relaxed text-[11px] font-medium ${
                isLight ? 'text-indigo-950/90' : 'text-slate-300'
              }`}>
                {activeClue.pedagogicalInsight}
              </p>
            </div>
          </div>
        ) : (
          /* Sealed Card Slot State */
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className={`p-5 rounded-3xl border shadow-md transition-transform hover:scale-105 ${
              isLight 
                ? 'bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200 text-amber-600' 
                : 'bg-slate-950 border-slate-800 text-amber-400'
            }`}>
              <Lock className="w-10 h-10" />
            </div>
            <div>
              <h4 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {activeClue.title} is Currently Sealed
              </h4>
              <p className={`text-xs max-w-md mt-1 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Spend 1 Investigation Token to run automated domain forensics, timeline verification, or AI synthesis analysis.
              </p>
            </div>

            {tokens > 0 ? (
              <button
                onClick={() => handleActionClick(activeClueType)}
                className={`flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition transform active:scale-95 ${
                  isHighContrast
                    ? 'bg-yellow-400 text-black border-2 border-black hover:bg-yellow-300'
                    : isLight
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-950 flex items-center justify-center text-xs font-black">
                  🪙
                </div>
                <span>{t.spendToken} (1 Token)</span>
              </button>
            ) : (
              <div className="text-xs text-rose-600 font-bold flex items-center gap-1.5 mt-2 bg-rose-50 px-4 py-2 rounded-xl border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No investigation tokens remaining this phase! Deliberate with your team.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Case Dossier Notes & Suspicion Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Preliminary Suspicion Tagging */}
        <div className={`p-5 rounded-3xl border space-y-3 ${
          isLight ? 'bg-white border-amber-900/10 game-card-shadow' : 'bg-slate-900/70 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-slate-800' : 'text-slate-300'
            }`}>
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.suspicionRating}</span>
            </span>
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
              taggedSuspicion === 'low'
                ? isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
                : taggedSuspicion === 'high'
                ? isLight ? 'bg-rose-100 text-rose-800' : 'bg-rose-500/20 text-rose-300'
                : taggedSuspicion === 'unverifiable'
                ? isLight ? 'bg-purple-100 text-purple-800' : 'bg-purple-500/20 text-purple-300'
                : isLight ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/20 text-amber-300'
            }`}>
              Status: {taggedSuspicion.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'low', label: t.suspicionLow, color: 'emerald', icon: '🟢' },
              { id: 'medium', label: t.suspicionMedium, color: 'amber', icon: '🟡' },
              { id: 'high', label: t.suspicionHigh, color: 'rose', icon: '🔴' },
              { id: 'unverifiable', label: t.suspicionUnverifiable, color: 'purple', icon: '🟣' },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  audioSystem.playClick();
                  onUpdateSuspicion(item.id as 'low' | 'medium' | 'high' | 'unverifiable');
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 transform active:scale-95 ${
                  taggedSuspicion === item.id
                    ? isLight
                      ? 'bg-amber-100 border-amber-400 text-amber-950 font-black shadow-xs ring-1 ring-amber-400'
                      : 'bg-indigo-950 border-indigo-400 text-white font-black ring-1 ring-indigo-400 shadow-md'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Quick Case Notes */}
        <div className={`p-5 rounded-3xl border space-y-3 ${
          isLight ? 'bg-white border-amber-900/10 game-card-shadow' : 'bg-slate-900/70 border-slate-800'
        }`}>
          <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
            isLight ? 'text-slate-800' : 'text-slate-300'
          }`}>
            <PenTool className="w-3.5 h-3.5 text-indigo-500" />
            <span>Field Notes & Discrepancies</span>
          </span>

          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              value={currentNoteText}
              onChange={(e) => setCurrentNoteText(e.target.value)}
              placeholder="e.g. WHOIS date mismatch..."
              className={`flex-1 px-3 py-2 rounded-xl text-xs border font-medium outline-hidden ${
                isLight 
                  ? 'bg-slate-50 border-slate-200 focus:border-indigo-500 focus:bg-white text-slate-800' 
                  : 'bg-slate-950 border-slate-800 focus:border-cyan-400 text-white'
              }`}
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
            {investigativeNotes.length === 0 ? (
              <p className={`text-[11px] italic ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                No investigative notes recorded yet.
              </p>
            ) : (
              investigativeNotes.map((note, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl text-xs font-medium flex items-center justify-between border ${
                    isLight ? 'bg-slate-50 border-slate-200/80 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="truncate pr-2">• {note}</span>
                  <button
                    type="button"
                    onClick={() => {
                      audioSystem.playClick();
                      onUpdateNotes(investigativeNotes.filter((_, i) => i !== idx));
                    }}
                    className="text-[10px] text-rose-500 hover:text-rose-700 shrink-0 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Forensic SIFT Hint Modal */}
      {isHintOpen && (
        <HintModal
          card={card}
          accessibilitySettings={accessibilitySettings}
          onClose={() => setIsHintOpen(false)}
          onSelectVector={(vector) => {
            setActiveClueType(vector);
            handleActionClick(vector);
          }}
          onAddToNotes={(hint) => {
            onUpdateNotes([...investigativeNotes, hint]);
          }}
        />
      )}
    </div>
  );
};

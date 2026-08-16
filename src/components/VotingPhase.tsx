import React, { useState } from 'react';
import { 
  Vote, 
  ShieldAlert, 
  AlertCircle, 
  Check, 
  Send, 
  Lock, 
  HelpCircle,
  Sparkles,
  Award,
  Inbox,
  ArrowDown,
  CheckCircle2,
  FileText,
  RotateCcw,
  Lightbulb
} from 'lucide-react';
import { PlayerState, AccessibilitySettings } from '../types/game';
import { TRANSLATIONS } from '../data/translations';
import { audioSystem } from '../utils/audio';
import { HintModal } from './HintModal';

interface VotingPhaseProps {
  players: PlayerState[];
  localPlayer: PlayerState;
  accessibilitySettings: AccessibilitySettings;
  onSubmitVote: (targetId: string, reason: string) => void;
}

export const VotingPhase: React.FC<VotingPhaseProps> = ({
  players,
  localPlayer,
  accessibilitySettings,
  onSubmitVote,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [voteReason, setVoteReason] = useState<string>('');
  const [isDragOverBox, setIsDragOverBox] = useState(false);
  const [isBallotDropped, setIsBallotDropped] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);

  const t = TRANSLATIONS[accessibilitySettings.language] || TRANSLATIONS.en;
  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;

  const candidatePlayers = players.filter(p => !p.isLocalUser);
  const selectedPlayer = players.find(p => p.id === selectedTarget);

  const handleSelectTarget = (targetId: string) => {
    setSelectedTarget(targetId);
    setIsBallotDropped(true);
    audioSystem.playSuccessChime();
  };

  const handleDragStart = (e: React.DragEvent, targetId: string) => {
    e.dataTransfer.setData('text/plain', targetId);
    audioSystem.playClick();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverBox(true);
  };

  const handleDragLeave = () => {
    setIsDragOverBox(false);
  };

  const handleDropOnBallotBox = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverBox(false);
    const targetId = e.dataTransfer.getData('text/plain');
    if (targetId) {
      setSelectedTarget(targetId);
      setIsBallotDropped(true);
      audioSystem.playSuccessChime();
    }
  };

  const handleResetBallot = () => {
    audioSystem.playClick();
    setSelectedTarget('');
    setIsBallotDropped(false);
  };

  const handleFinalVoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTarget) return;
    audioSystem.playSuccessChime();
    setHasVoted(true);
    onSubmitVote(
      selectedTarget, 
      voteReason.trim() || 'Identified through SIFT forensic discrepancies and cross-examination anomalies.'
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Phase Header Card */}
      <div className={`p-6 sm:p-7 rounded-3xl border text-center space-y-2 transition-all ${
        isHighContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : isLight
          ? 'bg-white border-amber-900/10 game-card-shadow text-slate-800'
          : 'bg-slate-900/90 border-slate-800 text-white shadow-2xl'
      }`}>
        <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-black uppercase border shadow-2xs ${
          isLight ? 'bg-purple-100 text-purple-900 border-purple-200' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
        }`}>
          <Lock className="w-3.5 h-3.5" />
          <span>Phase 4: Secret Truth Verification Booth</span>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${
          isLight ? 'text-slate-900 font-display' : 'text-white'
        }`}>
          Cast Your Secret Case Ballot
        </h2>
        <p className={`text-xs sm:text-sm max-w-lg mx-auto font-medium ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}>
          Drag and drop a suspect card into the central ballot box, or click to deposit your secret verdict.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={() => {
              audioSystem.playClick();
              setIsHintOpen(true);
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-xs font-bold border transition transform active:scale-95 shadow-xs ${
              isLight
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-500/40'
            }`}
            title="Inspect Verification Guidelines and Case Hints"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{t.hintFeature} & Verification Clues</span>
          </button>
        </div>
      </div>

      {!hasVoted ? (
        <div className="space-y-6">
          {/* CENTRAL SECRET BALLOT BOX (Interactive Drop Zone) */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDropOnBallotBox}
            className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center relative overflow-hidden ${
              isDragOverBox
                ? 'border-amber-400 bg-amber-500/15 scale-[1.02] shadow-xl ring-4 ring-amber-400/30'
                : isBallotDropped
                ? isLight
                  ? 'border-emerald-400 bg-emerald-50/50 shadow-md'
                  : 'border-emerald-500/60 bg-emerald-950/30 shadow-xl'
                : isLight
                ? 'border-slate-300 bg-gradient-to-b from-slate-50 to-amber-50/20 hover:border-amber-400'
                : 'border-slate-700 bg-slate-950/80 hover:border-indigo-500'
            }`}
          >
            {/* 3D Ballot Box Graphic with slot */}
            <div className="relative mb-3">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl border shadow-lg transition-transform ${
                isBallotDropped
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white border-emerald-300 scale-105'
                  : isLight
                  ? 'bg-gradient-to-tr from-amber-400 to-amber-600 text-white border-amber-300'
                  : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white border-indigo-400'
              }`}>
                {isBallotDropped ? <Inbox className="w-10 h-10 animate-bounce" /> : <Vote className="w-10 h-10" />}
              </div>

              {/* Slot Indicator */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-slate-900 rounded-full border border-slate-700 shadow-inner" />
            </div>

            {isBallotDropped ? (
              /* Ballot Deposited Confirmation */
              <div className="space-y-3 animate-pop-card">
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                    isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    BALLOT INSERTED IN VAULT
                  </span>
                </div>

                <div className={`p-4 rounded-2xl border max-w-md mx-auto flex items-center justify-between gap-4 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
                }`}>
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-3xl">
                      {selectedTarget === 'unverifiable_prudent' ? '🟣' : selectedPlayer?.avatar || '👤'}
                    </span>
                    <div>
                      <div className={`text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {selectedTarget === 'unverifiable_prudent' 
                          ? 'Flag: Inconclusive / Do Not Share' 
                          : selectedPlayer?.name}
                      </div>
                      <div className={`text-xs font-medium line-clamp-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {selectedTarget === 'unverifiable_prudent' 
                          ? 'Prudent SIFT Verification Hold' 
                          : `Suspect: "${selectedPlayer?.assignedCard.headline}"`}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetBallot}
                    className="p-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center gap-1 transition"
                    title="Change Vote"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Change</span>
                  </button>
                </div>

                {/* Form to submit final ballot with reasoning */}
                <form onSubmit={handleFinalVoteSubmit} className="max-w-md mx-auto space-y-3 pt-2">
                  <input
                    type="text"
                    value={voteReason}
                    onChange={(e) => setVoteReason(e.target.value)}
                    placeholder="Optional forensic justification / key red flag..."
                    className={`w-full px-4 py-2.5 rounded-2xl text-xs border font-medium outline-hidden ${
                      isLight 
                        ? 'bg-white border-slate-300 focus:border-indigo-500 text-slate-900 shadow-2xs' 
                        : 'bg-slate-900 border-slate-700 focus:border-cyan-400 text-white'
                    }`}
                  />

                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition transform active:scale-95 ${
                      isHighContrast
                        ? 'bg-yellow-400 text-black border-2 border-black hover:bg-yellow-300'
                        : isLight
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/25'
                        : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>Seal & Submit Confidential Ballot</span>
                  </button>
                </form>
              </div>
            ) : (
              /* Empty Drop Zone Prompt */
              <div className="space-y-1.5">
                <h4 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Vault Slot Open
                </h4>
                <p className={`text-xs font-medium max-w-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Drag any suspect card from below and drop it here, or click on a card to insert.
                </p>
                <div className="flex items-center justify-center gap-1 text-[11px] text-amber-500 font-bold pt-1">
                  <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                  <span>Choose from Suspect Cards Below</span>
                </div>
              </div>
            )}
          </div>

          {/* SUSPECT CANDIDATE CARDS (Draggable / Clickable) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-black uppercase tracking-wider block ${
                isLight ? 'text-slate-800' : 'text-slate-300'
              }`}>
                Suspect Information Cards:
              </label>
              <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Tip: Drag to ballot box or click to select
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {candidatePlayers.map(p => {
                const isSelected = selectedTarget === p.id;
                return (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, p.id)}
                    onClick={() => handleSelectTarget(p.id)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-grab active:cursor-grabbing relative select-none game-card-hover ${
                      isSelected
                        ? isHighContrast
                          ? 'bg-yellow-400 text-black border-yellow-300 font-black'
                          : isLight
                          ? 'bg-gradient-to-br from-rose-50 via-white to-amber-50 border-rose-400 ring-2 ring-rose-400/50 text-slate-900 shadow-md'
                          : 'bg-rose-950/70 border-rose-500 ring-2 ring-rose-500/50 text-white shadow-xl'
                        : isLight
                        ? 'bg-white border-slate-200/90 hover:border-amber-400 text-slate-800 game-card-shadow'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className={`text-3xl p-2 rounded-xl border shrink-0 ${
                          isLight ? 'bg-amber-50 border-amber-200' : 'bg-slate-950 border-slate-800'
                        }`}>
                          {p.avatar}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {p.name}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {p.persona?.roleTitle || 'Player'}
                            </span>
                          </div>
                          <div className={`text-xs font-mono font-bold mt-1 line-clamp-1 ${
                            isLight ? 'text-rose-700' : 'text-rose-300/90'
                          }`}>
                            "{p.assignedCard.headline}"
                          </div>
                          <div className={`text-[11px] mt-0.5 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            Publisher: <span className="font-mono">{p.assignedCard.allegedSource.domain}</span>
                          </div>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-pop-card">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg border ${
                          isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}>
                          Drag ✋
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Special "Cannot Verify / Do Not Share" SIFT Option */}
            <div className="pt-2">
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'unverifiable_prudent')}
                onClick={() => handleSelectTarget('unverifiable_prudent')}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-grab active:cursor-grabbing flex items-center justify-between select-none game-card-hover ${
                  selectedTarget === 'unverifiable_prudent'
                    ? isHighContrast
                      ? 'bg-yellow-400 text-black border-yellow-300 font-black'
                      : isLight
                      ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-400/50 text-purple-950 shadow-md'
                      : 'bg-purple-950/70 border-purple-400 ring-2 ring-purple-400/40 text-white shadow-xl'
                    : isLight
                    ? 'bg-white border-purple-200 text-purple-900 hover:bg-purple-50/50 game-card-shadow'
                    : 'bg-slate-950/70 border-purple-500/30 text-purple-300 hover:bg-purple-950/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border text-xl ${
                    isLight ? 'bg-purple-100 border-purple-200 text-purple-700' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  }`}>
                    🟣
                  </div>
                  <div>
                    <div className="text-sm font-black flex items-center gap-2">
                      <span>Flag: Inconclusive Evidence / Do Not Share</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isLight ? 'bg-purple-100 text-purple-900' : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        Prudent Verification
                      </span>
                    </div>
                    <div className={`text-xs mt-0.5 font-medium ${isLight ? 'text-purple-700' : 'text-purple-300/80'}`}>
                      Select this if the available proof is insufficient to verify any claim as authentic or false.
                    </div>
                  </div>
                </div>

                {selectedTarget === 'unverifiable_prudent' ? (
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pop-card">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : (
                  <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg border ${
                    isLight ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-purple-950 border-purple-700 text-purple-300'
                  }`}>
                    Drag ✋
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Sealed Ballot Confirmation View */
        <div className={`p-8 rounded-3xl border text-center space-y-4 animate-pop-card ${
          isLight ? 'bg-white border-emerald-200 game-card-shadow' : 'bg-slate-900 border-emerald-500/40 shadow-2xl'
        }`}>
          {/* Animated Stamp Effect */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-500 animate-stamp-in shadow-lg">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-white font-mono font-black text-xs uppercase tracking-widest mb-2 shadow-xs">
              BALLOT ENCRYPTED & VAULTED
            </div>
            <h3 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Your Vote Has Been Anonymously Cast
            </h3>
            <p className={`text-xs sm:text-sm max-w-md mx-auto mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Awaiting fellow verifiers and AI agents to submit their secret ballots. The truth will be unsealed in the final debrief.
            </p>
          </div>
        </div>
      )}

      {/* Voting Phase SIFT Forensic Hint Modal */}
      {isHintOpen && (
        <HintModal
          card={selectedPlayer?.assignedCard || localPlayer.assignedCard}
          accessibilitySettings={accessibilitySettings}
          onClose={() => setIsHintOpen(false)}
        />
      )}
    </div>
  );
};

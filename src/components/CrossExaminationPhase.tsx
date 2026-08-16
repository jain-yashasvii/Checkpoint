import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Send, 
  Users, 
  ShieldAlert, 
  ArrowRight, 
  Check, 
  Search,
  Sparkles,
  Bot,
  User,
  Lightbulb
} from 'lucide-react';
import { 
  PlayerState, 
  DialogueMessage, 
  AccessibilitySettings 
} from '../types/game';
import { TRANSLATIONS } from '../data/translations';
import { audioSystem } from '../utils/audio';
import { HintModal } from './HintModal';

interface CrossExaminationPhaseProps {
  players: PlayerState[];
  localPlayer: PlayerState;
  messages: DialogueMessage[];
  accessibilitySettings: AccessibilitySettings;
  onSendMessage: (msg: {
    text: string;
    targetPlayerId?: string;
    signGestureKey?: 'fact' | 'evidence' | 'verify' | 'doubt' | 'source' | 'deception';
  }) => void;
  onProceedToVoting: () => void;
}

export const CrossExaminationPhase: React.FC<CrossExaminationPhaseProps> = ({
  players,
  localPlayer,
  messages,
  accessibilitySettings,
  onSendMessage,
  onProceedToVoting,
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    players.find(p => !p.isLocalUser)?.id || ''
  );
  const [customQuestion, setCustomQuestion] = useState('');
  const [isHintOpen, setIsHintOpen] = useState(false);
  const t = TRANSLATIONS[accessibilitySettings.language] || TRANSLATIONS.en;

  const targetPlayer = players.find(p => p.id === selectedTargetId);
  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;

  // Interrogation prompt chips dynamically adapted from target player's card
  const suggestedChips = targetPlayer?.assignedCard.suggestedCrossCheckQuestions || [
    'Can you explain why your publisher domain was only registered recently?',
    'Did any major wire services (AP, Reuters, BBC) corroborate this story?',
    'What do reverse image tools say about the original upload date?',
    'Can you point to a peer-reviewed methodology link for these numbers?',
  ];

  const handleSendPromptChip = (text: string) => {
    audioSystem.playClick();
    onSendMessage({
      text,
      targetPlayerId: selectedTargetId,
      signGestureKey: 'doubt',
    });
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    audioSystem.playClick();
    onSendMessage({
      text: customQuestion.trim(),
      targetPlayerId: selectedTargetId,
      signGestureKey: 'verify',
    });
    setCustomQuestion('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className={`p-6 rounded-3xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isHighContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : isLight
          ? 'bg-white text-slate-800 border-amber-900/10 game-card-shadow'
          : 'bg-slate-900/80 border-slate-800 shadow-2xl'
      }`}>
        <div>
          <span className={`text-xs font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
            isLight ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-indigo-500/20 text-cyan-400 border-indigo-500/30'
          }`}>
            Phase 3: Cross-Examination
          </span>
          <h2 className={`text-xl sm:text-2xl font-black mt-0.5 ${
            isLight ? 'text-slate-900 font-display' : 'text-white'
          }`}>
            Interrogation & Forensic Debate
          </h2>
          <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Confront suspects with WHOIS inconsistencies, timeline gaps, and AI visual anomalies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* SIFT Hints Button */}
          <button
            type="button"
            onClick={() => {
              audioSystem.playClick();
              setIsHintOpen(true);
            }}
            className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl font-bold text-xs border transition transform active:scale-95 shadow-xs ${
              isLight
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-500/40'
            }`}
            title="Inspect Cross-Check Strategy and Forensic Hints"
          >
            <Lightbulb className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{t.hintFeature}</span>
          </button>

          <button
            onClick={() => {
              audioSystem.playSuccessChime();
              onProceedToVoting();
            }}
            className={`flex items-center gap-2 px-7 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition transform active:scale-98 ${
              isHighContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-black'
                : isLight
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
            }`}
          >
            <span>Proceed to Secret Voting</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Target Player Selector & Question Chips */}
        <div className="space-y-4">
          {/* Target Player Selector */}
          <div className={`p-5 rounded-3xl border space-y-3 ${
            isLight ? 'bg-white border-amber-900/10 game-card-shadow' : 'bg-slate-900/70 border-slate-800'
          }`}>
            <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>Select Suspect to Interrogate</span>
            </span>

            <div className="space-y-2">
              {players
                .filter(p => !p.isLocalUser)
                .map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedTargetId(p.id);
                      audioSystem.playClick();
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                      selectedTargetId === p.id
                        ? isHighContrast
                          ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                          : isLight
                          ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-400/30'
                          : 'bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-400/30'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{p.avatar}</span>
                      <div>
                        <div className={`text-xs font-black truncate max-w-[120px] ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}>
                          {p.name}
                        </div>
                        <div className={`text-[10px] truncate max-w-[130px] font-medium ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {p.assignedCard.headline}
                        </div>
                      </div>
                    </div>
                    {selectedTargetId === p.id && (
                      <Check className="w-4 h-4 text-indigo-600" />
                    )}
                  </button>
                ))}
            </div>
          </div>

          {/* Quick Interrogation Prompt Chips */}
          <div className={`p-5 rounded-3xl border space-y-3 ${
            isLight ? 'bg-white border-amber-900/10 game-card-shadow' : 'bg-slate-900/70 border-slate-800'
          }`}>
            <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Targeted Cross-Check Questions</span>
            </span>

            <div className="space-y-2">
              {suggestedChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPromptChip(chip)}
                  className={`w-full p-3 rounded-2xl border text-left text-xs transition leading-snug group ${
                    isLight
                      ? 'bg-slate-50 hover:bg-amber-50/50 border-slate-200 hover:border-amber-300 text-slate-700 font-medium'
                      : 'bg-slate-950/80 hover:bg-indigo-950/60 border-slate-800 hover:border-indigo-500/40 text-slate-200'
                  }`}
                >
                  <span className="text-indigo-600 group-hover:text-indigo-700 font-black mr-1">?</span>
                  "{chip}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Live Debate Feed & Interrogation Console */}
        <div className="lg:col-span-2 space-y-4">
          {/* Messages Feed */}
          <div className={`p-6 rounded-3xl border h-[420px] flex flex-col justify-between ${
            isLight ? 'bg-white border-amber-900/10 game-card-shadow' : 'bg-slate-900/70 border-slate-800 shadow-xl'
          }`}>
            <div className="overflow-y-auto space-y-3 pr-1">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center py-16">
                  <MessageSquare className="w-8 h-8 text-slate-400 mb-2 opacity-50" />
                  <span className="font-medium">The cross-examination floor is open. Select a suspect and ask a targeted question!</span>
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-2xl border transition-all text-xs space-y-1 ${
                      msg.type === 'question'
                        ? isLight
                          ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
                          : 'bg-indigo-950/50 border-indigo-500/40 text-slate-200'
                        : msg.type === 'defense'
                        ? isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-800'
                          : 'bg-slate-950/70 border-slate-800 text-slate-200'
                        : isLight
                        ? 'bg-amber-50 border-amber-200 text-amber-950 font-mono'
                        : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-200 font-mono'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-black">
                      <div className="flex items-center gap-1.5">
                        <span>{msg.senderAvatar}</span>
                        <span className={isLight ? 'text-slate-900' : 'text-white'}>{msg.senderName}</span>
                        {msg.targetPlayerId && (
                          <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                            → questioning {players.find(p => p.id === msg.targetPlayerId)?.name}
                          </span>
                        )}
                      </div>
                      <span className={`uppercase font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{msg.type}</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed font-medium">
                      "{msg.text}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Custom Question Input */}
            <form onSubmit={handleSendCustom} className={`mt-3 pt-3 border-t flex gap-2 ${
              isLight ? 'border-slate-100' : 'border-slate-800'
            }`}>
              <input
                type="text"
                value={customQuestion}
                onChange={e => setCustomQuestion(e.target.value)}
                placeholder={`Ask ${targetPlayer?.name || 'suspect'} about their sources, timeline, or evidence...`}
                className={`flex-1 px-4 py-2.5 rounded-2xl border text-xs font-medium focus:outline-none focus:ring-2 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-indigo-500 placeholder-slate-400'
                    : 'bg-slate-950 border-slate-700 text-white focus:ring-indigo-500'
                }`}
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Interrogate</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Cross-Examination SIFT Forensic Hint Modal */}
      {isHintOpen && (
        <HintModal
          card={targetPlayer?.assignedCard || localPlayer.assignedCard}
          accessibilitySettings={accessibilitySettings}
          onClose={() => setIsHintOpen(false)}
        />
      )}
    </div>
  );
};

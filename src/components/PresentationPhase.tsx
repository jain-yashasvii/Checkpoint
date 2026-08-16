import React, { useState } from 'react';
import { 
  Clock, 
  Mic, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Volume2, 
  ShieldCheck, 
  ArrowRight,
  User,
  Bot,
  VolumeX,
  Radio
} from 'lucide-react';
import { PlayerState, AccessibilitySettings } from '../types/game';
import { TRANSLATIONS } from '../data/translations';
import { audioSystem } from '../utils/audio';

interface PresentationPhaseProps {
  currentSpeaker: PlayerState;
  players: PlayerState[];
  timeRemaining: number;
  accessibilitySettings: AccessibilitySettings;
  onSendDefenseStatement: (statement: string, completedCheckpoints: number[]) => void;
  onNextSpeaker: () => void;
}

const CHECKPOINTS = [
  { id: 1, title: '1. Source Provenance', prompt: 'I checked the publisher domain and author credentials...' },
  { id: 2, title: '2. Evidence Quality', prompt: 'The methodology and data points are substantiated because...' },
  { id: 3, title: '3. Temporal Context', prompt: 'The timeline aligns with real-world events without date drift...' },
  { id: 4, title: '4. Lateral Cross-Check', prompt: 'Independent wire services and databases corroborate this...' },
  { id: 5, title: '5. AI & Media Forensics', prompt: 'Visual forensics and audio spectrum reveal no synthetic anomalies...' },
];

export const PresentationPhase: React.FC<PresentationPhaseProps> = ({
  currentSpeaker,
  players,
  timeRemaining,
  accessibilitySettings,
  onSendDefenseStatement,
  onNextSpeaker,
}) => {
  const [completedCheckpoints, setCompletedCheckpoints] = useState<number[]>([1]);
  const [defenseText, setDefenseText] = useState('');
  const t = TRANSLATIONS[accessibilitySettings.language] || TRANSLATIONS.en;

  const checkpointsList = [
    { id: 1, title: t.checkpointSource, prompt: 'I checked the publisher domain and author credentials...' },
    { id: 2, title: t.checkpointEvidence, prompt: 'The methodology and data points are substantiated because...' },
    { id: 3, title: t.checkpointContext, prompt: 'The timeline aligns with real-world events without date drift...' },
    { id: 4, title: t.checkpointCrossCheck, prompt: 'Independent wire services and databases corroborate this...' },
    { id: 5, title: t.checkpointManipulation, prompt: 'Visual forensics and audio spectrum reveal no synthetic anomalies...' },
  ];

  const isLocalUserSpeaking = currentSpeaker.isLocalUser;
  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;

  const toggleCheckpoint = (id: number) => {
    audioSystem.playClick();
    if (completedCheckpoints.includes(id)) {
      setCompletedCheckpoints(completedCheckpoints.filter(c => c !== id));
    } else {
      setCompletedCheckpoints([...completedCheckpoints, id]);
    }
  };

  const handleAppendPrompt = (prompt: string) => {
    audioSystem.playClick();
    setDefenseText(prev => (prev ? `${prev} ${prompt}` : prompt));
  };

  const handleSubmitDefense = (e: React.FormEvent) => {
    e.preventDefault();
    const finalStatement = defenseText.trim() || `I stand by my card: ${currentSpeaker.assignedCard.claimSummary}`;
    audioSystem.playSuccessChime();
    onSendDefenseStatement(finalStatement, completedCheckpoints);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* VIBRANT PARTICIPANT ROSTER / PODIUM TOKENS */}
      <div className={`p-4 sm:p-5 rounded-3xl border transition-all ${
        isLight ? 'bg-white border-amber-900/10 game-card-shadow' : 'bg-slate-900/80 border-slate-800'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-3 px-1">
          <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
            isLight ? 'text-slate-800' : 'text-slate-300'
          }`}>
            <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{t.deliberationFloor}</span>
          </span>
          <span className={`text-[11px] font-mono font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Speaker {players.findIndex(p => p.id === currentSpeaker.id) + 1} of {players.length}
          </span>
        </div>

        {/* Podium Token List */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {players.map(p => {
            const isSpeaking = p.id === currentSpeaker.id;
            return (
              <div
                key={p.id}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3 relative overflow-hidden ${
                  isSpeaking
                    ? isLight
                      ? 'bg-gradient-to-r from-amber-50 to-white border-amber-400 ring-2 ring-amber-400/50 shadow-md scale-105'
                      : 'bg-indigo-950/90 border-indigo-400 ring-2 ring-indigo-400/50 shadow-lg scale-105'
                    : isLight
                    ? 'bg-slate-50/70 border-slate-200/80 opacity-75'
                    : 'bg-slate-950/50 border-slate-800 opacity-60'
                }`}
              >
                {/* Glowing Avatar Token */}
                <div className="relative shrink-0">
                  <div className={`text-2xl p-2 rounded-xl border relative ${
                    isSpeaking 
                      ? 'bg-amber-400/25 border-amber-400 ring-2 ring-amber-400/40 animate-pulse' 
                      : isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    {p.avatar}
                  </div>
                  {isSpeaking && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full animate-ping ring-2 ring-white" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-black truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {p.name}
                    </span>
                    {p.isAI && <span className="text-[10px] text-indigo-500 font-mono">AI</span>}
                  </div>
                  <div className={`text-[10px] font-mono truncate flex items-center gap-1.5 ${
                    isSpeaking ? 'text-amber-700 font-bold' : isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {isSpeaking ? (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        <span>LIVE ON AIR</span>
                        {/* Audio equalizer animation */}
                        <span className="inline-flex items-end gap-0.5 h-3 ml-1">
                          <span className="w-0.5 bg-amber-600 rounded-full animate-sound-wave-1" />
                          <span className="w-0.5 bg-amber-600 rounded-full animate-sound-wave-2" />
                          <span className="w-0.5 bg-amber-600 rounded-full animate-sound-wave-3" />
                          <span className="w-0.5 bg-amber-600 rounded-full animate-sound-wave-4" />
                        </span>
                      </span>
                    ) : p.hasPresented ? '✓ Done' : 'Waiting'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SPEAKER SPOTLIGHT HEADER */}
      <div className={`p-6 rounded-3xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isHighContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : isLight
          ? 'bg-white text-slate-800 border-amber-900/10 game-card-shadow'
          : 'bg-slate-900/90 border-slate-800 shadow-2xl'
      }`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`text-4xl p-3.5 rounded-2xl border shadow-md ${
              isLight ? 'bg-gradient-to-br from-amber-50 to-white border-amber-300' : 'bg-slate-950 border-indigo-500/40'
            }`}>
              {currentSpeaker.avatar}
            </div>
            {isLocalUserSpeaking && (
              <span className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider animate-pulse shadow-xs">
                YOUR TURN
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                isLight ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-indigo-500/20 text-cyan-400 border-indigo-500/30'
              }`}>
                Phase 2: Timed Presentation
              </span>
              {currentSpeaker.isAI && (
                <span className={`text-[10px] font-bold flex items-center gap-1 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  <Bot className="w-3.5 h-3.5 text-indigo-500" /> AI Persona
                </span>
              )}
            </div>
            <h2 className={`text-xl sm:text-2xl font-black mt-0.5 ${
              isLight ? 'text-slate-900 font-display' : 'text-white'
            }`}>
              {currentSpeaker.name}'s Defense Statement
            </h2>
            <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {currentSpeaker.persona?.roleTitle || 'Truth Verifier Defense'}
            </p>
          </div>
        </div>

        {/* Big Countdown Timer */}
        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border font-mono font-black text-xl shadow-xs ${
          timeRemaining <= 10
            ? isLight
              ? 'bg-rose-50 text-rose-600 border-rose-300 animate-bounce'
              : 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-bounce'
            : isLight
            ? 'bg-amber-50 text-amber-900 border-amber-200'
            : 'bg-indigo-950/60 text-cyan-300 border-indigo-500/30'
        }`}>
          <Clock className="w-5 h-5 text-amber-600" />
          <span>00:{timeRemaining < 10 ? `0${timeRemaining}` : timeRemaining}</span>
        </div>
      </div>

      {/* Speaker's Card Summary Reminder */}
      <div className={`p-5 rounded-3xl border space-y-2 ${
        isLight ? 'bg-white border-amber-900/10 game-card-shadow' : 'bg-slate-950/70 border-slate-800'
      }`}>
        <span className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
          isLight ? 'text-slate-500' : 'text-slate-400'
        }`}>
          <span>Presented Claim Headline</span>
        </span>
        <h3 className={`text-base sm:text-lg font-black leading-snug ${
          isLight ? 'text-slate-900 font-display' : 'text-white'
        }`}>
          "{currentSpeaker.assignedCard.headline}"
        </h3>
        <p className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Alleged Source: <span className={`font-mono font-bold ${
            isLight ? 'text-indigo-600' : 'text-cyan-400'
          }`}>{currentSpeaker.assignedCard.allegedSource.name}</span> ({currentSpeaker.assignedCard.allegedSource.domain})
        </p>
      </div>

      {/* Structured 5 Checkpoint Defense Builder (If Local User Speaking) */}
      {isLocalUserSpeaking ? (
        <form onSubmit={handleSubmitDefense} className="space-y-4">
          <div className={`p-6 rounded-3xl border space-y-4 ${
            isLight
              ? 'bg-white border-amber-900/10 game-card-shadow'
              : 'bg-slate-900/90 border-indigo-500/40 shadow-xl'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-100' : 'border-slate-800'
            }`}>
              <h4 className={`text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}>
                <Mic className="w-4 h-4 text-indigo-500" />
                <span>Structured 5-Checkpoint Defense Matrix</span>
              </h4>
              <span className={`text-xs font-mono font-black ${
                isLight ? 'text-emerald-700' : 'text-emerald-400'
              }`}>
                {completedCheckpoints.length} / 5 Checked
              </span>
            </div>

            {/* Checkpoints Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {checkpointsList.map(cp => {
                const checked = completedCheckpoints.includes(cp.id);
                return (
                  <button
                    type="button"
                    key={cp.id}
                    onClick={() => toggleCheckpoint(cp.id)}
                    className={`p-3.5 rounded-2xl border text-left text-xs transition flex items-start justify-between ${
                      checked
                        ? isHighContrast
                          ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                          : isLight
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold shadow-xs'
                          : 'bg-indigo-950/80 border-indigo-400 text-white shadow-md'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-black">{cp.title}</div>
                      <div className={`text-[10px] mt-0.5 line-clamp-1 font-medium ${
                        isLight ? 'text-slate-500' : 'opacity-75'
                      }`}>{cp.prompt}</div>
                    </div>
                    {checked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Speech Builder Chips */}
            <div>
              <span className={`text-[11px] font-black uppercase tracking-wider block mb-1.5 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Quick Verbal Defense Chips (Click to Insert)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'My domain WHOIS record is legitimate.',
                  'Multiple independent wires confirm this.',
                  'No Photoshop or GAN compression traces found.',
                  'The timeline perfectly matches official reports.',
                  'Notice the lack of emotional urgency.',
                ].map((chip, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleAppendPrompt(chip)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition ${
                      isLight
                        ? 'bg-slate-50 hover:bg-amber-50 border-slate-200 hover:border-amber-300 text-slate-700'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-cyan-300'
                    }`}
                  >
                    + "{chip}"
                  </button>
                ))}
              </div>
            </div>

            {/* Defense Text Area */}
            <div>
              <textarea
                rows={3}
                value={defenseText}
                onChange={e => setDefenseText(e.target.value)}
                placeholder="Deliver your 60-second defense explaining why your information is authentic, or deflect scrutiny if bluffing..."
                className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-indigo-500 placeholder-slate-400'
                    : 'bg-slate-950 border-slate-700 text-white focus:ring-indigo-500'
                }`}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className={`flex items-center gap-2 px-7 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition transform active:scale-95 ${
                  isHighContrast
                    ? 'bg-yellow-400 text-black border-2 border-black hover:bg-yellow-300'
                    : isLight
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-600 hover:to-cyan-600'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Deliver Defense Statement</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* AI Bot or Other Player Delivering Defense */
        <div className={`p-6 rounded-3xl border space-y-4 ${
          isLight
            ? 'bg-white border-amber-900/10 game-card-shadow'
            : 'bg-slate-900/90 border-slate-800 shadow-xl'
        }`}>
          <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${
            isLight ? 'text-indigo-700' : 'text-cyan-300'
          }`}>
            <Mic className="w-4 h-4 animate-pulse text-indigo-500" />
            <span>Listening to {currentSpeaker.name}'s Defense:</span>
          </div>

          <div className={`p-5 rounded-2xl border text-sm sm:text-base leading-relaxed italic ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-800'
              : 'bg-slate-950 border-slate-800 text-slate-200'
          }`}>
            "{currentSpeaker.persona?.debateStyle || 'I have verified this claim through primary sources and cross-examined the evidence thoroughly.'}"
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                audioSystem.playClick();
                onNextSpeaker();
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800'
                  : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white'
              }`}
            >
              <span>Next Speaker Presentation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Users, 
  Bot, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  Play, 
  Settings, 
  HelpCircle,
  Globe,
  Radio,
  Clock,
  Coins,
  Compass,
  Search,
  Dice5,
  BadgeCheck,
  Globe2,
  BookOpen,
  Flame,
  Zap,
  Trophy
} from 'lucide-react';
import { 
  GameMode, 
  Demographic, 
  PlayerState, 
  PlayerPersona, 
  AccessibilitySettings, 
  GameSettings,
  MILTheme
} from '../types/game';
import { AI_PERSONAS } from '../data/scenarios';
import { TRANSLATIONS } from '../data/translations';
import { audioSystem } from '../utils/audio';

interface LobbyViewProps {
  gameMode: GameMode;
  onSetGameMode: (mode: GameMode) => void;
  roomCode: string;
  onGenerateRoomCode: () => void;
  players: PlayerState[];
  localPlayer: PlayerState;
  gameSettings: GameSettings;
  accessibilitySettings: AccessibilitySettings;
  onUpdateGameSettings: (settings: GameSettings) => void;
  onToggleReady: () => void;
  onStartMatch: () => void;
  onOpenOnboarding: () => void;
  onOpenPassport: () => void;
  onOpenMILHub?: () => void;
  onOpenLeaderboard?: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  gameMode,
  onSetGameMode,
  roomCode,
  onGenerateRoomCode,
  players,
  localPlayer,
  gameSettings,
  accessibilitySettings,
  onUpdateGameSettings,
  onToggleReady,
  onStartMatch,
  onOpenOnboarding,
  onOpenPassport,
  onOpenMILHub,
  onOpenLeaderboard,
}) => {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[accessibilitySettings.language] || TRANSLATIONS.en;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    audioSystem.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Playful Banner */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
        isHighContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : isLight
          ? 'bg-white text-slate-800 border-amber-900/10 shadow-sm game-card-shadow'
          : 'bg-slate-900/90 text-white border-slate-800 shadow-xl'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 ${
              isLight ? 'bg-amber-100/80 border border-amber-300/60 text-amber-900' : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
            }`}>
              🔍
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isLight ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-indigo-500/20 text-cyan-300 border border-indigo-500/30'
                }`}>
                  {t.gameSubtitle}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isLight ? 'bg-rose-100 text-rose-800' : 'bg-pink-500/20 text-pink-300'
                }`}>
                  MIL Board Edition
                </span>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900 font-display' : 'text-white'}`}>
                {t.gameTitle}
              </h1>
            </div>
          </div>

          {/* Mode Toggle Pills (Solo AI vs Multiplayer Lobby) */}
          <div className={`flex items-center p-1.5 rounded-2xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <button
              onClick={() => {
                onSetGameMode('solo_ai');
                audioSystem.playClick();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                gameMode === 'solo_ai'
                  ? isHighContrast
                    ? 'bg-yellow-400 text-black font-black'
                    : isLight
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200 font-extrabold'
                    : 'bg-indigo-600 text-white shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-4 h-4 text-sky-500" />
              <span>{t.soloMode}</span>
            </button>

            <button
              onClick={() => {
                onSetGameMode('multiplayer_lobby');
                audioSystem.playClick();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                gameMode === 'multiplayer_lobby'
                  ? isHighContrast
                    ? 'bg-yellow-400 text-black font-black'
                    : isLight
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200 font-extrabold'
                    : 'bg-indigo-600 text-white shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4 text-rose-500" />
              <span>{t.multiplayerMode}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global MIL Themes Hub Strip */}
      <div className={`p-4 sm:p-5 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
        isHighContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : isLight
          ? 'bg-gradient-to-r from-indigo-50/80 via-amber-50/60 to-white border-indigo-200/80 shadow-2xs'
          : 'bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 border-indigo-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 ${
            isLight ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-indigo-600/30 text-cyan-300 border border-indigo-500/40'
          }`}>
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isLight ? 'bg-indigo-100 text-indigo-900' : 'bg-indigo-500/20 text-cyan-300'
              }`}>
                Global MIL Framework
              </span>
              <span className={`text-[10px] font-bold ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
                5 Core Verification Tracks
              </span>
            </div>
            <div className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Explore AI & MIL, Pedagogy, Community Impact, Youth Engagement & Open Track
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenLeaderboard && (
            <button
              type="button"
              onClick={() => {
                audioSystem.playClick();
                onOpenLeaderboard();
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border shadow-xs transition shrink-0 ${
                isHighContrast
                  ? 'bg-yellow-400 text-black border-2 border-black'
                  : isLight
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 hover:border-amber-400'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.worldLeaderboard} (Top 10)</span>
            </button>
          )}

          {onOpenMILHub && (
            <button
              type="button"
              onClick={() => {
                audioSystem.playClick();
                onOpenMILHub();
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border shadow-xs transition shrink-0 ${
                isHighContrast
                  ? 'bg-yellow-400 text-black border-2 border-black'
                  : isLight
                  ? 'bg-white hover:bg-slate-50 text-indigo-700 border-indigo-200 hover:border-indigo-300'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Explore Themes & Curriculum</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Player Roster & Match Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Player Roster */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-6 rounded-3xl border transition-all ${
            isHighContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : isLight
              ? 'bg-white border-amber-900/10 game-card-shadow'
              : 'bg-slate-900/80 border-slate-800 shadow-xl'
          }`}>
            <div className={`flex items-center justify-between pb-4 mb-4 border-b ${
              isLight ? 'border-slate-100' : 'border-slate-800'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isLight ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-600/20 text-indigo-400'}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className={`text-base font-black tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Investigator Roster
                  </h2>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {players.length} Investigators gathered at the Case Table
                  </p>
                </div>
              </div>

              {/* Room Code Pill if Multiplayer */}
              {gameMode === 'multiplayer_lobby' && (
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                    isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-slate-950 border-indigo-500/40 text-cyan-300'
                  }`}>
                    <span>TABLE PIN:</span>
                    <span className="tracking-widest font-black">{roomCode}</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className={`p-2 rounded-xl transition ${
                      isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    title="Copy Room Code"
                    aria-label="Copy Room Code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {/* Players Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {players.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all relative ${
                    p.isLocalUser
                      ? isLight
                        ? 'bg-gradient-to-br from-amber-50/80 to-indigo-50/50 border-amber-300/80 shadow-sm ring-2 ring-amber-400/30'
                        : 'bg-indigo-950/40 border-indigo-500/50 ring-1 ring-indigo-500/30'
                      : isLight
                      ? 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`text-3xl p-2.5 rounded-2xl border shrink-0 shadow-sm ${
                        isLight ? 'bg-white border-amber-200' : 'bg-slate-900 border-slate-800'
                      }`}>
                        {p.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-bold truncate max-w-[130px] ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}>
                            {p.name}
                          </span>
                          {p.isLocalUser && (
                            <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-amber-400 text-amber-950">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {p.persona?.roleTitle || (p.isHost ? 'Chief Investigator' : 'Truth Verifier')}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                        p.ready
                          ? isLight
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isLight
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {p.ready ? '✓ READY' : 'PREPARING'}
                      </span>
                      {p.isAI && (
                        <span className={`text-[10px] font-semibold flex items-center gap-1 mt-1 ${
                          isLight ? 'text-indigo-600' : 'text-cyan-400'
                        }`}>
                          <Bot className="w-3 h-3" /> AI Detective
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Personality / Bio */}
                  {p.persona && (
                    <div className={`mt-2 pt-2 border-t text-[11px] line-clamp-2 ${
                      isLight ? 'border-slate-200/80 text-slate-600' : 'border-slate-800/80 text-slate-400'
                    }`}>
                      <span className={isLight ? 'text-indigo-700 font-bold' : 'text-indigo-300 font-semibold'}>
                        Specialty: 
                      </span>{' '}
                      {p.persona.personalityDescription}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* AI Bot Hint */}
            {gameMode === 'solo_ai' && (
              <div className={`mt-4 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs ${
                isLight ? 'border-slate-100 text-slate-600' : 'border-slate-800 text-slate-400'
              }`}>
                <span className="flex items-center gap-1.5">
                  <Bot className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-cyan-400'}`} />
                  <span>AI detectives simulate authentic deliberation, skepticism, and SIFT verification.</span>
                </span>
                <button
                  onClick={onOpenOnboarding}
                  className={`font-bold underline ${isLight ? 'text-indigo-600 hover:text-indigo-800' : 'text-indigo-400 hover:text-indigo-300'}`}
                >
                  Change Demographic Theme
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Match Configuration & Controls */}
        <div className="space-y-4">
          <div className={`p-6 rounded-3xl border space-y-4 transition-all ${
            isHighContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : isLight
              ? 'bg-white border-amber-900/10 game-card-shadow'
              : 'bg-slate-900/80 border-slate-800 shadow-xl'
          }`}>
            <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
              isLight ? 'text-slate-800' : 'text-slate-300'
            }`}>
              <Settings className={`w-4 h-4 ${isLight ? 'text-amber-600' : 'text-cyan-400'}`} />
              <span>Case File Settings</span>
            </h3>

            {/* Demographic Category Indicator */}
            <div className={`p-3.5 rounded-2xl border ${
              isLight ? 'bg-amber-50/60 border-amber-200/80' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className={`text-[10px] font-bold uppercase tracking-wider ${
                isLight ? 'text-amber-800' : 'text-slate-400'
              }`}>
                Case Subject Area
              </div>
              <div className={`text-sm font-black capitalize mt-0.5 ${
                isLight ? 'text-slate-900' : 'text-cyan-300'
              }`}>
                {gameSettings.demographic === 'teen' && 'Youth Trends & Social Media'}
                {gameSettings.demographic === 'college' && 'Academic Research & Preprints'}
                {gameSettings.demographic === 'professional' && 'Corporate & Cyber Deceptions'}
                {gameSettings.demographic === 'senior' && 'Community & Healthcare Scams'}
              </div>
            </div>

            {/* Rounds & Investigation Tokens Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className={`p-3 rounded-2xl border text-center ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className={`text-[10px] font-bold uppercase flex items-center justify-center gap-1 ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  <Clock className="w-3 h-3 text-indigo-500" /> Phases
                </div>
                <div className={`text-base font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  4 Rounds
                </div>
              </div>

              {/* Golden Coin Token Badge */}
              <div className={`p-3 rounded-2xl border text-center ${
                isLight ? 'bg-amber-50 border-amber-300 shadow-sm' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className={`text-[10px] font-bold uppercase flex items-center justify-center gap-1 ${
                  isLight ? 'text-amber-800' : 'text-amber-400'
                }`}>
                  <Coins className="w-3.5 h-3.5 text-amber-500 animate-coin" /> Tokens
                </div>
                <div className={`text-base font-black mt-1 font-mono ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>
                  🪙 5 / Round
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  onToggleReady();
                  audioSystem.playClick();
                }}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition border ${
                  localPlayer.ready
                    ? isLight
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm ring-1 ring-emerald-300'
                      : 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                    : isLight
                    ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {localPlayer.ready ? '✓ Ready to Investigate' : 'Click to Set Ready'}
              </button>

              <button
                onClick={() => {
                  audioSystem.playSuccessChime();
                  onStartMatch();
                }}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition transform active:scale-98 ${
                  isHighContrast
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-black'
                    : isLight
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                    : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white shadow-indigo-500/25'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.startMatch}</span>
              </button>
            </div>

            {/* Quick Passport Link */}
            <button
              onClick={() => {
                audioSystem.playClick();
                onOpenPassport();
              }}
              className={`w-full py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-slate-950/80 hover:bg-slate-950 border-slate-800 text-indigo-300'
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-500" />
              <span>{t.viewPassport}</span>
            </button>

            {/* Quick World Leaderboard Link */}
            {onOpenLeaderboard && (
              <button
                onClick={() => {
                  audioSystem.playClick();
                  onOpenLeaderboard();
                }}
                className={`w-full py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  isLight
                    ? 'bg-amber-50/70 hover:bg-amber-100 text-amber-900 border-amber-200'
                    : 'bg-slate-950/80 hover:bg-slate-950 border-slate-800 text-amber-300'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>{t.worldLeaderboard} (Top 10)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


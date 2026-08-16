import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  X, 
  Flame, 
  BarChart2, 
  Clock, 
  Compass, 
  ChevronRight, 
  Star, 
  Zap, 
  Search, 
  UserCheck, 
  Play,
  ArrowUpRight,
  TrendingUp,
  Award,
  ArrowLeft,
  Home
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VerificationPassport, AccessibilitySettings, Demographic } from '../types/game';
import { LeaderboardPlayer, LeaderboardTimeframe, LeaderboardCategoryFilter } from '../types/leaderboard';
import { WorldLeaderboardService } from '../services/leaderboardService';
import { audioSystem } from '../utils/audio';

interface WorldLeaderboardModalProps {
  passport: VerificationPassport;
  accessibilitySettings: AccessibilitySettings;
  onClose: () => void;
  onStartChallengeMatch?: (demographic: Demographic) => void;
}

export const WorldLeaderboardModal: React.FC<WorldLeaderboardModalProps> = ({
  passport,
  accessibilitySettings,
  onClose,
  onStartChallengeMatch,
}) => {
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('all_time');
  const [categoryFilter, setCategoryFilter] = useState<LeaderboardCategoryFilter>('all');
  const [demographicFilter, setDemographicFilter] = useState<Demographic | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(true);
  const [topTen, setTopTen] = useState<LeaderboardPlayer[]>([]);
  const [userStanding, setUserStanding] = useState<(LeaderboardPlayer & { rankPercentage: number; pointsToNextRank: number }) | null>(null);
  const [totalParticipants, setTotalParticipants] = useState<number>(14820);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardPlayer | null>(null);

  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;

  // Fetch leaderboard data
  const loadLeaderboardData = async () => {
    setLoading(true);
    try {
      const data = await WorldLeaderboardService.fetchTopPlayers(
        passport,
        timeframe,
        categoryFilter,
        demographicFilter
      );
      setTopTen(data.topTen);
      setUserStanding(data.userStanding);
      setTotalParticipants(data.totalGlobalParticipants);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      console.error('Failed to load leaderboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboardData();
  }, [passport, timeframe, categoryFilter, demographicFilter]);

  // Trigger celebration if user is in Top 3
  useEffect(() => {
    if (userStanding && userStanding.rank <= 3) {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#3B82F6', '#10B981', '#EC4899'],
        });
      } catch {
        // Fallback
      }
    }
  }, [userStanding]);

  // Filtered list by search
  const filteredPlayers = topTen.filter(p => 
    p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top3 = filteredPlayers.slice(0, 3);
  const ranks4to10 = filteredPlayers.slice(3);

  const handleInspectPlayer = (player: LeaderboardPlayer) => {
    audioSystem.playClick();
    setSelectedPlayer(player);
  };

  // Escape key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPlayer) {
          setSelectedPlayer(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, selectedPlayer]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="world-leaderboard-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          audioSystem.playClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        className={`w-full max-w-4xl rounded-3xl p-5 sm:p-7 border-2 transition-all my-6 relative overflow-hidden shadow-2xl ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : isLight
            ? 'bg-[#FCFAF8] text-slate-800 border-amber-900/20 shadow-amber-950/10'
            : 'bg-slate-900 text-slate-100 border-indigo-500/40 shadow-2xl'
        }`}
      >
        {/* Subtle Ambient Foil Header Glow */}
        {!isHighContrast && (
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500" />
        )}

        {/* Modal Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b ${
          isLight ? 'border-amber-900/10' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md ${
              isLight ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/25' : 'bg-indigo-600/30 text-amber-300 border border-indigo-500/40'
            }`}>
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="world-leaderboard-title" className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-900 font-display' : 'text-white'}`}>
                  World Leaderboard
                </h2>
                <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-indigo-500/20 text-cyan-300 border-indigo-500/40'
                }`}>
                  TOP 10 SIFT VERIFIERS
                </span>
              </div>
              <p className={`text-xs font-medium mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Global rankings based on Verification Passport points, accuracy rate, and detected imposters
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
            {/* Live Sync Status & Refresh Button */}
            <button
              onClick={() => {
                audioSystem.playClick();
                loadLeaderboardData();
              }}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition ${
                isLight 
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs' 
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
              }`}
              title="Refresh Global Leaderboard"
              aria-label="Refresh Global Leaderboard"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* Back to Home / Lobby Button */}
            <button
              onClick={() => {
                audioSystem.playClick();
                onClose();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border shadow-xs transition transform active:scale-95 ${
                isHighContrast
                  ? 'bg-yellow-400 text-black border-2 border-black hover:bg-yellow-300'
                  : isLight
                  ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border-indigo-200'
                  : 'bg-indigo-950/60 hover:bg-indigo-900/80 text-cyan-300 border-indigo-500/40'
              }`}
              title="Return to Game Lobby (Esc)"
              aria-label="Return to Game Lobby"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            {/* Icon-only Close (X) button */}
            <button
              onClick={() => {
                audioSystem.playClick();
                onClose();
              }}
              className={`p-2 rounded-xl border transition transform active:scale-95 ${
                isLight
                  ? 'bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-700 border-slate-200'
                  : 'bg-slate-800 hover:bg-rose-950/50 hover:text-rose-400 text-slate-300 border-slate-700'
              }`}
              aria-label="Close World Leaderboard"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="space-y-3 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Timeframe Toggle (All-Time vs Weekly Sprint) */}
            <div className={`flex items-center p-1 rounded-2xl border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => {
                  audioSystem.playClick();
                  setTimeframe('all_time');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  timeframe === 'all_time'
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
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>All-Time Champions</span>
              </button>

              <button
                onClick={() => {
                  audioSystem.playClick();
                  setTimeframe('weekly_sprint');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  timeframe === 'weekly_sprint'
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
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Weekly SIFT Sprint</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative flex-1 max-w-xs min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search verifier, country, city..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border transition outline-none ${
                  isLight 
                    ? 'bg-white border-slate-200 text-slate-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20' 
                    : 'bg-slate-950 border-slate-800 text-slate-100 focus:border-indigo-500'
                }`}
              />
            </div>
          </div>

          {/* Verification Skill Domain Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className={`text-[11px] font-bold mr-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Domain:
            </span>
            {[
              { id: 'all', label: 'All Specialties' },
              { id: 'ai_manipulation', label: '✦ AI & Deepfakes' },
              { id: 'source', label: '◆ Source Integrity' },
              { id: 'evidence', label: '▲ Evidence & Data' },
              { id: 'context', label: '⬟ Geolocation & Context' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  audioSystem.playClick();
                  setCategoryFilter(tab.id as LeaderboardCategoryFilter);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition ${
                  categoryFilter === tab.id
                    ? isLight
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-extrabold shadow-2xs'
                      : 'bg-indigo-600/30 text-cyan-300 border-indigo-500'
                    : isLight
                    ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN LEADERBOARD BODY */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
            <p className={`text-xs font-mono font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Connecting to Global Fact-Checking Registry...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* TOP 3 PODIUM DISPLAY */}
            {top3.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                {/* 2nd Place (Left) */}
                {top3[1] && (
                  <div
                    onClick={() => handleInspectPlayer(top3[1])}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer transform hover:-translate-y-1 relative order-2 md:order-1 ${
                      top3[1].isLocalUser
                        ? isLight
                          ? 'bg-gradient-to-b from-amber-50 to-white border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                          : 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-400/30'
                        : isLight
                        ? 'bg-gradient-to-b from-slate-100 to-white border-slate-200 shadow-sm hover:border-slate-300'
                        : 'bg-gradient-to-b from-slate-800/80 to-slate-900 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 border border-slate-300 text-[10px] font-black uppercase shadow-2xs">
                        <span>🥈 2ND PLACE</span>
                      </div>
                      <span className="text-xl" title={top3[1].countryName}>{top3[1].flag}</span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="text-3xl p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm mb-2">
                        {top3[1].avatar}
                      </div>
                      <div className="flex items-center gap-1 font-bold text-sm">
                        <span className={`truncate max-w-[130px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {top3[1].userName}
                        </span>
                        {top3[1].isLocalUser && (
                          <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-amber-400 text-amber-950 font-bold">YOU</span>
                        )}
                      </div>
                      <p className={`text-[11px] truncate max-w-[170px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {top3[1].city}, {top3[1].countryName}
                      </p>

                      <div className={`mt-3 py-1.5 px-3 rounded-xl w-full flex items-center justify-between border ${
                        isLight ? 'bg-amber-50 border-amber-200/80 text-amber-950' : 'bg-slate-950 border-slate-800 text-amber-300'
                      }`}>
                        <span className="text-[10px] font-bold uppercase">Passport Pts</span>
                        <span className="text-xs font-black font-mono">{top3[1].verificationPoints}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place (Center - Elevated & Highlighted) */}
                {top3[0] && (
                  <div
                    onClick={() => handleInspectPlayer(top3[0])}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer transform hover:-translate-y-1 relative order-1 md:order-2 shadow-xl ${
                      top3[0].isLocalUser
                        ? isLight
                          ? 'bg-gradient-to-b from-amber-100 via-amber-50 to-white border-amber-500 ring-4 ring-amber-400/30'
                          : 'bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-950 border-amber-400 ring-4 ring-amber-500/30'
                        : isLight
                        ? 'bg-gradient-to-b from-amber-50/90 via-white to-amber-50/40 border-amber-400/80 ring-2 ring-amber-400/20'
                        : 'bg-gradient-to-b from-amber-950/50 via-slate-900 to-slate-950 border-amber-400/70'
                    }`}
                  >
                    {/* Crown Emblem */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white p-1 rounded-full shadow-md">
                      <Trophy className="w-4 h-4 fill-current" />
                    </div>

                    <div className="flex items-center justify-between mb-3 mt-1">
                      <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-amber-950 border border-amber-500 text-[10px] font-black uppercase shadow-2xs">
                        <span>🥇 1ST WORLD CHAMPION</span>
                      </div>
                      <span className="text-2xl" title={top3[0].countryName}>{top3[0].flag}</span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="text-4xl p-3 rounded-2xl bg-white border-2 border-amber-300 shadow-md mb-2 relative">
                        {top3[0].avatar}
                        <span className="absolute -bottom-1 -right-1 text-xs bg-amber-400 text-black rounded-full p-0.5 border border-white">👑</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-black text-base">
                        <span className={`truncate max-w-[150px] ${isLight ? 'text-slate-900 font-display' : 'text-white'}`}>
                          {top3[0].userName}
                        </span>
                        {top3[0].isLocalUser && (
                          <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-amber-400 text-amber-950 font-bold">YOU</span>
                        )}
                      </div>
                      <p className={`text-xs font-semibold ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                        {top3[0].city}, {top3[0].countryName}
                      </p>
                      <p className={`text-[10px] font-mono mt-0.5 line-clamp-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {top3[0].specialty}
                      </p>

                      <div className={`mt-3.5 py-2 px-3.5 rounded-2xl w-full flex items-center justify-between border-2 ${
                        isLight ? 'bg-amber-100/80 border-amber-300 text-amber-950 shadow-xs' : 'bg-slate-950 border-amber-500/40 text-amber-300'
                      }`}>
                        <span className="text-[10px] font-black uppercase tracking-wider">Passport Pts</span>
                        <span className="text-sm font-black font-mono">{top3[0].verificationPoints}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place (Right) */}
                {top3[2] && (
                  <div
                    onClick={() => handleInspectPlayer(top3[2])}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer transform hover:-translate-y-1 relative order-3 ${
                      top3[2].isLocalUser
                        ? isLight
                          ? 'bg-gradient-to-b from-amber-50 to-white border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                          : 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-400/30'
                        : isLight
                        ? 'bg-gradient-to-b from-orange-50/60 to-white border-amber-700/20 shadow-sm hover:border-amber-700/40'
                        : 'bg-gradient-to-b from-slate-800/80 to-slate-900 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-700/20 text-amber-900 border border-amber-700/30 text-[10px] font-black uppercase shadow-2xs">
                        <span>🥉 3RD PLACE</span>
                      </div>
                      <span className="text-xl" title={top3[2].countryName}>{top3[2].flag}</span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="text-3xl p-2.5 rounded-2xl bg-white border border-amber-200 shadow-sm mb-2">
                        {top3[2].avatar}
                      </div>
                      <div className="flex items-center gap-1 font-bold text-sm">
                        <span className={`truncate max-w-[130px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {top3[2].userName}
                        </span>
                        {top3[2].isLocalUser && (
                          <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-amber-400 text-amber-950 font-bold">YOU</span>
                        )}
                      </div>
                      <p className={`text-[11px] truncate max-w-[170px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {top3[2].city}, {top3[2].countryName}
                      </p>

                      <div className={`mt-3 py-1.5 px-3 rounded-xl w-full flex items-center justify-between border ${
                        isLight ? 'bg-amber-50 border-amber-200/80 text-amber-950' : 'bg-slate-950 border-slate-800 text-amber-300'
                      }`}>
                        <span className="text-[10px] font-bold uppercase">Passport Pts</span>
                        <span className="text-xs font-black font-mono">{top3[2].verificationPoints}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DETAILED RANKS 4 TO 10 TABLE */}
            {ranks4to10.length > 0 && (
              <div className={`rounded-3xl border overflow-hidden ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className={`px-4 py-3 border-b flex items-center justify-between text-[11px] font-black uppercase tracking-wider ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <span className="w-12 text-center">Rank</span>
                  <span className="flex-1 pl-2">SIFT Investigator</span>
                  <span className="hidden sm:inline-block w-44">Specialty Domain</span>
                  <span className="w-24 text-right pr-2">Passport Pts</span>
                  <span className="w-16 text-center">Action</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ranks4to10.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => handleInspectPlayer(player)}
                      className={`px-4 py-3 flex items-center justify-between gap-3 transition cursor-pointer hover:bg-amber-500/5 ${
                        player.isLocalUser
                          ? isLight
                            ? 'bg-amber-50/80 font-bold border-l-4 border-amber-500'
                            : 'bg-indigo-950/40 font-bold border-l-4 border-indigo-400'
                          : ''
                      }`}
                    >
                      {/* Rank Badge */}
                      <div className="w-12 flex justify-center">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs border ${
                          isLight ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}>
                          #{player.rank}
                        </span>
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 min-w-0 flex items-center gap-3 pl-2">
                        <div className="text-2xl shrink-0 p-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          {player.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm" title={player.countryName}>{player.flag}</span>
                            <span className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {player.userName}
                            </span>
                            {player.isLocalUser && (
                              <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-amber-400 text-amber-950 font-bold">YOU</span>
                            )}
                            {player.isVerifiedSentinel && (
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" title="Verified Fact-Checker" />
                            )}
                          </div>
                          <div className={`text-[10px] truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {player.city}, {player.countryName} • {player.accuracyRate}% Accuracy
                          </div>
                        </div>
                      </div>

                      {/* Specialty Domain Tag */}
                      <div className="hidden sm:block w-44 min-w-0">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border truncate block ${
                          isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}>
                          {player.specialtyCategory === 'ai_manipulation' && '✦ AI & Deepfakes'}
                          {player.specialtyCategory === 'source' && '◆ Source Integrity'}
                          {player.specialtyCategory === 'evidence' && '▲ Evidence & Data'}
                          {player.specialtyCategory === 'context' && '⬟ Context & Recycled'}
                          {player.specialtyCategory === 'general' && 'SIFT Master'}
                        </span>
                      </div>

                      {/* Points */}
                      <div className="w-24 text-right pr-2 font-mono font-black text-xs text-amber-600 dark:text-amber-400">
                        {player.verificationPoints} pts
                      </div>

                      {/* Inspect Action */}
                      <div className="w-16 flex justify-center">
                        <button
                          type="button"
                          className={`p-1.5 rounded-xl border text-xs transition ${
                            isLight ? 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                          title="Inspect Credentials"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* YOUR GLOBAL STANDING BANNER */}
            {userStanding && (
              <div className={`p-4 sm:p-5 rounded-3xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 transition shadow-md ${
                isHighContrast
                  ? 'bg-black text-yellow-300 border-yellow-400'
                  : isLight
                  ? 'bg-gradient-to-r from-amber-50 via-indigo-50/50 to-white border-amber-300 shadow-amber-900/5'
                  : 'bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-950 border-indigo-500/50 shadow-xl'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl p-2.5 rounded-2xl bg-white border border-amber-300 shadow-sm shrink-0">
                    {userStanding.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isLight ? 'bg-amber-100 text-amber-900' : 'bg-indigo-500/20 text-cyan-300'
                      }`}>
                        YOUR GLOBAL STANDING
                      </span>
                      <span className="text-xs font-mono font-black text-amber-600">
                        Rank #{userStanding.rank} (Top {userStanding.rankPercentage}%)
                      </span>
                    </div>
                    <div className={`text-sm font-black mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {passport.userName} • {passport.verificationPoints} Passport Points
                    </div>
                    <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {userStanding.pointsToNextRank > 0 
                        ? `Need ${userStanding.pointsToNextRank} more pts to climb to next rank tier!`
                        : `You are holding the #1 position on the global stage!`}
                    </div>
                  </div>
                </div>

                {onStartChallengeMatch && (
                  <button
                    onClick={() => {
                      audioSystem.playSuccessChime();
                      onClose();
                      onStartChallengeMatch('college');
                    }}
                    className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition transform active:scale-98 shrink-0 ${
                      isHighContrast
                        ? 'bg-yellow-400 text-black border-2 border-black'
                        : isLight
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                        : 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Match to Climb Ranks</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Dedicated Bottom Footer / Return to Home Bar */}
        <div className={`mt-6 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isLight ? 'border-amber-900/10' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Globe className="w-4 h-4 text-amber-500" />
            <span>SIFT Global Verifiers Network • {totalParticipants.toLocaleString()} active analysts</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                audioSystem.playClick();
                onClose();
              }}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider border shadow-xs transition transform active:scale-95 ${
                isHighContrast
                  ? 'bg-yellow-400 text-black border-2 border-black hover:bg-yellow-300'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home Lobby</span>
            </button>
          </div>
        </div>

        {/* DETAILED PLAYER DOSSIER MODAL OVERLAY */}
        {selectedPlayer && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <div
              className={`w-full max-w-lg rounded-3xl p-6 border-2 transition-all shadow-2xl relative ${
                isHighContrast
                  ? 'bg-black text-yellow-300 border-yellow-400'
                  : isLight
                  ? 'bg-white text-slate-800 border-amber-900/20'
                  : 'bg-slate-900 text-slate-100 border-indigo-500/50'
              }`}
            >
              <button
                onClick={() => setSelectedPlayer(null)}
                className={`absolute top-4 right-4 p-2 rounded-xl transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 mb-4">
                <div className="text-4xl p-3 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm shrink-0">
                  {selectedPlayer.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedPlayer.flag}</span>
                    <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {selectedPlayer.userName}
                    </h3>
                  </div>
                  <p className={`text-xs font-semibold ${isLight ? 'text-indigo-700' : 'text-cyan-300'}`}>
                    {selectedPlayer.rankTitle} • {selectedPlayer.city}, {selectedPlayer.countryName}
                  </p>
                  <p className="text-[10px] font-mono text-amber-600 font-bold">
                    Global Rank #{selectedPlayer.rank} • {selectedPlayer.verificationPoints} pts • {selectedPlayer.accuracyRate}% SIFT Accuracy
                  </p>
                </div>
              </div>

              {/* Motto Card */}
              <div className={`p-3.5 rounded-2xl border italic text-xs mb-4 ${
                isLight ? 'bg-amber-50/60 border-amber-200 text-amber-950' : 'bg-slate-950 border-slate-800 text-amber-300'
              }`}>
                "{selectedPlayer.motto}"
              </div>

              {/* Skill Radar Breakdown */}
              <div className="space-y-2 mb-4">
                <div className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  MIL & SIFT Verification Competency
                </div>
                {[
                  { name: 'Source Integrity & Lateral Reading', val: selectedPlayer.skillVectors.sourceVerification, color: 'bg-rose-500' },
                  { name: 'Evidence & Chart Audit', val: selectedPlayer.skillVectors.evidenceAssessment, color: 'bg-blue-500' },
                  { name: 'Context & Geolocation', val: selectedPlayer.skillVectors.contextChecking, color: 'bg-amber-500' },
                  { name: 'Cross-Referencing Network', val: selectedPlayer.skillVectors.crossReferencing, color: 'bg-emerald-500' },
                  { name: 'AI & Deepfake Forensics', val: selectedPlayer.skillVectors.aiManipulationDetection, color: 'bg-purple-500' },
                ].map(skill => (
                  <div key={skill.name} className="space-y-0.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{skill.name}</span>
                      <span className="font-mono">{skill.val}%</span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
                      <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${skill.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedPlayer(null)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

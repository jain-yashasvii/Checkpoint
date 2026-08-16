import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  RotateCw, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  Target,
  Zap,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';
import { PlayerState, AccessibilitySettings } from '../types/game';
import { TRANSLATIONS } from '../data/translations';
import { audioSystem } from '../utils/audio';

interface SecretRoleCardProps {
  player: PlayerState;
  accessibilitySettings: AccessibilitySettings;
}

export const SecretRoleCard: React.FC<SecretRoleCardProps> = ({
  player,
  accessibilitySettings,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const t = TRANSLATIONS[accessibilitySettings.language] || TRANSLATIONS.en;
  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;

  const isImposter = player.isImposter;

  const handleFlip = () => {
    audioSystem.playCardFlip();
    setIsFlipped(prev => !prev);
  };

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto my-2">
      <div 
        className={`relative w-full rounded-3xl transition-transform duration-700 transform-style-3d cursor-pointer select-none game-card-hover ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? t.secretRoleTapToHide : t.secretRoleTapToReveal}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
          }
        }}
      >
        {/* FRONT: Sealed Top Secret Dossier */}
        <div className={`w-full p-5 sm:p-6 rounded-3xl border-2 backface-hidden flex flex-col items-center text-center justify-between min-h-[230px] transition-all relative overflow-hidden ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-2 border-yellow-400'
            : isLight
            ? 'bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-amber-800/30 game-card-shadow'
            : 'bg-gradient-to-br from-slate-900 via-indigo-950/90 to-slate-950 border-indigo-500/50 shadow-2xl'
        }`}>
          {/* Subtle Foil Shimmer Stripe */}
          <div className="absolute inset-0 pointer-events-none opacity-20 animate-foil-shimmer" />

          {/* Top Badge */}
          <div className="flex items-center justify-between w-full relative z-10">
            <span className={`text-[10px] font-mono font-black uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-2xs ${
              isLight ? 'bg-amber-100/90 text-amber-900 border-amber-300' : 'bg-indigo-500/20 text-cyan-300 border-indigo-500/40'
            }`}>
              <Lock className="w-3 h-3 text-amber-500" />
              {t.secretRoleSealed}
            </span>
            <span className={`text-[10px] font-mono font-bold ${isLight ? 'text-amber-800/70' : 'text-slate-400'}`}>
              MIL // SIFT-01
            </span>
          </div>

          {/* Central Wax Seal / Eye Icon */}
          <div className="my-2 relative group z-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border-2 shadow-lg transition-transform transform group-hover:scale-110 ${
              isLight 
                ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white border-amber-300 ring-4 ring-amber-400/30' 
                : 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white border-indigo-400 ring-4 ring-indigo-500/30'
            }`}>
              <Eye className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center border border-amber-400/50 text-xs shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Title & Call to Action */}
          <div className="relative z-10">
            <h4 className={`text-base font-black tracking-tight ${isLight ? 'text-slate-900 font-display' : 'text-white'}`}>
              {t.secretRoleTopSecret}
            </h4>
            <p className={`text-xs mt-0.5 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t.secretRoleTapToReveal}
            </p>
          </div>

          {/* Flip indicator button */}
          <div className={`relative z-10 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider mt-2 px-3.5 py-1.5 rounded-xl border transition-all ${
            isLight ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs hover:bg-amber-200' : 'bg-slate-800 text-cyan-300 border-slate-700 hover:bg-slate-700'
          }`}>
            <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t.secretRoleTapToReveal} ✦</span>
          </div>
        </div>

        {/* BACK: Revealed Secret Role */}
        <div className={`w-full p-5 sm:p-6 rounded-3xl border-2 backface-hidden rotate-y-180 flex flex-col justify-between min-h-[230px] transition-all shadow-2xl relative overflow-hidden ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-2 border-yellow-400'
            : isImposter
            ? isLight
              ? 'bg-gradient-to-br from-rose-50 via-white to-amber-50 border-rose-400 ring-4 ring-rose-400/20'
              : 'bg-gradient-to-br from-rose-950/95 via-slate-900 to-slate-950 border-rose-500 ring-4 ring-rose-500/20'
            : isLight
            ? 'bg-gradient-to-br from-emerald-50 via-white to-indigo-50 border-emerald-400 ring-4 ring-emerald-400/20'
            : 'bg-gradient-to-br from-emerald-950/95 via-slate-900 to-slate-950 border-emerald-500 ring-4 ring-emerald-500/20'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <span className={`text-[10px] font-mono font-black uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-2xs ${
              isImposter
                ? isLight ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {isImposter ? <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
              {isImposter ? t.imposterRole : t.truthCheckerRole}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleFlip();
              }}
              className={`p-1.5 rounded-xl border text-xs transition shadow-2xs ${
                isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={t.secretRoleTapToHide}
              aria-label={t.secretRoleTapToHide}
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Role Directives */}
          <div className="my-2 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{isImposter ? '🎭' : '🛡️'}</span>
              <div>
                <h4 className={`text-base font-black leading-tight ${
                  isImposter
                    ? isLight ? 'text-rose-950' : 'text-rose-300'
                    : isLight ? 'text-emerald-950' : 'text-emerald-300'
                }`}>
                  {isImposter ? t.imposterRole : t.truthCheckerRole}
                </h4>
                <p className={`text-[11px] font-medium leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  {isImposter ? t.imposterBrief : t.truthCheckerBrief}
                </p>
              </div>
            </div>

            {/* Tactical Tip */}
            <div className={`p-2.5 rounded-2xl border text-[11px] font-medium flex items-start gap-1.5 ${
              isImposter
                ? isLight ? 'bg-rose-50/80 border-rose-200 text-rose-900' : 'bg-rose-950/40 border-rose-800 text-rose-200'
                : isLight ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
            }`}>
              <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
              <span>
                <strong>SIFT Tip: </strong>
                {isImposter 
                  ? 'Spend tokens to preview what evidence others might find against your card!' 
                  : 'Look closely at domain spelling and publication dates during cross-examination.'}
              </span>
            </div>
          </div>

          <div className="text-center">
            <span className={`text-[10px] font-mono font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {t.secretRoleTapToHide}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

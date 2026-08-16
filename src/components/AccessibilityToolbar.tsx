import React, { useState } from 'react';
import { 
  Accessibility, 
  Volume2, 
  VolumeX, 
  Eye, 
  Type, 
  Globe, 
  Hand, 
  MessageSquare, 
  HelpCircle, 
  Sliders, 
  Check, 
  X,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { AccessibilitySettings, SupportedLanguage } from '../types/game';
import { TRANSLATIONS } from '../data/translations';
import { audioSystem } from '../utils/audio';

interface AccessibilityToolbarProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: AccessibilitySettings) => void;
}

const LANGUAGES: { code: SupportedLanguage; label: string; native: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'de', label: 'German', native: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ja', label: 'Japanese', native: '日本語', flag: '🇯🇵', dir: 'ltr' },
];

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.en;
  const isLight = settings.themeMode !== 'dark' && !settings.highContrast;

  const handleLanguageChange = (code: SupportedLanguage) => {
    const langObj = LANGUAGES.find(l => l.code === code);
    document.documentElement.dir = langObj?.dir || 'ltr';
    document.documentElement.lang = code;
    onUpdateSettings({ ...settings, language: code });
    audioSystem.playClick();
  };

  const toggleThemeMode = () => {
    audioSystem.playClick();
    const next = settings.themeMode === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ ...settings, themeMode: next, highContrast: false });
  };

  const toggleHighContrast = () => {
    audioSystem.playClick();
    onUpdateSettings({ ...settings, highContrast: !settings.highContrast });
  };

  const handleFontSizeChange = (size: 'normal' | 'large' | 'xl') => {
    audioSystem.playClick();
    onUpdateSettings({ ...settings, fontSize: size });
  };

  const toggleTTS = () => {
    audioSystem.playClick();
    const next = !settings.ttsEnabled;
    if (!next) audioSystem.stopTTS();
    onUpdateSettings({ ...settings, ttsEnabled: next });
  };

  const toggleSignLanguage = () => {
    audioSystem.playClick();
    onUpdateSettings({ ...settings, signLanguageEnabled: !settings.signLanguageEnabled });
  };

  const toggleClosedCaptions = () => {
    audioSystem.playClick();
    onUpdateSettings({ ...settings, closedCaptionsEnabled: !settings.closedCaptionsEnabled });
  };

  const toggleSoundEffects = () => {
    const next = !settings.soundEffects;
    audioSystem.setMuted(!next);
    onUpdateSettings({ ...settings, soundEffects: next });
  };

  return (
    <div className="relative z-50">
      {/* Quick Access Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Universal Accessibility and Inclusivity Panel"
        aria-expanded={isOpen}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-sm transition-all border ${
          settings.highContrast
            ? 'bg-yellow-400 text-black border-yellow-300 hover:bg-yellow-300'
            : isLight
            ? 'bg-white text-slate-700 border-amber-900/10 hover:border-indigo-400 hover:text-indigo-600 shadow-sm'
            : 'bg-slate-900 text-indigo-200 border-slate-700 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Accessibility className="w-4 h-4 text-indigo-500" />
        <span className="hidden sm:inline">{t.accessibility}</span>
        <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
          isLight ? 'bg-indigo-50 text-indigo-700' : 'bg-indigo-500/20 text-indigo-300'
        }`}>
          {settings.language.toUpperCase()}
        </span>
      </button>

      {/* Expanded Accessibility Modal / Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Universal Accessibility Settings"
          className={`absolute top-11 right-0 w-80 sm:w-96 rounded-3xl shadow-2xl border p-5 transition-all animate-pop-card ${
            settings.highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : isLight
              ? 'bg-white text-slate-800 border-amber-900/10 shadow-slate-300/60'
              : 'bg-slate-900 text-slate-100 border-slate-700 shadow-black/80'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between pb-3 border-b ${
            isLight ? 'border-slate-100' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${
                isLight ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-600/20 text-indigo-400'
              }`}>
                <Accessibility className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight">{t.accessibility}</h3>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  WCAG AAA, Theme, Sign Language & Languages
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1.5 rounded-xl transition ${
                isLight ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-700' : 'hover:bg-white/10 text-slate-400 hover:text-white'
              }`}
              aria-label="Close accessibility panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {/* Visual Theme Mode (Light / Dark / High Contrast) */}
            <div>
              <label className={`text-xs font-bold flex items-center gap-1.5 mb-2 ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Visual Theme & Atmosphere</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={toggleThemeMode}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border transition ${
                    isLight
                      ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isLight ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                    <span>{isLight ? '☀️ Light Detective' : '🌙 Dark Mode'}</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10">
                    {isLight ? 'LIGHT' : 'DARK'}
                  </span>
                </button>

                <button
                  onClick={toggleHighContrast}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border transition ${
                    settings.highContrast
                      ? 'bg-yellow-400 text-black border-yellow-300'
                      : isLight
                      ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-yellow-500" />
                    <span>High Contrast</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10">
                    {settings.highContrast ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className={`pt-3 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
              <label className={`text-xs font-bold flex items-center gap-1.5 mb-2 ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <span>Localization & Language</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      settings.language === lang.code
                        ? settings.highContrast
                          ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                          : 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : isLight
                        ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{lang.flag}</span>
                      <span>{lang.native}</span>
                    </span>
                    {settings.language === lang.code && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Scaler */}
            <div className={`pt-3 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
              <div className={`flex items-center justify-between p-2.5 rounded-2xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700'
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Type className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{t.textSize}</span>
                </div>
                <div className="flex items-center gap-1">
                  {(['normal', 'large', 'xl'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => handleFontSizeChange(size)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                        settings.fontSize === size
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : isLight
                          ? 'bg-white text-slate-600 hover:bg-slate-200'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {size === 'normal' ? '100%' : size === 'large' ? '125%' : '150%'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Audio & Deaf Inclusivity (Sign Language + CC) */}
            <div className={`pt-3 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
              <label className={`text-xs font-bold flex items-center gap-1.5 mb-2 ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                <Hand className="w-3.5 h-3.5 text-rose-500" />
                <span>Deaf & Hard-of-Hearing Inclusivity</span>
              </label>
              <div className="space-y-2">
                <button
                  onClick={toggleSignLanguage}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold border transition ${
                    settings.signLanguageEnabled
                      ? isLight
                        ? 'bg-rose-50 text-rose-900 border-rose-300 ring-1 ring-rose-300'
                        : 'bg-pink-600/30 text-pink-200 border-pink-500'
                      : isLight
                      ? 'bg-slate-50 text-slate-600 border-slate-200 hover:border-rose-300'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hand className="w-4 h-4 text-rose-500" />
                    <div className="text-left">
                      <div>Sign Language Interpreter (ISL/ASL)</div>
                      <div className={`text-[10px] font-normal ${isLight ? 'text-rose-700/80' : 'text-pink-300/80'}`}>
                        Draggable • 5 dock presets • Mini bubble
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/10 font-black">
                    {settings.signLanguageEnabled ? 'ACTIVE' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={toggleClosedCaptions}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold border transition ${
                    settings.closedCaptionsEnabled
                      ? isLight
                        ? 'bg-sky-50 text-sky-900 border-sky-300'
                        : 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                      : isLight
                      ? 'bg-slate-50 text-slate-600 border-slate-200'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-500" />
                    <span>Real-Time Live Closed Captions</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/10">
                    {settings.closedCaptionsEnabled ? 'ACTIVE' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>

            {/* Blind & Audio Accessibility (TTS & SFX) */}
            <div className={`pt-3 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
              <label className={`text-xs font-bold flex items-center gap-1.5 mb-2 ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Audio & Screen Reader Features</span>
              </label>
              <div className="space-y-2">
                <button
                  onClick={toggleTTS}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold border transition ${
                    settings.ttsEnabled
                      ? isLight
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-emerald-600/30 text-emerald-200 border-emerald-500'
                      : isLight
                      ? 'bg-slate-50 text-slate-600 border-slate-200'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-500" />
                    <span>Text-to-Speech (TTS) Narration</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/10">
                    {settings.ttsEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={toggleSoundEffects}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold border transition ${
                    isLight
                      ? 'bg-slate-50 text-slate-700 border-slate-200'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {settings.soundEffects ? <Volume2 className="w-4 h-4 text-amber-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                    <span>Tactile Procedural SFX</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/10">
                    {settings.soundEffects ? 'ON' : 'MUTED'}
                  </span>
                </button>
              </div>
            </div>

            {/* Tactile Symbol Legend */}
            <div className={`p-3 rounded-2xl border ${
              isLight ? 'bg-amber-50/50 border-amber-200/60 text-slate-700' : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}>
              <p className="text-[11px] font-bold mb-1 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-amber-600" />
                <span>Tactile Deck Shapes & MIL Symbols</span>
              </p>
              <div className="grid grid-cols-2 gap-1 text-[10px] font-mono font-medium">
                <div>◆ = Source Deck</div>
                <div>▲ = Evidence Deck</div>
                <div>⬟ = Context Deck</div>
                <div>✦ = AI & Manipulation</div>
                <div>⬡ = News Wire Cross-Check</div>
                <div>⚑ = Imposter Suspicion</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


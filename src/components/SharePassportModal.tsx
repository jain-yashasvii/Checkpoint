import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Award, 
  Compass, 
  ShieldCheck, 
  Globe, 
  MessageSquare, 
  X, 
  TrendingUp, 
  CheckCircle2,
  FileText,
  Flame,
  Send
} from 'lucide-react';
import { VerificationPassport, AccessibilitySettings } from '../types/game';
import { TRANSLATIONS } from '../data/translations';
import { audioSystem } from '../utils/audio';
import { StorageService } from '../utils/storage';

interface SharePassportModalProps {
  passport: VerificationPassport;
  accessibilitySettings: AccessibilitySettings;
  onClose: () => void;
}

type PlatformTemplate = 'twitter' | 'linkedin' | 'chat';

export const SharePassportModal: React.FC<SharePassportModalProps> = ({
  passport,
  accessibilitySettings,
  onClose,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PlatformTemplate>('twitter');
  const [copied, setCopied] = useState(false);
  const [includeHashtags, setIncludeHashtags] = useState(true);

  const t = TRANSLATIONS[accessibilitySettings.language] || TRANSLATIONS.en;
  const analysis = StorageService.getSkillAnalysis(passport);
  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;

  const unlockedBadges = passport.badges.filter(b => b.unlocked);
  const winRate = passport.totalGamesPlayed > 0 
    ? Math.round((passport.totalImpostersIdentified / passport.totalGamesPlayed) * 100) 
    : 0;

  // Generate platform-specific viral text summaries
  const generateShareText = (template: PlatformTemplate): string => {
    const appUrl = window.location.origin || 'https://information-imposter.web.app';
    const hashtags = includeHashtags 
      ? '\n\n#MediaLiteracy #FactCheck #SIFTMethod #CriticalThinking #StopDisinformation #InformationImposter' 
      : '';

    if (template === 'twitter') {
      return `🛡️ MIL Detective Alert! I just reached the rank of "${passport.rankTitle}" in Information Imposter!

🔍 My Media & Information Literacy Stats:
• 🏆 ${passport.verificationPoints} Verification Points (${passport.totalGamesPlayed} cases)
• 🕵️ ${passport.totalImpostersIdentified} Disinformation Imposters Exposed (${winRate}% accuracy)
• 📊 Top Skill: ${analysis.strongest.name} (${analysis.strongest.value}%)
• 🎖️ Badge Earned: ${unlockedBadges.length > 0 ? unlockedBadges[0].title : 'SIFT Cadet'}

Can you spot the manipulated sources and AI deepfakes before they spread? Test your verification instincts:
👉 ${appUrl}${hashtags}`;
    }

    if (template === 'linkedin') {
      return `📜 Media & Information Literacy (MIL) Verification Credential

I have completed practical forensic verification cases in Information Imposter, applying the SIFT framework (Stop, Investigate the source, Find trusted coverage, Trace context & claims).

👤 Detective: ${passport.userName}
🏅 Certified Rank: ${passport.rankTitle} (Score: ${passport.verificationPoints} pts)
📈 Competency Vectors:
- Source Verification & Lateral Reading: ${passport.skillVectors.sourceVerification}%
- Evidence & Data Triangulation: ${passport.skillVectors.evidenceAssessment}%
- AI Manipulation & Deepfake Detection: ${passport.skillVectors.aiManipulationDetection}%
- Context & Timeline Verification: ${passport.skillVectors.contextChecking}%

In an era of generative AI and synthetic disinformation, lateral reading and critical questioning are essential digital civic skills.

Explore the framework and test your own verification abilities:
👉 ${appUrl}${hashtags}`;
    }

    // Chat / Discord / WhatsApp markdown format
    return `🎮 **INFORMATION IMPOSTER — MIL VERIFICATION PASSPORT**
👤 **Agent:** ${passport.userName} | **Rank:** ${passport.rankTitle} 🛡️
🏆 **Score:** ${passport.verificationPoints} pts | **Imposters Caught:** ${passport.totalImpostersIdentified}/${passport.totalGamesPlayed} (${winRate}%)
📊 **Skill Radar:**
• 🔍 Source Verification: ${passport.skillVectors.sourceVerification}%
• 🤖 AI / Deepfake Detection: ${passport.skillVectors.aiManipulationDetection}%
• 📈 Evidence Assessment: ${passport.skillVectors.evidenceAssessment}%
🎖️ **Badges:** ${unlockedBadges.length} Unlocked (${unlockedBadges.map(b => b.title).slice(0, 2).join(', ') || 'SIFT Cadet'})

Think you have stronger lateral reading skills? Challenge my score:
👉 ${appUrl}`;
  };

  const shareText = generateShareText(selectedTemplate);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      audioSystem.playSuccessChime();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Information Imposter — ${passport.userName}'s Verification Passport`,
          text: shareText,
          url: window.location.origin,
        });
        audioSystem.playSuccessChime();
      } catch {
        // User cancelled or failed
      }
    } else {
      handleCopy();
    }
  };

  const handleOpenTwitter = () => {
    const textToShare = generateShareText('twitter');
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenLinkedIn = () => {
    const textToShare = generateShareText('linkedin');
    const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(textToShare)}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
    >
      <div
        className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 border transition-all my-8 animate-fade-in ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : isLight
            ? 'bg-white text-slate-800 border-amber-900/10 game-card-shadow'
            : 'bg-slate-900 text-slate-100 border-indigo-500/40 shadow-2xl'
        }`}
      >
        {/* Header Bar */}
        <div className={`flex items-center justify-between pb-4 mb-5 border-b ${
          isLight ? 'border-slate-100' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-600/20 text-cyan-300 border border-indigo-500/30'
            }`}>
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 id="share-modal-title" className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${
                isLight ? 'text-slate-900 font-display' : 'text-white'
              }`}>
                <span>Share My Passport</span>
                <span className={`text-xs font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  isLight ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-indigo-500/20 text-cyan-300 border-indigo-500/30'
                }`}>
                  Viral MIL Campaign
                </span>
              </h3>
              <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Promote media literacy, lateral reading, and AI fact-checking across your network.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2.5 rounded-2xl border transition ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
            }`}
            aria-label="Close share dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passport Performance Highlight Pill Banner */}
        <div className={`p-4 rounded-2xl border mb-5 flex flex-wrap items-center justify-between gap-3 ${
          isLight
            ? 'bg-gradient-to-r from-amber-50 via-white to-indigo-50 border-amber-200 shadow-2xs'
            : 'bg-gradient-to-r from-indigo-950/60 via-slate-950 to-purple-950/60 border-indigo-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{passport.avatar}</span>
            <div>
              <div className={`text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {passport.userName}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[11px] font-black px-2 py-0.2 rounded-md ${
                  isLight ? 'bg-amber-100 text-amber-900' : 'bg-indigo-950 text-cyan-300'
                }`}>
                  {passport.rankTitle}
                </span>
                <span className={`text-[11px] font-mono font-bold ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
                  ★ {passport.verificationPoints} pts
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-xl border text-center ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="text-[9px] font-bold uppercase text-slate-400">Caught</div>
              <div className={`text-xs font-black font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                {passport.totalImpostersIdentified} / {passport.totalGamesPlayed}
              </div>
            </div>
            <div className={`px-3 py-1 rounded-xl border text-center ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="text-[9px] font-bold uppercase text-slate-400">Top Skill</div>
              <div className={`text-xs font-black truncate max-w-[90px] ${isLight ? 'text-indigo-700' : 'text-cyan-300'}`}>
                {analysis.strongest.value}%
              </div>
            </div>
          </div>
        </div>

        {/* Platform Template Tabs */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black uppercase tracking-wider ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              Select Format & Platform:
            </span>
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeHashtags}
                onChange={e => setIncludeHashtags(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                Include #MediaLiteracy Hashtags
              </span>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'twitter', label: 'X / Threads', icon: '🐦' },
              { id: 'linkedin', label: 'LinkedIn / Pro', icon: '💼' },
              { id: 'chat', label: 'Discord / Chat', icon: '💬' },
            ].map(tab => {
              const isSelected = selectedTemplate === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(tab.id as PlatformTemplate);
                    audioSystem.playClick();
                  }}
                  className={`p-3 rounded-2xl border text-center text-xs font-black transition flex items-center justify-center gap-2 ${
                    isSelected
                      ? isHighContrast
                        ? 'bg-yellow-400 text-black border-yellow-300'
                        : isLight
                        ? 'bg-indigo-600 text-white shadow-xs border-indigo-600'
                        : 'bg-indigo-600 text-white shadow-md border-indigo-400'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Formatted Copyable Text Block Preview */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Formatted Social Summary:
            </span>
            <span className={`font-mono text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {shareText.length} characters
            </span>
          </div>

          <div className={`relative p-4 rounded-2xl border font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto select-all ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-indigo-500'
              : 'bg-slate-950 border-slate-800 text-slate-200'
          }`}>
            {shareText}
          </div>
        </div>

        {/* Action Buttons: 1-Click Copy & Quick Platform Launchers */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t ${
          isLight ? 'border-slate-100' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleOpenTwitter}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider border transition ${
                isLight
                  ? 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200'
                  : 'bg-sky-950/60 hover:bg-sky-900 text-sky-300 border-sky-800'
              }`}
              title="Post directly to X (Twitter)"
            >
              <span>🐦</span>
              <span>Post to X</span>
            </button>

            <button
              type="button"
              onClick={handleOpenLinkedIn}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider border transition ${
                isLight
                  ? 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-blue-950/60 hover:bg-blue-900 text-blue-300 border-blue-800'
              }`}
              title="Post credential to LinkedIn"
            >
              <span>💼</span>
              <span>Post to LinkedIn</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleNativeShare}
                className={`p-3 rounded-2xl border transition ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Open native device share sheet"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition transform active:scale-98 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : isHighContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-black'
                  : isLight
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
                  : 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Social Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

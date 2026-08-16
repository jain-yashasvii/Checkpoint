import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Search, 
  ExternalLink, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  BarChart2, 
  Calendar, 
  UserCheck, 
  ShieldCheck, 
  AlertTriangle,
  ZoomIn,
  Play,
  Pause,
  HelpCircle,
  Eye,
  Bookmark,
  Sparkles,
  Heart,
  Repeat,
  MessageCircle,
  Share2,
  CheckCircle2,
  Globe2,
  Flame,
  Info,
  Lightbulb,
  X
} from 'lucide-react';
import { InformationCard, AccessibilitySettings, RoundCategory } from '../types/game';
import { TRANSLATIONS } from '../data/translations';
import { getLocalizedDeckInfo } from '../utils/localization';
import { audioSystem } from '../utils/audio';
import { HintModal } from './HintModal';

interface CardInspectorProps {
  card: InformationCard;
  accessibilitySettings: AccessibilitySettings;
  isSecretRoleRevealed?: boolean;
  onClose?: () => void;
}

export const CardInspector: React.FC<CardInspectorProps> = ({
  card,
  accessibilitySettings,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'social_feed' | 'source' | 'evidence' | 'media'>('social_feed');
  const [isMagnified, setIsMagnified] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isReadingTTS, setIsReadingTTS] = useState(false);
  const [likesCount, setLikesCount] = useState(1420);
  const [hasLiked, setHasLiked] = useState(false);
  const [retweetsCount, setRetweetsCount] = useState(389);
  const [hasRetweeted, setHasRetweeted] = useState(false);
  const [cardTilt, setCardTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHintOpen, setIsHintOpen] = useState(false);

  const t = TRANSLATIONS[accessibilitySettings.language] || TRANSLATIONS.en;
  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;

  const handleToggleTTS = () => {
    if (isReadingTTS) {
      audioSystem.stopTTS();
      setIsReadingTTS(false);
    } else {
      setIsReadingTTS(true);
      const narrationText = `Claim Headline: ${card.headline}. Claim Summary: ${card.claimSummary}. Alleged Source: ${card.allegedSource.name}, Author: ${card.allegedSource.author}. Published: ${card.publicationDate}. Stated Evidence: ${card.statedEvidence}.`;
      audioSystem.speak(narrationText, accessibilitySettings.language, accessibilitySettings.ttsSpeed, () => {
        setIsReadingTTS(false);
      });
    }
  };

  const handleToggleAudioSnippet = () => {
    audioSystem.playClick();
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8; // -4deg to +4deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setCardTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  // SIFT Deck Palette Mapping with localization:
  const localizedDeck = getLocalizedDeckInfo(card.roundCategory, accessibilitySettings.language);

  const getDeckStyles = (cat: RoundCategory) => {
    switch (cat) {
      case 'source':
        return {
          name: localizedDeck.name,
          tag: localizedDeck.tag,
          badgeBg: isLight ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          accentBorder: 'border-rose-500',
          accentRing: 'ring-rose-500/30',
          topGradient: 'deck-pattern-source',
          headerBg: isLight ? 'bg-gradient-to-r from-rose-50/90 via-white to-amber-50/40' : 'bg-gradient-to-r from-rose-950/70 via-slate-900 to-indigo-950/60',
          foilColor: 'border-rose-400/50',
          shadowColor: 'shadow-rose-500/15',
          deckThemeColor: '#f43f5e'
        };
      case 'evidence':
        return {
          name: localizedDeck.name,
          tag: localizedDeck.tag,
          badgeBg: isLight ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          accentBorder: 'border-blue-600',
          accentRing: 'ring-blue-500/30',
          topGradient: 'deck-pattern-evidence',
          headerBg: isLight ? 'bg-gradient-to-r from-blue-50/90 via-white to-indigo-50/40' : 'bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/60',
          foilColor: 'border-blue-400/50',
          shadowColor: 'shadow-blue-500/15',
          deckThemeColor: '#2563eb'
        };
      case 'context':
        return {
          name: localizedDeck.name,
          tag: localizedDeck.tag,
          badgeBg: isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          accentBorder: 'border-amber-500',
          accentRing: 'ring-amber-500/30',
          topGradient: 'deck-pattern-context',
          headerBg: isLight ? 'bg-gradient-to-r from-amber-50/90 via-white to-orange-50/40' : 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/60',
          foilColor: 'border-amber-400/50',
          shadowColor: 'shadow-amber-500/15',
          deckThemeColor: '#d97706'
        };
      case 'ai_manipulation':
      default:
        return {
          name: localizedDeck.name,
          tag: localizedDeck.tag,
          badgeBg: isLight ? 'bg-purple-100 text-purple-900 border-purple-300' : 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          accentBorder: 'border-purple-600',
          accentRing: 'ring-purple-500/30',
          topGradient: 'deck-pattern-ai',
          headerBg: isLight ? 'bg-gradient-to-r from-purple-50/90 via-white to-pink-50/40' : 'bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/60',
          foilColor: 'border-purple-400/50',
          shadowColor: 'shadow-purple-500/15',
          deckThemeColor: '#9333ea'
        };
    }
  };

  const deck = getDeckStyles(card.roundCategory);

  return (
    <div 
      className="perspective-1000 w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform: `rotateX(${cardTilt.y}deg) rotateY(${cardTilt.x}deg)`,
          transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
        }}
        aria-label="Interactive 3D Scenario Card"
        className={`relative rounded-3xl border-2 overflow-hidden transition-all duration-200 animate-pop-card ${deck.accentBorder} ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : isLight
            ? `bg-white text-slate-800 game-card-shadow ${deck.shadowColor}`
            : 'bg-slate-900 text-slate-100 border-slate-700 shadow-2xl'
        }`}
      >
        {/* Textured Colored Header Stripe */}
        <div className={`h-3 w-full shadow-inner ${deck.topGradient}`} />

        {/* Card Header & Deck Badges */}
        <div className={`p-5 sm:p-6 border-b relative ${deck.headerBg} ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono font-black uppercase px-3 py-1 rounded-full border shadow-2xs ${deck.badgeBg}`}>
                {deck.tag} • {deck.name}
              </span>
              <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                CASE #{card.id.substring(0, 6).toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Need a Hint Button */}
              <button
                type="button"
                onClick={() => {
                  audioSystem.playClick();
                  setIsHintOpen(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition transform active:scale-95 ${
                  isLight
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                    : 'bg-amber-950/50 hover:bg-amber-900/70 text-amber-300 border-amber-500/40'
                }`}
                title="View Forensic Verification Hint"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>{t.hintFeature}</span>
              </button>

              {/* Audio TTS Read Aloud Control */}
              <button
                onClick={handleToggleTTS}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition transform active:scale-95 ${
                  isReadingTTS
                    ? 'bg-amber-500 text-white border-amber-400 shadow-md animate-pulse'
                    : isLight
                    ? 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:text-amber-700 shadow-xs'
                    : 'bg-slate-800 text-cyan-300 border-slate-700 hover:bg-slate-700'
                }`}
                aria-label={isReadingTTS ? t.ttsStop : t.ttsReadCard}
              >
                {isReadingTTS ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-500" />}
                <span>{isReadingTTS ? t.ttsStop : t.ttsReadCard}</span>
              </button>

              {/* Close Deck Case Button */}
              {onClose && (
                <button
                  type="button"
                  onClick={() => {
                    audioSystem.playClick();
                    onClose();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition transform active:scale-95 ${
                    isLight
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200 hover:border-rose-300 shadow-xs'
                      : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-500/40'
                  }`}
                  title={t.closeDeckCase}
                  aria-label={t.closeDeckCase}
                >
                  <X className="w-3.5 h-3.5 text-rose-500" />
                  <span>{t.closeDeckCase}</span>
                </button>
              )}
            </div>
          </div>

          {/* Headline */}
          <h2 className={`text-xl sm:text-2xl font-black leading-snug tracking-tight ${
            isLight ? 'text-slate-900 font-display' : 'text-white'
          }`}>
            "{card.headline}"
          </h2>
        </div>

        {/* Tactile Inspection Tabs with Spring Transitions */}
        <div className={`flex border-b overflow-x-auto text-xs font-bold px-3 pt-2 gap-1.5 ${
          isLight ? 'bg-slate-50/70 border-slate-100' : 'bg-slate-950/70 border-slate-800'
        }`}>
          {[
            { id: 'social_feed', label: t.tabSocialFeed, icon: <MessageCircle className="w-3.5 h-3.5" /> },
            { id: 'source', label: t.tabSourceProvenance, icon: <UserCheck className="w-3.5 h-3.5" /> },
            { id: 'evidence', label: t.tabStatedEvidence, icon: <BarChart2 className="w-3.5 h-3.5" /> },
            { id: 'media', label: t.tabAttachedMedia, icon: <ImageIcon className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as 'social_feed' | 'source' | 'evidence' | 'media');
                audioSystem.playClick();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-2xl font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? isHighContrast
                    ? 'bg-yellow-400 text-black font-black'
                    : isLight
                    ? 'bg-white text-slate-900 border-t-2 border-x border-t-amber-500 border-slate-200 shadow-xs'
                    : 'bg-slate-900 text-white border-t-2 border-x border-t-cyan-400 border-slate-700'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* TAB 1: Visual Social Media Embed */}
          {activeTab === 'social_feed' && (
            <div className="space-y-4 animate-fade-in">
              {/* Simulated Social Post Container */}
              <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isLight 
                  ? 'bg-gradient-to-b from-white to-slate-50/50 border-slate-200 shadow-xs' 
                  : 'bg-slate-950/80 border-slate-800 shadow-lg'
              }`}>
                {/* Author Info Bar */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Simulated Avatar */}
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg border-2 shadow-2xs ${
                      isLight ? 'bg-gradient-to-tr from-indigo-100 to-amber-100 border-indigo-200 text-indigo-900' : 'bg-slate-800 border-slate-700 text-cyan-300'
                    }`}>
                      {card.allegedSource.author.charAt(0) || '📰'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {card.allegedSource.author}
                        </span>
                        {card.allegedSource.verifiedBadge && (
                          <span title="Claimed Verification Checkmark" className="inline-flex items-center">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                          </span>
                        )}
                        <span className={`text-xs font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                          @{card.allegedSource.domain.replace(/\..*$/, '')}_feed
                        </span>
                      </div>
                      <div className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {card.allegedSource.name} • {card.publicationDate}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
                  }`}>
                    VIRAL REPORT
                  </span>
                </div>

                {/* Claim Summary Content */}
                <p className={`text-sm sm:text-base leading-relaxed font-sans font-medium mb-4 ${
                  isLight ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  {card.claimSummary}
                </p>

                {/* Attached Mock Media Preview */}
                {card.attachedMedia && (
                  <div className={`rounded-xl border overflow-hidden p-3.5 mb-4 ${
                    isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-slate-900/90 border-slate-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {card.attachedMedia.type === 'image' && <ImageIcon className="w-4 h-4 text-rose-500" />}
                      {card.attachedMedia.type === 'audio' && <Music className="w-4 h-4 text-amber-500" />}
                      {card.attachedMedia.type === 'chart' && <BarChart2 className="w-4 h-4 text-sky-500" />}
                      {card.attachedMedia.type === 'document' && <FileText className="w-4 h-4 text-emerald-500" />}
                      <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {card.attachedMedia.title}
                      </span>
                    </div>

                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {card.attachedMedia.caption}
                    </p>
                  </div>
                )}

                {/* Social Engagement Metrics Bar */}
                <div className={`pt-3 border-t flex items-center justify-between text-xs font-semibold ${
                  isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
                }`}>
                  <button
                    type="button"
                    onClick={() => {
                      audioSystem.playClick();
                      setHasLiked(!hasLiked);
                      setLikesCount(prev => (hasLiked ? prev - 1 : prev + 1));
                    }}
                    className={`flex items-center gap-1.5 transition ${
                      hasLiked ? 'text-rose-500' : 'hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500' : ''}`} />
                    <span>{likesCount.toLocaleString()}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      audioSystem.playClick();
                      setHasRetweeted(!hasRetweeted);
                      setRetweetsCount(prev => (hasRetweeted ? prev - 1 : prev + 1));
                    }}
                    className={`flex items-center gap-1.5 transition ${
                      hasRetweeted ? 'text-emerald-500' : 'hover:text-emerald-500'
                    }`}
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>{retweetsCount.toLocaleString()}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>142 replies</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">1.8M views</span>
                  </div>
                </div>
              </div>

              {/* Timestamp & Domain Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3.5 rounded-2xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800'
                }`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1 ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Publication Timestamp</span>
                  </span>
                  <p className={`text-xs sm:text-sm font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    {card.publicationDate}
                  </p>
                </div>

                <div className={`p-3.5 rounded-2xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800'
                }`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1 ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-500" />
                    <span>Alleged Publisher Domain</span>
                  </span>
                  <p className={`text-xs sm:text-sm font-mono font-black ${isLight ? 'text-sky-700' : 'text-cyan-300'}`}>
                    {card.allegedSource.domain}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Source Provenance */}
          {activeTab === 'source' && (
            <div className="space-y-4 animate-fade-in">
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-base font-black flex items-center gap-2 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      <span>{card.allegedSource.name}</span>
                      {card.allegedSource.verifiedBadge && (
                        <span title="Claimed Verified Badge" className="inline-flex items-center">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </span>
                      )}
                    </h3>
                    <span className={`text-xs font-mono font-bold ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
                      {card.allegedSource.domain}
                    </span>
                  </div>
                  <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                    isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'
                  }`}>
                    Alleged Publisher
                  </span>
                </div>

                <div className={`pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                  <div className={`text-xs font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    Attributed Byline: <span className={isLight ? 'text-indigo-700 font-extrabold' : 'text-indigo-300 font-bold'}>{card.allegedSource.author}</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {card.allegedSource.authorBio}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Stated Evidence */}
          {activeTab === 'evidence' && (
            <div className="space-y-4 animate-fade-in">
              <div className={`p-5 rounded-2xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Stated Methodology & Presented Proof
                </span>
                <p className={`text-xs sm:text-sm leading-relaxed font-sans font-medium ${
                  isLight ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  {card.statedEvidence}
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isLight ? 'bg-amber-50/40 border-amber-200/80' : 'bg-slate-950/40 border-slate-800'
              }`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${
                  isLight ? 'text-amber-900' : 'text-slate-400'
                }`}>
                  Reported Context & Circumstances
                </span>
                <p className={`text-xs leading-relaxed italic ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  "{card.contextSnippet}"
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Attached Media Artifacts */}
          {activeTab === 'media' && (
            <div className="space-y-4 animate-fade-in">
              <div className={`p-5 rounded-2xl border space-y-4 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {card.attachedMedia.type === 'image' && <ImageIcon className="w-4 h-4 text-rose-500" />}
                    {card.attachedMedia.type === 'audio' && <Music className="w-4 h-4 text-amber-500" />}
                    {card.attachedMedia.type === 'chart' && <BarChart2 className="w-4 h-4 text-sky-500" />}
                    {card.attachedMedia.type === 'document' && <FileText className="w-4 h-4 text-emerald-600" />}
                    <h4 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {card.attachedMedia.title}
                    </h4>
                  </div>
                  <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                    isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {card.attachedMedia.type}
                  </span>
                </div>

                {/* Image Artifact Forensic Viewer */}
                {card.attachedMedia.type === 'image' && (
                  <div className={`relative rounded-2xl overflow-hidden border p-4 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <div className={`aspect-video w-full rounded-xl flex flex-col items-center justify-center p-4 text-center relative ${
                      isLight ? 'bg-gradient-to-br from-slate-100 to-amber-50 border border-slate-200' : 'bg-slate-900'
                    }`}>
                      <ImageIcon className={`w-12 h-12 mb-2 ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />
                      <p className={`text-xs font-semibold max-w-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {card.attachedMedia.caption}
                      </p>
                      
                      {/* Magnifier Action */}
                      <button
                        onClick={() => setIsMagnified(!isMagnified)}
                        className={`mt-3 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition transform active:scale-95 ${
                          isLight
                            ? 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 shadow-xs'
                            : 'bg-slate-800 text-cyan-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>{isMagnified ? 'Hide Pixel Forensics' : 'Inspect Visual Artifacts'}</span>
                      </button>
                    </div>

                    {/* Magnified Artifact Clues */}
                    {isMagnified && card.attachedMedia.visualArtifactHints && (
                      <div className={`mt-3 p-3.5 rounded-xl border text-xs space-y-1.5 animate-fade-in ${
                        isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-950' : 'bg-indigo-950/80 border-indigo-500/40 text-slate-300'
                      }`}>
                        <div className="font-black flex items-center gap-1.5 text-indigo-800">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Magnified Visual Anomaly Flags:</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-[11px]">
                          {card.attachedMedia.visualArtifactHints.map((hint, i) => (
                            <li key={i}>{hint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Audio Waveform Simulator */}
                {card.attachedMedia.type === 'audio' && (
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleToggleAudioSnippet}
                        className="p-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-black shadow-md transition transform active:scale-90"
                      >
                        {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>
                      <div>
                        <div className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          Audio Forensic Wiretap Clip
                        </div>
                        <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          Acoustic waveform analysis & vocoder cutoff trace
                        </div>
                      </div>
                    </div>

                    {/* Waveform Bars */}
                    <div className={`flex items-center justify-between gap-1 h-12 px-3 rounded-xl border ${
                      isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
                    }`}>
                      {(card.attachedMedia.waveformSim || [20, 50, 80, 40, 90, 30, 70, 100, 25, 60, 85, 45, 95, 20]).map((bar, i) => (
                        <div
                          key={i}
                          className={`w-full rounded-full transition-all duration-200 ${
                            isPlayingAudio ? 'bg-amber-500 animate-pulse' : isLight ? 'bg-slate-300' : 'bg-slate-700'
                          }`}
                          style={{ height: `${Math.max(15, bar)}%` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Chart Visual Simulator */}
                {card.attachedMedia.type === 'chart' && card.attachedMedia.chartData && (
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                      Data Visualization Geometry:
                    </div>
                    <div className="space-y-2">
                      {card.attachedMedia.chartData.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className={`flex justify-between text-xs font-bold ${
                            isLight ? 'text-slate-700' : 'text-slate-300'
                          }`}>
                            <span>{item.label}</span>
                            <span className="font-mono text-sky-600">{item.value} {item.baseline ? `/ ${item.baseline}` : ''}</span>
                          </div>
                          <div className={`w-full h-3.5 rounded-full overflow-hidden ${
                            isLight ? 'bg-slate-100' : 'bg-slate-800'
                          }`}>
                            <div
                              className="h-full bg-sky-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, (item.value / (item.baseline || 10)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Document Extract */}
                {card.attachedMedia.type === 'document' && (
                  <div className={`p-4 rounded-2xl border font-mono text-xs leading-relaxed ${
                    isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}>
                    <div className="text-emerald-600 font-bold mb-2 pb-1 border-b border-slate-200">
                      AUTHENTICATED DOCUMENT REGISTRY
                    </div>
                    <p>{card.attachedMedia.details}</p>
                  </div>
                )}

                <p className={`text-xs italic ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {card.attachedMedia.details}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forensic SIFT Hint Modal */}
      {isHintOpen && (
        <HintModal
          card={card}
          accessibilitySettings={accessibilitySettings}
          onClose={() => setIsHintOpen(false)}
        />
      )}
    </div>
  );
};

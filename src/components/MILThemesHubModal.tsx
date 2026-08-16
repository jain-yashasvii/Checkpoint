import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Users, 
  Flame, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Award, 
  Layers, 
  Lightbulb, 
  Compass, 
  Globe2, 
  Play,
  HeartHandshake,
  Bot
} from 'lucide-react';
import { MILTheme, AccessibilitySettings, GameSettings, Demographic } from '../types/game';
import { TRANSLATIONS } from '../data/translations';
import { getLocalizedMILTheme } from '../utils/localization';
import { audioSystem } from '../utils/audio';

interface MILThemesHubModalProps {
  accessibilitySettings: AccessibilitySettings;
  onClose: () => void;
  onSelectThemeTrack?: (theme: MILTheme) => void;
  onSelectTheme?: (theme: MILTheme) => void;
  onStartCustomMatchWithTheme?: (theme: MILTheme, demographic: Demographic) => void;
}

interface ThemeDetail {
  id: MILTheme;
  title: string;
  shortLabel: string;
  tagline: string;
  icon: React.ReactNode;
  accentColor: string;
  badgeTitle: string;
  badgeDescription: string;
  challenges: string[];
  innovativeSolutions: {
    title: string;
    description: string;
  }[];
  realWorldInterventions: string[];
  sampleCaseFiles: {
    title: string;
    description: string;
    siftAction: string;
  }[];
}

const THEME_DETAILS: ThemeDetail[] = [
  {
    id: 'ai_and_mil',
    title: 'AI and MIL: Innovative Solutions for AI Challenges',
    shortLabel: 'AI and MIL',
    tagline: 'Innovative solutions addressing challenges posed by Generative AI, Deepfakes, and Algorithmic Bias through MIL',
    icon: <Bot className="w-5 h-5" />,
    accentColor: 'from-purple-500 to-indigo-600',
    badgeTitle: 'AI & Deepfake Sentinel',
    badgeDescription: 'Pioneered forensic solutions against synthetic voice cloning, GAN glitches, and generative hallucinations.',
    challenges: [
      'Hyper-realistic voice cloning used in executive financial fraud and family emergency vishing scams',
      'Generative AI image diffusion models creating fabricated historical events and deceptive crisis photography',
      'Hallucinated citations and synthetic authority bias in AI-assisted research and news aggregation',
      'Algorithmic echo chambers amplifying emotive AI-generated synthetic content for engagement',
    ],
    innovativeSolutions: [
      {
        title: 'Tactile Forensics Clue Engine',
        description: 'Interactive audio spectral analysis (8kHz cutoff detection) and C2PA Content Credentials inspection built directly into gameplay.',
      },
      {
        title: 'Cognitive Inoculation ("Prebunking")',
        description: 'Active learning drills where players diagnose GAN hand deformities, lighting mismatches, and synthetic breathing physics before encountering them in the wild.',
      },
      {
        title: 'Out-of-Band Verification Protocols',
        description: 'Training users to enforce multi-party cryptographic and secondary channel confirmation for voice/video requests.',
      },
    ],
    realWorldInterventions: [
      'Establish workplace AI-vishing simulation drills using the SIFT Method',
      'Mandate C2PA provenance validation on digital newsrooms and student research portals',
      'Teach vocal timbre and micro-cadence recognition in secondary school media literacy curricula',
    ],
    sampleCaseFiles: [
      {
        title: 'Leaked CEO Audio Memo ($10M Wire Directive)',
        description: 'Deconstruct a synthetic voice memo created with ElevenLabs to bypass corporate treasury controls.',
        siftAction: 'Analyze AI artifacts to spot 8kHz spectral brickwall filters and 0ms room resonance.',
      },
      {
        title: '1920s Victorian Smartphone Time-Traveler',
        description: 'Examine a viral sepia photograph created in Midjourney v6 claiming historical anachronisms.',
        siftAction: 'Trace C2PA metadata and spot 6-fingered anatomical glitches and melting cobblestones.',
      },
    ],
  },
  {
    id: 'mil_education',
    title: 'MIL Education: Creative Approaches to Digital Learning',
    shortLabel: 'MIL Education',
    tagline: 'Creative approaches to MIL learning in the digital age via gamification, SIFT pedagogy, and inquiry-based deduction',
    icon: <BookOpen className="w-5 h-5" />,
    accentColor: 'from-blue-500 to-cyan-600',
    badgeTitle: 'MIL Pedagogy Champion',
    badgeDescription: 'Mastered creative pedagogical frameworks (SIFT) to teach digital verification in modern classrooms.',
    challenges: [
      'Outdated checklist-based media evaluation (e.g. CRAAP test) failing against modern lookalike domain spoofs',
      'Passive lecture models resulting in low digital fact-checking retention among digital-native students',
      'Cognitive overload and verification fatigue caused by endless social media feeds and algorithmic pacing',
    ],
    innovativeSolutions: [
      {
        title: 'Gamified SIFT Deductive Investigation',
        description: 'Replacing rote lectures with social deduction gameplay where players allocate token budgets to uncover forensic clues.',
      },
      {
        title: 'Interactive Cross-Examination & Peer Debate',
        description: 'Simulated multi-agent deliberation where players formulate critical questions based on evidence cards rather than passive reading.',
      },
      {
        title: 'Prudent Sentinel Decision Matrix',
        description: 'Rewarding the "Unverifiable / Do Not Share" verdict to teach epistemological humility and responsible sharing hygiene.',
      },
    ],
    realWorldInterventions: [
      'Integrate Checkpoint into university journalism and high-school civics curricula',
      'Host classroom "Verification Tournaments" measuring lateral reading speed and source corroborated confidence',
      'Provide teachers with interactive debrief dossiers mapping every match to Global MIL Competency Frameworks',
    ],
    sampleCaseFiles: [
      {
        title: 'Solid-State Battery Breakthrough (Nature / ScienceDirect)',
        description: 'Distinguish authentic peer-reviewed materials science replication logs from premature hype.',
        siftAction: 'Inspect DOI repositories on Zenodo and verify 26-sigma statistical significance.',
      },
      {
        title: 'Global Tech Foundation Grant Portal Phish',
        description: 'Compare legitimate .org academic foundations against 9-day-old .co domain lookalikes.',
        siftAction: 'Execute Lateral Reading in a new tab to find campus cybersecurity phishing alerts.',
      },
    ],
  },
  {
    id: 'community_impact',
    title: 'Community Impact: MIL Interventions Empowering Communities',
    shortLabel: 'Community Impact',
    tagline: 'MIL-based interventions that empower local communities, protect seniors, and build grassroots civic resilience',
    icon: <Users className="w-5 h-5" />,
    accentColor: 'from-emerald-500 to-teal-600',
    badgeTitle: 'Community Civic Shield',
    badgeDescription: 'Safeguarded public health and grassroots communities against viral crisis infodemics and predatory fraud.',
    challenges: [
      'Predatory health and memory tonic scams targeting senior citizens and family savings with truncated charts',
      'Recycled disaster and extreme weather footage causing mass public panic and emergency dispatch overload',
      'Intergenerational information divides leaving elderly and non-tech-savvy community members vulnerable to fraud',
    ],
    innovativeSolutions: [
      {
        title: 'Community Demographic Scenarios',
        description: 'Tailored case decks specifically simulating senior health claims, Medicare scams, and neighborhood civic alerts.',
      },
      {
        title: 'Intergenerational Fact-Checking Circles',
        description: 'Multi-generational cooperative play connecting tech-savvy youth with seniors to investigate suspicious messages together.',
      },
      {
        title: 'Data & Y-Axis Dissection Drills',
        description: 'Visual chart forensics teaching citizens to spot truncated scales, missing control groups, and funded conflicts of interest.',
      },
    ],
    realWorldInterventions: [
      'Deploy localized MIL workshops at community senior centers, libraries, and neighborhood associations',
      'Train community health workers and local pharmacists to debrief patients using the SIFT Method',
      'Establish grassroots community "Rumor Control Desks" during natural disasters and municipal emergencies',
    ],
    sampleCaseFiles: [
      {
        title: '400% Brain Clarity Memory Tonic Trial',
        description: 'Uncover how commercial supplement marketing used a truncated 0-10 Y-axis and 8-person sample to fake efficacy.',
        siftAction: 'Cross-check PubMed systematic reviews and identify the manufacturer funding conflict.',
      },
      {
        title: 'Downtown Subway Flood Crisis Footage',
        description: 'Trace dramatic viral flood video back to Hurricane Ida in 2021 rather than today\'s light rain.',
        siftAction: 'Execute Reverse Image Search and verify city transit authority operational logs.',
      },
    ],
  },
  {
    id: 'youth_engagement',
    title: 'Youth Engagement: Positioning Youth as MIL Change Agents',
    shortLabel: 'Youth Engagement',
    tagline: 'Strategies to position youth organizations, student leaders, and young creators as active MIL change agents',
    icon: <Flame className="w-5 h-5" />,
    accentColor: 'from-amber-500 to-orange-600',
    badgeTitle: 'Youth Change Agent',
    badgeDescription: 'Empowered peer-to-peer networks and viral social debunking campaigns as an accredited MIL ambassador.',
    challenges: [
      'Viral meme formats, decontextualized cropped satire, and algorithmic outrage traps targeting youth attention',
      'Student financial aid and scholarship credential phishing harvesting campus SSO passwords',
      'Pressure on young content creators to share unverified breaking news rapidly to maintain algorithmic momentum',
    ],
    innovativeSolutions: [
      {
        title: '"Share My Passport" Viral Awareness Engine',
        description: 'Copyable social media performance summaries formatted for X, LinkedIn, and Discord to turn verification into a badge of honor.',
      },
      {
        title: 'Peer-to-Peer Student Verification Squads',
        description: 'Gamified lobby and role-briefing mechanics training youth to act as fact-checking mentors for peers.',
      },
      {
        title: 'Satire & Humor Framing Deconstruction',
        description: 'Training youth to identify cropped disclaimers and comedic hyperbole before reposting out-of-context headlines.',
      },
    ],
    realWorldInterventions: [
      'Launch Youth MIL Ambassador programs across high schools, universities, and youth clubs worldwide',
      'Incentivize young content creators to publish short-form video breakdowns explaining how they debunked viral claims',
      'Incorporate student-led fact-checking desks in university student newspapers and student government councils',
    ],
    sampleCaseFiles: [
      {
        title: 'Supreme Court Rules 3 TikToks/Day is Federal Waste',
        description: 'Demonstrates how a harmless parody blog post was cropped to remove the satire masthead for rage-bait.',
        siftAction: 'Trace the source footer and check Supreme Court official summer recess calendars.',
      },
      {
        title: 'STEM Undergrad $15K Zero-Essay Grant Scam',
        description: 'Investigate lookalike .co scholarship domain asking for university login credentials.',
        siftAction: 'Verify WHOIS registry date (9 days old) and check official campus financial aid advisory boards.',
      },
    ],
  },
  {
    id: 'open_track',
    title: 'Open Track: Accessible & Multilateral Information Integrity',
    shortLabel: 'Open Track',
    tagline: 'Inclusive multi-sensory sign language verification, 7-language localization, and cross-border digital provenance',
    icon: <Zap className="w-5 h-5" />,
    accentColor: 'from-cyan-500 to-blue-600',
    badgeTitle: 'Accessible Integrity Pioneer',
    badgeDescription: 'Championed inclusive multi-sensory sign language verification and multilateral digital provenance.',
    challenges: [
      'Most online verification tools exclude Deaf, hard-of-hearing, and visually impaired citizens with text-only interfaces',
      'Language barriers in global crisis reporting causing regional fact-checking silos and delayed truth dissemination',
      'Lack of real-time open-data triangulation across international space and meteorological telemetry systems',
    ],
    innovativeSolutions: [
      {
        title: 'Interactive 3D Sign Language Avatar & Gestures',
        description: 'Animated visual sign avatar performing 6 fundamental MIL gestures (FACT, EVIDENCE, VERIFY, DOUBT, SOURCE, DECEPTION).',
      },
      {
        title: '7-Language Multilateral Localization',
        description: 'Full interface translation across English, Spanish, Hindi, French, Arabic, German, and Japanese.',
      },
      {
        title: 'Open Geospatial & Satellite Triangulation',
        description: 'Teaching citizens to utilize open NASA FIRMS thermal satellites, CAP emergency schemas, and international astronomical repositories.',
      },
    ],
    realWorldInterventions: [
      'Standardize tactile and sign-language fact-checking tools for global accessibility compliance in civic tech',
      'Facilitate cross-border fact-checking syndicates translating localized verification reports across linguistic borders',
      'Promote public satellite data literacy for emergency management agencies and humanitarian relief organizations',
    ],
    sampleCaseFiles: [
      {
        title: 'County Level 2 Wildfire Evacuation GIS Alert',
        description: 'Verify official .gov emergency alerts using FEMA Common Alerting Protocol (CAP) and NASA FIRMS satellite data.',
        siftAction: 'Inspect GIS polygon telemetry and verify simultaneous NOAA weather radio broadcasts.',
      },
      {
        title: 'Multilateral Space Telescope Exoplanet Discovery',
        description: 'Cross-reference spectral telemetry across international space agencies (NASA, ESA, CSA).',
        siftAction: 'Triangulate readings across 3 independent telescope instruments (NIRSpec, NIRCam, PRISM).',
      },
    ],
  },
];

export const MILThemesHubModal: React.FC<MILThemesHubModalProps> = ({
  accessibilitySettings,
  onClose,
  onSelectThemeTrack,
  onSelectTheme,
  onStartCustomMatchWithTheme,
}) => {
  const [activeThemeId, setActiveThemeId] = useState<MILTheme>('ai_and_mil');
  const t = TRANSLATIONS[accessibilitySettings.language] || TRANSLATIONS.en;
  const isLight = accessibilitySettings.themeMode !== 'dark' && !accessibilitySettings.highContrast;
  const isHighContrast = accessibilitySettings.highContrast;

  const currentTheme = THEME_DETAILS.find((t) => t.id === activeThemeId) || THEME_DETAILS[0];

  const handleLaunchTrack = (themeOverride?: MILTheme) => {
    const targetTheme = themeOverride || activeThemeId;
    audioSystem.playSuccessChime();
    const demoMap: Record<MILTheme, Demographic> = {
      ai_and_mil: 'college',
      mil_education: 'college',
      community_impact: 'senior',
      youth_engagement: 'teen',
      open_track: 'professional',
    };
    const targetDemo = demoMap[targetTheme] || 'college';

    if (onStartCustomMatchWithTheme) {
      onStartCustomMatchWithTheme(targetTheme, targetDemo);
    } else if (onSelectThemeTrack) {
      onSelectThemeTrack(targetTheme);
    } else if (onSelectTheme) {
      onSelectTheme(targetTheme);
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mil-hub-title"
    >
      <div className={`w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] ${
        isHighContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : isLight
          ? 'bg-white text-slate-800 border-amber-900/10'
          : 'bg-slate-900 text-slate-100 border-slate-800'
      }`}>
        {/* Header */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between gap-4 ${
          isLight ? 'bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border-slate-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm ${
              isLight ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-indigo-600/30 text-cyan-300 border border-indigo-500/40'
            }`}>
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isLight ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-500/20 text-cyan-300'
                }`}>
                  Global MIL Framework
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full hidden sm:inline-block ${
                  isLight ? 'bg-amber-100 text-amber-900' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  5 Core Verification Tracks
                </span>
              </div>
              <h2 id="mil-hub-title" className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                MIL Themes & Curriculum Hub
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              audioSystem.playClick();
              onClose();
            }}
            className={`p-2.5 rounded-2xl border transition ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            aria-label="Close MIL Themes Hub"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Theme Tabs */}
        <div className={`px-4 sm:px-6 pt-3 pb-2 border-b flex items-center gap-2 overflow-x-auto no-scrollbar ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          {THEME_DETAILS.map((tItem) => {
            const isActive = tItem.id === activeThemeId;
            const localizedTheme = getLocalizedMILTheme(tItem.id, accessibilitySettings.language);
            return (
              <button
                key={tItem.id}
                onClick={() => {
                  audioSystem.playClick();
                  setActiveThemeId(tItem.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition border shrink-0 ${
                  isActive
                    ? isHighContrast
                      ? 'bg-yellow-400 text-black border-yellow-400 font-black'
                      : isLight
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : isLight
                    ? 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {tItem.icon}
                <span>{localizedTheme.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* Main Theme Banner */}
          <div className={`p-5 sm:p-6 rounded-3xl border relative overflow-hidden ${
            isHighContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : isLight
              ? 'bg-gradient-to-br from-indigo-50/90 via-amber-50/50 to-white border-indigo-200/80 shadow-sm'
              : 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-indigo-500/30 shadow-xl'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isLight ? 'bg-indigo-100 text-indigo-900' : 'bg-indigo-500/20 text-cyan-300'
                  }`}>
                    UNESCO MIL TRACK
                  </span>
                  <span className={`text-xs font-bold flex items-center gap-1 ${
                    isLight ? 'text-amber-700' : 'text-amber-400'
                  }`}>
                    <Award className="w-3.5 h-3.5" /> Badge: {currentTheme.badgeTitle}
                  </span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {getLocalizedMILTheme(currentTheme.id, accessibilitySettings.language).title}
                </h3>
                <p className={`text-xs sm:text-sm mt-1 max-w-2xl font-medium ${
                  isLight ? 'text-slate-600' : 'text-slate-300'
                }`}>
                  {getLocalizedMILTheme(currentTheme.id, accessibilitySettings.language).shortDesc}
                </p>
              </div>

              {/* Play Track Button */}
              <button
                type="button"
                onClick={() => handleLaunchTrack()}
                className={`px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 shrink-0 ${
                  isHighContrast
                    ? 'bg-yellow-400 text-black border-2 border-black'
                    : isLight
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-indigo-500/30'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.launchTrack}</span>
              </button>
            </div>
          </div>

          {/* 2-Column Grid: Challenges vs Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Key Digital Challenges */}
            <div className={`p-5 rounded-3xl border space-y-3.5 ${
              isLight ? 'bg-rose-50/50 border-rose-200/70' : 'bg-slate-950/60 border-rose-900/30'
            }`}>
              <div className="flex items-center gap-2 text-rose-600">
                <ShieldCheck className="w-4 h-4" />
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Critical Challenges Addressed
                </h4>
              </div>
              <ul className="space-y-2.5">
                {currentTheme.challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Innovative MIL Solutions in App */}
            <div className={`p-5 rounded-3xl border space-y-3.5 ${
              isLight ? 'bg-emerald-50/50 border-emerald-200/70' : 'bg-slate-950/60 border-emerald-900/30'
            }`}>
              <div className="flex items-center gap-2 text-emerald-600">
                <Lightbulb className="w-4 h-4" />
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Innovative Game Solutions
                </h4>
              </div>
              <div className="space-y-3">
                {currentTheme.innovativeSolutions.map((sol, i) => (
                  <div key={i} className="text-xs">
                    <div className={`font-bold ${isLight ? 'text-emerald-900' : 'text-emerald-300'}`}>
                      {sol.title}
                    </div>
                    <p className={`mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {sol.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-World Interventions & Civic Impact */}
          <div className={`p-5 rounded-3xl border space-y-3 ${
            isLight ? 'bg-amber-50/50 border-amber-200/80' : 'bg-slate-950/60 border-amber-900/30'
          }`}>
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <HeartHandshake className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Real-World Civic Interventions & Action Plan
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentTheme.realWorldInterventions.map((rw, i) => (
                <div key={i} className={`p-3 rounded-2xl border text-xs ${
                  isLight ? 'bg-white border-amber-200/60 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}>
                  <span className="font-bold text-amber-600 block mb-1">Pillar #{i + 1}</span>
                  {rw}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Case Studies for This Theme */}
          <div className="space-y-3">
            <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Interactive Scenarios Aligned to {currentTheme.shortLabel}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentTheme.sampleCaseFiles.map((cs, i) => (
                <div 
                  key={i}
                  className={`p-4 rounded-2xl border transition-all ${
                    isLight 
                      ? 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs' 
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full ${
                      isLight ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-indigo-950 text-cyan-300 border border-indigo-800'
                    }`}>
                      Case File #{i + 1}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">✓ SIFT Verified</span>
                  </div>
                  <h5 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {cs.title}
                  </h5>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {cs.description}
                  </p>
                  <div className={`mt-2.5 pt-2 border-t flex items-center justify-between gap-2 text-[11px] font-medium ${
                    isLight ? 'border-slate-100 text-indigo-700' : 'border-slate-800 text-indigo-300'
                  }`}>
                    <div><span className="font-bold">SIFT Drill:</span> {cs.siftAction}</div>
                    <button
                      type="button"
                      onClick={() => handleLaunchTrack(activeThemeId)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 transition ${
                        isLight
                          ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                          : 'bg-indigo-900/60 hover:bg-indigo-800 text-cyan-300 border border-indigo-700'
                      }`}
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Play Case</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation Actions */}
        <div className={`p-4 sm:p-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Globe2 className="w-4 h-4 text-indigo-500" />
            <span>Aligned with Global Media and Information Literacy Curriculum Guidelines</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                audioSystem.playClick();
                onClose();
              }}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-bold border transition ${
                isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              Close Hub
            </button>

            <button
              onClick={handleLaunchTrack}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition ${
                isLight ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Theme Match</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

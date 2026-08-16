import { VerificationPassport, Demographic } from '../types/game';
import { LeaderboardPlayer, LeaderboardTimeframe, LeaderboardCategoryFilter } from '../types/leaderboard';

// Curated top global MIL fact-checkers & youth ambassadors
const BASE_GLOBAL_CHAMPIONS: Omit<LeaderboardPlayer, 'rank' | 'isLocalUser'>[] = [
  {
    id: 'champ_1',
    userName: 'Aiko Tanaka',
    avatar: '👩‍🔬',
    countryCode: 'JP',
    countryName: 'Japan',
    flag: '🇯🇵',
    city: 'Tokyo',
    rankTitle: 'Chief Truth Sentinel',
    verificationPoints: 3420,
    accuracyRate: 99.2,
    impostersIdentified: 84,
    totalGamesPlayed: 92,
    specialty: 'GAN Artifact & Deepfake Audio Spectral Forensics',
    specialtyCategory: 'ai_manipulation',
    milTrack: 'ai_and_mil',
    demographic: 'college',
    isVerifiedSentinel: true,
    motto: 'Always inspect the spectral cutoffs before forwarding synthetic audio clips.',
    skillVectors: {
      sourceVerification: 96,
      evidenceAssessment: 98,
      contextChecking: 94,
      crossReferencing: 97,
      aiManipulationDetection: 99,
    },
    featuredBadgeTitle: 'Neural Artifact Hunter',
    featuredBadgeIcon: 'ShieldCheck',
  },
  {
    id: 'champ_2',
    userName: 'Dr. Malik Osei',
    avatar: '👨‍🏫',
    countryCode: 'KE',
    countryName: 'Kenya',
    flag: '🇰🇪',
    city: 'Nairobi',
    rankTitle: 'Senior Lateral Reader & Fact-Check Lead',
    verificationPoints: 3180,
    accuracyRate: 98.6,
    impostersIdentified: 76,
    totalGamesPlayed: 85,
    specialty: 'Domain Spoofing & Lookalike WHOIS Analysis',
    specialtyCategory: 'source',
    milTrack: 'mil_education',
    demographic: 'professional',
    isVerifiedSentinel: true,
    motto: 'Lateral reading: leave the suspicious tab immediately and open 3 independent news wires.',
    skillVectors: {
      sourceVerification: 99,
      evidenceAssessment: 92,
      contextChecking: 95,
      crossReferencing: 98,
      aiManipulationDetection: 91,
    },
    featuredBadgeTitle: 'Master of Lateral Reading',
    featuredBadgeIcon: 'Globe',
  },
  {
    id: 'champ_3',
    userName: 'Camille Laurent',
    avatar: '🕵️‍♀️',
    countryCode: 'FR',
    countryName: 'France',
    flag: '🇫🇷',
    city: 'Paris',
    rankTitle: 'Media Forensics Specialist',
    verificationPoints: 2940,
    accuracyRate: 97.8,
    impostersIdentified: 69,
    totalGamesPlayed: 78,
    specialty: 'Recycled Crisis Imagery & Shadow Geolocation',
    specialtyCategory: 'context',
    milTrack: 'community_impact',
    demographic: 'college',
    isVerifiedSentinel: true,
    motto: 'Check the weather, sun angle, and street signs before believing recycled breaking news.',
    skillVectors: {
      sourceVerification: 93,
      evidenceAssessment: 94,
      contextChecking: 99,
      crossReferencing: 95,
      aiManipulationDetection: 92,
    },
    featuredBadgeTitle: 'Temporal Timeline Sleuth',
    featuredBadgeIcon: 'Clock',
  },
  {
    id: 'champ_4',
    userName: 'Aarav Sharma',
    avatar: '🧑‍💻',
    countryCode: 'IN',
    countryName: 'India',
    flag: '🇮🇳',
    city: 'New Delhi',
    rankTitle: 'Civic Shield Ambassador',
    verificationPoints: 2710,
    accuracyRate: 97.1,
    impostersIdentified: 62,
    totalGamesPlayed: 70,
    specialty: 'WhatsApp Viral Forward Auditing & SIFT Mentorship',
    specialtyCategory: 'source',
    milTrack: 'youth_engagement',
    demographic: 'teen',
    isVerifiedSentinel: true,
    motto: 'A 5-second pause before forwarding saves whole communities from medical rumors.',
    skillVectors: {
      sourceVerification: 95,
      evidenceAssessment: 91,
      contextChecking: 94,
      crossReferencing: 96,
      aiManipulationDetection: 89,
    },
    featuredBadgeTitle: 'Youth Change Agent',
    featuredBadgeIcon: 'Flame',
  },
  {
    id: 'champ_5',
    userName: 'Elena Rostova',
    avatar: '📊',
    countryCode: 'DE',
    countryName: 'Germany',
    flag: '🇩🇪',
    city: 'Berlin',
    rankTitle: 'Data & Axis Dissector',
    verificationPoints: 2480,
    accuracyRate: 96.5,
    impostersIdentified: 58,
    totalGamesPlayed: 65,
    specialty: 'Truncated Y-Axes & Baseline Manipulation Audit',
    specialtyCategory: 'evidence',
    milTrack: 'mil_education',
    demographic: 'professional',
    isVerifiedSentinel: true,
    motto: 'Never trust a chart without verifying where its vertical axis starts.',
    skillVectors: {
      sourceVerification: 90,
      evidenceAssessment: 99,
      contextChecking: 91,
      crossReferencing: 93,
      aiManipulationDetection: 88,
    },
    featuredBadgeTitle: 'Data & Axis Dissector',
    featuredBadgeIcon: 'BarChart2',
  },
  {
    id: 'champ_6',
    userName: 'Gabriel Silva',
    avatar: '🛡️',
    countryCode: 'BR',
    countryName: 'Brazil',
    flag: '🇧🇷',
    city: 'São Paulo',
    rankTitle: 'Truth Sentinel',
    verificationPoints: 2260,
    accuracyRate: 95.8,
    impostersIdentified: 53,
    totalGamesPlayed: 60,
    specialty: 'Public Health Preprints & Clinical Trial Cross-Checks',
    specialtyCategory: 'evidence',
    milTrack: 'community_impact',
    demographic: 'college',
    isVerifiedSentinel: true,
    motto: 'Correlation is not causation. Always inspect the sample size and control group.',
    skillVectors: {
      sourceVerification: 91,
      evidenceAssessment: 96,
      contextChecking: 92,
      crossReferencing: 90,
      aiManipulationDetection: 87,
    },
    featuredBadgeTitle: 'Prudent Sentinel',
    featuredBadgeIcon: 'AlertCircle',
  },
  {
    id: 'champ_7',
    userName: 'Maya Chen',
    avatar: '✨',
    countryCode: 'SG',
    countryName: 'Singapore',
    flag: '🇸🇬',
    city: 'Singapore',
    rankTitle: 'AI Synthesis Forensics Lead',
    verificationPoints: 2050,
    accuracyRate: 95.2,
    impostersIdentified: 48,
    totalGamesPlayed: 54,
    specialty: 'Diffusion Image Pupil Reflections & Anatomy Glitches',
    specialtyCategory: 'ai_manipulation',
    milTrack: 'ai_and_mil',
    demographic: 'teen',
    isVerifiedSentinel: true,
    motto: 'Look at the background text, ear shapes, and eye specular highlights.',
    skillVectors: {
      sourceVerification: 88,
      evidenceAssessment: 89,
      contextChecking: 90,
      crossReferencing: 91,
      aiManipulationDetection: 98,
    },
    featuredBadgeTitle: 'AI & Deepfake Sentinel',
    featuredBadgeIcon: 'Sparkles',
  },
  {
    id: 'champ_8',
    userName: 'Prof. Arthur Vance',
    avatar: '🧐',
    countryCode: 'CA',
    countryName: 'Canada',
    flag: '🇨🇦',
    city: 'Toronto',
    rankTitle: 'Distinguished SIFT Fellow',
    verificationPoints: 1840,
    accuracyRate: 94.7,
    impostersIdentified: 44,
    totalGamesPlayed: 50,
    specialty: 'Historical Revisionism & Citation Loop Detection',
    specialtyCategory: 'context',
    milTrack: 'open_track',
    demographic: 'senior',
    isVerifiedSentinel: true,
    motto: 'Trace circular citations back to the primary peer-reviewed archival source.',
    skillVectors: {
      sourceVerification: 94,
      evidenceAssessment: 90,
      contextChecking: 96,
      crossReferencing: 94,
      aiManipulationDetection: 85,
    },
    featuredBadgeTitle: 'Master of Lateral Reading',
    featuredBadgeIcon: 'Compass',
  },
  {
    id: 'champ_9',
    userName: 'Zainab Al-Mansoor',
    avatar: '🌟',
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    flag: '🇦🇪',
    city: 'Dubai',
    rankTitle: 'Youth Engagement Ambassador',
    verificationPoints: 1630,
    accuracyRate: 94.1,
    impostersIdentified: 39,
    totalGamesPlayed: 45,
    specialty: 'Social Media Algorithmic Echo Chambers & Viral Clones',
    specialtyCategory: 'source',
    milTrack: 'youth_engagement',
    demographic: 'teen',
    isVerifiedSentinel: true,
    motto: 'Question algorithms that optimize for outrage rather than verified factual truth.',
    skillVectors: {
      sourceVerification: 92,
      evidenceAssessment: 88,
      contextChecking: 93,
      crossReferencing: 91,
      aiManipulationDetection: 90,
    },
    featuredBadgeTitle: 'Youth Change Agent',
    featuredBadgeIcon: 'Flame',
  },
  {
    id: 'champ_10',
    userName: 'Liam O\'Connor',
    avatar: '🚀',
    countryCode: 'IE',
    countryName: 'Ireland',
    flag: '🇮🇪',
    city: 'Dublin',
    rankTitle: 'Lead Lateral Reader',
    verificationPoints: 1420,
    accuracyRate: 93.4,
    impostersIdentified: 35,
    totalGamesPlayed: 40,
    specialty: 'Automated Botnets & Coordinated Inauthentic Behavior',
    specialtyCategory: 'source',
    milTrack: 'open_track',
    demographic: 'college',
    isVerifiedSentinel: true,
    motto: 'Check account creation dates and repetitive reply timestamps.',
    skillVectors: {
      sourceVerification: 93,
      evidenceAssessment: 89,
      contextChecking: 88,
      crossReferencing: 92,
      aiManipulationDetection: 87,
    },
    featuredBadgeTitle: 'Accessible Integrity Pioneer',
    featuredBadgeIcon: 'Zap',
  },
];

export const WorldLeaderboardService = {
  /**
   * Fetch leaderboard entries asynchronously with realistic network simulation.
   * Dynamically places the local user based on their real VerificationPassport points.
   */
  async fetchTopPlayers(
    userPassport: VerificationPassport,
    timeframe: LeaderboardTimeframe = 'all_time',
    categoryFilter: LeaderboardCategoryFilter = 'all',
    demographicFilter: Demographic | 'all' = 'all'
  ): Promise<{
    topTen: LeaderboardPlayer[];
    userStanding: LeaderboardPlayer & { rankPercentage: number; pointsToNextRank: number };
    totalGlobalParticipants: number;
    lastUpdated: string;
  }> {
    // Simulate real network fetch latency (350ms)
    await new Promise(resolve => setTimeout(resolve, 350));

    // Clone base champions and adjust for weekly sprint if selected
    let pool = BASE_GLOBAL_CHAMPIONS.map(c => {
      if (timeframe === 'weekly_sprint') {
        const weeklyScale = 0.35 + (c.verificationPoints % 100) * 0.002;
        return {
          ...c,
          verificationPoints: Math.round(c.verificationPoints * weeklyScale),
          impostersIdentified: Math.max(5, Math.round(c.impostersIdentified * 0.3)),
        };
      }
      return { ...c };
    });

    // Filter by category if requested
    if (categoryFilter !== 'all') {
      pool = pool.filter(c => c.specialtyCategory === categoryFilter);
    }

    // Filter by demographic if requested
    if (demographicFilter !== 'all') {
      pool = pool.filter(c => c.demographic === demographicFilter);
    }

    // Calculate user's effective stats for this view
    const userPoints = timeframe === 'weekly_sprint' 
      ? Math.max(50, Math.round(userPassport.verificationPoints * 0.4))
      : userPassport.verificationPoints;

    const userAccuracy = userPassport.totalGamesPlayed > 0
      ? Math.min(100, Math.round(((userPassport.totalImpostersIdentified / Math.max(1, userPassport.totalGamesPlayed)) * 100) * 10) / 10)
      : 88.5;

    // Build local user player entry
    const localUserEntry: Omit<LeaderboardPlayer, 'rank'> = {
      id: userPassport.userId || 'local_user',
      userName: userPassport.userName || 'Investigator You',
      avatar: userPassport.avatar || '🕵️',
      countryCode: 'INTL',
      countryName: 'Global Citizen',
      flag: '🌐',
      city: 'Live HQ',
      rankTitle: userPassport.rankTitle || 'Cadet Fact-Checker',
      verificationPoints: userPoints,
      accuracyRate: userAccuracy,
      impostersIdentified: userPassport.totalImpostersIdentified,
      totalGamesPlayed: userPassport.totalGamesPlayed,
      specialty: 'Universal SIFT Fact-Checking & Lateral Reading',
      specialtyCategory: 'source',
      milTrack: 'ai_and_mil',
      demographic: 'college',
      isVerifiedSentinel: userPassport.verificationPoints >= 300,
      motto: 'Stop, Investigate, Find trusted coverage, Trace evidence.',
      skillVectors: userPassport.skillVectors,
      featuredBadgeTitle: userPassport.badges.find(b => b.unlocked)?.title || 'SIFT Method Cadet',
      featuredBadgeIcon: userPassport.badges.find(b => b.unlocked)?.icon || 'Compass',
      isLocalUser: true,
    };

    // Combine pool with local user and sort descending by verification points
    const combined = [...pool, localUserEntry].sort((a, b) => b.verificationPoints - a.verificationPoints);

    // Assign dynamic ranks
    const rankedList: LeaderboardPlayer[] = combined.map((p, idx) => ({
      ...p,
      rank: idx + 1,
    }));

    // Find local user in the ranked list
    const userRankIndex = rankedList.findIndex(p => p.isLocalUser);
    const userRank = userRankIndex !== -1 ? userRankIndex + 1 : 14;
    const userRankedPlayer = rankedList[userRankIndex] || {
      ...localUserEntry,
      rank: userRank,
    };

    // Calculate gap to next rank
    const nextPlayerAbove = userRankIndex > 0 ? rankedList[userRankIndex - 1] : null;
    const pointsToNextRank = nextPlayerAbove 
      ? Math.max(10, nextPlayerAbove.verificationPoints - userRankedPlayer.verificationPoints + 15)
      : 0;

    const totalGlobalParticipants = 14820;
    const rankPercentage = Math.max(1, Math.min(100, Math.round((userRank / 250) * 100)));

    // Take top 10
    const topTen = rankedList.slice(0, 10);

    return {
      topTen,
      userStanding: {
        ...userRankedPlayer,
        rankPercentage,
        pointsToNextRank,
      },
      totalGlobalParticipants,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  },
};

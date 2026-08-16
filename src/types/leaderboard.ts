import { Demographic, MILTheme, SkillVectors } from './game';

export interface LeaderboardPlayer {
  id: string;
  rank: number;
  userName: string;
  avatar: string;
  countryCode: string;
  countryName: string;
  flag: string;
  city: string;
  rankTitle: string;
  verificationPoints: number;
  accuracyRate: number; // e.g. 98.5%
  impostersIdentified: number;
  totalGamesPlayed: number;
  specialty: string;
  specialtyCategory: 'source' | 'evidence' | 'context' | 'ai_manipulation' | 'general';
  milTrack?: MILTheme;
  demographic: Demographic;
  isVerifiedSentinel: boolean;
  motto: string;
  skillVectors: SkillVectors;
  featuredBadgeTitle: string;
  featuredBadgeIcon: string;
  isLocalUser?: boolean;
}

export type LeaderboardTimeframe = 'all_time' | 'weekly_sprint';
export type LeaderboardCategoryFilter = 'all' | 'ai_manipulation' | 'source' | 'evidence' | 'context';

import type { Track, TrackAnalytics } from '../types/music';

export const analyzeTrackDurations = (tracks: Track[]): TrackAnalytics | null => {
  if (!tracks || tracks.length === 0) return null;

  const validTracks = tracks.filter(t => t.duration && t.duration > 0);
  
  if (validTracks.length === 0) return null;

  const sorted = [...validTracks].sort((a, b) => a.duration - b.duration);
  const totalDuration = validTracks.reduce((sum, track) => sum + track.duration, 0);

  return {
    longest: sorted[sorted.length - 1],
    shortest: sorted[0],
    average: totalDuration / validTracks.length,
    total: validTracks.length,
  };
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const calculateAverage = (items: Record<string, number>[], property: string): number => {
  const validItems = items.filter(item => item[property] && !isNaN(item[property]));
  if (validItems.length === 0) return 0;
  
  const sum = validItems.reduce((acc, item) => acc + item[property], 0);
  return sum / validItems.length;
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export interface Track {
  name: string;
  artist: string | { name: string; url?: string };
  duration: number;
  playcount?: number;
  listeners?: number;
  mbid?: string;
  url?: string;
}

export interface Album {
  name: string;
  artist: string;
  tracks?: Track[];
  image?: string;
  playcount?: number;
  listeners?: number;
}

export interface Artist {
  name: string;
  playcount?: number;
  listeners?: number;
  mbid?: string;
  url?: string;
  image?: string;
  tags?: string[];
}

export interface TopTrack extends Track {
  rank?: number;
}

export interface GenreTrend {
  genre: string;
  year: number;
  count: number;
}

export interface TrackAnalytics {
  longest: Track;
  shortest: Track;
  average: number;
  total: number;
}

export interface Tag {
  name: string;
  count?: string;
  reach?: string;
  taggings?: string;
  url?: string;
}

export interface AudioFeatures {
  tempo?: number;
  key?: string;
  loudness?: number;
  energy?: number;
}

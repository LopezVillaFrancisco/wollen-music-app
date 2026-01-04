import axios from 'axios';
import type { Track, Album, Artist, TopTrack } from '../types/music';

const api = axios.create({
  baseURL: '/api',
});

export const lastfmService = {
  searchArtist: async (artistName: string) => {
    const response = await api.get('/artists/search', {
      params: { name: artistName },
    });
    return response.data;
  },

  searchTrack: async (query: string) => {
    const response = await api.get('/tracks/search', {
      params: { query, limit: 10 },
    });
    return response.data;
  },

  searchAlbum: async (query: string) => {
    const response = await api.get('/albums/search', {
      params: { query, limit: 10 },
    });
    return response.data;
  },

  getArtistInfo: async (artistName: string): Promise<Artist> => {
    const response = await api.get(`/artists/${encodeURIComponent(artistName)}`);
    return response.data;
  },

  getArtistTopTracks: async (artistName: string, limit = 50): Promise<TopTrack[]> => {
    const response = await api.get(`/artists/${encodeURIComponent(artistName)}/tracks`, {
      params: { limit },
    });
    return response.data;
  },

  getAlbumInfo: async (artistName: string, albumName: string): Promise<Album> => {
    const response = await api.get('/albums', {
      params: { artist: artistName, album: albumName },
    });
    return response.data;
  },

  getArtistTopAlbums: async (artistName: string, limit = 10) => {
    const response = await api.get(`/artists/${encodeURIComponent(artistName)}/albums`, {
      params: { limit },
    });
    return response.data;
  },

  getTrackInfo: async (artistName: string, trackName: string): Promise<Track> => {
    const response = await api.get('/tracks', {
      params: { artist: artistName, track: trackName },
    });
    return response.data;
  },

  getTopTags: async () => {
    const response = await api.get('/tags');
    return response.data;
  },

  getTagTopArtists: async (tag: string, limit = 20) => {
    const response = await api.get(`/tags/${encodeURIComponent(tag)}/artists`, {
      params: { limit },
    });
    return response.data;
  },

  getChartTopTracks: async (limit = 50): Promise<TopTrack[]> => {
    const response = await api.get('/tracks/chart', {
      params: { limit },
    });
    return response.data;
  },

  getTagTrends: async (tag: string, limit = 100, from?: number, to?: number) => {
    const response = await api.get(`/tags/${encodeURIComponent(tag)}/trends`, {
      params: { limit, from, to },
    });
    return response.data;
  },
};

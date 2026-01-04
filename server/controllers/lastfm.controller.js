import axios from 'axios';
import { LASTFM_API_KEY } from '../config/env.js';
const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

const lastfmApi = axios.create({
  baseURL: LASTFM_BASE_URL,
  params: {
    api_key: LASTFM_API_KEY,
    format: 'json',
  },
});

export const lastfmController = {
  searchArtist: async (req, res) => {
    try {
      const { name } = req.query;
      if (!name) {
        return res.status(400).json({ error: 'El parámetro "name" es requerido' });
      }

      const response = await lastfmApi.get('', {
        params: {
          method: 'artist.search',
          artist: name,
        },
      });

      res.json(response.data.results.artistmatches.artist);
    } catch (error) {
      console.error('Error en searchArtist:', error.message);
      res.status(500).json({ error: 'Error al buscar artista', message: error.message });
    }
  },

  getArtistInfo: async (req, res) => {
    try {
      const { name } = req.params;
      const response = await lastfmApi.get('', {
        params: {
          method: 'artist.getinfo',
          artist: name,
        },
      });

      res.json(response.data.artist);
    } catch (error) {
      console.error('Error en getArtistInfo:', error.message);
      res.status(500).json({ error: 'Error al obtener información del artista', message: error.message });
    }
  },

  getArtistTopTracks: async (req, res) => {
    try {
      const { name } = req.params;
      const { limit = 50 } = req.query;

      const response = await lastfmApi.get('', {
        params: {
          method: 'artist.gettoptracks',
          artist: name,
          limit,
        },
      });

      const tracks = response.data.toptracks?.track;

      if (!tracks || !Array.isArray(tracks)) {
        return res.status(404).json({ 
          error: 'No se encontraron tracks para este artista',
          artist: name
        });
      }

      const tracksWithDuration = await Promise.all(
        tracks.slice(0, 15).map(async (track) => {
          try {
            const trackInfo = await lastfmApi.get('', {
              params: {
                method: 'track.getinfo',
                artist: typeof track.artist === 'object' ? track.artist.name : track.artist,
                track: track.name,
              },
            });
            return {
              ...track,
              artist: typeof track.artist === 'object' ? track.artist.name : track.artist,
              duration: trackInfo.data.track.duration ? Number(trackInfo.data.track.duration) / 1000 : 0,
            };
          } catch {
            return {
              ...track,
              artist: typeof track.artist === 'object' ? track.artist.name : track.artist,
              duration: 0,
            };
          }
        })
      );

      const remainingTracks = tracks.slice(15).map((track) => ({
        ...track,
        artist: typeof track.artist === 'object' ? track.artist.name : track.artist,
        duration: 0,
      }));

      res.json([...tracksWithDuration, ...remainingTracks]);
    } catch (error) {
      console.error('Error en getArtistTopTracks:', error.message);
      console.error('Stack:', error.stack);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      res.status(500).json({ 
        error: 'Error al obtener top tracks del artista', 
        message: error.message,
        details: error.response?.data 
      });
    }
  },

  getAlbumInfo: async (req, res) => {
    try {
      const { artist, album } = req.query;
      if (!artist || !album) {
        return res.status(400).json({ error: 'Los parámetros "artist" y "album" son requeridos' });
      }

      const response = await lastfmApi.get('', {
        params: {
          method: 'album.getinfo',
          artist,
          album,
        },
      });

      const albumData = response.data.album;
      
      if (albumData.tracks && albumData.tracks.track) {
        const tracks = Array.isArray(albumData.tracks.track) 
          ? albumData.tracks.track 
          : [albumData.tracks.track];
        
        const tracksWithDuration = await Promise.all(
          tracks.map(async (track) => {
            try {
              const trackInfo = await lastfmApi.get('', {
                params: {
                  method: 'track.getinfo',
                  artist: albumData.artist,
                  track: track.name,
                },
              });
              return {
                name: track.name,
                artist: albumData.artist,
                duration: trackInfo.data.track.duration ? Number(trackInfo.data.track.duration) / 1000 : Number(track.duration || 0),
                playcount: trackInfo.data.track.playcount || track.playcount || 0,
                listeners: trackInfo.data.track.listeners || 0,
                url: track.url || '',
              };
            } catch (error) {
              return {
                name: track.name,
                artist: albumData.artist,
                duration: Number(track.duration || 0),
                playcount: track.playcount || 0,
                url: track.url || '',
              };
            }
          })
        );
        
        albumData.tracks = tracksWithDuration;
      } else {
        albumData.tracks = [];
      }

      res.json(albumData);
    } catch (error) {
      console.error('Error en getAlbumInfo:', error.message);
      res.status(500).json({ error: 'Error al obtener información del álbum', message: error.message });
    }
  },

  getArtistTopAlbums: async (req, res) => {
    try {
      const { name } = req.params;
      const { limit = 10 } = req.query;

      const response = await lastfmApi.get('', {
        params: {
          method: 'artist.gettopalbums',
          artist: name,
          limit,
        },
      });

      res.json(response.data.topalbums.album);
    } catch (error) {
      console.error('Error en getArtistTopAlbums:', error.message);
      res.status(500).json({ error: 'Error al obtener top albums del artista', message: error.message });
    }
  },

  getTrackInfo: async (req, res) => {
    try {
      const { artist, track } = req.query;
      if (!artist || !track) {
        return res.status(400).json({ error: 'Los parámetros "artist" y "track" son requeridos' });
      }

      const response = await lastfmApi.get('', {
        params: {
          method: 'track.getinfo',
          artist,
          track,
        },
      });

      const trackData = response.data.track;
      
      if (trackData.duration) {
        trackData.duration = Number(trackData.duration) / 1000;
      }

      res.json(trackData);
    } catch (error) {
      console.error('Error en getTrackInfo:', error.message);
      res.status(500).json({ error: 'Error al obtener información de la canción', message: error.message });
    }
  },

  getTopTags: async (req, res) => {
    try {
      const response = await lastfmApi.get('', {
        params: {
          method: 'chart.gettoptags',
        },
      });

      res.json(response.data.tags.tag);
    } catch (error) {
      console.error('Error en getTopTags:', error.message);
      res.status(500).json({ error: 'Error al obtener top tags', message: error.message });
    }
  },

  getTagTopArtists: async (req, res) => {
    try {
      const { tag } = req.params;
      const { limit = 20 } = req.query;

      const response = await lastfmApi.get('', {
        params: {
          method: 'tag.gettopartists',
          tag,
          limit,
        },
      });

      res.json(response.data.topartists.artist);
    } catch (error) {
      console.error('Error en getTagTopArtists:', error.message);
      res.status(500).json({ error: 'Error al obtener artistas por tag', message: error.message });
    }
  },

  getChartTopTracks: async (req, res) => {
    try {
      const { limit = 50 } = req.query;

      const response = await lastfmApi.get('', {
        params: {
          method: 'chart.gettoptracks',
          limit,
        },
      });

      const tracks = response.data.tracks.track.map((track) => ({
        ...track,
        artist: typeof track.artist === 'object' ? track.artist.name : track.artist,
        duration: track.duration ? Number(track.duration) : 0,
      }));

      res.json(tracks);
    } catch (error) {
      console.error('Error en getChartTopTracks:', error.message);
      res.status(500).json({ error: 'Error al obtener chart de top tracks', message: error.message });
    }
  },

  searchTrack: async (req, res) => {
    try {
      const { query, limit = 10 } = req.query;
      if (!query) {
        return res.status(400).json({ error: 'El parámetro "query" es requerido' });
      }

      const response = await lastfmApi.get('', {
        params: {
          method: 'track.search',
          track: query,
          limit,
        },
      });

      const tracks = response.data.results?.trackmatches?.track || [];
      res.json(Array.isArray(tracks) ? tracks : [tracks]);
    } catch (error) {
      console.error('Error en searchTrack:', error.message);
      res.status(500).json({ error: 'Error al buscar canción', message: error.message });
    }
  },

  searchAlbum: async (req, res) => {
    try {
      const { query, limit = 10 } = req.query;
      if (!query) {
        return res.status(400).json({ error: 'El parámetro "query" es requerido' });
      }

      const response = await lastfmApi.get('', {
        params: {
          method: 'album.search',
          album: query,
          limit,
        },
      });

      const albums = response.data.results?.albummatches?.album || [];
      res.json(Array.isArray(albums) ? albums : [albums]);
    } catch (error) {
      console.error('Error en searchAlbum:', error.message);
      res.status(500).json({ error: 'Error al buscar álbum', message: error.message });
    }
  },


  getTagTrends: async (req, res) => {
    try {
      const { tag } = req.params;
      const limit = Number(req.query.limit) || 100;
      const fromYear = req.query.from ? Number(req.query.from) : null;
      const toYear = req.query.to ? Number(req.query.to) : null;

      if (!tag) {
        return res.status(400).json({ error: 'El parámetro "tag" es requerido' });
      }

      const response = await lastfmApi.get('', {
        params: {
          method: 'tag.gettoptracks',
          tag,
          limit,
        },
      });

      const tracks = response.data.tracks?.track || [];
      if (!tracks.length) {
        return res.json({ tag, trends: [], coverage: { total: 0, withDate: 0 } });
      }

      const yearCounts = {};
      let tracksWithDate = 0;

      const extractYear = (dateStr) => {
        if (!dateStr) return null;
        const yearMatch = dateStr.match(/(19|20)\d{2}/);
        if (yearMatch) return Number(yearMatch[0]);
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) return date.getFullYear();
        return null;
      };

      const batchSize = 10;
      for (let i = 0; i < tracks.length; i += batchSize) {
        const batch = tracks.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (track) => {
            try {
              const artistName = typeof track.artist === 'object' ? track.artist.name : track.artist;
              const trackName = track.name;
              
              const trackInfo = await lastfmApi.get('', {
                params: {
                  method: 'track.getinfo',
                  artist: artistName,
                  track: trackName,
                },
              });

              const trackData = trackInfo.data.track;
              let year = null;

              if (trackData?.wiki?.published) {
                year = extractYear(trackData.wiki.published);
              }
              if (!year && trackData?.album?.releasedate) {
                year = extractYear(trackData.album.releasedate);
              }
              if (!year && trackData?.album?.wiki?.published) {
                year = extractYear(trackData.album.wiki.published);
              }

              if (year && (!fromYear || year >= fromYear) && (!toYear || year <= toYear)) {
                yearCounts[year] = (yearCounts[year] || 0) + 1;
                tracksWithDate++;
              }
            } catch (error) {
              console.error(`Error procesando track ${track.name}:`, error.message);
            }
          })
        );

        if (i + batchSize < tracks.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      const trends = Object.keys(yearCounts)
        .map(year => ({
          year: Number(year),
          count: yearCounts[year],
        }))
        .sort((a, b) => a.year - b.year);

      res.json({
        tag,
        trends,
        coverage: {
          total: tracks.length,
          withDate: tracksWithDate,
          percentage: ((tracksWithDate / tracks.length) * 100).toFixed(1),
        },
      });
    } catch (error) {
      console.error('Error en getTagTrends:', error.message);
      res.status(500).json({ 
        error: 'Error al obtener tendencias del tag', 
        message: error.message 
      });
    }
  },
};

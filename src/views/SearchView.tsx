import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatsCards } from '../components/StatsCards';
import { TrackDurationChart } from '../components/TrackDurationChart';
import { TrackList } from '../components/TrackList';
import { ExportButton } from '../components/ExportButton';
import { AutocompleteSearch } from '../components/AutocompleteSearch';
import { lastfmService } from '../services/lastfm';
import { analyzeTrackDurations } from '../utils/analytics';
import './SearchView.css';

type SearchType = 'artist' | 'track' | 'album';

export const SearchView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('artist');
  const [artistForTrack, setArtistForTrack] = useState('');

  const handleTypeChange = (newType: SearchType) => {
    setSearchType(newType);
    setSearchQuery('');
    setArtistForTrack('');
  };

  const { data: topTracks, isLoading: isLoadingTracks, error: errorTracks } = useQuery({
    queryKey: ['artistTopTracks', searchQuery],
    queryFn: () => lastfmService.getArtistTopTracks(searchQuery),
    enabled: searchQuery.length > 0 && searchType === 'artist',
  });

  const { data: trackInfo, isLoading: isLoadingTrack, error: errorTrack } = useQuery({
    queryKey: ['trackInfo', artistForTrack, searchQuery],
    queryFn: () => lastfmService.getTrackInfo(artistForTrack, searchQuery),
    enabled: searchQuery.length > 0 && artistForTrack.length > 0 && searchType === 'track',
  });

  const { data: albumInfo, isLoading: isLoadingAlbum, error: errorAlbum } = useQuery({
    queryKey: ['albumInfo', artistForTrack, searchQuery],
    queryFn: () => lastfmService.getAlbumInfo(artistForTrack, searchQuery),
    enabled: searchQuery.length > 0 && artistForTrack.length > 0 && searchType === 'album',
  });

  const handleSearch = (query: string, artist?: string) => {
    if (searchType === 'artist') {
      setSearchQuery(query);
    } else {
      if (artist) {
        setArtistForTrack(artist);
      }
      setSearchQuery(query);
    }
  };

  const handleArtistForTrackAlbum = (query: string) => {
    setArtistForTrack(query);
    setSearchQuery('');
  };

  const analytics = topTracks ? analyzeTrackDurations(topTracks) : null;
  const albumAnalytics = albumInfo?.tracks ? analyzeTrackDurations(albumInfo.tracks) : null;
  const isLoading = isLoadingTracks || isLoadingTrack || isLoadingAlbum;
  const error = errorTracks || errorTrack || errorAlbum;

  return (
    <div className="view-container">
      <div className="search-section">
        <h2>Analiza las canciones de tu artista favorito</h2>
        
        <div className="search-type-selector">
          <button 
            className={`type-button ${searchType === 'artist' ? 'active' : ''}`}
            onClick={() => handleTypeChange('artist')}
          >
            Artista
          </button>
          <button 
            className={`type-button ${searchType === 'track' ? 'active' : ''}`}
            onClick={() => handleTypeChange('track')}
          >
            Canción
          </button>
          <button 
            className={`type-button ${searchType === 'album' ? 'active' : ''}`}
            onClick={() => handleTypeChange('album')}
          >
            Álbum
          </button>
        </div>

        {searchType === 'artist' ? (
          <AutocompleteSearch 
            key={`artist-${searchType}`}
            onSelect={handleSearch} 
            placeholder="Buscar artista..." 
            type="artist"
          />
        ) : (
          <div className="track-album-search">
            <AutocompleteSearch 
              key={`artist-for-${searchType}`}
              onSelect={handleArtistForTrackAlbum}
              placeholder="Nombre del artista"
              type="artist"
            />
            <AutocompleteSearch 
              key={`${searchType}-search-${artistForTrack}`}
              onSelect={handleSearch} 
              placeholder={searchType === 'track' ? 'Buscar canción...' : 'Buscar álbum...'}
              type={searchType}
              artistFilter={artistForTrack}
            />
          </div>
        )}
      </div>

      {isLoading && <LoadingSpinner />}

      {error && (
        <div className="error-message">
          <p>Error al cargar los datos</p>
        </div>
      )}

      {topTracks && topTracks.length > 0 && searchType === 'artist' && (
        <div className="results-section">
          <div className="results-header">
            <h2>Resultados para: {searchQuery}</h2>
            <ExportButton 
              data={topTracks} 
              filename={`${searchQuery}-top-tracks`}
              label="Exportar"
              type="artist"
              artistName={searchQuery}
            />
          </div>
          
          {analytics && <StatsCards analytics={analytics} />}
          
          <div className="charts-grid">
            <TrackDurationChart tracks={topTracks} title="Duración de Top Tracks" />
            <TrackList tracks={topTracks} title={`Top 10 Tracks de ${searchQuery}`} />
          </div>
        </div>
      )}

      {trackInfo && searchType === 'track' && (
        <div className="results-section">
          <div className="results-header">
            <h2>Información de la Canción</h2>
            <ExportButton 
              data={[trackInfo]} 
              filename={`${searchQuery}-info`}
              label="Exportar"
              type="tracks"
              title={`Información de ${trackInfo.name}`}
            />
          </div>
          
          <div className="track-info-card">
            <h3>{trackInfo.name}</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Artista:</span>
                <span className="info-value">
                  {typeof trackInfo.artist === 'object' ? trackInfo.artist.name : trackInfo.artist}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Duración:</span>
                <span className="info-value">
                  {trackInfo.duration ? `${Math.floor(trackInfo.duration / 60)}:${String(Math.floor(trackInfo.duration % 60)).padStart(2, '0')}` : 'N/A'}
                </span>
              </div>
              {trackInfo.playcount && (
                <div className="info-item">
                  <span className="info-label">Reproducciones:</span>
                  <span className="info-value">{Number(trackInfo.playcount).toLocaleString('es-ES')}</span>
                </div>
              )}
              {trackInfo.listeners && (
                <div className="info-item">
                  <span className="info-label">Oyentes:</span>
                  <span className="info-value">{Number(trackInfo.listeners).toLocaleString('es-ES')}</span>
                </div>
              )}
              {trackInfo.url && (
                <div className="info-item">
                  <span className="info-label">URL:</span>
                  <a href={trackInfo.url} target="_blank" rel="noopener noreferrer" className="info-link">
                    Ver en Last.fm
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {albumInfo && searchType === 'album' && (
        <div className="results-section">
          <div className="results-header">
            <h2>{albumInfo.name}</h2>
            <p className="album-artist-subtitle">de {albumInfo.artist}</p>
            <ExportButton 
              data={albumInfo.tracks || [albumInfo]} 
              filename={`${searchQuery}-album`}
              label="Exportar"
              type="tracks"
              title={`Tracks del Álbum ${albumInfo.name} - ${albumInfo.artist}`}
            />
          </div>

          {albumAnalytics && <StatsCards analytics={albumAnalytics} />}
          
          <div className="charts-grid">
            {albumInfo.tracks && albumInfo.tracks.length > 0 && (
              <>
                <TrackDurationChart 
                  tracks={albumInfo.tracks} 
                  title={`Duración de Tracks - ${albumInfo.name}`}
                />
                <TrackList 
                  tracks={albumInfo.tracks.sort((a, b) => {
                    const playcountA = Number(a.playcount || 0);
                    const playcountB = Number(b.playcount || 0);
                    return playcountB - playcountA;
                  })} 
                  title={`Tracks Más Escuchados de ${albumInfo.name}`}
                />
              </>
            )}
          </div>
        </div>
      )}

      {searchQuery && !isLoading && (
        <>
          {topTracks && topTracks.length === 0 && searchType === 'artist' && (
            <div className="no-results">
              <p>No se encontraron resultados para el artista "{searchQuery}"</p>
            </div>
          )}
          {!trackInfo && searchType === 'track' && !isLoadingTrack && artistForTrack && (
            <div className="no-results">
              <p>No se encontró la canción "{searchQuery}" del artista "{artistForTrack}"</p>
            </div>
          )}
          {!albumInfo && searchType === 'album' && !isLoadingAlbum && artistForTrack && (
            <div className="no-results">
              <p>No se encontró el álbum "{searchQuery}" del artista "{artistForTrack}"</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

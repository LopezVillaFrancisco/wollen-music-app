import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TrackDurationChart } from '../components/TrackDurationChart';
import { TrackList } from '../components/TrackList';
import { StatsCards } from '../components/StatsCards';
import { ExportButton } from '../components/ExportButton';
import { lastfmService } from '../services/lastfm';
import { analyzeTrackDurations } from '../utils/analytics';
import './TracksView.css';

export const TracksView = () => {
  const { data: globalTopTracks, isLoading, error } = useQuery({
    queryKey: ['globalTopTracks'],
    queryFn: () => lastfmService.getChartTopTracks(10),
  });

  const analytics = globalTopTracks ? analyzeTrackDurations(globalTopTracks) : null;

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="view-container">
        <div className="error-message">
          <p>Error al cargar los datos. Verifica tu conexión y la configuración de la API.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-container">
      <div className="tracks-header">
        <h2>Análisis Global de Top Tracks</h2>
        <p>Descubre las canciones más populares del momento y sus características</p>
        {globalTopTracks && (
          <ExportButton data={globalTopTracks} filename="global-top-tracks" label="Exportar" />
        )}
      </div>

      {analytics && <StatsCards analytics={analytics} />}

      <div className="charts-grid">
        {globalTopTracks && (
          <>
            <TrackDurationChart 
              tracks={globalTopTracks} 
              title="Duración de Top 10 Tracks Globales" 
            />
            <TrackList 
              tracks={globalTopTracks} 
              title="Top 10 Tracks Más Populares" 
            />
          </>
        )}
      </div>
    </div>
  );
};

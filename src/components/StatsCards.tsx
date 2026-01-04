import { Clock, TrendingUp, Music2 } from 'lucide-react';
import type { TrackAnalytics } from '../types/music';
import { formatDuration } from '../utils/analytics';
import './StatsCards.css';

interface StatsCardsProps {
  analytics: TrackAnalytics;
}

export const StatsCards = ({ analytics }: StatsCardsProps) => {
  return (
    <div className="stats-grid">
      <div className="stat-card stat-card-longest">
        <div className="stat-icon">
          <TrendingUp size={32} />
        </div>
        <div className="stat-content">
          <h4>Track Más Largo</h4>
          <p className="stat-value">{formatDuration(analytics.longest.duration)}</p>
          <p className="stat-label">{analytics.longest.name}</p>
          <p className="stat-sublabel">
            {typeof analytics.longest.artist === 'object' 
              ? analytics.longest.artist.name 
              : analytics.longest.artist}
          </p>
        </div>
      </div>

      <div className="stat-card stat-card-average">
        <div className="stat-icon">
          <Clock size={32} />
        </div>
        <div className="stat-content">
          <h4>Duración Promedio</h4>
          <p className="stat-value">{formatDuration(analytics.average)}</p>
          <p className="stat-label">De {analytics.total} tracks</p>
        </div>
      </div>

      <div className="stat-card stat-card-shortest">
        <div className="stat-icon">
          <Music2 size={32} />
        </div>
        <div className="stat-content">
          <h4>Track Más Corto</h4>
          <p className="stat-value">{formatDuration(analytics.shortest.duration)}</p>
          <p className="stat-label">{analytics.shortest.name}</p>
          <p className="stat-sublabel">
            {typeof analytics.shortest.artist === 'object' 
              ? analytics.shortest.artist.name 
              : analytics.shortest.artist}
          </p>
        </div>
      </div>
    </div>
  );
};

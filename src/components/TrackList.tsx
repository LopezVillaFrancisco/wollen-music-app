import { Users, Play } from 'lucide-react';
import type { Track } from '../types/music';
import { formatNumber } from '../utils/analytics';
import './TrackList.css';

interface TrackListProps {
  tracks: Track[];
  title?: string;
}

export const TrackList = ({ tracks, title = 'Top Tracks' }: TrackListProps) => {
  return (
    <div className="track-list-container">
      <h3 className="track-list-title">{title}</h3>
      <div className="track-list">
        {tracks.slice(0, 10).map((track, index) => (
          <div key={`${track.name}-${index}`} className="track-item">
            <div className="track-rank">#{index + 1}</div>
            <div className="track-info">
              <div className="track-name">{track.name}</div>
              <div className="track-artist">
                {typeof track.artist === 'object' ? track.artist.name : track.artist}
              </div>
            </div>
            <div className="track-stats">
              {track.playcount && (
                <div className="track-stat">
                  <Play size={16} />
                  <span>{formatNumber(track.playcount)}</span>
                </div>
              )}
              {track.listeners && (
                <div className="track-stat">
                  <Users size={16} />
                  <span>{formatNumber(track.listeners)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

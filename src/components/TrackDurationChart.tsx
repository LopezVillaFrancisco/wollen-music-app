import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Track } from '../types/music';
import { formatDuration } from '../utils/analytics';
import './TrackDurationChart.css';

interface TrackDurationChartProps {
  tracks: Track[];
  title?: string;
}

export const TrackDurationChart = ({ tracks, title = 'Duración de Tracks' }: TrackDurationChartProps) => {
  // Preparar datos para el gráfico - tomar hasta 15 tracks
  const chartData = tracks
    .filter(t => t.duration && t.duration > 0)
    .slice(0, 15)
    .map(track => ({
      name: track.name.length > 20 ? track.name.substring(0, 20) + '...' : track.name,
      duration: Math.floor(track.duration / 60), // Convertir a minutos
      durationFormatted: formatDuration(track.duration),
      fullName: track.name,
    }));

  if (chartData.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          <p>No hay datos de duración disponibles para estos tracks.</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Busca un artista específico para ver sus duraciones de tracks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="custom-tooltip">
                    <p className="tooltip-title">{payload[0].payload.fullName}</p>
                    <p className="tooltip-value">
                      Duración: {payload[0].payload.durationFormatted}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="duration" fill="#3b82f6" name="Duración (min)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

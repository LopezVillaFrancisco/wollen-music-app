import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './GenreTrendsChart.css';

interface TrendData {
  year: number;
  count: number;
}

interface GenreTrendsChartProps {
  data: TrendData[];
  genreName: string;
  title?: string;
  type?: 'line' | 'area';
}

export const GenreTrendsChart = ({ 
  data, 
  genreName, 
  title = 'Tendencias del Género por Año',
  type = 'area'
}: GenreTrendsChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          <p>No hay datos de tendencias disponibles para este género.</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Intenta buscar un género diferente o ajusta el rango de años.
          </p>
        </div>
      </div>
    );
  }

  const Chart = type === 'area' ? AreaChart : LineChart;

  return (
    <div className="chart-container genre-trends-chart">
      <h3 className="chart-title">{title}</h3>
      <p className="chart-subtitle">
        Género: <strong>{genreName}</strong> • {data.length} años con datos
      </p>
      <ResponsiveContainer width="100%" height={500}>
        <Chart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="year" 
            label={{ value: 'Año', position: 'insideBottom', offset: -10 }}
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            label={{ value: 'Cantidad de Tracks', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="custom-tooltip">
                    <p className="tooltip-title">Año: {payload[0].payload.year}</p>
                    <p className="tooltip-value" style={{ color: '#3b82f6' }}>
                      Cantidad de Tracks: {payload[0].payload.count}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend verticalAlign="top" height={36} />
          {type === 'area' ? (
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#3b82f6" 
              fillOpacity={1}
              fill="url(#colorCount)" 
              name="Cantidad de Tracks"
            />
          ) : (
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Cantidad de Tracks"
            />
          )}
        </Chart>
      </ResponsiveContainer>
      <div style={{ fontSize: '15px', color: '#666', marginTop: '14px', maxWidth: 600 }}>
        Solo muestra tracks populares de Last.fm, no toda la música publicada.
      </div>
    </div>
  );
};

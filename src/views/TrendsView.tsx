import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ExportButton } from '../components/ExportButton';
import { GenreTrendsChart } from '../components/GenreTrendsChart';
import { lastfmService } from '../services/lastfm';
import type { Tag } from '../types/music';
import './TrendsView.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1', '#64748b'];

export const TrendsView = () => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear] = useState('');

  const { data: topTags, isLoading, error } = useQuery({
    queryKey: ['topTags'],
    queryFn: () => lastfmService.getTopTags(),
  });

  const { data: trendData, isLoading: isLoadingTrends, error: trendsError } = useQuery({
    queryKey: ['tagTrends', selectedGenre, fromYear, toYear],
    queryFn: () => lastfmService.getTagTrends(
      selectedGenre, 
      100,
      fromYear ? Number(fromYear) : undefined,
      toYear ? Number(toYear) : undefined
    ),
    enabled: selectedGenre.length > 0,
  });

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
  };

  const handleGenreClick = (genreName: string) => {
    setSelectedGenre(genreName);
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="view-container">
        <div className="error-message">
          <p>Error al cargar los datos de tendencias.</p>
        </div>
      </div>
    );
  }

  const genreData = topTags?.slice(0, 8).map((tag: Tag) => ({
    name: tag.name,
    value: parseInt(tag.count || '0') || parseInt(tag.reach || '0') || parseInt(tag.taggings || '0') || 100,
  })) || [];

  return (
    <div className="view-container">
      <div className="trends-header">
        <h2>Tendencias de Géneros Musicales</h2>
        <p>Géneros más populares en Last.fm</p>
        {topTags && (
          <ExportButton 
            data={topTags} 
            filename="top-generos-musicales"
            label="Exportar"
            type="genres"
          />
        )}
      </div>

      <div className="trends-content">
        <div className="left-column">
          <div className="chart-section">
            <div className="chart-container">
              <h3 className="chart-title">Distribución por Género</h3>
              <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genreData.map((_entry: { name: string; value: number }, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="trends-analysis-section-inline">
            <div className="trends-analysis-header">
              <h2>Análisis de Tendencias por Año</h2>
              <p>Evolucion de un género musical a lo largo del tiempo</p>
            </div>

            <div className="trends-search-controls">
              <div className="genre-select-row">
                <label htmlFor="genre-select">Selecciona un género:</label>
                <select
                  id="genre-select"
                  value={selectedGenre}
                  onChange={(e) => handleGenreSelect(e.target.value)}
                  className="genre-select"
                >
                  <option value="">Selecciona un género</option>
                  {topTags?.map((tag: Tag) => (
                    <option key={tag.name} value={tag.name}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="year-filters">
                <div className="filter-group">
                  <label htmlFor="from-year">Desde:</label>
                  <input
                    id="from-year"
                    type="number"
                    placeholder="1990"
                    value={fromYear}
                    onChange={(e) => setFromYear(e.target.value)}
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="to-year">Hasta:</label>
                  <input
                    id="to-year"
                    type="number"
                    placeholder="2024"
                    value={toYear}
                    onChange={(e) => setToYear(e.target.value)}
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </div>

            {isLoadingTrends && <LoadingSpinner />}

            {trendsError && (
              <div className="error-message">
                <p>Error al cargar las tendencias del género.</p>
              </div>
            )}

            {trendData && trendData.trends && trendData.trends.length > 0 && (
              <div className="trends-results">
                <div className="results-header">
                  <h3>Resultados: {selectedGenre}</h3>
                  <ExportButton 
                    data={trendData.trends.map((t: { year: number; count: number }) => ({
                      year: t.year,
                      count: t.count,
                    }))} 
                    filename={`tendencias-${selectedGenre}`}
                    label="Exportar Tendencias"
                    type="trends"
                  />
                </div>
                
                <GenreTrendsChart 
                  data={trendData.trends}
                  genreName={selectedGenre}
                  title={`Evolución de "${selectedGenre}" a través de los años`}
                  type="area"
                />
              </div>
            )}

            {selectedGenre && trendData && trendData.trends && trendData.trends.length === 0 && !isLoadingTrends && (
              <div className="no-results">
                <p>No se encontraron datos de tendencias para "{selectedGenre}"</p>
                <p style={{ fontSize: '14px', marginTop: '10px' }}>
                  Intenta con otro género o ajusta el rango de años.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="genre-list">
          <h3>Top 10 Géneros Más Populares</h3>
          <div className="genre-items">
            {topTags?.slice(0, 10).map((tag: Tag, index: number) => (
              <div 
                key={tag.name} 
                className="genre-item clickable"
                onClick={() => handleGenreClick(tag.name)}
              >
                <span className="genre-rank">#{index + 1}</span>
                <span className="genre-name">{tag.name}</span>
                <span className="genre-badge" style={{ background: COLORS[index % COLORS.length] }}>
                  Popular
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

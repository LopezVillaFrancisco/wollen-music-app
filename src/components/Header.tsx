import { Search, TrendingUp, Music, BarChart3 } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onNavigate: (view: 'search' | 'tracks' | 'trends') => void;
  currentView: string;
}

export const Header = ({ onNavigate, currentView }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Music size={32} />
          <h1>Music Data Explorer</h1>
        </div>
        
        <nav className="nav">
          <button 
            className={`nav-item ${currentView === 'search' ? 'active' : ''}`}
            onClick={() => onNavigate('search')}
          >
            <Search size={20} />
            <span>Buscar</span>
          </button>
          <button 
            className={`nav-item ${currentView === 'tracks' ? 'active' : ''}`}
            onClick={() => onNavigate('tracks')}
          >
            <BarChart3 size={20} />
            <span>Análisis de Tracks</span>
          </button>
          <button 
            className={`nav-item ${currentView === 'trends' ? 'active' : ''}`}
            onClick={() => onNavigate('trends')}
          >
            <TrendingUp size={20} />
            <span>Tendencias</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

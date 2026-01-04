import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { SearchView } from './views/SearchView';
import { TracksView } from './views/TracksView';
import { TrendsView } from './views/TrendsView';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState<'search' | 'tracks' | 'trends'>('search');

  const renderView = () => {
    switch (currentView) {
      case 'search':
        return <SearchView />;
      case 'tracks':
        return <TracksView />;
      case 'trends':
        return <TrendsView />;
      default:
        return <SearchView />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Header onNavigate={setCurrentView} currentView={currentView} />
        <main className="main-content">
          {renderView()}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;

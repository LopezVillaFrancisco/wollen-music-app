import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { lastfmService } from '../services/lastfm';
import './AutocompleteSearch.css';

interface AutocompleteSearchProps {
  onSelect: (value: string, artistName?: string) => void;
  placeholder?: string;
  type: 'artist' | 'track' | 'album';
  artistFilter?: string;
  key?: string | number;
}

export const AutocompleteSearch = ({ onSelect, placeholder = 'Buscar...', type, artistFilter }: AutocompleteSearchProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['suggestions', type, inputValue],
    queryFn: () => {
      if (type === 'artist') return lastfmService.searchArtist(inputValue);
      if (type === 'track') return lastfmService.searchTrack(inputValue);
      return lastfmService.searchAlbum(inputValue);
    },
    enabled: inputValue.length > 1,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(value.length > 1);
  };

  const handleSuggestionClick = (item: { name: string; artist?: string | { name: string } }) => {
    if (type === 'artist') {
      setInputValue(item.name);
      onSelect(item.name);
    } else if (type === 'track') {
      setInputValue(item.name);
      const artistName = typeof item.artist === 'object' ? item.artist.name : item.artist;
      onSelect(item.name, artistName);
    } else if (type === 'album') {
      setInputValue(item.name);
      const artistName = typeof item.artist === 'object' ? item.artist.name : item.artist;
      onSelect(item.name, artistName);
    }
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      onSelect(inputValue);
      setIsOpen(false);
    }
  };

  let displaySuggestions = suggestions ? (Array.isArray(suggestions) ? suggestions : [suggestions]) : [];
  
  if (artistFilter && (type === 'track' || type === 'album')) {
    displaySuggestions = displaySuggestions.filter((item: { artist?: string | { name: string } }) => {
      const itemArtist = typeof item.artist === 'object' ? item.artist?.name : item.artist;
      return itemArtist?.toLowerCase().includes(artistFilter.toLowerCase());
    });
  }
  
  displaySuggestions = displaySuggestions.slice(0, 8);

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <div className="autocomplete-input-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="autocomplete-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>

      {isOpen && displaySuggestions.length > 0 && (
        <div className="autocomplete-dropdown">
          {isLoading && <div className="suggestion-loading">Buscando...</div>}
          {!isLoading && displaySuggestions.map((item: { name: string; artist?: string | { name: string }; listeners?: string }, index: number) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(item)}
            >
              <div className="suggestion-content">
                <span className="suggestion-name">{item.name}</span>
                {(type === 'track' || type === 'album') && item.artist && (
                  <span className="suggestion-artist">
                    {typeof item.artist === 'object' ? item.artist.name : item.artist}
                  </span>
                )}
                {type === 'artist' && item.listeners && (
                  <span className="suggestion-meta">
                    {Number(item.listeners).toLocaleString('es-ES')} oyentes
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

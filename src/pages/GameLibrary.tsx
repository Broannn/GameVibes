import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Sparkles, Zap, CloudRain, Music2, SlidersHorizontal, X } from 'lucide-react';
import { gameData } from '../data/games';

type Emotion = 'joy' | 'wonder' | 'anxiety' | 'sadness' | 'dynamism';
type SortOption = 'title' | 'year' | 'tracks';

const emotionFilters: { id: Emotion; label: string; icon: React.ReactNode }[] = [
  { id: 'joy', label: 'Joie', icon: <Heart className="w-5 h-5" /> },
  { id: 'wonder', label: 'Émerveillement', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'anxiety', label: 'Anxiété', icon: <Zap className="w-5 h-5" /> },
  { id: 'sadness', label: 'Tristesse', icon: <CloudRain className="w-5 h-5" /> },
  { id: 'dynamism', label: 'Dynamisme', icon: <Music2 className="w-5 h-5" /> },
];

const sortOptions: { id: SortOption; label: string }[] = [
  { id: 'title', label: 'Titre (A-Z)' },
  { id: 'year', label: 'Année (Plus récent)' },
  { id: 'tracks', label: 'Nombre de pistes' },
];

export const GameLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('year');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const navigate = useNavigate();

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedEmotion(null);
  };

  const hasActiveFilters = searchTerm !== '' || selectedEmotion !== null;

  const getGameEmotionScore = (gameId: string, emotion: Emotion) => {
    const game = gameData.find(g => g.id === gameId);
    if (!game || !game.tracks.length) return 0;
    
    const totalScore = game.tracks.reduce((sum, track) => sum + track.emotions[emotion], 0);
    return totalScore / game.tracks.length;
  };
  
  const sortGames = (games: typeof gameData) => {
    return [...games].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.year - a.year;
        case 'tracks':
          return b.tracks.length - a.tracks.length;
        default:
          return 0;
      }
    });
  };

  const totalGames = gameData.length;

  const filteredGames = gameData.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (selectedEmotion) {
      const emotionScore = getGameEmotionScore(game.id, selectedEmotion);
      return emotionScore >= 0.5;
    }
    
    return true;
  });

  const sortedGames = sortGames(filteredGames);
  const filteredGamesCount = filteredGames.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Bibliothèque de Jeux</h1>
            <p className="text-gray-400">
              {filteredGamesCount} {filteredGamesCount > 1 ? 'jeux trouvés' : 'jeu trouvé'}
              {hasActiveFilters && ` sur ${totalGames}`}
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par titre..."
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isFiltersVisible
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filtres</span>
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          {isFiltersVisible && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filtrer par émotion</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {emotionFilters.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedEmotion(selectedEmotion === id ? null : id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      selectedEmotion === id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGames.map((game) => (
              <div
                key={game.id}
                onClick={() => navigate(`/game/${game.id}`)}
                className="group bg-slate-800 rounded-lg overflow-hidden cursor-pointer ring-1 ring-slate-700/50 transition duration-300 ease-out hover:ring-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent transition-opacity duration-300 ease-out group-hover:opacity-80 pointer-events-none"></div>
                  {selectedEmotion && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                        {Math.round(getGameEmotionScore(game.id, selectedEmotion) * 100)}%
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold group-hover:text-purple-400 transition-colors">
                      {game.title}
                    </h3>
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      {game.year}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                    {game.description}
                  </p>
                  <div className="mt-3 text-sm text-purple-400">
                    {game.tracks.length} {game.tracks.length > 1 ? 'pistes' : 'piste'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredGames.length === 0 && (
            <div className="text-center py-12 bg-slate-800 rounded-lg">
              <Music2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun jeu trouvé</h3>
              <p className="text-gray-400">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
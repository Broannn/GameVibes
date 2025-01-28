import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Sparkles, Zap, CloudRain, Music2 } from 'lucide-react';
import { gameData } from '../data/games';

type Emotion = 'joy' | 'wonder' | 'anxiety' | 'sadness' | 'dynamism';

const emotionFilters: { id: Emotion; label: string; icon: React.ReactNode }[] = [
  { id: 'joy', label: 'Joie', icon: <Heart className="w-5 h-5" /> },
  { id: 'wonder', label: 'Émerveillement', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'anxiety', label: 'Anxiété', icon: <Zap className="w-5 h-5" /> },
  { id: 'sadness', label: 'Tristesse', icon: <CloudRain className="w-5 h-5" /> },
  { id: 'dynamism', label: 'Dynamisme', icon: <Music2 className="w-5 h-5" /> },
];

export const GameLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const navigate = useNavigate();

  const getGameEmotionScore = (gameId: string, emotion: Emotion) => {
    const game = gameData.find(g => g.id === gameId);
    if (!game || !game.tracks.length) return 0;
    
    const totalScore = game.tracks.reduce((sum, track) => sum + track.emotions[emotion], 0);
    return totalScore / game.tracks.length;
  };

  const filteredGames = gameData.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (selectedEmotion) {
      const emotionScore = getGameEmotionScore(game.id, selectedEmotion);
      return emotionScore >= 0.5;
    }
    
    return true;
  }).sort((a, b) => {
    if (selectedEmotion) {
      return getGameEmotionScore(b.id, selectedEmotion) - getGameEmotionScore(a.id, selectedEmotion);
    }
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher des jeux..."
            className="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6 sm:mb-8">
        {emotionFilters.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setSelectedEmotion(selectedEmotion === id ? null : id)}
            className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 text-sm sm:text-base ${
              selectedEmotion === id
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            <span className="w-4 h-4 sm:w-5 sm:h-5">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {selectedEmotion && (
        <div className="text-center mb-8">
          <p className="text-gray-400">
            Affichage des jeux avec un fort impact émotionnel : {emotionFilters.find(e => e.id === selectedEmotion)?.label}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(`/game/${game.id}`)}
            className="group relative bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="relative h-40 sm:h-48">
              <img
                src={game.coverImage}
                alt={game.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              {selectedEmotion && (
                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 transition-transform duration-300 transform origin-top-right group-hover:scale-105">
                  <div className="bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    {Math.round(getGameEmotionScore(game.id, selectedEmotion) * 100)}%
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">{game.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{game.year}</p>
              <p className="text-gray-300 line-clamp-2">{game.description}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Aucun jeu ne correspond à vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
};
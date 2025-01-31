import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, User, ExternalLink, Heart, Share2, Music2, ChevronRight, ArrowLeft } from 'lucide-react';
import { gameData } from '../data/games';
import { getSimilarGames } from '../utils/gameRecommendations';
import { GameRating } from '../components/GameRating';

type Emotion = 'joy' | 'wonder' | 'anxiety' | 'sadness' | 'dynamism';

const emotionColors: Record<Emotion, string> = {
  joy: 'bg-yellow-500',
  wonder: 'bg-orange-500',
  anxiety: 'bg-blue-500',
  sadness: 'bg-purple-500',
  dynamism: 'bg-red-500'
};

const emotionLabels: Record<Emotion, string> = {
  joy: 'Joie',
  wonder: 'Émerveillement',
  anxiety: 'Anxiété',
  sadness: 'Tristesse',
  dynamism: 'Dynamisme'
};

const getGameUrl = (title: string): string => {
  // Remove special characters and replace spaces with hyphens
  const formattedTitle = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  return `https://store.steampowered.com/search/?term=${formattedTitle}`;
};

export const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = gameData.find(g => g.id === id);

  if (!game) {
    return <div className="text-center py-12">Jeu non trouvé</div>;
  }

  const getStrongestEmotion = (emotions: Record<Emotion, number>): Emotion => {
    return Object.entries(emotions).reduce((a, b) => 
      a[1] > b[1] ? a : b
    )[0] as Emotion;
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-12">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-lg text-white hover:bg-slate-700/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
        </div>

        <div className="relative h-[60vh] min-h-[400px]">
          <img
            src={game.coverImage}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-600/90 backdrop-blur-sm rounded-full text-sm font-medium">
                    {game.year}
                  </span>
                  <span className="px-3 py-1 bg-slate-800/90 backdrop-blur-sm rounded-full text-sm font-medium">
                    {game.tracks.length} {game.tracks.length > 1 ? 'pistes' : 'piste'}
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">{game.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-36 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl p-6 mb-8 mt-32 sm:mt-36">
              <h2 className="text-xl font-semibold mb-4">À propos du jeu</h2>
              <p className="text-gray-300 leading-relaxed mb-6">{game.description}</p>
              
              <div className="flex flex-wrap gap-4">
                {game.steamUrl && (
                  <a
                    href={game.steamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Voir sur Steam</span>
                  </a>
                )}
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Partager</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Bande Sonore</h2>
                <div className="text-sm text-gray-400">
                  {game.tracks.length} {game.tracks.length > 1 ? 'pistes' : 'piste'}
                </div>
              </div>

              <div className="space-y-4">
                {game.tracks.map((track) => {
                  const strongestEmotion = getStrongestEmotion(track.emotions);
                  return (
                    <div
                      key={track.id}
                      onClick={() => navigate(`/analysis/${game.id}/${track.id}`)}
                      className="group flex items-center gap-4 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg cursor-pointer transition-all duration-300"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 flex items-center justify-center bg-purple-600/10 rounded-lg">
                          <Music2 className="w-6 h-6 text-purple-400" />
                        </div>
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium truncate group-hover:text-purple-400 transition-colors">
                            {track.title}
                          </h3>
                          <span className={`${emotionColors[strongestEmotion]} px-2 py-1 rounded-full text-xs font-medium`}>
                            {emotionLabels[strongestEmotion]}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span className="truncate">{track.composer}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{track.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Noter ce jeu</h2>
              <GameRating gameId={game.id} />
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Impact Émotionnel</h2>
              <div className="space-y-3">
                {Object.entries(emotionLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-300">{label}</span>
                    <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${emotionColors[key as Emotion]}`}
                        style={{
                          width: `${Math.round(
                            (game.tracks.reduce(
                              (sum, track) => sum + track.emotions[key as Emotion],
                              0
                            ) /
                              game.tracks.length) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Games */}
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-semibold mb-6">Jeux Similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {getSimilarGames(game).map(similarGame => (
                <div
                  key={similarGame.id}
                  onClick={() => navigate(`/game/${similarGame.id}`)}
                  className="group bg-slate-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 relative"
                >
                  <div className="relative aspect-video">
                    <img
                      src={similarGame.coverImage}
                      alt={similarGame.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-1 bg-purple-600/90 backdrop-blur-sm rounded text-xs font-medium">Recommandé</div>
                  <div className="p-4">
                    <h3 className="font-medium group-hover:text-purple-400 transition-colors">
                      {similarGame.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{similarGame.year}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
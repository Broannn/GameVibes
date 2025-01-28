import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, User, ExternalLink } from 'lucide-react';
import { gameData } from '../data/games';

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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-slate-800 rounded-xl overflow-hidden mb-8">
        <div className="relative h-48 sm:h-64 md:h-96">
          <img
            src={game.coverImage}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
          <a
            href={getGameUrl(game.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 sm:top-4 right-2 sm:right-4 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg backdrop-blur-sm transition-all duration-300 group"
            title="Voir sur Steam"
          >
            <ExternalLink className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </a>
          <div className="absolute bottom-0 left-0 p-4 sm:p-8">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">{game.title}</h1>
            <p className="text-gray-300">{game.year}</p>
          </div>
        </div>
        <div className="p-4 sm:p-6 border-t border-slate-700">
          <p className="text-gray-300 leading-relaxed">{game.description}</p>
        </div>
      </div>

      <div className="grid gap-6">
        {game.tracks.map((track) => {
          const strongestEmotion = getStrongestEmotion(track.emotions);
          return (
            <div
              key={track.id}
              onClick={() => navigate(`/analysis/${game.id}/${track.id}`)}
              className="bg-slate-800 rounded-lg p-4 sm:p-6 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-semibold">{track.title}</h3>
                    <span className={`${emotionColors[strongestEmotion]} px-3 py-1 rounded-full text-sm font-medium`}>
                      {emotionLabels[strongestEmotion]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {track.composer}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {track.duration}
                    </div>
                  </div>
                </div>
                <div className="text-purple-400 hover:text-purple-300 sm:text-right">
                  Analyser →
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
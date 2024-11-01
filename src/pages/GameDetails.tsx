import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { gameData } from '../data/games';

export const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = gameData.find(g => g.id === id);

  if (!game) {
    return <div className="text-center py-12">Jeu non trouvé</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
        <img
          src={game.coverImage}
          alt={game.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl font-bold mb-2">{game.title}</h1>
          <p className="text-gray-300">{game.year}</p>
        </div>
      </div>

      <div className="grid gap-6">
        {game.tracks.map((track) => (
          <div
            key={track.id}
            onClick={() => navigate(`/analysis/${game.id}/${track.id}`)}
            className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{track.title}</h3>
                <div className="flex items-center space-x-4 text-gray-400">
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
              <div className="text-purple-400 hover:text-purple-300">
                Analyser →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
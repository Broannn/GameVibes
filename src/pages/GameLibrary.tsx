import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { gameData } from '../data/games';

export const GameLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredGames = gameData.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher des jeux..."
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/game/${game.id}`)}
          >
            <div className="relative h-48">
              <img
                src={game.coverImage}
                alt={game.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{game.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{game.year}</p>
              <p className="text-gray-300">{game.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
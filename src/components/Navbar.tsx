import React from 'react';
import { Link } from 'react-router-dom';
import { Music2, GamepadIcon } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-white hover:text-purple-400 transition">
            <Music2 className="h-6 w-6" />
            <span>GameVibes</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/library" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-700 transition">
              <GamepadIcon className="h-4 w-4" />
              <span>Bibliothèque</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
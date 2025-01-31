import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music2, Headphones, AudioWaveform as Waveform, Gamepad2 } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614624532983-4ce03382d63d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-purple-900/50"></div>
      </div>
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center p-2 bg-purple-500/10 rounded-2xl mb-8">
              <Music2 className="h-6 w-6 text-purple-400 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight pb-2">
              <span className="block text-white">Explorez les émotions dans</span>
              <span className="inline-block bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mt-2">
               la musique des jeux vidéo
              </span>
            </h1>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/library')}
                className="group relative px-6 py-3 text-lg font-semibold text-white bg-purple-600 rounded-lg overflow-hidden transition-all duration-300 hover:bg-purple-700 hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Explorer la bibliothèque
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-6 bg-slate-800 ring-1 ring-slate-700/50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-xl mb-4">
                  <Waveform className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Analyse émotionnelle</h3>
                <p className="text-slate-400">Découvrez l'impact émotionnel unique de chaque bande sonore</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-6 bg-slate-800 ring-1 ring-slate-700/50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-xl mb-4">
                  <Headphones className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Expérience immersive</h3>
                <p className="text-slate-400">Plongez dans l'univers sonore de vos jeux préférés</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-6 bg-slate-800 ring-1 ring-slate-700/50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-xl mb-4">
                  <Music2 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Bibliothèque riche</h3>
                <p className="text-slate-400">Une collection diversifiée de bandes sonores légendaires</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 fill-current text-slate-900" viewBox="0 0 1440 74" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,37 C240,74 480,74 720,37 C960,0 1200,0 1440,37 L1440,74 L0,74 Z" />
        </svg>
      </div>
    </div>
  );
};
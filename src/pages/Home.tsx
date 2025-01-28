import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music2, Headphones, Heart, Sparkles } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="relative pt-12 sm:pt-16 pb-24 sm:pb-32 flex content-center items-center justify-center min-h-[75vh]">
        <div className="absolute top-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center">
          <span className="w-full h-full absolute opacity-75 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/50"></span>
        </div>
        <div className="container relative mx-auto px-4">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-8/12 xl:w-6/12 px-4 ml-auto mr-auto text-center">
              <div className="flex justify-center mb-8">
                <Music2 className="h-12 w-12 sm:h-16 sm:w-16 text-purple-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6">
                Découvrez les émotions dans la musique de jeux
              </h1>
              <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12">
                Explorez comment les bandes sonores des jeux vidéo façonnent nos expériences de jeu à travers une analyse émotionnelle. Plongez dans un monde où musique et émotions s'entremêlent.
              </p>
              <button
                onClick={() => navigate('/library')}
                className="bg-purple-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                Commencer l'Exploration
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="pb-12 sm:pb-20 bg-slate-900 -mt-16 sm:-mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap">
            <div className="pt-4 sm:pt-6 lg:pt-12 w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-slate-800 w-full mb-8 shadow-lg rounded-lg p-8">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-purple-600">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <h6 className="text-lg sm:text-xl font-semibold">Expérience Immersive</h6>
                  <p className="mt-2 mb-4 text-gray-400 text-sm sm:text-base">
                    Plongez dans vos bandes sonores préférées avec notre lecteur audio interactif.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-slate-800 w-full mb-8 shadow-lg rounded-lg p-8">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-purple-600">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h6 className="text-xl font-semibold">Analyse Émotionnelle</h6>
                  <p className="mt-2 mb-4 text-gray-400">
                    Comprenez l'impact émotionnel de chaque morceau grâce à une analyse détaillée.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-slate-800 w-full mb-8 shadow-lg rounded-lg p-8">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-purple-600">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h6 className="text-xl font-semibold">Découvrez des Pépites</h6>
                  <p className="mt-2 mb-4 text-gray-400">
                    Explorez et découvrez de nouvelles bandes sonores selon leur résonance émotionnelle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
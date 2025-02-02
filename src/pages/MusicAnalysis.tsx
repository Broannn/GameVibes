import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, Calendar, Star, Volume1, VolumeX, ArrowLeft, Music2, Share2, Info, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { gameData } from '../data/games';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const RatingStars = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setRating(star)}
          className={`p-1 rounded-full hover:bg-slate-600 transition-colors ${
            star <= rating ? 'text-yellow-400' : 'text-gray-500'
          }`}
        >
          <Star className="w-6 h-6" fill={star <= rating ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
};

export const MusicAnalysis = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playedRating, setPlayedRating] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [tooltipEmotion, setTooltipEmotion] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLCanvasElement>(null);
  const { gameId, trackId } = useParams();
  const navigate = useNavigate();
  
  const game = gameData.find(g => g.id === gameId);
  const track = game?.tracks.find(t => t.id === trackId);

  // Initialisation du lecteur audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      drawWaveform();
    };
    
    const handleEnded = () => setIsPlaying(false);

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      drawWaveform();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Gestion du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  if (!game || !track) {
    return <div className="text-center py-12">Piste non trouvée</div>;
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  // Dessin de la forme d'onde
  const drawWaveform = () => {
    const canvas = waveformRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Gradient de fond
    const bgGradient = ctx.createLinearGradient(0, 0, width, 0);
    bgGradient.addColorStop(0, 'rgba(30, 41, 59, 0.8)');
    bgGradient.addColorStop(1, 'rgba(30, 41, 59, 0.4)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Progression
    const progress = audio.currentTime / audio.duration;
    const progressWidth = width * progress;

    const progressGradient = ctx.createLinearGradient(0, 0, progressWidth, 0);
    progressGradient.addColorStop(0, 'rgba(147, 51, 234, 0.8)');
    progressGradient.addColorStop(1, 'rgba(147, 51, 234, 0.4)');
    ctx.fillStyle = progressGradient;
    ctx.fillRect(0, 0, progressWidth, height);

    // Ligne de séparation avec glow
    ctx.shadowColor = 'rgba(147, 51, 234, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(progressWidth - 1, 0, 2, height);
  };

  const chartData = {
    labels: ['Joie', 'Émerveillement', 'Anxiété', 'Tristesse', 'Dynamisme'],
    datasets: [
      {
        label: 'Impact Émotionnel',
        data: [
          track.emotions.joy * 100,
          track.emotions.wonder * 100,
          track.emotions.anxiety * 100,
          track.emotions.sadness * 100,
          track.emotions.dynamism * 100
        ],
        backgroundColor: 'rgba(147, 51, 234, 0.2)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          display: false,
          stepSize: 20,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.15)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.15)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.9)',
          padding: 8,
          centerPointLabels: true,
          font: {
            size: 10,
            weight: 'bold',
            family: 'system-ui'
          },
          callback: (value: string) => {
            // Raccourcir "Émerveillement" en "Émerv." sur mobile
            if (window.innerWidth < 640 && value === 'Émerveillement') {
              return 'Émerv.';
            }
            return value;
          }
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 14,
          },
        },
      },
    },
  };

  const emotionDescriptions: Record<string, string> = {
    joy: 'Représente les moments de bonheur et d\'allégresse dans la musique',
    wonder: 'Capture l\'émerveillement et la fascination suscités par la composition',
    anxiety: 'Reflète la tension et l\'appréhension dans la pièce musicale',
    sadness: 'Exprime la mélancolie et la tristesse véhiculées par la musique',
    dynamism: 'Mesure l\'énergie et le mouvement dans la composition'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px]">
        <img
          src={game.coverImage}
          alt={game.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-900"></div>
        
        {/* Bouton retour */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-lg text-white hover:bg-slate-700/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
        </div>

        {/* Titre et metadata */}
        <div className="absolute bottom-12 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="px-4 py-2 bg-purple-600/90 backdrop-blur-sm rounded-full font-medium shadow-lg">
                  {game.title}
                </span>
                <span className="px-4 py-2 bg-slate-800/90 backdrop-blur-sm rounded-full font-medium shadow-lg">
                  {game.year}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-shadow-lg drop-shadow-lg mb-6">
                <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
                  {track.title}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="space-y-8">
<div className="bg-slate-800 rounded-xl p-4 sm:p-6 shadow-xl mt-[250px]">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <audio ref={audioRef} src={track.audioUrl} />
                
                {/* Visualisation */}
                <canvas
                  ref={waveformRef}
                  className="w-full h-20 rounded-lg mb-4"
                  width="800"
                  height="100"
                ></canvas>

                {/* Progress Bar */}
                <div 
                  ref={progressRef}
                  className="w-full h-2 bg-slate-700 rounded-full mb-4 cursor-pointer hover:h-3 transition-all"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-purple-600 rounded-full relative"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"></div>
                  </div>
                </div>

                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    disabled={isLoading}
                    className={`flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </button>

                  <div className="text-gray-300 min-w-[100px] text-center">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <VolumeIcon />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  />
                  {navigator.share && (
                    <button
                      onClick={() => {
                        navigator.share({
                          title: `${track.title} - ${game.title}`,
                          text: `Découvrez l'analyse émotionnelle de ${track.title} de ${game.title}`,
                          url: window.location.href
                        });
                      }}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                      title="Partager"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Metadata - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <Music2 className="w-4 h-4" />
                    <span className="text-sm">Compositeur</span>
                  </div>
                  <div className="font-medium">{track.composer}</div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Date de sortie</span>
                  </div>
                  <div className="font-medium">
                    {formatDate(track.releaseDate)}
                  </div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <Info className="w-4 h-4" />
                    <span className="text-sm">Durée</span>
                  </div>
                  <div className="font-medium">{track.duration}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Analyse Émotionnelle */}
          <div className="bg-slate-800 rounded-xl p-4 sm:p-6 shadow-xl mb-24">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Analyse Émotionnelle</h2>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <span>Détails</span>
                  {showDetails ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              <div className="aspect-square max-w-xl mx-auto mb-8">
                <Radar data={chartData} options={chartOptions} />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(track.emotions).map(([emotion, value]) => (
                  <div
                    key={emotion}
                    className="relative group"
                    onMouseEnter={() => setTooltipEmotion(emotion)}
                    onMouseLeave={() => setTooltipEmotion(null)}
                  >
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center transform hover:scale-105 transition-all duration-300 cursor-help">
                      <div className="text-sm text-purple-400 mb-2">{
                        emotion === 'joy' ? 'Joie' :
                        emotion === 'wonder' ? (window.innerWidth < 640 ? 'Émerv.' : 'Émerveillement') :
                        emotion === 'anxiety' ? 'Anxiété' :
                        emotion === 'sadness' ? 'Tristesse' :
                        'Dynamisme'
                      }</div>
                      <div className="text-2xl font-bold">{Math.round(value * 100)}%</div>
                    </div>
                    
                    {/* Tooltip */}
                    {tooltipEmotion === emotion && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-slate-700 rounded-lg text-sm text-center shadow-lg z-10">
                        {emotionDescriptions[emotion]}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-700"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Détails explicatifs */}
              {showDetails && (
                <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
                  <h3 className="font-semibold mb-4">Comment interpréter ce graphique ?</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Ce graphique radar représente l'impact émotionnel de la musique selon cinq dimensions clés.
                    Chaque axe mesure l'intensité d'une émotion spécifique, de 0% (au centre) à 100% (à l'extrémité).
                    Plus la valeur est élevée, plus l'émotion est présente dans la composition.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Volume2, Calendar, Star, Volume1, VolumeX } from 'lucide-react';
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
  const [playedRating, setPlayedRating] = useState(0);
  const [unplayedRating, setUnplayedRating] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { gameId, trackId } = useParams();
  
  const game = gameData.find(g => g.id === gameId);
  const track = game?.tracks.find(t => t.id === trackId);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-4 sm:p-8 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{track.title}</h1>
          <div className="text-gray-400 mb-6">
            de {game.title} ({game.year})
          </div>

          {/* Audio Player */}
          <div className="bg-slate-700 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8">
            <audio ref={audioRef} src={track.audioUrl} />
            
            {/* Progress Bar */}
            <div 
              ref={progressRef}
              className="w-full h-2 bg-slate-600 rounded-full mb-4 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-purple-600 rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  <span>{isPlaying ? 'Pause' : 'Écouter'}</span>
                </button>

                <div className="text-gray-300 min-w-[80px] sm:min-w-[100px] text-sm sm:text-base">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
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
                  className="w-24 h-2 bg-slate-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 sm:mb-8">
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Compositeur</div>
              <div className="font-semibold">{track.composer}</div>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Date de sortie</div>
              <div className="font-semibold flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(track.releaseDate)}
              </div>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Durée</div>
              <div className="font-semibold">{track.duration}</div>
            </div>
          </div>

          <div className="bg-slate-700 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Trouvez-vous que le schéma en dessous correspond à la musique ?</h3>
            <RatingStars rating={playedRating} setRating={setPlayedRating} />
            </div>
          
          <div className="bg-slate-900 rounded-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">Analyse Émotionnelle</h2>
            <div className="h-[350px] sm:h-[450px] lg:h-[550px] w-full max-w-3xl mx-auto">
              <Radar data={chartData} options={chartOptions} />
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-sm">
              {Object.entries(track.emotions).map(([emotion, value]) => (
                <div key={emotion} className="bg-slate-800 rounded-lg p-2 sm:p-3">
                  <div className="font-medium mb-1">{
                    emotion === 'joy' ? 'Joie' :
                    emotion === 'wonder' ? (window.innerWidth < 640 ? 'Émerv.' : 'Émerveillement') :
                    emotion === 'anxiety' ? 'Anxiété' :
                    emotion === 'sadness' ? 'Tristesse' :
                    'Dynamisme'
                  }</div>
                  <div className="text-purple-400 font-bold text-lg">{Math.round(value * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
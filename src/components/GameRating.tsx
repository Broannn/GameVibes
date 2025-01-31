import React, { useState } from 'react';
import { Star, History, ChevronDown, ChevronUp } from 'lucide-react';
import { useGameRating } from '../hooks/useGameRating.ts';

interface GameRatingProps {
  gameId: string;
  className?: string;
}

export const GameRating: React.FC<GameRatingProps> = ({ gameId, className = '' }) => {
  const { 
    rating, 
    count, 
    userRating, 
    anonymousRating,
    loading, 
    error, 
    submitRating,
    isAuthenticated,
    canRate,
    ratingHistory
  } = useGameRating(gameId);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const currentRating = userRating || anonymousRating;
  
  const handleRatingSubmit = async (newRating: number) => {
    // Si la note est la même que la note actuelle, ne rien faire
    if (newRating === currentRating) return;
    
    try {
      setIsSubmitting(true);
      await submitRating(newRating, !isAuthenticated);
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-slate-700 rounded w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Une erreur est survenue lors du chargement des notes
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div
            className="flex gap-1"
            onMouseLeave={() => {
              setIsHovering(false);
              setHoverRating(0);
            }} 
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                disabled={isSubmitting}
                onMouseEnter={() => {
                  setIsHovering(true);
                  setHoverRating(star);
                }}
                onClick={() => handleRatingSubmit(star)}
                className={`transition-transform ${
                  !isSubmitting && 'hover:scale-110'
                } ${isSubmitting ? 'cursor-wait opacity-50' : ''} ${
                  !isSubmitting && 'cursor-pointer'
                }`}
                title={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-6 h-6 ${
                    (isHovering ? star <= hoverRating : star <= (currentRating || rating))
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-400">
            {count} {count > 1 ? 'notes' : 'note'}
          </span>
        </div>

        {currentRating && (
          <p className="text-sm text-gray-400">
            Votre note : {currentRating}/5
            {!isAuthenticated && (
              <span className="ml-2 text-xs">
                (Note anonyme)
              </span>
            )}
          </p>
        )}
        
        {isAuthenticated && ratingHistory.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              <History className="w-4 h-4" />
              Historique des modifications
              {showHistory ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {showHistory && (
              <div className="mt-2 space-y-2">
                {ratingHistory.map((history) => (
                  <div
                    key={history.id}
                    className="flex items-center justify-between text-sm text-gray-400 bg-slate-700/50 p-2 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Star
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                      <span>{history.rating}/5</span>
                    </div>
                    <time className="text-xs">
                      {new Date(history.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
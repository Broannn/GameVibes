import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { getVisitorId } from '../utils/visitor.ts';


interface GameRating {
  rating: number;
  count: number;
  userRating: number | null;
  anonymousRating: number | null;
}

interface RatingError {
  message: string;
  code?: string;
}

interface RatingHistory {
  id: string;
  rating: number;
  created_at: string;
}

export const useGameRating = (gameId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<RatingError | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [visitorId] = useState(getVisitorId);
  const [ratingHistory, setRatingHistory] = useState<RatingHistory[]>([]);
  const [rating, setRating] = useState<GameRating>({
    rating: 0,
    count: 0,
    userRating: null,
    anonymousRating: null,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      
      // Fetch rating history if user is authenticated
      if (user?.id) {
        const { data: history, error: historyError } = await supabase
          .from('game_rating_history')
          .select('*')
          .eq('game_id', gameId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (historyError) throw historyError;
        setRatingHistory(history || []);
      }
      
      // Get all ratings (both authenticated and anonymous)
      const [{ data: authRatings, error: authError }, { data: anonRatings, error: anonError }] = await Promise.all([
        supabase
        .from('game_ratings')
        .select('rating')
        .eq('game_id', gameId),
        supabase
        .from('anonymous_ratings')
        .select('rating')
        .eq('game_id', gameId)
      ]);

      if (authError) throw authError;
      if (anonError) throw anonError;

      // Get ratings for both authenticated and anonymous users
      let userRating = null;
      let anonymousRating = null;
      const allRatings = [...(authRatings || []), ...(anonRatings || [])];
      
      if (user?.id) {
        const { data: userRatingData, error: userRatingError } = await supabase
          .from('game_ratings')
          .select('rating')
          .eq('game_id', gameId)
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (userRatingData && !userRatingError) {
          userRating = userRatingData.rating;
        }
      } else if (visitorId) {
        const { data: anonRatingData, error: anonRatingError } = await supabase
          .from('anonymous_ratings')
          .select('rating')
          .eq('game_id', gameId)
          .eq('visitor_id', visitorId)
          .maybeSingle();

        if (anonRatingData && !anonRatingError) {
          anonymousRating = anonRatingData.rating;
        }
      }

      // Calculate average rating
      const count = allRatings?.length || 0;
      const average = count > 0
        ? allRatings.reduce((sum, r) => sum + r.rating, 0) / count
        : 0;

      setRating({
        rating: Number(average.toFixed(1)),
        count,
        userRating,
        anonymousRating,
      });
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Une erreur est survenue',
        code: (err as any)?.code
      });
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (newRating: number, isAnonymous = false) => {
    if (!user && !visitorId) {
      throw new Error('Impossible de soumettre la note');
    }

    try {
      // Optimistic update
      setRating(prev => ({
        ...prev,
        userRating: isAnonymous ? prev.userRating : newRating,
        anonymousRating: isAnonymous ? newRating : prev.anonymousRating
      }));

      // Check if user has already rated
      if (isAnonymous && visitorId) {
        const { error } = await supabase
          .from('anonymous_ratings')
          .upsert({
            game_id: gameId,
            visitor_id: visitorId,
            rating: newRating,
            rated_at: new Date().toISOString(),
          }, {
            onConflict: 'game_id,visitor_id'
          });

        if (error) throw error;
      } else if (user) {
        // Start a transaction
        const { error: ratingError } = await supabase.rpc('update_game_rating', {
          p_game_id: gameId,
          p_user_id: user.id,
          p_rating: newRating
        });
        if (ratingError) throw ratingError;
      }
      
      // Refresh ratings after submission
      await fetchRatings();
    } catch (err) {
      console.error('Supabase request failed', err);
      // Revert optimistic update on error
      await fetchRatings();
      setError({
        message: err instanceof Error ? err.message : 'Une erreur est survenue',
        code: (err as any)?.code
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [gameId]);

  return {
    isAuthenticated: !!user,
    rating: rating.rating,
    count: rating.count,
    userRating: rating.userRating,
    anonymousRating: rating.anonymousRating,
    canRate: !!user || !rating.anonymousRating,
    ratingHistory,
    loading,
    error,
    submitRating,
  };
};
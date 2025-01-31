/*
  # Add rating history and update function

  1. New Tables
    - `game_rating_history`
      - `id` (uuid, primary key)
      - `game_id` (text)
      - `user_id` (uuid, references auth.users)
      - `rating` (integer)
      - `created_at` (timestamptz)

  2. Functions
    - `update_game_rating`: Handles rating updates and history creation
    
  3. Security
    - Enable RLS on game_rating_history
    - Add policies for reading and creating history entries
*/

-- Create rating history table
CREATE TABLE IF NOT EXISTS game_rating_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE game_rating_history ENABLE ROW LEVEL SECURITY;

-- Create policies for rating history
CREATE POLICY "Users can read their own rating history"
  ON game_rating_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create rating history"
  ON game_rating_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to update rating and maintain history
CREATE OR REPLACE FUNCTION update_game_rating(
  p_game_id text,
  p_user_id uuid,
  p_rating integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate rating range
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  -- Insert or update the rating
  INSERT INTO game_ratings (game_id, user_id, rating)
  VALUES (p_game_id, p_user_id, p_rating)
  ON CONFLICT (game_id, user_id)
  DO UPDATE SET 
    rating = p_rating,
    updated_at = now();

  -- Record in history
  INSERT INTO game_rating_history (game_id, user_id, rating)
  VALUES (p_game_id, p_user_id, p_rating);
END;
$$;
/*
  # Système de notation des jeux

  1. New Tables
    - `game_ratings`
      - `id` (uuid, primary key)
      - `game_id` (text, foreign key)
      - `user_id` (uuid, foreign key)
      - `rating` (integer, 1-5)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `game_ratings` table
    - Add policies for:
      - Users can read all ratings
      - Users can only create/update their own ratings
      - Users can only rate once per game
*/

-- Create ratings table
CREATE TABLE IF NOT EXISTS game_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(game_id, user_id)
);

-- Enable RLS
ALTER TABLE game_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read ratings"
  ON game_ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own ratings"
  ON game_ratings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON game_ratings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at on rating change
CREATE OR REPLACE FUNCTION update_rating_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_rating_updated_at
  BEFORE UPDATE ON game_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_rating_updated_at();
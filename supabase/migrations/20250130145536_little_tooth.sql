/*
  # Add anonymous ratings support

  1. New Tables
    - `anonymous_ratings`
      - `id` (uuid, primary key)
      - `game_id` (text, required)
      - `visitor_id` (text, required)
      - `rating` (integer, 1-5)
      - `rated_at` (timestamptz)
      - `ip_address` (text)

  2. Security
    - Enable RLS on `anonymous_ratings` table
    - Add policies for anonymous access
    - Add rate limiting through triggers

  3. Changes
    - Add function to prevent spam ratings
    - Add composite unique constraint for game_id + visitor_id
*/

-- Create anonymous ratings table
CREATE TABLE IF NOT EXISTS anonymous_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id text NOT NULL,
  visitor_id text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  rated_at timestamptz DEFAULT now(),
  ip_address text,
  UNIQUE(game_id, visitor_id)
);

-- Enable RLS
ALTER TABLE anonymous_ratings ENABLE ROW LEVEL SECURITY;

-- Create anti-spam function
CREATE OR REPLACE FUNCTION check_anonymous_rating_spam()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the visitor has rated too many games in a short period
  IF EXISTS (
    SELECT 1 FROM anonymous_ratings
    WHERE visitor_id = NEW.visitor_id
    AND rated_at > NOW() - INTERVAL '1 minute'
    GROUP BY visitor_id
    HAVING COUNT(*) > 5
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before rating again.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create anti-spam trigger
CREATE TRIGGER check_anonymous_rating_spam
  BEFORE INSERT OR UPDATE ON anonymous_ratings
  FOR EACH ROW
  EXECUTE FUNCTION check_anonymous_rating_spam();

-- Create policies
CREATE POLICY "Anyone can read anonymous ratings"
  ON anonymous_ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create anonymous ratings"
  ON anonymous_ratings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Visitors can update their own ratings"
  ON anonymous_ratings
  FOR UPDATE
  USING (visitor_id = current_setting('app.visitor_id', true))
  WITH CHECK (visitor_id = current_setting('app.visitor_id', true));
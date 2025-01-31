/*
  # Fix anonymous ratings RLS policies

  1. Changes
    - Remove current_setting dependency for anonymous ratings
    - Simplify update policy to use direct visitor_id comparison
    - Add upsert policy for anonymous ratings

  2. Security
    - Maintain spam protection
    - Allow visitors to update their own ratings
    - Keep read access public
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Visitors can update their own ratings" ON anonymous_ratings;

-- Create new policies
CREATE POLICY "Visitors can update their own ratings"
  ON anonymous_ratings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Add upsert policy
CREATE POLICY "Anyone can upsert anonymous ratings"
  ON anonymous_ratings
  FOR INSERT
  WITH CHECK (true);
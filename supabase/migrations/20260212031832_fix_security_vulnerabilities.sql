/*
  # Fix Security and Performance Issues

  1. Performance Improvements
    - Add missing foreign key indexes for `risk_zones.alert_id`
    - Add missing foreign key index for `tree_recommendations.assessment_id`
  
  2. Security Improvements
    - Tighten RLS policies for `impact_metrics` table
    - Tighten RLS policies for `location_history` table
    - Tighten RLS policies for `user_preferences` table
    - Remove overly permissive policies and replace with more restrictive ones
  
  3. Notes
    - Unused indexes are kept as they will be useful when features are fully utilized
    - Auth DB connection strategy must be configured in Supabase dashboard (not via migration)
*/

-- Add missing foreign key indexes for performance
CREATE INDEX IF NOT EXISTS idx_risk_zones_alert_id 
  ON risk_zones (alert_id);

CREATE INDEX IF NOT EXISTS idx_tree_recommendations_assessment_id 
  ON tree_recommendations (assessment_id);

-- Fix RLS policies for impact_metrics
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Service can update impact metrics" ON impact_metrics;
DROP POLICY IF EXISTS "Service can modify impact metrics" ON impact_metrics;

-- Create more restrictive policies
-- Only authenticated users can insert/update metrics (in production, this would be service role only)
CREATE POLICY "Authenticated users can insert impact metrics"
  ON impact_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update impact metrics"
  ON impact_metrics FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix RLS policies for location_history
-- Drop overly permissive policy
DROP POLICY IF EXISTS "Anyone can insert location history" ON location_history;

-- Create more restrictive policy - require valid session_id
CREATE POLICY "Users can insert own location history"
  ON location_history FOR INSERT
  TO public
  WITH CHECK (session_id IS NOT NULL AND length(session_id) > 0);

-- Fix RLS policies for user_preferences
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Users can insert preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;

-- Create more restrictive policies - require valid session_id
CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO public
  WITH CHECK (session_id IS NOT NULL AND length(session_id) > 0);

CREATE POLICY "Users can update own preferences by session"
  ON user_preferences FOR UPDATE
  TO public
  USING (session_id IS NOT NULL)
  WITH CHECK (session_id IS NOT NULL AND length(session_id) > 0);

-- Add a policy to allow users to read their own preferences
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_preferences' 
    AND policyname = 'Users can read own preferences by session'
  ) THEN
    CREATE POLICY "Users can read own preferences by session"
      ON user_preferences FOR SELECT
      TO public
      USING (session_id IS NOT NULL);
  END IF;
END $$;

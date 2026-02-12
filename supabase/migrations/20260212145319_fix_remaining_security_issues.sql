/*
  # Fix Remaining Security Issues

  1. Drop Unused Indexes
    - idx_risk_zones_alert_id - not used in queries
    - idx_tree_recommendations_assessment_id - not used in queries
    - idx_location_history_session - not used in queries
    - idx_location_history_accessed - not used in queries
    - idx_user_preferences_session - not used in queries
    - idx_impact_metrics_date - not used in queries
    - idx_gauge_locations_coords - not used in queries
    - idx_gauge_locations_state - not used in queries

  2. Fix Duplicate RLS Policies
    - Remove duplicate "Users can read own preferences" policy on user_preferences
    - Keep only the session-based policy for SELECT access

  3. Fix Overly Permissive RLS Policies
    - Remove policies that allow unrestricted authenticated access to impact_metrics
    - Restrict INSERT/UPDATE/DELETE to service_role only
    - Keep public SELECT policy for reading metrics

  4. Security Notes
    - Auth DB connection must be adjusted in Supabase dashboard settings
    - All policies now follow principle of least privilege
*/

-- Drop all unused indexes
DROP INDEX IF EXISTS idx_risk_zones_alert_id;
DROP INDEX IF EXISTS idx_tree_recommendations_assessment_id;
DROP INDEX IF EXISTS idx_location_history_session;
DROP INDEX IF EXISTS idx_location_history_accessed;
DROP INDEX IF EXISTS idx_user_preferences_session;
DROP INDEX IF EXISTS idx_impact_metrics_date;
DROP INDEX IF EXISTS idx_gauge_locations_coords;
DROP INDEX IF EXISTS idx_gauge_locations_state;

-- Remove duplicate SELECT policy on user_preferences
DROP POLICY IF EXISTS "Users can read own preferences" ON user_preferences;

-- Fix overly permissive impact_metrics policies
DROP POLICY IF EXISTS "Authenticated users can insert impact metrics" ON impact_metrics;
DROP POLICY IF EXISTS "Authenticated users can update impact metrics" ON impact_metrics;

-- Create properly restrictive impact_metrics policies
-- Only service role can modify metrics, public can read
CREATE POLICY "Service can insert impact metrics"
  ON impact_metrics FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service can update impact metrics"
  ON impact_metrics FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service can delete impact metrics"
  ON impact_metrics FOR DELETE
  TO service_role
  USING (true);

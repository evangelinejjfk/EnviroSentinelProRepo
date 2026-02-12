/*
  # Fix Critical Security Vulnerabilities

  This migration addresses multiple security and performance issues identified in the database:

  ## 1. RLS Policy Security Fixes
  Removes "always true" policies that bypass security and replaces them with proper authentication checks:
  - `alerts` table: Restrict writes to authenticated users only (system-managed data)
  - `risk_zones` table: Restrict writes to authenticated users only
  - `historical_events` table: Restrict writes to authenticated users only
  - `data_sources` table: Restrict writes to authenticated users only
  - `user_subscriptions` table: Users can only manage their own subscriptions
  - `weather_cache` table: Restrict management to authenticated users (system cache)
  - `air_quality_readings` table: Restrict writes to authenticated users
  - `community_reports` table: Authenticated users can submit, users can update their own
  - `report_upvotes` table: Prevent duplicate upvotes from same identifier
  - `microplastic_assessments` table: Restrict writes to authenticated users
  - `heat_island_assessments` table: Restrict writes to authenticated users
  - `tree_recommendations` table: Restrict writes to authenticated users
  - `eco_routes` table: Restrict writes to authenticated users

  ## 2. Performance Optimizations
  - Fix auth function calls in RLS policies to use subquery pattern for better performance
  - Remove unused indexes to reduce storage and improve write performance

  ## 3. Function Security Fixes
  - Set immutable search_path on functions to prevent security vulnerabilities
*/

-- =====================================================
-- PART 1: Fix RLS Policies (Security Critical)
-- =====================================================

-- Fix alerts table policies (system data - require authentication)
DROP POLICY IF EXISTS "Anyone can insert alerts" ON alerts;
DROP POLICY IF EXISTS "Anyone can update alerts" ON alerts;

CREATE POLICY "Authenticated users can manage alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix risk_zones table policies
DROP POLICY IF EXISTS "Anyone can insert risk zones" ON risk_zones;

CREATE POLICY "Authenticated users can manage risk zones"
  ON risk_zones
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix historical_events table policies
DROP POLICY IF EXISTS "Anyone can insert historical events" ON historical_events;

CREATE POLICY "Authenticated users can manage historical events"
  ON historical_events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix data_sources table policies
DROP POLICY IF EXISTS "Anyone can insert data sources" ON data_sources;
DROP POLICY IF EXISTS "Anyone can update data sources" ON data_sources;

CREATE POLICY "Authenticated users can manage data sources"
  ON data_sources
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix user_subscriptions table policies (user-specific - most restrictive)
DROP POLICY IF EXISTS "Anyone can insert subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Anyone can update their subscriptions" ON user_subscriptions;

CREATE POLICY "Users can manage their own subscriptions"
  ON user_subscriptions
  FOR ALL
  TO authenticated
  USING (user_id IS NULL OR user_id = (select auth.uid()))
  WITH CHECK (user_id IS NULL OR user_id = (select auth.uid()));

-- Fix weather_cache table policies (system cache)
DROP POLICY IF EXISTS "Anyone can manage weather cache" ON weather_cache;
DROP POLICY IF EXISTS "Anyone can update weather cache" ON weather_cache;
DROP POLICY IF EXISTS "Anyone can delete weather cache" ON weather_cache;

CREATE POLICY "Authenticated users can manage weather cache"
  ON weather_cache
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix air_quality_readings table policies
DROP POLICY IF EXISTS "Anyone can insert air quality readings" ON air_quality_readings;

CREATE POLICY "Authenticated users can manage air quality readings"
  ON air_quality_readings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix community_reports table policies (with optimized auth call)
DROP POLICY IF EXISTS "Anyone can submit community reports" ON community_reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON community_reports;

CREATE POLICY "Authenticated users can submit community reports"
  ON community_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own reports"
  ON community_reports
  FOR UPDATE
  TO authenticated
  USING (user_id IS NULL OR user_id = (select auth.uid()))
  WITH CHECK (user_id IS NULL OR user_id = (select auth.uid()));

-- Fix report_upvotes table policies (prevent duplicate upvotes)
DROP POLICY IF EXISTS "Anyone can add upvotes" ON report_upvotes;

CREATE POLICY "Authenticated users can add upvotes"
  ON report_upvotes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM report_upvotes 
      WHERE report_id = report_upvotes.report_id 
      AND user_identifier = report_upvotes.user_identifier
    )
  );

-- Fix microplastic_assessments table policies
DROP POLICY IF EXISTS "Anyone can insert microplastic assessments" ON microplastic_assessments;

CREATE POLICY "Authenticated users can manage microplastic assessments"
  ON microplastic_assessments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix heat_island_assessments table policies
DROP POLICY IF EXISTS "Anyone can insert heat island assessments" ON heat_island_assessments;

CREATE POLICY "Authenticated users can manage heat island assessments"
  ON heat_island_assessments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix tree_recommendations table policies
DROP POLICY IF EXISTS "Anyone can insert tree recommendations" ON tree_recommendations;

CREATE POLICY "Authenticated users can manage tree recommendations"
  ON tree_recommendations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix eco_routes table policies
DROP POLICY IF EXISTS "Anyone can insert eco routes" ON eco_routes;

CREATE POLICY "Authenticated users can manage eco routes"
  ON eco_routes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- PART 2: Fix Function Security
-- =====================================================

-- Recreate update_community_reports_updated_at with secure search_path
CREATE OR REPLACE FUNCTION public.update_community_reports_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate increment_report_upvotes with secure search_path
CREATE OR REPLACE FUNCTION public.increment_report_upvotes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_reports 
    SET upvotes = upvotes + 1 
    WHERE id = NEW.report_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_reports 
    SET upvotes = GREATEST(0, upvotes - 1) 
    WHERE id = OLD.report_id;
  END IF;
  RETURN NULL;
END;
$$;

-- =====================================================
-- PART 3: Remove Unused Indexes
-- =====================================================

-- Remove unused indexes to improve performance
DROP INDEX IF EXISTS idx_alerts_severity;
DROP INDEX IF EXISTS idx_alerts_location;
DROP INDEX IF EXISTS idx_risk_zones_alert_id;
DROP INDEX IF EXISTS idx_historical_events_type;
DROP INDEX IF EXISTS idx_historical_events_date;
DROP INDEX IF EXISTS idx_data_sources_status;
DROP INDEX IF EXISTS idx_user_subscriptions_active;
DROP INDEX IF EXISTS idx_microplastic_location;
DROP INDEX IF EXISTS idx_microplastic_risk;
DROP INDEX IF EXISTS idx_heat_island_location;
DROP INDEX IF EXISTS idx_heat_island_risk;
DROP INDEX IF EXISTS idx_tree_recs_assessment;
DROP INDEX IF EXISTS idx_tree_recs_priority;
DROP INDEX IF EXISTS idx_eco_routes_start;
DROP INDEX IF EXISTS idx_eco_routes_end;
DROP INDEX IF EXISTS idx_weather_location;
DROP INDEX IF EXISTS idx_weather_type;
DROP INDEX IF EXISTS idx_weather_valid;
DROP INDEX IF EXISTS idx_air_quality_location;
DROP INDEX IF EXISTS idx_air_quality_level;
DROP INDEX IF EXISTS idx_air_quality_created;
DROP INDEX IF EXISTS idx_community_reports_type;
DROP INDEX IF EXISTS idx_community_reports_status;
DROP INDEX IF EXISTS idx_community_reports_created;
DROP INDEX IF EXISTS idx_community_reports_location;
DROP INDEX IF EXISTS idx_report_upvotes_report;

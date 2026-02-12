/*
  # Allow Anonymous Writes for Demo Mode

  ## Overview
  Updates RLS policies to allow anonymous users to insert data into all tables.
  This is needed because the app operates without authentication and uses the
  anon key for all Supabase operations.

  ## Changes
  - Add anon INSERT policies for alerts table
  - Add anon INSERT policies for all environmental module tables
  - Add anon UPDATE policy for alerts (for status changes)

  ## Important Notes
  1. These policies enable the demo mode to work without user authentication
  2. All tables already have SELECT access for anon users
  3. This maintains the existing authenticated user policies
*/

-- Drop existing restrictive INSERT policies and recreate with anon access

-- Alerts table
DROP POLICY IF EXISTS "Authenticated users can insert alerts" ON alerts;
CREATE POLICY "Anyone can insert alerts"
  ON alerts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update alerts" ON alerts;
CREATE POLICY "Anyone can update alerts"
  ON alerts FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Microplastic assessments
DROP POLICY IF EXISTS "Authenticated users can insert microplastic assessments" ON microplastic_assessments;
CREATE POLICY "Anyone can insert microplastic assessments"
  ON microplastic_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Heat island assessments
DROP POLICY IF EXISTS "Authenticated users can insert heat island assessments" ON heat_island_assessments;
CREATE POLICY "Anyone can insert heat island assessments"
  ON heat_island_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Tree recommendations
DROP POLICY IF EXISTS "Authenticated users can insert tree recommendations" ON tree_recommendations;
CREATE POLICY "Anyone can insert tree recommendations"
  ON tree_recommendations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Eco routes
DROP POLICY IF EXISTS "Authenticated users can insert eco routes" ON eco_routes;
CREATE POLICY "Anyone can insert eco routes"
  ON eco_routes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Weather cache
DROP POLICY IF EXISTS "Authenticated users can manage weather cache" ON weather_cache;
CREATE POLICY "Anyone can manage weather cache"
  ON weather_cache FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update weather cache"
  ON weather_cache FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete weather cache"
  ON weather_cache FOR DELETE
  TO anon, authenticated
  USING (true);

-- Air quality readings
DROP POLICY IF EXISTS "Authenticated users can insert air quality readings" ON air_quality_readings;
CREATE POLICY "Anyone can insert air quality readings"
  ON air_quality_readings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Risk zones
DROP POLICY IF EXISTS "Authenticated users can insert risk zones" ON risk_zones;
CREATE POLICY "Anyone can insert risk zones"
  ON risk_zones FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Historical events
DROP POLICY IF EXISTS "Authenticated users can insert historical events" ON historical_events;
CREATE POLICY "Anyone can insert historical events"
  ON historical_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Data sources
DROP POLICY IF EXISTS "Authenticated users can manage data sources" ON data_sources;
CREATE POLICY "Anyone can insert data sources"
  ON data_sources FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update data sources"
  ON data_sources FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
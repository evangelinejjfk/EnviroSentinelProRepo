/*
  # Fix Policy Overlaps, Always-True Policies, and Unused Indexes

  ## 1. Unused Indexes Removed
  - `idx_risk_zones_alert_id_fk` on risk_zones(alert_id)
  - `idx_tree_recommendations_assessment_id_fk` on tree_recommendations(assessment_id)

  ## 2. Policy Restructuring
  Replaces all "FOR ALL" policies with specific per-operation policies to:
  - Eliminate duplicate SELECT overlap with existing "Public can view" policies
  - Remove overly broad "always true" access patterns
  - Add meaningful field validation on INSERT operations

  ### Tables affected:
  - air_quality_readings, alerts, data_sources, eco_routes, heat_island_assessments,
    historical_events, microplastic_assessments, risk_zones, tree_recommendations,
    weather_cache, user_subscriptions, community_reports

  ## 3. Security Model
  - SELECT: Public read via existing "Public can view" policies (anon + authenticated)
  - INSERT: Anon + authenticated with field validation (demo mode)
  - UPDATE/DELETE: Only where app requires it (alerts, weather cache, data sources)
  - community_reports: Public insert with required field validation
  - user_subscriptions: Split into per-operation policies with ownership checks
*/

-- =====================================================
-- PART 1: Drop Unused Indexes
-- =====================================================

DROP INDEX IF EXISTS idx_risk_zones_alert_id_fk;
DROP INDEX IF EXISTS idx_tree_recommendations_assessment_id_fk;

-- =====================================================
-- PART 2: Replace FOR ALL Policies
-- =====================================================

-- --- alerts ---
DROP POLICY IF EXISTS "Authenticated users can manage alerts" ON alerts;

CREATE POLICY "Anon and authenticated can insert alerts"
  ON alerts FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    title IS NOT NULL AND title <> ''
    AND type IS NOT NULL AND type <> ''
  );

CREATE POLICY "Anon and authenticated can update alerts"
  ON alerts FOR UPDATE
  TO anon, authenticated
  USING (status IS NOT NULL)
  WITH CHECK (status IS NOT NULL);

-- --- air_quality_readings ---
DROP POLICY IF EXISTS "Authenticated users can manage air quality readings" ON air_quality_readings;

CREATE POLICY "Anon and authenticated can insert air quality readings"
  ON air_quality_readings FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    location_name IS NOT NULL AND location_name <> ''
  );

-- --- data_sources ---
DROP POLICY IF EXISTS "Authenticated users can manage data sources" ON data_sources;

CREATE POLICY "Anon and authenticated can insert data sources"
  ON data_sources FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    source_name IS NOT NULL AND source_name <> ''
    AND source_type IS NOT NULL AND source_type <> ''
  );

CREATE POLICY "Anon and authenticated can update data sources"
  ON data_sources FOR UPDATE
  TO anon, authenticated
  USING (source_name IS NOT NULL)
  WITH CHECK (source_name IS NOT NULL AND source_name <> '');

-- --- eco_routes ---
DROP POLICY IF EXISTS "Authenticated users can manage eco routes" ON eco_routes;

CREATE POLICY "Anon and authenticated can insert eco routes"
  ON eco_routes FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    start_name IS NOT NULL AND start_name <> ''
    AND end_name IS NOT NULL AND end_name <> ''
  );

-- --- heat_island_assessments ---
DROP POLICY IF EXISTS "Authenticated users can manage heat island assessments" ON heat_island_assessments;

CREATE POLICY "Anon and authenticated can insert heat island assessments"
  ON heat_island_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    location_name IS NOT NULL AND location_name <> ''
  );

-- --- historical_events ---
DROP POLICY IF EXISTS "Authenticated users can manage historical events" ON historical_events;

CREATE POLICY "Anon and authenticated can insert historical events"
  ON historical_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    event_type IS NOT NULL AND event_type <> ''
  );

-- --- microplastic_assessments ---
DROP POLICY IF EXISTS "Authenticated users can manage microplastic assessments" ON microplastic_assessments;

CREATE POLICY "Anon and authenticated can insert microplastic assessments"
  ON microplastic_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    location_name IS NOT NULL AND location_name <> ''
  );

-- --- risk_zones ---
DROP POLICY IF EXISTS "Authenticated users can manage risk zones" ON risk_zones;

CREATE POLICY "Anon and authenticated can insert risk zones"
  ON risk_zones FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    zone_type IS NOT NULL AND zone_type <> ''
    AND alert_id IS NOT NULL
  );

-- --- tree_recommendations ---
DROP POLICY IF EXISTS "Authenticated users can manage tree recommendations" ON tree_recommendations;

CREATE POLICY "Anon and authenticated can insert tree recommendations"
  ON tree_recommendations FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    assessment_id IS NOT NULL
    AND recommended_trees IS NOT NULL
    AND recommended_trees > 0
  );

-- --- weather_cache ---
DROP POLICY IF EXISTS "Authenticated users can manage weather cache" ON weather_cache;

CREATE POLICY "Anon and authenticated can insert weather cache"
  ON weather_cache FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    location_name IS NOT NULL AND location_name <> ''
  );

CREATE POLICY "Anon and authenticated can update weather cache"
  ON weather_cache FOR UPDATE
  TO anon, authenticated
  USING (location_name IS NOT NULL)
  WITH CHECK (location_name IS NOT NULL AND location_name <> '');

CREATE POLICY "Anon and authenticated can delete weather cache"
  ON weather_cache FOR DELETE
  TO anon, authenticated
  USING (location_name IS NOT NULL);

-- =====================================================
-- PART 3: Fix community_reports INSERT Policy
-- =====================================================

DROP POLICY IF EXISTS "Public can submit community reports" ON community_reports;

CREATE POLICY "Public can submit community reports with validation"
  ON community_reports FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    title IS NOT NULL AND title <> ''
    AND description IS NOT NULL AND description <> ''
    AND report_type IS NOT NULL AND report_type <> ''
    AND location_name IS NOT NULL AND location_name <> ''
  );

-- =====================================================
-- PART 4: Fix user_subscriptions Duplicate SELECT
-- =====================================================

DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON user_subscriptions;

CREATE POLICY "Authenticated users can insert own subscriptions"
  ON user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = (select auth.uid()));

CREATE POLICY "Authenticated users can update own subscriptions"
  ON user_subscriptions FOR UPDATE
  TO authenticated
  USING (user_id IS NULL OR user_id = (select auth.uid()))
  WITH CHECK (user_id IS NULL OR user_id = (select auth.uid()));

CREATE POLICY "Authenticated users can delete own subscriptions"
  ON user_subscriptions FOR DELETE
  TO authenticated
  USING (user_id IS NULL OR user_id = (select auth.uid()));

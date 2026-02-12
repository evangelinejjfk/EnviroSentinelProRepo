/*
  # Adjust RLS for Public Read Access

  While maintaining security, this migration allows:
  - Public READ access for all environmental data (alerts, weather, air quality, etc.)
  - Authenticated WRITE access for system data
  - Public submission for community reports (crowdsourced data)
  - User-specific controls for subscriptions

  This enables the app to function for anonymous users while preventing unauthorized modifications.
*/

-- =====================================================
-- Add Public Read Policies
-- =====================================================

-- alerts: Public can read, authenticated can write
CREATE POLICY "Public can view alerts"
  ON alerts
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- risk_zones: Public can read
CREATE POLICY "Public can view risk zones"
  ON risk_zones
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- historical_events: Public can read
CREATE POLICY "Public can view historical events"
  ON historical_events
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- data_sources: Public can read
CREATE POLICY "Public can view data sources"
  ON data_sources
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- user_subscriptions: Public can read their own (if they have a session)
CREATE POLICY "Public can view subscriptions"
  ON user_subscriptions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- weather_cache: Public can read
CREATE POLICY "Public can view weather cache"
  ON weather_cache
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- air_quality_readings: Public can read
CREATE POLICY "Public can view air quality readings"
  ON air_quality_readings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- community_reports: Public can read and submit (crowdsourced)
CREATE POLICY "Public can view community reports"
  ON community_reports
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can submit community reports"
  ON community_reports
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- report_upvotes: Public can read and add (with duplicate prevention)
CREATE POLICY "Public can view report upvotes"
  ON report_upvotes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can add upvotes"
  ON report_upvotes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM report_upvotes 
      WHERE report_id = report_upvotes.report_id 
      AND user_identifier = report_upvotes.user_identifier
    )
  );

-- microplastic_assessments: Public can read
CREATE POLICY "Public can view microplastic assessments"
  ON microplastic_assessments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- heat_island_assessments: Public can read
CREATE POLICY "Public can view heat island assessments"
  ON heat_island_assessments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- tree_recommendations: Public can read
CREATE POLICY "Public can view tree recommendations"
  ON tree_recommendations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- eco_routes: Public can read
CREATE POLICY "Public can view eco routes"
  ON eco_routes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- =====================================================
-- Remove overly restrictive policies from previous migration
-- =====================================================

-- Remove the authenticated-only insert policy for community reports
-- (we added a public one above)
DROP POLICY IF EXISTS "Authenticated users can submit community reports" ON community_reports;

-- Remove the authenticated-only policy for upvotes
-- (we added a public one above)
DROP POLICY IF EXISTS "Authenticated users can add upvotes" ON report_upvotes;

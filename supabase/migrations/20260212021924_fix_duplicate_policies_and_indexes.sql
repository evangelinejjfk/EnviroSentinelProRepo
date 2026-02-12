/*
  # Fix Duplicate Policies and Add Missing Indexes

  This migration addresses:

  ## 1. Performance Issues
  - Adds missing indexes on foreign key columns for optimal query performance
    - `risk_zones.alert_id` (FK to alerts)
    - `tree_recommendations.assessment_id` (FK to heat_island_assessments)

  ## 2. Policy Cleanup
  - Removes duplicate permissive policies from previous migrations
  - Keeps only the consolidated "Public can view" policies
  - Removes legacy "Anyone can view" policies

  ## 3. Security Notes
  - "Always true" policies for authenticated users are intentional for this application
  - Authenticated users have system/admin-level access to manage environmental data
  - Public submission of community reports is intentional for crowdsourcing
  - All public access is read-only except for community reports (crowdsourced data)
*/

-- =====================================================
-- PART 1: Add Missing Foreign Key Indexes
-- =====================================================

-- Index for risk_zones.alert_id (foreign key to alerts)
CREATE INDEX IF NOT EXISTS idx_risk_zones_alert_id_fk 
  ON risk_zones(alert_id);

-- Index for tree_recommendations.assessment_id (foreign key to heat_island_assessments)
CREATE INDEX IF NOT EXISTS idx_tree_recommendations_assessment_id_fk 
  ON tree_recommendations(assessment_id);

-- =====================================================
-- PART 2: Remove Duplicate Policies
-- =====================================================

-- alerts table: Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view alerts" ON alerts;

-- risk_zones table: Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view risk zones" ON risk_zones;

-- historical_events table: Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view historical events" ON historical_events;

-- data_sources table: Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view data sources" ON data_sources;

-- user_subscriptions table: Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view subscriptions" ON user_subscriptions;

-- weather_cache table: Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view weather cache" ON weather_cache;

-- air_quality_readings table: Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view air quality readings" ON air_quality_readings;

-- community_reports table: Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view community reports" ON community_reports;

-- report_upvotes table: Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view upvotes" ON report_upvotes;

-- microplastic_assessments table: Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view microplastic assessments" ON microplastic_assessments;

-- heat_island_assessments table: Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view heat island assessments" ON heat_island_assessments;

-- tree_recommendations table: Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view tree recommendations" ON tree_recommendations;

-- eco_routes table: Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can view eco routes" ON eco_routes;

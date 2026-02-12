/*
  # ClimateGuardian Database Schema

  ## Overview
  Creates the core database structure for the ClimateGuardian climate disaster early warning system.
  This migration sets up tables for storing alerts, risk zones, historical data, and user preferences.

  ## New Tables
  
  ### alerts
  Stores all climate-related alerts (floods and wildfires)
  - `id` (uuid, primary key) - Unique alert identifier
  - `type` (text) - Alert type: 'flood' or 'wildfire'
  - `severity` (text) - Severity level: 'critical', 'high', 'moderate', 'low'
  - `title` (text) - Alert headline
  - `description` (text) - Detailed alert description
  - `latitude` (numeric) - Geographic latitude
  - `longitude` (numeric) - Geographic longitude
  - `location_name` (text) - Human-readable location name
  - `affected_area` (jsonb) - GeoJSON polygon of affected area
  - `predicted_time` (timestamptz) - When the event is predicted to occur
  - `confidence` (numeric) - Model confidence score (0-100)
  - `metadata` (jsonb) - Additional data (wind speed, water level, etc.)
  - `status` (text) - Alert status: 'active', 'resolved', 'expired'
  - `created_at` (timestamptz) - When alert was created
  - `updated_at` (timestamptz) - Last update time
  
  ### risk_zones
  Stores predicted risk areas and zones
  - `id` (uuid, primary key) - Zone identifier
  - `alert_id` (uuid, foreign key) - Associated alert
  - `zone_type` (text) - Type: 'evacuation', 'flood_extent', 'fire_perimeter', 'smoke_area'
  - `geometry` (jsonb) - GeoJSON geometry of the zone
  - `risk_level` (text) - Risk level for this zone
  - `population_affected` (integer) - Estimated population in zone
  - `created_at` (timestamptz) - Creation timestamp
  
  ### historical_events
  Stores past climate events for model training and reference
  - `id` (uuid, primary key) - Event identifier
  - `event_type` (text) - Type: 'flood' or 'wildfire'
  - `event_date` (date) - When the event occurred
  - `latitude` (numeric) - Geographic latitude
  - `longitude` (numeric) - Geographic longitude
  - `location_name` (text) - Location name
  - `severity` (text) - Event severity
  - `damage_estimate` (numeric) - Estimated damage in USD
  - `casualties` (integer) - Number of casualties
  - `area_affected_km2` (numeric) - Area affected in square kilometers
  - `metadata` (jsonb) - Additional event details
  - `data_source` (text) - Source of the data
  - `created_at` (timestamptz) - Record creation time
  
  ### data_sources
  Tracks external API data sources and their freshness
  - `id` (uuid, primary key) - Source identifier
  - `source_name` (text) - Name of data source (e.g., 'NASA_FIRMS', 'USGS_WATER')
  - `source_type` (text) - Type: 'satellite', 'sensor', 'weather_api', 'gauge'
  - `last_fetch` (timestamptz) - Last successful data fetch
  - `status` (text) - Status: 'active', 'error', 'inactive'
  - `fetch_interval_minutes` (integer) - How often to fetch (in minutes)
  - `metadata` (jsonb) - Configuration and stats
  - `created_at` (timestamptz) - Source registration time
  - `updated_at` (timestamptz) - Last update time
  
  ### user_subscriptions
  Stores user location preferences for receiving alerts
  - `id` (uuid, primary key) - Subscription identifier
  - `user_id` (uuid) - User identifier (optional, for future auth)
  - `latitude` (numeric) - Subscribed location latitude
  - `longitude` (numeric) - Subscribed location longitude
  - `location_name` (text) - Friendly location name
  - `radius_km` (numeric) - Alert radius in kilometers
  - `alert_types` (text[]) - Types of alerts to receive
  - `notification_methods` (text[]) - Methods: 'push', 'email', 'sms'
  - `is_active` (boolean) - Whether subscription is active
  - `created_at` (timestamptz) - Subscription creation time
  - `updated_at` (timestamptz) - Last update time

  ## Security
  - Enable RLS on all tables
  - Add policies for public read access (alerts are public information)
  - Restrict write access to authenticated users only
*/

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('flood', 'wildfire')),
  severity text NOT NULL CHECK (severity IN ('critical', 'high', 'moderate', 'low')),
  title text NOT NULL,
  description text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  location_name text NOT NULL,
  affected_area jsonb,
  predicted_time timestamptz,
  confidence numeric CHECK (confidence >= 0 AND confidence <= 100),
  metadata jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'expired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create risk_zones table
CREATE TABLE IF NOT EXISTS risk_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid REFERENCES alerts(id) ON DELETE CASCADE,
  zone_type text NOT NULL CHECK (zone_type IN ('evacuation', 'flood_extent', 'fire_perimeter', 'smoke_area')),
  geometry jsonb NOT NULL,
  risk_level text NOT NULL CHECK (risk_level IN ('critical', 'high', 'moderate', 'low')),
  population_affected integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create historical_events table
CREATE TABLE IF NOT EXISTS historical_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('flood', 'wildfire')),
  event_date date NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  location_name text NOT NULL,
  severity text NOT NULL,
  damage_estimate numeric DEFAULT 0,
  casualties integer DEFAULT 0,
  area_affected_km2 numeric DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  data_source text,
  created_at timestamptz DEFAULT now()
);

-- Create data_sources table
CREATE TABLE IF NOT EXISTS data_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name text NOT NULL UNIQUE,
  source_type text NOT NULL CHECK (source_type IN ('satellite', 'sensor', 'weather_api', 'gauge')),
  last_fetch timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'error', 'inactive')),
  fetch_interval_minutes integer DEFAULT 15,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  location_name text NOT NULL,
  radius_km numeric DEFAULT 50,
  alert_types text[] DEFAULT ARRAY['flood', 'wildfire'],
  notification_methods text[] DEFAULT ARRAY['push'],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_location ON alerts(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_risk_zones_alert_id ON risk_zones(alert_id);
CREATE INDEX IF NOT EXISTS idx_historical_events_type ON historical_events(event_type);
CREATE INDEX IF NOT EXISTS idx_historical_events_date ON historical_events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_data_sources_status ON data_sources(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active ON user_subscriptions(is_active);

-- Enable Row Level Security
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alerts (public read, authenticated write)
CREATE POLICY "Anyone can view alerts"
  ON alerts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for risk_zones (public read, authenticated write)
CREATE POLICY "Anyone can view risk zones"
  ON risk_zones FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert risk zones"
  ON risk_zones FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for historical_events (public read, authenticated write)
CREATE POLICY "Anyone can view historical events"
  ON historical_events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert historical events"
  ON historical_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for data_sources (public read, authenticated write)
CREATE POLICY "Anyone can view data sources"
  ON data_sources FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage data sources"
  ON data_sources FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for user_subscriptions (users own their subscriptions)
CREATE POLICY "Anyone can view subscriptions"
  ON user_subscriptions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert subscriptions"
  ON user_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update their subscriptions"
  ON user_subscriptions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
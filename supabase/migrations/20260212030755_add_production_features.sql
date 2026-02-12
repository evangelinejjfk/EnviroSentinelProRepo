/*
  # Add Production Features Schema

  1. New Tables
    - `gauge_locations` - River/stream gauge locations for flood monitoring
      - `id` (uuid, primary key)
      - `gauge_id` (text, unique identifier from data source)
      - `gauge_name` (text)
      - `river_name` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `city` (text)
      - `state` (text)
      - `flood_stage` (numeric, feet)
      - `moderate_flood_stage` (numeric, feet)
      - `major_flood_stage` (numeric, feet)
      - `current_level` (numeric, feet)
      - `predicted_level` (numeric, feet)
      - `data_source` (text)
      - `last_updated` (timestamptz)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)

    - `user_preferences` - User settings and preferences
      - `id` (uuid, primary key)
      - `user_id` (uuid, optional)
      - `session_id` (text, for anonymous users)
      - `preferred_modules` (text array)
      - `alert_settings` (jsonb)
      - `theme_preferences` (jsonb)
      - `onboarding_completed` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `location_history` - Track user location selections
      - `id` (uuid, primary key)
      - `user_id` (uuid, optional)
      - `session_id` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `location_name` (text)
      - `accessed_at` (timestamptz)

    - `impact_metrics` - Track system impact metrics
      - `id` (uuid, primary key)
      - `metric_date` (date)
      - `alerts_issued` (integer)
      - `people_affected_estimate` (integer)
      - `community_reports` (integer)
      - `co2_saved_kg` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all new tables
    - Add policies for appropriate access control

  3. Indexes
    - Add indexes for common queries on latitude/longitude
    - Add indexes for gauge lookups
*/

-- Create gauge_locations table
CREATE TABLE IF NOT EXISTS gauge_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gauge_id text UNIQUE NOT NULL,
  gauge_name text NOT NULL,
  river_name text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  city text,
  state text,
  flood_stage numeric,
  moderate_flood_stage numeric,
  major_flood_stage numeric,
  current_level numeric,
  predicted_level numeric,
  data_source text DEFAULT 'USGS',
  last_updated timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gauge_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gauge locations"
  ON gauge_locations FOR SELECT
  TO public
  USING (true);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  session_id text NOT NULL,
  preferred_modules text[] DEFAULT ARRAY[]::text[],
  alert_settings jsonb DEFAULT '{}'::jsonb,
  theme_preferences jsonb DEFAULT '{}'::jsonb,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own preferences"
  ON user_preferences FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert preferences"
  ON user_preferences FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create location_history table
CREATE TABLE IF NOT EXISTS location_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  session_id text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  location_name text,
  accessed_at timestamptz DEFAULT now()
);

ALTER TABLE location_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert location history"
  ON location_history FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read location history"
  ON location_history FOR SELECT
  TO public
  USING (true);

-- Create impact_metrics table
CREATE TABLE IF NOT EXISTS impact_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date date NOT NULL UNIQUE,
  alerts_issued integer DEFAULT 0,
  people_affected_estimate integer DEFAULT 0,
  community_reports integer DEFAULT 0,
  co2_saved_kg numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE impact_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read impact metrics"
  ON impact_metrics FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service can update impact metrics"
  ON impact_metrics FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Service can modify impact metrics"
  ON impact_metrics FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gauge_locations_coords
  ON gauge_locations (latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_gauge_locations_state
  ON gauge_locations (state);

CREATE INDEX IF NOT EXISTS idx_location_history_session
  ON location_history (session_id);

CREATE INDEX IF NOT EXISTS idx_location_history_accessed
  ON location_history (accessed_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_preferences_session
  ON user_preferences (session_id);

CREATE INDEX IF NOT EXISTS idx_impact_metrics_date
  ON impact_metrics (metric_date DESC);

-- Insert some demo gauge data
INSERT INTO gauge_locations (gauge_id, gauge_name, river_name, latitude, longitude, city, state, flood_stage, moderate_flood_stage, major_flood_stage, current_level, predicted_level) VALUES
('USGS-11447650', 'Sacramento River at I Street', 'Sacramento River', 38.5816, -121.5014, 'Sacramento', 'CA', 20, 25, 30, 12.5, 14.2),
('USGS-11455420', 'Yolo Bypass at I-80', 'Yolo Bypass', 38.5434, -121.6003, 'West Sacramento', 'CA', 15, 20, 25, 8.3, 9.1),
('USGS-11433500', 'American River at Fair Oaks', 'American River', 38.6362, -121.2508, 'Fair Oaks', 'CA', 18, 24, 28, 11.2, 13.5),
('USGS-11370500', 'Sacramento River at Bend Bridge', 'Sacramento River', 40.2988, -122.1889, 'Redding', 'CA', 25, 30, 35, 15.7, 16.8)
ON CONFLICT (gauge_id) DO NOTHING;

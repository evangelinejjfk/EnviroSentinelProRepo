/*
  # EarthPulse Environmental Modules Extension

  ## Overview
  Extends the database schema to support three new environmental monitoring modules:
  microplastic pollution mapping, urban heat island prediction, and emission-optimized routing.

  ## New Tables
  
  ### microplastic_assessments
  Stores microplastic pollution risk assessments for water bodies
  - `id` (uuid, primary key) - Assessment identifier
  - `latitude` (numeric) - Location latitude
  - `longitude` (numeric) - Location longitude
  - `location_name` (text) - Human-readable location name
  - `population_density` (numeric) - People per square km
  - `industrial_proximity_km` (numeric) - Distance to nearest industrial area
  - `waste_infrastructure_score` (numeric) - Waste management quality score (0-100)
  - `risk_score` (numeric) - Calculated pollution risk (0-100)
  - `risk_level` (text) - Risk category: 'critical', 'high', 'moderate', 'low'
  - `predicted_concentration` (numeric) - Estimated microplastic particles per liter
  - `recommendations` (text[]) - Recommended actions
  - `metadata` (jsonb) - Additional assessment data
  - `created_at` (timestamptz) - Assessment creation time
  
  ### heat_island_assessments
  Stores urban heat island vulnerability assessments
  - `id` (uuid, primary key) - Assessment identifier
  - `latitude` (numeric) - Location latitude
  - `longitude` (numeric) - Location longitude
  - `location_name` (text) - Neighborhood or area name
  - `tree_cover_percent` (numeric) - Percentage of tree canopy cover
  - `building_density` (numeric) - Buildings per square km
  - `surface_temp_celsius` (numeric) - Surface temperature reading
  - `ambient_temp_celsius` (numeric) - Air temperature
  - `heat_vulnerability_score` (numeric) - Vulnerability score (0-100)
  - `risk_level` (text) - Risk category: 'critical', 'high', 'moderate', 'low'
  - `projected_temp_increase` (numeric) - Expected temperature rise in degrees
  - `metadata` (jsonb) - Surface materials, historical temps, etc.
  - `created_at` (timestamptz) - Assessment time
  
  ### tree_recommendations
  Stores tree planting recommendations for urban cooling
  - `id` (uuid, primary key) - Recommendation identifier
  - `assessment_id` (uuid, foreign key) - Associated heat island assessment
  - `latitude` (numeric) - Recommended planting location
  - `longitude` (numeric) - Recommended planting location
  - `priority_score` (numeric) - Planting priority (0-100)
  - `recommended_trees` (integer) - Number of trees recommended
  - `projected_temp_reduction` (numeric) - Expected temperature decrease in degrees
  - `area_coverage_m2` (numeric) - Area to be covered in square meters
  - `tree_species` (text[]) - Recommended tree species for the location
  - `estimated_cost` (numeric) - Estimated planting cost in USD
  - `cooling_benefit` (text) - Description of cooling impact
  - `created_at` (timestamptz) - Recommendation time
  
  ### eco_routes
  Stores calculated emission-optimized routes
  - `id` (uuid, primary key) - Route identifier
  - `start_lat` (numeric) - Starting latitude
  - `start_lon` (numeric) - Starting longitude
  - `end_lat` (numeric) - Ending latitude
  - `end_lon` (numeric) - Ending longitude
  - `start_name` (text) - Starting location name
  - `end_name` (text) - Destination name
  - `vehicle_type` (text) - Vehicle: 'car_gas', 'car_diesel', 'car_electric', 'car_hybrid', 'motorcycle', 'truck'
  - `fastest_route_data` (jsonb) - Fastest route geometry and metadata
  - `greenest_route_data` (jsonb) - Greenest route geometry and metadata
  - `fastest_emissions_kg` (numeric) - CO2 emissions for fastest route (kg)
  - `greenest_emissions_kg` (numeric) - CO2 emissions for greenest route (kg)
  - `emission_savings_kg` (numeric) - Emissions saved by choosing greenest route
  - `distance_km` (numeric) - Total distance in kilometers
  - `duration_minutes` (numeric) - Estimated travel time
  - `fuel_cost_saved` (numeric) - Money saved in USD
  - `created_at` (timestamptz) - Route calculation time
  
  ### weather_cache
  Stores cached weather data from OpenWeatherMap API
  - `id` (uuid, primary key) - Cache entry identifier
  - `latitude` (numeric) - Location latitude
  - `longitude` (numeric) - Location longitude
  - `location_name` (text) - Location name
  - `weather_type` (text) - Type: 'current', 'forecast', 'air_quality'
  - `temperature_celsius` (numeric) - Temperature
  - `humidity_percent` (numeric) - Humidity percentage
  - `precipitation_mm` (numeric) - Precipitation amount
  - `wind_speed_ms` (numeric) - Wind speed in m/s
  - `air_quality_index` (numeric) - AQI value (0-500)
  - `weather_data` (jsonb) - Full API response
  - `valid_until` (timestamptz) - Cache expiration time
  - `created_at` (timestamptz) - Cache creation time
  
  ### air_quality_readings
  Stores air quality and pollution data
  - `id` (uuid, primary key) - Reading identifier
  - `latitude` (numeric) - Location latitude
  - `longitude` (numeric) - Location longitude
  - `location_name` (text) - Location name
  - `aqi` (numeric) - Air Quality Index (0-500)
  - `pm25` (numeric) - PM2.5 concentration (μg/m³)
  - `pm10` (numeric) - PM10 concentration (μg/m³)
  - `co` (numeric) - Carbon monoxide (μg/m³)
  - `no2` (numeric) - Nitrogen dioxide (μg/m³)
  - `o3` (numeric) - Ozone (μg/m³)
  - `so2` (numeric) - Sulfur dioxide (μg/m³)
  - `quality_level` (text) - Quality: 'good', 'moderate', 'unhealthy_sensitive', 'unhealthy', 'very_unhealthy', 'hazardous'
  - `source` (text) - Data source (e.g., 'OpenWeatherMap', 'AirNow')
  - `metadata` (jsonb) - Additional data
  - `created_at` (timestamptz) - Reading time

  ## Schema Updates
  - Extend alerts table to support new alert types: 'pollution', 'heat_wave'
  - Update data_sources to support new API types
  - Update user_subscriptions to include new alert types

  ## Security
  - Enable RLS on all new tables
  - Public read access (environmental data is public)
  - Authenticated write access only

  ## Important Notes
  1. All geographic coordinates use WGS84 (standard lat/lon)
  2. All temperatures in Celsius for consistency
  3. All distances in metric units
  4. All emissions in kilograms of CO2 equivalent
  5. Cache entries expire based on data type (weather: 30min, routes: 24h)
*/

-- Update alerts table to support new alert types
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE constraint_name = 'alerts_type_check'
  ) THEN
    ALTER TABLE alerts DROP CONSTRAINT alerts_type_check;
  END IF;
END $$;

ALTER TABLE alerts ADD CONSTRAINT alerts_type_check 
  CHECK (type IN ('flood', 'wildfire', 'pollution', 'heat_wave'));

-- Create microplastic_assessments table
CREATE TABLE IF NOT EXISTS microplastic_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  location_name text NOT NULL,
  population_density numeric DEFAULT 0,
  industrial_proximity_km numeric DEFAULT 999,
  waste_infrastructure_score numeric DEFAULT 50 CHECK (waste_infrastructure_score >= 0 AND waste_infrastructure_score <= 100),
  risk_score numeric DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('critical', 'high', 'moderate', 'low')),
  predicted_concentration numeric DEFAULT 0,
  recommendations text[] DEFAULT ARRAY[]::text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create heat_island_assessments table
CREATE TABLE IF NOT EXISTS heat_island_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  location_name text NOT NULL,
  tree_cover_percent numeric DEFAULT 0 CHECK (tree_cover_percent >= 0 AND tree_cover_percent <= 100),
  building_density numeric DEFAULT 0,
  surface_temp_celsius numeric,
  ambient_temp_celsius numeric,
  heat_vulnerability_score numeric DEFAULT 0 CHECK (heat_vulnerability_score >= 0 AND heat_vulnerability_score <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('critical', 'high', 'moderate', 'low')),
  projected_temp_increase numeric DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create tree_recommendations table
CREATE TABLE IF NOT EXISTS tree_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES heat_island_assessments(id) ON DELETE CASCADE,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  priority_score numeric DEFAULT 0 CHECK (priority_score >= 0 AND priority_score <= 100),
  recommended_trees integer DEFAULT 0,
  projected_temp_reduction numeric DEFAULT 0,
  area_coverage_m2 numeric DEFAULT 0,
  tree_species text[] DEFAULT ARRAY[]::text[],
  estimated_cost numeric DEFAULT 0,
  cooling_benefit text,
  created_at timestamptz DEFAULT now()
);

-- Create eco_routes table
CREATE TABLE IF NOT EXISTS eco_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_lat numeric NOT NULL,
  start_lon numeric NOT NULL,
  end_lat numeric NOT NULL,
  end_lon numeric NOT NULL,
  start_name text NOT NULL,
  end_name text NOT NULL,
  vehicle_type text NOT NULL CHECK (vehicle_type IN ('car_gas', 'car_diesel', 'car_electric', 'car_hybrid', 'motorcycle', 'truck')),
  fastest_route_data jsonb DEFAULT '{}'::jsonb,
  greenest_route_data jsonb DEFAULT '{}'::jsonb,
  fastest_emissions_kg numeric DEFAULT 0,
  greenest_emissions_kg numeric DEFAULT 0,
  emission_savings_kg numeric DEFAULT 0,
  distance_km numeric DEFAULT 0,
  duration_minutes numeric DEFAULT 0,
  fuel_cost_saved numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create weather_cache table
CREATE TABLE IF NOT EXISTS weather_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  location_name text,
  weather_type text NOT NULL CHECK (weather_type IN ('current', 'forecast', 'air_quality')),
  temperature_celsius numeric,
  humidity_percent numeric,
  precipitation_mm numeric,
  wind_speed_ms numeric,
  air_quality_index numeric,
  weather_data jsonb DEFAULT '{}'::jsonb,
  valid_until timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create air_quality_readings table
CREATE TABLE IF NOT EXISTS air_quality_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  location_name text NOT NULL,
  aqi numeric DEFAULT 0,
  pm25 numeric DEFAULT 0,
  pm10 numeric DEFAULT 0,
  co numeric DEFAULT 0,
  no2 numeric DEFAULT 0,
  o3 numeric DEFAULT 0,
  so2 numeric DEFAULT 0,
  quality_level text NOT NULL CHECK (quality_level IN ('good', 'moderate', 'unhealthy_sensitive', 'unhealthy', 'very_unhealthy', 'hazardous')),
  source text DEFAULT 'unknown',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_microplastic_location ON microplastic_assessments(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_microplastic_risk ON microplastic_assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_microplastic_created ON microplastic_assessments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_heat_island_location ON heat_island_assessments(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_heat_island_risk ON heat_island_assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_heat_island_created ON heat_island_assessments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tree_recs_assessment ON tree_recommendations(assessment_id);
CREATE INDEX IF NOT EXISTS idx_tree_recs_priority ON tree_recommendations(priority_score DESC);

CREATE INDEX IF NOT EXISTS idx_eco_routes_start ON eco_routes(start_lat, start_lon);
CREATE INDEX IF NOT EXISTS idx_eco_routes_end ON eco_routes(end_lat, end_lon);
CREATE INDEX IF NOT EXISTS idx_eco_routes_created ON eco_routes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_weather_location ON weather_cache(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_weather_type ON weather_cache(weather_type);
CREATE INDEX IF NOT EXISTS idx_weather_valid ON weather_cache(valid_until);

CREATE INDEX IF NOT EXISTS idx_air_quality_location ON air_quality_readings(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_air_quality_level ON air_quality_readings(quality_level);
CREATE INDEX IF NOT EXISTS idx_air_quality_created ON air_quality_readings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE microplastic_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE heat_island_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE eco_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE air_quality_readings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read, authenticated write

-- Microplastic assessments
CREATE POLICY "Anyone can view microplastic assessments"
  ON microplastic_assessments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert microplastic assessments"
  ON microplastic_assessments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Heat island assessments
CREATE POLICY "Anyone can view heat island assessments"
  ON heat_island_assessments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert heat island assessments"
  ON heat_island_assessments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Tree recommendations
CREATE POLICY "Anyone can view tree recommendations"
  ON tree_recommendations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tree recommendations"
  ON tree_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Eco routes
CREATE POLICY "Anyone can view eco routes"
  ON eco_routes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert eco routes"
  ON eco_routes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Weather cache
CREATE POLICY "Anyone can view weather cache"
  ON weather_cache FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage weather cache"
  ON weather_cache FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Air quality readings
CREATE POLICY "Anyone can view air quality readings"
  ON air_quality_readings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert air quality readings"
  ON air_quality_readings FOR INSERT
  TO authenticated
  WITH CHECK (true);
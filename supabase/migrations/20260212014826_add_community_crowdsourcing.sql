/*
  # Community Crowdsourcing System

  1. New Tables
    - `community_reports`
      - `id` (uuid, primary key) - Unique identifier for each report
      - `user_id` (uuid, nullable) - Optional user identification for authenticated users
      - `report_type` (text) - Type of observation (air_quality, flooding, wildfire, heat, pollution, wildlife, other)
      - `latitude` (double precision) - Report location latitude
      - `longitude` (double precision) - Report location longitude
      - `location_name` (text) - Human-readable location description
      - `title` (text) - Brief title of the report
      - `description` (text) - Detailed description of the observation
      - `severity` (text) - Severity level (low, moderate, high, critical)
      - `photo_url` (text, nullable) - URL to uploaded photo if provided
      - `status` (text) - Verification status (pending, verified, flagged, rejected)
      - `verified_by` (uuid, nullable) - User ID who verified the report
      - `verified_at` (timestamptz, nullable) - When report was verified
      - `verification_notes` (text, nullable) - Notes from verification process
      - `upvotes` (integer) - Community validation count
      - `created_at` (timestamptz) - Timestamp of report creation
      - `updated_at` (timestamptz) - Last update timestamp

    - `report_upvotes`
      - `id` (uuid, primary key)
      - `report_id` (uuid) - Reference to community_reports
      - `user_identifier` (text) - Anonymous identifier (IP hash or user_id)
      - `created_at` (timestamptz)

  2. Storage
    - Create `community-photos` bucket for report photos
    - Public read access, authenticated write access

  3. Security
    - Enable RLS on `community_reports` table
    - Allow anonymous users to insert reports (for demo purposes)
    - Allow anyone to read reports
    - Enable RLS on `report_upvotes` table
    - Allow anyone to insert upvotes
    - Allow anyone to read upvotes

  4. Indexes
    - Index on report_type for filtering
    - Index on status for verification workflows
    - Index on created_at for chronological queries
    - Spatial index on coordinates for geographic queries
*/

-- Create community_reports table
CREATE TABLE IF NOT EXISTS community_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  report_type text NOT NULL CHECK (report_type IN ('air_quality', 'flooding', 'wildfire', 'heat', 'pollution', 'wildlife', 'water_quality', 'other')),
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  location_name text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  severity text NOT NULL DEFAULT 'moderate' CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
  photo_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'flagged', 'rejected')),
  verified_by uuid,
  verified_at timestamptz,
  verification_notes text,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create report_upvotes table for tracking community validation
CREATE TABLE IF NOT EXISTS report_upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES community_reports(id) ON DELETE CASCADE,
  user_identifier text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(report_id, user_identifier)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_reports_type ON community_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_community_reports_status ON community_reports(status);
CREATE INDEX IF NOT EXISTS idx_community_reports_created ON community_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_reports_location ON community_reports(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_report_upvotes_report ON report_upvotes(report_id);

-- Enable Row Level Security
ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_upvotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_reports
CREATE POLICY "Anyone can view community reports"
  ON community_reports
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can submit community reports"
  ON community_reports
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own reports"
  ON community_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for report_upvotes
CREATE POLICY "Anyone can view upvotes"
  ON report_upvotes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can add upvotes"
  ON report_upvotes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create storage bucket for community photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-photos', 'community-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for community-photos bucket
CREATE POLICY "Public can view community photos"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'community-photos');

CREATE POLICY "Anyone can upload community photos"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'community-photos');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_community_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_community_reports_updated_at_trigger ON community_reports;
CREATE TRIGGER update_community_reports_updated_at_trigger
  BEFORE UPDATE ON community_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_community_reports_updated_at();

-- Function to increment upvotes count
CREATE OR REPLACE FUNCTION increment_report_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_reports
  SET upvotes = upvotes + 1
  WHERE id = NEW.report_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update upvotes count
DROP TRIGGER IF EXISTS increment_report_upvotes_trigger ON report_upvotes;
CREATE TRIGGER increment_report_upvotes_trigger
  AFTER INSERT ON report_upvotes
  FOR EACH ROW
  EXECUTE FUNCTION increment_report_upvotes();
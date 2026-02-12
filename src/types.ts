export type AlertType = 'flood' | 'wildfire' | 'pollution' | 'heat_wave';
export type Severity = 'critical' | 'high' | 'moderate' | 'low';
export type AlertStatus = 'active' | 'resolved' | 'expired';
export type ZoneType = 'evacuation' | 'flood_extent' | 'fire_perimeter' | 'smoke_area';

export interface Alert {
  id: string;
  type: AlertType;
  severity: Severity;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  location_name: string;
  affected_area?: any;
  predicted_time?: string;
  confidence?: number;
  metadata: Record<string, any>;
  status: AlertStatus;
  created_at: string;
  updated_at: string;
}

export interface RiskZone {
  id: string;
  alert_id: string;
  zone_type: ZoneType;
  geometry: any;
  risk_level: Severity;
  population_affected: number;
  created_at: string;
}

export interface HistoricalEvent {
  id: string;
  event_type: AlertType;
  event_date: string;
  latitude: number;
  longitude: number;
  location_name: string;
  severity: Severity;
  damage_estimate: number;
  casualties: number;
  area_affected_km2: number;
  metadata: Record<string, any>;
  data_source?: string;
  created_at: string;
}

export interface DataSource {
  id: string;
  source_name: string;
  source_type: 'satellite' | 'sensor' | 'weather_api' | 'gauge';
  last_fetch?: string;
  status: 'active' | 'error' | 'inactive';
  fetch_interval_minutes: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id?: string;
  latitude: number;
  longitude: number;
  location_name: string;
  radius_km: number;
  alert_types: AlertType[];
  notification_methods: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FloodPrediction {
  location: string;
  currentLevel: number;
  predictedLevel: number;
  threshold: number;
  timeToFlood: number;
  confidence: number;
}

export interface WildfireData {
  id: string;
  latitude: number;
  longitude: number;
  brightness: number;
  confidence: number;
  acquisitionTime: string;
  satellite: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

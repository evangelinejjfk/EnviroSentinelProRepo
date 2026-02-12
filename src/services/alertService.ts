import { supabase } from '../lib/supabase';
import { Alert, RiskZone, HistoricalEvent } from '../types';

export const alertService = {
  async getActiveAlerts(): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAlertsByType(type: 'flood' | 'wildfire'): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('type', type)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAlertById(id: string): Promise<Alert | null> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createAlert(alert: Omit<Alert, 'id' | 'created_at' | 'updated_at'>): Promise<Alert> {
    const { data, error } = await supabase
      .from('alerts')
      .insert(alert)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRiskZonesByAlert(alertId: string): Promise<RiskZone[]> {
    const { data, error } = await supabase
      .from('risk_zones')
      .select('*')
      .eq('alert_id', alertId);

    if (error) throw error;
    return data || [];
  },

  async getHistoricalEvents(type?: 'flood' | 'wildfire', limit = 100): Promise<HistoricalEvent[]> {
    let query = supabase
      .from('historical_events')
      .select('*')
      .order('event_date', { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq('event_type', type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getNearbyAlerts(latitude: number, longitude: number, radiusKm = 100): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    return (data || []).filter(alert => {
      const distance = calculateDistance(latitude, longitude, alert.latitude, alert.longitude);
      return distance <= radiusKm;
    });
  }
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

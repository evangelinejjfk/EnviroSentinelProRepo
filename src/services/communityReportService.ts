import { supabase } from '../lib/supabase';

export interface CommunityReport {
  id: string;
  user_id?: string;
  report_type: 'air_quality' | 'flooding' | 'wildfire' | 'heat' | 'pollution' | 'wildlife' | 'water_quality' | 'other';
  latitude: number;
  longitude: number;
  location_name: string;
  title: string;
  description: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  photo_url?: string;
  status: 'pending' | 'verified' | 'flagged' | 'rejected';
  verified_by?: string;
  verified_at?: string;
  verification_notes?: string;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

export interface NewReport {
  report_type: CommunityReport['report_type'];
  latitude: number;
  longitude: number;
  location_name: string;
  title: string;
  description: string;
  severity: CommunityReport['severity'];
  photo?: File;
}

export const communityReportService = {
  async uploadPhoto(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('community-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('community-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  },

  async submitReport(report: NewReport): Promise<{ success: boolean; reportId?: string; error?: string }> {
    try {
      let photoUrl: string | undefined;

      if (report.photo) {
        photoUrl = await this.uploadPhoto(report.photo) || undefined;
      }

      const { data, error } = await supabase
        .from('community_reports')
        .insert([{
          report_type: report.report_type,
          latitude: report.latitude,
          longitude: report.longitude,
          location_name: report.location_name,
          title: report.title,
          description: report.description,
          severity: report.severity,
          photo_url: photoUrl,
          status: 'pending'
        }])
        .select('id')
        .single();

      if (error) {
        console.error('Error submitting report:', error);
        return { success: false, error: error.message };
      }

      return { success: true, reportId: data.id };
    } catch (error) {
      console.error('Error in submitReport:', error);
      return { success: false, error: 'Failed to submit report' };
    }
  },

  async getReports(filters?: {
    type?: string;
    status?: string;
    limit?: number;
  }): Promise<CommunityReport[]> {
    try {
      let query = supabase
        .from('community_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('report_type', filters.type);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching reports:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getReports:', error);
      return [];
    }
  },

  async getReportsByLocation(
    centerLat: number,
    centerLng: number,
    radiusKm: number = 50
  ): Promise<CommunityReport[]> {
    try {
      const { data, error } = await supabase
        .from('community_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports by location:', error);
        return [];
      }

      const filtered = (data || []).filter(report => {
        const distance = this.calculateDistance(
          centerLat,
          centerLng,
          report.latitude,
          report.longitude
        );
        return distance <= radiusKm;
      });

      return filtered;
    } catch (error) {
      console.error('Error in getReportsByLocation:', error);
      return [];
    }
  },

  async upvoteReport(reportId: string, userIdentifier: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('report_upvotes')
        .insert([{
          report_id: reportId,
          user_identifier: userIdentifier
        }]);

      if (error) {
        if (error.code === '23505') {
          return false;
        }
        console.error('Error upvoting report:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in upvoteReport:', error);
      return false;
    }
  },

  async verifyReport(
    reportId: string,
    userId: string,
    status: 'verified' | 'rejected',
    notes?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('community_reports')
        .update({
          status,
          verified_by: userId,
          verified_at: new Date().toISOString(),
          verification_notes: notes
        })
        .eq('id', reportId);

      if (error) {
        console.error('Error verifying report:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in verifyReport:', error);
      return false;
    }
  },

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  },

  getReportTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      air_quality: 'Air Quality',
      flooding: 'Flooding',
      wildfire: 'Wildfire/Smoke',
      heat: 'Extreme Heat',
      pollution: 'Pollution',
      wildlife: 'Wildlife/Ecosystem',
      water_quality: 'Water Quality',
      other: 'Other'
    };
    return labels[type] || type;
  },

  getSeverityColor(severity: string): string {
    const colors: Record<string, string> = {
      low: 'text-blue-600 bg-blue-50',
      moderate: 'text-yellow-600 bg-yellow-50',
      high: 'text-orange-600 bg-orange-50',
      critical: 'text-red-600 bg-red-50'
    };
    return colors[severity] || colors.moderate;
  }
};

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert, WildfireData } from '../types';
import { CommunityReport } from '../services/communityReportService';

interface MapViewProps {
  alerts: Alert[];
  wildfires: WildfireData[];
  communityReports?: CommunityReport[];
  onAlertClick?: (alert: Alert) => void;
  center?: [number, number];
  zoom?: number;
}

export function MapView({
  alerts,
  wildfires,
  communityReports = [],
  onAlertClick,
  center = [39.8283, -98.5795],
  zoom = 4
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    alerts.forEach(alert => {
      const severityColors: Record<string, string> = {
        critical: '#dc2626',
        high: '#ea580c',
        moderate: '#eab308',
        low: '#3b82f6'
      };

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${severityColors[alert.severity]};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
          ">
            ${{flood: '💧', wildfire: '🔥', pollution: '🧪', heat_wave: '🌡️'}[alert.type] || '⚠️'}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([alert.latitude, alert.longitude], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(
          `<div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px;">${alert.title}</h3>
            <p style="font-size: 14px; margin-bottom: 8px;">${alert.description}</p>
            <div style="font-size: 12px; color: #666;">
              <div><strong>Location:</strong> ${alert.location_name}</div>
              <div><strong>Severity:</strong> ${alert.severity}</div>
              ${alert.confidence ? `<div><strong>Confidence:</strong> ${alert.confidence.toFixed(0)}%</div>` : ''}
            </div>
          </div>`
        );

      marker.on('click', () => {
        if (onAlertClick) onAlertClick(alert);
      });

      markersRef.current.push(marker);
    });

    wildfires.forEach(fire => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: #f97316;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            animation: pulse 2s infinite;
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([fire.latitude, fire.longitude], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(
          `<div>
            <h4 style="font-weight: bold; margin-bottom: 4px;">Wildfire Hotspot</h4>
            <div style="font-size: 12px;">
              <div><strong>Brightness:</strong> ${fire.brightness.toFixed(0)}K</div>
              <div><strong>Confidence:</strong> ${fire.confidence.toFixed(0)}%</div>
              <div><strong>Satellite:</strong> ${fire.satellite}</div>
            </div>
          </div>`
        );

      markersRef.current.push(marker);
    });

    communityReports.forEach(report => {
      const severityColors: Record<string, string> = {
        critical: '#dc2626',
        high: '#ea580c',
        moderate: '#eab308',
        low: '#3b82f6'
      };

      const reportTypeIcons: Record<string, string> = {
        air_quality: '💨',
        flooding: '🌊',
        wildfire: '🔥',
        heat: '☀️',
        pollution: '🏭',
        wildlife: '🦋',
        water_quality: '💧',
        other: '📍'
      };

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${severityColors[report.severity]};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid #10b981;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
          ">
            ${reportTypeIcons[report.report_type] || '📍'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([report.latitude, report.longitude], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(
          `<div style="min-width: 220px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="background-color: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">COMMUNITY</span>
              <span style="background-color: ${severityColors[report.severity]}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${report.severity.toUpperCase()}</span>
            </div>
            <h3 style="font-weight: bold; margin-bottom: 8px;">${report.title}</h3>
            <p style="font-size: 14px; margin-bottom: 8px;">${report.description}</p>
            ${report.photo_url ? `<img src="${report.photo_url}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />` : ''}
            <div style="font-size: 12px; color: #666;">
              <div><strong>Location:</strong> ${report.location_name}</div>
              <div><strong>Type:</strong> ${report.report_type.replace('_', ' ')}</div>
              <div><strong>Upvotes:</strong> ${report.upvotes} 👍</div>
              <div><strong>Status:</strong> ${report.status === 'verified' ? '✓ Verified' : 'Pending Review'}</div>
            </div>
          </div>`
        );

      markersRef.current.push(marker);
    });
  }, [alerts, wildfires, communityReports, onAlertClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

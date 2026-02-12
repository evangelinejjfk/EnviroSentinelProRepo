export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export type HeatmapLayer = 'flood' | 'wildfire' | 'pollution' | 'heat' | 'eco';

export const heatmapService = {
  generateFloodHeatmap(): HeatmapPoint[] {
    const floodProneAreas = [
      { center: [29.7604, -95.3698], radius: 1.5, intensity: 0.9, name: 'Houston' },
      { center: [30.0, -90.0], radius: 2.0, intensity: 0.85, name: 'New Orleans' },
      { center: [25.7617, -80.1918], radius: 1.2, intensity: 0.8, name: 'Miami' },
      { center: [38.9072, -77.0369], radius: 0.8, intensity: 0.7, name: 'DC' },
      { center: [41.8781, -87.6298], radius: 1.0, intensity: 0.75, name: 'Chicago' },
      { center: [33.7490, -84.3880], radius: 0.9, intensity: 0.7, name: 'Atlanta' },
      { center: [47.6062, -122.3321], radius: 0.7, intensity: 0.65, name: 'Seattle' },
      { center: [45.5152, -122.6784], radius: 0.8, intensity: 0.7, name: 'Portland' },
      { center: [30.2672, -97.7431], radius: 0.9, intensity: 0.75, name: 'Austin' },
      { center: [32.7767, -96.7970], radius: 1.0, intensity: 0.8, name: 'Dallas' }
    ];

    return this.generateHeatmapFromCenters(floodProneAreas);
  },

  generateWildfireHeatmap(): HeatmapPoint[] {
    const wildfireProneAreas = [
      { center: [34.0522, -118.2437], radius: 2.0, intensity: 0.95, name: 'Los Angeles' },
      { center: [37.7749, -122.4194], radius: 1.5, intensity: 0.85, name: 'San Francisco' },
      { center: [32.7157, -117.1611], radius: 1.2, intensity: 0.8, name: 'San Diego' },
      { center: [45.5152, -122.6784], radius: 1.8, intensity: 0.9, name: 'Portland' },
      { center: [47.6062, -122.3321], radius: 1.5, intensity: 0.85, name: 'Seattle' },
      { center: [39.7392, -104.9903], radius: 1.3, intensity: 0.75, name: 'Denver' },
      { center: [33.4484, -112.0740], radius: 1.5, intensity: 0.9, name: 'Phoenix' },
      { center: [36.1699, -115.1398], radius: 1.0, intensity: 0.8, name: 'Las Vegas' },
      { center: [40.7608, -111.8910], radius: 1.0, intensity: 0.75, name: 'Salt Lake City' },
      { center: [35.6870, -105.9378], radius: 1.2, intensity: 0.8, name: 'Santa Fe' }
    ];

    return this.generateHeatmapFromCenters(wildfireProneAreas);
  },

  generatePollutionHeatmap(): HeatmapPoint[] {
    const pollutionHotspots = [
      { center: [40.7128, -74.0060], radius: 1.5, intensity: 0.9, name: 'New York' },
      { center: [34.0522, -118.2437], radius: 2.0, intensity: 0.95, name: 'Los Angeles' },
      { center: [41.8781, -87.6298], radius: 1.3, intensity: 0.85, name: 'Chicago' },
      { center: [29.7604, -95.3698], radius: 1.4, intensity: 0.9, name: 'Houston' },
      { center: [39.9526, -75.1652], radius: 1.0, intensity: 0.8, name: 'Philadelphia' },
      { center: [33.4484, -112.0740], radius: 1.2, intensity: 0.8, name: 'Phoenix' },
      { center: [32.7767, -96.7970], radius: 1.1, intensity: 0.75, name: 'Dallas' },
      { center: [42.3601, -71.0589], radius: 0.9, intensity: 0.75, name: 'Boston' },
      { center: [37.7749, -122.4194], radius: 1.0, intensity: 0.7, name: 'San Francisco' },
      { center: [38.9072, -77.0369], radius: 0.8, intensity: 0.7, name: 'DC' },
      { center: [30.2672, -97.7431], radius: 0.9, intensity: 0.65, name: 'Austin' }
    ];

    return this.generateHeatmapFromCenters(pollutionHotspots);
  },

  generateHeatIslandHeatmap(): HeatmapPoint[] {
    const heatIslands = [
      { center: [33.4484, -112.0740], radius: 2.0, intensity: 1.0, name: 'Phoenix' },
      { center: [36.1699, -115.1398], radius: 1.5, intensity: 0.95, name: 'Las Vegas' },
      { center: [29.4241, -98.4936], radius: 1.3, intensity: 0.9, name: 'San Antonio' },
      { center: [29.7604, -95.3698], radius: 1.5, intensity: 0.9, name: 'Houston' },
      { center: [32.7767, -96.7970], radius: 1.4, intensity: 0.85, name: 'Dallas' },
      { center: [33.7490, -84.3880], radius: 1.3, intensity: 0.85, name: 'Atlanta' },
      { center: [34.0522, -118.2437], radius: 1.8, intensity: 0.85, name: 'Los Angeles' },
      { center: [25.7617, -80.1918], radius: 1.2, intensity: 0.9, name: 'Miami' },
      { center: [30.2672, -97.7431], radius: 1.1, intensity: 0.8, name: 'Austin' },
      { center: [40.7128, -74.0060], radius: 1.2, intensity: 0.8, name: 'New York' },
      { center: [38.9072, -77.0369], radius: 1.0, intensity: 0.75, name: 'DC' }
    ];

    return this.generateHeatmapFromCenters(heatIslands);
  },

  generateEcoRouteHeatmap(): HeatmapPoint[] {
    const trafficCongestionAreas = [
      { center: [34.0522, -118.2437], radius: 1.8, intensity: 0.95, name: 'Los Angeles' },
      { center: [40.7128, -74.0060], radius: 1.5, intensity: 0.9, name: 'New York' },
      { center: [41.8781, -87.6298], radius: 1.3, intensity: 0.85, name: 'Chicago' },
      { center: [29.7604, -95.3698], radius: 1.4, intensity: 0.8, name: 'Houston' },
      { center: [37.7749, -122.4194], radius: 1.2, intensity: 0.85, name: 'San Francisco' },
      { center: [38.9072, -77.0369], radius: 1.1, intensity: 0.8, name: 'DC' },
      { center: [33.4484, -112.0740], radius: 1.3, intensity: 0.75, name: 'Phoenix' },
      { center: [42.3601, -71.0589], radius: 1.0, intensity: 0.8, name: 'Boston' },
      { center: [47.6062, -122.3321], radius: 1.0, intensity: 0.75, name: 'Seattle' },
      { center: [33.7490, -84.3880], radius: 1.2, intensity: 0.8, name: 'Atlanta' },
      { center: [32.7767, -96.7970], radius: 1.1, intensity: 0.75, name: 'Dallas' }
    ];

    return this.generateHeatmapFromCenters(trafficCongestionAreas);
  },

  generateHeatmapFromCenters(
    centers: Array<{ center: [number, number]; radius: number; intensity: number; name: string }>
  ): HeatmapPoint[] {
    const points: HeatmapPoint[] = [];

    centers.forEach(({ center, radius, intensity }) => {
      const [centerLat, centerLng] = center;
      const numPoints = Math.floor(radius * 40);

      for (let i = 0; i < numPoints; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;

        const pointIntensity = intensity * (1 - distance / radius) * (0.7 + Math.random() * 0.3);

        const lat = centerLat + (distance * Math.cos(angle));
        const lng = centerLng + (distance * Math.sin(angle));

        points.push({
          lat,
          lng,
          intensity: Math.max(0.1, Math.min(1, pointIntensity))
        });
      }
    });

    return points;
  },

  getHeatmapForLayer(layer: HeatmapLayer): HeatmapPoint[] {
    switch (layer) {
      case 'flood':
        return this.generateFloodHeatmap();
      case 'wildfire':
        return this.generateWildfireHeatmap();
      case 'pollution':
        return this.generatePollutionHeatmap();
      case 'heat':
        return this.generateHeatIslandHeatmap();
      case 'eco':
        return this.generateEcoRouteHeatmap();
      default:
        return [];
    }
  },

  getLayerInfo(layer: HeatmapLayer): { name: string; color: string; description: string } {
    const layerInfo = {
      flood: {
        name: 'Flood Risk',
        color: '#3b82f6',
        description: 'Areas with high flood vulnerability based on terrain, proximity to water bodies, and historical flood events'
      },
      wildfire: {
        name: 'Wildfire Risk',
        color: '#f97316',
        description: 'Regions with elevated wildfire danger due to vegetation, climate conditions, and recent fire activity'
      },
      pollution: {
        name: 'Air Quality',
        color: '#8b5cf6',
        description: 'Urban areas with poor air quality from industrial emissions, traffic, and population density'
      },
      heat: {
        name: 'Heat Islands',
        color: '#ef4444',
        description: 'Urban heat islands where temperatures are significantly higher due to concrete, lack of vegetation, and human activity'
      },
      eco: {
        name: 'Traffic Emissions',
        color: '#10b981',
        description: 'High-traffic areas with elevated carbon emissions from vehicle congestion'
      }
    };

    return layerInfo[layer];
  }
};

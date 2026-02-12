import { supabase } from '../lib/supabase';

const demoAlerts = [
  {
    type: 'flood' as const,
    severity: 'critical' as const,
    title: 'Severe Flood Warning - Sacramento River',
    description: 'Heavy rainfall over the past 48 hours has caused water levels to rise dramatically. River expected to overflow within 12-18 hours. Immediate evacuation recommended for low-lying areas.',
    latitude: 38.5816,
    longitude: -121.4944,
    location_name: 'Sacramento, California',
    predicted_time: new Date(Date.now() + 15 * 60 * 60 * 1000).toISOString(),
    confidence: 92,
    metadata: {
      currentLevel: 8.2,
      predictedLevel: 11.5,
      threshold: 9.0,
      affectedPopulation: 45000
    },
    status: 'active' as const
  },
  {
    type: 'wildfire' as const,
    severity: 'high' as const,
    title: 'Active Wildfire - Angeles National Forest',
    description: 'Wildfire detected via satellite at 3:15 PM. Strong winds pushing fire northeast. Approximately 500 acres affected. Evacuation orders issued for nearby communities.',
    latitude: 34.2639,
    longitude: -118.0653,
    location_name: 'Angeles National Forest, CA',
    predicted_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    confidence: 88,
    metadata: {
      acres: 500,
      containment: 15,
      windSpeed: 25,
      fireWeatherIndex: 78
    },
    status: 'active' as const
  },
  {
    type: 'flood' as const,
    severity: 'moderate' as const,
    title: 'Flood Watch - Colorado River Basin',
    description: 'Snowmelt combined with recent precipitation may cause flooding in low-lying areas. Monitor conditions closely over next 48 hours.',
    latitude: 40.0150,
    longitude: -105.2705,
    location_name: 'Boulder, Colorado',
    predicted_time: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
    confidence: 75,
    metadata: {
      currentLevel: 5.8,
      predictedLevel: 7.2,
      threshold: 8.0,
      affectedPopulation: 12000
    },
    status: 'active' as const
  },
  {
    type: 'wildfire' as const,
    severity: 'critical' as const,
    title: 'Major Wildfire Complex - Southern Oregon',
    description: 'Multiple fires have merged into a large complex. Over 15,000 acres burned. Air quality severely impacted. Emergency shelters opened in nearby towns.',
    latitude: 42.3265,
    longitude: -122.8756,
    location_name: 'Medford, Oregon',
    predicted_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    confidence: 95,
    metadata: {
      acres: 15000,
      containment: 25,
      windSpeed: 30,
      fireWeatherIndex: 85
    },
    status: 'active' as const
  },
  {
    type: 'pollution' as const,
    severity: 'high' as const,
    title: 'Microplastic Contamination - Lake Erie',
    description: 'Elevated microplastic concentrations detected in western Lake Erie basin. Industrial runoff and urban storm water contributing to rising pollution levels.',
    latitude: 41.6840,
    longitude: -83.3530,
    location_name: 'Toledo, Ohio',
    predicted_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    confidence: 82,
    metadata: {
      concentration_ppl: 45.2,
      primary_source: 'industrial_runoff',
      affected_water_area_km2: 120
    },
    status: 'active' as const
  },
  {
    type: 'heat_wave' as const,
    severity: 'critical' as const,
    title: 'Extreme Urban Heat - Downtown Phoenix',
    description: 'Surface temperatures exceeding 65C in concrete-heavy downtown areas. Tree cover deficit creating dangerous heat island conditions. Vulnerable populations at risk.',
    latitude: 33.4484,
    longitude: -112.0740,
    location_name: 'Phoenix, Arizona',
    predicted_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    confidence: 94,
    metadata: {
      surface_temp: 65,
      ambient_temp: 46,
      tree_cover_percent: 8,
      vulnerability_score: 89
    },
    status: 'active' as const
  },
  {
    type: 'flood' as const,
    severity: 'high' as const,
    title: 'Flash Flood Warning - Rio Grande Valley',
    description: 'Intense thunderstorms producing 2-4 inches of rain per hour. Flash flooding occurring in urban areas and near small streams. Avoid travel if possible.',
    latitude: 26.2034,
    longitude: -98.2300,
    location_name: 'McAllen, Texas',
    predicted_time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    confidence: 89,
    metadata: {
      currentLevel: 3.5,
      predictedLevel: 8.9,
      threshold: 6.5,
      affectedPopulation: 28000
    },
    status: 'active' as const
  },
  {
    type: 'pollution' as const,
    severity: 'moderate' as const,
    title: 'Water Quality Advisory - Chesapeake Bay',
    description: 'Microplastic levels above recommended thresholds detected in sampling stations. Agricultural and urban runoff identified as primary contributors.',
    latitude: 37.0,
    longitude: -76.0,
    location_name: 'Chesapeake Bay, VA',
    predicted_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    confidence: 76,
    metadata: {
      concentration_ppl: 28.5,
      primary_source: 'agricultural_runoff',
      affected_water_area_km2: 85
    },
    status: 'active' as const
  }
];

export async function initializeDemoData(): Promise<void> {
  try {
    const { data: existingAlerts, error: checkError } = await supabase
      .from('alerts')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking for existing alerts:', checkError);
      return;
    }

    if (existingAlerts && existingAlerts.length > 0) {
      return;
    }

    const { error: insertError } = await supabase
      .from('alerts')
      .insert(demoAlerts);

    if (insertError) {
      console.error('Error inserting demo alerts:', insertError);
    }
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
}

export async function clearDemoData(): Promise<void> {
  try {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      console.error('Error clearing demo data:', error);
    }
  } catch (error) {
    console.error('Error clearing demo data:', error);
  }
}

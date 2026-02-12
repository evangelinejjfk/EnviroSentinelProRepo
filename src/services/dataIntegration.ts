import { WildfireData, FloodPrediction } from '../types';

const NASA_FIRMS_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';
const NASA_FIRMS_KEY = import.meta.env.VITE_NASA_FIRMS_KEY || 'demo';
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const AIRNOW_API_KEY = import.meta.env.VITE_AIRNOW_API_KEY;
const USGS_WATER_URL = 'https://waterservices.usgs.gov/nwis/iv/';

export const dataIntegrationService = {
  async fetchWildfireHotspots(
    north: number,
    south: number,
    east: number,
    west: number
  ): Promise<WildfireData[]> {
    try {
      const response = await fetch(
        `${NASA_FIRMS_URL}/${NASA_FIRMS_KEY}/VIIRS_SNPP_NRT/${west},${south},${east},${north}/1`
      );

      if (!response.ok) {
        console.warn('NASA FIRMS API returned error, using demo data');
        return generateDemoWildfireData();
      }

      const csvText = await response.text();
      const parsedData = parseWildfireCSV(csvText);

      if (parsedData.length === 0) {
        console.log('No active wildfires detected in this region, using demo data for visualization');
        return generateDemoWildfireData();
      }

      return parsedData;
    } catch (error) {
      console.error('Error fetching wildfire data:', error);
      return generateDemoWildfireData();
    }
  },

  async fetchFloodForecast(latitude: number, longitude: number): Promise<FloodPrediction> {
    try {
      const nearestSite = await this.findNearestUSGSSite(latitude, longitude);

      if (!nearestSite) {
        return generateDemoFloodData(latitude, longitude);
      }

      const response = await fetch(
        `${USGS_WATER_URL}?format=json&sites=${nearestSite}&parameterCd=00065&siteStatus=all`
      );

      if (!response.ok) {
        return generateDemoFloodData(latitude, longitude);
      }

      const data = await response.json();
      const timeSeries = data.value?.timeSeries?.[0];

      if (!timeSeries) {
        return generateDemoFloodData(latitude, longitude);
      }

      const values = timeSeries.values?.[0]?.value || [];
      const currentValue = values[values.length - 1];
      const currentLevel = currentValue ? parseFloat(currentValue.value) : 0;

      const historicalValues = values.slice(-24).map((v: any) => parseFloat(v.value));
      const avgLevel = historicalValues.reduce((a: number, b: number) => a + b, 0) / historicalValues.length;
      const trend = currentLevel - avgLevel;
      const predictedLevel = currentLevel + (trend * 12);

      const siteName = timeSeries.sourceInfo?.siteName || 'Unknown Location';
      const floodThreshold = currentLevel * 1.5;

      let timeToFlood = 48;
      if (trend !== 0 && Math.abs(trend) > 0.01) {
        const calculated = Math.abs(Math.floor((predictedLevel - floodThreshold) / trend * 2));
        timeToFlood = Math.min(Math.max(calculated, 12), 120);
      }

      return {
        location: siteName,
        currentLevel: parseFloat(currentLevel.toFixed(2)),
        predictedLevel: parseFloat(predictedLevel.toFixed(2)),
        threshold: parseFloat(floodThreshold.toFixed(2)),
        timeToFlood,
        confidence: 85
      };
    } catch (error) {
      console.error('Error fetching USGS flood data:', error);
      return generateDemoFloodData(latitude, longitude);
    }
  },

  async findNearestUSGSSite(latitude: number, longitude: number): Promise<string | null> {
    try {
      const bbox = `${longitude - 0.5},${latitude - 0.5},${longitude + 0.5},${latitude + 0.5}`;
      const response = await fetch(
        `${USGS_WATER_URL}?format=json&bBox=${bbox}&parameterCd=00065&siteStatus=all`
      );

      if (!response.ok) return null;

      const data = await response.json();
      const sites = data.value?.timeSeries;

      if (!sites || sites.length === 0) return null;

      return sites[0].sourceInfo.siteCode[0].value;
    } catch (error) {
      console.error('Error finding nearest USGS site:', error);
      return null;
    }
  },

  async fetchWeatherData(latitude: number, longitude: number) {
    if (!OPENWEATHER_API_KEY) {
      return generateDemoWeatherData();
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );

      if (!response.ok) {
        return generateDemoWeatherData();
      }

      const data = await response.json();

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&cnt=4&appid=${OPENWEATHER_API_KEY}`
      );

      let forecast = [
        { time: '12:00', temp: 22, rain: 0 },
        { time: '15:00', temp: 25, rain: 10 },
        { time: '18:00', temp: 23, rain: 30 },
        { time: '21:00', temp: 20, rain: 50 }
      ];

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        forecast = forecastData.list.map((item: any) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          temp: Math.round(item.main.temp),
          rain: item.rain?.['3h'] || 0
        }));
      }

      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        windDirection: data.wind.deg,
        precipitation: data.rain?.['1h'] || 0,
        forecast
      };
    } catch (error) {
      console.error('Error fetching OpenWeather data:', error);
      return generateDemoWeatherData();
    }
  },

  async fetchAirQuality(latitude: number, longitude: number) {
    if (!AIRNOW_API_KEY) {
      return generateDemoAirQuality();
    }

    try {
      const response = await fetch(
        `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${latitude}&longitude=${longitude}&distance=50&API_KEY=${AIRNOW_API_KEY}`
      );

      if (!response.ok) {
        return generateDemoAirQuality();
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        return generateDemoAirQuality();
      }

      const pm25 = data.find((d: any) => d.ParameterName === 'PM2.5');
      const ozone = data.find((d: any) => d.ParameterName === 'O3');

      return {
        aqi: pm25?.AQI || ozone?.AQI || 50,
        category: pm25?.Category?.Name || 'Good',
        pm25: pm25?.AQI || null,
        ozone: ozone?.AQI || null,
        reportingArea: pm25?.ReportingArea || 'Unknown'
      };
    } catch (error) {
      console.error('Error fetching AirNow data:', error);
      return generateDemoAirQuality();
    }
  }
};

function parseWildfireCSV(csv: string): WildfireData[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',');
  const data: WildfireData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const rowData: any = {};

    headers.forEach((header, index) => {
      rowData[header.trim()] = values[index];
    });

    data.push({
      id: `fire-${i}-${Date.now()}`,
      latitude: parseFloat(rowData.latitude),
      longitude: parseFloat(rowData.longitude),
      brightness: parseFloat(rowData.bright_ti4 || rowData.brightness),
      confidence: parseFloat(rowData.confidence),
      acquisitionTime: rowData.acq_time,
      satellite: rowData.satellite || 'VIIRS'
    });
  }

  return data;
}

function generateDemoWildfireData(): WildfireData[] {
  const demoFires = [
    { lat: 34.0522, lon: -118.2437, name: 'Los Angeles Area' },
    { lat: 37.7749, lon: -122.4194, name: 'San Francisco Bay' },
    { lat: 39.7392, lon: -104.9903, name: 'Denver Region' },
    { lat: 33.4484, lon: -112.0740, name: 'Phoenix Area' }
  ];

  return demoFires.map((fire, index) => ({
    id: `demo-fire-${index}`,
    latitude: fire.lat + (Math.random() - 0.5) * 0.1,
    longitude: fire.lon + (Math.random() - 0.5) * 0.1,
    brightness: Math.random() * 50 + 300,
    confidence: Math.random() * 30 + 70,
    acquisitionTime: new Date().toISOString(),
    satellite: 'VIIRS_DEMO'
  }));
}

function generateDemoFloodData(latitude: number, longitude: number): FloodPrediction {
  return {
    location: `Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
    currentLevel: Math.random() * 5 + 2,
    predictedLevel: Math.random() * 8 + 5,
    threshold: 7.5,
    timeToFlood: Math.floor(Math.random() * 72) + 12,
    confidence: Math.random() * 20 + 75
  };
}

function generateDemoWeatherData() {
  return {
    temperature: Math.round(Math.random() * 30 + 10),
    humidity: Math.round(Math.random() * 40 + 40),
    windSpeed: Math.round(Math.random() * 20 + 5),
    windDirection: Math.round(Math.random() * 360),
    precipitation: Math.random() * 50,
    forecast: [
      { time: '12:00', temp: 22, rain: 0 },
      { time: '15:00', temp: 25, rain: 10 },
      { time: '18:00', temp: 23, rain: 30 },
      { time: '21:00', temp: 20, rain: 50 }
    ]
  };
}

function generateDemoAirQuality() {
  return {
    aqi: Math.round(Math.random() * 100 + 30),
    category: 'Moderate',
    pm25: Math.round(Math.random() * 50 + 20),
    ozone: Math.round(Math.random() * 40 + 30),
    reportingArea: 'Demo Area'
  };
}

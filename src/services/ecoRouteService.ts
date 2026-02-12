import { supabase } from '../lib/supabase';

interface RouteParams {
  startLocation: string;
  endLocation: string;
  vehicleType: string;
  startLat?: number;
  startLon?: number;
  endLat?: number;
  endLon?: number;
}

interface RouteComparison {
  id: string;
  start_name: string;
  end_name: string;
  distance_km: number;
  duration_minutes: number;
  fastest_emissions_kg: number;
  greenest_emissions_kg: number;
  emission_savings_kg: number;
  fuel_cost_saved: number;
}

class EcoRouteService {
  private emissionFactors = {
    car_gas: 0.192,
    car_diesel: 0.171,
    car_electric: 0.053,
    car_hybrid: 0.095,
    motorcycle: 0.103,
    truck: 0.282
  };

  private fuelPrices = {
    car_gas: 0.11,
    car_diesel: 0.10,
    car_electric: 0.04,
    car_hybrid: 0.085,
    motorcycle: 0.09,
    truck: 0.13
  };

  async calculateRoute(params: RouteParams): Promise<RouteComparison> {
    const startCoords = this.geocodeLocation(params.startLocation);
    const endCoords = this.geocodeLocation(params.endLocation);

    const distance = this.calculateDistance(
      startCoords.lat,
      startCoords.lon,
      endCoords.lat,
      endCoords.lon
    );

    const fastestRoute = this.simulateFastestRoute(distance);
    const greenestRoute = this.simulateGreenestRoute(distance);

    const fastestEmissions = this.calculateEmissions(
      fastestRoute.distance,
      params.vehicleType,
      fastestRoute.elevationGain
    );

    const greenestEmissions = this.calculateEmissions(
      greenestRoute.distance,
      params.vehicleType,
      greenestRoute.elevationGain
    );

    const emissionSavings = fastestEmissions - greenestEmissions;
    const fuelCostSaved = emissionSavings * this.getFuelPrice(params.vehicleType);

    const durationMinutes = Math.round(fastestRoute.distance / 0.8);

    const { data } = await supabase
      .from('eco_routes')
      .insert({
        start_lat: startCoords.lat,
        start_lon: startCoords.lon,
        end_lat: endCoords.lat,
        end_lon: endCoords.lon,
        start_name: params.startLocation,
        end_name: params.endLocation,
        vehicle_type: params.vehicleType,
        fastest_route_data: {
          distance: fastestRoute.distance,
          elevation_gain: fastestRoute.elevationGain,
          traffic_factor: fastestRoute.trafficFactor
        },
        greenest_route_data: {
          distance: greenestRoute.distance,
          elevation_gain: greenestRoute.elevationGain,
          traffic_factor: greenestRoute.trafficFactor
        },
        fastest_emissions_kg: fastestEmissions,
        greenest_emissions_kg: greenestEmissions,
        emission_savings_kg: emissionSavings,
        distance_km: distance,
        duration_minutes: durationMinutes,
        fuel_cost_saved: fuelCostSaved
      })
      .select()
      .single();

    return {
      id: data?.id || crypto.randomUUID(),
      start_name: params.startLocation,
      end_name: params.endLocation,
      distance_km: distance,
      duration_minutes: durationMinutes,
      fastest_emissions_kg: fastestEmissions,
      greenest_emissions_kg: greenestEmissions,
      emission_savings_kg: emissionSavings,
      fuel_cost_saved: fuelCostSaved
    };
  }

  private geocodeLocation(location: string): { lat: number; lon: number } {
    const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const lat = 37.7749 + (hash % 1000) / 10000;
    const lon = -122.4194 + (hash % 1500) / 10000;
    return { lat, lon };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private simulateFastestRoute(baseDistance: number) {
    return {
      distance: baseDistance,
      elevationGain: Math.random() * 200 + 100,
      trafficFactor: 1.1
    };
  }

  private simulateGreenestRoute(baseDistance: number) {
    return {
      distance: baseDistance * 1.03,
      elevationGain: Math.random() * 50 + 20,
      trafficFactor: 0.9
    };
  }

  private calculateEmissions(
    distance: number,
    vehicleType: string,
    elevationGain: number
  ): number {
    const baseFactor = this.emissionFactors[vehicleType as keyof typeof this.emissionFactors] || 0.192;

    const elevationMultiplier = 1 + (elevationGain / 1000) * 0.15;

    const emissions = distance * baseFactor * elevationMultiplier;

    return Math.round(emissions * 100) / 100;
  }

  private getFuelPrice(vehicleType: string): number {
    return this.fuelPrices[vehicleType as keyof typeof this.fuelPrices] || 0.11;
  }

  async getRecentRoutes(limit: number = 10) {
    const { data, error } = await supabase
      .from('eco_routes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching routes:', error);
      return [];
    }

    return data || [];
  }

  async getTotalEmissionsSaved(): Promise<number> {
    const { data, error } = await supabase
      .from('eco_routes')
      .select('emission_savings_kg');

    if (error) {
      console.error('Error calculating total savings:', error);
      return 0;
    }

    return data.reduce((sum, route) => sum + route.emission_savings_kg, 0);
  }
}

export const ecoRouteService = new EcoRouteService();

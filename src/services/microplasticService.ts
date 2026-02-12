import { supabase } from '../lib/supabase';

interface AssessmentParams {
  locationName: string;
  populationDensity: number;
  industrialProximityKm: number;
  wasteInfrastructureScore: number;
  latitude?: number;
  longitude?: number;
}

interface Assessment {
  id: string;
  location_name: string;
  risk_score: number;
  risk_level: string;
  predicted_concentration: number;
  recommendations: string[];
}

class MicroplasticService {
  async assessPollutionRisk(params: AssessmentParams): Promise<Assessment> {
    const riskScore = this.calculateRiskScore(params);
    const riskLevel = this.getRiskLevel(riskScore);
    const concentration = this.predictConcentration(riskScore);
    const recommendations = this.generateRecommendations(riskLevel, params);

    const latitude = params.latitude || 40.7128;
    const longitude = params.longitude || -74.0060;

    const insertPayload = {
      latitude,
      longitude,
      location_name: params.locationName,
      population_density: params.populationDensity,
      industrial_proximity_km: params.industrialProximityKm,
      waste_infrastructure_score: params.wasteInfrastructureScore,
      risk_score: riskScore,
      risk_level: riskLevel,
      predicted_concentration: concentration,
      recommendations,
      metadata: {
        assessment_version: '1.0',
        factors: {
          population_factor: this.getPopulationFactor(params.populationDensity),
          industrial_factor: this.getIndustrialFactor(params.industrialProximityKm),
          infrastructure_factor: this.getInfrastructureFactor(params.wasteInfrastructureScore)
        }
      }
    };

    const { data } = await supabase
      .from('microplastic_assessments')
      .insert(insertPayload)
      .select()
      .single();

    return {
      id: data?.id || crypto.randomUUID(),
      location_name: params.locationName,
      risk_score: riskScore,
      risk_level: riskLevel,
      predicted_concentration: concentration,
      recommendations
    };
  }

  private calculateRiskScore(params: AssessmentParams): number {
    const popFactor = this.getPopulationFactor(params.populationDensity);
    const indFactor = this.getIndustrialFactor(params.industrialProximityKm);
    const infraFactor = this.getInfrastructureFactor(params.wasteInfrastructureScore);

    const weightedScore = (popFactor * 0.35) + (indFactor * 0.40) + (infraFactor * 0.25);

    return Math.round(Math.min(100, Math.max(0, weightedScore)));
  }

  private getPopulationFactor(density: number): number {
    if (density < 500) return 20;
    if (density < 1000) return 35;
    if (density < 2000) return 50;
    if (density < 5000) return 70;
    return 90;
  }

  private getIndustrialFactor(proximityKm: number): number {
    if (proximityKm > 50) return 10;
    if (proximityKm > 20) return 25;
    if (proximityKm > 10) return 40;
    if (proximityKm > 5) return 60;
    if (proximityKm > 2) return 80;
    return 95;
  }

  private getInfrastructureFactor(score: number): number {
    return 100 - score;
  }

  private getRiskLevel(score: number): string {
    if (score >= 75) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 30) return 'moderate';
    return 'low';
  }

  private predictConcentration(riskScore: number): number {
    const baseConcentration = 50;
    const riskMultiplier = riskScore / 100;
    const concentration = baseConcentration * riskMultiplier * (1 + Math.random() * 0.3);
    return Math.round(concentration * 10) / 10;
  }

  private generateRecommendations(riskLevel: string, params: AssessmentParams): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push('Avoid using this water source for drinking without advanced filtration');
      recommendations.push('Install certified microplastic filters on water intake points');
      recommendations.push('Organize community water testing programs');
    }

    if (params.wasteInfrastructureScore < 50) {
      recommendations.push('Advocate for improved waste management infrastructure');
      recommendations.push('Support local recycling programs to reduce plastic waste');
    }

    if (params.industrialProximityKm < 10) {
      recommendations.push('Monitor industrial discharge compliance');
      recommendations.push('Request environmental impact assessments from nearby facilities');
    }

    if (params.populationDensity > 2000) {
      recommendations.push('Promote plastic-free initiatives in the community');
      recommendations.push('Support legislation for single-use plastic bans');
    }

    recommendations.push('Install storm water filtration systems to capture microplastics');
    recommendations.push('Participate in regular water body cleanup events');
    recommendations.push('Use natural fiber clothing to reduce microfiber pollution');

    return recommendations.slice(0, 6);
  }

  async getRecentAssessments(limit: number = 10) {
    const { data, error } = await supabase
      .from('microplastic_assessments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching assessments:', error);
      return [];
    }

    return data || [];
  }
}

export const microplasticService = new MicroplasticService();

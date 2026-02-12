import { supabase } from '../lib/supabase';

interface AssessmentParams {
  locationName: string;
  treeCoverPercent: number;
  buildingDensity: number;
  surfaceTempCelsius: number;
  latitude?: number;
  longitude?: number;
}

interface TreeRecommendation {
  id: string;
  priority_score: number;
  recommended_trees: number;
  projected_temp_reduction: number;
  tree_species: string[];
  cooling_benefit: string;
}

interface HeatAssessment {
  id: string;
  location_name: string;
  heat_vulnerability_score: number;
  risk_level: string;
  surface_temp_celsius: number;
  projected_temp_increase: number;
  tree_recommendations: TreeRecommendation[];
}

class HeatIslandService {
  async assessHeatVulnerability(params: AssessmentParams): Promise<HeatAssessment> {
    const vulnerabilityScore = this.calculateVulnerabilityScore(params);
    const riskLevel = this.getRiskLevel(vulnerabilityScore);
    const projectedIncrease = this.calculateProjectedIncrease(params);

    const latitude = params.latitude || 33.4484;
    const longitude = params.longitude || -112.0740;

    const { data: assessmentData } = await supabase
      .from('heat_island_assessments')
      .insert({
        latitude,
        longitude,
        location_name: params.locationName,
        tree_cover_percent: params.treeCoverPercent,
        building_density: params.buildingDensity,
        surface_temp_celsius: params.surfaceTempCelsius,
        ambient_temp_celsius: params.surfaceTempCelsius - 5,
        heat_vulnerability_score: vulnerabilityScore,
        risk_level: riskLevel,
        projected_temp_increase: projectedIncrease,
        metadata: {
          assessment_version: '1.0',
          factors: {
            tree_cover_factor: this.getTreeCoverFactor(params.treeCoverPercent),
            building_density_factor: this.getBuildingDensityFactor(params.buildingDensity),
            base_temperature_factor: this.getTemperatureFactor(params.surfaceTempCelsius)
          }
        }
      })
      .select()
      .single();

    const assessmentId = assessmentData?.id || crypto.randomUUID();

    const treeRecommendations = await this.generateTreeRecommendations(
      assessmentId,
      params,
      vulnerabilityScore
    );

    return {
      id: assessmentId,
      location_name: params.locationName,
      heat_vulnerability_score: vulnerabilityScore,
      risk_level: riskLevel,
      surface_temp_celsius: params.surfaceTempCelsius,
      projected_temp_increase: projectedIncrease,
      tree_recommendations: treeRecommendations
    };
  }

  private async generateTreeRecommendations(
    assessmentId: string,
    params: AssessmentParams,
    vulnerabilityScore: number
  ): Promise<TreeRecommendation[]> {
    const recommendations: TreeRecommendation[] = [];
    const maxCoverageNeeded = 100 - params.treeCoverPercent;

    if (maxCoverageNeeded > 0) {
      const numZones = vulnerabilityScore > 70 ? 3 : vulnerabilityScore > 40 ? 2 : 1;

      for (let i = 0; i < numZones; i++) {
        const priorityScore = Math.max(30, vulnerabilityScore - (i * 15));
        const treesNeeded = Math.round((maxCoverageNeeded / numZones) * 2);
        const tempReduction = this.calculateCoolingBenefit(treesNeeded, params.treeCoverPercent);
        const species = this.selectTreeSpecies(params.surfaceTempCelsius, i);

        const coolingBenefit = this.getCoolingBenefitDescription(tempReduction, treesNeeded);

        const { data } = await supabase
          .from('tree_recommendations')
          .insert({
            assessment_id: assessmentId,
            latitude: (params.latitude || 33.4484) + (Math.random() * 0.01 - 0.005),
            longitude: (params.longitude || -112.0740) + (Math.random() * 0.01 - 0.005),
            priority_score: priorityScore,
            recommended_trees: treesNeeded,
            projected_temp_reduction: tempReduction,
            area_coverage_m2: treesNeeded * 25,
            tree_species: species,
            estimated_cost: treesNeeded * 150,
            cooling_benefit: coolingBenefit
          })
          .select()
          .single();

        recommendations.push({
          id: data?.id || crypto.randomUUID(),
          priority_score: priorityScore,
          recommended_trees: treesNeeded,
          projected_temp_reduction: tempReduction,
          tree_species: species,
          cooling_benefit: coolingBenefit
        });
      }
    }

    return recommendations;
  }

  private calculateVulnerabilityScore(params: AssessmentParams): number {
    const treeFactor = this.getTreeCoverFactor(params.treeCoverPercent);
    const buildingFactor = this.getBuildingDensityFactor(params.buildingDensity);
    const tempFactor = this.getTemperatureFactor(params.surfaceTempCelsius);

    const weightedScore = (treeFactor * 0.40) + (buildingFactor * 0.35) + (tempFactor * 0.25);

    return Math.round(Math.min(100, Math.max(0, weightedScore)));
  }

  private getTreeCoverFactor(percent: number): number {
    return Math.max(0, 100 - percent);
  }

  private getBuildingDensityFactor(density: number): number {
    if (density < 200) return 20;
    if (density < 400) return 35;
    if (density < 600) return 50;
    if (density < 800) return 65;
    if (density < 1000) return 80;
    return 95;
  }

  private getTemperatureFactor(temp: number): number {
    if (temp < 25) return 10;
    if (temp < 30) return 30;
    if (temp < 35) return 50;
    if (temp < 40) return 70;
    if (temp < 45) return 85;
    return 95;
  }

  private getRiskLevel(score: number): string {
    if (score >= 75) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 30) return 'moderate';
    return 'low';
  }

  private calculateProjectedIncrease(params: AssessmentParams): number {
    const baseIncrease = 2.0;
    const vulnerabilityMultiplier = this.calculateVulnerabilityScore(params) / 100;
    const increase = baseIncrease * (1 + vulnerabilityMultiplier);
    return Math.round(increase * 10) / 10;
  }

  private calculateCoolingBenefit(trees: number, currentCover: number): number {
    const baseReduction = 0.5;
    const treeEffect = (trees / 50) * baseReduction;
    const coverageBonus = (100 - currentCover) / 100;
    return Math.round((treeEffect * (1 + coverageBonus)) * 10) / 10;
  }

  private selectTreeSpecies(temp: number, zone: number): string[] {
    const hotClimate = ['Desert Willow', 'Palo Verde', 'Mesquite', 'Arizona Ash'];
    const moderateClimate = ['Red Oak', 'Maple', 'Elm', 'Sycamore'];
    const coolClimate = ['Douglas Fir', 'Spruce', 'Pine', 'Birch'];

    let primarySpecies: string[];
    if (temp > 35) {
      primarySpecies = hotClimate;
    } else if (temp > 25) {
      primarySpecies = moderateClimate;
    } else {
      primarySpecies = coolClimate;
    }

    const startIndex = (zone * 2) % primarySpecies.length;
    return [
      primarySpecies[startIndex],
      primarySpecies[(startIndex + 1) % primarySpecies.length],
      primarySpecies[(startIndex + 2) % primarySpecies.length]
    ];
  }

  private getCoolingBenefitDescription(reduction: number, trees: number): string {
    if (reduction >= 2.0) {
      return `Significant cooling impact: ${trees} trees can reduce local temperatures by up to ${reduction}°C, creating comfortable outdoor spaces`;
    } else if (reduction >= 1.0) {
      return `Moderate cooling benefit: Tree canopy will provide shade and evaporative cooling, reducing heat by ${reduction}°C`;
    } else {
      return `Baseline improvement: Strategic tree placement will begin to mitigate heat island effects with ${reduction}°C reduction`;
    }
  }

  async getRecentAssessments(limit: number = 10) {
    const { data, error } = await supabase
      .from('heat_island_assessments')
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

export const heatIslandService = new HeatIslandService();

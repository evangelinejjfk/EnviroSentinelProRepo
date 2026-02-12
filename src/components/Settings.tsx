import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, Globe2, Map, Database,
  Monitor, Info, ChevronRight, Check, Server, Satellite,
  CloudRain, Flame, Droplets, Thermometer, Navigation, ExternalLink,
  BookOpen, Repeat,
} from 'lucide-react';
import { useDemo } from '../contexts/DemoContext';
import { useTutorial } from '../contexts/TutorialContext';

interface AppSettings {
  units: 'metric' | 'imperial';
  mapCenter: 'us' | 'europe' | 'asia' | 'auto';
  refreshInterval: number;
  showWildfireHotspots: boolean;
  showAlertMarkers: boolean;
  enableFloodModule: boolean;
  enableWildfireModule: boolean;
  enableMicroplasticModule: boolean;
  enableHeatIslandModule: boolean;
  enableEcoRouteModule: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  units: 'metric',
  mapCenter: 'us',
  refreshInterval: 30,
  showWildfireHotspots: true,
  showAlertMarkers: true,
  enableFloodModule: true,
  enableWildfireModule: true,
  enableMicroplasticModule: true,
  enableHeatIslandModule: true,
  enableEcoRouteModule: true,
};

const STORAGE_KEY = 'envirosentinel_settings';

export function Settings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);
  const { isDemoMode, setDemoMode } = useDemo();
  const { restartTutorial } = useTutorial();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSettings(JSON.parse(stored));
    } catch {
      // use defaults
    }
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: 'general', label: 'General', icon: Monitor },
    { id: 'map', label: 'Map Display', icon: Map },
    { id: 'modules', label: 'Modules', icon: Database },
    { id: 'data', label: 'Data Sources', icon: Globe2 },
    { id: 'about', label: 'About', icon: Info },
  ];

  const dataSources = [
    { name: 'NASA FIRMS', type: 'Satellite', status: 'active', icon: Satellite, desc: 'Wildfire hotspot detection from MODIS/VIIRS sensors' },
    { name: 'USGS Water Services', type: 'Gauge', status: 'active', icon: CloudRain, desc: 'Real-time river gauge readings for flood prediction' },
    { name: 'OpenWeatherMap', type: 'Weather API', status: 'active', icon: Globe2, desc: 'Current weather conditions and air quality data' },
    { name: 'AirNow API', type: 'Air Quality', status: 'active', icon: Droplets, desc: 'EPA air quality index and pollutant readings' },
  ];

  const modules = [
    { key: 'enableFloodModule' as const, name: 'Flood Forecast', icon: CloudRain, color: 'text-blue-600', desc: 'AI-powered flood prediction using USGS river data' },
    { key: 'enableWildfireModule' as const, name: 'Wildfire Detection', icon: Flame, color: 'text-orange-600', desc: 'Satellite-based fire monitoring via NASA FIRMS' },
    { key: 'enableMicroplasticModule' as const, name: 'Microplastic Mapper', icon: Droplets, color: 'text-cyan-600', desc: 'Water pollution risk assessment tool' },
    { key: 'enableHeatIslandModule' as const, name: 'Heat Island Predictor', icon: Thermometer, color: 'text-red-600', desc: 'Urban heat vulnerability analysis' },
    { key: 'enableEcoRouteModule' as const, name: 'EcoRoute Planner', icon: Navigation, color: 'text-green-600', desc: 'Emission-optimized route planning' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-3 rounded-xl shadow-lg">
            <SettingsIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-500">Configure your EnviroSentinel Pro experience</p>
          </div>
          {saved && (
            <div className="ml-auto flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium animate-fadeIn">
              <Check className="w-4 h-4" />
              <span>Saved</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              {sections.map((s) => {
                const Icon = s.icon;
                const active = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      active ? 'bg-emerald-50 text-emerald-800 border-l-3 border-emerald-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="text-sm font-medium">{s.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="lg:col-span-3">
            {activeSection === 'general' && (
              <SettingsPanel title="General Settings">
                <SettingRow label="Data Mode" description="Switch between real data and demo scenarios">
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-medium ${!isDemoMode ? 'text-emerald-700' : 'text-slate-400'}`}>
                      Real Data
                    </span>
                    <Toggle checked={isDemoMode} onChange={setDemoMode} />
                    <span className={`text-xs font-medium ${isDemoMode ? 'text-blue-700' : 'text-slate-400'}`}>
                      Demo Mode
                    </span>
                  </div>
                </SettingRow>
                {isDemoMode && (
                  <div className="py-3 px-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800 mb-2">
                      Demo mode uses simulated data for educational and presentation purposes.
                    </p>
                  </div>
                )}
                <SettingRow label="Tutorial" description="Restart the interactive tutorial walkthrough">
                  <button
                    onClick={restartTutorial}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    <Repeat className="w-4 h-4" />
                    <span>Restart Tutorial</span>
                  </button>
                </SettingRow>
                <SettingRow label="Measurement Units" description="Choose metric or imperial units across the platform">
                  <select
                    value={settings.units}
                    onChange={(e) => updateSetting('units', e.target.value as 'metric' | 'imperial')}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="metric">Metric (km, °C, kg)</option>
                    <option value="imperial">Imperial (mi, °F, lb)</option>
                  </select>
                </SettingRow>
                <SettingRow label="Data Refresh Interval" description="How often environmental data refreshes automatically">
                  <select
                    value={settings.refreshInterval}
                    onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value={15}>Every 15 seconds</option>
                    <option value={30}>Every 30 seconds</option>
                    <option value={60}>Every 1 minute</option>
                    <option value={300}>Every 5 minutes</option>
                  </select>
                </SettingRow>
                <SettingRow label="Show Wildfire Hotspots" description="Display satellite-detected fire hotspots on maps">
                  <Toggle checked={settings.showWildfireHotspots} onChange={(v) => updateSetting('showWildfireHotspots', v)} />
                </SettingRow>
                <SettingRow label="Show Alert Markers" description="Display active alert markers on the overview map">
                  <Toggle checked={settings.showAlertMarkers} onChange={(v) => updateSetting('showAlertMarkers', v)} />
                </SettingRow>
              </SettingsPanel>
            )}

            {activeSection === 'map' && (
              <SettingsPanel title="Map Display">
                <SettingRow label="Default Map Region" description="Initial map view when opening the dashboard">
                  <select
                    value={settings.mapCenter}
                    onChange={(e) => updateSetting('mapCenter', e.target.value as AppSettings['mapCenter'])}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="us">United States</option>
                    <option value="europe">Europe</option>
                    <option value="asia">Asia-Pacific</option>
                    <option value="auto">Auto-detect Location</option>
                  </select>
                </SettingRow>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Map Data:</strong> Map tiles are provided by OpenStreetMap contributors. Satellite fire data comes from NASA FIRMS updated every 15 minutes.
                  </p>
                </div>
              </SettingsPanel>
            )}

            {activeSection === 'modules' && (
              <SettingsPanel title="Environmental Modules">
                <p className="text-sm text-slate-500 mb-4">Enable or disable individual monitoring modules</p>
                <div className="space-y-3">
                  {modules.map((mod) => {
                    const Icon = mod.icon;
                    return (
                      <div key={mod.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${mod.color}`} />
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{mod.name}</div>
                            <div className="text-xs text-slate-500">{mod.desc}</div>
                          </div>
                        </div>
                        <Toggle checked={settings[mod.key]} onChange={(v) => updateSetting(mod.key, v)} />
                      </div>
                    );
                  })}
                </div>
              </SettingsPanel>
            )}

            {activeSection === 'data' && (
              <SettingsPanel title="Data Sources">
                <p className="text-sm text-slate-500 mb-4">Real-time connections to environmental data providers</p>
                <div className="space-y-3">
                  {dataSources.map((source) => {
                    const Icon = source.icon;
                    return (
                      <div key={source.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                            <Icon className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{source.name}</div>
                            <div className="text-xs text-slate-500">{source.desc}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded">{source.type}</span>
                          <div className="flex items-center space-x-1.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-semibold text-green-700">Active</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center space-x-2">
                    <Server className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">Supabase Database</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-green-700">Connected</span>
                  </div>
                </div>
              </SettingsPanel>
            )}

            {activeSection === 'about' && (
              <SettingsPanel title="About EnviroSentinel Pro">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                      <Globe2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">EnviroSentinel Pro</h3>
                      <p className="text-sm text-slate-600">Advanced Environmental Monitoring</p>
                      <p className="text-xs text-slate-400 mt-1">Version 1.0.0</p>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      EnviroSentinel Pro is a comprehensive environmental intelligence platform that monitors, predicts, and helps mitigate environmental threats across five critical domains: flood forecasting, wildfire detection, microplastic pollution mapping, urban heat island analysis, and eco-friendly route optimization.
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed mt-3">
                      Built for the <strong>EnviroCast GEO: Furthering the Future Hackathon</strong>, EnviroSentinel Pro demonstrates how cross-domain environmental data integration and AI-powered analysis can provide actionable insights for communities, researchers, and policymakers.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3">Technology Stack</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'React + TypeScript', 'Vite', 'Tailwind CSS', 'Supabase (PostgreSQL)',
                        'Leaflet.js', 'Recharts', 'NASA FIRMS API', 'USGS Water Services',
                        'OpenWeatherMap API', 'AirNow API',
                      ].map((tech) => (
                        <div key={tech} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <span className="text-xs font-medium text-slate-700">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3">Key Innovations</h4>
                    <ul className="space-y-2">
                      {[
                        'Environmental Health Index (EHI) — composite score aggregating multi-domain environmental data',
                        'Cross-domain correlation analysis linking wildfire activity to air quality degradation',
                        'AI-powered predictive models for flood levels, fire risk, and heat vulnerability',
                        'Microplastic concentration prediction using population and infrastructure factors',
                        'Carbon emission optimization comparing fastest vs. greenest route alternatives',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm text-slate-700">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="https://geo.envirocast.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>EnviroCast GEO Conference</span>
                  </a>
                </div>
              </SettingsPanel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-5">{title}</h2>
      {children}
    </div>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div className="flex-1 mr-4">
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        <div className="text-xs text-slate-500 mt-0.5">{description}</div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-emerald-600' : 'bg-slate-300'
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileMenu } from './components/MobileMenu';
import { Dashboard } from './components/Dashboard';
import { FloodForecast } from './components/FloodForecast';
import { WildfireDetection } from './components/WildfireDetection';
import { MicroplasticMapper } from './components/MicroplasticMapper';
import { HeatIslandPredictor } from './components/HeatIslandPredictor';
import { EcoRoute } from './components/EcoRoute';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import CommunityReports from './components/CommunityReports';
import ReportSubmission from './components/ReportSubmission';
import { alertService } from './services/alertService';
import { initializeDemoData } from './services/demoData';
import { Alert } from './types';

function App() {
  const [activeView, setActiveView] = useState('map');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await initializeDemoData();
    loadAlerts();
  };

  const loadAlerts = async () => {
    try {
      const data = await alertService.getActiveAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const floodAlerts = alerts.filter(a => a.type === 'flood').length;
  const wildfireAlerts = alerts.filter(a => a.type === 'wildfire').length;
  const pollutionAlerts = alerts.filter(a => a.type === 'pollution').length;
  const heatAlerts = alerts.filter(a => a.type === 'heat_wave').length;

  const renderView = () => {
    switch (activeView) {
      case 'map':
        return <Dashboard onViewChange={setActiveView} />;
      case 'floods':
        return <FloodForecast />;
      case 'wildfires':
        return <WildfireDetection />;
      case 'microplastic':
        return <MicroplasticMapper />;
      case 'heat-island':
        return <HeatIslandPredictor />;
      case 'eco-route':
        return <EcoRoute />;
      case 'community-reports':
        return <CommunityReports />;
      case 'submit-report':
        return <ReportSubmission onSuccess={() => setActiveView('community-reports')} />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onViewChange={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col">
      <Header
        activeAlerts={alerts.length}
        floodAlerts={floodAlerts}
        wildfireAlerts={wildfireAlerts}
        pollutionAlerts={pollutionAlerts}
        heatAlerts={heatAlerts}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <main className="flex-1 overflow-hidden">
          {renderView()}
        </main>

        <MobileMenu activeView={activeView} onViewChange={setActiveView} />
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileMenu } from './components/MobileMenu';
import { TutorialWelcome } from './components/TutorialWelcome';
import { TutorialOverlay } from './components/TutorialOverlay';
import { TutorialCompletion } from './components/TutorialCompletion';
import { LocationProvider } from './contexts/LocationContext';
import { FilterProvider } from './contexts/FilterContext';
import { ScenarioProvider } from './contexts/ScenarioContext';
import { DemoProvider } from './contexts/DemoContext';
import { TutorialProvider } from './contexts/TutorialContext';
import { alertService } from './services/alertService';
import { initializeDemoData } from './services/demoData';
import { Alert } from './types';

import DashboardPage from './pages/DashboardPage';
import FloodsPage from './pages/FloodsPage';
import WildfiresPage from './pages/WildfiresPage';
import HeatPage from './pages/HeatPage';
import MicroplasticsPage from './pages/MicroplasticsPage';
import EcoRoutePage from './pages/EcoRoutePage';
import CommunityPage from './pages/CommunityPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import DataSourcesPage from './pages/DataSourcesPage';
import ImpactPage from './pages/ImpactPage';
import RiskCorrelationsPage from './pages/RiskCorrelationsPage';

function App() {
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

  return (
    <Router>
      <LocationProvider>
        <FilterProvider>
          <ScenarioProvider>
            <DemoProvider>
              <TutorialProvider>
                <TutorialWelcome />
                <TutorialCompletion />
                <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col">
                  <Header
                    activeAlerts={alerts.length}
                    floodAlerts={floodAlerts}
                    wildfireAlerts={wildfireAlerts}
                    pollutionAlerts={pollutionAlerts}
                    heatAlerts={heatAlerts}
                  />

                  <div className="flex flex-1 overflow-hidden">
                    <Sidebar />

                    <main className="flex-1 overflow-hidden">
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/floods" element={<FloodsPage />} />
                        <Route path="/wildfires" element={<WildfiresPage />} />
                        <Route path="/heat" element={<HeatPage />} />
                        <Route path="/microplastics" element={<MicroplasticsPage />} />
                        <Route path="/ecoroute" element={<EcoRoutePage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/analytics" element={<DashboardPage />} />
                        <Route path="/risk-correlations" element={<RiskCorrelationsPage />} />
                        <Route path="/impact" element={<ImpactPage />} />
                        <Route path="/data-sources" element={<DataSourcesPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                      </Routes>
                    </main>

                    <MobileMenu />
                  </div>
                  <TutorialOverlay />
                </div>
              </TutorialProvider>
            </DemoProvider>
          </ScenarioProvider>
        </FilterProvider>
      </LocationProvider>
    </Router>
  );
}

export default App;

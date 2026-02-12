import { useTutorial } from '../contexts/TutorialContext';
import { MapPin, Flame, Droplets, Thermometer, BookOpen, X } from 'lucide-react';
import { useDemo } from '../contexts/DemoContext';

const scenarios = [
  {
    id: 'sacramento',
    name: 'Sacramento Floods',
    location: 'Sacramento, California',
    icon: Droplets,
    description: 'Experience flood forecasting during heavy rain season',
    risks: ['High flood risk', 'River overflow', 'Urban flooding'],
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'santa-rosa',
    name: 'Santa Rosa Wildfires',
    location: 'Santa Rosa, California',
    icon: Flame,
    description: 'Track wildfire detection and spread prediction',
    risks: ['Active wildfires', 'High fire danger', 'Smoke advisories'],
    color: 'from-orange-600 to-red-600'
  },
  {
    id: 'phoenix',
    name: 'Phoenix Heat Wave',
    location: 'Phoenix, Arizona',
    icon: Thermometer,
    description: 'Monitor extreme heat and urban heat islands',
    risks: ['Extreme heat', 'Heat advisories', 'Power stress'],
    color: 'from-amber-600 to-orange-600'
  }
];

export function TutorialWelcome() {
  const { isActive, startTutorial, skipTutorial, selectedScenario } = useTutorial();
  const { setScenario } = useDemo();

  const handleSelectScenario = (scenarioId: string) => {
    setScenario(scenarioId);
    startTutorial(scenarioId);
  };

  if (!isActive || selectedScenario) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-10 h-10" />
              <div>
                <h2 className="text-3xl font-bold">Welcome to EnviroSentinel Pro</h2>
                <p className="text-emerald-100 mt-1">Interactive Tutorial Mode</p>
              </div>
            </div>
            <button
              onClick={skipTutorial}
              className="text-white/80 hover:text-white transition-colors"
              title="Skip Tutorial"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/90 text-lg">
            Learn how EnviroSentinel Pro works by exploring a real-world scenario with demo data
          </p>
        </div>

        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose a Scenario to Explore</h3>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <button
                  key={scenario.id}
                  onClick={() => handleSelectScenario(scenario.id)}
                  className="text-left bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-emerald-500 hover:shadow-lg transition-all group"
                >
                  <div className={`bg-gradient-to-br ${scenario.color} rounded-lg p-4 inline-flex mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {scenario.name}
                  </h4>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {scenario.location}
                  </div>

                  <p className="text-gray-700 mb-4">
                    {scenario.description}
                  </p>

                  <div className="space-y-2">
                    {scenario.risks.map((risk) => (
                      <div
                        key={risk}
                        className="text-sm bg-red-50 text-red-700 px-3 py-1 rounded-full inline-block mr-2"
                      >
                        {risk}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 mb-2">What You'll Learn</h4>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>How to monitor floods, wildfires, heat waves, and microplastic pollution</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Understanding risk correlations and compound environmental threats</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Using community reports and real-time alerts</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Planning eco-friendly routes and tracking personal impact</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Exploring future climate scenarios (2030, 2050 projections)</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              All data in tutorial mode is simulated for educational purposes.
              After completion, you can switch to real data mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

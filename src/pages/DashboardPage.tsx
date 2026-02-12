import { Dashboard } from '../components/Dashboard';

export default function DashboardPage() {
  return (
    <div data-tutorial="dashboard-content" data-tutorial-page="page-content" className="h-full">
      <Dashboard onViewChange={() => {}} />
    </div>
  );
}

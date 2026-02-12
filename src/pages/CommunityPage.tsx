import { useState } from 'react';
import CommunityReports from '../components/CommunityReports';
import ReportSubmission from '../components/ReportSubmission';
import { Plus } from 'lucide-react';

export default function CommunityPage() {
  const [showSubmission, setShowSubmission] = useState(false);

  if (showSubmission) {
    return (
      <div className="h-full overflow-auto">
        <ReportSubmission onSuccess={() => setShowSubmission(false)} />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto relative" data-tutorial="page-content">
      <CommunityReports />
      <button
        onClick={() => setShowSubmission(true)}
        className="fixed bottom-8 right-8 bg-emerald-600 text-white rounded-full p-4 shadow-lg hover:bg-emerald-700 transition-colors z-10"
        aria-label="Submit Report"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

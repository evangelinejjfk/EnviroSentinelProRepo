import { AlertCircle, BookOpen } from 'lucide-react';
import { useTutorial } from '../contexts/TutorialContext';

interface DemoDataBadgeProps {
  type?: 'inline' | 'banner';
  message?: string;
}

export function DemoDataBadge({ type = 'inline', message }: DemoDataBadgeProps) {
  const { isActive: isTutorialActive } = useTutorial();
  if (type === 'banner') {
    const bgColor = isTutorialActive ? 'bg-blue-50' : 'bg-yellow-50';
    const borderColor = isTutorialActive ? 'border-blue-200' : 'border-yellow-200';
    const iconColor = isTutorialActive ? 'text-blue-600' : 'text-yellow-600';
    const titleColor = isTutorialActive ? 'text-blue-900' : 'text-yellow-900';
    const textColor = isTutorialActive ? 'text-blue-800' : 'text-yellow-800';
    const Icon = isTutorialActive ? BookOpen : AlertCircle;

    return (
      <div className={`${bgColor} border ${borderColor} rounded-lg p-3 flex items-start space-x-2`}>
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div>
          <div className={`font-semibold ${titleColor} text-sm`}>
            {isTutorialActive ? 'Tutorial Mode' : 'Demo Data'}
          </div>
          <div className={`text-xs ${textColor}`}>
            {isTutorialActive
              ? 'You are viewing demo data as part of the interactive tutorial.'
              : (message || 'This module is using simulated data for demonstration purposes. In production, this would connect to real data sources.')
            }
          </div>
        </div>
      </div>
    );
  }

  if (isTutorialActive) {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
        <BookOpen className="w-3 h-3" />
        <span>Tutorial Mode</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200">
      <AlertCircle className="w-3 h-3" />
      <span>Demo Data</span>
    </span>
  );
}

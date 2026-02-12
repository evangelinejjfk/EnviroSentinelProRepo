import React, { useState, useEffect } from 'react';
import { Users, Filter, ThumbsUp, MapPin, Clock, AlertCircle, CheckCircle, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { communityReportService, CommunityReport } from '../services/communityReportService';
import { formatDistanceToNow } from 'date-fns';

export default function CommunityReports() {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [upvotedReports, setUpvotedReports] = useState<Set<string>>(new Set());

  const userIdentifier = localStorage.getItem('user_identifier') ||
    `anon_${Math.random().toString(36).substring(2)}`;

  useEffect(() => {
    if (!localStorage.getItem('user_identifier')) {
      localStorage.setItem('user_identifier', userIdentifier);
    }
    loadReports();
  }, [selectedType, selectedStatus]);

  const loadReports = async () => {
    setIsLoading(true);
    const filters: any = {};

    if (selectedType !== 'all') {
      filters.type = selectedType;
    }

    if (selectedStatus !== 'all') {
      filters.status = selectedStatus;
    }

    const data = await communityReportService.getReports(filters);
    setReports(data);
    setIsLoading(false);
  };

  const handleUpvote = async (reportId: string) => {
    if (upvotedReports.has(reportId)) {
      return;
    }

    const success = await communityReportService.upvoteReport(reportId, userIdentifier);
    if (success) {
      setUpvotedReports(prev => new Set(prev).add(reportId));
      setReports(prev => prev.map(report =>
        report.id === reportId
          ? { ...report, upvotes: report.upvotes + 1 }
          : report
      ));
    }
  };

  const reportTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'air_quality', label: 'Air Quality' },
    { value: 'flooding', label: 'Flooding' },
    { value: 'wildfire', label: 'Wildfire' },
    { value: 'heat', label: 'Heat' },
    { value: 'pollution', label: 'Pollution' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'water_quality', label: 'Water Quality' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' }
  ];

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800 border-blue-200',
      moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[severity] || colors.moderate;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'verified') {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return <AlertCircle className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Community Reports</h1>
            <p className="text-sm text-gray-600">Citizen science observations from around the world</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={loadReports}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          <div className="ml-auto text-sm text-gray-600">
            {reports.length} report{reports.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Reports Found</h3>
          <p className="text-gray-500">Be the first to report environmental observations in this category!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(report.severity)}`}>
                        {report.severity.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {communityReportService.getReportTypeLabel(report.report_type)}
                      </span>
                      {getStatusIcon(report.status)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{report.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{report.description}</p>
                  </div>
                </div>

                {report.photo_url && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={report.photo_url}
                      alt="Report"
                      className="w-full max-h-96 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate max-w-xs">{report.location_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpvote(report.id)}
                    disabled={upvotedReports.has(report.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      upvotedReports.has(report.id)
                        ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{report.upvotes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

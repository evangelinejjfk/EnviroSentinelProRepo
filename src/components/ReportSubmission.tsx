import React, { useState, useEffect } from 'react';
import { Camera, MapPin, AlertTriangle, Loader2, CheckCircle2, X } from 'lucide-react';
import { communityReportService, NewReport } from '../services/communityReportService';

interface ReportSubmissionProps {
  onSuccess?: () => void;
  initialLocation?: { lat: number; lng: number };
}

export default function ReportSubmission({ onSuccess, initialLocation }: ReportSubmissionProps) {
  const [formData, setFormData] = useState<Partial<NewReport>>({
    report_type: 'air_quality',
    severity: 'moderate',
    latitude: initialLocation?.lat || 40.7128,
    longitude: initialLocation?.lng || -74.0060,
    location_name: '',
    title: '',
    description: ''
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    if (initialLocation) {
      setFormData(prev => ({
        ...prev,
        latitude: initialLocation.lat,
        longitude: initialLocation.lng
      }));
      reverseGeocode(initialLocation.lat, initialLocation.lng);
    }
  }, [initialLocation]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setFormData(prev => ({ ...prev, location_name: data.display_name }));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ ...prev, latitude, longitude }));
          reverseGeocode(latitude, longitude);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsGettingLocation(false);
          alert('Unable to get your location. Please enter it manually.');
        }
      );
    } else {
      setIsGettingLocation(false);
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location_name) {
      setErrorMessage('Please fill in all required fields');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const result = await communityReportService.submitReport(formData as NewReport);

    setIsSubmitting(false);

    if (result.success) {
      setSubmitStatus('success');
      setTimeout(() => {
        setFormData({
          report_type: 'air_quality',
          severity: 'moderate',
          latitude: initialLocation?.lat || 40.7128,
          longitude: initialLocation?.lng || -74.0060,
          location_name: '',
          title: '',
          description: ''
        });
        setPhotoPreview(null);
        setSubmitStatus('idle');
        onSuccess?.();
      }, 2000);
    } else {
      setSubmitStatus('error');
      setErrorMessage(result.error || 'Failed to submit report');
    }
  };

  const reportTypes = [
    { value: 'air_quality', label: 'Air Quality Issue' },
    { value: 'flooding', label: 'Flooding' },
    { value: 'wildfire', label: 'Wildfire/Smoke' },
    { value: 'heat', label: 'Extreme Heat' },
    { value: 'pollution', label: 'Pollution' },
    { value: 'wildlife', label: 'Wildlife/Ecosystem' },
    { value: 'water_quality', label: 'Water Quality' },
    { value: 'other', label: 'Other' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-blue-500' },
    { value: 'moderate', label: 'Moderate', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'critical', label: 'Critical', color: 'bg-red-500' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Report Environmental Observation</h2>
            <p className="text-sm text-gray-600">Help build a citizen science network</p>
          </div>
        </div>

        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Report submitted successfully!</span>
          </div>
        )}

        {submitStatus === 'error' && errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <X className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type *
            </label>
            <select
              value={formData.report_type}
              onChange={(e) => setFormData(prev => ({ ...prev, report_type: e.target.value as any }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity Level *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {severityLevels.map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, severity: level.value as any }))}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    formData.severity === level.value
                      ? `${level.color} text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief description of what you observed"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide details about what you observed, when you noticed it, and any other relevant information..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
              >
                {isGettingLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                Use Current Location
              </button>
            </div>
            <input
              type="text"
              value={formData.location_name}
              onChange={(e) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
              placeholder="Enter location or use current location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
            <div className="mt-2 text-xs text-gray-500">
              Coordinates: {formData.latitude?.toFixed(4)}, {formData.longitude?.toFixed(4)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo (Optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <Camera className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {formData.photo ? formData.photo.name : 'Choose Photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, photo: undefined }));
                    setPhotoPreview(null);
                  }}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            {photoPreview && (
              <div className="mt-4">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full max-w-md rounded-lg border border-gray-300"
                />
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">Maximum file size: 5MB</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Report...
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5" />
                Submit Report
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

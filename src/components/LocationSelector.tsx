import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, X, Loader } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';

export function LocationSelector() {
  const { location, setLocation, requestGeolocation, isLoading, error } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const timer = setTimeout(() => {
        searchLocations(searchQuery);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchLocations = async (query: string) => {
    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const selectLocation = (result: any) => {
    const city = result.address?.city || result.address?.town || result.address?.village || result.name;
    const state = result.address?.state || '';
    const country = result.address?.country || '';

    setLocation({
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      city,
      state,
      country,
      displayName: result.display_name.split(',').slice(0, 2).join(',')
    });

    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleGeolocate = async () => {
    await requestGeolocation();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <MapPin className="w-5 h-5 text-emerald-600" />
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-900">
            {location?.displayName || 'Select Location'}
          </div>
          {location && (
            <div className="text-xs text-gray-500">
              {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 w-96 bg-white rounded-xl shadow-xl z-50 border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a location..."
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={handleGeolocate}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5" />
                )}
                <span>Use My Location</span>
              </button>

              {error && (
                <div className="mt-2 text-sm text-red-600 text-center">
                  {error}
                </div>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {searching && (
                <div className="p-4 text-center text-gray-500">
                  <Loader className="w-6 h-6 animate-spin mx-auto" />
                </div>
              )}

              {!searching && searchResults.length > 0 && (
                <div className="divide-y divide-gray-100">
                  {searchResults.map((result) => (
                    <button
                      key={result.place_id}
                      onClick={() => selectLocation(result)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-semibold text-gray-900">
                        {result.display_name.split(',').slice(0, 2).join(',')}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {result.display_name.split(',').slice(2).join(',')}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!searching && searchQuery.length > 2 && searchResults.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No results found
                </div>
              )}

              {!searching && searchQuery.length === 0 && location && (
                <div className="p-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Current Location</div>
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                    <div className="font-semibold text-emerald-900">{location.displayName}</div>
                    <div className="text-sm text-emerald-700 mt-1">
                      {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

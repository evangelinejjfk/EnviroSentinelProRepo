import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  displayName: string;
}

interface LocationContextType {
  location: Location | null;
  setLocation: (location: Location) => void;
  isLoading: boolean;
  error: string | null;
  requestGeolocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const DEFAULT_LOCATION: Location = {
  latitude: 38.5816,
  longitude: -121.4944,
  city: 'Sacramento',
  state: 'CA',
  country: 'USA',
  displayName: 'Sacramento, CA'
};

interface LocationProviderProps {
  children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [location, setLocationState] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      try {
        setLocationState(JSON.parse(savedLocation));
      } catch {
        setLocationState(DEFAULT_LOCATION);
      }
    } else {
      setLocationState(DEFAULT_LOCATION);
    }
  }, []);

  const setLocation = (newLocation: Location) => {
    setLocationState(newLocation);
    localStorage.setItem('selectedLocation', JSON.stringify(newLocation));
    setError(null);
  };

  const reverseGeocode = async (lat: number, lon: number): Promise<Location> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
      );
      const data = await response.json();

      const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown';
      const state = data.address.state || '';
      const country = data.address.country || '';

      return {
        latitude: lat,
        longitude: lon,
        city,
        state,
        country,
        displayName: `${city}${state ? ', ' + state : ''}`
      };
    } catch {
      return {
        latitude: lat,
        longitude: lon,
        city: 'Unknown',
        state: '',
        country: '',
        displayName: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
      };
    }
  };

  const requestGeolocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 300000,
          enableHighAccuracy: true
        });
      });

      const { latitude, longitude } = position.coords;
      const locationData = await reverseGeocode(latitude, longitude);
      setLocation(locationData);
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable');
            break;
          case err.TIMEOUT:
            setError('Location request timed out');
            break;
        }
      } else {
        setError('Failed to get location');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, isLoading, error, requestGeolocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

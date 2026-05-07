import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Locating...');
  const [error, setError] = useState(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setAddress('Location not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        
        try {
          // Reverse geocoding using Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      },
      (err) => {
        setError(err.message);
        setAddress('Location permission denied');
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, address, error, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

import { useState, useEffect } from 'react';

export function useLocationData() {
  const [countries, setCountries] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  return {
    countries,
    provinces,
    cities,
    loadProvinces: () => {},
    loadCities: () => {},
  };
}

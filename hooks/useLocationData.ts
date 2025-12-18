import { useState } from 'react';

export function useLocationData() {
  const [countries] = useState<string[]>([]);
  const [regions] = useState<string[]>([]);
  const [loadingCountries] = useState(false);
  const [loadingRegions] = useState(false);

  return {
    countries,
    regions,
    loadingCountries,
    loadingRegions,
    fetchRegions: () => {},
    getRegionLabel: (country: string) => 'Province/State',
    hasRegions: (country: string) => false,
  };
}

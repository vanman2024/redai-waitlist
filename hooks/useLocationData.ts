/**
 * Hook for fetching location data (countries and regions)
 * Used across the platform for consistent location dropdowns
 */

import { useState, useEffect, useCallback } from 'react';

export interface Country {
  code: string;
  code_alpha3: string;
  name_en: string;
  name_fr: string;
  region_label: string;
  phone_code: string;
  currency_code: string;
  sort_order: number;
  is_active: boolean;
}

export interface Region {
  id: string;
  country_code: string;
  code: string;
  name_en: string;
  name_fr: string;
  type: string;
  sort_order: number;
  is_active: boolean;
}

// Countries with region data in database
const COUNTRIES_WITH_REGIONS = ['CA', 'US', 'GB', 'AU', 'NZ', 'IE'];

interface UseLocationDataReturn {
  countries: Country[];
  regions: Region[];
  loadingCountries: boolean;
  loadingRegions: boolean;
  error: string | null;
  fetchRegions: (countryCode: string) => Promise<void>;
  getRegionLabel: (countryCode: string) => string;
  hasRegions: (countryCode: string) => boolean;
}

export function useLocationData(): UseLocationDataReturn {
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch countries on mount
  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoadingCountries(true);
        const res = await fetch('/api/countries');
        if (!res.ok) throw new Error('Failed to fetch countries');
        const data = await res.json();
        setCountries(data.countries || []);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries');
      } finally {
        setLoadingCountries(false);
      }
    }

    fetchCountries();
  }, []);

  // Fetch regions for a specific country
  const fetchRegions = useCallback(async (countryCode: string) => {
    if (!countryCode) {
      setRegions([]);
      return;
    }
    try {
      setLoadingRegions(true);
      const res = await fetch(`/api/regions?country_code=${countryCode}`);
      if (!res.ok) throw new Error('Failed to fetch regions');
      const data = await res.json();
      setRegions(data.regions || []);
    } catch (err) {
      console.error('Error fetching regions:', err);
      setError('Failed to load regions');
      setRegions([]);
    } finally {
      setLoadingRegions(false);
    }
  }, []);

  // Get the label for regions based on country
  const getRegionLabel = useCallback((countryCode: string): string => {
    const country = countries.find(c => c.code === countryCode);
    return country?.region_label || 'Province/State';
  }, [countries]);

  // Check if a country has region data in our database
  const hasRegions = useCallback((countryCode: string): boolean => {
    return COUNTRIES_WITH_REGIONS.includes(countryCode);
  }, []);

  return {
    countries,
    regions,
    loadingCountries,
    loadingRegions,
    error,
    fetchRegions,
    getRegionLabel,
    hasRegions,
  };
}

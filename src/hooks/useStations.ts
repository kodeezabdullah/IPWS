// Custom hook for managing monitoring stations data

import { useState, useEffect } from 'react';
import type { Station, StationTimeSeries } from '../types/station';

interface UseStationsResult {
  stations: Station[];
  timeSeries: Record<string, StationTimeSeries>;
  loading: boolean;
  error: Error | null;
  refreshStations: () => void;
}

/**
 * Hook to fetch and manage monitoring stations data
 */
export function useStations(refreshInterval?: number): UseStationsResult {
  const [stations, setStations] = useState<Station[]>([]);
  const [timeSeries] = useState<Record<string, StationTimeSeries>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStations = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/stations');
      // const data = await response.json();
      
      // Placeholder - use mock data
      const data: Station[] = [];
      
      setStations(data);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  const refreshStations = () => {
    setLoading(true);
    fetchStations();
  };

  useEffect(() => {
    fetchStations();

    if (refreshInterval) {
      const interval = setInterval(fetchStations, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return {
    stations,
    timeSeries,
    loading,
    error,
    refreshStations,
  };
}


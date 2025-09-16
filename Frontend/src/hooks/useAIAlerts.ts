import { useState, useEffect, useCallback } from 'react';

export interface AIAlert {
  id: string;
  pubDate: string;
  riskPercentage: number;
  titleName: string;
  timestamp: string;
  category: 'critical' | 'warning' | 'info' | 'success';
  severity: number;
  resolved: boolean;
}

interface UseAIAlertsReturn {
  alerts: AIAlert[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const API_BASE_URL = 'http://localhost:5000';

export const useAIAlerts = (intervalMs: number = 8000): UseAIAlertsReturn => {
  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/ai-alerts`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAlerts(data.alerts || []);
      } else {
        throw new Error(data.error || 'Failed to fetch AI alerts');
      }
    } catch (err) {
      console.error('Error fetching AI alerts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch immediately on mount
    fetchAlerts();

    // Set up interval for periodic fetching
    const interval = setInterval(fetchAlerts, intervalMs);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [fetchAlerts, intervalMs]);

  return {
    alerts,
    loading,
    error,
    refetch: fetchAlerts,
  };
};

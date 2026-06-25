import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { fetchDashboardSummary } from '../api/dashboard';
import type { DashboardSummary } from '../types/dashboard';

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardSummary()
      .then(setSummary)
      .catch(() => setError('Não foi possível carregar o dashboard'));

    const socket = io('http://localhost:3000/dashboard', {
      transports: ['websocket'],
    });

    socket.on('dashboard.summary', (data: DashboardSummary) => {
      setSummary(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { summary, error };
}
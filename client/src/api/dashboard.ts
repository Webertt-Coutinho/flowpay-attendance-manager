import type { DashboardSummary } from '../types/dashboard';

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch('/api/dashboard/summary');
  if (!res.ok) throw new Error('Failed to load dashboard');
  return res.json();
}
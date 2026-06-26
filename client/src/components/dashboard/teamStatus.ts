import type { TeamSummary } from '../../types/dashboard';

export type TeamStatus = 'overloaded' | 'queued' | 'available' | 'full';

export function getTeamStatus(data: TeamSummary): TeamStatus {
  const hasFreeCapacity = data.agents.some((a) => a.load < a.maxLoad);

  if (data.queued > 0 && !hasFreeCapacity) return 'overloaded';
  if (data.queued > 0) return 'queued';
  if (hasFreeCapacity) return 'available';
  return 'full';
}

const STATUS_STYLES: Record<
  TeamStatus,
  { badge: string; emoji: string; label: string }
> = {
  overloaded: {
    emoji: '🔴',
    badge: 'bg-red-500/10 text-red-300 ring-1 ring-red-500/25',
    label: 'Saturado',
  },
  queued: {
    emoji: '🟡',
    badge: 'bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/25',
    label: 'Atenção',
  },
  available: {
    emoji: '🟢',
    badge: 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/25',
    label: 'Livre',
  },
  full: {
    emoji: '🔴',
    badge: 'bg-red-500/10 text-red-300/90 ring-1 ring-red-500/20',
    label: 'Saturado',
  },
};

export function getTeamStatusStyle(status: TeamStatus) {
  return STATUS_STYLES[status];
}

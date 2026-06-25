import { useDashboard } from '../../hooks/useDashboard';
import type { Team } from '../../types/dashboard';
import { StatCard } from './StatCard';
import { TeamCard } from './TeamCard';

const TEAM_LABELS: Record<Team, string> = {
  CARTOES: 'Cartões',
  EMPRESTIMOS: 'Empréstimos',
  OUTROS: 'Outros Assuntos',
};

export function Dashboard() {
  const { summary, error } = useDashboard();

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!summary) {
    return <div className="p-6">Carregando dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">FlowPay Dashboard</h1>
        <p className="text-slate-400">Monitoramento em tempo real</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Na fila" value={summary.totalQueued} />
        <StatCard label="Ativos" value={summary.totalActive} />
        <StatCard label="Concluídos" value={summary.totalCompleted} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {(Object.keys(TEAM_LABELS) as Team[]).map((team) => (
          <TeamCard
            key={team}
            title={TEAM_LABELS[team]}
            data={summary.queuesByTeam[team]}
          />
        ))}
      </section>
    </div>
  );
}

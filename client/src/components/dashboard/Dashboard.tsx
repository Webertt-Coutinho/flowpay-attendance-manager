import { useDashboard } from '../../hooks/useDashboard';
import type { Team } from '../../types/dashboard';
import { StatCard } from './StatCard';
import { TeamCard } from './TeamCard';

const TEAM_LABELS: Record<Team, string> = {
  CARTOES: 'Cartões',
  EMPRESTIMOS: 'Empréstimos',
  OUTROS: 'Outros Assuntos',
};

function LiveIndicator() {
  return (
    <div className="flex items-center gap-2.5 text-sm text-zinc-500">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      Ao vivo
    </div>
  );
}

export function Dashboard() {
  const { summary, error } = useDashboard();

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
        <p className="text-base text-red-400">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
        <div className="flex items-center gap-3 text-base text-zinc-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-400" />
          Carregando dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-zinc-950 font-[Inter,system-ui,sans-serif] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.08),transparent)]" />

      <div className="relative mx-auto flex h-full w-full max-w-[90rem] flex-col px-8 py-6">
        <header className="mb-5 flex shrink-0 items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">FlowPay</h1>
            <p className="mt-1 text-base text-zinc-500">Monitoramento em tempo real</p>
          </div>
          <LiveIndicator />
        </header>

        <section className="mb-5 shrink-0 overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-b from-zinc-900/60 to-zinc-900/25 shadow-sm shadow-black/25 backdrop-blur-sm">
          <div className="flex">
            <StatCard label="Na fila" value={summary.totalQueued} accent />
            <div className="w-px bg-white/[0.06]" />
            <StatCard label="Ativos" value={summary.totalActive} />
            <div className="w-px bg-white/[0.06]" />
            <StatCard label="Concluídos" value={summary.totalCompleted} />
          </div>
        </section>

        <section className="min-h-0 flex-1 overflow-hidden rounded-xl border border-white/[0.07] bg-zinc-900/20 shadow-sm shadow-black/25">
          <div className="grid h-full grid-cols-1 divide-y divide-white/[0.05] xl:grid-cols-3 xl:divide-x xl:divide-y-0">
            {(Object.keys(TEAM_LABELS) as Team[]).map((team) => (
              <TeamCard
                key={team}
                title={TEAM_LABELS[team]}
                data={summary.queuesByTeam[team]}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

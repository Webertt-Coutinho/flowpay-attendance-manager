import type { TeamSummary } from '../../types/dashboard';
import { AgentLoadList } from './AgentLoadList';
import { getTeamStatus, getTeamStatusStyle } from '../../utils/teamStatus';

type TeamCardProps = {
  title: string;
  data: TeamSummary;
};

type TeamMetricProps = {
  label: string;
  value: number;
  highlight?: boolean;
};

function TeamMetric({ label, value, highlight }: TeamMetricProps) {
  return (
    <div className="rounded-lg bg-white/[0.03] px-3 py-2.5 ring-1 ring-white/[0.05]">
      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-1 text-xl font-semibold tabular-nums leading-none ${
          highlight ? 'text-amber-300' : 'text-zinc-100'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function formatWaitTime(createdAt: string) {
  const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000);
  if (minutes < 1) return '<1 min';
  return `${minutes} min`;
}

export function TeamCard({ title, data }: TeamCardProps) {
  const status = getTeamStatus(data);
  const { badge, emoji, label } = getTeamStatusStyle(status);

  return (
    <article className="flex h-full min-h-0 flex-col bg-zinc-950/80 px-6 py-5">
      <header className="mb-5 shrink-0 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="truncate text-xl font-semibold tracking-tight text-zinc-50">
            {title}
          </h2>
          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${badge}`}
            title={label}
          >
            <span className="text-[11px] leading-none">{emoji}</span>
            {label}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <TeamMetric label="Fila" value={data.queued} highlight={data.queued > 0} />
          <TeamMetric label="Ativos" value={data.active} />
          <TeamMetric label="Conc." value={data.completed} />
          <TeamMetric label="Online" value={data.agentsOnline} />
        </div>
      </header>

      <section className="mb-5 min-h-0 flex-[3] overflow-y-auto scrollbar-thin">
        <AgentLoadList agents={data.agents} />
      </section>

      <section className="flex min-h-0 flex-[2] flex-col border-t border-white/[0.06] pt-4">
        <p className="mb-3 shrink-0 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          Fila
        </p>
        {data.waiting.length === 0 ? (
          <p className="text-sm text-zinc-600">Nenhum ticket aguardando</p>
        ) : (
          <ul className="min-h-0 flex-1 divide-y divide-white/[0.05] overflow-y-auto scrollbar-thin">
            {data.waiting.map((ticket) => (
              <li
                key={ticket.id}
                className="px-1 py-2.5 transition-colors first:pt-0 hover:bg-white/[0.025]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="shrink-0 text-sm font-medium tabular-nums text-zinc-400">
                    #{ticket.queuePosition ?? ticket.id.slice(-4)}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-zinc-600">
                    {formatWaitTime(ticket.createdAt)}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-zinc-300">{ticket.subject}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}

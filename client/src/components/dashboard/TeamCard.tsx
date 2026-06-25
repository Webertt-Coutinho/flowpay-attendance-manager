import type { TeamSummary } from '../../types/dashboard';
import { AgentLoadList } from './AgentLoadList';
import { MiniStat } from './MiniStat';

type TeamCardProps = {
  title: string;
  data: TeamSummary;
};

export function TeamCard({ title, data }: TeamCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <MiniStat label="Fila" value={data.queued} />
        <MiniStat label="Ativos" value={data.active} />
        <MiniStat label="Concluídos" value={data.completed} />
        <MiniStat label="Atendentes online" value={data.agentsOnline} />
      </div>

      <h3 className="text-sm font-medium text-slate-400 mb-2">Carga por atendente</h3>
      <div className="mb-4">
        <AgentLoadList agents={data.agents} />
      </div>

      <h3 className="text-sm font-medium text-slate-400 mb-2">Aguardando</h3>
      <ul className="space-y-2">
        {data.waiting.length === 0 ? (
          <li className="text-sm text-slate-500">Nenhum ticket na fila</li>
        ) : (
          data.waiting.map((ticket) => (
            <li
              key={ticket.id}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm"
            >
              <span className="font-medium">#{ticket.queuePosition}</span>{' '}
              {ticket.subject}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

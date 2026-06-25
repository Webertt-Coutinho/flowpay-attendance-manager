import type { AgentLoad } from '../../types/dashboard';

function agentStatus(load: number, maxLoad: number): {
  label: string;
  badgeClass: string;
} {
  if (load === 0) {
    return { label: 'Ocioso', badgeClass: 'bg-emerald-500/15 text-emerald-400' };
  }
  if (load >= maxLoad) {
    return { label: 'Saturado', badgeClass: 'bg-red-500/15 text-red-400' };
  }
  return { label: 'Disponível', badgeClass: 'bg-amber-500/15 text-amber-400' };
}

type AgentLoadListProps = {
  agents: AgentLoad[];
};

export function AgentLoadList({ agents }: AgentLoadListProps) {
  if (agents.length === 0) {
    return <p className="text-sm text-slate-500">Nenhum atendente online</p>;
  }

  return (
    <ul className="space-y-2">
      {agents.map((agent) => {
        const status = agentStatus(agent.load, agent.maxLoad);

        return (
          <li
            key={agent.id}
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm flex items-center justify-between gap-3"
          >
            <span className="font-medium">{agent.name}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-slate-300 tabular-nums">
                {agent.load}/{agent.maxLoad}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.badgeClass}`}
              >
                {status.label}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

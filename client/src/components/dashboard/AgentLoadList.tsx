import type { AgentLoad } from '../../types/dashboard';

type AgentLoadListProps = {
  agents: AgentLoad[];
};

function LoadBar({ load, maxLoad }: { load: number; maxLoad: number }) {
  const fillClass =
    load >= maxLoad
      ? 'bg-red-400/90'
      : load > 0
        ? 'bg-amber-400/85'
        : 'bg-emerald-400/85';

  return (
    <div className="flex h-3 gap-1">
      {Array.from({ length: maxLoad }, (_, i) => (
        <div
          key={i}
          className={`h-full flex-1 rounded-sm transition-colors ${
            i < load ? fillClass : 'bg-zinc-800/80'
          }`}
        />
      ))}
    </div>
  );
}

function StatusDot({ load, maxLoad }: { load: number; maxLoad: number }) {
  const color =
    load >= maxLoad ? 'bg-red-400' : load > 0 ? 'bg-amber-400' : 'bg-emerald-400';

  return <span className={`h-2 w-2 shrink-0 rounded-full ${color}`} />;
}

function firstName(name: string) {
  return name.split(' ')[0] ?? name;
}

export function AgentLoadList({ agents }: AgentLoadListProps) {
  if (agents.length === 0) {
    return <p className="text-sm text-zinc-600">Nenhum atendente online</p>;
  }

  return (
    <ul className="space-y-1.5">
      {agents.map((agent) => (
        <li
          key={agent.id}
          className="grid grid-cols-[5.5rem_1fr_2.75rem_0.5rem] items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
          title={agent.name}
        >
          <span className="truncate text-sm font-medium text-zinc-100">
            {firstName(agent.name)}
          </span>
          <LoadBar load={agent.load} maxLoad={agent.maxLoad} />
          <span className="text-right text-sm tabular-nums text-zinc-500">
            {agent.load}/{agent.maxLoad}
          </span>
          <StatusDot load={agent.load} maxLoad={agent.maxLoad} />
        </li>
      ))}
    </ul>
  );
}

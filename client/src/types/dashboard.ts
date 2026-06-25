export type Team = 'CARTOES' | 'EMPRESTIMOS' | 'OUTROS';

export type WaitingTicket = {
  id: string;
  subject: string;
  queuePosition: number | null;
  createdAt: string;
};

export type AgentLoad = {
  id: string;
  name: string;
  load: number;
  maxLoad: number;
};

export type AssignedTicket = {
  id: string;
  subject: string;
  agentId: string | null;
  agentName: string | null;
  createdAt: string;
};

export type TeamSummary = {
  queued: number;
  active: number;
  completed: number;
  agentsOnline: number;
  agents: AgentLoad[];
  waiting: WaitingTicket[];
  assigned: AssignedTicket[];
};

export type DashboardSummary = {
  totalQueued: number;
  totalActive: number;
  totalCompleted: number;
  queuesByTeam: Record<Team, TeamSummary>;
};
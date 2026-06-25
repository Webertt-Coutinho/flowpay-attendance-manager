import { Injectable } from "@nestjs/common";
import { AgentsRepository } from "./agents.repository";
import { TicketStatus } from "src/domain/ticket-status.enum";
import { Ticket } from "src/domain/ticket.entity";
import { Team } from "src/domain/team.enum";
import { Agent } from "src/domain/agent.entity";

const MAX_ACTIVE_TICKETS = 3;

export type AgentLoadSummary = {
  id: string;
  name: string;
  load: number;
  maxLoad: number;
};

@Injectable()
export class AgentsService {
  constructor(private readonly agentsRepository: AgentsRepository) {}

  private countActiveTickets(agentId: string, tickets: Ticket[]): number {
    return tickets.filter(
      (t) =>
        t.agentId === agentId &&
        t.status === TicketStatus.ASSIGNED,
    ).length;
  }

  getTeamAgentLoads(team: Team, tickets: Ticket[]): AgentLoadSummary[] {
    return this.agentsRepository.findByTeam(team).map((agent) => ({
      id: agent.id,
      name: agent.name,
      load: this.countActiveTickets(agent.id, tickets),
      maxLoad: MAX_ACTIVE_TICKETS,
    }));
  }

  selectBestAvailableAgent(team: Team, tickets: Ticket[]): Agent | null {
    const agents = this.agentsRepository.findByTeam(team);

    const available = agents
      .map((agent) => ({
        agent,
        load: this.countActiveTickets(agent.id, tickets),
      }))
      .filter(({ load }) => load < MAX_ACTIVE_TICKETS)
      .sort((a, b) => a.load - b.load);

    return available[0]?.agent ?? null;
  }
}
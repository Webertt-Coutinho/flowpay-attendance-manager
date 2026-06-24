import { Injectable } from "@nestjs/common";
import { AgentsRepository } from "./agents.repository";
import { TicketStatus } from "src/domain/ticket-status.enum";
import { Ticket } from "src/domain/ticket.entity";
import { Team } from "src/domain/team.enum";
import { Agent } from "src/domain/agent.entity";

const MAX_ACTIVE_TICKETS = 3;

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
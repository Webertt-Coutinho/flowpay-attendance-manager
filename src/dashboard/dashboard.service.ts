import { Injectable } from "@nestjs/common";
import { AgentsRepository } from "src/agents/agents.repository";
import { AgentsService } from "src/agents/agents.service";
import { Team } from "src/domain/team.enum";
import { TicketStatus } from "src/domain/ticket-status.enum";
import { Ticket } from "src/domain/ticket.entity";
import { TicketsRepository } from "src/tickets/tickets.repository";

type TeamQueueSummary = {
    queued: number;
    active: number;
    completed: number;
    agentsOnline: number;
    agents: Array<{
      id: string;
      name: string;
      load: number;
      maxLoad: number;
    }>;
    waiting: Array<{
      id: string;
      subject: string;
      queuePosition: number | null;
      createdAt: Date;
    }>;
    assigned: Array<{
      id: string;
      subject: string;
      agentId: string | null;
      agentName: string | null;
      createdAt: Date;
    }>;
};

@Injectable()
export class DashboardService {
    constructor(
      private readonly ticketsRepo: TicketsRepository,
      private readonly agentsService: AgentsService,
      private readonly agentsRepo: AgentsRepository,
    ) {}

    private summarizeTeam(tickets: Ticket[], team: Team): TeamQueueSummary {
        const teamTickets = tickets.filter((t) => t.team === team);
        const agents = this.agentsService.getTeamAgentLoads(team, tickets);
        const waiting = teamTickets
          .filter((t) => t.status === TicketStatus.QUEUED)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .map(({ id, subject, queuePosition, createdAt }) => ({
            id,
            subject,
            queuePosition,
            createdAt,
          }));
        const assigned = teamTickets
          .filter((t) => t.status === TicketStatus.ASSIGNED)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .map(({ id, subject, agentId, createdAt }) => ({
            id,
            subject,
            agentId,
            agentName: agentId
              ? (this.agentsRepo.findById(agentId)?.name ?? null)
              : null,
            createdAt,
          }));
        return {
          queued: waiting.length,
          active: assigned.length,
          completed: teamTickets.filter((t) => t.status === TicketStatus.COMPLETED)
            .length,
          agentsOnline: agents.length,
          agents,
          waiting,
          assigned,
        };
    }
    
    private buildQueuesByTeam(tickets: Ticket[]) {
        return Object.values(Team).reduce(
          (acc, team) => {
            acc[team] = this.summarizeTeam(tickets, team);
            return acc;
          },
          {} as Record<Team, TeamQueueSummary>,
        );
    }
    
    getSummary() {
        const tickets = this.ticketsRepo.findAll();

        const totalQueued = tickets.filter(ticket => ticket.status === TicketStatus.QUEUED).length;
        const totalActive = tickets.filter(ticket => ticket.status === TicketStatus.ASSIGNED).length;
        const totalCompleted = tickets.filter(ticket => ticket.status === TicketStatus.COMPLETED).length;

        const queuesByTeam = this.buildQueuesByTeam(tickets);

        return {
            totalQueued,
            totalActive,
            totalCompleted,
            queuesByTeam,
        };
    }
}
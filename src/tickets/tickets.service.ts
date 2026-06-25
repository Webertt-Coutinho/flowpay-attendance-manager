import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { SubjectRouterService } from '../routing/subject-router.service';
  import { AgentsService } from '../agents/agents.service';
  import { TicketsRepository } from './tickets.repository';
  import { Ticket } from '../domain/ticket.entity';
  import { TicketStatus } from '../domain/ticket-status.enum';
  import { Team } from '../domain/team.enum';
  import { EventsService } from 'src/events/events.service';
  
  @Injectable()
  export class TicketsService {
    constructor(
      private readonly ticketsRepo: TicketsRepository,
      private readonly router: SubjectRouterService,
      private readonly agentsService: AgentsService,
      private readonly eventsService: EventsService,
    ) {}
  
    create(subject: string): Ticket {
      const team = this.router.route(subject);
      let ticket = this.ticketsRepo.createBase(subject, team);
  
      const agent = this.agentsService.selectBestAvailableAgent(
        team,
        this.ticketsRepo.findAll(),
      );
  
      if (agent) {
        ticket = {
          ...ticket,
          status: TicketStatus.ASSIGNED,
          agentId: agent.id,
        };
      } else {
        ticket = this.enqueue(ticket);
      }
  
      const saved = this.ticketsRepo.save(ticket);
      this.eventsService.emit({ type: 'ticket.created', payload: { ticketId: saved.id } });
      return saved;
    }
  
    complete(ticketId: string): Ticket {
      const ticket = this.ticketsRepo.findById(ticketId);
      if (!ticket) throw new NotFoundException('Ticket not found');
      if (ticket.status === TicketStatus.COMPLETED) {
        throw new BadRequestException('Ticket already completed');
      }
    
      const wasAssigned = ticket.status === TicketStatus.ASSIGNED;
    
      const completed = this.ticketsRepo.save({
        ...ticket,
        status: TicketStatus.COMPLETED,
        agentId: null,
        queuePosition: null,
      });
    
      if (wasAssigned) {
        this.assignNextFromQueue(ticket.team);
      } else {
        this.reindexQueue(ticket.team);
      }
    
      this.eventsService.emit({ type: 'ticket.completed', payload: { ticketId } });
      return completed;
    }
  
    private enqueue(ticket: Ticket): Ticket {
      const queued = this.getQueuedByTeam(ticket.team);
      return {
        ...ticket,
        status: TicketStatus.QUEUED,
        queuePosition: queued.length + 1,
      };
    }
  
    private assignNextFromQueue(team: Team): void {
      const agent = this.agentsService.selectBestAvailableAgent(
        team,
        this.ticketsRepo.findAll(),
      );
      if (!agent) return;
  
      const next = this.getQueuedByTeam(team)[0];
      if (!next) return;
  
      this.ticketsRepo.save({
        ...next,
        status: TicketStatus.ASSIGNED,
        agentId: agent.id,
        queuePosition: null,
      });
  
      this.reindexQueue(team);
    }
  
    private getQueuedByTeam(team: Team): Ticket[] {
      return this.ticketsRepo
        .findAll()
        .filter((t) => t.team === team && t.status === TicketStatus.QUEUED)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
  
    private reindexQueue(team: Team): void {
      this.getQueuedByTeam(team).forEach((t, index) => {
        this.ticketsRepo.save({ ...t, queuePosition: index + 1 });
      });
    }
  }
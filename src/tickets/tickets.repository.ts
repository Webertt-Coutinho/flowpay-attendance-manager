import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { Team } from "src/domain/team.enum";
import { TicketStatus } from "src/domain/ticket-status.enum";
import { Ticket } from "src/domain/ticket.entity";

@Injectable()
export class TicketsRepository {
    private readonly tickets: Ticket[] = [];

    findAll(): Ticket[] {
        return [...this.tickets];
    }

    findById(id: string): Ticket | undefined {
        return this.tickets.find(ticket => ticket.id === id);
    }

    save(ticket: Ticket): Ticket {
        const index = this.tickets.findIndex(t => t.id === ticket.id);

        if (index >= 0) {
            this.tickets[index] = ticket;
        } else {
            this.tickets.push(ticket);
        }

        return ticket;
    }

    createBase(subject: string, team: Team): Ticket {
        return {
          id: randomUUID(),
          subject,
          team,
          status: TicketStatus.QUEUED,
          agentId: null,
          createdAt: new Date(),
          queuePosition: null,
        };
    }
}
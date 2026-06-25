import { Team } from 'src/domain/team.enum';
import { TicketStatus } from 'src/domain/ticket-status.enum';
import { Ticket } from 'src/domain/ticket.entity';

export class TicketResponseDto {
  id: string;
  subject: string;
  team: Team;
  status: TicketStatus;
  agentId: string | null;
  createdAt: Date;
  queuePosition: number | null;

  static from(ticket: Ticket): TicketResponseDto {
    return { ...ticket };
  }
}
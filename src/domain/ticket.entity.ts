import { Team } from "./team.enum";
import { TicketStatus } from "./ticket-status.enum";

export interface Ticket {
    id: string;
    subject: string;
    team: Team;
    status: TicketStatus;
    agentId: string | null;
    createdAt: Date;
    queuePosition: number | null;
}
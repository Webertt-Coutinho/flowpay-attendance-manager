import { Team } from "./team.enum";

export interface Agent {
    id: string;
    name: string;
    team: Team;
    activeTickets: number;
}
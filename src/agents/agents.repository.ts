import { Injectable } from "@nestjs/common";
import { Team } from "src/domain/team.enum";
import { Agent } from "src/domain/agent.entity";

@Injectable()
export class AgentsRepository {
    private readonly agents: Agent[] = [
        { id: 'agent-1', name: 'Ana', team: Team.CARDS, activeTickets: 0 },
        { id: 'agent-2', name: 'Bruno', team: Team.CARDS, activeTickets: 0 },
        { id: 'agent-3', name: 'Carla', team: Team.LOANS, activeTickets: 0 },
        { id: 'agent-4', name: 'Diego', team: Team.OTHER, activeTickets: 0 },
    ];

    findByTeam(team: Team): Agent[] {
        return this.agents.filter(agent => agent.team === team);
    }

    findById(id: string): Agent | undefined {
        return this.agents.find(agent => agent.id === id);
    }
}
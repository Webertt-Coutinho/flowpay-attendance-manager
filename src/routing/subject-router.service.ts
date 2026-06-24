import { Injectable } from "@nestjs/common";
import { Team } from "src/domain/team.enum";

@Injectable()
export class SubjectRouterService {
  private readonly map: Record<string, Team> = {
    'problemas com cartão': Team.CARDS,
    'problemas com cartao': Team.CARDS,
    'contratação de empréstimo': Team.LOANS,
    'contratacao de emprestimo': Team.LOANS,
  };

  route(subject: string): Team {
    const normalized = this.normalize(subject);
    return this.map[normalized] ?? Team.OTHER;
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }
}
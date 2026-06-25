import { Injectable } from "@nestjs/common";

export type DashboardEvent =
  | { type: 'ticket.created'; payload: { ticketId: string } }
  | { type: 'ticket.completed'; payload: { ticketId: string } };


@Injectable()
  export class EventsService {
    private listeners = new Set<(event: DashboardEvent) => void>();
    subscribe(listener: (event: DashboardEvent) => void) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }
    emit(event: DashboardEvent) {
      this.listeners.forEach((listener) => listener(event));
    }
}
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { EventsService } from "src/events/events.service";
import { DashboardService } from "./dashboard.service";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'dashboard',
})
@Injectable()
export class DashboardGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {
    @WebSocketServer()
    server: Server;

    private unsubscribe: () => void;
    private lastSnapshot: string | null = null;

    constructor(
        private readonly eventsService: EventsService,
        private readonly dashboardService: DashboardService
    ) {}

    afterInit() {
        this.unsubscribe = this.eventsService.subscribe(() => {
            this.broadcastSummaryIfChanged();
        });
    }

    handleConnection(client: Socket) {
        const summary = this.dashboardService.getSummary();
        this.lastSnapshot = JSON.stringify(summary);
        client.emit('dashboard.summary', summary);
    }

    private broadcastSummaryIfChanged(): void {
        const summary = this.dashboardService.getSummary();
        const snapshot = JSON.stringify(summary);
        if (snapshot === this.lastSnapshot) return;
        this.lastSnapshot = snapshot;
        this.server.emit('dashboard.summary', summary);
    }

    handleDisconnect(_client: Socket) {}

    onModuleDestroy() {
        this.unsubscribe?.();
    }
}
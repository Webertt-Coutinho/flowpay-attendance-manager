import { Module } from "@nestjs/common";
import { AgentsModule } from "src/agents/agents.module";
import { TicketsRepository } from "./tickets.repository";
import { RoutingModule } from "src/routing/routing.modules";
import { TicketsController } from "./tickets.controller";
import { TicketsService } from "./tickets.service";

@Module({
    imports: [RoutingModule, AgentsModule],
    controllers: [TicketsController],
    providers: [TicketsRepository, TicketsService],
    exports: [TicketsRepository],
})

export class TicketsModule {}
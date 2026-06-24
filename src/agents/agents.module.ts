import { Module } from "@nestjs/common";
import { AgentsRepository } from "./agents.repository";
import { AgentsService } from "./agents.service";

@Module({
  imports: [],
  controllers: [],
  providers: [AgentsService, AgentsRepository],
  exports: [AgentsRepository, AgentsService],
})

export class AgentsModule {}
import { Module } from '@nestjs/common';
import { AgentsModule } from '../agents/agents.module';
import { TicketsModule } from '../tickets/tickets.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardGateway } from './dashboard.gateway';

@Module({
  imports: [TicketsModule, AgentsModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardGateway],
})
export class DashboardModule {}
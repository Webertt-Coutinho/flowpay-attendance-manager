import { Module } from '@nestjs/common';
import { TicketsModule } from './tickets/tickets.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [TicketsModule, DashboardModule],
})
export class AppModule {}

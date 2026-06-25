import { Module } from '@nestjs/common';
import { TicketsModule } from './tickets/tickets.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EventsModule } from './events/event.module';

@Module({
  imports: [TicketsModule, DashboardModule, EventsModule],
})
export class AppModule {}

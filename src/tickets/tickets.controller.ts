import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateTicketDto } from 'src/dto/create-ticket.dto';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto.subject);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.ticketsService.complete(id);
  }
}
import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreateTicketDto } from 'src/dto/create-ticket.dto';
import { TicketsService } from './tickets.service';
import { TicketResponseDto } from 'src/dto/ticket-response.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTicketDto) {
    return TicketResponseDto.from(this.ticketsService.create(dto.subject));
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  complete(@Param('id') id: string) {
    return TicketResponseDto.from(this.ticketsService.complete(id));
  }
}
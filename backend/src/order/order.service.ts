import { Injectable } from '@nestjs/common';
import { ListResponseDto } from 'src/common/list-response.dto';
import { FilmsRepository } from 'src/repository/films.repository';
import { CreateOrderDto, TicketDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(dto: CreateOrderDto): Promise<ListResponseDto<TicketDto>> {
    await this.filmsRepository.createOrder(dto.tickets);

    return {
      items: dto.tickets,
      total: dto.tickets.length,
    };
  }
}

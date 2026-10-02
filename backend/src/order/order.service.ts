import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListResponseDto } from 'src/common/list-response.dto';
import { FilmsRepository } from 'src/repository/films.repository';
import { CreateOrderDto, TicketDto } from '../common/dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(dto: CreateOrderDto): Promise<ListResponseDto<TicketDto>> {
    for (const ticket of dto.tickets) {
      const result = await this.filmsRepository.bookSeat(ticket);

      switch (result.status) {
        case 'booked':
          break;
        case 'film-not-found':
          throw new NotFoundException(`Фильм ${ticket.film} не найден`);
        case 'session-not-found':
          throw new NotFoundException(`Сессия ${ticket.session} не найдена`);
        case 'seat-taken':
          throw new ConflictException(
            `Место ${ticket.row}:${ticket.seat} занято`,
          );
        case 'seat-out-of-bounds':
          throw new BadRequestException(
            `Место ${ticket.row}:${ticket.seat} вне зала`,
          );
      }
    }

    return {
      items: dto.tickets,
      total: dto.tickets.length,
    };
  }
}

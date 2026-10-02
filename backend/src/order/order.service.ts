import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SeatReservation } from 'src/common/seat-reservation';
import { SessionDto } from 'src/films/dto/session.dto';
import { ListResponseDto } from '../common/list-response.dto';
import {
  BookSeatResult,
  FilmsRepository,
} from '../repository/films.repository';
import { BookedTicketDto } from './dto/booked-ticket.dto';
import { CreateOrderDto, TicketDto } from './dto/create-order.dto';
const toSeatReservation = (ticket: TicketDto): SeatReservation => ({
  filmId: ticket.film,
  sessionId: ticket.session,
  row: ticket.row,
  seat: ticket.seat,
});

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(dto: CreateOrderDto): Promise<ListResponseDto<BookedTicketDto>> {
    this.assertNoDuplicateSeats(dto.tickets);

    const reserved: SeatReservation[] = [];
    const items: BookedTicketDto[] = [];

    try {
      for (const ticket of dto.tickets) {
        const reservation = toSeatReservation(ticket);
        const result = await this.filmsRepository.bookSeat(reservation);
        const session = this.unwrapBooking(result, ticket);

        reserved.push(reservation);
        items.push({
          id: randomUUID(),
          film: ticket.film,
          session: ticket.session,
          row: ticket.row,
          seat: ticket.seat,
          price: session.price,
          daytime: session.daytime,
        });
      }
    } catch (error) {
      await this.releaseSeats(reserved);
      throw error;
    }

    return { total: items.length, items };
  }

  private unwrapBooking(result: BookSeatResult, ticket: TicketDto): SessionDto {
    switch (result.status) {
      case 'booked':
        return result.session;
      case 'film-not-found':
        throw new NotFoundException(`Фильм ${ticket.film} не найден`);
      case 'session-not-found':
        throw new NotFoundException(`Сеанс ${ticket.session} не найден`);
      case 'seat-out-of-bounds':
        throw new BadRequestException(
          `Места ${ticket.row}:${ticket.seat} нет в зале`,
        );
      case 'seat-taken':
        throw new ConflictException(
          `Место ${ticket.row}:${ticket.seat} занято`,
        );
    }
  }

  private async releaseSeats(reserved: SeatReservation[]): Promise<void> {
    for (const reservation of reserved) {
      try {
        await this.filmsRepository.releaseSeat(reservation);
      } catch (error) {
        this.logger.error(
          `Не удалось снять резерв ${reservation.row}:${reservation.seat}`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    }
  }

  private assertNoDuplicateSeats(tickets: TicketDto[]): void {
    const seen = new Set<string>();

    for (const { film, session, row, seat } of tickets) {
      const key = `${film}:${session}:${row}:${seat}`;

      if (seen.has(key)) {
        throw new BadRequestException(
          `Место ${row}:${seat} указано в заказе дважды`,
        );
      }
      seen.add(key);
    }
  }
}

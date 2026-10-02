import { Injectable, NotFoundException } from '@nestjs/common';
import { ListResponseDto } from 'src/common/list-response.dto';
import { FilmsRepository } from 'src/repository/films.repository';
import { FilmDto } from './dto/film.dto';
import { SessionDto } from './dto/session.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms(): Promise<ListResponseDto<FilmDto>> {
    const items = await this.filmsRepository.findAll();
    return { total: items.length, items };
  }

  async getSchedule(filmId: string): Promise<ListResponseDto<SessionDto>> {
    const items = await this.filmsRepository.findSchedule(filmId);

    if (items === null) {
      throw new NotFoundException(`Фильм ${filmId} не найден`);
    }

    return { total: items.length, items };
  }
}

import { FilmDto } from './dto/film.dto';
import { SessionDto } from './dto/session.dto';

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;
  abstract findSchedule(filmId: string): Promise<SessionDto[] | null>;
}

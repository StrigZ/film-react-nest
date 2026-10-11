import { FilmDto } from 'src/films/dto/film.dto';
import { SessionDto } from 'src/films/dto/session.dto';
import { FilmEntity } from 'src/repository/postgres/entities/film.entity';
import { ScheduleEntity } from 'src/repository/postgres/entities/schedule.entity';

export const toSessionDto = (schedule: ScheduleEntity): SessionDto => ({
  id: schedule.id,
  daytime: schedule.daytime.toISOString(),
  hall: schedule.hall,
  rows: schedule.rows,
  seats: schedule.seats,
  price: schedule.price,
  taken: schedule.taken.map(({ row, seat }) => `${row}:${seat}`),
});

export const toFilmDto = (film: Omit<FilmEntity, 'schedule'>): FilmDto => ({
  id: film.id,
  rating: film.rating,
  director: film.director,
  tags: film.tags,
  image: film.image,
  cover: film.cover,
  title: film.title,
  about: film.about,
  description: film.description,
});

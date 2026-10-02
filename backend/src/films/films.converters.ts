import { FilmDto } from './dto/film.dto';
import { SessionDto } from './dto/session.dto';
import { FilmEntity } from './entities/film.entity';
import { SessionEntity } from './entities/session.entity';

export const toSessionDto = (session: SessionEntity): SessionDto => ({
  id: session.id,
  daytime: session.daytime,
  hall: session.hall,
  rows: session.rows,
  seats: session.seats,
  price: session.price,
  taken: session.taken,
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

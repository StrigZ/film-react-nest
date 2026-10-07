import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ListResponseDto } from 'src/common/list-response.dto';
import { FilmDto } from './dto/film.dto';
import { SessionDto } from './dto/session.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getFilms(): Promise<ListResponseDto<FilmDto>> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  getSchedule(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ListResponseDto<SessionDto>> {
    return this.filmsService.getSchedule(id);
  }
}

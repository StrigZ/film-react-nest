import { Test, TestingModule } from '@nestjs/testing';
import { ListResponseDto } from '../common/list-response.dto';
import { FilmDto } from './dto/film.dto';
import { SessionDto } from './dto/session.dto';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

const mockFilmId = '28fe06c6-e32d-43f3-b205-86d765c31e3a';

const mockFilm: FilmDto = {
  about: '',
  cover: '',
  description: '',
  director: '',
  id: '',
  image: '',
  rating: 3,
  tags: ['', ''],
  title: '',
};

const mockSchedule: SessionDto = {
  daytime: '',
  hall: 1,
  id: '',
  price: 350,
  rows: 1,
  seats: 1,
  taken: ['1:3'],
};

describe('FilmsController', () => {
  let controller: FilmsController;
  let mockedGetFilms: jest.Mock<Promise<ListResponseDto<FilmDto>>, []>;
  let mockedGetSchedule: jest.Mock<
    Promise<ListResponseDto<SessionDto>>,
    [string]
  >;

  beforeEach(async () => {
    mockedGetFilms = jest.fn();
    mockedGetSchedule = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            getFilms: mockedGetFilms,
            getSchedule: mockedGetSchedule,
          },
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getFilms should return films', async () => {
    mockedGetFilms.mockResolvedValue({
      total: 1,
      items: [mockFilm],
    });

    const result = await controller.getFilms();
    expect(mockedGetFilms).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      total: 1,
      items: [mockFilm],
    });
  });

  it('getSchedule should return schedule', async () => {
    mockedGetSchedule.mockResolvedValue({ total: 1, items: [mockSchedule] });
    const result = await controller.getSchedule(mockFilmId);
    expect(mockedGetSchedule).toHaveBeenCalledTimes(1);
    expect(mockedGetSchedule).toHaveBeenCalledWith(mockFilmId);
    expect(result).toEqual({
      total: 1,
      items: [mockSchedule],
    });
  });
});

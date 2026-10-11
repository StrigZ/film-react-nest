import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsRepository } from 'src/repository/films.repository';
import { FilmEntity } from 'src/repository/postgres/entities/film.entity';
import { ScheduleEntity } from 'src/repository/postgres/entities/schedule.entity';
import { SeatReservationEntity } from 'src/repository/postgres/entities/seat-reservation.entity';
import { PostgresFilmsRepository } from 'src/repository/postgres/postgres-films.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DATABASE_HOST'),
        port: config.getOrThrow<number>('DATABASE_PORT'),
        username: config.getOrThrow<string>('DATABASE_USERNAME'),
        password: config.getOrThrow<string>('DATABASE_PASSWORD'),
        database: config.getOrThrow<string>('DATABASE_NAME'),
        entities: [FilmEntity, ScheduleEntity, SeatReservationEntity],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([
      FilmEntity,
      ScheduleEntity,
      SeatReservationEntity,
    ]),
  ],
  providers: [{ provide: FilmsRepository, useClass: PostgresFilmsRepository }],
  exports: [FilmsRepository],
})
export class PostgresRepositoryModule {}

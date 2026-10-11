import { FilmEntity } from 'src/repository/postgres/entities/film.entity';
import { SeatReservationEntity } from 'src/repository/postgres/entities/seat-reservation.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  daytime: Date;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column()
  price: number;

  @OneToMany(() => SeatReservationEntity, (seat) => seat.schedule)
  taken: SeatReservationEntity[];

  @ManyToOne(() => FilmEntity, (film) => film.schedule)
  film: FilmEntity;
}

import { ScheduleEntity } from 'src/repository/postgres/entities/schedule.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('seat_reservations')
@Unique(['scheduleId', 'row', 'seat'])
export class SeatReservationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  row: number;

  @Column()
  seat: number;

  @Column()
  scheduleId: string;

  @ManyToOne(() => ScheduleEntity, (schedule) => schedule.taken)
  @JoinColumn({ name: 'scheduleId' })
  schedule: ScheduleEntity;
}

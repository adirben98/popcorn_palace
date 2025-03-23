import { Showtime } from '../../showtime/entities/showtime.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Booking {
  constructor(userId: string, seatNumber: number, showtime: Showtime) {
    this.userId = userId;
    this.seatNumber = seatNumber;
    this.showtime = showtime;
  }

  @PrimaryGeneratedColumn('uuid')
  bookingId: string;

  @ManyToOne(() => Showtime, (showtime) => showtime.bookings, {
    nullable: false,
  })
  @JoinColumn({ name: 'showtimeId' })
  showtime: Showtime;

  @Column()
  seatNumber: number;

  @Column()
  userId: string;
}

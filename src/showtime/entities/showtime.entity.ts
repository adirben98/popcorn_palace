import { Booking } from '../../booking/entities/booking.entity';
import { Movie } from '../../movie/entities/movie.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Showtime {
  constructor(
    theater: string,
    start_time: Date,
    end_time: Date,
    price: number,
    movie: Movie,
  ) {
    this.theater = theater;
    this.start_time = start_time;
    this.end_time = end_time;
    this.price = price;
    this.movie = movie;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  theater: string;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column('numeric', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, { nullable: false })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @OneToMany(() => Booking, (booking) => booking.showtime)
  bookings: Booking[];
}

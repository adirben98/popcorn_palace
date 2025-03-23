import { Showtime } from '../../showtime/entities/showtime.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  constructor(
    title: string,
    genre: string,
    duration: number,
    rating: number,
    releaseYear: number,
  ) {
    this.title = title;
    this.genre = genre;
    this.duration = duration;
    this.rating = rating;
    this.releaseYear = releaseYear;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  genre: string;

  @Column()
  duration: number;

  @Column('decimal')
  rating: number;

  @Column()
  releaseYear: number;

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];
}

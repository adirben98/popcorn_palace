import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateShowtimeDto } from "./dto/create-showtime.dto";
import { UpdateShowtimeDto } from "./dto/update-showtime.dto";
import { Showtime } from "./entities/showtime.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Movie } from "../movie/entities/movie.entity";

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>
  ) {}
  async addShowtime(createShowtimeDto: CreateShowtimeDto) {
    const showtimes = await this.showtimeRepository.findBy({
      theater: createShowtimeDto.theater,
    });

    const start = new Date(createShowtimeDto.start_time);
    const end = new Date(createShowtimeDto.end_time);
    const isOverlapping = this.isOverlapping(start, end, showtimes);
    if (isOverlapping) {
      throw new HttpException(
        "This show is overlapping with another show!",
        HttpStatus.CONFLICT
      );
    }
    const movie = await this.movieRepository.findOneBy({
      id: createShowtimeDto.movieId,
    });
    if (!movie) {
      throw new HttpException("Movie does not exist", HttpStatus.NOT_FOUND);
    }
    const showtime = new Showtime(
      createShowtimeDto.theater,
      new Date(createShowtimeDto.start_time),
      new Date(createShowtimeDto.end_time),
      createShowtimeDto.price,
      movie
    );
    showtime.movie.rating = parseFloat(movie.rating.toString());
    return await this.showtimeRepository.save(showtime);
  }

  async getShowtimeByID(id: number) {
    const showtime = await this.showtimeRepository.findOneBy({ id });
    if (!showtime) {
      throw new HttpException(
        `There is no showtime with id: ${id}`,
        HttpStatus.NOT_FOUND
      );
    }
    showtime.price = parseFloat(showtime.price.toString());
    return showtime;
  }

  async updateShowtime(
    showtimeId: number,
    updateShowtimeDto: UpdateShowtimeDto
  ) {
    
    if (Object.keys(updateShowtimeDto).length === 0) {
      throw new HttpException('No data provided to update',HttpStatus.BAD_REQUEST);
    }
    const showtime = await this.showtimeRepository.findOneBy({
      id: showtimeId,
    });
    if (!showtime) {
      throw new HttpException(
        `There is no showtime with id: ${showtimeId}`,
        HttpStatus.NOT_FOUND
      );
    }
    
    const start = new Date(updateShowtimeDto.start_time);
    const end = new Date(updateShowtimeDto.end_time);
    const showtimes = await this.showtimeRepository.find({
      where: {
        id: Not(showtimeId),
        theater: updateShowtimeDto.theater,
      },
    });
    const isOverlapping = this.isOverlapping(start, end, showtimes);
    if (isOverlapping) {
      throw new HttpException(
        "This show is overlapping with another show!",
        HttpStatus.CONFLICT
      );
    }
    console.log(showtime)
      const movie = await this.movieRepository.findOneBy({
        id: updateShowtimeDto.movieId,
      });
      if (!movie) {
        throw new HttpException(
          `There is no movie with the id: ${updateShowtimeDto.movieId}`,
          HttpStatus.NOT_FOUND
        );
      }
  
      showtime.movie = movie;
  
    Object.assign(showtime, updateShowtimeDto);
  
    await this.showtimeRepository.save(showtime);
  }
  
  async deleteShowtime(showtimeId: number) {
    const showtime = await this.showtimeRepository.findOneBy({
      id: showtimeId,
    });
    if (!showtime) {
      throw new HttpException(
        `There is no showtime with id: ${showtimeId}`,
        HttpStatus.NOT_FOUND
      );
    }
    await this.showtimeRepository.delete(showtimeId);
  }
  isOverlapping(start: Date, end: Date, showtimes: Showtime[]): boolean {
    const isOverlapping = showtimes.some((showtime) => {
      const curStart = new Date(showtime.start_time);
      const curEnd = new Date(showtime.end_time);
      return start <= curEnd && end >= curStart;
    });

    return isOverlapping;
  }
}

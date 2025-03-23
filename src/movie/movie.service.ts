import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Movie } from "./entities/movie.entity";
import { Not, Repository } from "typeorm";

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>
  ) {}
  async addMovie(createMovieDto: CreateMovieDto) {
    const isUniqueTitle = await this.movieRepository.findOne({
      where: { title: createMovieDto.title },
    });
    if (isUniqueTitle) {
      throw new HttpException(
        `There is already a movie with the title ${createMovieDto.title}`,
        HttpStatus.CONFLICT
      );
    }
    const movie = new Movie(
      createMovieDto.title,
      createMovieDto.genre,
      createMovieDto.duration,
      createMovieDto.rating,
      createMovieDto.releaseYear
    );

    return await this.movieRepository.save(movie);
  }

  async findAllMovies() {
    const movies = await this.movieRepository.find();
    movies.forEach((movie) => {
      movie.rating = parseFloat(movie.rating.toString());
    });
    return movies;
  }

  async updateMovie(title: string, updateMovieDto: UpdateMovieDto) {
    if (Object.keys(updateMovieDto).length === 0) {
      throw new HttpException('No data provided to update',HttpStatus.BAD_REQUEST);
    }
    const movie = await this.movieRepository.findOne({
      where: { title },
    });
    if (!movie) {
      throw new HttpException(
        `There is no movie with title: ${title}`,
        HttpStatus.NOT_FOUND
      );
    }
    if (updateMovieDto.title && title != updateMovieDto.title) {
      const isUniqueTitle = await this.movieRepository.findOne({
        where: { title: updateMovieDto.title },
      });
      if (isUniqueTitle) {
        throw new HttpException(
          `There is already a movie with the title ${title}`,
          HttpStatus.CONFLICT
        );
      }
    }

    await this.movieRepository.update({ title }, updateMovieDto);
  }

  async deleteMovie(title: string): Promise<void> {
    const movie = await this.movieRepository.findOne({
      where: { title },
    });
    if (!movie) {
      throw new HttpException(
        `There is no movie with title: ${title}`,
        HttpStatus.NOT_FOUND
      );
    }
    await this.movieRepository.delete({ title });
  }
}

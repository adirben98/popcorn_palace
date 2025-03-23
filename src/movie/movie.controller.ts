import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  addMovie(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.addMovie(createMovieDto);
  }

  @Get('all')
  findAllMovies() {
    return this.movieService.findAllMovies();
  }

  @Post('update/:movieTitle')
  updateMovie(
    @Param('movieTitle') title: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.movieService.updateMovie(title, updateMovieDto);
  }

  @Delete(':movieTitle')
  deleteMovie(@Param('movieTitle') title: string) {
    return this.movieService.deleteMovie(title);
  }
}

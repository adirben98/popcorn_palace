import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MovieController', () => {
  let controller: MovieController;

  const mockMovieService = {
    addMovie: jest.fn(),
    findAllMovies: jest.fn(),
    updateMovie: jest.fn(),
    deleteMovie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: mockMovieService,
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addMovie', () => {
    const createMovieDto: CreateMovieDto = {
      title: 'Test Movie',
      genre: 'Action',
      duration: 120,
      rating: 8.5,
      releaseYear: 2023,
    };

    const mockMovie = {
      id: 1,
      ...createMovieDto,
    };

    it('should create a movie successfully', async () => {
      mockMovieService.addMovie.mockResolvedValue(mockMovie);

      const result = await controller.addMovie(createMovieDto);

      expect(result).toEqual(mockMovie);
    });

    it('should pass through errors from service', async () => {
      const error = new HttpException('Test error', HttpStatus.CONFLICT);
      mockMovieService.addMovie.mockRejectedValue(error);

      await expect(controller.addMovie(createMovieDto)).rejects.toThrow(error);
    });
  });

  describe('findAllMovies', () => {
    const mockMovies = [
      {
        id: 1,
        title: 'Movie 1',
        genre: 'Action',
        duration: 120,
        rating: 8.5,
        releaseYear: 2023,
      },
      {
        id: 2,
        title: 'Movie 2',
        genre: 'Comedy',
        duration: 110,
        rating: 7.5,
        releaseYear: 2022,
      },
    ];

    it('should return an array of movies', async () => {
      mockMovieService.findAllMovies.mockResolvedValue(mockMovies);

      const result = await controller.findAllMovies();

      expect(result).toEqual(mockMovies);
    });
  });

  describe('updateMovie', () => {
    const updateMovieDto: UpdateMovieDto = {
      genre: 'Sci-Fi',
      duration: 130,
      rating: 9.0,
    };

    it('should update a movie successfully', async () => {
      mockMovieService.updateMovie.mockResolvedValue(undefined);

      await controller.updateMovie('Test Movie', updateMovieDto);

      expect(mockMovieService.updateMovie).toHaveBeenCalledWith(
        'Test Movie',
        updateMovieDto,
      );
    });

    it('should pass through errors from service', async () => {
      const error = new HttpException('Test error', HttpStatus.NOT_FOUND);
      mockMovieService.updateMovie.mockRejectedValue(error);

      await expect(
        controller.updateMovie('Test Movie', updateMovieDto),
      ).rejects.toThrow(error);
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie successfully', async () => {
      mockMovieService.deleteMovie.mockResolvedValue(undefined);

      await controller.deleteMovie('Test Movie');

      expect(mockMovieService.deleteMovie).toHaveBeenCalledWith('Test Movie');
    });

    it('should pass through errors from service', async () => {
      const error = new HttpException('Test error', HttpStatus.BAD_REQUEST);
      mockMovieService.deleteMovie.mockRejectedValue(error);

      await expect(controller.deleteMovie('Test Movie')).rejects.toThrow(error);
    });
  });
});

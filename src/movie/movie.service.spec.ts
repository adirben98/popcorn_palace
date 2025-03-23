import { Test, TestingModule } from "@nestjs/testing";
import { MovieService } from "./movie.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Movie } from "./entities/movie.entity";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateMovieDto } from "./dto/update-movie.dto";

describe("MovieService", () => {
  let service: MovieService;

  let createMovieDto: CreateMovieDto;
  let updateMovieDto: UpdateMovieDto;
  let existMovie: CreateMovieDto;
  let mockMovie: any;

  const mockMovieRepository = {
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);

    createMovieDto = {
      title: "Test Movie",
      genre: "Action",
      duration: 120,
      rating: 8.5,
      releaseYear: 2023,
    };

    updateMovieDto = {
      genre: "Science Fiction",
    };
    existMovie = {
      title: "Test Movie",
      genre: "Action",
      duration: 180,
      rating: 5.5,
      releaseYear: 2010,
    };

    mockMovie = {
      id: 1,
      ...createMovieDto,
    };

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("addMovie", () => {
    it("should throw an error on unique title", async () => {
      mockMovieRepository.findOne.mockResolvedValue(existMovie);

      await expect(service.addMovie(createMovieDto)).rejects.toThrow(
        new HttpException(
          `There is already a movie with the title ${createMovieDto.title}`,
          HttpStatus.BAD_REQUEST
        )
      );
    });

    it("should throw BadRequestException when missing required fields", async () => {
      const invalidDto: any = {
        genre: "Action", // Missing title
        duration: 120,
        rating: 8.5,
        releaseYear: 2023,
      };

      try {
        mockMovieRepository.findOne.mockResolvedValue(null);
        await service.addMovie(invalidDto);
      } catch (error) {
        expect(error.message).toContain("title should not be empty");
      }
    });

    it("should add a new movie", async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);
      mockMovieRepository.save.mockResolvedValue(mockMovie);

      expect(await service.addMovie(createMovieDto)).toEqual(mockMovie);
    });
  });

  describe("findAllMovies", () => {
    it("should return an array of movies", async () => {
      mockMovieRepository.find.mockResolvedValue([mockMovie]);

      const result = await service.findAllMovies();
      expect(result).toEqual([mockMovie]);
    });
  });
  describe("update a movie", () => {
    it("should throw an error if the movie is not found", async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);
      await expect(
        service.updateMovie("Test Movie", updateMovieDto)
      ).rejects.toThrow("There is no movie with title: Test Movie");
    });
  
    it("should throw an error if no data is provided to update", async () => {
      await expect(
        service.updateMovie("Test Movie", {})
      ).rejects.toThrow("No data provided to update");
    });
  
    it("should throw an error if the new title already exists", async () => {
      mockMovieRepository.findOne
        .mockResolvedValueOnce(createMovieDto) 
        .mockResolvedValueOnce({ title: "New Movie Title" });
  
      const conflictingUpdateDto = {
        ...updateMovieDto,
        title: "New Movie Title",
      };
  
      await expect(
        service.updateMovie("Test Movie", conflictingUpdateDto)
      ).rejects.toThrow("There is already a movie with the title Test Movie");
    });
  
    it("should update the movie if all checks pass", async () => {
      mockMovieRepository.findOne
        .mockResolvedValueOnce(createMovieDto) 
        .mockResolvedValueOnce(null);
  
      mockMovieRepository.update.mockResolvedValue(null);
  
      const res = await service.updateMovie("Test Movie", updateMovieDto);
      expect(res).toBeUndefined(); 
      expect(mockMovieRepository.update).toHaveBeenCalledWith(
        { title: "Test Movie" }, 
        updateMovieDto
      );
    });
  });
  

  describe("delete a movie", () => {
    it("should throw an error on not found movie", async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);
      try {
        await service.deleteMovie("Test Movie");
      } catch (error) {
        expect(error.message).toContain("There is no movie with title");
      }
    });
    it("should delete the movie", async () => {
      mockMovieRepository.findOne.mockResolvedValue(createMovieDto);
      const res = await service.deleteMovie("Test Movie");
      expect(res).toBe(undefined);
    });
  });
});

import { Test, TestingModule } from "@nestjs/testing";
import { ShowtimeService } from "./showtime.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Showtime } from "./entities/showtime.entity";
import { Movie } from "../movie/entities/movie.entity";

const mockShowtimeRepository = {
  findBy: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockMovieRepository = {
  findOneBy: jest.fn(),
};

describe("ShowtimeService", () => {
  let service: ShowtimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimeService,
        {
          provide: getRepositoryToken(Showtime),
          useValue: mockShowtimeRepository,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<ShowtimeService>(ShowtimeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("addShowtime", () => {
    it("should throw conflict if showtime is overlapping", async () => {
      mockShowtimeRepository.findBy.mockResolvedValue([
        { start_time: new Date(), end_time: new Date() },
      ]);

      await expect(
        service.addShowtime({
          theater: "A",
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(),
          price: 20,
          movieId: 1,
        })
      ).rejects.toThrow("This show is overlapping with another show!");
    });

    it("should throw if movie does not exist", async () => {
      mockShowtimeRepository.findBy.mockResolvedValue([]);
      mockMovieRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.addShowtime({
          theater: "A",
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(),
          price: 20,
          movieId: 1,
        })
      ).rejects.toThrow("Movie does not exist");
    });

    it("should create and save showtime", async () => {
      mockShowtimeRepository.findBy.mockResolvedValue([]);
      mockMovieRepository.findOneBy.mockResolvedValue({ id: 1, rating: 8.5 });
      mockShowtimeRepository.save.mockResolvedValue({ id: 1 });

      const result = await service.addShowtime({
        theater: "A",
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        price: 20,
        movieId: 1,
      });

      expect(result).toEqual({ id: 1 });
      expect(mockShowtimeRepository.save).toHaveBeenCalled();
    });
  });
  describe("updateShowtime", () => {
    it("should throw if no data is provided to update", async () => {
      await expect(service.updateShowtime(1, {})).rejects.toThrow(
        "No data provided to update"
      );
    });
  
    it("should throw if showtime not found", async () => {
      mockShowtimeRepository.findOneBy.mockResolvedValue(null);
      await expect(service.updateShowtime(1, { theater: "Habima" })).rejects.toThrow(
        "There is no showtime with id: 1"
      );
    });
  
    it("should throw conflict if updated showtime is overlapping", async () => {
      mockShowtimeRepository.findOneBy.mockResolvedValue({
        id: 1,
        theater: "A",
      });
      mockShowtimeRepository.find.mockResolvedValue([
        { start_time: new Date(), end_time: new Date(), id: 2 },
      ]);
  
      await expect(
        service.updateShowtime(1, {
          theater: "A",
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(),
        })
      ).rejects.toThrow("This show is overlapping with another show!");
    });
  
    it("should throw if movieId is changed but no movie is found", async () => {
      mockShowtimeRepository.findOneBy.mockResolvedValue({
        id: 1,
        theater: "A",
        movie: { id: 1 },
      });
      mockMovieRepository.findOneBy.mockResolvedValue(null);
  
      await expect(
        service.updateShowtime(1, {
          movieId: 2,
          theater: "A",
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(),
        })
      ).rejects.toThrow("There is no movie with the id: 2");
    });
  
    it("should update showtime successfully when movieId is changed", async () => {
      const existingShowtime = {
        id: 1,
        theater: "A",
        movie: { id: 1 },
      };
      const newMovie = { id: 2 };
  
      mockShowtimeRepository.findOneBy.mockResolvedValue(existingShowtime);
      mockShowtimeRepository.find.mockResolvedValue([]); // No overlapping
      mockMovieRepository.findOneBy.mockResolvedValue(newMovie);
      mockShowtimeRepository.save.mockResolvedValue(null);
  
      await service.updateShowtime(1, {
        movieId: 2,
        theater: "A",
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
      });
  
      expect(mockShowtimeRepository.save).toHaveBeenCalledWith({
        ...existingShowtime,
        movie: newMovie,
        theater: "A",
        start_time: expect.any(String),
        end_time: expect.any(String),
      });
    });
  
    it("should update showtime successfully when movieId is not provided", async () => {
      const existingShowtime = {
        id: 1,
        theater: "A",
        movie: { id: 1 },
      };
  
      mockShowtimeRepository.findOneBy.mockResolvedValue(existingShowtime);
      mockShowtimeRepository.find.mockResolvedValue([]); 
      mockShowtimeRepository.save.mockResolvedValue(null);
  
      await service.updateShowtime(1, {
        theater: "A",
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
      });
  
      expect(mockShowtimeRepository.save).toHaveBeenCalledWith({
        ...existingShowtime,
        theater: "A",
        start_time: expect.any(String),
        end_time: expect.any(String),
      });
    });
  });
  
  
  describe("getShowtimeByID", () => {
    it("should throw if showtime not found", async () => {
      mockShowtimeRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getShowtimeByID(1)).rejects.toThrow(
        "There is no showtime with id: 1"
      );
    });

    it("should return showtime", async () => {
      mockShowtimeRepository.findOneBy.mockResolvedValue({ id: 1, price: 20 });

      const result = await service.getShowtimeByID(1);
      expect(result).toEqual({ id: 1, price: 20 });
    });
  });

  describe("deleteShowtime", () => {
    it("should throw if showtime not found", async () => {
      mockShowtimeRepository.findOneBy.mockResolvedValue(null);

      await expect(service.deleteShowtime(1)).rejects.toThrow(
        "There is no showtime with id: 1"
      );
    });

    it("should delete showtime", async () => {
      mockShowtimeRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockShowtimeRepository.delete.mockResolvedValue(null);

      await service.deleteShowtime(1);

      expect(mockShowtimeRepository.delete).toHaveBeenCalledWith(1);
    });
  });
  describe("isOverlapping", () => {
    it("should return true when times overlap", () => {
      const start = new Date("2024-08-20T10:00:00");
      const end = new Date("2024-08-20T12:00:00");
      const showtimes = [
        {
          id:1,movie:new Movie('thrater','Action',120,7.5,2000),
          start_time: new Date("2024-08-20T11:00:00"),
          end_time: new Date("2024-08-20T13:00:00"),
          theater: "A",
          price: 20,
          bookings:[]
        },
      ];

      const result = service.isOverlapping(start, end, showtimes);
      expect(result).toBe(true);
    });

    it("should return false when times do not overlap", () => {
      const start = new Date("2024-08-20T10:00:00");
      const end = new Date("2024-08-20T12:00:00");
      const showtimes = [
        {
          id:1,movie:new Movie('thrater','Action',120,7.5,2000),
          start_time: new Date('2024-08-20T12:30:00'),
        end_time: new Date('2024-08-20T14:00:00'),
          theater: "A",
          price: 20,
          bookings:[]
        },
      ];

      const result = service.isOverlapping(start, end, showtimes);
      expect(result).toBe(false);
    });
  });
});

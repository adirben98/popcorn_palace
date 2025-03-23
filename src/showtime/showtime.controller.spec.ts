import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

describe('ShowtimeController', () => {
  let controller: ShowtimeController;
  let service: ShowtimeService;

  const mockShowtimeService = {
    addShowtime: jest.fn(),
    getShowtimeByID: jest.fn(),
    updateShowtime: jest.fn(),
    deleteShowtime: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimeController],
      providers: [
        {
          provide: ShowtimeService,
          useValue: mockShowtimeService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimeController>(ShowtimeController);
    service = module.get<ShowtimeService>(ShowtimeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addShowtime', () => {
    it('should call service.addShowtime with correct params', async () => {
      const createDto: CreateShowtimeDto = {
        theater: 'Theater 1',
        start_time: '2024-08-20T10:00:00Z',
        end_time: '2024-08-20T12:00:00Z',
        price: 20,
        movieId: 1,
      };
      mockShowtimeService.addShowtime.mockResolvedValue('newShowtime');

      const result = await controller.addShowtime(createDto);
      expect(service.addShowtime).toHaveBeenCalledWith(createDto);
      expect(result).toEqual('newShowtime');
    });
  });

  describe('getShowtimeByID', () => {
    it('should call service.getShowtimeByID with correct param', async () => {
      mockShowtimeService.getShowtimeByID.mockResolvedValue('showtime');

      const result = await controller.getShowtimeByID(1);
      expect(service.getShowtimeByID).toHaveBeenCalledWith(1);
      expect(result).toEqual('showtime');
    });
  });

  describe('updateShowtime', () => {
    it('should call service.updateShowtime with correct params', async () => {
      const updateDto: UpdateShowtimeDto = {
        theater: 'Theater 2',
        start_time: '2024-08-20T15:00:00Z',
        end_time: '2024-08-20T17:00:00Z',
        price: 25,
        movieId: 2,
      };
      mockShowtimeService.updateShowtime.mockResolvedValue(undefined);

      await controller.updateShowtime(1, updateDto);
      expect(service.updateShowtime).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('deleteShowtime', () => {
    it('should call service.deleteShowtime with correct param', async () => {
      mockShowtimeService.deleteShowtime.mockResolvedValue(undefined);

      await controller.deleteShowtime(1);
      expect(service.deleteShowtime).toHaveBeenCalledWith(1);
    });
  });
});

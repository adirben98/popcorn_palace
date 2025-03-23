import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingController', () => {
  let controller: BookingController;
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: {
            bookTicket: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('bookTicket', () => {
    const createBookingDto: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 10,
      userId: 'user123',
    };

    it('should call service.bookTicket with correct params', async () => {
      const result = { bookingId: 'uuid-123' };
      jest.spyOn(service, 'bookTicket').mockResolvedValue(result);

      const response = await controller.bookTicket(createBookingDto);

      expect(service.bookTicket).toHaveBeenCalledWith(createBookingDto);
      expect(response).toEqual(result);
    });

    it('should throw an error if service.bookTicket throws', async () => {
      jest
        .spyOn(service, 'bookTicket')
        .mockRejectedValue(new Error('This seat is already taken'));

      await expect(controller.bookTicket(createBookingDto)).rejects.toThrow(
        'This seat is already taken',
      );
    });
  });
});

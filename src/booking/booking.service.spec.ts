import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Showtime } from '../showtime/entities/showtime.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Movie } from '../movie/entities/movie.entity';

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepository: Repository<Booking>;
  let showtimeRepository: Repository<Showtime>;
  const createBookingDto: CreateBookingDto = {
    userId: 'user1',
    seatNumber: 5,
    showtimeId: 1,
  };
  const showtime: Showtime = {
    id: 1,
    theater: 'Habima',
    start_time: new Date(),
    end_time: new Date(),
    price: 10,
    movie: new Movie('Avatar', 'Action', 120, 7.5, 2000),
    bookings: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Showtime),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepository = module.get<Repository<Booking>>(
      getRepositoryToken(Booking),
    );
    showtimeRepository = module.get<Repository<Showtime>>(
      getRepositoryToken(Showtime),
    );
  });

  describe('bookTicket', () => {
    it('should throw an error if the seat is already taken', async () => {
      jest.spyOn(bookingRepository, 'find').mockResolvedValue([
        {
          bookingId: '1',
          showtime: showtime,
          seatNumber: createBookingDto.seatNumber,
          userId: createBookingDto.userId,
        },
      ]);

      await expect(
        service.bookTicket({ userId: 'user1', seatNumber: 5, showtimeId: 1 }),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an error if the showtime does not exist', async () => {
      jest.spyOn(bookingRepository, 'find').mockResolvedValue([]);
      jest.spyOn(showtimeRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.bookTicket({ userId: 'user1', seatNumber: 5, showtimeId: 1 }),
      ).rejects.toThrow(HttpException);
    });

    it('should create and return a new booking if conditions are met', async () => {
      const savedBooking = {
        bookingId: '123',
        showtime: showtime,
        seatNumber: createBookingDto.seatNumber,
        userId: createBookingDto.userId,
      };

      jest.spyOn(bookingRepository, 'find').mockResolvedValue([]);
      jest.spyOn(showtimeRepository, 'findOneBy').mockResolvedValue(showtime);
      jest.spyOn(bookingRepository, 'save').mockResolvedValue(savedBooking);

      const result = await service.bookTicket({
        userId: 'user1',
        seatNumber: 5,
        showtimeId: 1,
      });

      expect(result).toEqual({ bookingId: '123' });
      expect(bookingRepository.save).toHaveBeenCalled();
    });
  });
});

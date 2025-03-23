import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Showtime } from '../showtime/entities/showtime.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
  ) {}
  async bookTicket(createBookingDto: CreateBookingDto) {
    const bookings = await this.bookingRepository.find({
      where: {
        showtime: { id: createBookingDto.showtimeId },
        seatNumber: createBookingDto.seatNumber,
      },
    });
    if (bookings.length != 0) {
      throw new HttpException(
        'This seat is already taken',
        HttpStatus.CONFLICT,
      );
    }
    const showtime = await this.showtimeRepository.findOneBy({
      id: createBookingDto.showtimeId,
    });
    if (!showtime) {
      throw new HttpException('Showtime does not exist', HttpStatus.NOT_FOUND);
    }
    const newBooking = new Booking(
      createBookingDto.userId,
      createBookingDto.seatNumber,
      showtime,
    );

    return {
      bookingId: (await this.bookingRepository.save(newBooking)).bookingId,
    };
  }
}

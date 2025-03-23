import { Controller, Post, Body } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  bookTicket(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.bookTicket(createBookingDto);
  }
}

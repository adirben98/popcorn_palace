import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Post()
  addShowtime(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimeService.addShowtime(createShowtimeDto);
  }

  @Get(':showtimeId')
  getShowtimeByID(@Param('showtimeId') showtimeId: number) {
    return this.showtimeService.getShowtimeByID(showtimeId);
  }

  @Post('update/:showtimeId')
  updateShowtime(
    @Param('showtimeId') showtimeId: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    return this.showtimeService.updateShowtime(showtimeId, updateShowtimeDto);
  }

  @Delete(':showtimeId')
  deleteShowtime(@Param('showtimeId') showtimeId: number) {
    return this.showtimeService.deleteShowtime(showtimeId);
  }
}

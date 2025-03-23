import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @IsNotEmpty()
  showtimeId: number;

  @IsInt()
  @IsNotEmpty()
  seatNumber: number;

  @IsNotEmpty()
  @IsString()
  userId: string;
}

import { IsInt, IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateShowtimeDto {
  @IsString()
  @IsNotEmpty()
  theater: string;

  @IsNotEmpty()
  @IsISO8601()
  start_time: string;

  @IsISO8601()
  @IsNotEmpty()
  end_time: string;

  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  movieId: number;
}

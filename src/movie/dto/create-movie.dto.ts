import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsNotEmpty()
  @IsInt()
  duration: number;

  @IsNotEmpty()
  rating: number;

  @IsNotEmpty()
  @IsInt()
  releaseYear: number;
}

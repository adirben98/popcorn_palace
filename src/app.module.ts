import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';
import { Movie } from './movie/entities/movie.entity';
import { ShowtimeModule } from './showtime/showtime.module';
import { Showtime } from './showtime/entities/showtime.entity';
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/entities/booking.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.PG_PORT) || 5432,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      entities: [Movie, Showtime, Booking],
      database: process.env.PG_DATABASE,
      synchronize: true,
      logging: true,
    }),
    MovieModule,
    ShowtimeModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

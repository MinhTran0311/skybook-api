import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingsRepository } from './bookings.repository';
import { BOOKING_REPOSITORY } from 'src/utils/contants/repositories';

@Module({
  controllers: [BookingsController],
  providers: [
    BookingsService,
    {
      provide: BOOKING_REPOSITORY,
      useClass: BookingsRepository,
    },
  ],
  exports: [BOOKING_REPOSITORY],
})
export class BookingsModule {}

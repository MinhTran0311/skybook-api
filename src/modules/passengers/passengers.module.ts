import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { PassengersController } from './passengers.controller';
import { PassengersService } from './passengers.service';
import { PassengersRepository } from './repository/passengers.repository';
import {
  PASSENGER_REPOSITORY,
  FLIGHT_REPOSITORY,
  BOOKING_REPOSITORY,
} from 'src/utils/contants/repositories';
import { FlightsRepository } from '../flights/repository/flights.repository';
import { BookingsRepository } from '../bookings/repository/bookings.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PassengersController],
  providers: [
    PassengersService,
    {
      provide: PASSENGER_REPOSITORY,
      useClass: PassengersRepository,
    },
    {
      provide: FLIGHT_REPOSITORY,
      useClass: FlightsRepository,
    },
    {
      provide: BOOKING_REPOSITORY,
      useClass: BookingsRepository,
    },
  ],
})
export class PassengersModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { PassengersModule } from './modules/passengers/passengers.module';
import { FlightsModule } from './modules/flights/flights.module';
import { BookingsModule } from './modules/bookings/bookings.module';

@Module({
  imports: [PrismaModule, PassengersModule, FlightsModule, BookingsModule],
})
export class AppModule {}

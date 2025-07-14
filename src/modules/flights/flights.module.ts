import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { FlightsRepository } from './flights.repository';
import { FLIGHT_REPOSITORY } from 'src/utils/contants/repositories';

@Module({
  controllers: [FlightsController],
  providers: [
    FlightsService,
    {
      provide: FLIGHT_REPOSITORY,
      useClass: FlightsRepository,
    },
  ],
  exports: [FLIGHT_REPOSITORY],
})
export class FlightsModule {}

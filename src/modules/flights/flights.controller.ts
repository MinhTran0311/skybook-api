import { Controller, Get, Param } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get(':id')
  getFlightsByDetails(@Param('id') id: string) {
    return this.flightsService.getFlightsByDetails({ id });
  }
}

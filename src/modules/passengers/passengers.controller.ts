import { Controller, Get, Param, Query } from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { FilterPassengerDto } from './dto/filter-passenger.dto';

@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Get(':id')
  async getPassengerById(@Param('id') id: string) {
    return await this.passengersService.getPassengerWithBookingFlightsById(id);
  }

  @Get(':id/basic')
  async getPassengerBasicById(@Param('id') id: string) {
    return await this.passengersService.getPassengerBasicById(id);
  }

  @Get('')
  async getPassengers(@Query() query: FilterPassengerDto) {
    return await this.passengersService.getListPassengers(query);
  }
}

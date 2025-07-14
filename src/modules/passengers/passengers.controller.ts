import { Controller, Get, Param, Query } from '@nestjs/common';
import { FilterPassengerDto } from './dto/filter-passenger.dto';
import { PassengersService } from './passengers.service';

@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Get(':id')
  async getPassengerById(@Param('id') id: string) {
    return await this.passengersService.getPassengerDetails(id);
  }

  @Get('details/:id')
  async getPassengerBasicById(@Param('id') id: string) {
    return await this.passengersService.getPassengerById(id);
  }

  @Get()
  async getPassengers(@Query() query: FilterPassengerDto) {
    return await this.passengersService.getPassengersByFlightDetails(query);
  }

  // service orchestrator approach
  // @Get('')
  // async getPassengers(@Query() query: FilterPassengerDto) {
  //   return await this.passengersService.getPassengersByFlightDetails(query);
  // }
}

import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FilterPassengerDto } from './dto/filter-passenger.dto';
import { PassengersService } from './passengers.service';

@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Get(':id')
  async getPassengerById(@Param('id') id: string) {
    try {
      return await this.passengersService.getPassengerDetails(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve passenger details');
    }
  }

  @Get('details/:id')
  async getPassengerBasicById(@Param('id') id: string) {
    try {
      return await this.passengersService.getPassengerById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve passenger');
    }
  }

  @Get()
  async getPassengers(@Query() query: FilterPassengerDto) {
    try {
      return await this.passengersService.getPassengersByFlightDetails(query);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to retrieve passengers by flight details',
      );
    }
  }

  // service orchestrator approach
  // @Get('')
  // async getPassengers(@Query() query: FilterPassengerDto) {
  //   return await this.passengersService.getPassengersByFlightDetails(query);
  // }
}

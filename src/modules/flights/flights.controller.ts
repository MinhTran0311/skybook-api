import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get(':id')
  getFlightsByDetails(@Param('id') id: string) {
    return this.flightsService.getFlightsByDetails({ id });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFlight(@Body() createFlightDto: CreateFlightDto) {
    return await this.flightsService.createFlight(createFlightDto);
  }
}

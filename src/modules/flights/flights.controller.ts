import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get(':id')
  getFlightsByDetails(@Param('id') id: string) {
    try {
      return this.flightsService.getFlightsByDetails({ id });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve flight details');
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFlight(@Body() createFlightDto: CreateFlightDto) {
    try {
      return await this.flightsService.createFlight(createFlightDto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create flight');
    }
  }
}

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FLIGHT_REPOSITORY } from '../../utils/contants/repositories';
import { CreateFlightDto } from './dto/create-flight.dto';
import { FilterFlightDto } from './dto/filter-flight.dto';
import { IFlightRepository } from './flights.repository';

@Injectable()
export class FlightsService {
  constructor(
    @Inject(FLIGHT_REPOSITORY)
    private readonly flightRepository: IFlightRepository,
  ) {}

  async getFlightsByDetails(query: FilterFlightDto) {
    return await this.flightRepository.getFlightsByDetails(query);
  }

  async createFlight(createFlightDto: CreateFlightDto) {
    try {
      const flight = await this.flightRepository.createFlight(createFlightDto);

      return flight;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to create flight');
    }
  }
}

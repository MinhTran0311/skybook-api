import { Inject, Injectable } from '@nestjs/common';
import { FilterFlightDto } from './dto/filter-flight.dto';
import { IFlightRepository } from './repository/flights.repository';
import { FLIGHT_REPOSITORY } from '../../utils/contants/repositories';

@Injectable()
export class FlightsService {
  constructor(
    @Inject(FLIGHT_REPOSITORY)
    private readonly flightRepository: IFlightRepository,
  ) {}

  async getFlightsByDetails(query: FilterFlightDto) {
    return await this.flightRepository.getFlightsByDetails(query);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { PASSENGER_REPOSITORY } from '../../utils/contants/repositories';
import { FilterPassengerDto } from './dto/filter-passenger.dto';
import { ResponsePassengerDto } from './dto/response-passenger.dto';
import { IPassengerRepository } from './passengers.repository';
import {
  PassengerWithBookingReference,
  PassengerWithFlights,
} from './repository/passenger.types';
import { PassengerMapper } from './utils/passenger.mapper';

@Injectable()
export class PassengersService {
  constructor(
    @Inject(PASSENGER_REPOSITORY)
    private readonly passengerRepository: IPassengerRepository,
  ) {}

  async getPassengerDetails(id: string): Promise<ResponsePassengerDto> {
    const passenger: PassengerWithFlights =
      await this.passengerRepository.getPassengerDetails(id);

    return PassengerMapper.toResponseDto(passenger);
  }

  async getPassengerById(id: string) {
    const passenger = await this.passengerRepository.getPassengerById(id);
    return passenger;
  }

  async getPassengersByFlightDetails(
    filter: FilterPassengerDto,
  ): Promise<ResponsePassengerDto[]> {
    let passengers: PassengerWithBookingReference[] =
      await this.passengerRepository.getPassengersByFlightDetails(filter);

    if (filter.connectingFlight) {
      passengers = passengers.filter((passenger) => {
        if (passenger.booking.bookingFlights.length > 1) {
          return passenger;
        }
      });
      console.log(JSON.stringify(passengers, null, 2));
    }
    return passengers.map((passenger) => ({
      passengerId: passenger.id,
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      bookingId: passenger.booking?.bookingReference || '',
    }));
  }
}

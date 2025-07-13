import { Injectable, Inject } from '@nestjs/common';
import {
  IPassengerRepository,
  PASSENGER_REPOSITORY,
} from './repository/passengers.repository';
import { PassengerWithFlights } from './repository/passenger.types';
import { ResponsePassengerDto } from './dto/response-passenger.dto';
import { FilterPassengerDto } from './dto/filter-passenger.dto';

@Injectable()
export class PassengersService {
  constructor(
    @Inject(PASSENGER_REPOSITORY)
    private readonly passengerRepository: IPassengerRepository,
  ) {}
  async getPassengerWithBookingFlightsById(id: string) {
    const passenger: PassengerWithFlights =
      await this.passengerRepository.getPassengerWithBookingFlightsById(id);

    const result: ResponsePassengerDto = {
      passengerId: passenger.id,
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      email: passenger.email,
      bookingId: passenger.booking?.id,
      flights:
        passenger.booking?.bookingFlights?.map((flight) => ({
          flightNumber: flight.flight.flightNumber,
          departureDate: flight.flight.departureDate,
          arrivalDate: flight.flight.arrivalDate,
          departureAirport: flight.flight.departureAirportId,
          arrivalAirport: flight.flight.arrivalAirportId,
        })) || [],
    };
    return result;
  }

  async getPassengerBasicById(id: string) {
    const passenger = await this.passengerRepository.getPassengerBasicById(id);
    return passenger;
  }

  async getListPassengers(query: FilterPassengerDto) {
    const passengers = await this.passengerRepository.getListPassengers(query);
    return passengers;
  }
}

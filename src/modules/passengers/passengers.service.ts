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

    // service orchestrator approach
    // @Inject(FLIGHT_REPOSITORY)
    // private readonly flightRepository: IFlightRepository,
    // @Inject(BOOKING_REPOSITORY)
    // private readonly bookingRepository: IBookingRepository,
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
    const passengers: PassengerWithBookingReference[] =
      await this.passengerRepository.getPassengersByFlightDetails(filter);

    return passengers.map((passenger) => ({
      passengerId: passenger.id,
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      bookingId: passenger.booking?.bookingReference || '',
    }));
  }

  // service orchestrator approach
  // async getPassengersByFlightDetails(flightDetails: FilterPassengerDto) {
  //   const flights = await this.flightRepository.getFlightsByDetails({
  //     flightNumber: flightDetails.flightNumber,
  //     departureDate: flightDetails.departureDate,
  //     arrivalDate: flightDetails.arrivalDate,
  //   });

  //   if (!flights.length) return [];

  //   const flightIds = flights.map((f) => f.id);

  //   const bookings =
  //     await this.bookingRepository.getBookingByFlightIds(flightIds);

  //   const bookingIds = bookings.map((b) => b.id);

  //   if (!bookingIds.length) return [];

  //   const passengers =
  //     await this.passengerRepository.getPassengersByBookingIds(bookingIds);

  //   const bookingReferenceMap = new Map(
  //     bookings.map((booking) => [booking.id, booking.bookingReference]),
  //   );

  //   return passengers.map((passenger) => ({
  //     passengerId: passenger.id,
  //     firstName: passenger.firstName,
  //     lastName: passenger.lastName,
  //     bookingId: bookingReferenceMap.get(passenger.bookingId),
  //   })) as ResponsePassengerDto[];
  // }
}

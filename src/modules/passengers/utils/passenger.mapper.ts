import { PassengerWithFlights } from '../repository/passenger.types';
import { ResponsePassengerDto } from '../dto/response-passenger.dto';
import { ResponseFlightDto } from 'src/modules/flights/dto/response-flight.dto';

export class PassengerMapper {
  static toResponseDto(passenger: PassengerWithFlights): ResponsePassengerDto {
    return {
      passengerId: passenger.id,
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      email: passenger.email || undefined,
      documentNumber: passenger.documentNumber || undefined,
      phone: passenger.phone || undefined,
      dateOfBirth: passenger.dateOfBirth || undefined,
      nationality: passenger.nationality || undefined,
      bookingId: passenger.booking?.id,
      flights: this.mapFlights(passenger),
    };
  }

  private static mapFlights(
    passenger: PassengerWithFlights,
  ): ResponseFlightDto[] {
    if (!passenger.booking?.bookingFlights?.length) {
      return [];
    }

    return passenger.booking.bookingFlights.map((bookingFlight) => ({
      flightNumber: bookingFlight.flight.flightNumber,
      departureDate: bookingFlight.flight.departureDate,
      arrivalDate: bookingFlight.flight.arrivalDate,
      departureAirport: bookingFlight.flight.departureAirportId,
      arrivalAirport: bookingFlight.flight.arrivalAirportId,
    }));
  }
}

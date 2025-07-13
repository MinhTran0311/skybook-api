export class ResponsePassengerDto {
  passengerId: string;
  firstName: string;
  lastName: string;
  email?: string;
  documentNumber?: string;
  phone?: string;
  dateOfBirth?: Date;
  nationality?: string;
  bookingId?: string;
  flights?: FlightDto[];
}

export class FlightDto {
  flightNumber: string;
  departureDate: Date;
  arrivalDate: Date;
  departureAirport: string;
  arrivalAirport: string;
}

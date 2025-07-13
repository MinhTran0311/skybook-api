export class ResponsePassengerDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  documentNumber: string;
  phone?: string;
  dateOfBirth?: Date;
  nationality?: string;
  bookingReference?: string;
  flightNumber?: string;
  departureDate?: Date;
  arrivalDate?: Date;
}

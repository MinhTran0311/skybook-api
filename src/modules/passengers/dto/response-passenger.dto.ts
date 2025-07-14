import { ResponseFlightDto } from 'src/modules/flights/dto/response-flight.dto';

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
  flights?: ResponseFlightDto[];
}

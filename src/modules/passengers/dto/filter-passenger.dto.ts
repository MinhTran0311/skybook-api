import { IsDate, IsString, IsUUID } from 'class-validator';

export class FilterPassengerDto {
  @IsUUID()
  id?: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  bookingReference?: string;

  @IsString()
  flightNumber?: string;

  @IsDate()
  departureDate?: Date;

  @IsDate()
  arrivalDate?: Date;
}

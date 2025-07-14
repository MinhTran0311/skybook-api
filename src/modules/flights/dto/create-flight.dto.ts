import { IsString, IsDateString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateFlightDto {
  @IsNotEmpty()
  @IsString()
  flightNumber: string;

  @IsNotEmpty()
  @IsDateString()
  departureDate: string;

  @IsNotEmpty()
  @IsDateString()
  arrivalDate: string;

  @IsNotEmpty()
  @IsString()
  departureAirportId: string;

  @IsNotEmpty()
  @IsString()
  arrivalAirportId: string;
}

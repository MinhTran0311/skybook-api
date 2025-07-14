import { IsOptional, IsString, IsDateString, IsUUID } from 'class-validator';

export class FilterFlightDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  flightNumber?: string;

  @IsOptional()
  @IsDateString()
  departureDate?: Date;

  @IsOptional()
  @IsDateString()
  arrivalDate?: Date;

  @IsOptional()
  @IsUUID()
  departureAirportId?: string;

  @IsOptional()
  @IsUUID()
  arrivalAirportId?: string;
}

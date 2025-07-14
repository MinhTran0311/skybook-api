import { IsOptional, IsString, IsDateString, IsUUID } from 'class-validator';

export class FilterFlightDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  flightNumber?: string;

  @IsOptional()
  @IsString()
  departureDate?: string;

  @IsOptional()
  @IsString()
  arrivalDate?: string;

  @IsOptional()
  @IsUUID()
  departureAirportId?: string;

  @IsOptional()
  @IsUUID()
  arrivalAirportId?: string;
}

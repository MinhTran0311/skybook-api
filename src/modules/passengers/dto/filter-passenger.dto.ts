import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterPassengerDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  bookingReference?: string;

  @IsOptional()
  @IsString()
  flightNumber?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  departureDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  arrivalDate?: Date;

  @IsOptional()
  @IsString()
  connectingFlight?: string;
}

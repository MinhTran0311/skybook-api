import { IsOptional, IsString, IsDateString, IsUUID } from 'class-validator';

export class FilterBookingDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  bookingReference?: string;
}

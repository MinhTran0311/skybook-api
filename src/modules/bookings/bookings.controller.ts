import {
  Controller,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get(':id')
  async getBookingByDetails(@Param('id') id: string) {
    try {
      return await this.bookingsService.getBookingByDetails({ id });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve booking');
    }
  }
}

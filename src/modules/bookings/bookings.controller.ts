import { Controller, Get, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get(':id')
  async getBookingByDetails(@Param('id') id: string) {
    return await this.bookingsService.getBookingByDetails({ id });
  }
}

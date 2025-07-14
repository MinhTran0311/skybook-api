import { Inject, Injectable } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '../../utils/contants/repositories';
import { IBookingRepository } from './bookings.repository';
import { FilterBookingDto } from './dto/filter-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async getBookingByDetails(details: FilterBookingDto) {
    return await this.bookingRepository.getBookingByDetails(details);
  }
}

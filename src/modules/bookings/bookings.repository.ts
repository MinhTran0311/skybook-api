import { Injectable } from '@nestjs/common';
import { Booking, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FilterBookingDto } from './dto/filter-booking.dto';

export interface IBookingRepository {
  getBookingByFlightIds(flightIds: string[]): Promise<Booking[]>;
  getBookingByDetails(details: FilterBookingDto): Promise<Booking | null>;
}

@Injectable()
export class BookingsRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getBookingByFlightIds(flightIds: string[]): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: {
        bookingFlights: {
          some: {
            flightId: {
              in: flightIds,
            },
          },
        },
      },
    });
  }

  async getBookingByDetails(
    details: FilterBookingDto,
  ): Promise<Booking | null> {
    const where: Prisma.BookingWhereInput = {};

    if (details.id) {
      where.id = details.id;
    }

    if (details.bookingReference) {
      where.bookingReference = details.bookingReference;
    }

    return this.prisma.booking.findFirst({
      where,
    });
  }
}

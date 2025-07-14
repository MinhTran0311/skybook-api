import { Injectable } from '@nestjs/common';
import { Flight, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FilterFlightDto } from '../dto/filter-flight.dto';

export interface IFlightRepository {
  getFlightsByDetails(query: FilterFlightDto): Promise<Flight[]>;
}

@Injectable()
export class FlightsRepository implements IFlightRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getFlightsByDetails(query: FilterFlightDto): Promise<Flight[]> {
    const {
      id,
      flightNumber,
      departureDate,
      arrivalDate,
      departureAirportId,
      arrivalAirportId,
    } = query;

    const where: Prisma.FlightWhereInput = {};

    if (id) {
      where.id = id;
    }

    if (flightNumber) {
      where.flightNumber = flightNumber;
    }

    if (arrivalDate) {
      // Create a date range for the entire day
      const startOfDay = new Date(arrivalDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(arrivalDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      where.arrivalDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (departureDate) {
      const startOfDay = new Date(departureDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(departureDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      where.departureDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (departureAirportId) {
      where.departureAirportId = departureAirportId;
    }

    if (arrivalAirportId) {
      where.arrivalAirportId = arrivalAirportId;
    }

    console.log('query', query);

    const flights = await this.prisma.flight.findMany({
      where,
    });

    return flights;
  }
}

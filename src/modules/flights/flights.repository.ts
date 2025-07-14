import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Flight, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { FilterFlightDto } from './dto/filter-flight.dto';

export interface IFlightRepository {
  getFlightsByDetails(query: FilterFlightDto): Promise<Flight[]>;
  createFlight(createFlightDto: CreateFlightDto): Promise<Flight>;
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

    const flights = await this.prisma.flight.findMany({
      where,
    });

    return flights;
  }

  async createFlight(createFlightDto: CreateFlightDto): Promise<Flight> {
    const {
      flightNumber,
      departureDate,
      arrivalDate,
      departureAirportId,
      arrivalAirportId,
    } = createFlightDto;

    const [departureAirport, arrivalAirport] = await Promise.all([
      this.prisma.airport.findUnique({
        where: { id: departureAirportId },
      }),
      this.prisma.airport.findUnique({
        where: { id: arrivalAirportId },
      }),
    ]);

    if (!departureAirport) {
      throw new NotFoundException(
        `Departure airport with ID ${departureAirportId} not found`,
      );
    }

    if (!arrivalAirport) {
      throw new NotFoundException(
        `Arrival airport with ID ${arrivalAirportId} not found`,
      );
    }

    const departure = new Date(departureDate);
    const arrival = new Date(arrivalDate);

    if (departure >= arrival) {
      throw new BadRequestException(
        'Departure date must be before arrival date',
      );
    }

    const flight = await this.prisma.flight.create({
      data: {
        flightNumber,
        departureDate: departure,
        arrivalDate: arrival,
        departureAirportId,
        arrivalAirportId,
      },
    });

    return flight;
  }
}

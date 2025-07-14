import { Injectable, NotFoundException } from '@nestjs/common';
import { Passenger, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  PassengerWithFlights,
  passengerDetailsQuery,
  PassengerWithBookingReference,
  passengerWithBookingReferenceQuery,
} from './passenger.types';
import { FilterPassengerDto } from '../dto/filter-passenger.dto';

export interface IPassengerRepository {
  getPassengerDetails(id: string): Promise<PassengerWithFlights>;
  getPassengerById(id: string): Promise<Passenger>;
  // getPassengersByBookingIds(bookingIds: string[]): Promise<Passenger[]>;
  getPassengersByFlightDetails(
    filter: FilterPassengerDto,
  ): Promise<PassengerWithBookingReference[]>;
}

@Injectable()
export class PassengersRepository implements IPassengerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPassengerDetails(id: string): Promise<PassengerWithFlights> {
    try {
      const passengerWithFlights =
        await this.prisma.passenger.findUniqueOrThrow({
          where: { id },
          ...passengerDetailsQuery,
        });

      return passengerWithFlights;
    } catch (error) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
  }

  async getPassengerById(id: string): Promise<Passenger> {
    try {
      const passenger = await this.prisma.passenger.findUniqueOrThrow({
        where: { id },
      });
      return passenger;
    } catch (error) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
  }

  async getPassengersByFlightDetails(
    filter: FilterPassengerDto,
  ): Promise<PassengerWithBookingReference[]> {
    const { flightNumber, departureDate, arrivalDate } = filter;

    const departureDateFilter = departureDate
      ? {
          gte: new Date(new Date(departureDate).setUTCHours(0, 0, 0, 0)),
          lte: new Date(new Date(departureDate).setUTCHours(23, 59, 59, 999)),
        }
      : undefined;

    const arrivalDateFilter = arrivalDate
      ? {
          gte: new Date(new Date(arrivalDate).setUTCHours(0, 0, 0, 0)),
          lte: new Date(new Date(arrivalDate).setUTCHours(23, 59, 59, 999)),
        }
      : undefined;

    // Find passengers with bookings on the specified flight
    return this.prisma.passenger.findMany({
      where: {
        booking: {
          bookingFlights: {
            some: {
              flight: {
                flightNumber: flightNumber || undefined,
                departureDate: departureDateFilter,
                arrivalDate: arrivalDateFilter,
              },
            },
          },
        },
      },
      ...passengerWithBookingReferenceQuery,
    });
  }

  // service orchestrator approach
  // async getPassengersByBookingIds(bookingIds: string[]): Promise<Passenger[]> {
  //   return this.prisma.passenger.findMany({
  //     where: { bookingId: { in: bookingIds } },
  //   });
  // }
}

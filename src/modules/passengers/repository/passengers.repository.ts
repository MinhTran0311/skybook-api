import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreatePassengerDto } from '../dto/create-passenger.dto';
import { FilterPassengerDto } from '../dto/filter-passenger.dto';
import { UpdatePassengerDto } from '../dto/update-passenger.dto';
import {
  PassengerWithFlights,
  PassengerBasic,
  passengerWithFlightsQuery,
} from './passenger.types';

export const PASSENGER_REPOSITORY = 'PASSENGER_REPOSITORY';

export interface IPassengerRepository {
  getPassengerWithBookingFlightsById(id: string): Promise<PassengerWithFlights>;
  getPassengerBasicById(id: string): Promise<PassengerBasic>;
  getListPassengers(query: FilterPassengerDto): Promise<PassengerBasic[]>;
  createPassenger(passenger: CreatePassengerDto): Promise<PassengerBasic>;
  updatePassenger(
    id: string,
    passenger: UpdatePassengerDto,
  ): Promise<PassengerBasic>;
  deletePassenger(id: string): Promise<PassengerBasic>;
}

@Injectable()
export class PassengersRepository implements IPassengerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPassengerWithBookingFlightsById(
    id: string,
  ): Promise<PassengerWithFlights> {
    try {
      const passengerWithFlights =
        await this.prisma.passenger.findUniqueOrThrow({
          where: { id },
          ...passengerWithFlightsQuery,
        });

      return passengerWithFlights;
    } catch (error) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
  }

  async getListPassengers(
    query: FilterPassengerDto,
  ): Promise<PassengerBasic[]> {
    const {
      id,
      firstName,
      lastName,
      bookingReference,
      flightNumber,
      departureDate,
      arrivalDate,
    } = query;
    const where: Prisma.PassengerWhereInput = {};
    if (id) {
      where.id = id;
    }
    if (firstName) {
      where.firstName = firstName;
    }
    if (lastName) {
      where.lastName = lastName;
    }

    const passengers = await this.prisma.passenger.findMany({
      where,
    });

    return passengers;
  }
  createPassenger(passenger: CreatePassengerDto): Promise<PassengerBasic> {
    throw new Error('Method not implemented.');
  }
  updatePassenger(
    id: string,
    passenger: UpdatePassengerDto,
  ): Promise<PassengerBasic> {
    throw new Error('Method not implemented.');
  }
  deletePassenger(id: string): Promise<PassengerBasic> {
    throw new Error('Method not implemented.');
  }

  async getPassengerBasicById(id: string): Promise<PassengerBasic> {
    try {
      const passenger = await this.prisma.passenger.findUniqueOrThrow({
        where: { id },
      });
      return passenger;
    } catch (error) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreatePassengerDto } from '../dto/create-passenger.dto';
import { FilterPassengerDto } from '../dto/filter-passenger.dto';
import { UpdatePassengerDto } from '../dto/update-passenger.dto';

export const PASSENGER_REPOSITORY = 'PASSENGER_REPOSITORY';

export interface IPassengerRepository {
  getPassengerById(id: string): Promise<Prisma.PassengerGetPayload<{}>>;
  getPassengerByFilters(
    query: FilterPassengerDto,
  ): Promise<Prisma.PassengerGetPayload<{}>>;
  createPassenger(
    passenger: CreatePassengerDto,
  ): Promise<Prisma.PassengerGetPayload<{}>>;
  updatePassenger(
    id: string,
    passenger: UpdatePassengerDto,
  ): Promise<Prisma.PassengerGetPayload<{}>>;
  deletePassenger(id: string): Promise<Prisma.PassengerGetPayload<{}>>;
}

@Injectable()
export class PassengersRepository implements IPassengerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPassengerById(id: string): Promise<Prisma.PassengerGetPayload<{}>> {
    try {
      const passenger = await this.prisma.passenger.findUniqueOrThrow({
        where: { id },
      });
      return passenger;
    } catch (error) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
  }

  getPassengerByFilters(
    query: FilterPassengerDto,
  ): Promise<Prisma.PassengerGetPayload<{}>> {
    throw new Error('Method not implemented.');
  }
  createPassenger(
    passenger: CreatePassengerDto,
  ): Promise<Prisma.PassengerGetPayload<{}>> {
    throw new Error('Method not implemented.');
  }
  updatePassenger(
    id: string,
    passenger: UpdatePassengerDto,
  ): Promise<Prisma.PassengerGetPayload<{}>> {
    throw new Error('Method not implemented.');
  }
  deletePassenger(id: string): Promise<Prisma.PassengerGetPayload<{}>> {
    throw new Error('Method not implemented.');
  }
}

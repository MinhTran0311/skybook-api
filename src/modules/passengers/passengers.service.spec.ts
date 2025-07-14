import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PASSENGER_REPOSITORY } from '../../utils/contants/repositories';
import { FilterPassengerDto } from './dto/filter-passenger.dto';
import { PassengersService } from './passengers.service';
import {
  PassengerWithBookingReference,
  PassengerWithFlights,
} from './repository/passenger.types';
import { IPassengerRepository } from './repository/passengers.repository';

describe('PassengersService', () => {
  let service: PassengersService;
  let mockRepository: jest.Mocked<IPassengerRepository>;

  beforeEach(async () => {
    // Create a mock repository
    const mockRepositoryImpl: jest.Mocked<IPassengerRepository> = {
      getPassengerDetails: jest.fn(),
      getPassengerById: jest.fn(),
      getPassengersByFlightDetails: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassengersService,
        {
          provide: PASSENGER_REPOSITORY,
          useValue: mockRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<PassengersService>(PassengersService);
    mockRepository = module.get(PASSENGER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPassengerById', () => {
    it('should return a passenger when found', async () => {
      const mockPassenger = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        documentNumber: 'ABC123',
        bookingId: 'booking-123',
        phone: null,
        dateOfBirth: null,
        nationality: null,
      };

      mockRepository.getPassengerById.mockResolvedValue(mockPassenger);

      const result = await service.getPassengerById('123');

      expect(result).toEqual(mockPassenger);
      expect(mockRepository.getPassengerById).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException when passenger not found', async () => {
      mockRepository.getPassengerById.mockRejectedValue(
        new NotFoundException('Passenger with ID 999 not found'),
      );

      await expect(service.getPassengerById('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.getPassengerById).toHaveBeenCalledWith('999');
    });
  });

  describe('getPassengerDetails', () => {
    it('should return passenger details with flights when found', async () => {
      // Mock the passenger with flights according to the Prisma schema
      const mockPassengerWithFlights = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        documentNumber: 'ABC123',
        bookingId: 'booking-123',
        phone: null,
        dateOfBirth: null,
        nationality: null,
        booking: {
          id: 'booking-123',
          customerId: 'customer-1',
          bookingReference: 'BR123',
          createdAt: new Date(),
          bookingFlights: [
            {
              id: 'bf-1',
              bookingId: 'booking-123',
              flightId: 'flight-1',
              createdAt: new Date(),
              flight: {
                id: 'flight-1',
                flightNumber: 'FL001',
                departureDate: new Date('2023-07-15T10:00:00Z'),
                arrivalDate: new Date('2023-07-15T12:00:00Z'),
                departureAirportId: 'LHR',
                arrivalAirportId: 'JFK',
              },
            },
          ],
        },
      } as unknown as PassengerWithFlights;

      const expectedResponse = {
        passengerId: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        bookingId: 'booking-123',
        flights: [
          {
            flightNumber: 'FL001',
            departureDate: new Date('2023-07-15T10:00:00Z'),
            arrivalDate: new Date('2023-07-15T12:00:00Z'),
            departureAirport: 'LHR',
            arrivalAirport: 'JFK',
          },
        ],
      };

      mockRepository.getPassengerDetails.mockResolvedValue(
        mockPassengerWithFlights,
      );

      const result = await service.getPassengerDetails('123');

      expect(result).toEqual(expectedResponse);
      expect(mockRepository.getPassengerDetails).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException when passenger details not found', async () => {
      mockRepository.getPassengerDetails.mockRejectedValue(
        new NotFoundException('Passenger with ID 999 not found'),
      );

      await expect(service.getPassengerDetails('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.getPassengerDetails).toHaveBeenCalledWith('999');
    });
  });

  describe('getPassengersByFlightDetails', () => {
    it('should return passengers for a given flight', async () => {
      const filter: FilterPassengerDto = {
        flightNumber: 'FL001',
        departureDate: new Date('2023-07-15'),
      };

      // Mock passengers with booking reference according to the Prisma schema
      const mockPassengersWithBookingReference = [
        {
          id: '123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          documentNumber: 'ABC123',
          bookingId: 'booking-123',
          phone: null,
          dateOfBirth: null,
          nationality: null,
          booking: {
            id: 'booking-123',
            bookingReference: 'BR123',
          },
        },
        {
          id: '456',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          documentNumber: 'DEF456',
          bookingId: 'booking-456',
          phone: null,
          dateOfBirth: null,
          nationality: null,
          booking: {
            id: 'booking-456',
            bookingReference: 'BR456',
          },
        },
      ] as unknown as PassengerWithBookingReference[];

      const expectedResponse = [
        {
          passengerId: '123',
          firstName: 'John',
          lastName: 'Doe',
          bookingId: 'BR123',
        },
        {
          passengerId: '456',
          firstName: 'Jane',
          lastName: 'Smith',
          bookingId: 'BR456',
        },
      ];

      mockRepository.getPassengersByFlightDetails.mockResolvedValue(
        mockPassengersWithBookingReference,
      );

      const result = await service.getPassengersByFlightDetails(filter);

      expect(result).toEqual(expectedResponse);
      expect(mockRepository.getPassengersByFlightDetails).toHaveBeenCalledWith(
        filter,
      );
    });

    it('should handle passengers with no booking reference', async () => {
      const filter: FilterPassengerDto = {
        flightNumber: 'FL001',
      };

      // For the null booking case, we need to use a type assertion
      const mockPassengersWithBookingReference = [
        {
          id: '123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          documentNumber: 'ABC123',
          bookingId: 'booking-123',
          phone: null,
          dateOfBirth: null,
          nationality: null,
          booking: null,
        },
      ] as unknown as PassengerWithBookingReference[];

      const expectedResponse = [
        {
          passengerId: '123',
          firstName: 'John',
          lastName: 'Doe',
          bookingId: '',
        },
      ];

      mockRepository.getPassengersByFlightDetails.mockResolvedValue(
        mockPassengersWithBookingReference,
      );

      const result = await service.getPassengersByFlightDetails(filter);

      expect(result).toEqual(expectedResponse);
      expect(mockRepository.getPassengersByFlightDetails).toHaveBeenCalledWith(
        filter,
      );
    });

    it('should return an empty array when no passengers are found', async () => {
      const filter: FilterPassengerDto = {
        flightNumber: 'NONEXISTENT',
      };

      mockRepository.getPassengersByFlightDetails.mockResolvedValue([]);

      const result = await service.getPassengersByFlightDetails(filter);

      expect(result).toEqual([]);
      expect(mockRepository.getPassengersByFlightDetails).toHaveBeenCalledWith(
        filter,
      );
    });
  });
});

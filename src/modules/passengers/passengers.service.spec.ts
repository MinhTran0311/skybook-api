import { Test, TestingModule } from '@nestjs/testing';
import { PassengersService } from './passengers.service';
import {
  IPassengerRepository,
  PASSENGER_REPOSITORY,
} from './repository/passengers.repository';
import { NotFoundException } from '@nestjs/common';

describe('PassengersService', () => {
  let service: PassengersService;
  let mockRepository: jest.Mocked<IPassengerRepository>;

  beforeEach(async () => {
    // Create a mock repository
    const mockRepositoryImpl: jest.Mocked<IPassengerRepository> = {
      getPassengerWithBookingFlightsById: jest.fn(),
      getPassengerBasicById: jest.fn(),
      getPassengerByFilters: jest.fn(),
      createPassenger: jest.fn(),
      updatePassenger: jest.fn(),
      deletePassenger: jest.fn(),
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
});

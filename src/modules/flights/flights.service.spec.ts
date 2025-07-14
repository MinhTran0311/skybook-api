import {
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FLIGHT_REPOSITORY } from '../../utils/contants/repositories';
import { CreateFlightDto } from './dto/create-flight.dto';
import { FilterFlightDto } from './dto/filter-flight.dto';
import { IFlightRepository } from './flights.repository';
import { FlightsService } from './flights.service';

describe('FlightsService', () => {
  let service: FlightsService;
  let mockRepository: jest.Mocked<IFlightRepository>;

  beforeEach(async () => {
    // Create a mock repository
    const mockRepositoryImpl: jest.Mocked<IFlightRepository> = {
      getFlightsByDetails: jest.fn(),
      createFlight: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlightsService,
        {
          provide: FLIGHT_REPOSITORY,
          useValue: mockRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<FlightsService>(FlightsService);
    mockRepository = module.get(FLIGHT_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFlightsByDetails', () => {
    it('should return flights when found by flightNumber', async () => {
      const filter: FilterFlightDto = {
        flightNumber: 'FL001',
      };

      const mockFlights = [
        {
          id: 'flight-1',
          flightNumber: 'FL001',
          departureDate: new Date('2023-07-15T10:00:00Z'),
          arrivalDate: new Date('2023-07-15T12:00:00Z'),
          departureAirportId: 'LHR',
          arrivalAirportId: 'JFK',
        },
      ];

      mockRepository.getFlightsByDetails.mockResolvedValue(mockFlights);

      const result = await service.getFlightsByDetails(filter);

      expect(result).toEqual(mockFlights);
      expect(mockRepository.getFlightsByDetails).toHaveBeenCalledWith(filter);
    });

    it('should return flights when found by date range', async () => {
      const departureDate = '2023-07-15T00:00:00.000Z';
      const filter: FilterFlightDto = {
        departureDate,
      };

      const mockFlights = [
        {
          id: 'flight-1',
          flightNumber: 'FL001',
          departureDate: new Date('2023-07-15T10:00:00Z'),
          arrivalDate: new Date('2023-07-15T12:00:00Z'),
          departureAirportId: 'LHR',
          arrivalAirportId: 'JFK',
        },
        {
          id: 'flight-2',
          flightNumber: 'FL002',
          departureDate: new Date('2023-07-15T14:00:00Z'),
          arrivalDate: new Date('2023-07-15T16:00:00Z'),
          departureAirportId: 'LHR',
          arrivalAirportId: 'CDG',
        },
      ];

      mockRepository.getFlightsByDetails.mockResolvedValue(mockFlights);

      const result = await service.getFlightsByDetails(filter);

      expect(result).toEqual(mockFlights);
      expect(mockRepository.getFlightsByDetails).toHaveBeenCalledWith(filter);
    });

    it('should return flights when found by airports', async () => {
      const filter: FilterFlightDto = {
        departureAirportId: 'LHR',
        arrivalAirportId: 'JFK',
      };

      const mockFlights = [
        {
          id: 'flight-1',
          flightNumber: 'FL001',
          departureDate: new Date('2023-07-15T10:00:00Z'),
          arrivalDate: new Date('2023-07-15T12:00:00Z'),
          departureAirportId: 'LHR',
          arrivalAirportId: 'JFK',
        },
        {
          id: 'flight-3',
          flightNumber: 'FL003',
          departureDate: new Date('2023-07-16T10:00:00Z'),
          arrivalDate: new Date('2023-07-16T12:00:00Z'),
          departureAirportId: 'LHR',
          arrivalAirportId: 'JFK',
        },
      ];

      mockRepository.getFlightsByDetails.mockResolvedValue(mockFlights);

      const result = await service.getFlightsByDetails(filter);

      expect(result).toEqual(mockFlights);
      expect(mockRepository.getFlightsByDetails).toHaveBeenCalledWith(filter);
    });

    it('should return empty array when no flights are found', async () => {
      const filter: FilterFlightDto = {
        flightNumber: 'NONEXISTENT',
      };

      mockRepository.getFlightsByDetails.mockResolvedValue([]);

      const result = await service.getFlightsByDetails(filter);

      expect(result).toEqual([]);
      expect(mockRepository.getFlightsByDetails).toHaveBeenCalledWith(filter);
    });
  });

  describe('createFlight', () => {
    it('should create a flight successfully', async () => {
      const createFlightDto: CreateFlightDto = {
        flightNumber: 'FL001',
        departureDate: '2023-07-15T10:00:00.000Z',
        arrivalDate: '2023-07-15T12:00:00.000Z',
        departureAirportId: 'LHR',
        arrivalAirportId: 'JFK',
      };

      const mockCreatedFlight = {
        id: 'flight-1',
        flightNumber: 'FL001',
        departureDate: new Date('2023-07-15T10:00:00.000Z'),
        arrivalDate: new Date('2023-07-15T12:00:00.000Z'),
        departureAirportId: 'LHR',
        arrivalAirportId: 'JFK',
      };

      mockRepository.createFlight.mockResolvedValue(mockCreatedFlight);

      const result = await service.createFlight(createFlightDto);

      expect(result).toEqual(mockCreatedFlight);
      expect(mockRepository.createFlight).toHaveBeenCalledWith(createFlightDto);
    });

    it('should throw NotFoundException when airport not found', async () => {
      const createFlightDto: CreateFlightDto = {
        flightNumber: 'FL001',
        departureDate: '2023-07-15T10:00:00.000Z',
        arrivalDate: '2023-07-15T12:00:00.000Z',
        departureAirportId: 'LHR',
        arrivalAirportId: 'JFK',
      };

      mockRepository.createFlight.mockRejectedValue(
        new NotFoundException('Departure airport with ID LHR not found'),
      );

      await expect(service.createFlight(createFlightDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.createFlight).toHaveBeenCalledWith(createFlightDto);
    });

    it('should throw BadRequestException when date validation fails', async () => {
      const createFlightDto: CreateFlightDto = {
        flightNumber: 'FL001',
        departureDate: '2023-07-15T12:00:00.000Z',
        arrivalDate: '2023-07-15T10:00:00.000Z',
        departureAirportId: 'LHR',
        arrivalAirportId: 'JFK',
      };

      mockRepository.createFlight.mockRejectedValue(
        new BadRequestException('Departure date must be before arrival date'),
      );

      await expect(service.createFlight(createFlightDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.createFlight).toHaveBeenCalledWith(createFlightDto);
    });
  });
});

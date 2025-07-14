import { Test, TestingModule } from '@nestjs/testing';
import { BOOKING_REPOSITORY } from '../../utils/contants/repositories';
import { BookingsService } from './bookings.service';
import { FilterBookingDto } from './dto/filter-booking.dto';
import { IBookingRepository } from './bookings.repository';
import { NotFoundException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let mockRepository: jest.Mocked<IBookingRepository>;

  beforeEach(async () => {
    // Create a mock repository
    const mockRepositoryImpl: jest.Mocked<IBookingRepository> = {
      getBookingByFlightIds: jest.fn(),
      getBookingByDetails: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: BOOKING_REPOSITORY,
          useValue: mockRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    mockRepository = module.get(BOOKING_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBookingByDetails', () => {
    it('should return a booking when found by id', async () => {
      const filter: FilterBookingDto = {
        id: 'booking-123',
      };

      const mockBooking = {
        id: 'booking-123',
        customerId: 'customer-1',
        bookingReference: 'BRR123',
        createdAt: new Date(),
      };

      mockRepository.getBookingByDetails.mockResolvedValue(mockBooking);

      const result = await service.getBookingByDetails(filter);

      expect(result).toEqual(mockBooking);
      expect(mockRepository.getBookingByDetails).toHaveBeenCalledWith(filter);
    });

    it('should return a booking when found by bookingReference', async () => {
      const filter: FilterBookingDto = {
        bookingReference: 'BRR123',
      };

      const mockBooking = {
        id: 'booking-123',
        customerId: 'customer-1',
        bookingReference: 'BRR123',
        createdAt: new Date(),
      };

      mockRepository.getBookingByDetails.mockResolvedValue(mockBooking);

      const result = await service.getBookingByDetails(filter);

      expect(result).toEqual(mockBooking);
      expect(mockRepository.getBookingByDetails).toHaveBeenCalledWith(filter);
    });

    it('should throw NotFoundException when booking is not found', async () => {
      const filter: FilterBookingDto = {
        id: 'nonexistent-id',
      };

      mockRepository.getBookingByDetails.mockRejectedValue(
        new NotFoundException('Booking with ID nonexistent-id not found'),
      );

      await expect(service.getBookingByDetails(filter)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.getBookingByDetails).toHaveBeenCalledWith(filter);
    });
  });
});

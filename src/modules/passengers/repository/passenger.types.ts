import { Prisma } from '@prisma/client';

export const passengerDetailsQuery =
  Prisma.validator<Prisma.PassengerDefaultArgs>()({
    include: {
      booking: {
        include: {
          bookingFlights: {
            include: {
              flight: true,
            },
          },
        },
      },
    },
  });

export const passengerWithBookingReferenceQuery =
  Prisma.validator<Prisma.PassengerDefaultArgs>()({
    include: {
      booking: {
        select: {
          id: true,
          bookingReference: true,
        },
      },
    },
  });

export type PassengerWithFlights = Prisma.PassengerGetPayload<
  typeof passengerDetailsQuery
>;

export type PassengerWithBookingReference = Prisma.PassengerGetPayload<
  typeof passengerWithBookingReferenceQuery
>;

import { Prisma } from '@prisma/client';

export const passengerWithFlightsQuery =
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

export type PassengerWithFlights = Prisma.PassengerGetPayload<
  typeof passengerWithFlightsQuery
>;

export type PassengerBasic = Prisma.PassengerGetPayload<{}>;

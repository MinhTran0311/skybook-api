import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.ticket.deleteMany();
  await prisma.bookingFlight.deleteMany();
  await prisma.passenger.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.airport.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create airports
  const airports = await Promise.all([
    prisma.airport.create({
      data: {
        id: 'HEL',
        name: 'Helsinki Airport',
        location: 'Helsinki, Finland',
      },
    }),
    prisma.airport.create({
      data: {
        id: 'LHR',
        name: 'London Heathrow Airport',
        location: 'London, United Kingdom',
      },
    }),
    prisma.airport.create({
      data: {
        id: 'CDG',
        name: 'Charles de Gaulle Airport',
        location: 'Paris, France',
      },
    }),
    prisma.airport.create({
      data: {
        id: 'JFK',
        name: 'John F. Kennedy International Airport',
        location: 'New York, USA',
      },
    }),
    prisma.airport.create({
      data: {
        id: 'NRT',
        name: 'Narita International Airport',
        location: 'Tokyo, Japan',
      },
    }),
    prisma.airport.create({
      data: {
        id: 'ARN',
        name: 'Stockholm Arlanda Airport',
        location: 'Stockholm, Sweden',
      },
    }),
    prisma.airport.create({
      data: {
        id: 'CPH',
        name: 'Copenhagen Airport',
        location: 'Copenhagen, Denmark',
      },
    }),
  ]);

  console.log('✈️  Created airports');

  // Create flights
  const flights = await Promise.all([
    // Helsinki to London
    prisma.flight.create({
      data: {
        flightNumber: 'AY1331',
        departureDate: new Date('2024-03-15T08:30:00Z'),
        arrivalDate: new Date('2024-03-15T10:45:00Z'),
        departureAirportId: 'HEL',
        arrivalAirportId: 'LHR',
      },
    }),
    // London to Paris
    prisma.flight.create({
      data: {
        flightNumber: 'AY1234',
        departureDate: new Date('2024-03-15T14:00:00Z'),
        arrivalDate: new Date('2024-03-15T16:15:00Z'),
        departureAirportId: 'LHR',
        arrivalAirportId: 'CDG',
      },
    }),
    // Paris to New York
    prisma.flight.create({
      data: {
        flightNumber: 'AY5',
        departureDate: new Date('2024-03-17T11:00:00Z'),
        arrivalDate: new Date('2024-03-17T14:30:00Z'),
        departureAirportId: 'CDG',
        arrivalAirportId: 'JFK',
      },
    }),
    // Helsinki to Tokyo
    prisma.flight.create({
      data: {
        flightNumber: 'AY71',
        departureDate: new Date('2024-03-20T13:00:00Z'),
        arrivalDate: new Date('2024-03-21T06:30:00Z'),
        departureAirportId: 'HEL',
        arrivalAirportId: 'NRT',
      },
    }),
    // Helsinki to Stockholm
    prisma.flight.create({
      data: {
        flightNumber: 'AY811',
        departureDate: new Date('2024-03-25T09:15:00Z'),
        arrivalDate: new Date('2024-03-25T10:30:00Z'),
        departureAirportId: 'HEL',
        arrivalAirportId: 'ARN',
      },
    }),
    // Stockholm to Copenhagen
    prisma.flight.create({
      data: {
        flightNumber: 'AY1235',
        departureDate: new Date('2024-03-26T12:00:00Z'),
        arrivalDate: new Date('2024-03-26T13:15:00Z'),
        departureAirportId: 'ARN',
        arrivalAirportId: 'CPH',
      },
    }),
    // Copenhagen to Helsinki
    prisma.flight.create({
      data: {
        flightNumber: 'AY812',
        departureDate: new Date('2024-03-27T16:00:00Z'),
        arrivalDate: new Date('2024-03-27T17:15:00Z'),
        departureAirportId: 'CPH',
        arrivalAirportId: 'HEL',
      },
    }),
  ]);

  console.log('🛫 Created flights');

  // Create customers
  const hashedPassword = await hash('password123', 10);

  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        firstName: 'Mika',
        lastName: 'Virtanen',
        email: 'mika.virtanen@email.com',
        password: hashedPassword,
        phone: '+358401234567',
        loyaltyNumber: 'AY123456789',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Anna',
        lastName: 'Korhonen',
        email: 'anna.korhonen@email.com',
        password: hashedPassword,
        phone: '+358409876543',
        loyaltyNumber: 'AY987654321',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Erik',
        lastName: 'Andersson',
        email: 'erik.andersson@email.com',
        password: hashedPassword,
        phone: '+46701234567',
        loyaltyNumber: 'AY456789123',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        password: hashedPassword,
        phone: '+1234567890',
        loyaltyNumber: 'AY789123456',
      },
    }),
  ]);

  console.log('👥 Created customers');

  // Scenario 1: Single customer, single flight booking (Mika to London)
  const booking1 = await prisma.booking.create({
    data: {
      customerId: customers[0].id,
      bookingReference: 'ABC123',
    },
  });

  const bookingFlight1 = await prisma.bookingFlight.create({
    data: {
      bookingId: booking1.id,
      flightId: flights[0].id,
    },
  });

  const bookingFlight10 = await prisma.bookingFlight.create({
    data: {
      bookingId: booking1.id,
      flightId: flights[1].id,
    },
  });

  const passenger1 = await prisma.passenger.create({
    data: {
      bookingId: booking1.id,
      firstName: 'Mika',
      lastName: 'Virtanen',
      email: 'mika.virtanen@email.com',
      documentNumber: 'FIN123456789',
      phone: '+358401234567',
      dateOfBirth: new Date('1985-03-15'),
      nationality: 'Finnish',
    },
  });

  await prisma.ticket.create({
    data: {
      passengerId: passenger1.id,
      bookingFlightId: bookingFlight1.id,
      ticketNumber: '105-2403184567',
      travelClass: 'Economy',
      seatNumber: '12A',
      boardingGroup: 'A',
      isCheckedIn: true,
    },
  });

  await prisma.ticket.create({
    data: {
      passengerId: passenger1.id,
      bookingFlightId: bookingFlight10.id,
      ticketNumber: '105-2403184544',
      travelClass: 'Economy',
      seatNumber: '12A',
      boardingGroup: 'A',
      isCheckedIn: true,
    },
  });

  // Scenario 2: Customer booking for herself and partner (Anna + Partner to Paris via London)
  const booking2 = await prisma.booking.create({
    data: {
      customerId: customers[1].id,
      bookingReference: 'DEF456',
    },
  });

  const bookingFlight2a = await prisma.bookingFlight.create({
    data: {
      bookingId: booking2.id,
      flightId: flights[0].id, // Helsinki to London
    },
  });

  // const bookingFlight2b = await prisma.bookingFlight.create({
  //   data: {
  //     bookingId: booking2.id,
  //     flightId: flights[1].id, // London to Paris
  //   },
  // });

  const passenger2a = await prisma.passenger.create({
    data: {
      bookingId: booking2.id,
      firstName: 'Anna',
      lastName: 'Korhonen',
      email: 'anna.korhonen@email.com',
      documentNumber: 'FIN987654321',
      phone: '+358409876543',
      dateOfBirth: new Date('1990-07-22'),
      nationality: 'Finnish',
    },
  });

  const passenger2b = await prisma.passenger.create({
    data: {
      bookingId: booking2.id,
      firstName: 'Johan',
      lastName: 'Lindberg',
      email: 'johan.lindberg@email.com',
      documentNumber: 'FIN111222333',
      phone: '+358405556667',
      dateOfBirth: new Date('1988-11-10'),
      nationality: 'Finnish',
    },
  });

  // Tickets for Anna
  await prisma.ticket.create({
    data: {
      passengerId: passenger2a.id,
      bookingFlightId: bookingFlight2a.id,
      ticketNumber: '105-2403184568',
      travelClass: 'Business',
      seatNumber: '3A',
      boardingGroup: 'A',
      isCheckedIn: true,
    },
  });

  // await prisma.ticket.create({
  //   data: {
  //     passengerId: passenger2a.id,
  //     bookingFlightId: bookingFlight2b.id,
  //     ticketNumber: '105-2403184569',
  //     travelClass: 'Business',
  //     seatNumber: '23A',
  //     boardingGroup: 'A',
  //   },
  // });

  // Tickets for Johan
  await prisma.ticket.create({
    data: {
      passengerId: passenger2b.id,
      bookingFlightId: bookingFlight2a.id,
      ticketNumber: '105-2403184570',
      travelClass: 'Business',
      seatNumber: '3B',
      boardingGroup: 'A',
      isCheckedIn: true,
    },
  });

  // await prisma.ticket.create({
  //   data: {
  //     passengerId: passenger2b.id,
  //     bookingFlightId: bookingFlight2b.id,
  //     ticketNumber: '105-2403184571',
  //     travelClass: 'Business',
  //     seatNumber: '23B',
  //     boardingGroup: 'A',
  //   },
  // });

  // Scenario 3: Family booking with multiple flights (Erik's family to Tokyo)
  const booking3 = await prisma.booking.create({
    data: {
      customerId: customers[2].id,
      bookingReference: 'GHI789',
    },
  });

  const bookingFlight3 = await prisma.bookingFlight.create({
    data: {
      bookingId: booking3.id,
      flightId: flights[3].id, // Helsinki to Tokyo
    },
  });

  const passenger3a = await prisma.passenger.create({
    data: {
      bookingId: booking3.id,
      firstName: 'Erik',
      lastName: 'Andersson',
      email: 'erik.andersson@email.com',
      documentNumber: 'SWE123456789',
      phone: '+46701234567',
      dateOfBirth: new Date('1982-05-18'),
      nationality: 'Swedish',
    },
  });

  const passenger3b = await prisma.passenger.create({
    data: {
      bookingId: booking3.id,
      firstName: 'Maria',
      lastName: 'Andersson',
      email: 'maria.andersson@email.com',
      documentNumber: 'SWE987654321',
      phone: '+46709876543',
      dateOfBirth: new Date('1985-09-12'),
      nationality: 'Swedish',
    },
  });

  const passenger3c = await prisma.passenger.create({
    data: {
      bookingId: booking3.id,
      firstName: 'Lucas',
      lastName: 'Andersson',
      email: 'lucas.andersson@email.com',
      documentNumber: 'SWE456789123',
      phone: '+46704567890',
      dateOfBirth: new Date('2015-12-03'),
      nationality: 'Swedish',
    },
  });

  // Tickets for Erik
  await prisma.ticket.create({
    data: {
      passengerId: passenger3a.id,
      bookingFlightId: bookingFlight3.id,
      ticketNumber: '105-2403184572',
      travelClass: 'Premium Economy',
      seatNumber: '15A',
      boardingGroup: 'B',
      isCheckedIn: true,
    },
  });

  // Tickets for Maria
  await prisma.ticket.create({
    data: {
      passengerId: passenger3b.id,
      bookingFlightId: bookingFlight3.id,
      ticketNumber: '105-2403184573',
      travelClass: 'Premium Economy',
      seatNumber: '15B',
      boardingGroup: 'B',
      isCheckedIn: true,
    },
  });

  // Tickets for Lucas
  await prisma.ticket.create({
    data: {
      passengerId: passenger3c.id,
      bookingFlightId: bookingFlight3.id,
      ticketNumber: '105-2403184574',
      travelClass: 'Premium Economy',
      seatNumber: '15C',
      boardingGroup: 'B',
      isCheckedIn: true,
    },
  });

  // Scenario 4: Multi-city trip (Sarah's Nordic tour)
  const booking4 = await prisma.booking.create({
    data: {
      customerId: customers[3].id,
      bookingReference: 'JKL012',
    },
  });

  const bookingFlight4a = await prisma.bookingFlight.create({
    data: {
      bookingId: booking4.id,
      flightId: flights[4].id, // Helsinki to Stockholm
    },
  });

  const bookingFlight4b = await prisma.bookingFlight.create({
    data: {
      bookingId: booking4.id,
      flightId: flights[5].id, // Stockholm to Copenhagen
    },
  });

  const bookingFlight4c = await prisma.bookingFlight.create({
    data: {
      bookingId: booking4.id,
      flightId: flights[6].id, // Copenhagen to Helsinki
    },
  });

  const passenger4 = await prisma.passenger.create({
    data: {
      bookingId: booking4.id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      documentNumber: 'USA123456789',
      phone: '+1234567890',
      dateOfBirth: new Date('1992-04-25'),
      nationality: 'American',
    },
  });

  // Tickets for Sarah's multi-city trip
  await prisma.ticket.create({
    data: {
      passengerId: passenger4.id,
      bookingFlightId: bookingFlight4a.id,
      ticketNumber: '105-2403184575',
      travelClass: 'Economy',
      seatNumber: '8F',
      boardingGroup: 'C',
      isCheckedIn: true,
    },
  });

  await prisma.ticket.create({
    data: {
      passengerId: passenger4.id,
      bookingFlightId: bookingFlight4b.id,
      ticketNumber: '105-2403184576',
      travelClass: 'Economy',
      seatNumber: '12D',
      boardingGroup: 'C',
      isCheckedIn: true,
    },
  });

  await prisma.ticket.create({
    data: {
      passengerId: passenger4.id,
      bookingFlightId: bookingFlight4c.id,
      ticketNumber: '105-2403184577',
      travelClass: 'Economy',
      seatNumber: '6A',
      boardingGroup: 'C',
      isCheckedIn: true,
    },
  });

  // Scenario 5: Business trip with checked-in passenger
  const booking5 = await prisma.booking.create({
    data: {
      customerId: customers[0].id, // Mika again
      bookingReference: 'MNO345',
    },
  });

  const bookingFlight5 = await prisma.bookingFlight.create({
    data: {
      bookingId: booking5.id,
      flightId: flights[2].id, // Paris to New York
    },
  });

  const passenger5 = await prisma.passenger.create({
    data: {
      bookingId: booking5.id,
      firstName: 'Mika',
      lastName: 'Virtanen',
      email: 'mika.virtanen@email.com',
      documentNumber: 'FIN123456789',
      phone: '+358401234567',
      dateOfBirth: new Date('1985-03-15'),
      nationality: 'Finnish',
    },
  });

  await prisma.ticket.create({
    data: {
      passengerId: passenger5.id,
      bookingFlightId: bookingFlight5.id,
      ticketNumber: '105-2403184578',
      travelClass: 'Business',
      seatNumber: '2A',
      boardingGroup: 'A',
    },
  });
  console.log('\n📊 Seeding Summary:');
  console.log(`- ${airports.length} airports created`);
  console.log(`- ${flights.length} flights created`);
  console.log(`- ${customers.length} customers created`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

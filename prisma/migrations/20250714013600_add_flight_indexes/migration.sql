-- AlterTable
ALTER TABLE "Passenger" ALTER COLUMN "documentNumber" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_customerId_bookingReference_idx" ON "Booking"("customerId", "bookingReference");

-- CreateIndex
CREATE INDEX "Flight_flightNumber_departureDate_idx" ON "Flight"("flightNumber", "departureDate");

-- CreateIndex
CREATE INDEX "Passenger_bookingId_idx" ON "Passenger"("bookingId");

-- CreateIndex
CREATE INDEX "Ticket_passengerId_idx" ON "Ticket"("passengerId");

-- CreateIndex
CREATE INDEX "Ticket_bookingFlightId_idx" ON "Ticket"("bookingFlightId");

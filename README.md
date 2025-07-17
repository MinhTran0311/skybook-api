# SkyBook API

A flight booking management API built with NestJS, Prisma, and PostgreSQL.

## Features

- **Passenger Information Retriever**: Create, retrieve, and filter flights
- **Database**: PostgreSQL with Prisma ORM
- **Docker Support**: Containerized development environment

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: TypeScript
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

### 1. Clone the repository

```bash
git clone <repository-url>
cd skybook-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://skybook_user:skybook_password@localhost:5432/skybook"
NODE_ENV="development"
PORT=3000
```

### 4. Start the database using docker

```bash
npm run db:up
```

### 5. Run database migrations

```bash
npm run prisma:migrate
```

### 6. Generate Prisma client

```bash
npm run prisma:generate
```

### 7. Seed the database (optional)

```bash
npm run prisma:seed
```

### 8. Start the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## Docker Setup

```bash
docker-compose up -d
```

## API Endpoints

### Flights

- `POST /flights` - Create a new flight
- `GET /flights/:id` - Get flight by ID

### Bookings

- `GET /bookings/:id` - Get booking by ID

### Passengers

- `GET /passengers` - Get all passengers with filtering options
- `GET /passengers/:id` - Get passenger by ID

## Database Schema

![Database Schema](./images/schema.jpg)

## Testing

### Unit Tests

```bash
npm run test
```

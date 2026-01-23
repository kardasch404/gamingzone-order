# gamingzone-order

Order microservice for GamingZone platform built with NestJS, following Clean Architecture principles.

## Architecture

This service follows **Clean Architecture** with clear separation of concerns:

- **Domain Layer**: Business entities, value objects, and domain logic
- **Application Layer**: Use cases, DTOs, and application services
- **Infrastructure Layer**: Database, messaging, external services
- **Presentation Layer**: REST/gRPC controllers, GraphQL resolvers

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Messaging**: Kafka
- **Communication**: REST, gRPC
- **Testing**: Jest

## Project Structure

```
src/
├── application/        # Application layer (use cases, DTOs)
├── domain/            # Domain layer (entities, value objects)
├── infrastructure/    # Infrastructure layer (database, messaging)
├── presentation/      # Presentation layer (controllers, resolvers)
└── shared/           # Shared utilities and configurations
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL
- Kafka (optional for development)

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### Running the Service

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Testing

```bash
# Unit tests
npm test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Development

### Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format
```

## Git Workflow

Branch naming convention: `feature/ORDER-XXX-description`

## License

MIT

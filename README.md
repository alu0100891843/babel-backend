# Babel Backend

A NestJS backend application following Hexagonal Architecture principles for managing candidate information through Excel file uploads.

## Getting Started

### Prerequisites
- Node.js (version 20.9.0 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/alu0100891843/babel-backend.git
cd babel-backend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run start:dev
```

* Using Visual Studio Code

  If you're using Visual Studio Code, you can press **F5** to start debugging the application.

## Hexagonal Architecture

This project implements a hexagonal architecture by organizing code into well-defined layers that promote separation of concerns and testability.

### Project Structure

```
babel-backend/
├── src/
│   ├── common/                     # Shared utilities
│   │   └── middlewares/            # Global error handling middleware
│   ├── modules/
│   │   └── candidates/             # Candidates module
│   │       ├── domain/             # DOMAIN (application core)
│   │       │   ├── models/
│   │       │   │   ├── entities/   # Domain entities
│   │       │   │   │   └── enums/  # Contains enumerated data types
│   │       │   │   └── value-objects/ # Value Objects to strengthen entity contracts
│   │       │   │       └── parent/ # Base class for VO
│   │       │   └── ports/          # Interfaces (ports) [Defines contract for persistence layer]
│   │       ├── application/        # APPLICATION (use cases)
│   │       │   ├── services/       # Application services
│   │       │   └── models/
│   │       │       ├── dtos/       # Data Transfer Objects
│   │       │       └── mappers/    # DTO ↔ Entity mappers
│   │       └── infrastructure/     # INFRASTRUCTURE (adapters)
│   │           ├── controllers/    # REST controllers
│   │           ├── adapters/       # External adapters (To transform external data structures to recognized entities)
│   │           └── persistence/    # Data persistence
│   │               ├── repositories/ # Repository implementations (Mocked)
│   │               └── models/     # Persistence models (Structure definition only)
│   │                   ├── schemas/   # Database schemas
│   │                   └── mappers/   # Schema ↔ Entity mappers
│   ├── app.module.ts
│   └── main.ts
├── test/                           # End-to-end tests
├── package.json
└── README.md
```

### Layer Description

#### 🔷 Domain
The application core that contains:
- **Entities**: Business objects with identity (CandidatesEntity)
- **Value Objects**: Immutable objects representing domain concepts (NameVO, ExperienceVO, etc.)
- **Ports**: Interfaces that define contracts for external communication (CandidateRepositoryInterface)

#### 🔶 Application
Contains use case logic:
- **Services**: Orchestrate domain operations (CandidatesService)
- **DTOs**: Objects for transferring data between 
Application and Infrastructure layers
- **Mappers**: Convert between DTOs and Entities

#### 🔸 Infrastructure
Implements technical details:
- **Controllers**: HTTP entry points (REST API)
- **Repositories**: Data persistence implementation
- **Adapters**: Adapters for external data representation (ExcelAdapter)

### Data Flow

1. **Request** → Controller (Infrastructure)
2. **Controller** → Service (Application)
3. **Service** → Repository Interface (Domain Port)
4. **Repository Interface** → Repository Implementation (Infrastructure)
5. **Response** ← Reverse flow with DTOs


## Scripts
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:prod` - Start in production mode
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

## API Endpoints

### Candidates
- `POST /candidates/createCandidate` - Create candidate from Excel file
  - Body: `multipart/form-data`
  - Fields: `excelFile` (file), `name` (string), `surname` (string)

## Technologies Used

- **NestJS** - Node.js framework
- **TypeScript** - Programming language
- **Jest** - Testing framework
- **class-validator** - Data validation
- **xlsx** - Excel file processing
- **Multer** - File upload middleware

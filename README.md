# E-Commerce Microservices Architecture

## Description
A modern e-commerce platform built with a microservices architecture, featuring a Spring Boot backend and Angular frontend. The system is designed to be scalable, maintainable, and highly available.

## Architecture Overview
The project consists of the following services:
- 🔐 User Service
- 🛍️ Product Service
- 🛒 Order Service
- 💳 Payment Service
- 📢 Event Service
- ❗ Reclamation Service
- 🌐 Gateway Service
- ⚙️ Config Server
- 🔍 Discovery Service

## Technology Stack
### Backend
- Java with Spring Boot
- Spring Cloud for microservices
- Maven for dependency management
- RESTful APIs

### Frontend
- Angular 19.2.1
- Bootstrap
- ApexCharts for data visualization

## Installation

### Prerequisites
- Java JDK 11 or higher
- Node.js and npm
- Maven
- Docker (optional)

### Backend Services Setup
```bash
# Clone the repository
git clone [your-repository-url]

# Navigate to services directory
cd basic-structure-of-microservice-architecture/services

# Build and run each service (example for product service)
cd product-service
./mvnw clean install
./mvnw spring:run
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ecomerce-ui

# Install dependencies
npm install

# Start development server
ng serve
```

## Usage
After starting all services:

1. Config Server will run on port 8888
2. Access the frontend application at `http://localhost:4200`
3. API Gateway will handle service routing
4. Individual services can be accessed through the gateway

## Development

### Running Tests
Backend:
```bash
./mvnw test        # Unit tests
./mvnw test:e2e    # E2E tests
```

Frontend:
```bash
ng test           # Unit tests
ng e2e            # E2E tests
```

### Building for Production
Backend:
```bash
./mvnw clean package
```

Frontend:
```bash
ng build --prod
```

## Features
- 🔐 User Authentication and Authorization
- 📦 Product Management
- 🛒 Shopping Cart
- 💳 Payment Processing
- 📊 Order Management
- 📢 Event Handling
- ❗ Reclamation System
- 🔄 Service Discovery
- ⚙️ Centralized Configuration

## Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Project Structure
```
basic-structure-of-microservice-architecture/
├── services/
│   ├── config-server/
│   ├── discovery/
│   ├── gateway/
│   ├── product-service/
│   ├── user-service/
│   ├── order-service/
│   ├── payment/
│   ├── event-service/
│   └── reclamation-service/
└── ecomerce-ui/
```

## Configuration
- Services configuration is managed through the Config Server
- Environment-specific configurations can be modified in `application.yml` files
- Frontend configuration can be found in the Angular environment files
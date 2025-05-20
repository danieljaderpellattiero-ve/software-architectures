# Hospital Management System

A comprehensive hospital management system built with Next.js for the frontend and a custom backend service, containerized using Docker. This system facilitates efficient patient care management, medical records handling, and hospital personnel coordination.

## Project Structure

```
.
├── docker-compose.yml    # Docker Compose configuration
├── next-app/            # Next.js frontend application
└── server/             # Backend service
```

## System Features

### Patient Portal
1. **Account Management**
   - Easy account creation
   - Secure login/logout functionality
   - Profile information management
   - Account deletion requests

2. **Patient Care**
   - Request association with doctors or nurses
   - View assigned healthcare providers

3. **Medical Records Management**
   - Fill out medical information forms
   - Edit and update personal information
   - View medical history and records
   - Track treatment progress

### Hospital Personnel Portal

#### Administrators
- Secure login with 2FA authentication
- Complete account management (CRUD operations)
   - Doctor accounts
   - Nurse accounts
   - Patient accounts
- System-wide activity logging and monitoring
- Administrative dashboard

#### Doctors and Nurses
- Patient association management
  - Accept/reject patient requests
  - Manage availability
- Patient Data Management
  - Quick access to patient information
  - Intuitive interface for medical records
  - Add new medical records
  - Update existing records (with audit trail)
  - Freeze/delete records when necessary
- Data Export Capabilities
  - PDF format
  - DOCX format
  - XLSX format

## Technical Requirements

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- npm or yarn (for local development)
- PostgreSQL (for database)
- Redis (for session management)

### Security Features
- Two-factor authentication for administrators
- Secure password hashing
- JWT-based authentication
- Role-based access control
- Audit logging
- Data encryption at rest

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/danieljaderpellattiero-ve/software-architectures.git
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Local Development

#### Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd next-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

#### Backend

1. Navigate to the backend directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Docker Services

The application consists of two main services defined in `docker-compose.yml`:

1. **Frontend Service**
   - Port: 3000
   - Built from: `./next-app`
   - Always restarts on failure
   - Features:
     - Responsive UI
     - Role-based access control
     - Real-time updates

2. **Backend Service**
   - Port: 5000
   - Built from: `./server`
   - Always restarts on failure
   - Features:
     - RESTful API
     - Authentication & Authorization
     - Data validation
     - File export services

## Development Guidelines

### Code Structure
- Frontend follows Next.js best practices
- Backend implements RESTful API design
- Database follows normalized schema design
- Implements proper error handling and logging

### Security Considerations
- All user inputs are validated
- Sensitive data is encrypted
- Regular security audits
- Compliance with healthcare data regulations

### Testing
- Unit tests for critical components
- Integration tests for API endpoints
- End-to-end testing for critical user flows
- Regular security testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please contact the development team at [your-email@domain.com]


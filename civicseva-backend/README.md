# CivicSeva Backend API

A Spring Boot REST API backend for the CivicSeva civic issue management system.

## Features

- **Issue Management**: Create, read, update, and delete civic issues
- **Status Tracking**: Track issues through their lifecycle (Reported → In Progress → Resolved)
- **Location-based Queries**: Find issues near specific locations
- **Department Assignment**: Assign issues to appropriate departments
- **Image Management**: Support for before/after photos
- **Statistics**: Get counts and analytics on issues
- **CORS Support**: Configured for frontend integration

## API Endpoints

### Issues

- `GET /api/issues` - Get all issues (with optional filters)
  - Query params: `status`, `category`, `department`
- `GET /api/issues/{issueId}` - Get specific issue by ID
- `GET /api/issues/nearby?latitude={lat}&longitude={lon}&radiusKm={radius}` - Get nearby issues
- `POST /api/issues` - Create new issue
- `PUT /api/issues/{issueId}` - Update existing issue
- `PATCH /api/issues/{issueId}/status` - Update issue status
- `PATCH /api/issues/{issueId}/assign` - Assign issue to department
- `DELETE /api/issues/{issueId}` - Delete issue
- `GET /api/issues/statistics` - Get issue statistics

### Issue Categories

- Pothole
- Graffiti  
- Streetlight Outage
- Waste Management
- Damaged Sign
- Water Leak
- Other

### Issue Statuses

- Reported
- In Progress
- Resolved

### Issue Priorities

- Low
- Medium
- High

## Data Model

### Issue
```json
{
  "id": "IS-12345",
  "title": "Issue title",
  "description": "Detailed description",
  "imageUrl": "https://example.com/image.jpg",
  "imageHint": "description hint",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St, New York, NY"
  },
  "status": "Reported",
  "category": "Pothole",
  "priority": "High",
  "reportedAt": "2024-01-01T10:00:00",
  "resolvedAt": "2024-01-02T15:00:00",
  "department": "Public Works",
  "confidence": 0.95,
  "eta": "2024-01-03T17:00:00",
  "updates": [
    {
      "timestamp": "2024-01-01T10:00:00",
      "status": "Reported",
      "description": "Issue submitted by citizen."
    }
  ],
  "images": [
    {
      "url": "https://example.com/before.jpg",
      "caption": "Before"
    }
  ]
}
```

## Setup and Installation

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

### Running the Application

1. **Clone the repository** (if not already done)
   ```bash
   cd civicseva-backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

The API will be available at `http://localhost:8080/api`

### Database

The application uses H2 in-memory database by default for development. The H2 console is available at:
`http://localhost:8080/api/h2-console`

Connection details:
- JDBC URL: `jdbc:h2:mem:civicseva`
- Username: `sa`
- Password: `password`

### Configuration

Key configuration properties (in `application.properties`):

```properties
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:h2:mem:civicseva
spring.datasource.username=sa
spring.datasource.password=password

# CORS
cors.allowed-origins=http://localhost:3000,http://localhost:3001

# File Upload
spring.servlet.multipart.max-file-size=10MB
```

## Frontend Integration

The backend is designed to work with the Next.js frontend. To integrate:

1. Update frontend API calls to point to `http://localhost:8080/api`
2. The API responses match the TypeScript interfaces in the frontend
3. CORS is configured to allow requests from `localhost:3000` and `localhost:3001`

### Example Frontend Integration

```typescript
// In your frontend service
const API_BASE_URL = 'http://localhost:8080/api';

export const createIssue = async (issueData: CreateIssueDto) => {
  const response = await fetch(`${API_BASE_URL}/issues`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(issueData),
  });
  return response.json();
};

export const getIssues = async () => {
  const response = await fetch(`${API_BASE_URL}/issues`);
  return response.json();
};
```

## Development

### Project Structure

```
src/
├── main/
│   ├── java/com/civicseva/backend/
│   │   ├── CivicSevaBackendApplication.java
│   │   ├── config/
│   │   │   ├── CorsConfig.java
│   │   │   ├── DataInitializer.java
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   └── IssueController.java
│   │   ├── dto/
│   │   │   ├── CreateIssueDto.java
│   │   │   ├── IssueDto.java
│   │   │   ├── IssueImageDto.java
│   │   │   ├── IssueUpdateDto.java
│   │   │   └── LocationDto.java
│   │   ├── exception/
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── model/
│   │   │   ├── Issue.java
│   │   │   ├── IssueCategory.java
│   │   │   ├── IssueImage.java
│   │   │   ├── IssuePriority.java
│   │   │   ├── IssueStatus.java
│   │   │   └── IssueUpdate.java
│   │   ├── repository/
│   │   │   ├── IssueImageRepository.java
│   │   │   ├── IssueRepository.java
│   │   │   └── IssueUpdateRepository.java
│   │   └── service/
│   │       └── IssueService.java
│   └── resources/
│       └── application.properties
```

### Testing

Run tests with:
```bash
mvn test
```

### Production Deployment

For production, update the database configuration to use a persistent database like MySQL or PostgreSQL:

```properties
# MySQL example
spring.datasource.url=jdbc:mysql://localhost:3306/civicseva
spring.datasource.username=civicseva_user
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=validate
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

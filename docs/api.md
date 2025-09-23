# API Documentation

This project includes comprehensive API documentation using Swagger/OpenAPI 3.0.

## Accessing Documentation

### Interactive Swagger UI

When the server is running, you can access the interactive Swagger UI at:

- **URL**: `http://localhost:3000/api-docs`
- **Features**:
  - Interactive API testing
  - Request/response examples
  - Schema validation
  - Authentication testing

### Static Documentation

Generate static documentation files:

```bash
# Generate OpenAPI spec file
yarn docs:generate

# Serve static documentation with ReDoc (alternative UI)
yarn docs:serve
```

## Available Endpoints

### Users API (`/api/v1/users`)

| Method   | Endpoint               | Description                 | Auth Required |
| -------- | ---------------------- | --------------------------- | ------------- |
| `GET`    | `/api/v1/users`        | Get paginated list of users | ✅            |
| `GET`    | `/api/v1/users/:id`    | Get user by ID              | ✅            |
| `GET`    | `/api/v1/users/me`     | Get current user profile    | ✅            |
| `POST`   | `/api/v1/users`        | Create a new user           | ❌            |
| `POST`   | `/api/v1/users/login`  | Login user                  | ❌            |
| `POST`   | `/api/v1/users/logout` | Logout user                 | ✅            |
| `PUT`    | `/api/v1/users/:id`    | Update user by ID           | ✅            |
| `DELETE` | `/api/v1/users/:id`    | Delete user by ID           | ✅            |

## Authentication

The API uses session-based authentication with cookies. For endpoints marked with ✅, you need to:

1. First create a user via `POST /api/v1/users`
2. Login via `POST /api/v1/users/login`
3. Use the session cookie for subsequent authenticated requests

## Data Models

### User

```typescript
{
  id: string (uuid)
  email: string (email format)
  name: string (2-100 characters)
  createdAt: string (ISO date)
  updatedAt: string (ISO date)
}
```

### UserInput

```typescript
{
  email: string (email format)
  name: string (2-100 characters)
}
```

## Development

To add documentation for new endpoints:

1. Add JSDoc comments with `@swagger` tags above your route handlers
2. Define schemas in `/src/swagger.ts` if needed
3. Run `yarn docs:generate` to update the static documentation
4. The interactive documentation at `/api-docs` will update automatically when the server restarts

## Example Usage

```bash
# Create a user
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'

# Login
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}' \
  -c cookies.txt

# Get current user (using session cookie)
curl -X GET http://localhost:3000/api/v1/users/me \
  -b cookies.txt
```

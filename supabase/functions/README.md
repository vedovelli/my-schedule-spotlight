# Supabase Edge Functions

This directory contains the Edge Functions for the My Schedule Spotlight application. All database operations are handled through these functions to maintain security and proper data access control.

## Functions Overview

### 1. event-types

**Endpoint:** `/functions/v1/event-types`

Manages event types that users can create for scheduling.

**Methods:**

- `GET` - Get all event types for authenticated user
- `POST` - Create new event type
- `PUT` - Update existing event type
- `DELETE` - Delete event type

**Authentication:** Required for all operations

### 2. event-availabilities

**Endpoint:** `/functions/v1/event-availabilities`

Manages availability windows for event types.

**Methods:**

- `GET` - Get availabilities (with optional event_type_id filter)
- `POST` - Create new availability
- `PUT` - Update existing availability
- `DELETE` - Delete availability

**Authentication:** Required for all operations

### 3. event-bookings

**Endpoint:** `/functions/v1/event-bookings`

Manages event bookings made by visitors.

**Methods:**

- `GET` - Get bookings (authenticated) or check availability (public)
- `POST` - Create new booking (public endpoint)
- `PUT` - Update booking status (authenticated)

**Authentication:**

- Required for getting user's bookings and updating statuses
- Not required for creating bookings and checking availability

## Security Features

### Row Level Security (RLS)

- All functions verify user ownership through RLS policies
- Users can only access their own event types and related data
- Public booking is allowed but restricted to specific operations

### Authentication

- JWT tokens are validated on each authenticated request
- Service role key is used for database operations
- CORS headers are properly configured

## Deployment

### Prerequisites

1. Supabase CLI installed: `npm install -g supabase`
2. Project linked: `supabase link --project-ref your-project-ref`

### Deploy Functions

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy event-types
supabase functions deploy event-availabilities
supabase functions deploy event-bookings
```

### Environment Variables

The following environment variables are automatically available in Edge Functions:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for database access

## Local Development

### Start Local Development

```bash
# Start Supabase local development
supabase start

# Serve functions locally
supabase functions serve

# Serve specific function
supabase functions serve event-types --debug
```

### Testing Functions

```bash
# Example: Test event-types function
curl -X GET http://localhost:54321/functions/v1/event-types \
  -H "Authorization: Bearer your-jwt-token"

# Example: Create event type
curl -X POST http://localhost:54321/functions/v1/event-types \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"title":"30-min Meeting","duration_minutes":30}'
```

## Error Handling

All functions return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200` - Success
- `400` - Bad request (validation errors)
- `401` - Unauthorized (invalid or missing token)
- `404` - Not found
- `409` - Conflict (e.g., time slot already booked)
- `500` - Internal server error

## Client Integration

Use the `api.ts` service in the client application to interact with these functions:

```typescript
import { api } from '@/lib/api';

// Get all event types
const eventTypes = await api.eventTypes.getAll();

// Create new event type
const newEventType = await api.eventTypes.create({
  title: '30-min Consultation',
  duration_minutes: 30,
});

// Create booking (public)
const booking = await api.bookings.create({
  event_type_id: 'uuid',
  user_email: 'user@example.com',
  scheduled_for: '2025-06-28T14:00:00Z',
});
```

## Performance Considerations

- Functions are stateless and auto-scale
- Database connections are handled efficiently
- Queries are optimized with proper indexes
- CORS headers allow browser requests

## Monitoring

- Function logs are available in Supabase dashboard
- Performance metrics are tracked automatically
- Error rates and response times are monitored

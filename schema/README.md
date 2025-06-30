# Database Schema

This directory contains the SQL schema definitions for the My Schedule Spotlight application.

## Files

- `001_initial_schema.sql` - Initial database schema with tables, indexes, RLS policies, and triggers
- `rollback_001.sql` - Rollback script to remove the initial schema
- `README.md` - This documentation file

## How to Apply Schema

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `001_initial_schema.sql`
4. Click **Run** to execute the schema

### Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Apply the migration
supabase db reset
```

### Option 3: Manual SQL Execution

Connect to your Supabase database directly using `psql` or any PostgreSQL client and execute the SQL file.

## Schema Overview

### Tables

1. **event_types**
   - Stores different types of events that users can create
   - Each event type belongs to a user and has a title, description, and duration

2. **event_availabilities**
   - Defines when each event type is available for booking
   - Stores day of week, start time, and end time
   - Multiple availability windows can exist per event type

3. **event_bookings**
   - Stores actual bookings made by visitors
   - Links to event types and includes visitor email and scheduled time
   - Has status tracking (confirmed, cancelled, completed)

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own event types and related data
- Public booking is allowed for anyone
- Proper foreign key constraints and data validation

### Performance Features

- Optimized indexes for common queries
- Composite indexes for complex lookups
- Automatic timestamp updates with triggers

### Real-time Features

- All tables are enabled for Supabase realtime subscriptions
- Allows immediate updates in the UI when data changes

## Rollback

If you need to remove the schema:

```sql
-- Execute the rollback script
-- Copy and paste contents of rollback_001.sql in Supabase SQL Editor
```

## Notes

- The schema uses UUID for all primary keys
- All timestamps are stored with timezone information
- RLS policies ensure data security while allowing public booking
- The schema is designed to be extensible for future features

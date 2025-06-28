-- ============================================================================
-- My Schedule Spotlight - Rollback Script for Initial Schema
-- Created: 2025-06-28
-- Description: Rollback script to remove the initial schema
-- ============================================================================

-- Disable realtime subscriptions
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS event_bookings;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS event_availabilities;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS event_types;

-- Drop triggers
DROP TRIGGER IF EXISTS update_event_bookings_updated_at ON event_bookings;
DROP TRIGGER IF EXISTS update_event_availabilities_updated_at ON event_availabilities;
DROP TRIGGER IF EXISTS update_event_types_updated_at ON event_types;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes (they will be dropped automatically when tables are dropped, but explicit for clarity)
DROP INDEX IF EXISTS idx_event_bookings_event_time;
DROP INDEX IF EXISTS idx_event_bookings_scheduled_for;
DROP INDEX IF EXISTS idx_event_bookings_user_email;
DROP INDEX IF EXISTS idx_event_bookings_event_type_id;
DROP INDEX IF EXISTS idx_event_availabilities_event_day;
DROP INDEX IF EXISTS idx_event_availabilities_day_of_week;
DROP INDEX IF EXISTS idx_event_availabilities_event_type_id;
DROP INDEX IF EXISTS idx_event_types_user_id;

-- Drop tables (in reverse order due to foreign key constraints)
DROP TABLE IF EXISTS event_bookings;
DROP TABLE IF EXISTS event_availabilities;
DROP TABLE IF EXISTS event_types;

-- Note: We don't drop the uuid-ossp extension as it might be used by other parts of the system
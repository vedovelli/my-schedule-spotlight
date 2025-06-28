-- ============================================================================
-- My Schedule Spotlight - Database Schema
-- Created: 2025-06-28
-- Description: Core database schema for event scheduling system
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: event_types
-- Purpose: Store different types of events that users can create
-- ============================================================================
CREATE TABLE event_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: event_availabilities
-- Purpose: Define when each event type is available for booking
-- ============================================================================
CREATE TABLE event_availabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type_id UUID NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- ============================================================================
-- TABLE: event_bookings
-- Purpose: Store actual bookings made by visitors
-- ============================================================================
CREATE TABLE event_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type_id UUID NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed'))
);

-- ============================================================================
-- INDEXES for performance optimization
-- ============================================================================

-- Index for finding event types by user
CREATE INDEX idx_event_types_user_id ON event_types(user_id);

-- Index for finding availabilities by event type
CREATE INDEX idx_event_availabilities_event_type_id ON event_availabilities(event_type_id);

-- Index for finding availabilities by day of week (for scheduling queries)
CREATE INDEX idx_event_availabilities_day_of_week ON event_availabilities(day_of_week);

-- Composite index for availability lookups
CREATE INDEX idx_event_availabilities_event_day ON event_availabilities(event_type_id, day_of_week);

-- Index for finding bookings by event type
CREATE INDEX idx_event_bookings_event_type_id ON event_bookings(event_type_id);

-- Index for finding bookings by email
CREATE INDEX idx_event_bookings_user_email ON event_bookings(user_email);

-- Index for finding bookings by scheduled time (for conflict checking)
CREATE INDEX idx_event_bookings_scheduled_for ON event_bookings(scheduled_for);

-- Composite index for booking conflicts
CREATE INDEX idx_event_bookings_event_time ON event_bookings(event_type_id, scheduled_for);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_bookings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES for event_types
-- ============================================================================

-- Users can view, insert, update, and delete their own event types
CREATE POLICY "Users can manage their own event types" ON event_types
    FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES for event_availabilities
-- ============================================================================

-- Users can manage availabilities for their own event types
CREATE POLICY "Users can manage availabilities for their event types" ON event_availabilities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM event_types 
            WHERE event_types.id = event_availabilities.event_type_id 
            AND event_types.user_id = auth.uid()
        )
    );

-- Anonymous users can view availabilities for event types (needed for public booking)
CREATE POLICY "Anyone can view event availabilities" ON event_availabilities
    FOR SELECT USING (true);

-- ============================================================================
-- RLS POLICIES for event_bookings
-- ============================================================================

-- Users can view bookings for their own event types
CREATE POLICY "Users can view bookings for their event types" ON event_bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM event_types 
            WHERE event_types.id = event_bookings.event_type_id 
            AND event_types.user_id = auth.uid()
        )
    );

-- Anyone can create bookings (needed for public booking)
CREATE POLICY "Anyone can create bookings" ON event_bookings
    FOR INSERT WITH CHECK (true);

-- Users can update/cancel bookings for their own event types
CREATE POLICY "Users can manage bookings for their event types" ON event_bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM event_types 
            WHERE event_types.id = event_bookings.event_type_id 
            AND event_types.user_id = auth.uid()
        )
    );

-- ============================================================================
-- FUNCTIONS for automatic timestamp updates
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- TRIGGERS for automatic timestamp updates
-- ============================================================================

CREATE TRIGGER update_event_types_updated_at BEFORE UPDATE ON event_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_availabilities_updated_at BEFORE UPDATE ON event_availabilities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_bookings_updated_at BEFORE UPDATE ON event_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================================

-- Enable realtime for all tables (can be configured in Supabase dashboard)
-- This allows real-time updates when data changes

-- For event_types: Users need to know when their event types change
ALTER PUBLICATION supabase_realtime ADD TABLE event_types;

-- For event_availabilities: Users need to know when availability changes
ALTER PUBLICATION supabase_realtime ADD TABLE event_availabilities;

-- For event_bookings: Users need real-time notifications of new bookings
ALTER PUBLICATION supabase_realtime ADD TABLE event_bookings;

-- ============================================================================
-- SAMPLE DATA (for development/testing)
-- ============================================================================

-- Note: Sample data insertion would require actual user IDs from auth.users
-- This would typically be inserted after user creation in the application

-- Example usage (to be run after users are created):
-- INSERT INTO event_types (user_id, title, description, duration_minutes)
-- VALUES 
--     ('user-uuid-here', '30-min Consultation', 'Quick consultation call', 30),
--     ('user-uuid-here', '1-hour Meeting', 'Detailed planning session', 60);
import { supabase } from './supabase';
import type {
  EventType,
  EventTypeInsert,
  EventTypeUpdate,
  EventAvailability,
  EventAvailabilityInsert,
  EventAvailabilityUpdate,
  EventBooking,
  EventBookingInsert,
  EventBookingUpdate,
} from './supabase';

// Base API configuration
const SUPABASE_FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token}`,
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return data;
};

// ============================================================================
// EVENT TYPES API
// ============================================================================

export const eventTypesApi = {
  // Get all event types for the authenticated user
  getAll: async (): Promise<EventType[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/event-types`, {
      method: 'GET',
      headers,
    });

    const result = await handleResponse(response);
    return result.data;
  },

  // Create a new event type
  create: async (eventType: EventTypeInsert): Promise<EventType> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/event-types`, {
      method: 'POST',
      headers,
      body: JSON.stringify(eventType),
    });

    const result = await handleResponse(response);
    return result.data;
  },

  // Update an existing event type
  update: async (id: string, updates: EventTypeUpdate): Promise<EventType> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/event-types`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id, ...updates }),
    });

    const result = await handleResponse(response);
    return result.data;
  },

  // Delete an event type
  delete: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${SUPABASE_FUNCTIONS_URL}/event-types?id=${id}`,
      {
        method: 'DELETE',
        headers,
      }
    );

    await handleResponse(response);
  },
};

// ============================================================================
// EVENT AVAILABILITIES API
// ============================================================================

export const eventAvailabilitiesApi = {
  // Get availabilities for a specific event type or all user's availabilities
  getAll: async (eventTypeId?: string): Promise<EventAvailability[]> => {
    const headers = await getAuthHeaders();
    const url = eventTypeId
      ? `${SUPABASE_FUNCTIONS_URL}/event-availabilities?event_type_id=${eventTypeId}`
      : `${SUPABASE_FUNCTIONS_URL}/event-availabilities`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const result = await handleResponse(response);
    return result.data;
  },

  // Create a new availability
  create: async (
    availability: EventAvailabilityInsert
  ): Promise<EventAvailability> => {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${SUPABASE_FUNCTIONS_URL}/event-availabilities`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(availability),
      }
    );

    const result = await handleResponse(response);
    return result.data;
  },

  // Update an existing availability
  update: async (
    id: string,
    updates: EventAvailabilityUpdate
  ): Promise<EventAvailability> => {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${SUPABASE_FUNCTIONS_URL}/event-availabilities`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({ id, ...updates }),
      }
    );

    const result = await handleResponse(response);
    return result.data;
  },

  // Delete an availability
  delete: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${SUPABASE_FUNCTIONS_URL}/event-availabilities?id=${id}`,
      {
        method: 'DELETE',
        headers,
      }
    );

    await handleResponse(response);
  },
};

// ============================================================================
// EVENT BOOKINGS API
// ============================================================================

export const eventBookingsApi = {
  // Get bookings for the authenticated user's event types
  getAll: async (eventTypeId?: string): Promise<EventBooking[]> => {
    const headers = await getAuthHeaders();
    const url = eventTypeId
      ? `${SUPABASE_FUNCTIONS_URL}/event-bookings?event_type_id=${eventTypeId}`
      : `${SUPABASE_FUNCTIONS_URL}/event-bookings`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const result = await handleResponse(response);
    return result.data;
  },

  // Get existing bookings for a specific event type (public endpoint for conflict checking)
  getForEventType: async (
    eventTypeId: string,
    userEmail: string
  ): Promise<Partial<EventBooking>[]> => {
    const response = await fetch(
      `${SUPABASE_FUNCTIONS_URL}/event-bookings?event_type_id=${eventTypeId}&user_email=${userEmail}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await handleResponse(response);
    return result.data;
  },

  // Create a new booking (public endpoint)
  create: async (booking: EventBookingInsert): Promise<EventBooking> => {
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/event-bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });

    const result = await handleResponse(response);
    return result.data;
  },

  // Update booking status (authenticated endpoint)
  updateStatus: async (id: string, status: string): Promise<EventBooking> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/event-bookings`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id, status }),
    });

    const result = await handleResponse(response);
    return result.data;
  },
};

// ============================================================================
// COMBINED API OPERATIONS
// ============================================================================

export const api = {
  eventTypes: eventTypesApi,
  availabilities: eventAvailabilitiesApi,
  bookings: eventBookingsApi,

  // Helper function to get complete event type with availabilities
  getEventTypeWithAvailabilities: async (eventTypeId: string) => {
    const [eventTypes, availabilities] = await Promise.all([
      eventTypesApi.getAll(),
      eventAvailabilitiesApi.getAll(eventTypeId),
    ]);

    const eventType = eventTypes.find(et => et.id === eventTypeId);
    if (!eventType) {
      throw new Error('Event type not found');
    }

    return {
      ...eventType,
      availabilities,
    };
  },

  // Helper function to check if a time slot is available
  isTimeSlotAvailable: async (
    eventTypeId: string,
    scheduledFor: string
  ): Promise<boolean> => {
    try {
      const bookings = await eventBookingsApi.getForEventType(
        eventTypeId,
        'check@availability.com'
      );
      const scheduledDate = new Date(scheduledFor);

      // Check if any confirmed booking conflicts with the requested time
      return !bookings.some(booking => {
        if (booking.status !== 'confirmed' || !booking.scheduled_for)
          return false;

        const bookingDate = new Date(booking.scheduled_for);
        // Simple time conflict check - would need duration for complete check
        return (
          Math.abs(bookingDate.getTime() - scheduledDate.getTime()) <
          30 * 60 * 1000
        ); // 30 minutes buffer
      });
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  },
};

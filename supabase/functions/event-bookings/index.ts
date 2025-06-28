import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async req => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const url = new URL(req.url);

    switch (req.method) {
      case 'GET': {
        // Get bookings - requires authentication for owner, public for specific queries
        const authHeader = req.headers.get('Authorization');
        const eventTypeId = url.searchParams.get('event_type_id');
        const userEmail = url.searchParams.get('user_email');

        if (authHeader) {
          // Authenticated request - get bookings for user's event types
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

          if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Invalid token' }), {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          let query = supabase
            .from('event_bookings')
            .select(
              `
              *,
              event_types!inner(user_id, title, duration_minutes)
            `
            )
            .eq('event_types.user_id', user.id);

          if (eventTypeId) {
            query = query.eq('event_type_id', eventTypeId);
          }

          const { data: bookings, error: getError } = await query.order(
            'scheduled_for',
            { ascending: true }
          );

          if (getError) {
            return new Response(JSON.stringify({ error: getError.message }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify({ data: bookings }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Public request - only allow specific queries for booking validation
          if (!eventTypeId || !userEmail) {
            return new Response(
              JSON.stringify({
                error:
                  'event_type_id and user_email are required for public queries',
              }),
              {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          }

          // Get bookings for conflict checking during public booking
          const { data: bookings, error: getError } = await supabase
            .from('event_bookings')
            .select('scheduled_for, status')
            .eq('event_type_id', eventTypeId)
            .in('status', ['confirmed']);

          if (getError) {
            return new Response(JSON.stringify({ error: getError.message }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify({ data: bookings }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      case 'POST': {
        // Create new booking - public endpoint
        const body = await req.json();
        const { event_type_id, user_email, scheduled_for } = body;

        if (!event_type_id || !user_email || !scheduled_for) {
          return new Response(
            JSON.stringify({
              error:
                'event_type_id, user_email, and scheduled_for are required',
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Verify the event type exists
        const { data: eventType, error: eventTypeError } = await supabase
          .from('event_types')
          .select('id, duration_minutes')
          .eq('id', event_type_id)
          .single();

        if (eventTypeError || !eventType) {
          return new Response(
            JSON.stringify({ error: 'Event type not found' }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Check for booking conflicts
        const scheduledDate = new Date(scheduled_for);
        const endTime = new Date(
          scheduledDate.getTime() + eventType.duration_minutes * 60000
        );

        const { data: conflictingBookings, error: conflictError } =
          await supabase
            .from('event_bookings')
            .select('scheduled_for')
            .eq('event_type_id', event_type_id)
            .eq('status', 'confirmed')
            .gte('scheduled_for', scheduledDate.toISOString())
            .lt('scheduled_for', endTime.toISOString());

        if (conflictError) {
          return new Response(
            JSON.stringify({ error: conflictError.message }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        if (conflictingBookings && conflictingBookings.length > 0) {
          return new Response(
            JSON.stringify({ error: 'Time slot already booked' }),
            {
              status: 409,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const { data: newBooking, error: createError } = await supabase
          .from('event_bookings')
          .insert({
            event_type_id,
            user_email,
            scheduled_for,
            status: 'confirmed',
          })
          .select()
          .single();

        if (createError) {
          return new Response(JSON.stringify({ error: createError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ data: newBooking }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'PUT': {
        // Update booking status - requires authentication
        const authHeaderUpdate = req.headers.get('Authorization');
        if (!authHeaderUpdate) {
          return new Response(
            JSON.stringify({ error: 'Authorization header required' }),
            {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser(
          authHeaderUpdate.replace('Bearer ', '')
        );

        if (authError || !user) {
          return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const updateBody = await req.json();
        const { id, status } = updateBody;

        if (!id || !status) {
          return new Response(
            JSON.stringify({ error: 'Booking ID and status are required' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Verify the booking belongs to the user's event type
        const { data: booking, error: bookingError } = await supabase
          .from('event_bookings')
          .select(
            `
            *,
            event_types!inner(user_id)
          `
          )
          .eq('id', id)
          .eq('event_types.user_id', user.id)
          .single();

        if (bookingError || !booking) {
          return new Response(
            JSON.stringify({ error: 'Booking not found or access denied' }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const { data: updatedBooking, error: updateError } = await supabase
          .from('event_bookings')
          .update({ status })
          .eq('id', id)
          .select()
          .single();

        if (updateError) {
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ data: updatedBooking }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

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

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
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
    } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    switch (req.method) {
      case 'GET': {
        // Get availabilities for event types owned by the user
        const url = new URL(req.url);
        const eventTypeId = url.searchParams.get('event_type_id');

        let query = supabase
          .from('event_availabilities')
          .select(
            `
            *,
            event_types!inner(user_id)
          `
          )
          .eq('event_types.user_id', user.id);

        if (eventTypeId) {
          query = query.eq('event_type_id', eventTypeId);
        }

        const { data: availabilities, error: getError } = await query
          .order('day_of_week')
          .order('start_time');

        if (getError) {
          return new Response(JSON.stringify({ error: getError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ data: availabilities }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'POST': {
        // Create new availability
        const body = await req.json();
        const { event_type_id, day_of_week, start_time, end_time } = body;

        if (
          !event_type_id ||
          day_of_week === undefined ||
          !start_time ||
          !end_time
        ) {
          return new Response(
            JSON.stringify({
              error:
                'event_type_id, day_of_week, start_time, and end_time are required',
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Verify the event type belongs to the user
        const { data: eventType, error: eventTypeError } = await supabase
          .from('event_types')
          .select('id')
          .eq('id', event_type_id)
          .eq('user_id', user.id)
          .single();

        if (eventTypeError || !eventType) {
          return new Response(
            JSON.stringify({ error: 'Event type not found or access denied' }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const { data: newAvailability, error: createError } = await supabase
          .from('event_availabilities')
          .insert({
            event_type_id,
            day_of_week,
            start_time,
            end_time,
          })
          .select()
          .single();

        if (createError) {
          return new Response(JSON.stringify({ error: createError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ data: newAvailability }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'PUT': {
        // Update availability
        const updateBody = await req.json();
        const {
          id,
          day_of_week: updateDay,
          start_time: updateStart,
          end_time: updateEnd,
        } = updateBody;

        if (!id) {
          return new Response(
            JSON.stringify({ error: 'Availability ID is required' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Verify the availability belongs to the user's event type
        const { data: availability, error: availabilityError } = await supabase
          .from('event_availabilities')
          .select(
            `
            *,
            event_types!inner(user_id)
          `
          )
          .eq('id', id)
          .eq('event_types.user_id', user.id)
          .single();

        if (availabilityError || !availability) {
          return new Response(
            JSON.stringify({
              error: 'Availability not found or access denied',
            }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const { data: updatedAvailability, error: updateError } = await supabase
          .from('event_availabilities')
          .update({
            ...(updateDay !== undefined && { day_of_week: updateDay }),
            ...(updateStart && { start_time: updateStart }),
            ...(updateEnd && { end_time: updateEnd }),
          })
          .eq('id', id)
          .select()
          .single();

        if (updateError) {
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ data: updatedAvailability }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'DELETE': {
        // Delete availability
        const deleteUrl = new URL(req.url);
        const deleteId = deleteUrl.searchParams.get('id');

        if (!deleteId) {
          return new Response(
            JSON.stringify({ error: 'Availability ID is required' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Verify the availability belongs to the user's event type
        const { data: deleteAvailability, error: deleteAvailabilityError } =
          await supabase
            .from('event_availabilities')
            .select(
              `
            *,
            event_types!inner(user_id)
          `
            )
            .eq('id', deleteId)
            .eq('event_types.user_id', user.id)
            .single();

        if (deleteAvailabilityError || !deleteAvailability) {
          return new Response(
            JSON.stringify({
              error: 'Availability not found or access denied',
            }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const { error: deleteError } = await supabase
          .from('event_availabilities')
          .delete()
          .eq('id', deleteId);

        if (deleteError) {
          return new Response(JSON.stringify({ error: deleteError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(
          JSON.stringify({ message: 'Availability deleted successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
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

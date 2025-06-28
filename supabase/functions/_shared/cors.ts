export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  // Note: Using wildcard '*' with token-based auth only (no cookies/credentials)
  // This is intentional as our Edge Functions use Authorization header exclusively
};

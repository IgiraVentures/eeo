-- Restrict the internal RLS auto-enable event-trigger function from API roles.
-- The existing ensure_rls event trigger remains unchanged and continues to invoke
-- this function internally when DDL creates tables in the public schema.

revoke execute on function public.rls_auto_enable()
from public, anon, authenticated, service_role;

grant execute on function public.rls_auto_enable()
to postgres;

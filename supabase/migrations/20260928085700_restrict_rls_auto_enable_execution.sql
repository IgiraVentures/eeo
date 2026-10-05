-- Restrict the optional Supabase Studio RLS auto-enable helper from API roles.
-- The helper is not part of EEO's application migration history, so fresh/local
-- databases may not contain it. Harden it only when it already exists; do not
-- provision a privileged SECURITY DEFINER event trigger as a side effect here.

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated, service_role';
    execute 'grant execute on function public.rls_auto_enable() to postgres';
  end if;
end
$$;

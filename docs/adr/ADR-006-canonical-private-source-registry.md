# ADR-006 — Canonical private source registry and Evidence Maintenance Pulse

- **Status:** Proposed; design-only review artifact, not a deployed database migration
- **Date:** 2026-10-18
- **Repository:** `IgiraVentures/eeo`
- **Target Supabase project:** `gjsavsmtdyuxnljfnvpt` (Earth's Endowment Observatory)
- **Decision scope:** first narrow canonical-backend increment; no public release or monitoring runtime

## Decision and repository reconciliation

Use the **existing schema names** from `docs/data-dictionary.md`: `core`, `review`, `private`, `analytics`, and released-only `public` views. Do not create competing `eeo_core`, `eeo_governance`, or `eeo_ops` names.

Bootstrap only `core.sources`, `core.source_licenses`, and a private, read-only `analytics.source_registry_maintenance_status()` assessment in phase 1. Create only the two schemas needed for these objects; establish other canonical objects incrementally after live-schema, authorization, audit, and reviewer-governance gates. Do not create public release views or open public database access in this phase.

**Important semantic mismatch:** the prototype `types/eeo.ts` and the normative `docs/data-dictionary.md` use different vocabularies for some source classifications, claim types, and confidence labels. Never silently map one taxonomy to the other. Phase 1 retains the TypeScript `Source` values exactly, with explicit `record_mode`; the later governed-taxonomy mapping requires its own reviewed decision.

The `data/sources.ts` rows are all currently `illustrative`. Copying them to Postgres must not promote them to `governed` or `released`. The prototype `licenseStatus: "open"` value is **not** evidence of an approved redistribution license: release-bound use still requires a separately recorded, appropriately reviewed license/use basis.

## What the maintenance pulse legitimately measures

The first read-only pulse counts (a) sources present, (b) sources with an explicitly due review date, (c) sources without a configured review date, and (d) sources without a reviewed redistribution basis. It returns `awaiting_source_import` when no rows exist and does **not** report success at source review, release readiness, or evidence verification. A pulse is **not** a source review and must never advance `accessed_date`, `reviewed_at`, `record_mode`, approval, or legal status.

After evidence/claim tables and controlled imports exist, add claim freshness, missing evidence, and unresolved correction/release blockers in a separate versioned increment. Maintain semantic consistency with `lib/claimFreshness.ts` (UTC dates; 30-day `stale_soon` threshold), `lib/evidenceIntegrity.ts`, and the governed sign-off rules. No monitoring signal registry, geospatial collection, scraping, or automated claim approval is activated.

## Proposed SQL for review — NOT an executable migration in this PR

**Do not paste this into production or auto-apply it.** First inspect the current live schema and migration history, generate a migration with `supabase migration new` using the installed CLI, and validate on an isolated database. Deliberately use `CREATE SCHEMA`/`CREATE TABLE` without `IF NOT EXISTS` so an unexpected existing object stops the deployment rather than silently masking drift.

```sql
-- Phase 1: private source metadata only. Not yet applied to any database.
create schema core;
create schema analytics;

revoke all on schema core, analytics from public, anon, authenticated, service_role;

create table core.sources (
  id text primary key check (length(btrim(id)) > 0),
  record_mode text not null check (
    record_mode in ('synthetic','illustrative','governed','released','restricted')
  ),
  title text not null check (length(btrim(title)) > 0),
  publisher text not null check (length(btrim(publisher)) > 0),
  url text,
  source_type text not null check (
    source_type in ('government','multilateral','company','ngo','academic',
                    'satellite','community','media','other')
  ),
  jurisdiction text,
  publication_date date,
  accessed_date date not null,
  license_status text not null check (
    license_status in ('open','restricted','unknown','permission_required')
  ),
  next_review_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table core.source_licenses (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references core.sources(id) on delete restrict,
  license_name text not null check (length(btrim(license_name)) > 0),
  license_url text,
  license_type text not null check (
    license_type in ('open','restricted','partner','api_terms','other')
  ),
  redistribution_allowed boolean,
  derivative_works_allowed boolean,
  commercial_use_allowed boolean,
  attribution_required boolean,
  attribution_text text,
  partner_restrictions text,
  expiration_date date,
  legal_review_status text not null default 'pending'
    check (legal_review_status in ('pending','approved','flagged')),
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  check (
    legal_review_status <> 'approved'
    or (reviewed_by is not null and length(btrim(reviewed_by)) > 0
        and reviewed_at is not null)
  )
);

create index source_licenses_source_id_idx
  on core.source_licenses (source_id);

-- Private schemas are not configured as PostgREST-exposed schemas.
-- Still enable RLS as defense in depth; grant NO API-role policies.
alter table core.sources enable row level security;
alter table core.source_licenses enable row level security;

revoke all on all tables in schema core
  from public, anon, authenticated, service_role;

create function analytics.source_registry_maintenance_status()
returns table (
  checked_at timestamptz,
  operational_state text,
  sources_total bigint,
  sources_due_for_review bigint,
  sources_without_review_schedule bigint,
  sources_without_approved_redistribution_basis bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    now() as checked_at,
    case when (select count(*) from core.sources) = 0
      then 'awaiting_source_import'
      else 'source_metadata_present'
    end as operational_state,
    (select count(*) from core.sources) as sources_total,
    (select count(*) from core.sources
      where next_review_on <= (now() at time zone 'UTC')::date)
      as sources_due_for_review,
    (select count(*) from core.sources where next_review_on is null)
      as sources_without_review_schedule,
    (select count(*) from core.sources s
      where not exists (
        select 1 from core.source_licenses l
        where l.source_id = s.id
          and l.legal_review_status = 'approved'
          and l.redistribution_allowed is true
          and (l.expiration_date is null
               or l.expiration_date >= (now() at time zone 'UTC')::date)
      ))
      as sources_without_approved_redistribution_basis;
$$;

revoke all on function analytics.source_registry_maintenance_status()
  from public, anon, authenticated, service_role;
```

**Why this is safe to draft but not yet safe to deploy:** the schema creates no public data read surface, adds no public RPC, assigns no approval or governed record modes, contains no real individual/location/evidence records, grants no application-role writes, and makes no privileged `SECURITY DEFINER` function. It also deliberately leaves ingestion, audit logging, and reviewer authorization *unimplemented*; hence production ingestion must remain disabled.

## Required verification before migration/apply

1. Verify that the connected Supabase organization can read the **exact** EEO project ref. The current connector has returned permission denied on `gjsavsmtdyuxnljfnvpt`; access to another IgiraVentures Supabase project is not a substitute.
2. Confirm the live Security Advisor no longer reports the original `public.rls_auto_enable()` execution warnings. The owner has independently verified denial for `anon`, `authenticated`, and `service_role`; `ensure_rls` is configured and enabled, but the event trigger's DDL behavior has not been exercised in a controlled test.
3. Inspect `pg_namespace`, `information_schema.tables`, function definitions, current permissions, and `supabase_migrations.schema_migrations`; investigate collisions, do not overwrite.
4. Generate a correctly named migration using the Supabase CLI (`supabase migration new <name>`) only after reviewing the live state; do not invent migration versions or apply this proposed SQL directly.
5. Execute migration replay and role-denial tests in an isolated Postgres/Supabase environment. Validate both `anon` and `authenticated` **cannot** read or write either private table or call the private maintenance function. Confirm expected administrator `SELECT` results and no unintentional `PUBLIC` function `EXECUTE` grants.
6. Run Supabase security and performance advisors, check fresh-schema migration ordering, obtain owner approval, and apply via the supported deployment process.
7. After source metadata import is authorized, compare identifiers, provenance, `record_mode`, dates, and license-status values with `data/sources.ts`. Do not manufacture reviewed licenses or change illustrative records' publication status. Follow the migration with an audited rollback/restore plan.

## Scheduled external execution: **later, not activated by this PR**

After controlled source import, a server-side authenticated endpoint may query the private status function using a **dedicated least-privilege read-only identity**. An external GitHub Actions schedule may call that endpoint at approximately 02:17, 10:17 and 18:17 UTC. The worker must: fail closed on auth/db failures; validate one bounded response; redact secrets and internal details from logs; surface failed runs to an operator; and never perform any evidentiary write or claim approval.

Do not publish this function or its potentially sensitive counts as a public RPC to make a keepalive easier. Do not use a service-role key in browser code. Do not activate the schedule before verifying credentials, least privilege, RLS, rate limiting, and failure monitoring. Database requests are legitimate maintenance reads, but Supabase Free-plan activity thresholds are not a service-availability guarantee.

## Risk and stop gate

**High-risk downstream scope:** database schema, access privileges, migration deployment, scheduling, and evidence data classification. This ADR changes none of those at runtime. Stop after the PR; do not merge, auto-merge, apply SQL, configure secrets, deploy, or enable scheduling without the repository's owner-controlled gates.

Subsequent increments: normalized source/evidence/claim/entity links with exact prototype-mode fidelity; authority-scoped review/correction/audit workflow; controlled release manifests and public-safe views; operationally authenticated Evidence Maintenance Pulse; proof of end-to-end external runs. Preserve the explicit **not released** state until all release gates are satisfied.

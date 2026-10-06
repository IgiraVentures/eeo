# EEO Agent State

## Last updated

2026-09-30

## Current repo observations

- framework: Next.js App Router application with TypeScript, React, Tailwind CSS, Vitest, and ESLint.
- package manager: pnpm, standardized by `packageManager` in `package.json` and `pnpm-lock.yaml`.
- routing: `app/` uses App Router routes. Public surfaces include `/`, `/corridors/copper-cobalt`, `/corridors/copper-cobalt/dossier`, `/evidence-ledger`, `/methods`, `/safeguards`, `/corrections`, `/right-of-reply`, `/trust`, and related governance/disclosure pages. Internal or reviewer-oriented surfaces include `/review` and `/workspace`; `/pilot/*` paths are redirects only.
- styling: Tailwind plus EEO-specific CSS tokens and utilities in `app/globals.css`.
- data approach: prototype TypeScript data modules under `data/`, including claims, evidence, sources, entities, corridor dossier, source map, release manifest, review requirements, governed review signoffs, and review/access examples. Public live evidence is not stored in GitHub.
- schema/type approach: TypeScript contracts under `types/`, including corridor dossier, EEO domain types, human layer, map safety, release gate, review requirement/signoff, governed object-version and authority bindings, monitoring signal, and dormant temporal profile types.
- known build/test commands:
  - `pnpm dev`
  - `pnpm build`
  - `pnpm start`
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm verify`
  - `pnpm check:pilot-routes`
  - `pnpm check:pilot-hub-routes`
  - `pnpm check:corridor-section-routes`
  - `pnpm check:temporal-dormancy`
  - `pnpm check:brand-assets`
  - `pnpm sync:corridor-docs`

## Current doctrine and public posture

EEO is public-interest evidence infrastructure for endowment-to-economy chains. It is evidence for inquiry, not a verdict.

Public claims must preserve uncertainty, source limits, correction pathways, disclosure safeguards, and right-of-reply discipline where claims materially affect identifiable actors.

EEO must not be framed as:

- a legal tribunal;
- a court;
- a universal ownership registry;
- a global resource owner;
- an ESG score or ranking product;
- a certification system;
- a blockchain trust layer;
- an AI decision authority;
- a public exposure platform;
- a replacement for competent public, Indigenous, community, statistical, legal, or civil-society institutions.

## Observed doctrine surfaces

- `README.md` describes the public evidence prototype, live evidence boundary, core identity, anchored analytic chain, strategic dossier-first posture, and run scripts.
- `GOVERNANCE.md` defines version governance, right-of-reply discipline, temporal/monitoring deferral, public/private boundaries, and scope red lines.
- `DISCLOSURE_POLICY.md` defines tiered disclosure and product constraints.
- `DATA_POLICY.md`, `SECURITY.md`, and `AI_USE_POLICY.md` define operational boundaries.
- `docs/language-safety.md` provides public copy and claim language safety rules.
- `docs/map-safety-protocol.md` defines spatial disclosure defaults and map release gates.
- `docs/right-of-reply.md` and `docs/right-of-reply-protocol.md` cover reply/correction discipline.
- `docs/mvp-evidence-loop.md` documents the corridor-first evidence loop and public routes.
- `docs/corridor-charter-template.md` defines the authorization gate for any corridor before it moves beyond roadmap or candidate status.
- `docs/copper-cobalt-claim-readiness.md` records claim-by-claim release-readiness status for the current pilot corridor.
- `docs/claim-002-method-review-packet.md` records the bounded wording, source locator, limitations, stop conditions, and blank accountable review fields for `CLAIM-DRC-CO-002`.
- `docs/founding/README.md` is the founding-document hub.

## Completed increments

- Repository includes a Next.js App Router prototype with public EEO surfaces, corridor routes, evidence/correction/review/release helpers, and doctrine docs.
- Repository includes route discipline scripts, Vitest tests, lint, typecheck, and CI.
- 2026-07-29: Added a corridor charter template and roadmap/docs links so future corridors require boundary, evidence, source-rights, disclosure, map-safety, right-of-reply, reviewer, release-manifest, and stop-condition review before activation.
- 2026-07-29: Added a Copper-Cobalt claim readiness matrix that keeps `CLAIM-DRC-CO-001` release-scoped and keeps method, exposure, ownership, and actor-affecting claims withheld pending review.
- 2026-07-29: Hardened the source and wording basis for `CLAIM-DRC-CO-002` by recording the 2026 USGS DOI, edition, cobalt commodity-sheet locator, source-use basis, bounded estimate of about 55%, limitations, and `method_review` status.
- 2026-07-29: Added a method-review packet with auditable but blank human signoff fields. No reviewer decision or release approval has been inferred or recorded.
- 2026-07-29: Separated formal review requirements from completed signoffs, declared the accountable review lanes required for `CLAIM-DRC-CO-002`, and added readiness logic that treats missing, blocked, withdrawn, superseded, and expired decisions conservatively.
- 2026-07-29: Added an intentionally empty governed signoff dataset. Rehearsal-only signoff examples remain separate and cannot satisfy release readiness.
- 2026-07-29: Declared the same accountable review lanes for the currently included methodological claim so manifest gating cannot be bypassed by omitting requirement records.
- 2026-07-29: Added a manifest-level signoff gate that blocks included claims with missing requirements or pending, blocked, withdrawn, or expired governed decisions. The current illustrative manifest therefore remains structurally blocked while the governed signoff dataset is empty.
- 2026-07-30: Aligned React and ReactDOM at version 19.2.8, regenerated the frozen pnpm lockfile, and restored successful clean installation, tests, and production build.
- 2026-07-30: Surfaced the governed manifest gate and claim-level review lanes in the protected reviewer workspace using only public-safe summaries and aggregate states.
- 2026-07-30: Kept the reviewer panel read-only. It does not expose internal rationale, reviewer identities, private notes, restricted evidence, sensitive geography, or approval controls, and it states that rehearsal examples cannot satisfy the gate.
- 2026-07-30: Added focused regression coverage for the protected reviewer panel, including blocked manifest posture, claim 002 ineligibility, absence of approval controls, and non-disclosure of internal rationale.
- 2026-07-30: Defined governed sign-offs as a stricter subtype carrying an immutable SHA-256 object-version binding and an opaque accountable-authority binding.
- 2026-07-30: Added fail-closed structural validation for changed object content, invalid digests, unverified, revoked, expired, out-of-role or out-of-scope authority, expired decisions, and non-satisfying statuses.

## Current safe next step

The P0/P1 release-integrity branch now defines deterministic `eeo-json-v1` canonicalization, SHA-256 claim review bindings, and a fail-closed manifest gate that requires a current version-bound governed decision.

The next safe step after this branch is verified and merged is **P2: operationalize accountable human review**. Define authenticated reviewer identity, role/authority assignment, durable append-only audit storage, protected internal notes, retention/revocation rules, and a controlled decision-entry path. The governed signoff dataset must remain empty until those controls are real.

In parallel, complete **P3: the Copper-Cobalt Corridor Charter** to an explicit internal authorization decision. Do not infer authorization from the existing UI, dossier, illustrative manifest, or roadmap priority.

Do not add `CLAIM-DRC-CO-002` to the release manifest, mark it approved, create production governed signoff records, or start a second public corridor while accountable review and corridor authorization controls remain pending.

## Open risks

- Prototype persistence boundaries remain: correction submissions, reviewer notes, and activity logs may not be durable unless persistent storage is separately configured.
- Public/private boundary must remain strict. Do not expose reviewer notes, submitter identities, restricted map coordinates, internal triage reasoning, authority references, or sensitive harm-review details.
- The public homepage and corridor pages already contain strong posture language, but every new claim card or dossier paragraph still requires language-safety review.
- Future corridor expansion could create global-atlas or public-exposure drift unless the corridor charter gate is enforced.
- Visible prototype claims can be mistaken for release-approved public findings unless release-manifest scope remains explicit.
- A prepared method-review packet, declared requirement, authority record, or version binding can be mistaken for completed approval unless pending state and the absence of governed signoffs remain explicit.
- Repository-backed signoff records are not a substitute for authenticated workflow, durable audit storage, reviewer authorization checks, protected internal notes, retention controls, or version-bound decisions.
- The current illustrative manifest is not structurally ready under the governed signoff gate because no current governed signoffs are recorded. This remains visible in the protected reviewer workspace.
- The protected reviewer panel is a read-only diagnostic surface, not an approval workflow or legal record.
- `eeo-json-v1` canonicalization and claim review snapshot generation are implemented on the P0/P1 branch, but no content digest should be treated as operational approval until branch CI passes and authenticated reviewer/audit controls exist.
- CI currently runs frozen installation, route checks, temporal dormancy, lint, typecheck, tests, and build. Keep CI and `pnpm verify` aligned intentionally.

## Deferred items

- Global atlas, rankings, composite scores, certification seals, monitoring dashboards, alerts, scenario/forecast UI, temporal profile UI, blockchain modules, AI judgment surfaces, and public community reporting modules are deferred.
- Additional public corridors are deferred until Copper-Cobalt release discipline is coherent and the proposed corridor has a completed charter.
- Live data ingestion and governed evidence storage are deferred until access controls, private storage, audit logs, release views, review workflows, backups, retention rules, and security review are ready.
- Authenticated review-decision entry, reviewer assignment, digital signatures, durable signoff persistence, and release execution are deferred until authorization, audit, privacy, retention, and security requirements are defined.
- Monitoring and temporal profile runtime features remain deferred until the corridor dossier and release discipline are coherent.

## Last checks run

- 2026-10-05: Current `main` has a coherent frozen lockfile and current dependency baseline; the earlier dangling `@types/node@26.6.2` failure is no longer present on `main`.
- 2026-10-05: After governance review, the P0/P1 staging branch was hardened to reject future review/authority timestamps, reject malformed supplied expiry timestamps, and pin an exact UTF-8 SHA-256 regression vector. Fresh current-head CI is required before this staging branch can be used to refresh the signed replacement PR; no release authorization is implied.
- 2026-09-30: Baseline React runtime alignment was repaired independently on `main` by PR #149.
- 2026-07-30: Clean `pnpm install --frozen-lockfile` and `pnpm verify` passed after React and ReactDOM alignment; later governance increments added further tests.
- CI must continue to run frozen installation, route checks, temporal dormancy, lint, typecheck, tests, and production build for every candidate integration head.

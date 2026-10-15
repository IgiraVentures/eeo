# EEO Canonical Project Status

**Status date:** 2026-09-30  
**Repository:** `IgiraVentures/eeo`  
**Authority:** This file is the canonical status register for implementation and release posture. `ROADMAP.md`, `CHANGELOG.md`, and `docs/agent-state.md` must not contradict it.

## Status dimensions

EEO uses four independent status dimensions. They must not be collapsed into one label.

- **development_complete** — the scoped code/docs for the milestone are present in the prototype.
- **operationally_ready** — required runtime, persistence, security, review, and accountability controls for the milestone's intended operation are in place.
- **release_authorized** — accountable human review and release authority have approved the exact governed version.
- **public_released** — an authorized release has been published through the EEO release process.

A development-complete milestone is not automatically operationally ready, release-authorized, or publicly released.

## Current institutional posture

- EEO is a **pre-release governed prototype**.
- Copper-Cobalt is the **current flagship/MVP corridor**, but public-release authorization is not established by visual readiness, prototype data, or an illustrative manifest.
- The current release manifest is illustrative and remains structurally blocked while governed sign-offs are absent.
- No formal public release tag has been cut.
- No second public corridor should be activated until the Copper-Cobalt release loop is coherent.
- Funding-dossier implementation is not yet the active engineering milestone.
- Temporal, monitoring, forecasting, scoring, global-atlas expansion, certification, blockchain, and public community-reporting features remain deferred.

## Milestone register

| Milestone | Scope | Development | Operational | Release authorized | Public released |
|---|---|---|---|---|---|
| v0.4 | Corrections intake, protected review, triage/activity log | development_complete | prototype_only | no | no |
| v0.5 | Claim governance and release-manifest integration | partial | prototype_only | no | no |
| v0.6 | Doctrine, dossier foundation, source map, map safety, right of reply | development_complete | prototype_only | no | no |
| v0.6.1 | Dossier governance repair and runtime dossier coherence | development_complete | prototype_only | no | no |
| v0.7 | Evidence population and inspectable claim-to-source release loop | development_complete | prototype_only | no | no |
| v0.8 | Monitoring Signal Registry contract only | development_complete | contract_only | no | no |
| v0.9 | Access governance and research-to-publication protocol | development_complete | contract_and_docs | no | no |
| v1.0 | Internal access-decision rehearsal | development_complete | rehearsal_only | no | no |
| v1.1 | Internal release-gate model | development_complete | prototype_only | no | no |
| v1.2 | Protected release-readiness preview | development_complete | diagnostic_only | no | no |
| v1.3 | Formal review requirement/sign-off contracts and governed-signoff hardening | development_complete | not_yet_authoritative | no | no |
| pre-v1.4 hardening | Version-bound review integrity, accountable authority and corridor authorization controls | active | not_yet_authoritative | no | no |
| v1.4 | Funding dossier | not_started | not_applicable | no | no |
| v1.5+ | Temporal/monitoring/scenario activation under governance gates | deferred | deferred | no | no |

## Current release blockers

Before the first formal public release, at minimum:

1. complete deterministic `eeo-json-v1` canonicalization and SHA-256 object-version binding;
2. require version-bound governed sign-offs in the manifest gate;
3. establish authenticated accountable reviewer authority and durable audited decision storage;
4. complete and approve the Copper-Cobalt Corridor Charter for the intended release stage;
5. complete required review lanes for the exact release-scoped claim versions;
6. produce an authoritative signed release manifest;
7. verify correction, right-of-reply, disclosure, map-safety, source-rights, and withdrawal paths;
8. complete a bounded external review/limited-beta cycle before broader launch.

## Language rule

Use:

> EEO is a substantial pre-release governed prototype with public-facing evidence surfaces and protected review infrastructure.

Do not say, without new evidence:

- EEO has formally launched.
- Copper-Cobalt is publicly authorized.
- the illustrative manifest is a signed release.
- an approved-looking prototype claim has completed accountable governed review.
- v1.4 funding-dossier implementation is complete or current.
- monitoring, temporal/scenario runtime, or a global atlas is active.

## Change-control rule

Any change to milestone status must identify:

- the exact milestone;
- evidence that development scope exists;
- operational controls required for its intended use;
- accountable approval state;
- public release state;
- remaining blockers.

When these dimensions disagree, the most conservative applicable status governs public claims about readiness.

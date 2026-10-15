# Changelog

> **Version convention:** This project is pre-release. `docs/project-status.md` is authoritative for development, operational, authorization, and public-release status. Development-complete prototype code is not evidence of accountable release authorization or public launch. A formal versioned release will be tagged only after the public launch gates in `docs/release-process.md` are satisfied.

## Unreleased

### Pre-v1.4 — Release Integrity Hardening

- Added a canonical project-status register separating development completion, operational readiness, release authorization, and public release.
- Added deterministic `eeo-json-v1` canonicalization for explicit governed review scopes.
- Added SHA-256 claim review object-version generation with review-process metadata excluded from the governed content snapshot.
- Tightened manifest sign-off gating so only current, version-bound, in-scope governed sign-offs can satisfy required review lanes.
- Kept governed sign-off data empty; no approval, release authorization, or public launch is inferred.
- Funding-dossier work remains downstream of release-integrity hardening.

### v1.3 — Formal Review Sign-Off Contract

- Added formal review sign-off types (`types/reviewSignoff.ts`).
- Added inert sign-off rehearsal examples (`data/reviewSignoffExamples.ts`).
- Added review sign-off protocol (`docs/review-signoff-protocol.md`).
- No public sign-off UI, database persistence, monitoring runtime, forecasting, scoring, global atlas, or release-manifest enforcement.

### v1.2 — Internal Release Readiness Preview

- Added protected review-workspace release-readiness preview.
- Used release-gate helpers to assess the sample claim (`CLAIM-DRC-CO-001`).
- Preserved release manifest as public boundary — preview is reviewer-only (`/review`).
- No public UI, monitoring runtime, forecasting, scoring, or database persistence added.

### v1.1 — Release Gate Integration Design

- Added release-gate type contract (`types/releaseGate.ts`).
- Added internal release-gate helper logic (`lib/releaseGate.ts`).
- Added release-gate integration documentation (`docs/release-gate-integration.md`).
- Preserved no-public-UI, no-monitoring-runtime, no-forecasting, and no-public-internal-blocker boundaries.

### v1.0 — Internal Access Decision Review Preview

- Added inert access-decision examples (`data/accessDecisionExamples.ts`).
- Added access-decision review preview documentation (`docs/access-decision-review-preview.md`).
- Preserved access-governance, map-safety, right-of-reply, language-safety, release-manifest, and press-management boundaries.
- No public UI, monitoring runtime, forecasting, scenario notes, scoring, database persistence, or new public data surface added.

### v0.9 — Access Governance + Research-to-Publication Protocol

- Added access-governance type contract (`types/accessGovernance.ts`).
- Added access-governance documentation (`docs/access-governance.md`).
- Added research-to-publication workflow (`docs/research-publication-workflow.md`).
- Added press-management protocol (`docs/press-management.md`).
- Updated roadmap/governance and linked documentation for access-governance alignment.
- No runtime access dashboard, monitoring UI, forecasting, scoring, or new public data surfaces added.

### v0.8 — Monitoring Signal Registry Contract

- Added type-only monitoring signal contract (`types/monitoringSignal.ts`).
- Added monitoring signal registry documentation (`docs/monitoring-signal-registry.md`).
- Updated roadmap and governance boundaries for v0.8/v0.9 gating and non-prediction posture.
- No monitoring UI, live feeds, alerts, forecasts, scenario notes, or temporal runtime activation added.

### v0.7 — Evidence population + dossier release gate

- Connected one complete inspectable methodological claim loop: dossier → claim (`CLAIM-DRC-CO-001`) → evidence (`EVID-USGS-CO-001`, `EVID-UNCOMTRADE-CO-001`) → sources (`SRC-*`) → source limitations → claim governance / correction link → release manifest.
- Added claim-evidence-source helpers and completeness checks in `lib/claimUtils.ts`.
- Enhanced public claim cards with evidence completeness warning and source-limitations panel.
- Extended release manifest surface to include map-safety restrictions, source limitations summary, right-of-reply applicability context, and evidence completeness summary.
- Strengthened `/dossier` with evidence completeness statuses, source-map claim linkage display, and section-level structure-only warnings.

### v0.6.1 — Dossier governance repair pass

- Added roadmap **Milestone Register** and gate rule clarifying `v0.5` partial, `v0.6.1` current, and the sequencing constraint before `v0.7`.
- Added `/dossier` runtime page powered by `data/corridorDossier.ts` with explicit prototype-structure labels and public-safe governance summaries.
- Strengthened source-map operational fields in `data/sourceMap.ts` (sourceId/publisher/sourceType/usedFor/claim-link slots/source limitations/access/licensing/map-safety relevance support).
- Added map-safety enforcement utility in `lib/mapSafety.ts`.
- Added right-of-reply applicability helper in `lib/publicationRules.ts` and surfaced applicability language on public claim cards.
- Added prototype persistence boundary language in `README.md` and `GOVERNANCE.md`.
- Added manual legal-language risk checklist in `docs/language-safety.md`.

### v0.6 — Endowment doctrine + corridor dossier schema + source map

- **Doctrine:** Canonical definition of Earth’s endowments, human capability vs inventorying people, relational “capacities in relation,” and universal analytical concern / not universal exposure — **`README.md`**, **`GOVERNANCE.md`**, **`ROADMAP.md`**, **`app/pilot/methods-and-limits`**, **`app/pilot/safeguards`**.
- **Knowledge governance:** Indigenous/community/worker knowledge caution and open-data tiers — **`GOVERNANCE.md`** and pilot safeguards copy.
- **Corridor dossier contracts:** **`types/corridorDossier.ts`** (`CorridorDossierSection`, `DossierSectionStatus`, section records, `CorridorDossier`).
- **Map-safety gate (types + docs):** **`types/mapSafety.ts`**, **`docs/map-safety-protocol.md`** (“map because you can” principle; no production map layers).
- **Source / non-duplication map:** **`data/sourceMap.ts`** (`SourceDomain`, `SourceMapUse` — all six intents demonstrated: **integrate**, **cite**, **compare**, **evaluate**, **defer**, **do_not_duplicate**; pilot entries stay humble and non-replacement of upstream systems).
- **Skeleton dossier data:** **`data/corridorDossier.ts`** (Copper–cobalt pilot placeholder; sections `not_started` / `source_mapping` where appropriate).
- **Right-of-reply:** **`docs/right-of-reply.md`**; cross-links from **`GOVERNANCE.md`** and **`docs/right-of-reply-protocol.md`**.
- **Roadmap sequencing:** **`v0.6`→`v0.7` content → `v0.8` hardening → `v1.0` RC → partner review → funding → `v1.3+` temporal/monitoring/scenario** — **`ROADMAP.md`**. **`types/temporalProfile.ts`** remains a **dormant** boundary marker (**no activation** this milestone).

### UX / navigation hygiene

- **`EeoSiteHeader`** reads **`PILOT_PUBLIC_NAV`** (removes duplicated inline nav constants).
- **`pilotPublicNav`** adds **`/pilot`** as **Pilot hub** next to Observatory.

### Documentation

- Added **`docs/founding/README.md`** as the single hub for constitution, policies, protocols, roadmap, changelog, governance, GitHub housekeeping, canonical code pointers, and doctrine cross-links to **`README`**, **`GOVERNANCE`**, **`ROADMAP`**; **`docs/README.md`** links there first; **`CONTRIBUTING`** and **`docs/mvp-evidence-loop`** point newcomers at the hub.
- **Doctrine anchor:** public-interest evidence infrastructure; **`v0.6`** dossier/schema/source-map (not temporal UI); **`v1.3+`** defers temporal, monitoring, scenario — see **`README`**, **`GOVERNANCE.md`**, **`ROADMAP.md`**.
- **Pilot navigation docs:** **`README`** “Run locally” matches **`lib/pilotPublicNav.ts`** header shortcuts vs full **`/pilot`** hub; **`docs/mvp-evidence-loop`** lists **`app/pilot/`** URLs, legacy redirects, and CI check; **`PilotRouteNav`** links **`/pilot`** for the full list; **`docs/founding`** blurb updated for **`mvp-evidence-loop`** scope.
- **`EeoSiteFooter`:** Safeguards / Methods / Corrections links use **`/pilot/*`** canonical paths (**`pnpm check:pilot-routes`**).
- **`lib/pilotHubRoutes.ts`** + **`PilotHubRouteList`:** single source for every shipped **`/pilot`** child page; **`/pilot`** hub renders the full exploration list (**`docs/mvp-evidence-loop`** cross-reference).
- **`pnpm check:pilot-hub-routes`:** CI + **`pnpm verify`** guard so **`pilotHubRoutes`** cannot drift from **`app/pilot/<segment>/page.tsx`** layouts and **`pilotPublicNav`** **`/pilot`** shortcuts stay valid.

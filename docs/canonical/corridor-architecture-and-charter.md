# EEO Corridor Architecture and Charter Gate

## Status
Canonical implementation guidance for the current prototype. This document does not authorize a new public corridor.

## Architecture rule
EEO uses three structures for three different jobs:

1. **Endowment domains classify.**
2. **Corridor cases investigate.**
3. **Mandatory cross-cutting layers discipline every corridor case.**

A domain is not a corridor and is not a public product. A corridor case is the bounded unit of investigation and publication. Cross-cutting layers prevent a corridor from appearing complete merely because one commodity or trade chain is visible.

## Endowment domains
The canonical classification domains are Geological & Mineral; Energy; Freshwater & Cryosphere; Forest & Woodland; Land, Soil & Food-Production; Ocean & Coastal; Biodiversity, Genetic Resources & Ecosystem Functions; and Atmosphere & Climate-Regulation.

Domains may overlap. Every corridor case has one primary domain and may reference linked domains where material. The registry does **not** mean EEO has eight active corridors.

## Corridor Charter
Every corridor case must have a versioned Corridor Charter before it can be treated as authorized. Status is exactly one of: roadmap, candidate, provisional, authorized, active_internal, limited_beta, public, paused, retired.

Public-release work fails closed unless the Charter has a `go` decision, an authorized-or-later status, resolved boundaries, completed source/license review, sufficient evidence coverage, governance safeguards, accountable review roles, and no unresolved authorization items.

## Mandatory cross-cutting layers
Every corridor case assesses: endowment condition; governance/rights/consent; human dependency/public capability; labor/health/human rights; ownership/finance/control; processing/trade/logistics; public revenue/value capture; ecological integrity/cumulative/nexus effects; waste/circularity/restoration/future liability; evidence/disclosure/remedy.

A layer may be `not_material` only with a written materiality rationale. Otherwise it must reach `ready` before corridor publication readiness can pass.

## Current Copper-Cobalt posture
The Copper-Cobalt case remains **provisional**. The Charter intentionally records `pause` because geography, downstream boundary, corridor-wide period, source/use-basis review, evidence coverage, rights-holder scope, and cross-cutting layer reviews remain incomplete.

## Release sequence
```text
corridor case
-> Corridor Charter
-> authorization
-> source / license or use basis
-> evidence
-> claim
-> entity / geography resolution
-> cross-cutting layer assessments
-> analytical / legal / exposure review
-> right-of-reply where required
-> release decision
-> signed release manifest
-> public evidence dossier
-> correction route
```

No Charter or layer assessment authorizes factual truth by itself. Existing claim-level evidence, disclosure, map-safety, correction, review-signoff, and release-manifest controls remain required.

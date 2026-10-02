# EEO Review Object Versioning Protocol

## Purpose

Governed review decisions must attach to the exact content that was reviewed. A claim identifier, branch name, mutable timestamp, or repository commit alone is not a sufficient review binding.

EEO uses:

- canonicalization: `eeo-json-v1`;
- digest algorithm: `sha256`;
- object-specific schema version;
- explicit governed review scope.

This protocol supports integrity. It does not authenticate a reviewer, authorize publication, or replace durable audit controls.

## eeo-json-v1 canonicalization

The canonicalizer accepts only JSON-compatible values with stricter fail-closed rules.

1. Object property names are sorted lexicographically using JavaScript's deterministic string ordering.
2. Array order is preserved.
3. Strings are serialized with `JSON.stringify` semantics and are not Unicode-normalized.
4. Finite numbers use `JSON.stringify` number serialization.
5. `null` and booleans use ordinary JSON literals.
6. `undefined`, bigint, symbols, functions, accessors, non-enumerable properties, non-plain objects, non-finite numbers, and cyclic references are rejected.
7. Unsupported values are never silently removed or converted.

The resulting UTF-8 canonical string is hashed with SHA-256 and encoded as lowercase hexadecimal.

## Claim review scope: claim-review-v1

The governed snapshot includes release-relevant claim content:

- id and record mode;
- title and plain-language claim;
- claim type and legal posture;
- corridor node;
- evidence links;
- entity links;
- confidence;
- exposure risk;
- publication decision;
- right-of-reply requirement, status, and reason;
- what the claim does not prove;
- what would revise the claim;
- last-updated date;
- stale-after date.

The snapshot deliberately excludes review-process state:

- `reviewStatus`;
- `lastReviewed`;
- `governanceStatus`;
- `lastGovernanceReviewAt`;
- `governanceNote`;
- `linkedCorrectionIds`.

Those fields can change because the review process advances. Including them would create circular invalidation in which completing a review changes the object that was reviewed.

If a future policy requires one of those fields to become governed release content, introduce a new schema version rather than silently changing `claim-review-v1`.

## Validity rule

A governed sign-off can satisfy a release requirement only when:

1. its object type and object id match the requirement;
2. its object-version binding matches the current object's schema version, canonicalization algorithm, digest algorithm, and content digest;
3. its SHA-256 digest is structurally valid;
4. its accountable authority is verified, current, role-matched, and in scope;
5. the sign-off is current and has a satisfying decision status;
6. all required review lanes independently satisfy these conditions.

Any mismatch fails closed.

## Security and governance boundary

A matching digest proves only that two parties computed the same digest from the same canonical governed content under the declared schema. It does **not** prove:

- the underlying claim is true;
- the source is authoritative;
- the reviewer is who they claim to be;
- the reviewer had authority;
- right of reply was adequate;
- legal or disclosure review was sufficient;
- a release manifest was signed;
- publication is authorized.

Authentication, authorization, durable append-only audit storage, protected notes, retention, revocation, and release execution remain separate operational controls.

## Change control

Do not alter canonicalization behavior or a governed snapshot schema in place after sign-offs exist.

A material change requires:

- a new canonicalization identifier or schema version;
- migration documentation;
- regression tests with known vectors;
- explicit treatment of existing sign-offs;
- review of whether old bindings remain valid, are superseded, or must be re-reviewed.

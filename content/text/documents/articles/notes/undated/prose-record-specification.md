---
name: prose
description: Specification of the observation surface and check manifest for a candidate prose body. Used by the linting transformer to evaluate whether a prose record is in normal form against the running valuation. Refines the resource-file specification by adding modal-evaluation checks on cell positings.
status: active
derives-from:
  - ../../../../code/structures/prose.md
  - ../resource-file/resource-file.md
  - ../markdown.md
topic: governance
contains:
  - schema.json
  - checks.json
---

This specification defines the lintable surface for prose: the concrete observation a linter extracts from one markdown record's body, plus the check manifest that determines whether the body's cell positings are admissible against the running valuation.

The specification refines [`resource-file`](../../../../../../../../../../../../../../../public-services-section/services/personal-services-section/services/emsenn-services-section/lib/preservation/emsenn-archive-org/resource-file.md) by adding the modal-evaluation check kinds. A prose record satisfies both manifests in composition: surface checks from the resource-file manifest (path, slug, frontmatter shape, naming discipline) and modal checks from this manifest (per-cell modal-interval evaluation, derivation chains, mode coherence).

## Observation

A prose-record observation records, in addition to the resource-file observation fields:

- The body split into sentences.
- The addressing surface — the set of cells $(s, p, o)$ the body's sentences posit on.
- The declared mode (one of `explanation`, `tutorial`, `guide`, `reference`), inferred from the file's structure class (its path under `prose/teaching/<mode>/` or the structure named in `derives-from`).
- The running valuation $u$ against which the body is to be evaluated, computed from the repository state at the time of lint.

## Check manifest

`checks.json` declares the prose-specific checks. The checks divide into two classes:

**Surface checks** are evaluable in $O(\text{body size})$ without consulting the running valuation. They catch surface markers of gesture-text and structural defects.

**Modal checks** evaluate cell positings against the modal pair $(\Box_R u, \Diamond_R u)$ at each addressed cell, per [modal-necessity-operator](../../../../../../../../../../../../../../../../../science-services-section/services/philosophy-services-section/services/logic-services-section/content/text/documents/articles/notes/undated/modal-necessity-operator.md) and [modal-possibility-operator](../../../../../../../../../../../../../../../../../science-services-section/services/philosophy-services-section/services/logic-services-section/content/text/documents/articles/notes/undated/modal-possibility-operator.md). They require the running valuation and the prevailing accessibility relation; evaluation is polynomial-time in the strict and Scott-continuous regimes, PSPACE in general per [modal-complexity-bounds](../../../../../../../../../../../../../../../public-services-section/services/personal-services-section/services/theories/humanities/theories/math/theories/categories/theories/predication-categories/prose/learning/claims/modal-complexity-bounds.md).

## Hook use

The `linter-of-a-resource-file` agent's PostToolUse hook fires on every Write/Edit/MultiEdit. When the changed file's structure class is `prose` or one of its refinements, the linter loads this manifest alongside the resource-file manifest and evaluates the union.

## Adding checks

Adding another instance of an existing check kind is a manifest edit. Adding a new check kind is a script change in the linter and should be paired with a short note in this specification, naming the kind, its observation requirements, and its evaluation cost class.

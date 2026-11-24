---
name: resource file
description: Specification of resource-file observations and the check-manifest surface used by linting-a-resource-file.
status: active
derives-from:
  - code/structures/resource-file.md
  - ../file.md
  - ../resource.md
  - ../markdown.md
  - ../yaml.md
topic: governance
contains:
  - schema.json
  - checks.json
---

This specification defines the lintable surface for a `resource-file`: the concrete observation a linter can extract from one repository file before or after a write.

The schema validates the observation shape. The check manifest declares semantic checks over that observation. The linter is an interpreter of this specification, not the place where every rule is permanently buried.

## Observation

A resource-file observation records:

- the repository-relative path and filename parts
- whether the file is markdown
- whether the file is a marker file such as `_index.md` or `SKILL.md`
- parsed YAML frontmatter when present
- body text after frontmatter
- a role class inferred from the path when one is known

## Check Manifest

`checks.json` is the first local registry of checks. Each check has a stable `name`, a `kind` interpreted by the linting skill, and a `level`.

Adding another instance of an existing check kind should be a manifest edit. Adding a new kind is a script change and should be paired with a short specification note here or in the specification that owns the invariant.

## Hook Use

The `linter-of-a-resource-file` agent may run this specification as a post-write hook. In hook mode, lint failures are returned as additional context rather than rewriting the file.

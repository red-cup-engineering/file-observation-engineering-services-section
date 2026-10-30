import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { resolvePriorityPathsConfig, SHIPPED_PRIORITY_PATHS_CONFIG } from "../src/priority-paths-config.mjs";

test("resolves root-local policy before the shipped generic policy", async () => {
  const root = await mkdtemp(join(tmpdir(), "path-policy-"));
  try {
    const shipped = await resolvePriorityPathsConfig({ root });
    assert.equal(shipped.sourcePath, SHIPPED_PRIORITY_PATHS_CONFIG);
    assert.ok(shipped.excludes.includes("node_modules"));
    await mkdir(join(root, "etc"));
    await writeFile(join(root, "etc", "priority-paths.json"), JSON.stringify({ priorityPaths: ["notes"], excludes: ["cache"] }));
    const local = await resolvePriorityPathsConfig({ root });
    assert.deepEqual(local.priorityPaths, ["notes"]);
    assert.deepEqual(local.excludes, ["cache"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("requires an explicitly requested config to exist and validates arrays", async () => {
  const root = await mkdtemp(join(tmpdir(), "path-policy-explicit-"));
  try {
    await assert.rejects(() => resolvePriorityPathsConfig({ root, configPath: join(root, "missing.json") }), /does not exist/u);
    const invalid = join(root, "invalid.json");
    await writeFile(invalid, JSON.stringify({ excludes: [3] }));
    await assert.rejects(() => resolvePriorityPathsConfig({ root, configPath: invalid }), /nonempty strings/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

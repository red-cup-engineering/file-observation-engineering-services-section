import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_DIRECTORY = dirname(dirname(fileURLToPath(import.meta.url)));
export const SHIPPED_PRIORITY_PATHS_CONFIG = join(PACKAGE_DIRECTORY, "etc", "priority-paths.example.json");

async function readJsonIfPresent(path) {
  try { return { config: JSON.parse(await readFile(path, "utf8")), path }; } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

function strings(value, name) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string" || entry.length === 0)) {
    throw new TypeError(`${name} must be an array of nonempty strings`);
  }
  return Object.freeze([...value]);
}

function freezeConfig(config, sourcePath) {
  if (!config || typeof config !== "object" || Array.isArray(config)) throw new TypeError("priority-paths config must be an object");
  return Object.freeze({
    type: "TokenSearchPriorityPaths",
    priorityPaths: strings(config.priorityPaths ?? [], "priorityPaths"),
    excludes: strings(config.excludes ?? [], "excludes"),
    sourcePath,
  });
}

/** Resolve explicit config, then a root-local override, then shipped generic policy. */
export async function resolvePriorityPathsConfig({ root, configPath } = {}) {
  if (typeof root !== "string" || root.length === 0) throw new TypeError("root is required");
  if (configPath !== undefined) {
    if (typeof configPath !== "string" || configPath.length === 0) throw new TypeError("configPath must be a nonempty string");
    const explicit = await readJsonIfPresent(resolve(configPath));
    if (explicit === null) throw new Error(`config path does not exist: ${configPath}`);
    return freezeConfig(explicit.config, explicit.path);
  }
  const local = await readJsonIfPresent(join(resolve(root), "etc", "priority-paths.json"));
  if (local !== null) return freezeConfig(local.config, local.path);
  const shipped = await readJsonIfPresent(SHIPPED_PRIORITY_PATHS_CONFIG);
  if (shipped !== null) return freezeConfig(shipped.config, shipped.path);
  throw new Error("no priority-paths config found");
}

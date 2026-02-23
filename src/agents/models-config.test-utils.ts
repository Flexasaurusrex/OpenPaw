import fs from "node:fs/promises";
import path from "node:path";
import { resolveOpenPawAgentDir } from "./agent-paths.js";

export async function readGeneratedModelsJson<T>(): Promise<T> {
  const modelPath = path.join(resolveOpenPawAgentDir(), "models.json");
  const raw = await fs.readFile(modelPath, "utf8");
  return JSON.parse(raw) as T;
}

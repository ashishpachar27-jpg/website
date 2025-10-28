import { promises as fs } from "fs";
import path from "path";
import { DraftRecord } from "@/types/test";

const DRAFTS_FILE = path.join(process.cwd(), "data", "drafts.json");

async function ensureFile() {
  try {
    await fs.access(DRAFTS_FILE);
  } catch {
    await fs.mkdir(path.dirname(DRAFTS_FILE), { recursive: true });
    await fs.writeFile(DRAFTS_FILE, "{}", "utf-8");
  }
}

export async function readDrafts(): Promise<Record<string, DraftRecord>> {
  await ensureFile();
  const contents = await fs.readFile(DRAFTS_FILE, "utf-8");
  return JSON.parse(contents || "{}");
}

export async function writeDrafts(drafts: Record<string, DraftRecord>) {
  await ensureFile();
  await fs.writeFile(DRAFTS_FILE, JSON.stringify(drafts, null, 2), "utf-8");
}

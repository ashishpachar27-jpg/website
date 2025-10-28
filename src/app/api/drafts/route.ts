import { NextResponse } from "next/server";
import { readDrafts, writeDrafts } from "@/lib/drafts";
import { DraftRecord, TestBuilderFormValues } from "@/types/test";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const drafts = await readDrafts();
  if (id) {
    const draft = drafts[id];
    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }
    return NextResponse.json(draft);
  }
  return NextResponse.json({ drafts: Object.values(drafts) });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { id: string; values: TestBuilderFormValues };
  if (!body.id) {
    return NextResponse.json({ error: "Missing draft identifier" }, { status: 400 });
  }
  const drafts = await readDrafts();
  const record: DraftRecord = {
    id: body.id,
    values: body.values,
    updatedAt: new Date().toISOString(),
  };
  drafts[body.id] = record;
  await writeDrafts(drafts);
  return NextResponse.json(record, { status: 201 });
}

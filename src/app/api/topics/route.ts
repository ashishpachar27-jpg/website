import { NextResponse } from "next/server";
import { searchTopics } from "@/lib/topics";
import type { BoardKey, SubjectKey } from "@/lib/boards";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const board = (searchParams.get("board") ?? "all") as BoardKey | "all";
  const subject = (searchParams.get("subject") ?? "all") as SubjectKey | "all";
  const results = searchTopics(query, board, subject);
  return NextResponse.json({ results });
}

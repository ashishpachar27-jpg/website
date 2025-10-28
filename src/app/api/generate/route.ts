import { NextResponse } from "next/server";
import { generateAssessmentAssets } from "@/lib/spec-generator";
import type { TestBuilderFormValues } from "@/types/test";
import { z } from "zod";

const payloadSchema = z.object({
  values: z.object({
    studentName: z.string().min(1, "Provide a student name"),
    board: z.string().min(1, "Choose a board"),
    subject: z.string().min(1, "Choose a subject"),
    level: z.string().min(1, "Select a level or grade"),
    topics: z.array(z.string()).min(1, "Add at least one topic"),
    questionCount: z.number().int().min(3).max(20),
    durationMinutes: z.number().int().min(30).max(240),
    difficultyMix: z.enum(["balanced", "stretch", "support"]),
    calculatorPolicy: z.string(),
    diagramsAllowed: z.boolean(),
    includeAnswerKey: z.boolean(),
    separateSolutionsPdf: z.boolean(),
    showSolutionsInTest: z.boolean(),
    blueprintNotes: z.string().optional(),
  }),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { values } = payloadSchema.parse(json);
    const response = await generateAssessmentAssets(values as TestBuilderFormValues);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Generation error", error);
    return NextResponse.json(
      {
        error:
          "We ran into a problem compiling the test. Try again or choose ‘Generate with simplified template’.",
      },
      { status: 500 },
    );
  }
}

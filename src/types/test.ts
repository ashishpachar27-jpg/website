import type { BoardKey, SubjectKey } from "@/lib/boards";

export interface TestBuilderFormValues {
  studentName: string;
  board: BoardKey | "";
  subject: SubjectKey | "";
  level: string;
  topics: string[];
  questionCount: number;
  durationMinutes: number;
  difficultyMix: "balanced" | "stretch" | "support";
  calculatorPolicy: string;
  diagramsAllowed: boolean;
  includeAnswerKey: boolean;
  separateSolutionsPdf: boolean;
  showSolutionsInTest: boolean;
  blueprintNotes?: string;
}

export type QuestionType =
  | "short_answer"
  | "structured"
  | "mcq"
  | "data_response"
  | "essay";

export interface QuestionSpec {
  id: string;
  type: QuestionType;
  prompt: string;
  marks: number;
  answer: string;
  solutionSteps: string[];
  skills: string[];
  diagramLatex?: string;
  notes?: string;
  parts?: QuestionSpec[];
}

export interface SectionSpec {
  title: string;
  instructions: string;
  marks: number;
  questions: QuestionSpec[];
}

export interface TestSpec {
  meta: {
    board: string;
    boardKey: BoardKey | "other";
    level: string;
    subject: string;
    subjectKey: SubjectKey | "other";
    topics: string[];
    studentName: string;
    durationMinutes: number;
    totalMarks: number;
    calculatorPolicy: string;
    diagramsAllowed: boolean;
    difficultyMix: string;
    includeAnswerKey: boolean;
    separateSolutionsPdf: boolean;
    showSolutionsInTest: boolean;
    generatedAt: string;
    blueprintNotes?: string;
  };
  sections: SectionSpec[];
  style: {
    boardStyle: string;
    units: string;
    watermark?: string;
  };
}

export interface DraftRecord {
  id: string;
  values: TestBuilderFormValues;
  updatedAt: string;
}

export interface GenerateResponse {
  spec: TestSpec;
  testPdfBase64: string;
  solutionsPdfBase64?: string;
  simplifiedTemplateUsed: boolean;
}

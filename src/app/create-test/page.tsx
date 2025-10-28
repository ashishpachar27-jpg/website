"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { boards, subjects, type BoardKey } from "@/lib/boards";
import { TopicSelector } from "@/components/topic-selector";
import { AutosaveIndicator } from "@/components/autosave-indicator";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader } from "@/components/card";
import { DraftRecord, GenerateResponse, TestBuilderFormValues } from "@/types/test";
import { v4 as uuidv4 } from "uuid";
import { AlertTriangle, Download, Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema: z.ZodType<TestBuilderFormValues> = z.object({
  studentName: z.string().min(1, "Enter a name to watermark the PDF"),
  board: z.enum([
    "ib_myp",
    "ib_dp",
    "cambridge_igcse",
    "cambridge_a_level",
    "uk_gcse",
    "college_board_ap",
    "cbse",
    "icse",
    "other",
  ] satisfies readonly [BoardKey, ...BoardKey[]]),
  subject: z.enum([
    "mathematics",
    "physics",
    "chemistry",
    "biology",
    "computer_science",
    "economics",
    "other",
  ]),
  level: z.string().min(1, "Choose a level or grade"),
  topics: z.array(z.string()).min(1, "Add at least one topic"),
  questionCount: z.number().min(3).max(20),
  durationMinutes: z.number().min(30).max(240),
  difficultyMix: z.enum(["balanced", "stretch", "support"]),
  calculatorPolicy: z.string(),
  diagramsAllowed: z.boolean(),
  includeAnswerKey: z.boolean(),
  separateSolutionsPdf: z.boolean(),
  showSolutionsInTest: z.boolean(),
  blueprintNotes: z.string().optional().nullable(),
});

const defaultValues: TestBuilderFormValues = {
  studentName: "",
  board: "ib_dp",
  subject: "physics",
  level: "dp_hl",
  topics: [],
  questionCount: 8,
  durationMinutes: 90,
  difficultyMix: "balanced",
  calculatorPolicy: "Scientific calculators allowed",
  diagramsAllowed: true,
  includeAnswerKey: true,
  separateSolutionsPdf: false,
  showSolutionsInTest: true,
  blueprintNotes: "",
};

type AutosaveStatus = "idle" | "saving" | "saved" | "error";

const LOCAL_STORAGE_KEY = "boardsmart-test-builder";
const LOCAL_STORAGE_ID_KEY = "boardsmart-test-builder-id";

export default function CreateTestPage() {
  const form = useForm<TestBuilderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });
  const watchAll = form.watch();
  const boardValue = form.watch("board");
  const [draftId, setDraftId] = useState<string>("");
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>("idle");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);
  const lastSavedData = useRef<string>("");

  useEffect(() => {
    const storedId = window.localStorage.getItem(LOCAL_STORAGE_ID_KEY) || uuidv4();
    setDraftId(storedId);
    window.localStorage.setItem(LOCAL_STORAGE_ID_KEY, storedId);

    const localDraft = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localDraft) {
      const parsed = JSON.parse(localDraft) as TestBuilderFormValues;
      form.reset({ ...defaultValues, ...parsed });
      lastSavedData.current = JSON.stringify(parsed);
    }

    const loadServerDraft = async () => {
      try {
        const response = await fetch(`/api/drafts?id=${storedId}`);
        if (response.ok) {
          const data = (await response.json()) as DraftRecord;
          form.reset({ ...defaultValues, ...data.values });
          lastSavedData.current = JSON.stringify(data.values);
        }
      } catch (error) {
        console.warn("Unable to load server draft", error);
      } finally {
        hasLoadedRef.current = true;
      }
    };

    void loadServerDraft();
  }, [form]);

  const saveDraft = useMemo(
    () =>
      async (values: TestBuilderFormValues) => {
        if (!draftId) return;
        setAutosaveStatus("saving");
        try {
          window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(values));
          lastSavedData.current = JSON.stringify(values);
          const response = await fetch("/api/drafts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: draftId, values }),
          });
          if (!response.ok) {
            throw new Error("Failed to save");
          }
          setAutosaveStatus("saved");
        } catch (error) {
          console.error("Autosave failed", error);
          setAutosaveStatus("error");
        }
      },
    [draftId],
  );

  useEffect(() => {
    if (!hasLoadedRef.current) return;
    const current = JSON.stringify(watchAll);
    if (current === lastSavedData.current) return;
    const timeout = setTimeout(() => {
      void saveDraft(form.getValues());
    }, 3000);
    return () => clearTimeout(timeout);
  }, [watchAll, form, saveDraft]);

  useEffect(() => {
    if (autosaveStatus === "saved" || autosaveStatus === "error") {
      const timeout = setTimeout(() => setAutosaveStatus("idle"), 4000);
      return () => clearTimeout(timeout);
    }
    return () => undefined;
  }, [autosaveStatus]);

  const handleBlurSave = async () => {
    await saveDraft(form.getValues());
  };

  const levelOptions = useMemo(() => {
    const board = boards.find((option) => option.value === boardValue);
    return board?.levels ?? [];
  }, [boardValue]);

  const calculatorOptions = useMemo(() => {
    const board = boards.find((option) => option.value === boardValue);
    return board?.calculatorPolicies ?? ["Follow board guidelines"];
  }, [boardValue]);

  const onSubmit = async (values: TestBuilderFormValues) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setResult(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Unable to generate test");
      }
      const data = (await response.json()) as GenerateResponse;
      setResult(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPdf = (base64: string, filename: string) => {
    const blob = new Blob([Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))], {
      type: "application/pdf",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const blueprintCopy = form.watch("blueprintNotes")?.trim();

  const boardField = form.register("board");

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Test builder</h1>
          <p className="text-sm text-slate-600">
            Configure a board-accurate assessment with authentic command terms, diagrams, answer keys, and optional solution
            PDFs.
          </p>
        </div>
        <AutosaveIndicator status={autosaveStatus} />
      </div>
      <form
        className="mt-8 grid gap-6 lg:grid-cols-[2fr,1fr]"
        onSubmit={form.handleSubmit(onSubmit)}
        onBlur={handleBlurSave}
      >
        <div className="space-y-6">
          <Card>
            <CardHeader title="Student and paper details" description="Used for watermarking and metadata." />
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="studentName">Student name</label>
                <input id="studentName" {...form.register("studentName")} placeholder="Aanya Kapoor" />
                {form.formState.errors.studentName ? (
                  <p className="text-sm text-red-600">{form.formState.errors.studentName.message}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="board">Board</label>
                <select
                  id="board"
                  {...boardField}
                  onChange={(event) => {
                    boardField.onChange(event);
                    const selectedBoard = boards.find((item) => item.value === event.target.value);
                    form.setValue("calculatorPolicy", selectedBoard?.calculatorPolicies[0] ?? "Follow board guidelines");
                    form.setValue("level", selectedBoard?.levels[0]?.value ?? "");
                  }}
                >
                  {boards.map((board) => (
                    <option key={board.value} value={board.value}>
                      {board.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="subject">Subject</label>
                <select id="subject" {...form.register("subject")}>
                  {subjects.map((subject) => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="level">Level / Grade</label>
                <select id="level" {...form.register("level")}>
                  {levelOptions.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <TopicSelector
                  board={form.watch("board")}
                  subject={form.watch("subject")}
                  value={form.watch("topics")}
                  onChange={(topics) => form.setValue("topics", topics, { shouldValidate: true })}
                />
                {form.formState.errors.topics ? (
                  <p className="text-sm text-red-600">{form.formState.errors.topics.message as string}</p>
                ) : null}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              title="Test configuration"
              description="Choose how many questions, timing, difficulty balance, and calculator rules apply."
            />
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="questionCount">Question count</label>
                <input
                  id="questionCount"
                  type="number"
                  min={3}
                  max={20}
                  {...form.register("questionCount", { valueAsNumber: true })}
                />
              </div>
              <div>
                <label htmlFor="durationMinutes">Duration (minutes)</label>
                <input
                  id="durationMinutes"
                  type="number"
                  min={30}
                  max={240}
                  step={5}
                  {...form.register("durationMinutes", { valueAsNumber: true })}
                />
              </div>
              <div>
                <label htmlFor="difficultyMix">Difficulty mix</label>
                <select id="difficultyMix" {...form.register("difficultyMix")}>
                  <option value="balanced">Balanced</option>
                  <option value="stretch">Stretch (challenge heavy)</option>
                  <option value="support">Support (scaffolded)</option>
                </select>
              </div>
              <div>
                <label htmlFor="calculatorPolicy">Calculator policy</label>
                <select id="calculatorPolicy" {...form.register("calculatorPolicy")}>
                  {calculatorOptions.map((policy) => (
                    <option key={policy} value={policy}>
                      {policy}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input id="diagramsAllowed" type="checkbox" {...form.register("diagramsAllowed")} />
                <label htmlFor="diagramsAllowed" className="text-sm font-medium text-slate-700">
                  Diagrams allowed (TikZ/PGFplots)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input id="includeAnswerKey" type="checkbox" {...form.register("includeAnswerKey")} />
                <label htmlFor="includeAnswerKey" className="text-sm font-medium text-slate-700">
                  Include answer key
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input id="separateSolutionsPdf" type="checkbox" {...form.register("separateSolutionsPdf")} />
                <label htmlFor="separateSolutionsPdf" className="text-sm font-medium text-slate-700">
                  Generate separate solutions PDF
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input id="showSolutionsInTest" type="checkbox" {...form.register("showSolutionsInTest")} />
                <label htmlFor="showSolutionsInTest" className="text-sm font-medium text-slate-700">
                  Append solutions to test PDF
                </label>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="blueprintNotes">Blueprint notes (optional)</label>
                <textarea
                  id="blueprintNotes"
                  rows={4}
                  placeholder="e.g. 40% AO2 application, 30% graphs, 30% multi-step reasoning"
                  {...form.register("blueprintNotes")}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Review" description="Confirm test summary before generating." />
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>
                <strong>Board:</strong> {boards.find((board) => board.value === form.watch("board"))?.label}
              </p>
              <p>
                <strong>Subject:</strong> {subjects.find((subject) => subject.value === form.watch("subject"))?.label}
              </p>
              <p>
                <strong>Level:</strong> {levelOptions.find((level) => level.value === form.watch("level"))?.label}
              </p>
              <p>
                <strong>Topics:</strong> {form.watch("topics").join(", ") || "—"}
              </p>
              <p>
                <strong>Duration:</strong> {form.watch("durationMinutes")} minutes
              </p>
              <p>
                <strong>Difficulty:</strong> {form.watch("difficultyMix")}
              </p>
              {blueprintCopy ? (
                <p>
                  <strong>Blueprint:</strong> {blueprintCopy}
                </p>
              ) : null}
              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={16} /> Generating…
                  </span>
                ) : (
                  "Generate PDF"
                )}
              </Button>
              {errorMessage ? (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertTriangle size={16} />
                  <span>{errorMessage}</span>
                </div>
              ) : null}
            </CardContent>
          </Card>
          {result ? (
            <Card>
              <CardHeader title="Downloads ready" description="Share the test or assign to a student." />
              <CardContent className="space-y-4 text-sm text-slate-600">
                <p>
                  PDF compiled {result.simplifiedTemplateUsed ? "with simplified template" : "from LaTeX"}. Includes required
                  footer and contact page.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => downloadPdf(result.testPdfBase64, `${form.watch("studentName") || "test"}-assessment.pdf`)}
                >
                  <Download size={16} className="mr-2" /> Download test PDF
                </Button>
                {result.solutionsPdfBase64 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full border border-slate-200"
                    onClick={() => downloadPdf(result.solutionsPdfBase64!, `${form.watch("studentName") || "test"}-solutions.pdf`)}
                  >
                    <Download size={16} className="mr-2" /> Download solutions PDF
                  </Button>
                ) : null}
                <Link href="/workspace" className="text-brandBlue-700 underline">
                  Assign to student workspace
                </Link>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </form>
    </div>
  );
}

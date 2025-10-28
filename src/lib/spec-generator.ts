import { v4 as uuidv4 } from "uuid";
import type { TestBuilderFormValues, TestSpec, QuestionSpec, GenerateResponse } from "@/types/test";
import { boards, subjects } from "@/lib/boards";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const BOARD_COMMAND_TERMS: Record<string, string[]> = {
  ib_dp: ["Define", "Deduce", "Determine", "Explain", "Evaluate"],
  ib_myp: ["State", "Describe", "Analyse", "Discuss"],
  cambridge_igcse: ["State", "Calculate", "Explain", "Show that"],
  cambridge_a_level: ["Derive", "Comment", "Evaluate", "Discuss"],
  uk_gcse: ["State", "Work out", "Explain", "Prove"],
  college_board_ap: ["Calculate", "Explain", "Determine", "Justify"],
  cbse: ["Define", "List", "Explain", "Justify"],
  icse: ["State", "Explain", "Calculate", "Illustrate"],
  other: ["Explain", "Determine", "Show"]
};

const SUBJECT_CONTEXT: Record<string, { scenario: string; diagram?: string }> = {
  mathematics: {
    scenario:
      "A class is preparing for an Olympiad and needs practice with %TOPIC%. Formulate a problem that requires applying the topic in a multi-step context.",
    diagram: `\\begin{tikzpicture}[scale=0.8]
      \\draw[->] (-0.5,0) -- (4.5,0) node[right]{x};
      \\draw[->] (0,-0.5) -- (0,3.5) node[above]{y};
      \\draw[scale=0.8,domain=0:3.5,smooth,variable=\\x,blue]{sin(\\x r)};
      \\end{tikzpicture}`,
  },
  physics: {
    scenario:
      "A lab investigation explores %TOPIC% using standard IB data tables. Include quantitative reasoning and clear units.",
    diagram: `\\begin{tikzpicture}[scale=0.9]
      \\draw[->] (0,0) -- (0,3) node[above]{F/\\si{N}};
      \\draw[->] (0,0) -- (4,0) node[right]{x/\\si{m}};
      \\draw[thick,blue] (0,0) -- (3,2.4);
      \\end{tikzpicture}`,
  },
  chemistry: {
    scenario:
      "Students evaluate %TOPIC% with balanced equations and molar relationships. Include at least one numerical component.",
  },
  biology: {
    scenario:
      "A field study analyses %TOPIC% referencing current syllabus language and drawing on experimental design.",
  },
  computer_science: {
    scenario:
      "Learners prototype an algorithm around %TOPIC% and must analyse complexity and edge cases.",
    diagram: `\\begin{tikzpicture}[node distance=1.5cm]
      \\node (start) [draw, rounded corners, text width=2.5cm, align=center]{Start};
      \\node (decision) [below=of start, draw, diamond, aspect=2, text width=2.5cm, align=center]{Condition?};
      \\node (process) [below left=of decision, draw, rectangle, text width=2.5cm, align=center]{Process A};
      \\node (process2) [below right=of decision, draw, rectangle, text width=2.5cm, align=center]{Process B};
      \\node (end) [below=of decision, draw, rounded corners, text width=2.5cm, align=center]{End};
      \\draw[->] (start) -- (decision);
      \\draw[->] (decision) -- node[left]{Yes} (process);
      \\draw[->] (decision) -- node[right]{No} (process2);
      \\draw[->] (process) |- (end);
      \\draw[->] (process2) |- (end);
      \\end{tikzpicture}`,
  },
  economics: {
    scenario:
      "Analyse %TOPIC% using board-specific terminology, referencing recent policy debates and diagrammatic reasoning where relevant.",
  },
  other: {
    scenario:
      "Design a question around %TOPIC% ensuring clarity of assumptions and measurable outcomes.",
  },
};

const BOARD_STYLE_MAP: Record<string, string> = {
  ib_dp: "IB_DP",
  ib_myp: "IB_MYP",
  cambridge_igcse: "CAMBRIDGE_IGCSE",
  cambridge_a_level: "CAMBRIDGE_ALEVEL",
  uk_gcse: "UK_GCSE",
  college_board_ap: "AP",
  cbse: "CBSE",
  icse: "ICSE",
  other: "GENERIC",
};

function chooseCommandTerm(board: string) {
  const terms = BOARD_COMMAND_TERMS[board] ?? BOARD_COMMAND_TERMS.other;
  return terms[Math.floor(Math.random() * terms.length)];
}

function createQuestion(
  subject: string,
  topic: string,
  board: string,
  marks: number,
  type: QuestionSpec["type"],
  partLabel?: string,
): QuestionSpec {
  const commandTerm = chooseCommandTerm(board);
  const context = SUBJECT_CONTEXT[subject] ?? SUBJECT_CONTEXT.other;
  const prompt = `${commandTerm} ${topic.toLowerCase()}.

${context.scenario.replace("%TOPIC%", topic)}${partLabel ? ` (${partLabel})` : ""}`;

  const solutionSteps = [
    `${commandTerm} the known relationships for ${topic}.`,
    "Substitute given values and simplify using board-approved notation.",
    "Present the final answer with appropriate units or justification.",
  ];

  const question: QuestionSpec = {
    id: uuidv4(),
    type,
    prompt,
    marks,
    answer: `Model answer for ${topic} using ${commandTerm.toLowerCase()} style reasoning.`,
    solutionSteps,
    skills: ["knowledge", "application", "analysis"].slice(0, Math.min(3, Math.ceil(marks / 3))),
  };

  if (context.diagram) {
    question.diagramLatex = context.diagram;
  }

  if (type === "structured" && !partLabel) {
    question.parts = [
      createQuestion(subject, `${topic} fundamentals`, board, Math.max(2, Math.floor(marks / 3)), "short_answer", "a"),
      createQuestion(subject, `${topic} application`, board, Math.max(2, Math.floor(marks / 3)), "structured", "b"),
      createQuestion(subject, `${topic} evaluation`, board, Math.max(2, Math.floor(marks / 3)), "short_answer", "c"),
    ];
    question.solutionSteps = [
      "Mark subparts independently following the published markscheme order.",
    ];
  }

  if (board === "cbse") {
    question.notes = "Tag as VSA/SA/LA according to CBSE blueprint.";
  } else if (board === "college_board_ap") {
    question.notes = "Align scoring rubric with AP point values.";
  }

  return question;
}

function chunkQuestions(values: TestBuilderFormValues): QuestionSpec[] {
  const topicPool = values.topics.length > 0 ? values.topics : ["Core concepts"];
  const questionCount = Math.max(3, values.questionCount || 6);
  const baseMarks = values.board === "ib_dp" ? 6 : 4;
  const questions: QuestionSpec[] = [];

  for (let i = 0; i < questionCount; i += 1) {
    const topic = topicPool[i % topicPool.length];
    const type = i % 3 === 0 ? "structured" : i % 3 === 1 ? "short_answer" : "data_response";
    const marks = type === "structured" ? baseMarks + 4 : baseMarks;
    questions.push(createQuestion(values.subject || "other", topic, values.board || "other", marks, type));
  }

  return questions;
}

function buildSections(values: TestBuilderFormValues): TestSpec["sections"] {
  const questions = chunkQuestions(values);
  const half = Math.ceil(questions.length / 2);
  const sectionA = questions.slice(0, half);
  const sectionB = questions.slice(half);

  return [
    {
      title: "Section A",
      instructions: values.board === "ib_dp" ? "Answer all questions. Working must follow IB command terms." : "Answer all questions.",
      marks: sectionA.reduce((sum, question) => sum + question.marks, 0),
      questions: sectionA,
    },
    {
      title: "Section B",
      instructions:
        values.board === "college_board_ap"
          ? "Free-response style tasks. Show every justification."
          : "Choose any TWO questions to attempt unless otherwise stated.",
      marks: sectionB.reduce((sum, question) => sum + question.marks, 0),
      questions: sectionB,
    },
  ];
}

function computeTotalMarks(sections: TestSpec["sections"]) {
  return sections.reduce((total, section) => total + section.marks, 0);
}

export function generateTestSpec(values: TestBuilderFormValues): TestSpec {
  const sections = buildSections(values);
  const totalMarks = computeTotalMarks(sections);
  const boardLabel = boards.find((board) => board.value === values.board)?.label ?? "Custom Board";
  const subjectLabel = subjects.find((subject) => subject.value === values.subject)?.label ?? "Subject";

  return {
    meta: {
      board: boardLabel,
      boardKey: (values.board || "other") as TestSpec["meta"]["boardKey"],
      level: values.level || "",
      subject: subjectLabel,
      subjectKey: (values.subject || "other") as TestSpec["meta"]["subjectKey"],
      topics: values.topics,
      studentName: values.studentName,
      durationMinutes: values.durationMinutes,
      totalMarks,
      calculatorPolicy: values.calculatorPolicy,
      diagramsAllowed: values.diagramsAllowed,
      difficultyMix: values.difficultyMix,
      includeAnswerKey: values.includeAnswerKey,
      separateSolutionsPdf: values.separateSolutionsPdf,
      showSolutionsInTest: values.showSolutionsInTest,
      generatedAt: new Date().toISOString(),
      blueprintNotes: values.blueprintNotes,
    },
    sections,
    style: {
      boardStyle: BOARD_STYLE_MAP[values.board || "other"],
      units: values.board === "uk_gcse" ? "SI" : "SI",
      watermark: values.studentName ? `Prepared for ${values.studentName}` : undefined,
    },
  };
}

function latexEscape(value: string): string {
  return value
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/&/g, "\\&")
    .replace(/_/g, "\\_")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\n/g, " \\ ");
}

function renderQuestion(question: QuestionSpec, boardKey: string) {
  const marksLabel = boardKey === "ib_dp" ? `[${question.marks}]` : `(${question.marks} marks)`;
  const partsLatex = question.parts
    ? `\\begin{enumerate}[label=\\alph*)]
${question.parts
  .map((part) => `  \\item ${latexEscape(part.prompt)} ${boardKey === "ib_dp" ? `[${part.marks}]` : `(${part.marks} marks)`}`)
  .join("\n")}
\\end{enumerate}`
    : "";
  const diagramLatex = question.diagramLatex
    ? `\\begin{center}
${question.diagramLatex}
\\end{center}`
    : "";

  return `\\textbf{${latexEscape(question.notes ? `${question.prompt} (Note: ${question.notes})` : question.prompt)}} ${marksLabel}\\\
${partsLatex ? `${partsLatex}\\\
` : ""}
${diagramLatex}
\\vspace{12pt}`;
}

function renderSolutions(question: QuestionSpec, boardKey: string) {
  const marksLabel = boardKey === "ib_dp" ? `[${question.marks}]` : `(${question.marks} marks)`;
  const steps = question.solutionSteps.map((step) => `\\item ${latexEscape(step)}`).join("\n");
  const parts = question.parts
    ? question.parts
        .map((part) => `\\textbf{Part ${part.parts ? "" : ""}${part.id.slice(0, 4)}} ${boardKey === "ib_dp" ? `[${part.marks}]` : `(${part.marks} marks)`}\\\
\\begin{itemize}
${part.solutionSteps.map((step) => `  \\item ${latexEscape(step)}`).join("\n")}
\\end{itemize}`)
        .join("\n")
    : "";
  return `\\textbf{Solution ${marksLabel}}\\\
\\begin{itemize}
${steps}
\\end{itemize}
${parts}`;
}

function buildLatex(spec: TestSpec, includeSolutions: boolean) {
  const macros = `\\newcommand{\\TestBoard}{${latexEscape(spec.meta.board)}}
\\newcommand{\\TestSubject}{${latexEscape(spec.meta.subject)}}
\\newcommand{\\TestLevel}{${latexEscape(spec.meta.level || "")}}
\\newcommand{\\TestTopic}{${latexEscape(spec.meta.topics.join(", ") || "General revision")}}
\\newcommand{\\TestDuration}{${spec.meta.durationMinutes || 0}}
\\newcommand{\\TestMarks}{${spec.meta.totalMarks}}
\\newcommand{\\StudentName}{${latexEscape(spec.meta.studentName || "________________")}}
\\newcommand{\\CalculatorPolicy}{${latexEscape(spec.meta.calculatorPolicy || "Follow board guidelines")}}`;

  const watermark = spec.style.watermark
    ? `\\usepackage{draftwatermark}
\\SetWatermarkText{${latexEscape(spec.style.watermark)}}
\\SetWatermarkScale{0.25}`
    : "";

  const generatedStamp = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(spec.meta.generatedAt));

  const sectionsLatex = spec.sections
    .map(
      (section, sectionIndex) => `\\pdfbookmark[2]{${latexEscape(section.title)}}{section${sectionIndex}}
\\section*{${latexEscape(section.title)}}
\\textit{${latexEscape(section.instructions)}}\\\\
${section.questions
  .map((question, index) => `\\textbf{Q${sectionIndex + 1}.${index + 1}} ${renderQuestion(question, spec.meta.boardKey)}`)
  .join("\n\n")}`,
    )
    .join("\n\n\\newpage\n\n");

  const solutionsLatex = includeSolutions
    ? `\\pdfbookmark[1]{Solutions}{solutions}
\\section*{Solutions}
${spec.sections
  .map((section, sIndex) => `\\subsection*{${latexEscape(section.title)}}
${section.questions
    .map((question, qIndex) => `\\textbf{Q${sIndex + 1}.${qIndex + 1}} ${renderSolutions(question, spec.meta.boardKey)}`)
    .join("\\\n\\vspace{8pt}\\\n")}`)
  .join("\\newpage")}`
    : "";

  const blueprint = spec.meta.blueprintNotes
    ? `\\subsection*{Blueprint notes}
${latexEscape(spec.meta.blueprintNotes)}`
    : "";

  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath, amssymb}
\\usepackage{siunitx}
\\usepackage{graphicx}
\\usepackage{tikz, pgfplots}
\\usetikzlibrary{positioning, arrows.meta, shapes.geometric}
\\pgfplotsset{compat=1.18}
\\usepackage[colorlinks=true,linkcolor=blue]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{enumitem}
${watermark}
\\pagestyle{fancy}
\\fancyfoot[C]{\\small By Ashish | YouTube: PhyFix | WhatsApp: +91 8684901516 | Website: https://freedemoclasses.netlify.app/}
\\hypersetup{
  pdfauthor={Ashish},
  pdftitle={${latexEscape(`${spec.meta.board} ${spec.meta.subject} ${spec.meta.level} Assessment`)}},
  pdfsubject={${latexEscape(`${spec.style.boardStyle ?? "Assessment"}`)}},
  pdfkeywords={${latexEscape(spec.meta.subject)};${latexEscape(spec.meta.board)};Assessment}
}

function buildSolutionsOnlyLatex(spec: TestSpec) {
  const generatedStamp = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(spec.meta.generatedAt));

  const header = `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath, amssymb}
\\usepackage{siunitx}
\\usepackage{hyperref}
\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyfoot[C]{\\small By Ashish | YouTube: PhyFix | WhatsApp: +91 8684901516 | Website: https://freedemoclasses.netlify.app/}
\\hypersetup{
  pdfauthor={Ashish},
  pdftitle={${latexEscape(`${spec.meta.board} ${spec.meta.subject} Solutions`)}},
  pdfsubject={Solutions},
  pdfkeywords={${latexEscape(spec.meta.subject)};Solutions}
}
\\begin{document}
\\pdfbookmark[1]{Solutions}{solutions}
\\section*{Solutions for ${latexEscape(spec.meta.board)} — ${latexEscape(spec.meta.subject)}}
Generated: ${latexEscape(generatedStamp)}\\\\
Student: ${latexEscape(spec.meta.studentName || "—")}
`;

  const body = spec.sections
    .map(
      (section, sIndex) => `\\subsection*{${latexEscape(section.title)}}
${section.questions
  .map((question, qIndex) => `\\textbf{Q${sIndex + 1}.${qIndex + 1}} ${renderSolutions(question, spec.meta.boardKey)}`)
  .join("\\\n\\vspace{8pt}\\\n")}`,
    )
    .join("\\newpage");

  const footer = `\\newpage
\\pdfbookmark[1]{Contact \\& Credits}{contact}
\\section*{Contact \\& Credits}
By Ashish, PhyFix. WhatsApp: +91 8684901516. Website: \\url{https://freedemoclasses.netlify.app/}.\\\\
All questions are generated for educational use. Do not redistribute without permission.
\\end{document}`;

  return `${header}
${body}
${footer}`;
}
${macros}
\\begin{document}
\\pdfbookmark[1]{Cover}{cover}
\\begin{center}
{\\Large \\TestBoard\\ - \\TestSubject\\ (\\TestLevel)}\\\\[6pt]
{\\large Topics: \\TestTopic}\\\\[12pt]
Duration: \\TestDuration~minutes \\quad Total Marks: \\TestMarks\\\\[6pt]
Student: \\StudentName\\\\[6pt]
Generated: ${latexEscape(generatedStamp)}
\\end{center}
\\section*{Instructions}
\\begin{itemize}
\\item Answer all questions unless stated otherwise.
\\item Show all working. Use ${latexEscape(spec.style.units)} units.
\\item Calculators: \\CalculatorPolicy.
\\item Difficulty mix: ${latexEscape(spec.meta.difficultyMix)}.
\\end{itemize}
${blueprint}
\\pdfbookmark[1]{Questions}{questions}
${sectionsLatex}
${includeSolutions ? "\\newpage" : ""}
${solutionsLatex}
\\newpage
\\pdfbookmark[1]{Contact \\& Credits}{contact}
\\section*{Contact \\& Credits}
By Ashish, PhyFix. WhatsApp: +91 8684901516. Website: \\url{https://freedemoclasses.netlify.app/}.\\\\
All questions are generated for educational use. Do not redistribute without permission.
\\end{document}`;
}

async function compileLatex(latex: string) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "boardsmart-"));
  const texFile = path.join(tmpDir, "assessment.tex");
  await fs.writeFile(texFile, latex, "utf-8");
  try {
    await new Promise<void>((resolve, reject) => {
      execFile(
        "latexmk",
        ["-pdfxe", "-interaction=nonstopmode", "-halt-on-error", "assessment.tex"],
        { cwd: tmpDir, timeout: 20000 },
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        },
      );
    });
    const pdfBuffer = await fs.readFile(path.join(tmpDir, "assessment.pdf"));
    return { buffer: pdfBuffer, simplified: false };
  } catch (error) {
    return { error: error as Error };
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

async function buildFallbackPdf(spec: TestSpec, includeSolutions: boolean) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const footer = "By Ashish | YouTube: PhyFix | WhatsApp: +91 8684901516 | Website: https://freedemoclasses.netlify.app/";

  const addPageWithText = (title: string, lines: string[]) => {
    const page = pdf.addPage();
    const { width, height } = page.getSize();
    let y = height - 72;
    page.drawText(title, { x: 72, y, size: 18, font, color: rgb(0.11, 0.15, 0.35) });
    y -= 30;
    lines.forEach((line) => {
      const segments = line.match(/.{1,90}/g) ?? [line];
      segments.forEach((segment) => {
        page.drawText(segment, { x: 72, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
        y -= 16;
      });
      y -= 6;
    });
    page.drawText(footer, { x: 72, y: 32, size: 9, font, color: rgb(0.2, 0.2, 0.2) });
  };

  addPageWithText(`${spec.meta.board} - ${spec.meta.subject}`, [
    `Level: ${spec.meta.level}`,
    `Topics: ${spec.meta.topics.join(", ") || "General revision"}`,
    `Duration: ${spec.meta.durationMinutes} minutes`,
    `Total Marks: ${spec.meta.totalMarks}`,
    `Calculator Policy: ${spec.meta.calculatorPolicy}`,
    `Difficulty mix: ${spec.meta.difficultyMix}`,
  ]);

  spec.sections.forEach((section) => {
    const lines = [section.instructions];
    section.questions.forEach((question, index) => {
      lines.push(`Q${index + 1} (${question.marks} marks): ${question.prompt}`);
    });
    addPageWithText(section.title, lines);
  });

  if (includeSolutions) {
    spec.sections.forEach((section) => {
      const lines: string[] = [];
      section.questions.forEach((question, index) => {
        lines.push(`Q${index + 1} Solution: ${question.solutionSteps.join(" → ")}`);
      });
      addPageWithText(`${section.title} Solutions`, lines);
    });
  }

  addPageWithText("Contact & Credits", [
    "By Ashish, PhyFix.",
    "WhatsApp: +91 8684901516.",
    "Website: https://freedemoclasses.netlify.app/.",
    "All questions are generated for educational use. Do not redistribute without permission.",
  ]);

  const buffer = await pdf.save();
  return Buffer.from(buffer);
}

export async function generateAssessmentAssets(values: TestBuilderFormValues): Promise<GenerateResponse> {
  const spec = generateTestSpec(values);
  const includeSolutions = spec.meta.includeAnswerKey && spec.meta.showSolutionsInTest;
  const latex = buildLatex(spec, includeSolutions);
  const compileResult = await compileLatex(latex);

  let testBuffer: Buffer;
  let simplified = false;

  if ("buffer" in compileResult && compileResult.buffer) {
    testBuffer = compileResult.buffer;
  } else {
    testBuffer = await buildFallbackPdf(spec, includeSolutions);
    simplified = true;
  }

  let solutionsPdfBase64: string | undefined;

  if (spec.meta.includeAnswerKey && spec.meta.separateSolutionsPdf) {
    const solutionsLatex = buildSolutionsOnlyLatex(spec);
    const solutionsResult = await compileLatex(solutionsLatex);
    if ("buffer" in solutionsResult && solutionsResult.buffer) {
      solutionsPdfBase64 = solutionsResult.buffer.toString("base64");
    } else {
      const fallback = await buildFallbackPdf(spec, true);
      solutionsPdfBase64 = fallback.toString("base64");
      simplified = true;
    }
  }

  return {
    spec,
    testPdfBase64: testBuffer.toString("base64"),
    solutionsPdfBase64,
    simplifiedTemplateUsed: simplified,
  };
}

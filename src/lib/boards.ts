export type BoardKey =
  | "ib_myp"
  | "ib_dp"
  | "cambridge_igcse"
  | "cambridge_a_level"
  | "uk_gcse"
  | "college_board_ap"
  | "cbse"
  | "icse"
  | "other";

export type SubjectKey =
  | "mathematics"
  | "physics"
  | "chemistry"
  | "biology"
  | "computer_science"
  | "economics"
  | "other";

export interface LevelOption {
  value: string;
  label: string;
  board: BoardKey;
  description: string;
}

export interface BoardOption {
  value: BoardKey;
  label: string;
  description: string;
  levels: LevelOption[];
  calculatorPolicies: string[];
}

export const boards: BoardOption[] = [
  {
    value: "ib_myp",
    label: "IB Middle Years Programme",
    description:
      "Command terms: describe, explain, justify. Structured responses with criterion-related marks.",
    calculatorPolicies: ["Not allowed", "Allowed", "Graphic calculator required"],
    levels: Array.from({ length: 5 }).map((_, idx) => ({
      value: `myp_${idx + 1}`,
      label: `MYP Year ${idx + 1}`,
      board: "ib_myp",
      description: "Progressively scaffolded inquiry tasks.",
    })),
  },
  {
    value: "ib_dp",
    label: "IB Diploma Programme",
    description:
      "Use IB command terms (Define, Deduce, Determine). Markscheme uses square brackets.",
    calculatorPolicies: ["Not allowed", "Scientific calculators allowed", "Graphic calculators required"],
    levels: [
      {
        value: "dp_sl",
        label: "DP Standard Level",
        board: "ib_dp",
        description: "Paper 1 short-response, Paper 2 structured, Paper 3 option questions.",
      },
      {
        value: "dp_hl",
        label: "DP Higher Level",
        board: "ib_dp",
        description: "Extended Paper 3 focus and deeper analysis requirements.",
      },
    ],
  },
  {
    value: "cambridge_igcse",
    label: "Cambridge IGCSE",
    description:
      "Papers split across core and extended tiers with clear part (a),(b),(c) progressions.",
    calculatorPolicies: ["Not allowed", "Allowed", "Calculator paper"],
    levels: [
      {
        value: "igcse_core",
        label: "IGCSE Core",
        board: "cambridge_igcse",
        description: "Accessible questions targeting grades C–G.",
      },
      {
        value: "igcse_extended",
        label: "IGCSE Extended",
        board: "cambridge_igcse",
        description: "Higher-demand items preparing for A Level.",
      },
    ],
  },
  {
    value: "cambridge_a_level",
    label: "Cambridge International A Level",
    description:
      "Structured sections with data-response and essay components.",
    calculatorPolicies: ["Allowed", "Graphic calculator recommended"],
    levels: [
      {
        value: "a_level_as",
        label: "AS Level",
        board: "cambridge_a_level",
        description: "Typically first year of A Level studies.",
      },
      {
        value: "a_level_full",
        label: "Full A Level",
        board: "cambridge_a_level",
        description: "Full two-year syllabus with synoptic questions.",
      },
    ],
  },
  {
    value: "uk_gcse",
    label: "UK GCSE",
    description:
      "Foundation and Higher tiers with AO1/AO2/AO3 balance and calculator policies.",
    calculatorPolicies: ["Non-calculator", "Calculator allowed"],
    levels: [
      {
        value: "gcse_foundation",
        label: "GCSE Foundation",
        board: "uk_gcse",
        description: "Accessible breadth coverage.",
      },
      {
        value: "gcse_higher",
        label: "GCSE Higher",
        board: "uk_gcse",
        description: "Extended reasoning and proof.",
      },
    ],
  },
  {
    value: "college_board_ap",
    label: "College Board AP",
    description:
      "Mix of MCQ and FRQ with rubrics in points. Distinguish between calculator sections.",
    calculatorPolicies: ["Section I calculator", "Section II calculator", "No calculator"],
    levels: [
      {
        value: "ap",
        label: "Advanced Placement",
        board: "college_board_ap",
        description: "Course-specific frameworks and FRQ rubrics.",
      },
    ],
  },
  {
    value: "cbse",
    label: "CBSE",
    description:
      "Sections A/B/C with Very Short, Short, and Long Answer typology.",
    calculatorPolicies: ["Not allowed"],
    levels: Array.from({ length: 7 }).map((_, idx) => ({
      value: `cbse_grade_${idx + 6}`,
      label: `CBSE Grade ${idx + 6}`,
      board: "cbse",
      description: "NCERT-aligned blueprinting with competency focus.",
    })),
  },
  {
    value: "icse",
    label: "ICSE",
    description:
      "Sectioned papers with structured and application-oriented questions.",
    calculatorPolicies: ["Not allowed"],
    levels: Array.from({ length: 7 }).map((_, idx) => ({
      value: `icse_grade_${idx + 6}`,
      label: `ICSE Grade ${idx + 6}`,
      board: "icse",
      description: "Emphasis on conceptual clarity and diagrams.",
    })),
  },
  {
    value: "other",
    label: "Other",
    description:
      "Custom configuration for regional or school-level curricula.",
    calculatorPolicies: ["Custom"],
    levels: [
      {
        value: "custom_level",
        label: "Custom",
        board: "other",
        description: "Define your grading scale and blueprint manually.",
      },
    ],
  },
];

export const subjects: { value: SubjectKey; label: string }[] = [
  { value: "mathematics", label: "Mathematics" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
  { value: "computer_science", label: "Computer Science" },
  { value: "economics", label: "Economics" },
  { value: "other", label: "Other" },
];

export const calculatorPolicyFallback = "Follow board guidelines";

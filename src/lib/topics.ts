import type { BoardKey, SubjectKey } from "./boards";

export interface TopicEntry {
  board: BoardKey | "all";
  subject: SubjectKey | "all";
  value: string;
  aliases?: string[];
}

export const topicEntries: TopicEntry[] = [
  { board: "ib_dp", subject: "physics", value: "Kinematics", aliases: ["motion", "displacement"] },
  { board: "ib_dp", subject: "physics", value: "Energy and Power", aliases: ["work", "power"] },
  { board: "ib_dp", subject: "mathematics", value: "Calculus - Differentiation", aliases: ["derivatives"] },
  { board: "ib_dp", subject: "mathematics", value: "Calculus - Integration", aliases: ["anti-derivatives", "definite integrals"] },
  { board: "cambridge_igcse", subject: "physics", value: "Waves", aliases: ["wave properties", "frequency"] },
  { board: "cambridge_igcse", subject: "mathematics", value: "Simultaneous Equations" },
  { board: "uk_gcse", subject: "mathematics", value: "Number - Ratio and Proportion" },
  { board: "college_board_ap", subject: "physics", value: "Electric Circuits", aliases: ["dc circuits"] },
  { board: "cbse", subject: "physics", value: "Current Electricity" },
  { board: "cbse", subject: "mathematics", value: "Trigonometric Functions" },
  { board: "icse", subject: "mathematics", value: "Mensuration" },
  { board: "icse", subject: "physics", value: "Heat and Thermodynamics" },
  { board: "ib_myp", subject: "mathematics", value: "Patterns and Algebra" },
  { board: "ib_myp", subject: "physics", value: "Forces and Equilibrium" },
  { board: "cambridge_a_level", subject: "economics", value: "Market Structures", aliases: ["oligopoly", "perfect competition"] },
  { board: "college_board_ap", subject: "economics", value: "Monetary Policy" },
  { board: "cambridge_a_level", subject: "physics", value: "Quantum Physics" },
  { board: "cambridge_a_level", subject: "mathematics", value: "Complex Numbers" },
  { board: "ib_dp", subject: "chemistry", value: "Stoichiometric Relationships" },
  { board: "ib_dp", subject: "biology", value: "Cell Biology" },
  { board: "cbse", subject: "computer_science", value: "Python Programming" },
  { board: "uk_gcse", subject: "computer_science", value: "Algorithms" },
  { board: "college_board_ap", subject: "computer_science", value: "Data Structures" },
  { board: "ib_dp", subject: "economics", value: "International Trade" },
  { board: "ib_myp", subject: "biology", value: "Human Systems" },
  { board: "icse", subject: "chemistry", value: "Organic Chemistry - Hydrocarbons" },
  { board: "cbse", subject: "chemistry", value: "Thermodynamics" },
  { board: "uk_gcse", subject: "biology", value: "Genetics and Inheritance" },
  { board: "cambridge_igcse", subject: "chemistry", value: "Periodic Table" },
  { board: "college_board_ap", subject: "biology", value: "Cell Communication" },
  { board: "cbse", subject: "biology", value: "Photosynthesis" },
  { board: "cambridge_a_level", subject: "computer_science", value: "Recursion" },
  { board: "uk_gcse", subject: "physics", value: "Forces and Motion" },
  { board: "college_board_ap", subject: "mathematics", value: "Series Tests" },
  { board: "ib_dp", subject: "physics", value: "Fields and Electromagnetism" },
  { board: "cambridge_igcse", subject: "biology", value: "Human Nutrition" },
  { board: "cambridge_a_level", subject: "biology", value: "Photosynthesis" },
  { board: "ib_dp", subject: "computer_science", value: "Logic Gates" },
  { board: "ib_dp", subject: "economics", value: "Fiscal Policy" },
  { board: "ib_dp", subject: "physics", value: "Circular Motion", aliases: ["centripetal"] },
  { board: "cambridge_a_level", subject: "physics", value: "Nuclear Physics" },
  { board: "college_board_ap", subject: "physics", value: "Simple Harmonic Motion" },
  { board: "uk_gcse", subject: "chemistry", value: "Bonding" },
  { board: "cbse", subject: "economics", value: "Indian Economy" },
  { board: "other", subject: "other", value: "Custom topic" },
];

export function searchTopics(query: string, board: BoardKey | "all", subject: SubjectKey | "all") {
  if (!query.trim()) return [];
  const lowered = query.toLowerCase();
  return topicEntries
    .filter((entry) =>
      (entry.board === "all" || entry.board === board || board === "other") &&
      (entry.subject === "all" || entry.subject === subject || subject === "other") &&
      (entry.value.toLowerCase().includes(lowered) ||
        entry.aliases?.some((alias) => alias.toLowerCase().includes(lowered)))
    )
    .slice(0, 7);
}

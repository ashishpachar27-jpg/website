"use client";

import { useMemo, useState } from "react";
import { searchTopics } from "@/lib/topics";
import type { BoardKey, SubjectKey } from "@/lib/boards";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicSelectorProps {
  board: BoardKey | "";
  subject: SubjectKey | "";
  value: string[];
  onChange: (topics: string[]) => void;
}

export function TopicSelector({ board, subject, value, onChange }: TopicSelectorProps) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    return searchTopics(query, (board || "all") as BoardKey | "all", (subject || "all") as SubjectKey | "all");
  }, [board, subject, query]);

  const handleAdd = (topic: string) => {
    if (!value.includes(topic)) {
      onChange([...value, topic]);
    }
    setQuery("");
  };

  const handleRemove = (topic: string) => {
    onChange(value.filter((item) => item !== topic));
  };

  return (
    <div className="space-y-2">
      <div>
        <label htmlFor="topics" className="mb-1 block text-sm font-medium text-slate-700">
          Topic name(s)
        </label>
        <p className="mb-2 text-xs text-slate-500">
          Type at least 3 letters. Try “kinematics”, “simultaneous equations”, “vector addition”.
        </p>
        <input
          id="topics"
          type="text"
          value={query}
          placeholder="Search topics"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && query.trim().length >= 3) {
              event.preventDefault();
              handleAdd(query.trim());
            }
          }}
          className="w-full"
        />
      </div>
      {results.length > 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <ul className="divide-y divide-slate-100">
            {results.map((topic) => (
              <li key={topic.value}>
                <button
                  type="button"
                  onClick={() => handleAdd(topic.value)}
                  className="flex w-full items-start justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-brandTeal-50"
                >
                  <span>{topic.value}</span>
                  <span className="text-xs text-slate-500">{topic.board.toUpperCase()}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : query.length >= 3 ? (
        <p className="text-sm text-slate-500">
          We couldn’t find that topic. Choose a closest match or continue typing to add it manually.
        </p>
      ) : null}
      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2" aria-live="polite">
          {value.map((topic) => (
            <span
              key={topic}
              className={cn(
                "inline-flex items-center gap-1 rounded-full bg-brandBlue-50 px-3 py-1 text-sm text-brandBlue-700",
              )}
            >
              {topic}
              <button
                type="button"
                onClick={() => handleRemove(topic)}
                className="inline-flex rounded-full bg-white/60 p-0.5 text-brandBlue-600 hover:bg-white"
                aria-label={`Remove ${topic}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

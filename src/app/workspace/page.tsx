import { Card, CardContent, CardHeader } from "@/components/card";
import { Button } from "@/components/button";
import { BookOpenCheck, Clock, Download, FileText } from "lucide-react";
import Link from "next/link";

const assignments = [
  {
    id: "assignment-1",
    title: "IB DP HL Physics - Fields and Electromagnetism",
    due: "2024-05-24T16:00:00Z",
    duration: 90,
    status: "In progress",
    progress: 60,
  },
  {
    id: "assignment-2",
    title: "Cambridge IGCSE Mathematics Extended - Algebra",
    due: "2024-05-27T09:00:00Z",
    duration: 75,
    status: "Not started",
    progress: 0,
  },
];

const submissions = [
  {
    id: "submission-1",
    title: "CBSE Grade 10 Physics - Electricity",
    submittedAt: "2024-05-14T10:45:00Z",
    score: "18 / 25 (Objective section auto-graded)",
    status: "Awaiting teacher review",
  },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function WorkspacePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-slate-900">Student workspace</h1>
      <p className="mt-2 text-sm text-slate-600">
        Access assigned tests, auto-save responses, and download PDF copies.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader title="Assignments" description="Continue where you left off." />
          <CardContent className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-brandBlue-700">{assignment.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1"><Clock size={14} /> {assignment.duration} min</span>
                  <span>Due {formatDate(assignment.due)}</span>
                  <span>{assignment.status}</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-brandTeal-500 transition-all"
                    style={{ width: `${assignment.progress}%` }}
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <BookOpenCheck size={16} className="mr-1" /> Continue online
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 border border-slate-200">
                    <Download size={16} className="mr-1" /> Download PDF
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Submissions" description="Review feedback and scores." />
          <CardContent className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-brandBlue-700">{submission.title}</p>
                <p className="mt-1 text-xs text-slate-500">Submitted {formatDate(submission.submittedAt)}</p>
                <p className="mt-2 text-sm text-slate-600">{submission.score}</p>
                <p className="text-xs text-brandGold-600">{submission.status}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <FileText size={16} className="mr-1" /> View responses
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 border border-slate-200">
                    <Download size={16} className="mr-1" /> Download PDF
                  </Button>
                </div>
              </div>
            ))}
            <Link href="/create-test" className="text-sm text-brandBlue-700 underline">
              Need a new paper? Build one in minutes.
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

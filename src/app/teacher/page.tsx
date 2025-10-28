import { Card, CardContent, CardHeader } from "@/components/card";
import { Button } from "@/components/button";
import { BarChart3, Download, LineChart, Users } from "lucide-react";

const analyticsHighlights = [
  {
    title: "Mastery by topic",
    description: "Fields & Electromagnetism and Differential Calculus show the lowest mastery this month.",
    icon: LineChart,
  },
  {
    title: "Difficulty heatmap",
    description: "Students struggle most with multi-step structured questions tagged AO3 or Evaluate.",
    icon: BarChart3,
  },
  {
    title: "Active cohorts",
    description: "32 IB DP students, 18 IGCSE, 22 CBSE assigned practice papers in the last 7 days.",
    icon: Users,
  },
];

const templates = [
  {
    board: "IB DP HL",
    subject: "Physics",
    description: "Paper 1 / Paper 2 hybrid with data-based Section A and structured Section B.",
  },
  {
    board: "Cambridge IGCSE Extended",
    subject: "Mathematics",
    description: "Calculator and non-calculator variants with AO weightings and worked solutions.",
  },
  {
    board: "CBSE Grade 12",
    subject: "Chemistry",
    description: "Sectioned blueprint with VSA, SA, LA distribution and competency tags.",
  },
];

export default function TeacherPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-slate-900">Teacher & admin dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        Monitor student progress, inspect topic mastery, and deploy board-aligned templates.
      </p>
      <section className="mt-8 grid gap-6 md:grid-cols-3">
        {analyticsHighlights.map((item) => (
          <Card key={item.title}>
            <CardHeader title={item.title} />
            <CardContent className="flex items-start gap-3 text-sm text-slate-600">
              <item.icon className="mt-1 text-brandBlue-600" size={20} />
              <p>{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="mt-10">
        <Card>
          <CardHeader
            title="Template library"
            description="Jumpstart assessments with vetted blueprints and AI-validated question sets."
          />
          <CardContent className="space-y-4">
            {templates.map((template) => (
              <div key={`${template.board}-${template.subject}`} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-brandBlue-700">
                      {template.board} — {template.subject}
                    </p>
                    <p className="text-sm text-slate-600">{template.description}</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Download size={16} className="mr-1" /> Use template
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <section className="mt-10 rounded-3xl bg-brandBlue-900 px-8 py-10 text-white">
        <h2 className="text-2xl font-semibold">Compliance & privacy ready</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-brandBlue-100">
          <li>OAuth-based authentication with roles for students, teachers, and admins.</li>
          <li>GDPR export/delete tooling and guardian consent workflows for under-13 students.</li>
          <li>PII redaction in logs plus plagiarism & AI-content disclaimers on teacher dashboards.</li>
        </ul>
      </section>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader } from "@/components/card";

const sellingPoints = [
  {
    title: "Board-aware assessments",
    description:
      "Generate papers that sound like IB, Cambridge, GCSE, CBSE, ICSE, or AP. Every command term, mark scheme cue, and layout is tuned for authenticity.",
  },
  {
    title: "LaTeX-perfect PDFs",
    description:
      "From cover page to contact sheet, deliver exam-ready PDFs with TikZ diagrams, metadata, bookmarks, and the Ashish footer mandated for every copy.",
  },
  {
    title: "Autosave and resume anywhere",
    description:
      "Drafts sync every 3 seconds to secure storage so students and teachers can start on one device and continue on another without missing a beat.",
  },
];

const samplePreviews = [
  {
    board: "IB DP HL",
    subject: "Physics",
    description: "Data-based Section A, multi-step Section B, optional Paper 3 style challenges.",
  },
  {
    board: "Cambridge IGCSE Extended",
    subject: "Mathematics",
    description: "Tiered part (a)/(b)/(c) questions with calculator notes and structured mark allocations.",
  },
  {
    board: "CBSE Grade 10",
    subject: "Science",
    description: "Section A/B/C blueprint with competency tags and typology from VSA to LA.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <span className="rounded-full bg-brandTeal-100 px-4 py-1 text-sm font-medium text-brandTeal-800">
            For international K-12 classrooms
          </span>
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
            Craft exam-ready assessments in under two minutes.
          </h1>
          <p className="text-lg text-slate-600">
            BoardSmart pairs curriculum intelligence with a resilient LaTeX pipeline so every test matches IB, Cambridge,
            GCSE, AP, CBSE, or ICSE expectations—complete with diagrams, mark schemes, and optional solutions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/create-test">Create test</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/workspace">Open student workspace</Link>
            </Button>
          </div>
        </div>
        <Card className="bg-gradient-to-br from-brandBlue-50 via-white to-brandTeal-50">
          <CardHeader
            title="Recent drafts"
            description="Resume from any device. Autosave keeps the latest version synced to the cloud and your browser."
          />
          <CardContent className="space-y-4">
            {samplePreviews.map((preview) => (
              <div key={preview.board} className="rounded-xl border border-slate-200 bg-white/80 p-4">
                <p className="text-sm font-semibold text-brandBlue-700">{preview.board}</p>
                <p className="text-sm text-slate-600">{preview.subject}</p>
                <p className="mt-2 text-sm text-slate-500">{preview.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <section className="mt-20 grid gap-8 md:grid-cols-3">
        {sellingPoints.map((point) => (
          <Card key={point.title}>
            <CardHeader title={point.title} />
            <CardContent>
              <p className="text-sm text-slate-600">{point.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="mt-20 rounded-3xl bg-brandBlue-900 px-8 py-12 text-white">
        <h2 className="text-3xl font-semibold">Trusted by tutors worldwide</h2>
        <p className="mt-3 max-w-3xl text-lg text-brandBlue-100">
          Teachers across India, the UK, Middle East, and APAC use BoardSmart to deliver personalised practice papers,
          track mastery, and share polished PDFs without worrying about formatting errors.
        </p>
      </section>
    </div>
  );
}

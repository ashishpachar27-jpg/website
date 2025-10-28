# BoardSmart Assessments

BoardSmart is a Next.js application for generating board-aligned assessments for international K-12 curricula including IB,
Cambridge, GCSE, AP, CBSE, and ICSE. Students and teachers can build exams in minutes, auto-save drafts, and export LaTeX-first
PDFs with optional solution sets.

## Features

- Landing page highlighting value proposition and recent drafts.
- Comprehensive test builder with validation, autosave (local + server), topic autosuggest, and configurable options.
- Review and generation workflow that compiles LaTeX to PDF with graceful fallbacks and optional solutions packs.
- Student workspace to manage assignments and submissions with progress indicators.
- Teacher dashboard showcasing analytics insights and a template library.

## Tech stack

- Next.js 14 with the App Router
- TypeScript + React Hook Form + Zod for robust forms
- Tailwind CSS for styling
- pdf-lib + LaTeX compilation (`latexmk`) for assessment PDFs

## Getting started

```bash
npm install
npm run dev
```

To generate PDFs with LaTeX, ensure a TeX distribution (e.g. TeX Live) is available in your environment. The server will fall
back to a simplified pdf-lib template if compilation fails.

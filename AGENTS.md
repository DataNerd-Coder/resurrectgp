# AGENTS.md

## Workflow conventions

- **After every `npm run build`, always start the dev server with `npm run dev`.**
- The app lives in `src/` (Next.js App Router + TypeScript).
- GPA math belongs in `src/lib/gpa.ts`; keep it pure and framework-free.
- UI is split into focused components under `src/components/`.
- `html2canvas` and Vercel Analytics are loaded via CDN/script tags (not npm
  packages) because of an npm arborist peer-resolution bug in this environment.
- **Skill harness:** 157 skills are installed (global + `.opencode/skills`).
  Build work follows the phase pipeline and golden loops in `SKILLS.md` —
  consult it at the start of any non-trivial task and use the named skills,
  don't freestyle.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

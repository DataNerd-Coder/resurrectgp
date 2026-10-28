# Resurrect My GPA

A GPA predictor & calculator for university students. Plan a semester, project a
CGPA, enter real results, and generate a multi-level "comeback roadmap" toward a
target CGPA.

This project was migrated from a single `index.html` file to a structured
**Next.js (App Router) + TypeScript + Tailwind CSS** application.

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/turbopack`)
- **html2canvas** (loaded from CDN) for saving result images
- **Vercel Analytics** (enabled when deployed on Vercel), Google Tag Manager,
  and Google Analytics (gtag)

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |

## Project structure

```
src/
  app/
    layout.tsx      # Metadata, fonts, analytics scripts
    page.tsx        # Renders the app
    globals.css     # Tailwind import + custom styles
  components/
    GpaApp.tsx      # Main client component / state orchestrator
    Header.tsx      # Share bar + page header
    ModeSwitcher.tsx
    SetupPanel.tsx  # Mode-specific setup inputs
    CourseGrid.tsx  # Course units + grade inputs
    ResultsSection.tsx
    RoadmapSection.tsx
    BlueprintModal.tsx
    Footer.tsx
  data/
    strategies.tsx  # Content for the 4 "Resurrection Blueprint" modals
  lib/
    gpa.ts          # GPA math, class bands, simulation, roadmap projection
```

## GPA logic

- Grades use a **5-point scale**: `A=5, B=4, C=3, D=2, E=1, F=0`.
- Class bands: First Class ≥ 4.5, 2:1 ≥ 3.5, 2:2 ≥ 2.4, otherwise Pass.
- The semester/CGPA simulators start every course at a `C` and raise grades
  (max 100 steps) until the target GPA is reached.
- The roadmap projection assumes **20 units per academic level**.

## Deploying

The app is a good fit for Vercel. Import the repository into Vercel and it will
detect Next.js automatically.

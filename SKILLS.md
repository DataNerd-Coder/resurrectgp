# SKILLS.md — Skill Harness Playbook

157 skills are installed in `~/.config/opencode/skills` (global) and
`.opencode/skills` (project-local copy, gitignored). This document is the
standing plan for using them — not a reference list. Skills fire in two ways:

1. **Auto-trigger** — OpenCode matches their `description` to the task. Name the
   intent out loud ("audit the design", "lock in the plan", "qa this") and the
   right skill loads.
2. **Explicit load** — "use the `X` skill" loads `X/SKILL.md` on demand.

Renamed IDs from collisions: `mattpocock-tdd`, `mattpocock-teach`,
`pstack-reflect`.

---

## Standing rule for ResurrectGP

- Stack routing: Next.js 16 / React 19 / TypeScript / Tailwind v4.
- Every build ends with `npm run build` then **`npm run dev`** (see AGENTS.md).
- The dev server on `localhost:3000` is the QA target for the browser skills.
- GPA math stays pure in `src/lib/gpa.ts` — no framework imports.

---

## The pipeline: who runs, when

| Phase | Load these skills | Trigger phrase |
|---|---|---|
| 1. Idea / opportunity | `validate`, `plan-ceo-review`, `grilling` | "is this worth building", "think bigger", "grill me" |
| 2. Spec / tickets | `to-spec`, `to-tickets`, `to-questionnaire`, `domain-modeling`, `grill-with-docs` | "turn this into a spec", "make tickets" |
| 3. Architecture / plan | `plan`, `plan-eng-review`, `codebase-design`, `setup-ts-deep-modules`, `graphify` | "review the architecture", "lock in the plan" |
| 4. Visual design | `taste-skill`, `frontend-design-direction`, `design-consultation`, `design-system`, `apple-design-skill`, `liquid-glass-design` | "design system", "less generic", "review my design" |
| 5. Implementation | `react-patterns`, `frontend-patterns`, `frontend-a11y`, `typescript-best-practices`, `backend-patterns`, `api-design`, `shadcn` | auto (writing React/TS code) |
| 6. TDD / testing | `mattpocock-tdd` or `tdd-workflow`, `react-testing`, `e2e-testing` | "test-first", "red-green" |
| 7. Browser QA | `pstack` / `browse`, `qa`, `qa-only`, `benchmark` | "test the site", "qa this", "take a screenshot" |
| 8. Debug | `investigate`, `diagnosing-bugs`, `blast-radius`, `figure-it-out`, `why`, `how` | "debug this", "why is this broken" |
| 9. Security | `never-get-hacked`, `security-review`, `security-scan`, `agent-security-hardening`, `cso`, `careful` | "is this secure", "audit before deploy" |
| 10. Verification | `verification-loop`, `code-review`, `coding-standards`, `review`, `sharpen` | "verify the work", "review since X" |
| 11. Docs | `document-release`, `technical-writing`, `writing-for-agents` | "update the docs" |
| 12. Ship / operate | `ship`, `pr`, `git-guardrails-claude-code`, `setup-pre-commit` | "ship it", "review my diff" |
| 13. Retros | `pstack-reflect`, `retro`, `recall`, `strategic-compact` | "weekly retro", end of session |

Mobile/other stacks: `swiftui-expert-skill` + `swiftui-pro` + `swiftui-patterns`
(SwiftUI), `swift-concurrency-6-2` (Swift 6.2), `react-native-patterns` (Expo),
`android-clean-architecture` (Android/KMP), `migrate-shadcn…` →
`migrate-radix-to-base` (Radix→Base UI).

---

## Five golden loops

### Feature loop (the default)
`validate` → `to-spec` → `plan-eng-review` → build with `react-patterns` /
`frontend-patterns` / `typescript-best-practices` → `tdd-workflow` →
`qa` (browser, localhost:3000) + `frontend-a11y` → `verification-loop` →
`security-review` → `ship` → `npm run build` + `npm run dev`.

### Bug loop
reproduce with `pstack` → `investigate` (root cause, no fixes without it) →
`blast-radius` (what else does this touch) → fix → `react-testing` regression
test → `verification-loop` → redeploy & re-verify with `pstack` diff.

### Design polish loop
`taste-skill` researches a researched direction (no slop) → implement →
`pstack` screenshots → `design-review` / `apple-design-skill` audit →
`unslop` check → iterate on before/after diffs until it scores.

### Security pass (before every deploy)
`cso` full audit → `never-get-hacked` pre-flight (auth, keys, upload, payments)
→ `security-review` on touched endpoints → `security-scan` on agent/config
files → *then* `ship`.

### Learning loop (every week / every session end)
`pstack-reflect` (velocity & trends) → `document-release` (docs stay true) →
`strategic-compact` (keep context at phase boundaries).

---

## Always-on constitution: the 24 `principle-*` skills

These are mental models, not commands. Apply them implicitly — especially:

- `principle-fix-root-causes`, `principle-prove-it-works` — no unverified fixes
- `principle-subtract-before-you-add`, `principle-exhaust-the-design-space` —
  design before writing
- `principle-guard-the-context-window`, `principle-sequence-verifiable-units` —
  execution discipline
- `principle-test-behavior-not-implementation`, `principle-type-system-discipline` —
  code discipline
- `principle-encode-lessons-in-structure` — anything fixed twice becomes a
  lint, test, or pattern here in the repo

---

## Harness rules (how to get 100% out of this)

1. **Phase gates, not free-for-alls.** Don't start phase 5 (implement) until
   phase 3's plan skill has produced output; don't ship before loop 4 (security)
   has run on touched endpoints.
2. **One skill at a time.** Load the SKILL.md, follow it fully, then move on.
   Loading five at once produces mush.
3. **Browser truth over code truth.** Visual/UX claims are only real when
   `pstack`/`browse` has seen them on `localhost:3000`.
4. **`graphify` for "where/how" questions.** Whenever stable knowledge about the
   codebase is needed repeatedly, let `graphify` build `graphify-out/` and query
   the graph instead of re-reading files.
5. **Safety skills on shared/prod.** `careful`/`guard`/`freeze` whenever
   touching deploy or destructive operations; `git-guardrails-claude-code`
   before hooks that could clobber history.
6. **Research once, cite forever.** `research` and `deep-research` write files —
   prefer their artifacts over re-answering from memory.
7. **Parallelism for reviews.** `code-review` / `swarm`-style skills run
   standards-and-spec reviews in side-by-side passes — use them on PRs instead
   of single threaded eyeballing.
8. **Everything stays local.** Skills that shell out need nothing from this
   repo; record any missing runtime (e.g. `uv` for graphify CLI) in AGENTS.md.

---

## Gaps to note

- ECC's umbrella `everything-claude-code` SKILL.md doesn't exist upstream —
  its bundled rules/agents didn't ship with the 23 named skills installed here.
- ~237 additional ECC skills exist upstream if a new capability is needed —
  pull from `affaan-m/ECC` `skills/`.
- `graphify` CLI needs `uv` (`uv tool install graphifyy`) if invoked end-to-end.

# High School Comparison for Jersey City Area

A dependency-free static comparison of 23 NJ/NYC high schools: all 22 individual schools in the supplied guide plus Seton Hall Prep. No accounts, database, tracking, personal student data or build step.

## Publish on GitHub Pages

1. Create a GitHub repository and upload the contents of this `school-compare` folder, including `dist` and `.github`.
2. In the repository, open **Settings → Pages → Source → GitHub Actions**.
3. Run **Deploy school comparison** under Actions (or push to `main`). The included workflow uploads only `dist`.

Alternatively, upload the contents of `dist` to your repository root and publish that root using Pages' branch-based option. All asset links are relative, so project URLs such as `/school-compare/` work. No custom domain is required.

## Update the information

Edit **`dist/schools.json`**. This is the single source of truth used by the website. Commit the change to republish. The site does not fetch Google Docs or school websites at runtime.

Each school has `name`, `city`, `state`, `region`, `type`, `gender`, `website`, `reviewed`, and seven detail objects: `admissions`, `visits`, `exam`, `deadline`, `tuition`, `activities`, `college`. Each detail contains:

```json
{
  "text": "Application due November 13, 2026 at 4 pm ET.",
  "status": "verified",
  "url": "https://school.example/admissions",
  "dates": ["2026-11-13"]
}
```

- `checked`: date that this specific section was researched. It does not imply every fact was confirmed. Optional `note` adds a short prerequisite or score deadline beneath the summary.
- `summary`: short text for the overview row (visits, deadline, exam and college). Keep it in sync with the full `text`. Tuition summaries are generated from `amount` and `year`. All full sections and source links appear when a school is expanded.
- `verified`: specific detail supported by the linked school page; does not verify the whole school record.
- `tentative` (displayed as **Unconfirmed**): undated, outdated, conflicting or otherwise unconfirmed source. Explain the uncertainty in `text`; never silently roll a previous year forward.
- `unknown`: current detail not yet verified, including stale or conflicting school pages.
- `deadline.dates`: only confirmed ISO dates for application stages. Future dates sort first; undated, tentative and past-only entries sort last. Text retains supplementary and aid deadlines.
- `tuition.amount`: numeric annual day tuition in USD, excluding additional fees. `null` for unknown; `0` for tuition-free schools. `year` is the quoted academic year. Older rates are explicitly labeled and are not projections.
- Keep stable unique `id` values. Location filters are derived from `state` and `city`: `New Jersey: Jersey City`, `New Jersey: Other towns`, and `New York City`. The default sort places Jersey City first, other NJ towns next, then NYC; each group is alphabetical. Accepted filters: type `Public` / `Private`; gender `Co-ed` / `Boys-only` / `Girls-only`.

After edits, update the affected `reviewed` date, root `updated` value and visible snapshot text in `dist/index.html` as appropriate. A review date records a research pass, not verification of every field. No fabricated dates, fees or results: use explicit unknowns.

## College records

Keep acceptance lists, matriculation lists and individual destination announcements distinct. Do not treat missing evidence as zero admissions. Publish a percentage only when counts and the graduating-class denominator cover exactly the same cohorts. Historical outcomes are not an individual student's probability. This starter intentionally does not rank schools by Ivy admission probability.

## Local preview and validation

From this folder: `python3 -m http.server 8765 --directory dist`, then visit `http://localhost:8765`. Opening `index.html` directly as a file may block loading JSON.

Run `node validate.mjs` for schema, asset and behavior checks. The page uses semantic controls, visible keyboard focus, a mobile layout and horizontally scrollable comparisons. Browser visual testing has not been performed. Optional WebMCP registration is feature-detected; no supported live WebMCP context was available for its runtime validation.

## Privacy and sharing

Only school-level information is included. The private source guide URL, family information and student records are deliberately absent. School comparison selection is in-memory and clears on reload. Checklist completion uses localStorage on the current origin; it does not transfer to GitHub Pages or other browsers. A GitHub Pages publication is normally public: review the data before publishing. The separate Sites preview remains owner-private.

## Niche grades

Each `niche` object stores `grade` (letter or null), `metric`, `url`, `checked`, `text` and `status: external`. Keep it separate from school-confirmed admissions facts. Null is displayed as Not rated and sorts last. These are overall school grades, not star-review scores. Use the correct campus/division profile; do not substitute a neighborhood grade or another campus. Current snapshots were checked September 22, 2026 and update manually.

## Admissions refresh — September 22, 2026

Official admissions and visit pages were checked for all 23 schools, targeting grade 9 entry in fall 2027. Follow each field’s source link. Some schools expose event availability only in their booking portals. Unknown application cutoffs remain unsortable; the McNair/Infinity October 2 PSAT signup prerequisite is explicitly separate from their unconfirmed final application deadline. Test dates may differ for JCPS students and students at other schools. No registration requests were submitted.

Visits and deadlines use `items: [{date, detail}]` for date-first bullets and optional `detailNote` for booking instructions or caveats. Keep `text` in sync as a plain-text export. `deadline.dates` remains the separate list of confirmed application deadlines for sorting; never include an opening date or exam date there.

## Dates & To-dos and Entrance Exams

The three tabs run from the same `dist/schools.json` snapshot, without a server or accounts.

- Visit/deadline `items` have stable `id`, explicit `isoDate` (null for ranges or unconfirmed dates), `kind`, and item-level `status`. Keep IDs stable when correcting wording. Never infer dates at runtime from prose. Update the date label and ISO date together.
- `exams` holds one registry entry per test/assessment, official registration and source URLs, checked date, notes and dated `events`. Available sittings are alternatives. An entry is not a claim that every student needs that test.
- Each school's `exam.examIds` links to registry entries; `requirement` identifies optional/required/conditional rules. School-specific `milestones` adds score or testing deadlines. Exam text and its structured milestones must be edited together when the underlying policy changes.
- The calendar combines school visit/deadline items, exam events and school score milestones. Matching shared district items merge by source, date, action and type. The Seton Hall final-exam reminder stays in school details; its calendar entry comes from the exam registry.
- Upcoming shows unchecked future and undated items. Completed shows checked items. All includes past and unchecked items. Past visit dates are not automatically called overdue. All dates use New York's calendar day.
- Checkmarks use `jersey-city-high-schools:2027:completed` in localStorage. They contain event IDs only. Clearing browser data removes them; moving to a new hostname starts a separate checklist. Blocked or invalid storage shows a visible notice.

See `MOVE-TO-GITHUB.md` for the hosting handoff. The ZIP excludes Git history and Sites configuration; it includes the GitHub Actions workflow and all static assets. No browser visual QA was requested; automated schema and interaction checks cover filtering, tabs, shared dates, exam alternatives, and local persistence.

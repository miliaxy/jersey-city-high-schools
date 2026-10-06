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

## Selected admissions refresh — October 2, 2026

This refresh covers public information for 2027–28 entry. Only the edited admissions sections and the TACHS/Seton Hall exam registries have new checked dates. Tuition, activities, college records, Niche grades and unrelated admissions fields retain their prior values. Existing school and checklist IDs are preserved; new events receive new IDs. Supplemental `sources: [{label, url}]` links explain corroboration or conflicts, and optional item `url` selects the source for that calendar event.

| School / exam | Changes and official evidence |
| --- | --- |
| High Tech / County Prep | [HCST admissions](https://hcstonline.org/admissions/): application opens October 5, 2026 at 4 pm ET; portfolio link emailed November 16. Unchanged: application November 13 at 4 pm, recommendation November 30 at noon, counselor/portfolio December 23 at 3 pm. Opening and portfolio delivery do not enter application-deadline sorting. |
| Kindle | [Enrollment](https://www.kindleeducation.org/enroll): applications are open; lottery-entry cutoff February 15, 2027. The current page does not retain an exact opening date, so the old October 1 entry is now an undated availability notice with its existing ID. |
| Hoboken High | [District Choice page](https://www.hoboken.k12.nj.us/central_office/student_enrollment_office/-_school_choice) and [NJ timeline](https://www.nj.gov/education/choice/parents/timeline/): application and Notice of Intent to Participate due November 24, 2026; Notice of Intent to Enroll due January 8, 2027 only after conditional acceptance. Resident enrollment remains separate. |
| Horace Mann | [Grades 6–11 application](https://www.horacemann.org/admissions/applying-to-grades-6-11): prior-two-years report cards added to the October 15, 2026 application/interview-scheduling reminder. Final application November 18 remains unchanged. Application opens August 5, 2026. |
| Pingry | [Upper School admissions](https://www.pingry.org/apply/applicationprocess/upperschooladmissions): test scores due November 9, 2026 (Grade 9 Early Action) or December 14 (Regular Decision). [Application process](https://www.pingry.org/apply/applicationprocess): opening in July 2026, without an exact day. The [open-house page](https://www.pingry.org/apply/visit/open-houses) says September 30, 2026 at 6:30 pm, while the Upper School page says September 30, 2027 at 6:30 pm. Both were checked October 2: year remains unconfirmed, with no sortable ISO date or inferred future open house. The 2026 date is already past. |
| Delbarton | [Procedure](https://www.delbarton.org/admissions/application-procedure) says November 30, 2026; [inquiry timeline](https://www.delbarton.org/admissions/inquire) says December 1. Keep the cutoff unconfirmed and unsortable; plan conservatively for November 30 and confirm with admissions. Application opening August 17, 2026 is separately recorded. |
| Franklin | [Process](https://www.franklinjc.org/admissions/admission-process) and [FAQ](https://www.franklinjc.org/admissions/faqs) agree on November 13, 2026 Early Decision and January 15, 2027 Regular Decision; obsolete conflict warning removed. [Apply page](https://www.franklinjc.org/admissions/apply) supports July 1, 2026 opening. |
| Peddie | [Official admission calendar](https://peddie.org/events/category/admissions/list/): Fall Previews October 17 and November 14, 2026, both 8:30 am–2 pm. Appointment visit retained. |
| Avenues | [Admissions events](https://www.avenues.org/new-york/admissions): Upper Division open house October 17, 2026, 9 am–1 pm; existing virtual events retained. |
| Seton Hall Prep | [Admissions exams](https://www.shp.org/admissions/admission-events/admissions-exams): 9 am on November 7, November 21, December 5 and December 12, 2026; choose one sitting. |
| TACHS | [Official parent calendar](https://www.tachsinfo.com/PDF/ParentsCalendar.pdf): accommodation request/documents October 2, 2026; registration October 28 at 11 pm ET; test November 6 for New York or November 7 for Brooklyn/Queens and Rockville Centre. Diocese determines the sitting. Existing `tachs-check` ID now carries the confirmed registration cutoff. |
| Other published openings | [French American](https://faacademy.org/apply-now/): July 15, 2026; [Saint Peter’s](https://spprep.org/admissions/important-dates/): September 1; [Hudson School](https://www.thehudsonschool.org/admission/admissions-process/): September 1 for Early Notification; [Newark Academy](https://www.newarka.edu/admission/apply): September 1; [Trinity](https://www.trinityschoolnyc.org/admissions/admissions-5-12): September 8. These are opening events, not application cutoffs. |

All approved change categories were verified. No exact July opening day is inferred for Pingry, and no conflict is silently resolved. Validation: `node validate.mjs`, `node --check dist/app.js`, and `git diff --check`; regression coverage includes conflicts, openings versus cutoffs, score milestones, TACHS alternatives, existing checklist keys and escaped supplemental links.

## Selected admissions refresh — October 6, 2026

Prepared public-facts changes for 2027–28 entry cover eleven schools. French American Academy retains both announced dates; uncertainty applies only to November 7 registration availability. Only changed admissions categories receive the new checked date; unrelated information and existing checklist IDs are preserved.

- **Franklin:** required graded writing, optional ISEE/SSAT and interview booking after the application form, per the [process page](https://www.franklinjc.org/admissions/admission-process). [Virtual chats](https://www.franklinjc.org/admissions/visit-us): October 13, November 19 and December 9, 2026, 8–9 am.
- **Hudson Catholic:** November 6, 2026 HSPT agrees across [/hspt](https://hudsoncatholic.org/hspt) and [/apply](https://hudsoncatholic.org/apply). The latter still labels the incoming class 2026–2027, so a narrow entry-year caveat remains. [Open house](https://hudsoncatholic.org/open-house): October 18, 2026, 10 am–1 pm.
- **Hoboken Choice:** [published criteria](https://www.hoboken.k12.nj.us/central_office/student_enrollment_office/-_school_choice) require two years of B-or-higher Mathematics/Science grades and Mathematics/ELA proficiency. Tier 2 acceptance remains unresolved because the application’s Yes/No selection is unfilled; no private-school eligibility is inferred.
- **Horace Mann:** [September 27 information session canceled](https://www.horacemann.org/admissions/admissions-events), replacement pending. October 24 athletics registration is separate from information-session registration in Ravenna.
- **Léman:** remove the obsolete introductory-year warning; the [timeline](https://www.lemanmanhattan.org/timelines.html) explicitly covers 2027–28.
- **Dwight:** [October 6 and 28 in-person events are full](https://www.dwight.edu/newyork/admissions/visit-us); November 17 virtual open house is 5–6 pm. Waitlist and booking instructions remain explicit.
- **Kindle:** the [current form linked from enrollment](https://www.kindleeducation.org/enroll) lists November 5 virtual, November 19 in person and January 21 in person, all at 6:30 pm. Years 2026/2027 are explicitly inferred, with null ISO dates rather than confirmed calendar dates. In-person events are at 89 York Street.
- **Newark Academy:** [visits](https://www.newarka.edu/admission/visit): October 6 aid webinar 7–8 pm; October 9 Upper School tour 12:10 pm; October 15 tour 9:30 am; November 2 arts virtual session 7–8 pm; December 8 community event 6:15–7:15 pm. [January 11, 2027 completion](https://www.newarka.edu/admission/apply) explicitly includes financial aid.
- **Avenues:** November 18, 2026 First Choice and January 8, 2027 Regular completion reminders explicitly include aid applications/additional documents for families requesting aid. The linked 2027–28 financial-aid PDF is retained as a supplemental source.
- **Peddie:** [financial-assistance materials](https://peddie.org/admission/tuition-affordability/financial-assistance/) due January 15. The aid page omits the year: 2027 is labeled inferred, and the separate aid reminder has a null ISO date. Existing application cutoff and ID remain unchanged.

- **French American Academy:** the [school open-house page](https://faacademy.org/school-open-house/) announces October 10 and November 7, 2026 at 2 pm. Public registration confirms October 10, 2–4 pm, 118 Ferry Street. November 7 booking availability is uncorroborated while the high-school event page says no events scheduled; this is not a cancellation or an unconfirmed announced date. Both existing visit IDs and ISO dates remain unchanged.

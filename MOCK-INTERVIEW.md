# Spoken walkthrough

This is the script for the red app in this repo. [EXERCISE.md](./EXERCISE.md) is the brief. The code you are looking at is the starting point: 7 tests fail, 2 pass.

Use it in one of two ways.

- **Blind pass.** Set a 90-minute timer. Keep this file closed. Narrate to an empty chair. Open this only to score yourself.
- **Scripted pass.** Read each blockquote out loud, make the edit under it, run the command, then say what the new failure means. Do one blind pass later. The scripted pass teaches the lines. The blind pass is the interview.

Say the blockquotes as written, in a calm voice. The fenced blocks marked **Paste this** go in the assistant panel. Everything else you type yourself.

## Clock

| Minutes | Beat | Leave this beat when |
| --- | --- | --- |
| 0–8 | Map | You have named the first failure and why |
| 8–20 | Request button | `RequestForm.test.tsx` is green |
| 20–35 | `upcoming` | `lib/lessons.test.ts` and `route.test.ts` are green |
| 35–45 | Stale tutor | The reload test is green |
| 45–60 | Wire format and local time | The whole suite is green |
| 60–75 | Subject filter | A new test fails first, then the suite is green, and refresh keeps the filter |
| 75–90 | Ship | You have stopped typing and walked the five production points |

If a beat slips, say so and steal from the ship conversation. Do not steal from narration.

## 0–8 Map

Open the tree and the test names. Do not prompt yet.

> "I'll spend a few minutes on the tree and the test names before I change anything. The page is a server component that awaits `params` under Suspense and renders `TutorPanel`. The panel is the request form plus the lesson list. `GET /api/lessons` filters an in-memory list through `filterLessons`. The suite is the spec."

Run:

```bash
npm test
```

You should see 7 failed and 2 passed. Also glance at:

```bash
npm run lint
npx tsc --noEmit
```

Lint warns that the effect in `LessonList` is missing `subject` and `tutorId`. Typecheck says `LessonStatus` and `"scheduled"` have no overlap. Remember both. Do not fix them in a clump.

> "Two tests are already green: the button enables when the slot and the policy are both present, and an exact status still filters. I'll protect those. I'll take the request button first. The test name is the product rule, and the handler is a few lines, so I'll read it myself. Then the pure `upcoming` filter, because the list calls that word and I want it to mean something before I debug the component. Then the effect. Then the wire format, which is where the type error is pointing."

Click `/tutors/tutor_a` while you talk. The policy is unchecked and **Request lesson** is still tappable. The upcoming list is empty. That matches the red tests. You do not need the UI to find the bugs. It helps the ship conversation later.

## 8–20 The request button

File: `components/RequestForm.tsx`.

The red tests:

- disables request until a slot is chosen and the policy is accepted
- stays disabled when the policy is accepted but no slot is chosen

The green test: enables request when both are true.

> "This test expects the button to stay disabled when the policy is unchecked, even though a slot is already chosen. The handler uses `&&`. I'll read those lines myself. A prompt would cost more than the edit."

The line is:

```tsx
const disabled = !slotId && !agreed;
```

`&&` is true only when both are missing. A chosen slot with an unchecked box makes the whole expression false, so the button submits. The product rule is "slot and agreement."

Change it to:

```tsx
const disabled = !slotId || !agreed;
```

> "Disabled when there is no slot, or when they have not agreed. The green test still covers the case where both are present, so I have not locked the button forever."

```bash
npm test -- components/RequestForm.test.tsx
```

> "That file is green. I won't run the world yet. Next failure is the meaning of upcoming."

No prompt on this beat.

## 20–35 What `upcoming` means

Files: `lib/lessons.ts`, `lib/lessons.test.ts`, `app/api/lessons/route.ts`.

The pure test wants ids `a` and `b`: future `requested`, future `confirmed`. It drops future `cancelled` and past `confirmed`. The route test wants the same rule for Ana's seeded rows.

Read `filterLessons` and the route together.

> "`upcoming` is not a column. The filter compares it to `row.status`, so nothing matches and both tests get an empty list. The route is already passing `status`, `subject`, and `now` into this function. I'll fix the meaning here and leave the handler alone. `subject` is on the query type and nothing reads it. I won't invent the match rule until you give me the product note."

You can write the branch yourself. If you want the model to draft it, paste the test and this prompt **after** you have said the rule.

**Paste this**

```text
Write filterLessons so that status "upcoming" keeps rows whose status is "requested" or "confirmed" and whose scheduled_at is strictly after query.now. Any other status query stays an exact match on row.status. Ignore query.subject for now. Match the test "keeps future requested and confirmed lessons for view=upcoming". Do not edit the route handler or any component.
```

Read the diff. Reject a version that treats `upcoming` as a new `LessonStatus`, or that uses `>=` and would keep a lesson that starts at `now`. The test's past row is `2026-10-01`, and `now` is `2026-10-18T12:00:00.000Z`. Strictly after `now` is the rule.

A shape that matches the tests:

```ts
const UPCOMING: ReadonlySet<LessonStatus> = new Set(["requested", "confirmed"]);

export function filterLessons(
  rows: WireLesson[],
  query: { status?: string | null; subject?: string | null; now: Date },
): WireLesson[] {
  return rows.filter((row) => {
    if (query.status === "upcoming") {
      const start = new Date(row.scheduled_at);
      if (!UPCOMING.has(row.status) || start <= query.now) return false;
    } else if (query.status && row.status !== query.status) {
      return false;
    }

    return true;
  });
}
```

```bash
npm test -- lib/lessons.test.ts app/api/lessons/route.test.ts
```

> "The pure test and the route test go green together. The handler did not need a change. Exact status still passes, so `cancelled` did not collapse into the view."

## 35–45 The list ignores the next tutor

File: `components/LessonList.tsx`. Test: "reloads when tutorId changes."

> "The effect closes over `tutorId` and lists `[]` as dependencies. A rerender from tutor A to tutor B keeps A's request and never starts B's. Lint already names `tutorId` and `subject`. The red test is `tutorId`. I'll put that in the array. `subject` belongs there once the filter is real, otherwise the same bug comes back on the feature. The `cancelled` flag stays. It already stops a slow response for A from writing over B."

```tsx
  }, [tutorId]);
```

Do not rewrite this to `AbortController` in this pass. Say the flag and an abort controller are the same idea, and the flag is the smaller edit.

```bash
npm test -- components/LessonList.test.tsx
```

The reload test goes green. The two time tests stay red. That is the next beat.

> "One fetch for A, a second for B, and the last URL contains `tutor_b`. The confirmed lesson is still missing. That's a different bug."

Optional, if you want the rep of an explain-only prompt. You already know the answer, so skip it when the clock is tight.

**Paste this**

```text
Explain why LessonList still requests tutor A after tutorId changes. Cite the lines. Do not edit.
```

## 45–60 The confirmed lesson never appears

Same file, plus `lib/lessons.ts`. Tests:

- renders the local time of a confirmed lesson (`timeZone="UTC"`, text `/16:00/`)
- renders that instant in the learner time zone (`Europe/Madrid`, text `/17:00/`)

The payload in the test is:

```ts
scheduled_at: "2026-11-02T16:00:00.000Z"
status: "confirmed"
```

The component types that JSON as `Lesson` and then drops any row whose status is not `"scheduled"`. `"scheduled"` is not a status in this system. Typecheck already says the comparison has no overlap. Even if you removed the filter, `scheduledAt` would be undefined because the wire field is `scheduled_at`, and `slice(11, 16)` would still ignore `timeZone`. Madrid in November is UTC+1, so 16:00 UTC is 17:00. A slice of the ISO string stays 16:00 and leaves the second test red.

> "Two bugs are stacked. The component drops `confirmed` because it looks for `scheduled`, which is not a status here. And it reads `scheduledAt` while the API sends `scheduled_at`. The server already decided `upcoming`. The list should render what it was given. I'll map at the boundary and format with the `timeZone` prop. `slice` would satisfy the UTC test and fail Madrid."

Write `toLesson` and `formatLessonTime` in `lib/lessons.ts` yourself. They are short. If you want a draft of the mapper only:

**Paste this**

```text
Write a pure function toLesson(wire: WireLesson): Lesson that maps tutor_id, student_id, and scheduled_at onto tutorId, studentId, and scheduledAt. Copy id, subject, and status. No fetch. Do not edit the component.
```

Reject a mapper that renames `status: "confirmed"` to `"scheduled"`.

```ts
export function toLesson(wire: WireLesson): Lesson {
  return {
    id: wire.id,
    tutorId: wire.tutor_id,
    studentId: wire.student_id,
    subject: wire.subject,
    scheduledAt: wire.scheduled_at,
    status: wire.status,
  };
}

export function formatLessonTime(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(new Date(iso));
}
```

`en-GB` with `hourCycle: "h23"` is what makes the test's `/16:00/` and `/17:00/` stable. The Madrid instant is 2 November 2026, which is CET, so the offset is one hour. Say that you checked the date, not "today."

Then change `LessonList` only as far as the red tests require. Keep the subject input as local state for this beat.

```tsx
"use client";

import { useEffect, useState } from "react";
import { formatLessonTime, toLesson, type Lesson, type WireLesson } from "@/lib/lessons";

export function LessonList({
  tutorId,
  timeZone = "UTC",
}: {
  tutorId: string;
  timeZone?: string;
}) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [subject, setSubject] = useState("");

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ tutorId, status: "upcoming" });
    if (subject) params.set("subject", subject);
    fetch(`/api/lessons?${params.toString()}`)
      .then((response) => response.json())
      .then((body: { lessons: WireLesson[] }) => {
        if (!cancelled) setLessons(body.lessons.map(toLesson));
      });
    return () => {
      cancelled = true;
    };
  }, [tutorId]);

  return (
    <section aria-labelledby="upcoming-heading">
      <label className="field" htmlFor="subject">
        Subject
        <input
          id="subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        />
      </label>
      <ul className="lessons">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            {lesson.subject} {formatLessonTime(lesson.scheduledAt, timeZone)}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

> "I removed the client-side status filter. `upcoming` is the server's job now. The JSON is `WireLesson`, and `toLesson` is the only place that knows both shapes."

```bash
npm test
```

> "The suite is green, and typecheck is clean. The `scheduled` comparison was the type error. The subject box still doesn't refetch, and it won't survive a refresh. I'm ready for the product note."

Reload `/tutors/tutor_a`. You should see English and Spanish upcoming rows in Madrid time, and you should not see the cancelled or past lesson. The button stays disabled until the policy is checked.

## 60–75 Subject filter

The note:

> Learners should filter upcoming lessons by subject. The lessons endpoint already accepts `subject`. The filter should still be there if they refresh the page.

Ask before you code. If the interviewer says "you decide," decide out loud and invite a correction.

> "Four gaps before I write this. Is it one subject or several? Is the match exact, and is case significant? What should the empty state say? And does upcoming still include lessons the tutor has not confirmed? I already have a test that treats future requested and confirmed as upcoming. I'll keep that unless you want it narrower."

Then, after they shrug or agree:

> "Then I'll decide and flag it. One subject. Trimmed, case-insensitive, exact match, so `english` matches `English` and `Spanish` does not match `Spanish literature`. Empty copy is `No upcoming English lessons`, or `No upcoming lessons` when the box is blank. Requested stays in the view. The page URL holds `subject`, and the input reads that. Refresh restores it. I'll trim when I query and when I compare. I won't trim inside `onChange`, because then a subject with two words loses the space before the second word is typed."

### Test first

Add this to `lib/lessons.test.ts` before you touch the filter. Run it and show that it fails.

```ts
it("filters upcoming lessons by subject, ignoring case and surrounding space", () => {
  const rows = [
    row("a", "requested", "2026-10-19T12:00:00.000Z", "English"),
    row("b", "confirmed", "2026-10-20T12:00:00.000Z", "Spanish"),
  ];

  expect(
    filterLessons(rows, { status: "upcoming", subject: " english ", now }).map(
      (lesson) => lesson.id,
    ),
  ).toEqual(["a"]);
});
```

> "This fails because `subject` is still ignored. That's the behavior I want the function to grow."

Replace `filterLessons` with the same status rule plus the subject clause:

```ts
export function filterLessons(
  rows: WireLesson[],
  query: { status?: string | null; subject?: string | null; now: Date },
): WireLesson[] {
  const subject = query.subject?.trim().toLowerCase() ?? "";

  return rows.filter((row) => {
    if (query.status === "upcoming") {
      const start = new Date(row.scheduled_at);
      if (!UPCOMING.has(row.status) || start <= query.now) return false;
    } else if (query.status && row.status !== query.status) {
      return false;
    }

    if (subject && row.subject.trim().toLowerCase() !== subject) return false;
    return true;
  });
}
```

```bash
npm test -- lib/lessons.test.ts
```

A prompt is reasonable here if you would rather the model fill the function you have already specified. Paste the new test with the prompt.

**Paste this**

```text
Update filterLessons so query.subject is a trimmed, case-insensitive, exact match on row.subject. Keep the upcoming rule and the exact-status rule. Match the new subject test. Do not touch components or the route.
```

Reject a `includes` match, a case-sensitive match, or a change to the route.

### The list takes `subject` from outside

Add a component test that fails against today's props, then change the component to match it. In `components/LessonList.test.tsx`:

```tsx
it("refetches when the subject changes", async () => {
  const fetchMock = stubLessons([]);
  const { rerender } = render(<LessonList tutorId="tutor_a" subject="" />);

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  rerender(<LessonList tutorId="tutor_a" subject="English" />);

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  expect(String(fetchMock.mock.calls.at(-1)?.[0])).toContain("subject=English");
});

it("names the subject when nothing upcoming matches", async () => {
  stubLessons([]);
  render(<LessonList tutorId="tutor_a" subject="English" />);

  expect(await screen.findByText("No upcoming English lessons")).toBeInTheDocument();
});
```

> "The list should not own a second copy of the subject. The URL is the source. I'll pass `subject` in and put it in the effect dependencies, next to `tutorId`."

```tsx
"use client";

import { useEffect, useState } from "react";
import { formatLessonTime, toLesson, type Lesson, type WireLesson } from "@/lib/lessons";

export function LessonList({
  tutorId,
  subject = "",
  onSubjectChange,
  timeZone = "UTC",
}: {
  tutorId: string;
  subject?: string;
  onSubjectChange?: (next: string) => void;
  timeZone?: string;
}) {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ tutorId, status: "upcoming" });
    const trimmed = subject.trim();
    if (trimmed) params.set("subject", trimmed);

    fetch(`/api/lessons?${params.toString()}`)
      .then((response) => response.json())
      .then((body: { lessons: WireLesson[] }) => {
        if (!cancelled) setLessons(body.lessons.map(toLesson));
      });

    return () => {
      cancelled = true;
    };
  }, [tutorId, subject]);

  return (
    <section aria-labelledby="upcoming-heading">
      <label className="field" htmlFor="subject">
        Subject
        <input
          id="subject"
          value={subject}
          onChange={(event) => onSubjectChange?.(event.target.value)}
        />
      </label>
      {lessons.length === 0 ? (
        <p className="empty" aria-live="polite">
          {subject.trim() ? `No upcoming ${subject.trim()} lessons` : "No upcoming lessons"}
        </p>
      ) : (
        <ul className="lessons">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              {lesson.subject} {formatLessonTime(lesson.scheduledAt, timeZone)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

> "`aria-live` is one attribute. When the list goes from rows to the empty sentence, a screen reader hears it. I won't add a debounce in this pass. The list is short. If this became search-as-you-type over a large catalog, I would debounce, and I'll say that in the ship conversation."

### The URL is the state

`TutorPanel` is still a server component. `useSearchParams` and `useRouter` need a client component. The page already wraps the panel in Suspense, which is what `useSearchParams` needs on this Next version. Add `"use client"` to `TutorPanel` and read the query there.

> "I'll write the raw input into the query string, including a trailing space while they type. The fetch and the filter trim. The header stays outside Suspense, so I won't add a second boundary unless the build complains."

```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LessonList } from "@/components/LessonList";
import { RequestForm } from "@/components/RequestForm";

export function TutorPanel({
  tutorId,
  tutorName,
  languages,
  timeZone,
}: {
  tutorId: string;
  tutorName: string;
  languages: string;
  timeZone: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const subject = searchParams.get("subject") ?? "";
  const otherId = tutorId === "tutor_a" ? "tutor_b" : "tutor_a";
  const otherName = tutorId === "tutor_a" ? "Marco Bianchi" : "Ana Ruiz";

  function onSubjectChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("subject", next);
    else params.delete("subject");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <main className="shell">
      <p className="eyebrow">Tutor</p>
      <div className="title-row">
        <h1>{tutorName}</h1>
        <Link href={`/tutors/${otherId}`}>Open {otherName}</Link>
      </div>
      <p className="lede">
        {languages}. Times shown in {timeZone}.
      </p>

      <section className="card" aria-labelledby="request-heading">
        <h2 id="request-heading">Request a lesson</h2>
        <RequestForm slotId="slot_thu_16" />
      </section>

      <section className="card">
        <h2 id="upcoming-heading">Upcoming lessons</h2>
        <LessonList
          tutorId={tutorId}
          timeZone={timeZone}
          subject={subject}
          onSubjectChange={onSubjectChange}
        />
      </section>
    </main>
  );
}
```

```bash
npm test
```

Then in the browser: type `english` on Ana's page, confirm only English rows remain, refresh, confirm the box and the rows are still filtered. Clear the box and confirm Spanish returns. Open Marco and confirm you do not still see Ana's rows.

> "Refresh keeps `subject` because it lives in the URL, not in a second `useState`. The route did not change. It was already forwarding the query param."

## 75–90 Ship

Stop coding unless a test is red. Point at the screen you just built.

> "Five things before I would let learners use this."

> "The contract. `toLesson` is the only mapper from the API body to the UI type. Components never read `scheduled_at`. I would keep that as an allow-list so a new wire field does not leak into the view by accident."

> "The booking race. The disabled button is not the lock. This form does not even `POST` yet. I would add `POST /api/lesson-requests` with an idempotency key, return 409 when the slot is taken, and refetch slots on that status. A double click or two learners on the same Thursday 16:00 have to lose on the server."

> "Time and language. The list now formats Europe/Madrid, and the slot line on the form is still a hardcoded 'Thursday · 16:00'. I would show the learner's clock and the tutor's clock on the row, and I would translate the subject labels. Empty, error, and loading are three different states. Today a failed fetch fails silently. I would surface that in the same live region as the empty copy."

> "The interaction. This list is a handful of rows, so I would not virtualize it. The subject box refetches on each keystroke. That is fine here. If the catalog grew, I would debounce, the way a large country list and a search box need. I would measure the input delay on this form before I did either."

> "How I would know. A client timing on submit, a server log on 409, and a flag around the filter if the copy is an experiment, deleted after we read it. I already have component tests for the button rule, the upcoming view, and the subject refetch. I would add one end-to-end probe later for the real journey: open a tutor, filter a subject, request a slot. I would not build a large end-to-end suite for this screen. Preply has written that hundreds of those stopped scaling, and the weight moves to component tests. The checkbox has a visible label, the button's name is 'Request lesson', and the empty sentence is in a live region. I would match the design-system bar that fails the build on accessibility findings, not invent a new one."

If they ask how you use a model on UI work, then and only then:

> "On a design-system sprint I let the model draft components, and a person owned the review bar: API shape, accessibility, theming. Same rule on a smaller product: security, edge cases, and consistency stayed with me. The model can rewrite a call. It cannot prove the screen is still right. I still look."

## Prompts worth keeping

Use these only after you have said the rule in your own words.

**Explain, do not edit**

```text
Explain why LessonList still shows tutor A's lessons after tutorId changes. Cite the lines. Do not edit.
```

```text
Explain why a confirmed lesson with scheduled_at never renders in LessonList. Cite the type error and the fields the component reads. Do not edit.
```

**One pure function**

```text
Write a pure function filterLessons(rows, query) that treats status "upcoming" as requested or confirmed, with scheduled_at strictly after query.now. Other statuses are exact matches. Subject is a trimmed case-insensitive exact match. Match the tests in lib/lessons.test.ts. Do not touch the component.
```

```text
Map this wire type onto this Lesson type. One function, toLesson. No fetch. Do not edit the component.
```

**A test, after you have named the behavior**

```text
Write a Vitest + Testing Library test that rerenders LessonList with a new subject and expects a second fetch whose URL contains subject=English. Use the fetch stub style already in LessonList.test.tsx. Do not change production code.
```

## Reject these

- "Fix the failing tests."
- "Implement the feature in the codebase."
- A rewrite of `LessonList` that adds a data library.
- A debounce you did not ask for.
- A status `"scheduled"`.
- A `subject` match that uses `includes`.
- Trimming inside `onChange`, which makes a two-word subject untypable.
- Replacing the `cancelled` flag with new infrastructure during the bug beat.
- Any diff you cannot explain line by line. Say "I'm going to skip that part" and type the line yourself.

## If you are behind at 70

> "The suite is still red on the time zone test. I'll keep fixing that. The ship conversation can be shorter, and I can name the five production points in one minute each once this assertion is green."

Do not open a new abstraction to catch up. The next green test is worth more than a diagram.

## Lines that score

- "The test name is the rule. I'll read the implementation before I prompt."
- "This is the smallest edit that makes that assertion true."
- "I'll run this file, then tell you what the next failure means."
- "I'll decide and flag it."
- "The button is not the lock."
- "I can explain this diff. I'm rejecting the rest."

# Lesson desk

You are pairing with me for 90 minutes. The product is a small slice of a language-learning marketplace. A learner opens a tutor, requests one lesson, and looks at what is already on the calendar.

I am a peer in this room. Think out loud. I would rather hear a partial explanation than watch a silent green suite.

## How we will spend the time

1. **The suite is red.** Get it green, one failure at a time. The test names are the spec.
2. **Then I will hand you a short product note.** It is thin on purpose. Ask me about the gaps before you fill them.
3. **We will stop coding and talk about shipping.** What would you still do before real learners use this?

If the suite is still red near the end, say so and keep fixing. A green suite with no narration is a weaker session than an explained partial.

## How to work

- Narrate what you are looking at before you change it, and before you prompt.
- The AI assistant in the editor is allowed. You decide what to ask it. Read every suggestion, reject what you cannot explain, and run the tests again.
- Prefer the smallest change that makes the current failure honest.
- Run the file you are in, then the whole suite when that file is green.

Prompts that skip the job sound like "fix the failing tests" or "implement the feature." I will stop you if the model starts owning the design.

## Run it

```bash
npm test
npm run dev
```

The home page lists two tutors. Ana Ruiz is `/tutors/tutor_a`. Marco Bianchi is `/tutors/tutor_b`.

`npm run lint` and `npx tsc --noEmit` both have something to say. Read those messages. They are clues, and they are not the whole bug list.

## What is in the tree

```text
app/page.tsx                         tutor index
app/tutors/[tutorId]/page.tsx        server page, awaits params inside Suspense
app/tutors/[tutorId]/TutorPanel.tsx  composes the request form and the list
app/api/lessons/route.ts             GET /api/lessons
lib/lessons.ts                       wire type, UI type, filterLessons
lib/db.ts                            in-memory lessons for the running app
lib/tutors.ts                        Ana and Marco
components/RequestForm.tsx
components/LessonList.tsx
components/RequestForm.test.tsx
components/LessonList.test.tsx
lib/lessons.test.ts
app/api/lessons/route.test.ts
```

This Next.js version treats `params` as a promise, and Cache Components wants that read under Suspense. The page already does that. You should not need to restructure it to go green.

The lessons endpoint reads `tutorId`, `status`, and `subject` from the query string. The UI asks for `status=upcoming`.

## What the suite is checking

Run it and read the names. In short, the tests care about:

- when **Request lesson** is disabled, and when it is enabled
- the list loading again when the tutor changes
- a confirmed lesson showing a local time, including a learner zone that is not UTC
- `status=upcoming` meaning future lessons the learner is still expecting, on the pure function and on `GET /api/lessons`

Two tests already pass. They are there so a fix does not erase a rule that was already true.

## After the suite is green

Hand the candidate the note below only once the failures are explained. If you are rehearsing alone, do not read it until then.

---

### Product note

> Learners should filter upcoming lessons by subject. The lessons endpoint already accepts `subject`. The filter should still be there if they refresh the page.

Ask about anything this note does not say. Then implement the smallest version, and add a test that would have failed before your change.

## Before we stop

I will ask what you would still add before learners depend on this. Have in mind the contract between the API and the screen, what happens when two learners want the same slot, time zones, how the interaction feels if the list grows, and how you would know the change worked in production.

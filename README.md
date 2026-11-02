# Lesson desk

A Next.js App Router slice for a 90-minute AI-assisted coding session. Learners open a tutor, request a lesson, and review upcoming lessons.

The app starts with a red suite. That is the exercise.

| Doc | Who it is for |
| --- | --- |
| [EXERCISE.md](./EXERCISE.md) | The brief an interviewer hands you. Start here. |
| [MOCK-INTERVIEW.md](./MOCK-INTERVIEW.md) | The spoken walkthrough and the prompts. Open it after a timed pass, or use it as a script. |

## Run

```bash
npm install
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then a tutor such as `/tutors/tutor_a`.

`npm test` exits with failures on a fresh checkout. Two tests already pass. They guard behavior that should stay true while you fix the rest.

`npm run lint` warns on one effect. `npx tsc --noEmit` reports one error in `components/LessonList.tsx`. Both are part of the exercise.

## Stack

Next.js 16 (App Router, Cache Components), React 19, TypeScript, Vitest 3, React Testing Library. Vitest is pinned to 3 so the suite runs on Node 21 as well as current LTS.

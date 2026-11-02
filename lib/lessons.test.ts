import { expect, it } from "vitest";
import { filterLessons, type WireLesson } from "./lessons";

const now = new Date("2026-10-18T12:00:00.000Z");

function row(
  id: string,
  status: WireLesson["status"],
  scheduled_at: string,
  subject = "English",
): WireLesson {
  return {
    id,
    status,
    scheduled_at,
    tutor_id: "tutor_a",
    student_id: "stu_1",
    subject,
  };
}

it("keeps future requested and confirmed lessons for view=upcoming", () => {
  const rows = [
    row("a", "requested", "2026-10-19T12:00:00.000Z"),
    row("b", "confirmed", "2026-10-20T12:00:00.000Z"),
    row("c", "cancelled", "2026-10-21T12:00:00.000Z"),
    row("d", "confirmed", "2026-10-01T12:00:00.000Z"),
  ];

  expect(filterLessons(rows, { status: "upcoming", now }).map((lesson) => lesson.id)).toEqual([
    "a",
    "b",
  ]);
});

it("still filters an exact status", () => {
  const rows = [
    row("a", "cancelled", "2026-10-21T12:00:00.000Z"),
    row("b", "confirmed", "2026-10-20T12:00:00.000Z"),
  ];

  expect(filterLessons(rows, { status: "cancelled", now }).map((lesson) => lesson.id)).toEqual([
    "a",
  ]);
});

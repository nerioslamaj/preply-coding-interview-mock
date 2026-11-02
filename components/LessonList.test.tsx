import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LessonList } from "./LessonList";

afterEach(() => {
  vi.unstubAllGlobals();
});

const confirmedLesson = {
  id: "les_1",
  tutor_id: "tutor_a",
  student_id: "stu_1",
  subject: "English",
  scheduled_at: "2026-11-02T16:00:00.000Z",
  status: "confirmed",
};

function stubLessons(lessons: unknown[]) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ lessons }),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

it("reloads when tutorId changes", async () => {
  const fetchMock = stubLessons([]);
  const { rerender } = render(<LessonList tutorId="tutor_a" />);

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  rerender(<LessonList tutorId="tutor_b" />);

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  expect(String(fetchMock.mock.calls.at(-1)?.[0])).toContain("tutor_b");
});

it("renders the local time of a confirmed lesson", async () => {
  stubLessons([confirmedLesson]);
  render(<LessonList tutorId="tutor_a" timeZone="UTC" />);

  expect(await screen.findByText(/16:00/)).toBeInTheDocument();
});

it("renders that instant in the learner time zone", async () => {
  stubLessons([confirmedLesson]);
  render(<LessonList tutorId="tutor_a" timeZone="Europe/Madrid" />);

  expect(await screen.findByText(/17:00/)).toBeInTheDocument();
});

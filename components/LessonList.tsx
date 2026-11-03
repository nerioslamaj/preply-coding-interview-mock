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

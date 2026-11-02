"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@/lib/lessons";

export function LessonList({
  tutorId,
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
      .then((body: { lessons: Lesson[] }) => {
        if (!cancelled) setLessons(body.lessons);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = lessons.filter((lesson) => lesson.status === "scheduled");

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
        {visible.map((lesson) => (
          <li key={lesson.id}>
            {lesson.subject} {lesson.scheduledAt?.slice(11, 16)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export type LessonStatus = "requested" | "confirmed" | "cancelled" | "completed";

export type WireLesson = {
  id: string;
  tutor_id: string;
  student_id: string;
  subject: string;
  scheduled_at: string;
  status: LessonStatus;
};

export type Lesson = {
  id: string;
  tutorId: string;
  studentId: string;
  subject: string;
  scheduledAt: string;
  status: LessonStatus;
};

const UPCOMING: ReadonlySet<LessonStatus> = new Set(["requested", "confirmed"]);

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

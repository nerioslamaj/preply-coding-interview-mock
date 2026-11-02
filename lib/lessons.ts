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

export function filterLessons(
  rows: WireLesson[],
  query: { status?: string | null; subject?: string | null; now: Date },
): WireLesson[] {
  return rows.filter((row) => {
    if (query.status && row.status !== query.status) return false;
    return true;
  });
}

import type { WireLesson } from "./lessons";

function atHourOffset(daysFromToday: number, hourUtc: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  date.setUTCHours(hourUtc, 0, 0, 0);
  return date.toISOString();
}

export const db: WireLesson[] = [
  {
    id: "les_en_requested",
    tutor_id: "tutor_a",
    student_id: "stu_1",
    subject: "English",
    scheduled_at: atHourOffset(1, 16),
    status: "requested",
  },
  {
    id: "les_en_confirmed",
    tutor_id: "tutor_a",
    student_id: "stu_1",
    subject: "English",
    scheduled_at: atHourOffset(2, 16),
    status: "confirmed",
  },
  {
    id: "les_es_confirmed",
    tutor_id: "tutor_a",
    student_id: "stu_1",
    subject: "Spanish",
    scheduled_at: atHourOffset(3, 16),
    status: "confirmed",
  },
  {
    id: "les_en_cancelled",
    tutor_id: "tutor_a",
    student_id: "stu_1",
    subject: "English",
    scheduled_at: atHourOffset(4, 16),
    status: "cancelled",
  },
  {
    id: "les_en_past",
    tutor_id: "tutor_a",
    student_id: "stu_1",
    subject: "English",
    scheduled_at: atHourOffset(-10, 16),
    status: "confirmed",
  },
  {
    id: "les_it_confirmed",
    tutor_id: "tutor_b",
    student_id: "stu_1",
    subject: "Italian",
    scheduled_at: atHourOffset(2, 18),
    status: "confirmed",
  },
];

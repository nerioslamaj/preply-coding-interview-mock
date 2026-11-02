import { db } from "@/lib/db";
import { filterLessons } from "@/lib/lessons";

export function GET(request: Request) {
  const url = new URL(request.url);
  const tutorId = url.searchParams.get("tutorId");
  const rows = db.filter((row) => !tutorId || row.tutor_id === tutorId);
  const lessons = filterLessons(rows, {
    status: url.searchParams.get("status"),
    subject: url.searchParams.get("subject"),
    now: new Date(),
  });

  return Response.json({ lessons });
}

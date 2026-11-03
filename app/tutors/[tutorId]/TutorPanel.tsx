"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LessonList } from "@/components/LessonList";
import { RequestForm } from "@/components/RequestForm";

export function TutorPanel({
  tutorId,
  tutorName,
  languages,
  timeZone,
}: {
  tutorId: string;
  tutorName: string;
  languages: string;
  timeZone: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const subject = searchParams.get("subject") ?? "";
  const otherId = tutorId === "tutor_a" ? "tutor_b" : "tutor_a";
  const otherName = tutorId === "tutor_a" ? "Marco Bianchi" : "Ana Ruiz";

  function onSubjectChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("subject", next);
    else params.delete("subject");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <main className="shell">
      <p className="eyebrow">Tutor</p>
      <div className="title-row">
        <h1>{tutorName}</h1>
        <Link href={`/tutors/${otherId}`}>Open {otherName}</Link>
      </div>
      <p className="lede">
        {languages}. Times shown in {timeZone}.
      </p>

      <section className="card" aria-labelledby="request-heading">
        <h2 id="request-heading">Request a lesson</h2>
        <RequestForm slotId="slot_thu_16" />
      </section>

      <section className="card">
        <h2 id="upcoming-heading">Upcoming lessons</h2>
        <LessonList
          tutorId={tutorId}
          timeZone={timeZone}
          subject={subject}
          onSubjectChange={onSubjectChange}
        />
      </section>
    </main>
  );
}

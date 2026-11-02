import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { findTutor } from "@/lib/tutors";
import { TutorPanel } from "./TutorPanel";

const LEARNER_TIME_ZONE = "Europe/Madrid";

export default function TutorPage({
  params,
}: {
  params: Promise<{ tutorId: string }>;
}) {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<p className="shell status">Loading tutor…</p>}>
        {params.then(({ tutorId }) => {
          const tutor = findTutor(tutorId);
          return (
            <TutorPanel
              tutorId={tutor.id}
              tutorName={tutor.name}
              languages={tutor.languages}
              timeZone={LEARNER_TIME_ZONE}
            />
          );
        })}
      </Suspense>
    </>
  );
}

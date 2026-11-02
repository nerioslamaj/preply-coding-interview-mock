import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { tutors } from "@/lib/tutors";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="shell">
        <p className="eyebrow">Learners</p>
        <h1>Choose a tutor</h1>
        <p className="lede">
          Request a time, then review the lessons already on the calendar.
        </p>
        <ul className="tutor-list">
          {tutors.map((tutor) => (
            <li key={tutor.id}>
              <Link href={`/tutors/${tutor.id}`} className="tutor-card">
                <span className="tutor-name">{tutor.name}</span>
                <span className="muted">{tutor.languages}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

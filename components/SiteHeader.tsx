import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="topbar">
      <Link href="/" className="brand">
        Lesson desk
      </Link>
    </header>
  );
}

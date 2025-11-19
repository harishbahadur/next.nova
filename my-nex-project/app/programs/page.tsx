import Link from "next/link";

export default function ProgramsPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Programs</h1>
      <p>
        A starting point for exploring programs and universities in Japan.
        Replace this placeholder with program listings, filters, and links.
      </p>
      <p>
        <Link href="/">← Back to Home</Link>
      </p>
    </main>
  );
}

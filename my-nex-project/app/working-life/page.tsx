import Link from "next/link";

export default function WorkingLifePage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Working Life</h1>
      <p>
        Tips about work culture, internships, part-time student jobs, and
        transitioning from study to work in Japan.
      </p>
      <p>
        <Link href="/">← Back to Home</Link>
      </p>
    </main>
  );
}

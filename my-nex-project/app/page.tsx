"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { title: string; href: string; subtitle?: string; icon?: string }[]
  >([]);
  const [activeResult, setActiveResult] = useState(0);
  const [showSupportMenu, setShowSupportMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [helpTypes, setHelpTypes] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [contactMethods, setContactMethods] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  // Simple site-wide index
  const PREFECTURES = useMemo(
    () => [
      "Hokkaido",
      "Aomori",
      "Iwate",
      "Miyagi",
      "Akita",
      "Yamagata",
      "Fukushima",
      "Ibaraki",
      "Tochigi",
      "Gunma",
      "Saitama",
      "Chiba",
      "Tokyo",
      "Kanagawa",
      "Niigata",
      "Toyama",
      "Ishikawa",
      "Fukui",
      "Yamanashi",
      "Nagano",
      "Gifu",
      "Shizuoka",
      "Aichi",
      "Mie",
      "Shiga",
      "Kyoto",
      "Osaka",
      "Hyogo",
      "Nara",
      "Wakayama",
      "Tottori",
      "Shimane",
      "Okayama",
      "Hiroshima",
      "Yamaguchi",
      "Tokushima",
      "Kagawa",
      "Ehime",
      "Kochi",
      "Fukuoka",
      "Saga",
      "Nagasaki",
      "Kumamoto",
      "Oita",
      "Miyazaki",
      "Kagoshima",
      "Okinawa",
    ],
    []
  );

  const SITE_INDEX = useMemo(
    () => [
      {
        title: "Schools by Prefecture",
        href: "/school",
        subtitle: "Japanese Language Schools + Senmon",
        tags: [
          "school",
          "language school",
          "senmon",
          "prefecture",
          "okinawa",
          "tokyo",
          "osaka",
          "kyoto",
        ],
      },
      {
        title: "Student Life: Ceremony & Events",
        href: "/student-life",
        subtitle: "Entrance Ceremony, Tours, Farewell",
        tags: ["ceremony", "events", "tours", "farewell", "gallery"],
      },
      {
        title: "Housing Guide",
        href: "/housing-guide",
        subtitle: "Hostel, apartment, costs & tips",
        tags: ["housing", "hostel", "apartment", "room"],
      },
      {
        title: "Part-time Work",
        href: "/part-time-work",
        subtitle: "Jobs, student work guidance",
        tags: ["jobs", "work", "arubaito", "part time"],
      },
      {
        title: "Programs",
        href: "/programs",
        subtitle: "Courses and study options",
        tags: ["programs", "courses", "study"],
      },
      {
        title: "About Japan",
        href: "/about-japan",
        subtitle: "Overview & living in Japan",
        tags: ["japan", "culture", "guide"],
      },
      {
        title: "About Students",
        href: "/about-students",
        subtitle: "Student guidance & info",
        tags: ["students", "help", "orientation"],
      },
      {
        title: "Working Life",
        href: "/working-life",
        subtitle: "Life after studies",
        tags: ["work", "career"],
      },
      {
        title: "Application Letter (Vocational)",
        href: "/application",
        subtitle: "Generate motivation letter",
        tags: ["application", "vocational", "letter"],
      },
    ],
    []
  );

  const runSearch = useMemo(() => {
    return (q: string) => {
      const s = q.trim().toLowerCase();
      if (s.length < 2)
        return [] as {
          title: string;
          href: string;
          subtitle?: string;
          icon?: string;
        }[];

      const prefMatches = PREFECTURES.filter((p) =>
        p.toLowerCase().includes(s)
      ).slice(0, 6);

      const prefResults = prefMatches.map((p) => ({
        title: `Schools in ${p}`,
        href: `/school?pref=${encodeURIComponent(p)}`,
        subtitle: "Japanese Language + Senmon",
        icon: "🏫",
      }));

      const pageResults = SITE_INDEX.filter((item) => {
        const hay = [item.title, item.subtitle, ...(item as any).tags]
          .join(" ")
          .toLowerCase();
        return hay.includes(s);
      }).map((i) => ({ ...i, icon: "🔗" }));

      return [...prefResults, ...pageResults].slice(0, 12);
    };
  }, [PREFECTURES, SITE_INDEX]);

  useEffect(() => {
    setResults(runSearch(query));
    setActiveResult(0);
  }, [query, runSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const top = results[0];
    if (top) window.location.href = top.href;
  };

  const toggleCheckbox = (
    value: string,
    list: string[],
    setList: (next: string[]) => void
  ) => {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);
    if (!fullName.trim() || !email.trim()) {
      setSubmitResult("Please enter your full name and email.");
      return;
    }
    if (helpTypes.length === 0) {
      setSubmitResult("Select at least one help type.");
      return;
    }
    if (!message.trim()) {
      setSubmitResult("Please add some details in the message.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          studentId,
          schoolName,
          helpTypes,
          message,
          contactMethods,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitResult("Submitted successfully. We will contact you soon.");
      setFullName("");
      setEmail("");
      setPhone("");
      setStudentId("");
      setSchoolName("");
      setHelpTypes([]);
      setMessage("");
      setContactMethods([]);
    } catch (err) {
      setSubmitResult("Submission failed. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* 🌈 Header */}
      <header className={styles.header}>
        <div className={styles.logo}>Next Nova 🚀</div>
        <nav className={styles.nav}>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={styles.searchButton}
          >
            {showSearch ? "Close" : "Search"}
          </button>
        </nav>
      </header>

      {/* 🧭 Navigation Line (client-side routes) */}
      <nav className={styles.navLine}>
        <Link href="/" className={styles.navButton}>
          Home
        </Link>
        <Link href="/about-japan" className={styles.navButton}>
          About Japan
        </Link>
        <Link href="/about-students" className={styles.navButton}>
          About Students
        </Link>
        <Link href="/school" className={styles.navButton}>
          School
        </Link>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => setShowHelpModal(true)}
        >
          Support
        </button>
      </nav>

      {/* 🔍 Search bar */}
      {showSearch && (
        <div className={styles.searchWrapper}>
          <form onSubmit={handleSearch} className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search: Okinawa, Language school, Ceremony, Housing, Tokyo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveResult((i) =>
                    Math.min(i + 1, Math.max(results.length - 1, 0))
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveResult((i) => Math.max(i - 1, 0));
                } else if (e.key === "Enter") {
                  const item = results[activeResult];
                  if (item) {
                    e.preventDefault();
                    window.location.href = item.href;
                  }
                }
              }}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.goButton}>
              Search
            </button>
          </form>

          {query.trim().length >= 2 && (
            <div className={styles.searchPanel} role="listbox">
              {results.length === 0 && (
                <div className={styles.searchEmpty}>
                  No results. Try a different term.
                </div>
              )}
              {results.map((r, idx) => (
                <Link
                  key={`${r.href}-${idx}`}
                  href={r.href}
                  className={`${styles.searchItem} ${
                    idx === activeResult ? styles.searchItemActive : ""
                  }`}
                  onClick={() => setShowSearch(false)}
                >
                  <span className={styles.searchIconLeft}>
                    {r.icon || "🔎"}
                  </span>
                  <span className={styles.searchTexts}>
                    <span className={styles.searchTitle}>{r.title}</span>
                    {r.subtitle && (
                      <span className={styles.searchSubtitle}>
                        {r.subtitle}
                      </span>
                    )}
                    <span className={styles.searchPath}>{r.href}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ✨ Hero Section with background image */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            Welcome to <span>Next Nova</span>
          </h1>
          <p>Begin Student life and Support!</p>
          <button
            className={styles.button}
            onClick={() => setShowGetStarted(!showGetStarted)}
          >
            {showGetStarted ? "Hide Options" : "Get Started"}
          </button>
        </div>
      </section>

      {/* 🚀 Get Started Grid Section */}
      {showGetStarted && (
        <section className={styles.getStartedSection}>
          <div className={styles.boxGrid}>
            <Link href="/programs" className={styles.infoBox}>
              <h3>Explore Programs</h3>
              <p>Discover various universities and courses in Japan.</p>
            </Link>
            <Link href="/requirements" className={styles.infoBox}>
              <h3>Requirements</h3>
              <p>Learn what documents and qualifications you need.</p>
            </Link>
            <Link href="/application" className={styles.infoBox}>
              <h3>Application</h3>
              <p>Follow step-by-step instructions to apply easily.</p>
            </Link>
            <Link href="/scholarships" className={styles.infoBox}>
              <h3>Scholarships</h3>
              <p>Find financial support options for your studies.</p>
            </Link>
            <Link href="/visa" className={styles.infoBox}>
              <h3>Visa Information</h3>
              <p>
                Get details about student visa application process and
                requirements.
              </p>
            </Link>
            <Link href="/documents" className={styles.infoBox}>
              <h3>Documents</h3>
              <p>We will help you prepare all necessary documents.</p>
            </Link>
          </div>
        </section>
      )}

      {showHelpModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className={styles.supportCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setShowHelpModal(false)}
            >
              ✕
            </button>
            <h2>📄 Student Help Request Form</h2>
            <p>Fill out this form for guidance & support</p>
            <form onSubmit={handleSubmit} className={styles.supportForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +81 80-1234-5678"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Student ID (optional)</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="If applicable"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>School Name (optional)</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Your school or university"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Type of Help Needed (Select one or more)</label>
                <div className={styles.checkboxGroup}>
                  {[
                    "Housing / Hostel Guidance",
                    "Apartment Help",
                    "Part-Time Job Advice",
                    "Documents Processing Guidance",
                    "Language Support",
                  ].map((opt) => (
                    <label key={opt} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={helpTypes.includes(opt)}
                        onChange={() =>
                          toggleCheckbox(opt, helpTypes, setHelpTypes)
                        }
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Message / Details</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your situation..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Preferred Contact Method</label>
                <div className={styles.checkboxGroup}>
                  {[
                    "Email",
                    "Phone / WhatsApp / LINE",
                    "In-person (if applicable)",
                  ].map((opt) => (
                    <label key={opt} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={contactMethods.includes(opt)}
                        onChange={() =>
                          toggleCheckbox(opt, contactMethods, setContactMethods)
                        }
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {submitResult && (
                <div
                  className={
                    submitResult.includes("successfully")
                      ? styles.successMsg
                      : styles.errorMsg
                  }
                >
                  {submitResult}
                </div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "SUBMIT REQUEST"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

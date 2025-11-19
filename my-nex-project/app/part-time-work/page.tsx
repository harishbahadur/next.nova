"use client";

import Link from "next/link";
import styles from "./page.module.css";

const HELP_SECTIONS = [
  {
    id: "documentation",
    title: "Documents Processing",
    icon: "📄",
    items: [
      "Residence Card (在留カード) – Get at airport on arrival",
      "Address Registration – Register at City Hall",
      "My Number Card (マイナンバー) – Apply after address registration",
      "Student ID Card – Receive from your school",
      "SIM Card – Get a Japanese phone number",
      "Bank Account – Needed for salary payment",
      "Health Insurance Card (保険証) – Join National Health Insurance",
      "Passport – Keep valid for identification",
      "Resume (履歴書 / Rirekisho) – Simple Japanese resume",
      "Work Permission (資格外活動許可) – Required for part-time jobs",
    ],
  },
  {
    id: "interview",
    title: "Interview",
    icon: "💬",
    items: [
      "Arrive 10 minutes early",
      "Bring a resume (Rirekisho) with your photo",
      "Dress neatly and professionally",
      "Practice basic Japanese greetings",
      "Prepare self-introduction in Japanese",
      "Ask about work hours and responsibilities",
    ],
  },
  {
    id: "where",
    title: "Where You Can Work",
    icon: "🏪",
    items: [
      "Convenience stores (Konbini): 7-Eleven, Lawson, FamilyMart",
      "Restaurants ,ijakaya,macdonalds,ramen shops,drugstores",
      "Supermarkets: Cashier, stocking shelves",
      "Hotels: Front desk, housekeeping",
      "hokugan ,food packaging",
    ],
  },
  {
    id: "language",
    title: "Language Skill (N5 Starter)",
    icon: "🗣️",
    items: [
      "What to know: greetings, numbers 1–100, simple questions",
      "Basic workplace phrases: わかりました / ありがとうございます / お願いします",
      "Repeat request: もういちどお願いします (Please say again)",
      "Konbini & restaurant jobs teach step-by-step",
      "Factories / cleaning need very simple Japanese",
      "Managers often speak slowly for new students",
    ],
  },
];

export default function PartTimeWorkPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/about-students" className={styles.backLink}>
          ← Back to About Students
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>BASIC HELP FOR NEW STUDENTS</h1>
          <p className={styles.subtitle}>
            Documentation | Interview | Where You Can Work | Language Skill
          </p>
        </header>

        <div className={styles.sectionsGrid}>
          {HELP_SECTIONS.map((section) => (
            <div key={section.id} className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>{section.icon}</span>
                <h2 className={styles.cardTitle}>{section.title}</h2>
              </div>
              <ul className={styles.itemsList}>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.tipsBox}>
          <h3 className={styles.tipsTitle}>💡 Important Tips</h3>
          <ul className={styles.tipsList}>
            <li>
              <strong>Work Hour Limit:</strong> International students can work
              up to 28 hours per week during school terms, and up to 40 hours
              per week during school holidays.
            </li>
            <li>
              <strong>Apply Early:</strong> Popular part-time jobs fill quickly,
              especially near universities. Start looking 2-3 weeks before you
              need to start.
            </li>
            <li>
              <strong>Tax Withholding:</strong> Your employer will withhold tax
              from your salary. You can file for a tax refund if you earned less
              than ¥1,030,000 per year.
            </li>
            <li>
              <strong>Ask Your School:</strong> Many schools have job boards or
              partnerships with local businesses looking for student workers.
            </li>
          </ul>
        </div>

        <div className={styles.resourcesBox}>
          <h3 className={styles.resourcesTitle}>🔗 Helpful Job Search Sites</h3>
          <div className={styles.resourcesGrid}>
            <a
              href="https://townwork.net/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resourceLink}
            >
              TownWork
            </a>
            <a
              href="https://baito.mynavi.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resourceLink}
            >
              Mynavi Baito
            </a>
            <a
              href="https://www.baitoru.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resourceLink}
            >
              Baitoru
            </a>
            <a
              href="https://arbeit.inshokuten.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resourceLink}
            >
              Inshokuten
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

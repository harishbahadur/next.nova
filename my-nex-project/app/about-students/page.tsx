import Link from "next/link";
import styles from "./page.module.css";

export default function AboutStudentsPage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>Your Journey Starts Here</h1>
        <p className={styles.paragraph}>
          Welcome to your new adventure! We&apos;re here to help you navigate
          life as an international student in Japan. From finding the perfect
          apartment to joining exciting student clubs, we&apos;ve got you
          covered.
        </p>
        <div className={styles.featureGrid}>
          <Link href="/student-life" className={styles.feature}>
            <h3>Student Life 🎓</h3>
            <p>
              Campus activities, clubs, and cultural events to enrich your
              experience
            </p>
            <span className={styles.viewGallery}>View Photo Gallery →</span>
          </Link>
          <Link href="/housing-guide" className={styles.feature}>
            <h3>Housing Guide 🏠</h3>
            <p>
              Find comfortable and affordable accommodation near your campus
            </p>
            <span className={styles.viewGallery}>View Housing Guide →</span>
          </Link>
          <Link href="/part-time-work" className={styles.feature}>
            <h3>Part-Time Work 💼</h3>
            <p>
              Opportunities to gain experience while supporting your studies
            </p>
            <span className={styles.viewGallery}>View Guide →</span>
          </Link>
        </div>
        <p>
          <Link href="/" className={styles.backLink}>
            ← Return to Home
          </Link>
        </p>
      </div>
    </main>
  );
}

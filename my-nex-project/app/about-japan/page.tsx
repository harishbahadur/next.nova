"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function AboutJapanPage() {
  const [query, setQuery] = useState("");
  const [src, setSrc] = useState(
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5216548.957041809!2d132.180203!3d36.204823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000000000000000%3A0x2c1b8b21b6a6c0a3!2sJapan!5e0!3m2!1sen!2sjp!4v1695537780000!5m2!1sen!2sjp"
  );

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const url = `https://www.google.com/maps?q=${encodeURIComponent(
      q
    )}&output=embed`;
    setSrc(url);
  };

  return (
    <main className={styles.main}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.backLink}>
          ← Home
        </Link>
        <form onSubmit={onSearch} className={styles.searchRow}>
          <input
            type="text"
            placeholder="Search city or place..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Search
          </button>
        </form>
      </div>
      <div className={styles.mapWrapper}>
        <div className={styles.map}>
          <iframe
            src={src}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </main>
  );
}

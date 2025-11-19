"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const ICONS = [
  {
    id: "leopalace",
    title: "LeoPalace",
    icon: "🏡",
    link: "https://www.leopalace21.com/en/",
  },
  { id: "apartment", title: "Apartment", icon: "🏢" },
  { id: "hostel", title: "School Hostel", icon: "🏫" },
];

const LEOPALACE_FEATURES = [
  {
    icon: "🏠",
    title: "Fully Furnished",
    desc: "Bed, desk, fridge, washing machine included.",
  },
  {
    icon: "📶",
    title: "Free Wi-Fi",
    desc: "Fast internet connection in most rooms.",
  },
  {
    icon: "🔑",
    title: "Smart Security",
    desc: "Auto-lock doors, intercom & 24-hour support.",
  },
  {
    icon: "🧳",
    title: "Short- & Long-Term Stay",
    desc: "Choose monthly or yearly contracts.",
  },
  {
    icon: "🚉",
    title: "Near Stations",
    desc: "Most properties within walking distance to train stations.",
  },
  {
    icon: "🛠️",
    title: "Maintenance Support",
    desc: "Regular inspection and repair service available.",
  },
];

const APARTMENT_WEBSITES = [
  { name: "SUUMO", icon: "🟩", link: "https://suumo.jp/chintai/" },
  { name: "GooHome", icon: "🏢", link: "https://www.goo-net.com/realestate/" },
  { name: "LIXIL Homes", icon: "🟦", link: "https://www.homes.co.jp/" },
  { name: "LeoPalace", icon: "🏡", link: "https://www.leopalace21.com/en/" },
  { name: "Japanese Brokers (FUD)", icon: "🏘️", link: "#" },
];

const APARTMENT_STEPS = [
  "Choose Apartment",
  "Contact Agent",
  "Apply",
  "Submit Documents",
  "Pay Deposit",
  "Move In",
];

const REQUIRED_DOCS = [
  "🪪 Residence Card",
  "🧾 Passport Copy",
  "🎓 Student ID or Enrollment Certificate",
  "👤 Guarantor (if required)",
  "💰 First Month Rent + Deposit + Key Money",
];

const TIPS = [
  "Ask your school's international office for housing help.",
  "Some agents offer English support.",
  "Always visit the apartment before signing.",
  "Don't send money until contract is confirmed.",
];

const HOSTEL_FEATURES = [
  {
    icon: "⭐",
    title: "Fully Furnished",
    items: ["Bed", "Desk", "Fridge", "Washing Machine", "AC"],
  },
  {
    icon: "⭐",
    title: "Self-Cooking Allowed",
    items: ["Small kitchen", "Easy to save money"],
  },
  {
    icon: "⭐",
    title: "Bathroom & Ofuro",
    items: ["Clean shower", "Toilet", "Shared bath"],
  },
  {
    icon: "⭐",
    title: "School Support",
    items: ["Easy to contact staff anytime", "Help with room or documents"],
  },
  {
    icon: "⭐",
    title: "Safe Student Environment",
    items: ["Students from many countries", "Quiet & safe"],
  },
  {
    icon: "⭐",
    title: "Extra Facilities",
    items: ["Bicycle parking", "Wi-Fi", "Laundry"],
  },
];

export default function HousingRecommendedPage() {
  const [showLeoPalace, setShowLeoPalace] = useState(false);
  const [showApartment, setShowApartment] = useState(false);
  const [showHostel, setShowHostel] = useState(false);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/" className={styles.backHome}>
          ← Back to Home
        </Link>
        <header className={styles.header}>
          <h1 className={styles.title}>Students Housing</h1>
          <p className={styles.subtitle}>Recommended housing for students</p>
        </header>
        <div className={styles.iconRow}>
          {ICONS.map((it) => {
            const isLeoPalace = it.id === "leopalace";
            const isApartment = it.id === "apartment";
            const content = (
              <>
                <span className={styles.bigIcon}>{it.icon}</span>
                <span className={styles.iconLabel}>{it.title}</span>
              </>
            );

            if (isLeoPalace) {
              return (
                <button
                  key={it.id}
                  className={styles.iconBox}
                  onClick={() => setShowLeoPalace(!showLeoPalace)}
                  type="button"
                >
                  {content}
                </button>
              );
            }

            if (isApartment) {
              return (
                <button
                  key={it.id}
                  className={styles.iconBox}
                  onClick={() => setShowApartment(!showApartment)}
                  type="button"
                >
                  {content}
                </button>
              );
            }

            const isHostel = it.id === "hostel";
            if (isHostel) {
              return (
                <button
                  key={it.id}
                  className={styles.iconBox}
                  onClick={() => setShowHostel(!showHostel)}
                  type="button"
                >
                  {content}
                </button>
              );
            }

            return (
              <div key={it.id} className={styles.iconBox}>
                {content}
              </div>
            );
          })}
        </div>

        {showLeoPalace && (
          <section className={styles.leoPalaceSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>LeoPalace Features</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowLeoPalace(false)}
                type="button"
              >
                ✕
              </button>
            </div>

            <div className={styles.featuresGrid}>
              {LEOPALACE_FEATURES.map((feat) => (
                <div key={feat.title} className={styles.featureCard}>
                  <span className={styles.featureIcon}>{feat.icon}</span>
                  <h3 className={styles.featureTitle}>{feat.title}</h3>
                  <p className={styles.featureDesc}>{feat.desc}</p>
                </div>
              ))}
            </div>

            <div className={styles.howToFind}>
              <h3 className={styles.howToTitle}>🔍 How to Find LeoPalace</h3>
              <ol className={styles.stepsList}>
                <li>
                  Visit the official LeoPalace21 website:{" "}
                  <a
                    href="https://www.leopalace21.com/en/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.inlineLink}
                  >
                    leopalace21.com/en
                  </a>
                </li>
                <li>
                  Use the search tool to find properties near your school or
                  preferred area.
                </li>
                <li>Filter by price, room type, and available move-in date.</li>
                <li>
                  Contact the office via website or phone to schedule a viewing.
                </li>
                <li>
                  Prepare your passport, student visa, and school enrollment
                  proof for application.
                </li>
              </ol>
              <a
                href="https://www.leopalace21.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.visitButton}
              >
                Visit LeoPalace21 Website →
              </a>
            </div>
          </section>
        )}

        {showApartment && (
          <section className={styles.apartmentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                🌐 Famous Real Estate Websites
              </h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowApartment(false)}
                type="button"
              >
                ✕
              </button>
            </div>

            <div className={styles.websitesGrid}>
              {APARTMENT_WEBSITES.map((site) => (
                <a
                  key={site.name}
                  href={site.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.websiteCard}
                >
                  <span className={styles.websiteIcon}>{site.icon}</span>
                  <span className={styles.websiteName}>{site.name}</span>
                </a>
              ))}
            </div>

            <div className={styles.stepsSection}>
              <h3 className={styles.subsectionTitle}>
                📋 How to Rent an Apartment
              </h3>
              <div className={styles.stepsGrid}>
                {APARTMENT_STEPS.map((step, idx) => (
                  <div key={step} className={styles.stepCard}>
                    <span className={styles.stepNumber}>Step {idx + 1}</span>
                    <span className={styles.stepText}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.docsSection}>
              <h3 className={styles.subsectionTitle}>📄 Required Documents</h3>
              <ul className={styles.docsList}>
                {REQUIRED_DOCS.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </div>

            <div className={styles.tipsSection}>
              <h3 className={styles.subsectionTitle}>ℹ️ Useful Tips</h3>
              <ul className={styles.tipsList}>
                {TIPS.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {showHostel && (
          <section className={styles.hostelSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🏫 School Hostel</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowHostel(false)}
                type="button"
              >
                ✕
              </button>
            </div>

            <p className={styles.hostelSubtitle}>
              Simple & Comfortable Living for Students
            </p>

            <div className={styles.featuresListGrid}>
              {HOSTEL_FEATURES.map((feat) => (
                <div key={feat.title} className={styles.featureBox}>
                  <div className={styles.featureBoxHeader}>
                    <span className={styles.featureBoxIcon}>{feat.icon}</span>
                    <h3 className={styles.featureBoxTitle}>{feat.title}</h3>
                  </div>
                  <ul className={styles.featureItems}>
                    {feat.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className={styles.hostelBestNote}>
              <p className={styles.bestNoteText}>
                ✔ Best option for new students in Japan
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

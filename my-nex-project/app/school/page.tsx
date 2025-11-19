"use client";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";

type School = { name: string; city?: string; website?: string };
type PrefectureData = {
  languageSchools: School[];
  senmonSchools: School[];
};

// All Japan prefectures (for search/data)
const ALL_PREFECTURES = [
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
] as const;

// Main prefectures to display as buttons (only the ones you need)
const DISPLAYED_PREFECTURES = [
  "Hokkaido",
  "Tokyo",
  "Kanagawa",
  "Aichi",
  "Osaka",
  "Kyoto",
  "Hiroshima",
  "Fukuoka",
  "Okinawa",
] as const;

const SCHOOLS: Partial<
  Record<(typeof ALL_PREFECTURES)[number], PrefectureData>
> = {
  Tokyo: {
    languageSchools: [
      {
        name: "KAI Japanese Language School",
        city: "Shinjuku",
        website: "https://www.kaij.jp",
      },
      {
        name: "Shinjuku Japanese Language Institute",
        city: "Shinjuku",
        website: "https://www.sji.ac.jp",
      },
    ],
    senmonSchools: [
      {
        name: "Tokyo Design Technology Center",
        city: "Shibuya",
        website: "https://www.tech.ac.jp",
      },
      { name: "Tokyo College of Communication", city: "Nakano" },
    ],
  },
  Osaka: {
    languageSchools: [
      { name: "Osaka Japanese Language Education Center", city: "Tennoji" },
      { name: "YMCA Osaka Japanese School", city: "Kita" },
    ],
    senmonSchools: [
      { name: "ECC College of Computer & Multimedia", city: "Kita" },
      {
        name: "Osaka Mode Gakuen (Fashion)",
        city: "Umeda",
        website: "https://www.mode.ac.jp/osaka",
      },
    ],
  },
  Kyoto: {
    languageSchools: [
      { name: "Kyoto Institute of Culture and Language", city: "Sakyo" },
    ],
    senmonSchools: [{ name: "Kyoto Computer Gakuin", city: "Fushimi" }],
  },
  Hokkaido: {
    languageSchools: [
      { name: "Hokkaido Japanese Language Academy", city: "Sapporo" },
    ],
    senmonSchools: [{ name: "Sapporo College of Technology", city: "Sapporo" }],
  },
  Fukuoka: {
    languageSchools: [
      { name: "Fukuoka Foreign Language College – JLS", city: "Hakata" },
    ],
    senmonSchools: [
      {
        name: "Fukuoka Institute of Technology (Specialized)",
        city: "Fukuoka",
      },
    ],
  },
  Aichi: {
    languageSchools: [{ name: "Nagoya International Academy", city: "Nagoya" }],
    senmonSchools: [{ name: "Nagoya College of Design", city: "Nagoya" }],
  },
  Kanagawa: {
    languageSchools: [
      { name: "Yokohama International Education Academy", city: "Yokohama" },
    ],
    senmonSchools: [
      { name: "Yokohama Digital Arts College", city: "Yokohama" },
    ],
  },
  Hiroshima: {
    languageSchools: [{ name: "Hiroshima YMCA JLS", city: "Naka" }],
    senmonSchools: [
      { name: "Hiroshima Visual Arts College", city: "Hiroshima" },
    ],
  },
  Okinawa: {
    languageSchools: [
      {
        name: "JSL日本アカデミー (JSL Nihon Academy)",
        city: "Naha",
        website: "https://www.jsl-academy.com",
      },
      {
        name: "沖縄国際言語学院 (Okinawa International Language School)",
        city: "Naha",
      },
      { name: "那覇日本語学校 (Naha Japanese Language School)", city: "Naha" },
      {
        name: "琉球インターナショナル (Ryukyu International)",
        city: "Ginowan",
      },
      { name: "沖縄中央学園 (Okinawa Chuo Gakuen)", city: "Urasoe" },
      { name: "サエル学院 (Saeru Gakuin)", city: "Naha" },
    ],
    senmonSchools: [
      {
        name: "専門学校ITカレッジ沖縄 (IT College Okinawa)",
        city: "Naha",
      },
      {
        name: "沖縄情報経理専門学校 (Okinawa Computer & Accounting College)",
        city: "Naha",
      },
      {
        name: "専門学校 那覇日経ビジネス (Naha Nikkei Business College)",
        city: "Naha",
      },
      {
        name: "沖縄ビジネス外語学院 (Okinawa Business & Foreign Languages)",
        city: "Naha",
      },
      {
        name: "沖縄調理師専門学校 (Okinawa Culinary Arts College)",
        city: "Ginowan",
      },
      {
        name: "沖縄リハビリテーション福祉学院 (Okinawa Rehabilitation & Welfare)",
        city: "Tomigusuku",
      },
      {
        name: "インターナショナルデザインアカデミー (International Design Academy)",
        city: "Naha",
      },
      {
        name: "琉球リハビリテーション学院 (Ryukyu Rehabilitation Academy)",
        city: "Okinawa City",
      },
      {
        name: "沖縄こども専門学校 (Okinawa Child Education College)",
        city: "Naha",
      },
    ],
  },
};

function SchoolPageContent() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<
    (typeof ALL_PREFECTURES)[number] | null
  >(null);
  const [prefQuery, setPrefQuery] = useState("");

  const filteredPrefectures = useMemo<
    (typeof ALL_PREFECTURES)[number][]
  >(() => {
    const q = prefQuery.trim().toLowerCase();
    if (!q) return [] as (typeof ALL_PREFECTURES)[number][];
    return ALL_PREFECTURES.filter((p) =>
      p.toLowerCase().includes(q)
    ) as (typeof ALL_PREFECTURES)[number][];
  }, [prefQuery]);

  const data = useMemo<PrefectureData>(() => {
    const base: PrefectureData = { languageSchools: [], senmonSchools: [] };
    return (selected && SCHOOLS[selected]) || base;
  }, [selected]);

  // Preselect via query param (?pref=Tokyo)
  useEffect(() => {
    const pref = searchParams.get("pref");
    if (!pref) return;
    const match = ALL_PREFECTURES.find(
      (p) => p.toLowerCase() === pref.toLowerCase()
    );
    if (match) setSelected(match);
  }, [searchParams]);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>
        <h1 className={styles.title}>🗾 JAPAN SCHOOLS</h1>
        <p className={styles.subtitle}>Search Prefecture</p>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            value={prefQuery}
            onChange={(e) => setPrefQuery(e.target.value)}
            className={styles.searchInput}
            placeholder="Enter prefecture name..."
            aria-label="Search prefecture"
          />
        </div>
      </div>

      <div className={styles.divider}>
        <span className={styles.dividerText}>All 47 Prefectures (Grid)</span>
      </div>

      <section className={styles.prefGrid} aria-label="Prefectures">
        {filteredPrefectures.length > 0 ? (
          filteredPrefectures.map((p) => (
            <button
              key={p}
              type="button"
              className={`${styles.pref} ${
                selected === p ? styles.prefActive : ""
              }`}
              onClick={() => setSelected(p)}
              aria-pressed={selected === p}
            >
              {p}
            </button>
          ))
        ) : (
          <p className={styles.emptyState}>
            {prefQuery.trim()
              ? "No prefectures found. Try another name."
              : "Start typing to search prefectures."}
          </p>
        )}
      </section>

      <section className={styles.details}>
        <div className={styles.detailsHeader}>
          <h2 className={styles.detailsTitle}>
            {selected || "Select Prefecture"}
          </h2>
          {selected && (
            <span className={styles.counts}>
              {(SCHOOLS[selected]?.languageSchools?.length || 0) +
                (SCHOOLS[selected]?.senmonSchools?.length || 0)}
              &nbsp;schools listed
            </span>
          )}
        </div>

        {selected && (
          <div className={styles.schoolCols}>
            <div className={styles.col}>
              <h3 className={styles.colTitle}>Japanese Language Schools</h3>
              {data.languageSchools.length ? (
                <ul className={styles.list}>
                  {data.languageSchools.map((s, i) => (
                    <li key={`lang-${i}`} className={styles.item}>
                      <span className={styles.schoolName}>{s.name}</span>
                      {s.city && <span className={styles.dot}>•</span>}
                      {s.city && <span className={styles.city}>{s.city}</span>}
                      {s.website && (
                        <a
                          href={s.website}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.link}
                        >
                          Website ↗
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.empty}>No language schools added yet.</p>
              )}
            </div>

            <div className={styles.col}>
              <h3 className={styles.colTitle}>Senmon (Vocational) Schools</h3>
              {data.senmonSchools.length ? (
                <ul className={styles.list}>
                  {data.senmonSchools.map((s, i) => (
                    <li key={`voc-${i}`} className={styles.item}>
                      <span className={styles.schoolName}>{s.name}</span>
                      {s.city && <span className={styles.dot}>•</span>}
                      {s.city && <span className={styles.city}>{s.city}</span>}
                      {s.website && (
                        <a
                          href={s.website}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.link}
                        >
                          Website ↗
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.empty}>No vocational schools added yet.</p>
              )}
            </div>
          </div>
        )}
      </section>

      <section className={styles.note}>
        <p>
          Tip: If your prefecture doesn&apos;t list a school yet, contact
          support and we&apos;ll add it quickly.
        </p>
      </section>
    </main>
  );
}

export default function SchoolPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
      }
    >
      <SchoolPageContent />
    </Suspense>
  );
}

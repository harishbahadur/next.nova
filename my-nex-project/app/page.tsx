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
  const [language, setLanguage] = useState("en");

  // Translation dictionary
  const t = useMemo(() => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        brandName: "Next Nova 🚀",
        search: "Search",
        close: "Close",
        home: "Home",
        aboutJapan: "About Japan",
        aboutStudents: "About Students",
        school: "School",
        support: "Support",
        searchPlaceholder:
          "Search: Okinawa, Language school, Ceremony, Housing, Tokyo...",
        welcomeTo: "Welcome to",
        welcomeSubtitle: "Begin Student life and Support!",
        getStarted: "Get Started",
        hideOptions: "Hide Options",
        explorePrograms: "Explore Programs",
        exploreProgramsDesc:
          "Discover various universities and courses in Japan.",
        requirements: "Requirements",
        requirementsDesc: "Learn what documents and qualifications you need.",
        application: "Application",
        applicationDesc: "Follow step-by-step instructions to apply easily.",
        scholarships: "Scholarships",
        scholarshipsDesc: "Find financial support options for your studies.",
        visaInfo: "Visa Information",
        visaInfoDesc:
          "Get details about student visa application process and requirements.",
        documents: "Documents",
        documentsDesc: "We will help you prepare all necessary documents.",
        helpFormTitle: "📄 Student Help Request Form",
        helpFormSubtitle: "Fill out this form for guidance & support",
        fullName: "Full Name",
        emailAddress: "Email Address",
        phoneNumber: "Phone Number",
        studentId: "Student ID (optional)",
        schoolName: "School Name (optional)",
        typeOfHelp: "Type of Help Needed (Select one or more)",
        housing: "Housing / Hostel Guidance",
        apartmentHelp: "Apartment Help",
        partTimeJob: "Part-Time Job Advice",
        documentsProcessing: "Documents Processing Guidance",
        languageSupport: "Language Support",
        messageDetails: "Message / Details",
        preferredContact: "Preferred Contact Method",
        email: "Email",
        phoneWhatsApp: "Phone / WhatsApp / LINE",
        inPerson: "In-person (if applicable)",
        submit: "SUBMIT REQUEST",
        submitting: "Submitting...",
        noResults: "No results. Try a different term.",
        schoolsIn: "Schools in",
      },
      np: {
        brandName: "नेक्स्ट नोवा 🚀",
        search: "खोज्नुहोस्",
        close: "बन्द गर्नुहोस्",
        home: "होम",
        aboutJapan: "जापानको बारेमा",
        aboutStudents: "विद्यार्थीको बारेमा",
        school: "स्कूल",
        support: "सहयोग",
        searchPlaceholder:
          "खोज्नुहोस्: ओकिनावा, भाषा स्कूल, समारोह, आवास, टोकियो...",
        welcomeTo: "स्वागत छ",
        welcomeSubtitle: "विद्यार्थी जीवन र सहयोग सुरु गर्नुहोस्!",
        getStarted: "सुरु गर्नुहोस्",
        hideOptions: "विकल्प लुकाउनुहोस्",
        explorePrograms: "कार्यक्रमहरू अन्वेषण गर्नुहोस्",
        exploreProgramsDesc:
          "जापानमा विभिन्न विश्वविद्यालय र पाठ्यक्रमहरू पत्ता लगाउनुहोस्।",
        requirements: "आवश्यकताहरू",
        requirementsDesc: "तपाईंलाई कुन कागजात र योग्यता चाहिन्छ जान्नुहोस्।",
        application: "आवेदन",
        applicationDesc:
          "सजिलै आवेदन गर्न चरण-दर-चरण निर्देशनहरू पालना गर्नुहोस्।",
        scholarships: "छात्रवृत्ति",
        scholarshipsDesc:
          "आफ्नो अध्ययनको लागि आर्थिक सहयोग विकल्पहरू फेला पार्नुहोस्।",
        visaInfo: "भिसा जानकारी",
        visaInfoDesc:
          "विद्यार्थी भिसा आवेदन प्रक्रिया र आवश्यकताहरू बारे विवरण प्राप्त गर्नुहोस्।",
        documents: "कागजातहरू",
        documentsDesc:
          "हामी तपाईंलाई सबै आवश्यक कागजातहरू तयार गर्न मद्दत गर्नेछौं।",
        helpFormTitle: "📄 विद्यार्थी सहायता अनुरोध फारम",
        helpFormSubtitle: "मार्गदर्शन र सहयोगको लागि यो फारम भर्नुहोस्",
        fullName: "पूरा नाम",
        emailAddress: "इमेल ठेगाना",
        phoneNumber: "फोन नम्बर",
        studentId: "विद्यार्थी आईडी (वैकल्पिक)",
        schoolName: "स्कूलको नाम (वैकल्पिक)",
        typeOfHelp: "आवश्यक सहायताको प्रकार (एक वा बढी छान्नुहोस्)",
        housing: "आवास / होस्टेल मार्गदर्शन",
        apartmentHelp: "अपार्टमेन्ट सहायता",
        partTimeJob: "अंशकालिक काम सल्लाह",
        documentsProcessing: "कागजात प्रशोधन मार्गदर्शन",
        languageSupport: "भाषा सहयोग",
        messageDetails: "सन्देश / विवरण",
        preferredContact: "मनपर्ने सम्पर्क विधि",
        email: "इमेल",
        phoneWhatsApp: "फोन / WhatsApp / LINE",
        inPerson: "व्यक्तिगत रूपमा (यदि लागू हुन्छ)",
        submit: "अनुरोध पेश गर्नुहोस्",
        submitting: "पेश गर्दै...",
        noResults: "कुनै परिणाम छैन। अर्को शब्द प्रयास गर्नुहोस्।",
        schoolsIn: "स्कूलहरू",
      },
      ja: {
        brandName: "ネクスト・ノヴァ 🚀",
        search: "検索",
        close: "閉じる",
        home: "ホーム",
        aboutJapan: "日本について",
        aboutStudents: "学生について",
        school: "学校",
        support: "サポート",
        searchPlaceholder: "検索：沖縄、語学学校、式典、住宅、東京...",
        welcomeTo: "ようこそ",
        welcomeSubtitle: "学生生活とサポートを始めましょう！",
        getStarted: "始める",
        hideOptions: "オプションを非表示",
        explorePrograms: "プログラムを探す",
        exploreProgramsDesc: "日本の様々な大学やコースを発見しましょう。",
        requirements: "必要条件",
        requirementsDesc: "必要な書類と資格について学びましょう。",
        application: "申請",
        applicationDesc: "簡単に申請するための手順に従ってください。",
        scholarships: "奨学金",
        scholarshipsDesc: "勉強のための経済的支援オプションを見つけましょう。",
        visaInfo: "ビザ情報",
        visaInfoDesc: "学生ビザ申請プロセスと要件の詳細を取得します。",
        documents: "書類",
        documentsDesc: "必要な書類の準備をお手伝いします。",
        helpFormTitle: "📄 学生支援リクエストフォーム",
        helpFormSubtitle:
          "ガイダンスとサポートのためにこのフォームに記入してください",
        fullName: "氏名",
        emailAddress: "メールアドレス",
        phoneNumber: "電話番号",
        studentId: "学生ID（任意）",
        schoolName: "学校名（任意）",
        typeOfHelp: "必要なサポートの種類（1つ以上選択）",
        housing: "住宅 / 寮のガイダンス",
        apartmentHelp: "アパートのヘルプ",
        partTimeJob: "アルバイトのアドバイス",
        documentsProcessing: "書類処理のガイダンス",
        languageSupport: "言語サポート",
        messageDetails: "メッセージ / 詳細",
        preferredContact: "希望する連絡方法",
        email: "メール",
        phoneWhatsApp: "電話 / WhatsApp / LINE",
        inPerson: "対面（該当する場合）",
        submit: "リクエストを送信",
        submitting: "送信中...",
        noResults: "結果がありません。別の用語を試してください。",
        schoolsIn: "の学校",
      },
    };
    return (key: string) =>
      translations[language]?.[key] || translations.en[key] || key;
  }, [language]);

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
        title:
          language === "ja"
            ? `${p}${t("schoolsIn")}`
            : language === "np"
            ? `${p} ${t("schoolsIn")}`
            : `${t("schoolsIn")} ${p}`,
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
  }, [PREFECTURES, SITE_INDEX, language, t]);

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
        <div className={styles.logo}>{t("brandName")}</div>
        <nav className={styles.nav}>
          <div className={styles.langSelector}>
            <button
              onClick={() => setLanguage("en")}
              className={`${styles.langBtn} ${
                language === "en" ? styles.langActive : ""
              }`}
              title="English"
            >
              🇬🇧 EN
            </button>
            <button
              onClick={() => setLanguage("np")}
              className={`${styles.langBtn} ${
                language === "np" ? styles.langActive : ""
              }`}
              title="Nepali"
            >
              🇳🇵 NP
            </button>
            <button
              onClick={() => setLanguage("ja")}
              className={`${styles.langBtn} ${
                language === "ja" ? styles.langActive : ""
              }`}
              title="Japanese"
            >
              🇯🇵 JP
            </button>
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={styles.searchButton}
          >
            {showSearch ? t("close") : t("search")}
          </button>
        </nav>
      </header>

      {/* 🧭 Navigation Line (client-side routes) */}
      <nav className={styles.navLine}>
        <Link href="/" className={styles.navButton}>
          {t("home")}
        </Link>
        <Link href="/about-japan" className={styles.navButton}>
          {t("aboutJapan")}
        </Link>
        <Link href="/about-students" className={styles.navButton}>
          {t("aboutStudents")}
        </Link>
        <Link href="/school" className={styles.navButton}>
          {t("school")}
        </Link>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => setShowHelpModal(true)}
        >
          {t("support")}
        </button>
      </nav>

      {/* 🔍 Search bar */}
      {showSearch && (
        <div className={styles.searchWrapper}>
          <form onSubmit={handleSearch} className={styles.searchBar}>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
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
              {t("search")}
            </button>
          </form>

          {query.trim().length >= 2 && (
            <div className={styles.searchPanel} role="listbox">
              {results.length === 0 && (
                <div className={styles.searchEmpty}>{t("noResults")}</div>
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
            {t("welcomeTo")} <span>Next Nova</span>
          </h1>
          <p>{t("welcomeSubtitle")}</p>
          <button
            className={styles.button}
            onClick={() => setShowGetStarted(!showGetStarted)}
          >
            {showGetStarted ? t("hideOptions") : t("getStarted")}
          </button>
        </div>
      </section>

      {/* 🚀 Get Started Grid Section */}
      {showGetStarted && (
        <section className={styles.getStartedSection}>
          <div className={styles.boxGrid}>
            <Link href="/translate" className={styles.infoBox}>
              <h3>Text Translate (JP↔EN)</h3>
              <p>Translate Japanese and English instantly.</p>
            </Link>
            <Link href="/requirements" className={styles.infoBox}>
              <h3>{t("requirements")}</h3>
              <p>{t("requirementsDesc")}</p>
            </Link>
            <Link href="/application" className={styles.infoBox}>
              <h3>{t("application")}</h3>
              <p>{t("applicationDesc")}</p>
            </Link>
            <Link href="/scholarships" className={styles.infoBox}>
              <h3>{t("scholarships")}</h3>
              <p>{t("scholarshipsDesc")}</p>
            </Link>
            <Link href="/visa" className={styles.infoBox}>
              <h3>{t("visaInfo")}</h3>
              <p>{t("visaInfoDesc")}</p>
            </Link>
            <Link href="/documents" className={styles.infoBox}>
              <h3>{t("documents")}</h3>
              <p>{t("documentsDesc")}</p>
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
            <h2>{t("helpFormTitle")}</h2>
            <p>{t("helpFormSubtitle")}</p>
            <form onSubmit={handleSubmit} className={styles.supportForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>{t("fullName")}</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("fullName")}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t("emailAddress")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t("phoneNumber")}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +81 80-1234-5678"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t("studentId")}</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder={t("studentId")}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t("schoolName")}</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder={t("schoolName")}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t("typeOfHelp")}</label>
                <div className={styles.checkboxGroup}>
                  {[
                    { key: "housing", label: t("housing") },
                    { key: "apartmentHelp", label: t("apartmentHelp") },
                    { key: "partTimeJob", label: t("partTimeJob") },
                    {
                      key: "documentsProcessing",
                      label: t("documentsProcessing"),
                    },
                    { key: "languageSupport", label: t("languageSupport") },
                  ].map((opt) => (
                    <label key={opt.key} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={helpTypes.includes(opt.label)}
                        onChange={() =>
                          toggleCheckbox(opt.label, helpTypes, setHelpTypes)
                        }
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t("messageDetails")}</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("messageDetails")}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("preferredContact")}</label>
                <div className={styles.checkboxGroup}>
                  {[
                    { key: "email", label: t("email") },
                    { key: "phoneWhatsApp", label: t("phoneWhatsApp") },
                    { key: "inPerson", label: t("inPerson") },
                  ].map((opt) => (
                    <label key={opt.key} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={contactMethods.includes(opt.label)}
                        onChange={() =>
                          toggleCheckbox(
                            opt.label,
                            contactMethods,
                            setContactMethods
                          )
                        }
                      />
                      <span>{opt.label}</span>
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
                {submitting ? t("submitting") : t("submit")}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

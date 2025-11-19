"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.css";

export default function StudentLifePage() {
  const [activeTab, setActiveTab] = useState("entrance");
  const [currentSlide, setCurrentSlide] = useState(0);

  const galleries = {
    entrance: [
      {
        src: "/images/backgrounds/Students.JPG",
        alt: "School Ceremony - Students Gathering",
      },
      {
        src: "/images/backgrounds/Students.JPG",
        alt: "Entrance Ceremony Event",
      },
      { src: "/images/backgrounds/Students.JPG", alt: "Welcome Ceremony 2024" },
      {
        src: "/images/backgrounds/Students.JPG",
        alt: "New Students Introduction",
      },
    ],
    tours: [
      { src: "/images/campus-tour-1.jpg", alt: "Campus Tour" },
      { src: "/images/city-tour-1.jpg", alt: "City Tour" },
      { src: "/images/cultural-tour-1.jpg", alt: "Cultural Tour" },
      { src: "/images/museum-tour-1.jpg", alt: "Museum Visit" },
    ],
    farewell: [
      { src: "/images/farewell-party-1.jpg", alt: "Farewell Party" },
      { src: "/images/graduation-1.jpg", alt: "Graduation Ceremony" },
      { src: "/images/farewell-party-2.jpg", alt: "Farewell Celebration" },
      { src: "/images/group-photo-1.jpg", alt: "Group Photo" },
    ],
  };

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <Link href="/about-students" className={styles.backLink}>
          ← Back to About Students
        </Link>

        <h1 className={styles.title}>Student Life Gallery</h1>
        <p className={styles.paragraph}>
          Explore memorable moments from our student community - from welcoming
          new students to celebrating graduations and everything in between.
        </p>

        {/* Navigation Tabs */}
        <div className={styles.tabNav}>
          <button
            className={`${styles.tab} ${
              activeTab === "entrance" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("entrance")}
          >
            🎓 Entrance Ceremony
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "tours" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("tours")}
          >
            🗺️ Tours & Events
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "farewell" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("farewell")}
          >
            👋 Farewell Programs
          </button>
        </div>

        {/* Photo Gallery */}
        {false && (
          <div className={styles.housingGuide}>
            <h2 className={styles.sectionTitle}>Finding Your Home in Japan</h2>

            <div className={styles.guideGrid}>
              {/* How to Find Apartment */}
              <div className={styles.guideCard}>
                <h3>🔍 How to Find an Apartment</h3>
                <ul>
                  <li>Check university housing office</li>
                  <li>Use real estate websites (Suumo, Homes.co.jp)</li>
                  <li>Ask senior students for recommendations</li>
                  <li>Visit local real estate agencies near campus</li>
                  <li>Check university bulletin boards</li>
                </ul>
              </div>

              {/* Monthly Costs */}
              <div className={styles.guideCard}>
                <h3>💰 Average Monthly Costs</h3>
                <div className={styles.costTable}>
                  <div className={styles.costRow}>
                    <span>Hostel/Dormitory:</span>
                    <strong>¥30,000 - ¥50,000</strong>
                  </div>
                  <div className={styles.costRow}>
                    <span>Share House:</span>
                    <strong>¥40,000 - ¥60,000</strong>
                  </div>
                  <div className={styles.costRow}>
                    <span>1-Room Apartment:</span>
                    <strong>¥50,000 - ¥80,000</strong>
                  </div>
                  <div className={styles.costRow}>
                    <span>Utilities (avg):</span>
                    <strong>¥8,000 - ¥12,000</strong>
                  </div>
                </div>
              </div>

              {/* Hostel vs Apartment */}
              <div className={styles.guideCard}>
                <h3>🏘️ Hostel vs Apartment</h3>
                <div className={styles.comparison}>
                  <div className={styles.option}>
                    <h4>🏨 Hostel/Dormitory</h4>
                    <p className={styles.pros}>✅ Cheaper</p>
                    <p className={styles.pros}>✅ Utilities included</p>
                    <p className={styles.pros}>✅ Meet other students</p>
                    <p className={styles.cons}>❌ Shared facilities</p>
                    <p className={styles.cons}>❌ Less privacy</p>
                  </div>
                  <div className={styles.option}>
                    <h4>🏢 Apartment</h4>
                    <p className={styles.pros}>✅ More privacy</p>
                    <p className={styles.pros}>✅ Your own space</p>
                    <p className={styles.pros}>✅ More freedom</p>
                    <p className={styles.cons}>❌ More expensive</p>
                    <p className={styles.cons}>❌ Initial costs high</p>
                  </div>
                </div>
              </div>

              {/* Best Option */}
              <div className={styles.guideCard}>
                <h3>⭐ Which is Best?</h3>
                <div className={styles.recommendation}>
                  <p>
                    <strong>For First Year Students:</strong>
                  </p>
                  <p>
                    🏨 <strong>Hostel/Dormitory</strong> is recommended
                  </p>
                  <ul>
                    <li>Lower initial costs</li>
                    <li>Easy to make friends</li>
                    <li>Close to campus</li>
                    <li>No furniture needed</li>
                  </ul>
                  <p>
                    <strong>After First Year:</strong>
                  </p>
                  <p>
                    🏢 Consider moving to an <strong>Apartment</strong>
                  </p>
                  <ul>
                    <li>Once you know the area</li>
                    <li>When you want more independence</li>
                    <li>If you have part-time job income</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Entrance Ceremony Carousel */}
        {activeTab === "entrance" && (
          <div className={styles.entranceCarousel}>
            <div className={styles.carouselHeader}>
              <h2>📸 SCHOOL CEREMONY GALLERY</h2>
              <p>Entrance Ceremony • Event Moments</p>
            </div>

            <div className={styles.carouselMain}>
              <button
                type="button"
                className={`${styles.navArrow} ${styles.navArrowLeft}`}
                aria-label="Previous photo"
                onClick={() =>
                  setCurrentSlide(
                    (s) =>
                      (s - 1 + galleries.entrance.length) %
                      galleries.entrance.length
                  )
                }
              >
                ◀︎
              </button>

              <div className={styles.mainImageWrapper}>
                <Image
                  src={galleries.entrance[currentSlide].src}
                  alt={galleries.entrance[currentSlide].alt}
                  fill
                  priority
                  sizes="100vw"
                  className={styles.mainImage}
                />
                <div className={styles.mainImageOverlayCaption}>
                  “{galleries.entrance[currentSlide].alt}”
                </div>
              </div>

              <button
                type="button"
                className={`${styles.navArrow} ${styles.navArrowRight}`}
                aria-label="Next photo"
                onClick={() =>
                  setCurrentSlide((s) => (s + 1) % galleries.entrance.length)
                }
              >
                ▶︎
              </button>
            </div>

            <p className={styles.mainCaption}>
              Caption: {galleries.entrance[currentSlide].alt}
            </p>

            <div className={styles.thumbsRow}>
              {galleries.entrance.map((photo, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.thumb} ${
                    index === currentSlide ? styles.thumbActive : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Show ${photo.alt}`}
                >
                  <div className={styles.thumbImageWrapper}>
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="120px"
                      className={styles.thumbImage}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tours Gallery */}
        {activeTab === "tours" && (
          <div className={styles.gallery}>
            {galleries.tours.map((photo, index) => (
              <div key={index} className={styles.photoCard}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.galleryImage}
                  />
                </div>
                <p className={styles.photoCaption}>{photo.alt}</p>
              </div>
            ))}
          </div>
        )}

        {/* Farewell Gallery */}
        {activeTab === "farewell" && (
          <div className={styles.gallery}>
            {galleries.farewell.map((photo, index) => (
              <div key={index} className={styles.photoCard}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.galleryImage}
                  />
                </div>
                <p className={styles.photoCaption}>{photo.alt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

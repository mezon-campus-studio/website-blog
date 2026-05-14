import styles from "./Footer.module.css";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* TOP SECTION */}
      <div className={styles.top}>
        {/* COLUMN 1 - BRAND */}
        <div className={styles.brand}>
          <h2 className={styles.logo}>Memorizz</h2>

          <p className={styles.description}>
            A high-end gallery for technical knowledge. We believe in quality
            over quantity, clarity over complexity, and the beauty of
            well-structured code.
          </p>

          <div className={styles.socials}>
            <a href="#" className={styles.iconButton} aria-label="GitHub">
              {/* GitHub SVG */}
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path
                  d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.66-.22.66-.48 0-.24-.01-1.04-.02-1.89-2.78.62-3.37-1.2-3.37-1.2-.45-1.2-1.1-1.52-1.1-1.52-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.9.85.09-.67.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.02-2.75-.1-.26-.44-1.32.1-2.76 0 0 .84-.27 2.75 1.05a9.2 9.2 0 012.5-.35c.85 0 1.7.12 2.5.35 1.9-1.32 2.74-1.05 2.74-1.05.54 1.44.2 2.5.1 2.76.64.72 1.02 1.63 1.02 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.95.68 1.92 0 1.38-.01 2.5-.01 2.84 0 .27.16.59.67.48A10.04 10.04 0 0022 12.26C22 6.58 17.52 2 12 2z"
                  fill="currentColor"
                />
              </svg>
            </a>

            <a href="#" className={styles.iconButton} aria-label="Twitter">
              {/* Twitter (X-style simplified) */}
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path
                  d="M4 4l16 16M20 4L4 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </a>

            <a href="#" className={styles.iconButton} aria-label="LinkedIn">
              {/* LinkedIn SVG */}
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path
                  d="M4.98 3.5a2.5 2.5 0 11-.02 5.02 2.5 2.5 0 01.02-5.02zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21h-4z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className={styles.column}>
          <h3 className={styles.heading}>RESOURCES</h3>
          <ul className={styles.list}>
            <li><Link href="#">Style Guide</Link></li>
            <li><Link href="#">Component Library</Link></li>
            <li><Link href="#">Open Source</Link></li>
            <li><Link href="#">Guest Authors</Link></li>
          </ul>
        </div>

        {/* COLUMN 3 */}
        <div className={styles.column}>
          <h3 className={styles.heading}>LEGAL</h3>
          <ul className={styles.list}>
            <li><Link href="#">Privacy Policy</Link></li>
            <li><Link href="#">Terms of Service</Link></li>
            <li><Link href="#">Cookie Policy</Link></li>
            <li><Link href="#">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>
          © 2026 Memorizz. All rights reserved.
        </p>

        <div className={styles.status}>
          <span className={styles.dot}></span>
          <span className={styles.statusText}>
            SYSTEMS OPERATIONAL
          </span>
        </div>
      </div>
    </footer>
  );
};
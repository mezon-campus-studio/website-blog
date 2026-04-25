"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import { Button } from "@/components/ui/Button/Button";
import { SearchInput } from "@/components/ui/Input/SearchInput";
import { useDarkMode } from "@/hooks/useDarkMode";

export const Navbar = () => {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* LEFT */}
        <div className={styles.left}>
          <div className={styles.logo}>The Curator</div>

          <div className={styles.links}>
            <Link href="/" className={`${styles.link} ${styles.active}`}>
              Home
            </Link>
            <Link href="/categories" className={styles.link}>
              Categories
            </Link>
            <Link href="/about" className={styles.link}>
              About
            </Link>
          </div>
        </div>

        {/* CENTER */}
        <div className={styles.center}>
          <SearchInput />
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <button
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className={styles.themeToggle}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <Button variant="outline">Sign in</Button>
          <Button variant="solid">Sign up</Button>
        </div>
      </nav>
    </header>
  );
};
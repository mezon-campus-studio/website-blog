"use client";
import React from 'react';

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { Button, SearchInput } from "@/components/ui";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useAuth, useLogout } from "@/features/auth/hooks";
import { LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import RoleGate from "@/components/auth/RoleGate";

export const Navbar = () => {
  const { theme, toggleTheme } = useDarkMode();
  const pathname = usePathname();
  const { user } = useAuth();
  const { mutate: logout } = useLogout();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* LEFT */}
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            Memorizz
          </Link>

          <div className={styles.links}>
            <Link
              href="/"
              className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
            >
              Home
            </Link>

            <Link
              href="#"
              prefetch={false}
              className={`${styles.link} ${pathname === "/about" ? styles.active : ""}`}
            >
              About
            </Link>
            {user && (
              <>
                <Link
                  href="/categories"
                  prefetch={false}
                  className={`${styles.link} ${pathname === "/categories" ? styles.active : ""}`}
                >
                  Categories
                </Link>
                <Link
                  href="/tag"
                  prefetch={false}
                  className={`${styles.link} ${pathname === "/tag" ? styles.active : ""}`}
                >
                  Tags
                </Link>
                <Link
                  href="/posts/manage"
                  className={`${styles.link} ${pathname === "/posts/manage" ? styles.active : ""}`}
                >
                  My Stories
                </Link>
                <Link
                  href="/profile/my-reports"
                  className={`${styles.link} ${pathname === "/profile/my-reports" ? styles.active : ""}`}
                >
                  My Reports
                </Link>
              </>
            )}
            <RoleGate allowedRoles={['ADMIN']}>
              <Link
                href="/dashboard"
                className={`${styles.link} ${pathname === "/dashboard" ? styles.active : ""}`}
              >
                <LayoutDashboard size={14} className="inline mr-1" />
                Dashboard
              </Link>
            </RoleGate>
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

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <UserIcon size={18} />
                <span>{user.name}</span>
              </Link>
              <button
                onClick={() => logout()}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="outline">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
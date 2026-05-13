"use client";

import styles from "./Newsletter.module.css";
import { Button, Input } from "@/components/ui";

export const Newsletter = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* LEFT COLUMN */}
        <div className={styles.content}>
          <h2 className={styles.title}>
            Join the Inner Circle of Memorizz.
          </h2>

          <p className={styles.description}>
            Bi-weekly technical narratives, design deep-dives, and exclusive
            resources delivered directly to your inbox.
          </p>

          <div className={styles.inputGroup}>
            <Input
              type="email"
              placeholder="hello@memorizz.com"
              className={styles.input}
              fullWidth
            />
            <Button variant="primary">Subscribe</Button>
          </div>

          <p className={styles.note}>
            No spam, just signal. Unsubscribe anytime.
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.visual}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>✉️</span>
              <span className={styles.cardTitle}>
                Weekly Digest #42
              </span>
            </div>

            <div className={styles.skeleton}></div>
            <div className={styles.skeleton}></div>
            <div className={styles.skeletonShort}></div>
          </div>
        </div>
      </div>
    </section>
  );
};
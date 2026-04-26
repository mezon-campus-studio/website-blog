import styles from "./HeroSection.module.css";
import Image from "next/image";
import { Button } from "@/components/ui";

export const HeroSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* LEFT COLUMN */}
        <div className={styles.content}>
          {/* Meta */}
          <div className={styles.meta}>
            <span className={styles.badge}>FEATURED INSIGHT</span>
            <span className={styles.date}>March 24, 2024</span>
          </div>

          {/* Title */}
          <h1 className={styles.title}>
            The Architect of Digital Serenity: A Guide to Minimalism.
          </h1>

          {/* Excerpt */}
          <p className={styles.excerpt}>
            Exploring how intentional whitespace and structural hierarchy can
            transform complex technical documentation into an effortless reading
            journey for developers and designers alike.
          </p>

          {/* Author */}
          <div className={styles.author}>
            <Image
              src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
              alt="Author avatar"
              width={48}
              height={48}
              style={{ height: 'auto' }}
              className={styles.avatar}
            />
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>Julian Sterling</span>
              <span className={styles.authorRole}>
                Lead Design Systems Architect
              </span>
            </div>
          </div>

          {/* Action */}
          <div className={styles.action}>
            <Button variant="primary">Read Full Article →</Button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.imageWrapper}>
          <Image
            src="https://images.unsplash.com/photo-1492724441997-5dc865305da7"
            alt="Featured article visual"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            priority
          />
        </div>
      </div>
    </section>
  );
};
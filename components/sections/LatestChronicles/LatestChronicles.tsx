import styles from "./LatestChronicles.module.css";
import { ArticleCard, Article } from "@/components/cards/ArticleCard/ArticleCard";
import { Button } from "@/components/ui";

const articles: Article[] = [
  {
    id: "1",
    title: "Revisiting Retro Interfaces in Modern UI Design",
    excerpt:
      "A deep dive into how nostalgic design patterns are making a comeback in modern web interfaces and why they resonate with users.",
    category: "RETRO TECH",
    readTime: "8 min read",
    date: "2024-03-21",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
  },
  {
    id: "2",
    title: "The Blueprint of Scalable Frontend Architecture",
    excerpt:
      "Understanding modular design systems and how to build frontend applications that scale effortlessly across teams.",
    category: "ARCHITECTURE",
    readTime: "6 min read",
    date: "2024-03-20",
    image: "https://images.unsplash.com/photo-1484417894907-623942c8ee29",
  },
  {
    id: "3",
    title: "Design Systems That Actually Work",
    excerpt:
      "Why most design systems fail—and how to build one that developers and designers truly adopt.",
    category: "DESIGN SYSTEMS",
    readTime: "7 min read",
    date: "2024-03-18",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766",
  },
  {
    id: "4",
    title: "Mastering UX Psychology for Better Products",
    excerpt:
      "Learn how human behavior principles can drastically improve usability and engagement.",
    category: "UX PSYCHOLOGY",
    readTime: "5 min read",
    date: "2024-03-17",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    id: "5",
    title: "Next.js Performance Optimization Secrets",
    excerpt:
      "Practical strategies to boost performance in your Next.js applications.",
    category: "NEXT.JS",
    readTime: "9 min read",
    date: "2024-03-15",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  },
  {
    id: "6",
    title: "Accessibility as a Core Design Principle",
    excerpt:
      "Building inclusive products by integrating accessibility from day one.",
    category: "ACCESSIBILITY",
    readTime: "4 min read",
    date: "2024-03-14",
    image: "https://images.unsplash.com/photo-1504805572947-34fad45aed93",
  },
];

export const LatestChronicles = () => {
  return (
    <section className={styles.section}>
      {/* Header */}
      <h2 className={styles.title}>The Latest Chronicles</h2>

      {/* Grid */}
      <div className={styles.grid}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <Button variant="outline">Load More Archive Entries</Button>
      </div>
    </section>
  );
};
import Image from "next/image";
import styles from "./ArticleCard.module.css";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string; // ISO or readable string
  image: string;
}

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <article className={styles.card}>
      {/* Image */}
      <div className={styles.imageWrapper}>
        <Image
          src={article.image}
          alt={article.title}
          fill
          className={styles.image}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className={styles.badge}>{article.category}</span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Meta */}
        <div className={styles.meta}>
          <span>{article.readTime}</span>
          <span className={styles.dot}>•</span>
          <time dateTime={article.date}>{article.date}</time>
        </div>

        {/* Title */}
        <h3 className={styles.title}>{article.title}</h3>

        {/* Excerpt */}
        <p className={styles.excerpt}>{article.excerpt}</p>
      </div>
    </article>
  );
};
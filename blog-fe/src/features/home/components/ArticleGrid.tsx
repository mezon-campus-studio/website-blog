import React from 'react';
import styles from './ArticleGrid.module.css';
import { Article } from '../types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface Props {
  articles: Article[];
}

export const ArticleGrid: React.FC<Props> = ({ articles }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>The Latest Chronicles</h2>
      <div className={styles.grid}>
        {articles.map((article) => (
          <article key={article.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={article.imageUrl} alt={article.title} className={styles.image} />
              <div className={styles.badgeOverlay}>
                <Badge variant="secondary">{article.category}</Badge>
              </div>
            </div>
            
            <div className={styles.meta}>
              <span>{article.readTime}</span> • <span>{article.date}</span>
            </div>
            
            <h3 className={styles.title}>{article.title}</h3>
            <p className={styles.excerpt}>{article.excerpt}</p>
          </article>
        ))}
      </div>
      
      <div className={styles.actionCenter}>
        {/* Nút outline bo tròn theo thiết kế */}
        <Button variant="outline">Load More Archive Entries</Button>
      </div>
    </section>
  );
};
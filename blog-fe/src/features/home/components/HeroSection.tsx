import React from 'react';
import styles from './HeroSection.module.css';
import { Article } from '../types';
import { Button } from '../../../components/ui/Button';

interface Props {
  article: Article;
}

export const HeroSection: React.FC<Props> = ({ article }) => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.category}>{article.category}</span>
          <span>{article.date}</span>
        </div>
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.excerpt}>{article.excerpt}</p>
        
        {article.author && (
          <div className={styles.author}>
            <img src={article.author.avatar} alt="Author" className={styles.avatar} />
            <div>
              <span className={styles.authorName}>{article.author.name}</span>
              <span className={styles.authorRole}>{article.author.role}</span>
            </div>
          </div>
        )}

        <Button variant="primary">Read Full Article →</Button>
      </div>
      <div className={styles.imageWrapper}>
        <img src={article.imageUrl} alt={article.title} className={styles.heroImage} />
      </div>
    </section>
  );
};
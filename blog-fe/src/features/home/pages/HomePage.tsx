import React from 'react';
import styles from './HomePage.module.css';

import { useHomeData } from '../api/useHomeData';
import { HeroSection } from '../components/HeroSection';
import { CategorySection } from '../components/CategorySection';
import { ArticleGrid } from '../components/ArticleGrid';
import { NewsLetter } from '../components/NewsLetter';

export const HomePage: React.FC = () => {
  const { data, isLoading } = useHomeData();

  if (isLoading || !data) {
    return (
      <div className={styles.loading}>
        Loading curator insights...
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <HeroSection article={data.featuredArticle} />
      <CategorySection categories={data.categories} />
      <ArticleGrid articles={data.latestArticles} />
      <NewsLetter />
    </div>
  );
};
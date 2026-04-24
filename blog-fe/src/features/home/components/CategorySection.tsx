import React from 'react';
import styles from './CategorySection.module.css';

interface Props {
  categories: string[];
}

export const CategorySection: React.FC<Props> = ({ categories }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.header}>Curated Categories</h2>
      <div className={styles.scrollContainer}>
        {categories.map((category, index) => (
          <button 
            key={category} 
            className={`${styles.categoryBtn} ${index === 0 ? styles.active : ''}`}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
};
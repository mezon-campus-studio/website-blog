import React from 'react';
import styles from './NewsLetter.module.css';
import { Button } from '../../../components/ui/Button';

export const NewsLetter: React.FC = () => {
  return (
    <section className={styles.container}>
      <div>
        <h2 className={styles.title}>Join the Inner Circle of Curators.</h2>
        <p className={styles.description}>
          Bi-weekly technical narratives, design deep-dives, and exclusive resources delivered directly to your inbox.
        </p>
        
        <form className={styles.formGroup} onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="curator@example.com" 
            className={styles.input}
            required
          />
          <Button variant="primary" type="submit">Subscribe</Button>
        </form>
        <span className={styles.disclaimer}>No spam, just signal. Unsubscribe anytime.</span>
      </div>

      <div className={styles.illustrationWrapper}>
        <div className={styles.illustrationCard}>
          <div className={styles.mockHeader}>
            <div className={styles.mockIcon}>@</div>
            <div>
              <div className={styles.mockTitle}>Weekly Digest #42</div>
              <div className={styles.mockSub}>Sent 5 mins ago</div>
            </div>
          </div>
          <div className={styles.mockLine1}></div>
          <div className={styles.mockLine2}></div>
          <div className={styles.mockLine3}></div>
        </div>
      </div>
    </section>
  );
};
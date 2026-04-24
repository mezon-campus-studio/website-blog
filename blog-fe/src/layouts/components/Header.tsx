import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>The Curator</div>
      
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLinkActive}>Home</Link>
        <Link to="#" className={styles.navLink}>Categories</Link>
        <Link to="#" className={styles.navLink}>About</Link>
      </nav>

      <div className={styles.actions}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Search insights..." 
            className={styles.searchInput} 
          />
        </div>
        
        {/* Dark mode toggle placeholder */}
        <button className={styles.themeToggle}>🌙</button>
        
        {/* Avatar placeholder */}
        <button className={styles.avatar}>
          <img src="https://placehold.co/100x100/333/FFF" alt="User Avatar" />
        </button>
      </div>
    </header>
  );
};

export default Header;
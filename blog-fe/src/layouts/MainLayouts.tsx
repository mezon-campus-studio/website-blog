import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

export const MainLayouts: React.FC = () => {
  return (
    <div className="app-wrapper">
      <Header />
      
      {/* Main content container with constrained max-width for readability */}
      <main style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 32px' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};